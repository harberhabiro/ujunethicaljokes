const router = require("express").Router();
const pool = require("../db");
const auth = require("../middleware/auth");
const { body, validationResult } = require('express-validator');
const badWords = require("../middleware/badWords");

//get user's username and bio
router.get('/get-profile/:name', async (req, res) => {
    try {
        const getProfile = await pool.query("SELECT u.user_name, u.user_created, p.user_pic, p.bio FROM users AS u LEFT JOIN user_profile AS p ON u.user_id = p.user_id WHERE u.user_id = (SELECT user_id FROM users WHERE user_name = $1)", [
            req.params.name
        ]);

        if(getProfile.rows.length <= 0) return res.status(400).json({success: false, msg: "User doesn't exists"});

        return res.status(200).json({success: true, msg: getProfile.rows[0]});
    } catch (err) {
        console.error(err.message);
        res.status(500).json({success: false, msg: "Server error"});
    }
});

//change a user pics
router.put('/change-pic', auth,
body("file").trim().isLength({min: 1, max: 266}).withMessage("Error"),
async (req, res) => {
     //errors from the validator
     const errors = validationResult(req);

     if(!errors.isEmpty()) {
         return res.status(401).json({success: false, msg: errors.array()});
     }

    try {
        const userProfile = await pool.query('SELECT * FROM user_profile WHERE user_id = $1', [
            req.session.user_id
        ]);

        if(userProfile.rows.length <= 0) {
            await pool.query('INSERT INTO user_profile (user_id, user_pic_pending) VALUES ($1, $2)', [
                req.session.user_id, req.body.file
            ]);
        } else {
            await pool.query("UPDATE user_profile SET user_pic_pending = $1 WHERE user_id = $2", [
                req.body.file, req.session.user_id
            ]);
        };
        
        return res.status(200).json({success: true, msg: "New avatar has been added, please wait a couple of days to get avatar approved"});
    } catch (err) {
       console.error(err.message);
       res.status(500).json({success: false, msg: "Server error"}); 
    }
});

//change a user's bio
router.put("/change-bio", auth, badWords,
body("description").trim().isLength({min: 1, max: 500}).withMessage("Error"),
async (req, res) => {
    //errors from the validator
    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        return res.status(401).json({success: false, msg: errors.array()});
    }

    try {
        const userProfile = await pool.query('SELECT * FROM user_profile WHERE user_id = $1', [
            req.session.user_id
        ]);

        if(userProfile.rows.length <= 0) {
            await pool.query('INSERT INTO user_profile (user_id, bio) VALUES ($1, $2)', [
                req.session.user_id, req.body.description
            ]);
        } else {
            await pool.query('UPDATE user_profile SET bio = $1 WHERE user_id = $2', [
                req.body.description, req.session.user_id
            ]);
        }

        return res.status(200).json({success: true, msg: "Profile updated"});
    } catch (err) {
        console.error(err.message);
        res.status(500).json({success: false, msg: "Server error"});
    }
});

// //create a post //move to posts.js
// router.post("/post", auth, badWords,
// body("description").trim().isLength({min: 1, max: 1000}).withMessage("To upload a post, a post must not be empty or over 1000 characters"),
// async (req, res) => {
//     //errors from the validator
//     const errors = validationResult(req);

//     if(!errors.isEmpty()) {
//         return res.status(401).json({success: false, msg: errors.array()});
//     }

//     try {
//         const createPost = await pool.query("INSERT INTO posts (user_id, description) Values ($1, $2) RETURNING *", [
//             req.session.user_id, req.body.description
//         ]);

//         return res.status(200).json({success: true, msg: createPost.rows[0]})
//     } catch (err) {
//         console.error(err.message);
//         res.status(500).json({success: false, msg: "Server error"});
//     }
// });

// //delete a post
// router.delete("/post/:id", auth, async (req, res) => {
//     try {
//         const deletePost = await pool.query("DELETE FROM posts WHERE post_id = $1 AND user_id = $2 RETURNING *", [
//             req.params.id, req.session.user_id
//         ]);

//         if(deletePost.rows.length <= 0) return res.status(400).json({success: false, msg: "Delete post unsuccessful"});

