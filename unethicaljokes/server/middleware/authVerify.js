require("dotenv").config();

module.exports = (req, res, next) => {
    if(!req.session.user_id) { 
        res.status(403).json({success: false, msg: "Not authorized"})
        req.session.destroy(err => {
            if(err) throw err;
        });
        res.clearCookie(process.env.APP_SECRET);
    };

    next();
};