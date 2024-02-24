CREATE DATABASE unethicaljokes;

CREATE TABLE users(
    user_id UUID DEFAULT uuid_generate_v4(),
    user_name VARCHAR(255) NOT NULL UNIQUE,
    user_email VARCHAR(255) NOT NULL UNIQUE,
    user_password VARCHAR(255) NOT NULL,
    user_verified BOOLEAN NOT NULL DEFAULT FALSE,
    isAdmin BOOLEAN NOT NULL DEFAULT FALSE,
    user_created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    user_updated TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(user_id)
);

--log history
CREATE TABLE logs(
    log_id SERIAL,
    user_id UUID NOT NULL, --on delete casade
    user_agent VARCHAR(255) NOT NULL,
    ip_address INET NOT NULL,
    log_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    type VARCHAR(30) NOT NULL,
    PRIMARY KEY(log_id),
    FOREIGN KEY(user_id) REFERENCES users(user_id)
);

--user profile
CREATE TABLE user_profile(
    user_id UUID,
    user_pic VARCHAR(266), --on delete casade
    user_pic_pending VARCHAR(266),
    bio VARCHAR(500),
    PRIMARY KEY (user_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

--posts aka jokes
CREATE TABLE posts(
    post_id SERIAL,
    user_id UUID NOT NULL, --on delete casade
    description VARCHAR(1000) NOT NULL,
    -- category VARCHAR(30) NOT NULL, forgot to add
    post_created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(post_id),
    FOREIGN KEY(user_id) REFERENCES users(user_id)
);

--votes
CREATE TABLE votes(
    user_id UUID NOT NULL,
    post_id INT NOT NULL, --on delete casade
    vote SMALLINT NOT NULL CHECK (vote = 1 OR vote = -1),
    vote_created TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(user_id, post_id),
    FOREIGN KEY(user_id) REFERENCES users(user_id),
    FOREIGN KEY(post_id) REFERENCES posts(post_id)
);

--comments
CREATE TABLE comments(
    comment_id SERIAL NOT NULL,
    user_id UUID NOT NULL,
    post_id INT NOT NULL,
    parent_comment_id INT REFERENCES comments(comment_id) ON DELETE CASCADE,
    description VARCHAR(1000) NOT NULL,
    comment_created TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (comment_id),
    FOREIGN KEY(user_id) REFERENCES users(user_id),
    FOREIGN KEY(post_id) REFERENCES posts(post_id)
);

--comment votes
CREATE TABLE comment_votes(
    user_id UUID NOT NULL,
    post_id INT NOT NULL,
    comment_id INT NOT NULL REFERENCES comments(comment_id) ON DELETE CASCADE,
    vote SMALLINT NOT NULL CHECK (vote = 1 OR vote = -1),
    vote_created TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(user_id, post_id, comment_id),
    FOREIGN KEY(user_id) REFERENCES users(user_id),
    FOREIGN KEY(post_id) REFERENCES posts(post_id)
);

--categories don't need a seperate table for one column just add it to posts table
-- CREATE TABLE categories(
--     post_id INT NOT NULL REFERENCES posts(post_id) ON DELETE CASCADE,
--     description VARCHAR(40) NOT NULL,
--     PRIMARY KEY (post_id) 
-- );

--reports
CREATE TABLE post_reports(
    user_id UUID NOT NULL REFERENCES users(user_id),
    post_id INT NOT NULL REFERENCES posts(post_id),
    description VARCHAR(1000) NOT NULL,
    report_created TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(user_id, post_id)
);

CREATE TABLE comment_reports(
    user_id UUID NOT NULL REFERENCES users(user_id),
    post_id INT NOT NULL REFERENCES posts(post_id),
    comment_id INT NOT NULL REFERENCES comments(comment_id),
    description VARCHAR(1000) NOT NULL,
    report_created TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(user_id, post_id, comment_id)
);

--following/followers
CREATE TABLE followers(
    follower_id UUID NOT NULL,
    user_id UUID NOT NULL,
    PRIMARY KEY (user_id, follower_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (follower_id) REFERENCES users(user_id)
);

--UNIQUE INDEX (follower_id, user_id)

--CREATE UNIQUE INDEX f_id
--ON followers (follower_id, user_id);

--INSERT INTO followers (follower_id, user_id) VALUES ('de669e63-efa8-491a-9ce3-45b80645243f', '00126816-f0b4-4dc5-b185-8aa90ff5f373') RETURNING *;

--Now I want to find who is following a userA. I'd so sth like: Select * from followers where user_id = userA This will select userB and userC. Thats what I need.

--Now I want to find, which persons userA is following (for example in above table, userA is following userC and userX. Then I should run something like Select * from followers where follower_id=userA.