//         return res.status(200).json({success: true, msg: "Post has been successfully deleted"})
//     } catch (err) {
//         console.error(err.message);
//         res.status(500).json({success: false, msg: "Server error"}); 
//     }
// });

// //get a user's posts, votes, and etc
// router.get("/posts/:name", async (req, res) => {
//     try {
//         const getPosts = await pool.query(
//             "SELECT u.user_name, p.post_id, p.description, p.post_created, (SELECT SUM(v.vote) AS votes FROM posts AS p LEFT JOIN votes AS v on p.post_id = v.post_id WHERE p.post_id = (SELECT post_id FROM posts WHERE user_id = (SELECT user_id FROM users WHERE user_name = $1))), COUNT(c.comment_id) AS comments FROM users AS u INNER JOIN posts AS p ON u.user_id = p.user_id LEFT JOIN comments AS c ON p.post_id = c.post_id WHERE u.user_id = (SELECT user_id FROM users WHERE user_name = $1) GROUP BY u.user_id, p.post_id", [
//                 req.params.name
//             ]
//         );

//         return res.status(200).json({success: true, msg: getPosts.rows});
//     } catch (err) {
//         console.error(err.message);
//         res.status(500).json({success: false, msg: "Server error"}); 
//     }
// });

// //vote on a post //move to postvotes
// router.post("/vote-post/:id", auth, async (req, res) => {
//     try {
//         const newVote = await pool.query("INSERT INTO votes (user_id, post_id, vote) VALUES ($1, $2, $3) RETURNING *", [
//             req.session.user_id, req.params.id, req.body.vote
//         ]);

//        return res.status(200).json({success: true, msg: newVote.rows[0]});
//     } catch (err) {
//        console.error(err.message); 
//        res.status(500).json({success: false, msg: "Server error"}); 
//     }
// });

// //change a vote on a post
// router.put("/vote-change-post/:id", auth, async (req, res) => {
//     try {
//         const changeVote = await pool.query("UPDATE votes SET vote = $1 WHERE user_id = $2 AND post_id = $3 RETURNING *", [
//             req.body.vote, req.session.user_id, req.params.id
//         ]);

//         if(changeVote.rows.length <= 0) return res.status(401).json({success: false, msg: "Error"});

//         return res.status(200).json({success: true, msg: "Successful change"});
//     } catch (err) {
//         console.error(err.message); 
//         res.status(500).json({success: false, msg: "Server error"}); 
//     }
// });

// //delete a vote on a post
// router.delete("/vote-delete-post/:id", auth, async (req, res) => {
//     try {
//         const deleteVote = await pool.query("DELETE FROM votes WHERE user_id = $1 AND post_id = $2 RETURNING *", [
//             req.session.user_id, req.params.id
//         ]);

//         if(deleteVote.rows.length <= 0) return res.status(401).json({success: false, msg: "Error"});

//         return res.status(200).json({success: true, msg: "Successful change"});
//     } catch (err) {
//         console.error(err.message); 
//         res.status(500).json({success: false, msg: "Server error"}); 
//     }
// });

// //create a comment //went to comments
// router.post("/comment/:id", auth, async (req, res) => {
//     try {
//         const newComment = await pool.query("INSERT INTO comments (user_id, post_id, description) VALUES ($1, $2, $3) RETURNING *", [
//             req.session.user_id, req.params.id, req.body.description
//         ]);

//         return res.status(200).json({success: true, msg: newComment.rows[0]});
//     } catch (err) {
//         console.error(err.message); 
//         res.status(500).json({success: false, msg: "Server error"}); 
//     }
// });

// //delete a comment and or reply
// router.delete("/comment/:id/:cid", auth, async (req, res) => {
//     try {
//         const deleteComment = await pool.query("DELETE FROM comments WHERE comment_id = $1 AND user_id = $2 AND post_id = $3 RETURNING *", [
//             req.params.cid, req.session.user_id, req.params.id
//         ]);

//         if(deleteComment.rows.length <= 0) return res.status(400).json({success: false, msg: "Error"});

//         return res.status(200).json({success: true, msg: "Successfully deleted a comment"});
//     } catch (err) {
//         console.error(err.message); 
//         res.status(500).json({success: false, msg: "Server error"}); 
//     }
// });

