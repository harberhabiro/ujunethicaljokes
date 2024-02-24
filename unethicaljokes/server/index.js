const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const redis = require("./redis");
const session = require("express-session");
const RedisStore = require("connect-redis")(session);
require("dotenv").config();
const app = express();

//middlewares
app.use(express.json());
app.use(cors());
app.use(helmet());

app.use(session({
    store: new RedisStore({ client: redis }),
    name: process.env.APP_NAME,
    secret: process.env.APP_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 2,
        secure: false,
        sameSite: true
    }
}));

//routes
app.use("/auth", require("./routes/auth"));
app.use("/email", require("./routes/emails"));
app.use("/changes", require("./routes/changes"));
// app.use("/profile", require("./routes/profile"));
app.use("/user/post", require("./routes/user/posts/posts"));
app.use("/user/post/vote", require("./routes/user/posts/postvotes"));
app.use("/user/post/reports", require("./routes/user/posts/postreports"));
app.use("/user/comment", require("./routes/user/posts/comments/comments"));
app.use("/user/comment/vote", require("./routes/user/posts/comments/commentvotes"));
app.use("/user/comment/reports", require("./routes/user/posts/comments/commentreports"));
app.use("/user/follow", require("./routes/user/profile/follows"));

//server
app.listen(process.env.APP_PORT, () => console.log(`Server is up on port ${process.env.APP_PORT}`));