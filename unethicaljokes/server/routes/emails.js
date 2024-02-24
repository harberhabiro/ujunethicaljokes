const pool = require("../db");
const redis = require("../redis");
const router = require("express").Router();
const auth = require("../middleware/auth");
const sendEmail = require("../utils/sendEmail");
const { body, validationResult } = require('express-validator');
const fetch = require("node-fetch");
require("dotenv").config();

//email verification
router.post("/verify/:token", async (req, res) => {
    try {
        //check if user is logged in, if logged in, log them out so they can sign in again for verification reasons
        if(req.session.user_id) {
            res.session.destroy(err => {
                if(err) throw err;

                res.clearCookie(process.env.APP_NAME)
            })
        };
        //check if token exists aka if link is expired or not
        const key = process.env.CONFIRMATION_EMAIL_PREFIX + req.params.token;
        const user_id = await redis.get(key);

        if(!user_id) return res.status(400).json({success: false, msg: "Invalid verification"});

        //check if user exists
        const user = await pool.query("SELECT * FROM users WHERE user_id = $1", [
            user_id
        ]);

        if(user.rows.length <= 0) return res.status(400).json({success: false, msg: "Invalid verification"});

        //check if email is already verified
        if(user.rows[0].user_verified == true) {
            await redis.del(key);
            return res.status(400).json({success: false, msg: "Invalid verification"});
        }

        //update the email confirmation from false to true
        await pool.query("UPDATE users SET user_verified = $1, user_updated = $2 WHERE user_id = $3", [
            true, "Now()", user.rows[0].user_id
        ]);

        //after email has been verified, delete the key
        await redis.del(key);

        return res.status(200).json({success: true});
    } catch (err) {
        console.error(err.message);
    }
});

//email verification resend by request //test again //this is for if lockout user based on email verification status
router.post("/resend-lockout", 
body("email").trim().isEmail().withMessage("Email is incorrect or verified already"),
async (req, res) => {

    const errors = validationResult(req);

    if(!errors.isEmpty()) return res.status(401).json({success: false, msg: errors.array()});

    try {
         //check if user has done the captcha
         if(!req.body.captcha) return res.status(401).json({success: false, msg: "Please select the checkbox"});

         //check if capatcha is true
         const body = await fetch(`https://www.google.com/recaptcha/api/siteverify?secret=${process.env.CAPATCHA_SECRET_KEY}&response=${req.body.captcha}&remoteip=${req.ip}`).then(res => res.json());
 
         if (body.success !== undefined && !body.success) return res.json({ success: false, msg: 'Failed captcha verification' }); 

        //check if user exists
        const user = await pool.query("SELECT * FROM users WHERE user_email = $1", [
            req.body.email
        ]);

        if(user.rows.length <= 0) return res.status(400).json({success: false, msg: "Email is incorrect or verified already"});

        //check if email is verified/confirmed already or not
        if(user.rows[0].user_verified === true) return res.status(400).json({success: false, msg: "Email is incorrect or verified already"});

        const url = await confirmationUrl(user.rows[0].user_id);

        await sendEmail(user.rows[0].user_email, "Verify email",
        `<a href="${url}">Confirm email</a>`);

        return res.status(200).json({success: true});
    } catch (err) {
        console.error(err.message);
        res.status(500).json({success: false, msg: "Server error"})
    }
});

//email verification resend link when signed in //test
router.post("/resend-link", auth, async (req, res) => {
    try {
        //check if the user exists plus get their email
        const user = await pool.query("SELECT * FROM users WHERE user_id = $1", [
            req.session.user_id
        ]);

        if(user.rows.length <= 0) return res.status(403).json({success: false, msg: "Resend link failed"});

        //check if email is verified/confirmed already or not
        if(user.rows[0].user_verified === true) return res.status(400).json({success: false, msg: "Email is incorrect or verified already"});

        const url = await confirmationUrl(user.rows[0].user_id);

        await sendEmail(user.rows[0].user_email, "Verify email",
        `<a href="${url}">Confirm email</a>`);

        return res.status(200).json({success: true});
    } catch (err) {
        console.error(err.message);
        res.status(500).json({success: false, msg: "Server error"})
    }
});

module.exports = router;