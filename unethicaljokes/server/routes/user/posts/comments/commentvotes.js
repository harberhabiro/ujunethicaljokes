const router = require("express").Router();
const pool = require("../../../../db");
const auth = require("../../../../middleware/auth");
const { body, validationResult } = require('express-validator');
const badWords = require("../../../../middleware/badWords");

//vote on a comment/reply
router.post("/:cid", auth, async (req, res) => {
    try {
        const newVote = await pool.query("INSERT INTO comment_votes (user_id, post_id, comment_id, vote) VALUES ($1, (SELECT post_id FROM comments WHERE comment_id = $2), $3, $4) RETURNING *", [
            req.session.user_id, req.params.cid, req.params.cid, req.body.vote
        ]);

       return res.status(200).json({success: true, msg: newVote.rows[0]});
    } catch (err) {
       console.error(err.message); 
       res.status(500).json({success: false, msg: "Server error"}); 
    }
});

//change a vote on a comment/reply
router.put("/:cid", auth, async (req, res) => {
    try {
        const changeVote = await pool.query("UPDATE comment_votes SET vote = $1 WHERE comment_id = $2 AND user_id = $3 AND post_id = (SELECT post_id FROM comments WHERE comment_id = $4) RETURNING *", [
            req.body.vote, req.params.cid, req.session.user_id, req.params.cid
        ]);

        if(changeVote.rows.length <= 0) return res.status(401).json({success: false, msg: "Error"});

        return res.status(200).json({success: true, msg: "Successful change"});
    } catch (err) {
        console.error(err.message); 
        res.status(500).json({success: false, msg: "Server error"}); 
    }
});

//delete a vote on a comment/reply
router.delete("/:cid", auth, async (req, res) => {
    try {
        const deleteVote = await pool.query("DELETE FROM comment_votes WHERE comment_id = $1 AND user_id = $2 AND post_id = (SELECT post_id FROM comments WHERE comment_id = $3) RETURNING *", [
            req.params.cid, req.session.user_id, req.params.cid
        ]);

        if(deleteVote.rows.length <= 0) return res.status(401).json({success: false, msg: "Error"});

        return res.status(200).json({success: true, msg: "Successful change"});
    } catch (err) {
        console.error(err.message); 
        res.status(500).json({success: false, msg: "Server error"}); 
    }
});

module.exports = router;