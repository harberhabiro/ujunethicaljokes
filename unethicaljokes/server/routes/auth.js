const router = require("express").Router();
const pool = require("../db");
const argon2 = require("argon2");
const { body, validationResult } = require('express-validator');
const sendEmail = require("../utils/sendEmail");
const confirmationUrl = require("../utils/confirmationUrl");
const auth = require("../middleware/auth");
const guest = require("../middleware/guest");
const badWords = require("../middleware/badWords");
const authVerify = require("../middleware/authVerify");
const genRateLimiter = require("../middleware/genRateLimiter");
const fetch = require("node-fetch");
require("dotenv").config();

//register
router.post("/register", guest, genRateLimiter, badWords,
body("name").trim().isLength({min: 3, max: 20}).withMessage("Username must be between 3-20 chararcters long"),
body("email").trim().isEmail().withMessage("Not a valid email address"),
body("password").trim().isLength({max: 1000}).isStrongPassword().withMessage("Password must be at least 8 characters long, 1 lowercase letter, 1 uppercase letter, 1 number, and 1 symbol"),
body('passwordConfirmation').custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Both passwords don't match up. Make sure both passwords match");
    }

    // Indicates the success of this synchronous custom validator
    return true;
  }),
async (req, res) => {

    //errors from the validator
    const errors = validationResult(req);

    if(!errors.isEmpty()) return res.status(401).json({success: false, msg: errors.array()});

    try {
        //check if user has done the captcha
        // if(!req.body.captcha) return res.status(401).json({success: false, msg: "Please select the checkbox"});

        // //check if capatcha is true
        // const body = await fetch(`https://www.google.com/recaptcha/api/siteverify?secret=${process.env.CAPATCHA_SECRET_KEY}&response=${req.body.captcha}&remoteip=${req.ip}`).then(res => res.json());

        // if (body.success !== undefined && !body.success) return res.json({ success: false, msg: 'Failed captcha verification' });

        //check if user exists
        const user = await pool.query("SELECT user_email FROM users WHERE user_email = $1", [
            req.body.email
        ]);

        if(user.rows.length > 0) return res.status(401).json({success: false, msg: "Invalid register"});

        //checks if the username has been taken
        const uname = await pool.query("SELECT user_name FROM users WHERE user_name = $1", [
            req.body.name
        ]);

        if(uname.rows.length > 0) return res.status(401).json({success: false, msg: "Username has been taken"});

        //hash the password
        const hashP = await argon2.hash(req.body.password);

        //if all good, insert the user into db
        const newUser = await pool.query("INSERT INTO users (user_name, user_email, user_password) VALUES ($1, $2, $3) RETURNING *", [
            req.body.name, req.body.email, hashP
        ]);

        //authenticate the user
        req.session.user_id = newUser.rows[0].user_id;

        //validate email
        const url = await confirmationUrl(req.session.user_id);

        await sendEmail(newUser.rows[0].user_email, "Verify email",
            `<a href="${url}">Confirm email</a>`);

        //insert the log info
        await pool.query("INSERT INTO logs (user_id, user_agent, ip_address, type) VALUES ($1, $2, $3, $4)", [
            newUser.rows[0].user_id, req.headers['user-agent'], req.ip, "register"
        ]);
        
        return res.status(200).json({success: true});
    } catch (err) {
        console.error(err.message);
        res.status(500).json({success: false, msg: "Server error"});
    }
});

//login
router.post("/login",
body("email").trim().isEmail().withMessage("Email or password is incorrect"), 
body("password").trim().isLength({min: 8, max: 1000}).withMessage("Email or password is incorrect"),
async (req, res) => {
        //errors from the validator
        const errors = validationResult(req);

        if(!errors.isEmpty()) {
            return res.status(401).json({success: false, msg: errors.array()});
        }
    try {
        //check if user has done the captcha
        // if(!req.body.captcha) return res.status(401).json({success: false, msg: "Please select the checkbox"});

        // //check if capatcha is true
        // const body = await fetch(`https://www.google.com/recaptcha/api/siteverify?secret=${process.env.CAPATCHA_SECRET_KEY}&response=${req.body.captcha}&remoteip=${req.ip}`).then(res => res.json());

        // if (body.success !== undefined && !body.success) return res.json({ success: false, msg: 'Failed captcha verification' });

        //check if user doesn't exists
        const user = await pool.query("SELECT * FROM users WHERE user_email = $1", [
            req.body.email
        ]);
        
        if(user.rows.length <= 0) return res.status(401).json({success: false, msg: "Email or password is incorrect"});

        //check/verify the password
        const validP = await argon2.verify(user.rows[0].user_password, req.body.password);

        if(!validP) return res.status(401).json({success: false, msg: "Email or password is incorrect"});

        //if user hasn't verified their email after expiration
        // if(user.rows[0].user_verified == false && Date.parse(user.rows[0].user_created) + 1000 * 60 * 60 * 24 * 3 < Date.now()) res.status(401).json({success: false, msg: "Email or password is incorrect"});
        
        //authenicate the user
        req.session.user_id = user.rows[0].user_id;

        //insert the log info
        await pool.query("INSERT INTO logs (user_id, user_agent, ip_address, type) VALUES ($1, $2, $3, $4)", [
            user.rows[0].user_id, req.headers['user-agent'], req.ip, "login"
        ]);
        
        return res.status(200).json({success: true});
    } catch (err) {
        console.error(err.message);
        res.status(500).json({success: false, msg: "Server error"});
    }
});

//logout
router.post("/logout", auth, async (req, res) => {
    try {
        req.session.destroy(err => {
            if(err) throw err;

            res.clearCookie(process.env.APP_SECRET);

            res.status(200).json({success: true});
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({success: false, msg: "Server error"});
    }
});

//verify
router.post("/verify", authVerify, async (req, res) => {
    try {
        res.status(200).json({success: true});
    } catch (err) {
        console.error(err.message);
        res.status(500).json({success: false, msg: "Server error"});
    }
});

module.exports = router;