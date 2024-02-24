const router = require("express").Router();
const pool = require("../../../db");
const auth = require("../../../middleware/auth");
const { body, validationResult } = require('express-validator');
const badWords = require("../../../middleware/badWords");

//vote on a post
router.post("/vote/:id", auth, async (req, res) => {
    try {
        const newVote = await pool.query("INSERT INTO votes (user_id, post_id, vote) VALUES ($1, $2, $3) RETURNING *", [
            req.session.user_id, req.params.id, req.body.vote
        ]);

       return res.status(200).json({success: true, msg: newVote.rows[0]});
    } catch (err) {
       console.error(err.message); 
       res.status(500).json({success: false, msg: "Server error"}); 
    }
});

//change a vote on a post
router.put("/vote/:id", auth, async (req, res) => {
    try {
        const changeVote = await pool.query("UPDATE votes SET vote = $1 WHERE user_id = $2 AND post_id = $3 RETURNING *", [
            req.body.vote, req.session.user_id, req.params.id
        ]);

        if(changeVote.rows.length <= 0) return res.status(401).json({success: false, msg: "Error"});

        return res.status(200).json({success: true, msg: "Successful change"});
    } catch (err) {
        console.error(err.message); 
        res.status(500).json({success: false, msg: "Server error"}); 
    }
});

//delete a vote on a post
router.delete("/vote/:id", auth, async (req, res) => {
    try {
        const deleteVote = await pool.query("DELETE FROM votes WHERE user_id = $1 AND post_id = $2 RETURNING *", [
            req.session.user_id, req.params.id
        ]);

        if(deleteVote.rows.length <= 0) return res.status(401).json({success: false, msg: "Error"});

        return res.status(200).json({success: true, msg: "Successful change"});
    } catch (err) {
        console.error(err.message); 
        res.status(500).json({success: false, msg: "Server error"}); 
    }
});

module.exports = router;