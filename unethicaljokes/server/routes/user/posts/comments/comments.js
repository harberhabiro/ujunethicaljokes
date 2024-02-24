const router = require("express").Router();
const pool = require("../../../../db");
const auth = require("../../../../middleware/auth");
const { body, validationResult } = require('express-validator');
const badWords = require("../../../../middleware/badWords");

//create a comment
router.post("/comment/:id", auth, async (req, res) => {
    try {
        const newComment = await pool.query("INSERT INTO comments (user_id, post_id, description) VALUES ($1, $2, $3) RETURNING *", [
            req.session.user_id, req.params.id, req.body.description
        ]);

        return res.status(200).json({success: true, msg: newComment.rows[0]});
    } catch (err) {
        console.error(err.message); 
        res.status(500).json({success: false, msg: "Server error"}); 
    }
});

//delete a comment and or reply
router.delete("/comment/:cid", auth, async (req, res) => {
    try {
        const deleteComment = await pool.query("DELETE FROM comments WHERE comment_id = $1 AND user_id = $2 AND post_id = (SELECT post_id FROM comments WHERE comment_id = $3) RETURNING *", [
            req.params.cid, req.session.user_id, req.params.cid
        ]);

        if(deleteComment.rows.length <= 0) return res.status(400).json({success: false, msg: "Error"});

        return res.status(200).json({success: true, msg: "Successfully deleted a comment"});
    } catch (err) {
        console.error(err.message); 
        res.status(500).json({success: false, msg: "Server error"}); 
    }
});

//create a reply to a comment //might need to fix the checkid and just put it in the query as subquery //might change the post-id to none
router.post("/reply/:cid", auth, async (req, res) => {
    try {
        const checkCid = await pool.query("SELECT comment_id FROM comments WHERE comment_id = $1", [
            req.params.cid
        ]);

        if(checkCid.rows.length <= 0) return res.status(400).json({success: false, msg: "Error"});

        const newReply = await pool.query("INSERT INTO comments (user_id, post_id, parent_comment_id, description) VALUES ($1, (SELECT post_id FROM comments WHERE comment_id = $2), $3, $4) RETURNING *", [
            req.session.user_id, req.params.cid, req.params.cid, req.body.description
        ]);

        return res.status(200).json({success: true, msg: newReply.rows[0]});
    } catch (err) {
        console.error(err.message); 
        res.status(500).json({success: false, msg: "Server error"}); 
    }
});

module.exports = router;