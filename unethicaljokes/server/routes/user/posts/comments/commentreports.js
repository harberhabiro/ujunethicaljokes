const router = require("express").Router();
const pool = require("../../../../db");
const auth = require("../../../../middleware/auth");
const { body, validationResult } = require('express-validator');
const badWords = require("../../../../middleware/badWords");

//create a report
router.post("/:id", auth, async (req, res) => {
    try {
        //check if the user trying t0 report their own comment
        const checkPost = await pool.query("SELECT user_id FROM comments WHERE comment_id = $1", [
            req.params.id
        ]);

        if(checkPost.rows[0].user_id === req.session.user_id) return res.status(400).json({success: false, msg: "Can't report your own comment"});

        await pool.query("INSERT INTO post_reports (user_id, post_id, comment_id, description) VALUES ($1, $2, $3, $4) RETURNING *", [
            req.session.user_id, req.params.id, req.body.description
        ]);

        return res.status(200).json({success: true, msg: "Report created"});
    } catch (err) {
        console.error(err.message); 
        res.status(500).json({success: false, msg: "Server error"}); 
    }
});

module.exports = router;