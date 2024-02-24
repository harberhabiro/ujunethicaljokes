const router = require("express").Router();
const pool = require("../../../db");
const auth = require("../../../middleware/auth");
const { body, validationResult } = require('express-validator');
const badWords = require("../../../middleware/badWords");

//follow someone
router.post("/:name", auth, async (req,res) => {
    try {
        const user = await pool.query("SELECT * FROM users WHERE user_name = $1", [
            req.params.name
        ]);

        if(user.rows[0].user_id === req.session.user_id) return res.status(400).json({success: false, msg: "Error"});

        await pool.query("INSERT INTO followers (follower_id, user_id) VALUES ($1, (SELECT user_id FROM users WHERE user_name = $2))", [
            req.session.user_id, req.params.name
        ]);     

        return res.status(200).json({success: true, msg: "Followed someone"});
    } catch (err) {
        console.error(err.message);
        res.status(500).json({success: false, msg: "Server error"});
    }
});

//unfollow someone
router.delete("/unfollow/:name", auth, async (req,res) => {
    try {
        const deleteFollow = await pool.query("DELETE FROM followers WHERE follower_id = $1 AND user_id = (SELECT user_id FROM users WHERE user_name = $2)", [
            req.session.user_id, req.params.name
        ]);

        if(deleteFollow.rows.length <= 0) return res.status(400).json({success: false, msg: "Error"});

        return res.status(200).json("Unfollowed");
    } catch (err) {
        console.error(err.message);
        res.status(500).json({success: false, msg: "Server error"});
    }
});

//see all your followers
router.get("/followers", auth, async (req,res) => {
    try {
        const followers = await pool.query("SELECT follower_id FROM followers WHERE user_id = $1", [
            req.user.id
        ]);

        return res.status(200).json(followers.rows); //need follower_id
    } catch (err) {
        console.error(err.message);
        res.status(500).json({success: false, msg: "Server error"});
    }
});

//see who are the user's followers //profile
router.get("/followers/:name", auth, async (req,res) => {
    try {
        const followers = await pool.query("SELECT follower_id FROM followers WHERE user_id = (SELECT user_id FROM users WHERE user_name = $1)", [
            req.params.name
        ]);

        return res.status(200).json(followers.rows); //need follower_id
    } catch (err) {
        console.error(err.message);
        res.status(500).json({success: false, msg: "Server error"});
    }
});

//see who you follow
router.get("/following", auth, async (req,res) => {
    try {
        const following = await pool.query("SELECT user_id FROM followers WHERE follower_id = $1", [
            req.user.id
        ]);

        return res.status(200).json(following.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({success: false, msg: "Server error"});
    }
});

//see who follow's a user //profile
router.get("/following/:name", auth, async (req,res) => {
    try {
        const following = await pool.query("SELECT user_id FROM followers WHERE follower_id = (SELECT user_id FROM users WHERE user_name = $1)", [
            req.params.name
        ]);

        return res.status(200).json(following.rows)
    } catch (err) {
        console.error(err.message);
        res.status(500).json({success: false, msg: "Server error"});
    }
});

//number of followers and following for you
router.get("/numbers", auth, async (req,res) => {
    try {
        const followerNumber = await pool.query("SELECT follower_id FROM followers WHERE user_id = $1", [
            req.user.id
        ]);

        const followingNumber = await pool.query("SELECT user_id FROM followers WHERE follower_id = $1", [
            req.user.id
        ]);

        return res.status(200).json({following: followingNumber.rows.length, followers: followerNumber.rows.length});
    } catch (err) {
        console.error(err.message);
        res.status(500).json({success: false, msg: "Server error"});
    }
});

//number of followers and following a user has //profile
router.get("/numbers/:name", auth, async (req,res) => {
    try {
        const followerNumber = await pool.query("SELECT follower_id FROM followers WHERE user_id = (SELECT user_id FROM users WHERE user_name = $1)", [
            req.params.name
        ]);

        const followingNumber = await pool.query("SELECT user_id FROM followers WHERE follower_id = (SELECT user_id FROM users WHERE user_name = $1)", [
            req.params.name
        ]);

        return res.status(200).json({following: followingNumber.rows.length, followers: followerNumber.rows.length});   
    } catch (err) {
        console.error(err.message);
        res.status(500).json({success: false, msg: "Server error"}); 
    }
});

module.exports = router;