// //create a reply to a comment
// router.post("/comment-reply/:id/:cid", auth, async (req, res) => {
//     try {
//         const checkCid = await pool.query("SELECT comment_id FROM comments WHERE comment_id = $1", [
//             req.params.cid
//         ]);

//         if(checkCid.rows.length <= 0) return res.status(400).json({success: false, msg: "Error"});

//         const newReply = await pool.query("INSERT INTO comments (user_id, post_id, parent_comment_id, description) VALUES ($1, $2, $3, $4) RETURNING *", [
//             req.session.user_id, req.params.id, req.params.cid, req.body.description
//         ]);

//         return res.status(200).json({success: true, msg: newReply.rows[0]});
//     } catch (err) {
//         console.error(err.message); 
//         res.status(500).json({success: false, msg: "Server error"}); 
//     }
// });

//get a single post
router.get("/post/:name", async (req, res) => {
    try {
        const getPost = await pool.query("SELECT u.user_name, p.post_id, p.description, p.post_created ");
    } catch (err) {
        console.error(err.message); 
        res.status(500).json({success: false, msg: "Server error"}); 
    }
});

//comment vote

//comment vote change

//comment vote delete




module.exports = router;

//INSERT INTO votes (user_id, post_id, vote) VALUES ('2bad086c-0389-4fe6-bb26-1105c46e474e', '3', '-1') RETURNING *;


//SELECT SUM(v.vote) AS v, COUNT(DISTINCT c.comment_id) FROM posts AS p LEFT JOIN votes AS v ON p.post_id = v.post_id LEFT JOIN comments AS c ON p.post_id = c.post_id WHERE p.post_id = '6';

//SELECT SUM(v.vote) AS v FROM posts AS p LEFT JOIN votes AS v ON p.post_id = v.post_id WHERE p.post_id = '6';

//SELECT SUM(v.vote) AS v, COUNT(c.comment_id), p.post_id FROM posts AS p INNER JOIN comments AS c ON p.post_id = c.post_id LEFT JOIN votes AS v ON p.post_id = v.post_id  WHERE p.post_id = '6' GROUP BY p.post_id;


//SELECT SUM(v.vote) AS votes, p.post_id FROM posts as p LEFT JOIN votes AS v ON p.post_id = v.post_id WHERE p.post_id = '6' GROUP BY p.post_id;

//(SELECT COUNT(c.comment_id) AS comments, p.post_id FROM posts as p LEFT JOIN comments AS c ON p.post_id = c.post_id WHERE p.post_id = '6' GROUP BY p.post_id);





//SELECT SUM(SELECT v.vote) AS votes FROM posts AS p LEFT JOIN votes AS v ON p.post_id = v.post_id WHERE p.post_id = '6';







//select a.*, d.image, b.totalRating, c.totalUser from places a, ( select place_id, sum(rating) AS totalRating from ratings group by place_id ) b, ( select place_id, count(id) AS totalUser from ratings group by place_id ) c, places_images d where c.place_id = a.id and b.place_id = a.id and d.place_id = a.id GROUP BY a.id





//SELECT SUM(SELECT votes FROM post_id = '6') AS v, COUNT(c.comment_id) FROM posts AS p LEFT JOIN votes AS v ON p.post_id = v.post_id AND p.user_id = v.user_id LEFT JOIN comments AS c ON p.post_id = c.post_id WHERE p.post_id = '6';


//SELECT SUM(v.vote) AS votes FROM posts







//SELECT (SELECT SUM(v.vote) AS votes FROM posts AS p LEFT JOIN votes AS v ON p.post_id = v.post_id WHERE p.post_id = '6'), COUNT(c.comment_id) FROM posts AS p LEFT JOIN comments AS c ON p.post_id = c.post_id WHERE p.post_id = '6';


//SELECT u.user_name, p.post_id, p.description, p.post_created, (SELECT SUM(v.vote) AS votes FROM posts AS p LEFT JOIN votes AS v on p.post_id = v.post_id), COUNT(c.comment_id) AS comments FROM users AS u INNER JOIN posts AS p ON u.user_id = p.user_id LEFT JOIN comments AS c ON p.post_id = c.post_id WHERE u.user_id = (SELECT user_id FROM users WHERE user_name = $1) GROUP BY u.user_id, p.post_id