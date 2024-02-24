const router = require("express").Router();
const pool = require("../db");
const confirmationUrl = require("../utils/confirmationUrl");
const sendEmail = require("../utils/sendEmail");
const auth = require("../middleware/auth");
const guest = require("../middleware/guest");
const {v4} = require("uuid");
const redis = require("../redis");
const argon2 = require("argon2");
const { body, validationResult } = require('express-validator');
const fetch = require("node-fetch");
require("dotenv").config();

//forgot password on request //add validation just for sure
router.post("/forgot-password", guest,
body("email").trim().isEmail().withMessage("Error"),
async (req, res) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        return res.status(401).json({success: false, msg: errors.array()});
    }

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

        if(user.rows.length <= 0) return res.status(401).json({success: false, msg: "Error"});

        //send email to change the password
        const token = v4();

        await redis.set(process.env.FORGOT_PASSWORD_PREFIX + token, user.rows[0].user_id, "ex", 1000 * 60 * 60 * 24 * 3);

        const url = `${process.env.APP_ORIGIN}/account/resetpassword/${token}`;

        await sendEmail(user.rows[0].user_email, "Change password", `<a href="${url}">Click here to change password</a>`);

        return res.status(200).json({success: true});
    } catch (err) {
        console.error(err.message);
        res.status(500).json({success: false, msg: "Server error"});
    }
});

//change password by reset password aka forget password
router.post("/reset-password/:token", guest, 
body("password").trim().isLength({max: 1000}).isStrongPassword().withMessage("Must be at least 8 characters long, 1 lowercase, 1 uppercase, 1 number, and 1 symbol"),
body('passwordConfirmation').custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Both passwords don't match up. Make sure both passwords match");
    }

    // Indicates the success of this synchronous custom validator
    return true;
  }),
async (req, res) => {

    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        return res.status(401).json({success: false, msg: errors.array()});
    }
    
    try {
         //check if user has done the captcha
         if(!req.body.captcha) return res.status(401).json({success: false, msg: "Please select the checkbox"});

         //check if capatcha is true
         const body = await fetch(`https://www.google.com/recaptcha/api/siteverify?secret=${process.env.CAPATCHA_SECRET_KEY}&response=${req.body.captcha}&remoteip=${req.ip}`).then(res => res.json());
 
         if (body.success !== undefined && !body.success) return res.json({ success: false, msg: 'Failed captcha verification' }); 

        //get key and check if it exists
        const key = process.env.FORGOT_PASSWORD_PREFIX + req.params.token;

        const user_id = await redis.get(key);

        if(!user_id) return res.status(400).json({success: false, msg: "Error"});

        //cehck if user exists
        const user = await pool.query("SELECT * FROM users WHERE user_id = $1", [
            user_id
        ]);

        if(user.rows.length <= 0) return res.status(400).json({success: false, msg: "Error"});

        //crypt the password and update it to the db
        const hashP = await argon2.hash(req.body.password);

        await pool.query("UPDATE users SET user_password = $1, user_updated = $2 WHERE user_id = $3", [
            hashP, "NOW()", user.rows[0].user_id
        ]);

        //delete the key
        await redis.del(key);

        return res.status(200).json({success: true});
    } catch (err) {
        console.error(err.message);
        res.status(500).json({success: false, msg: "Server error"});
    }
});

//change password while logged in aka request
router.post("/change-password", auth,
body("currentPassword").trim().isLength({min: 8, max: 1000}).withMessage("Password is incorrect"),
body("password").trim().isLength({max: 1000}).isStrongPassword().withMessage("Must be at least 8 characters long, 1 lowercase, 1 uppercase, 1 number, and 1 symbol"),
body('passwordConfirmation').custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Both passwords don't match up. Make sure both passwords match");
    }

    // Indicates the success of this synchronous custom validator
    return true;
  }),
  async (req, res) => {

    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        return res.status(401).json({success: false, msg: errors.array()});
    }
    
    try {
         //check if user has done the captcha
         if(!req.body.captcha) return res.status(401).json({success: false, msg: "Please select the checkbox"});

         //check if capatcha is true
         const body = await fetch(`https://www.google.com/recaptcha/api/siteverify?secret=${process.env.CAPATCHA_SECRET_KEY}&response=${req.body.captcha}&remoteip=${req.ip}`).then(res => res.json());
 
         if (body.success !== undefined && !body.success) return res.json({ success: false, msg: 'Failed captcha verification' }); 

        const user = await pool.query("SELECT * FROM users WHERE user_id = $1", [
            req.session.user_id
        ]);

        if(user.rows[0].length <= 0) return res.status(403).json({success: false, msg: "Error"});

        const valid = await argon2.verify(req.body.currentPassword, user.rows[0].user_password);

        if(!valid) return res.status(403).json({success: false, msg: "Password is incorrect"});

        const hashP = await argon2.hash(req.body.password);

        await pool.query("UPDATE users SET user_password = $1, user_updated = $2 WHERE user_id = $3", [
            hashP, "NOW()", user.rows[0].user_id
        ]);

        return res.status(200).json({success: true, msg: "Password has been changed"});
    } catch (err) {
        console.error(err.message);
        res.status(500).json({success: false, msg: "Server error"});
    }
  });

module.exports = router;