const router = require("express").Router();
const pool = require("../../../db");
const auth = require("../../../middleware/auth");
const { body, validationResult } = require('express-validator');
const badWords = require("../../../middleware/badWords");

//create a post
router.post("/post", auth, badWords,
body("description").trim().isLength({min: 1, max: 1000}).withMessage("To upload a post, a post must not be empty or over 1000 characters"),
async (req, res) => {
    //errors from the validator
    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        return res.status(401).json({success: false, msg: errors.array()});
    }

    try {
        const createPost = await pool.query("INSERT INTO posts (user_id, description, category) Values ($1, $2, $3) RETURNING *", [
            req.session.user_id, req.body.description, req.body.category
        ]);

        return res.status(200).json({success: true, msg: createPost.rows[0]})
    } catch (err) {
        console.error(err.message);
        res.status(500).json({success: false, msg: "Server error"});
    }
});

//delete a post
router.delete("/post/:id", auth, async (req, res) => {
    try {
        const deletePost = await pool.query("DELETE FROM posts WHERE post_id = $1 AND user_id = $2 RETURNING *", [
            req.params.id, req.session.user_id
        ]);

        if(deletePost.rows.length <= 0) return res.status(403).json({success: false, msg: "Delete post unsuccessful"});

        return res.status(200).json({success: true, msg: "Post has been successfully deleted"})
    } catch (err) {
        console.error(err.message);
        res.status(500).json({success: false, msg: "Server error"}); 
    }
});

//get a user's posts, votes, and etc
router.get("/posts/:name", async (req, res) => {
    try {
        const getPosts = await pool.query(
            "SELECT u.user_name, p.post_id, p.description, p.post_created, (SELECT SUM(v.vote) AS votes FROM posts AS p LEFT JOIN votes AS v on p.post_id = v.post_id WHERE p.post_id IN (SELECT post_id FROM posts WHERE user_id = (SELECT user_id FROM users WHERE user_name = $1))), COUNT(c.comment_id) AS comments FROM users AS u INNER JOIN posts AS p ON u.user_id = p.user_id LEFT JOIN comments AS c ON p.post_id = c.post_id WHERE u.user_id = (SELECT user_id FROM users WHERE user_name = $1) GROUP BY u.user_id, p.post_id", [
                req.params.name
            ]
        );

        return res.status(200).json({success: true, msg: getPosts.rows});
    } catch (err) {
        console.error(err.message);
        res.status(500).json({success: false, msg: "Server error"}); 
    }
});

//get a single post with comments and etc

module.exports = router;