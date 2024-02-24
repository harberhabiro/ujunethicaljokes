const redis = require("../redis");
const { RateLimiterRedis } = require('rate-limiter-flexible');

const rateLimiter = new RateLimiterRedis({
    storeClient: redis,
    keyPrefix: 'middleware',
    points: 10, // 10 requests
    duration: 10, // per 1 second by IP
});

module.exports = (req, res, next) => {
    console.log("hello")
    rateLimiter.consume(req.ip)
      .then(() => {
        next();
      })
      .catch(() => {
        res.status(429).send('Too Many Requests');
      });
};