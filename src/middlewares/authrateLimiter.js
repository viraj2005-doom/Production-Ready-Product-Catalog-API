const redisClient = require("../config/redis");

const authRateLimiter = async (req,res,next) => {
  try {
    const ip = req.ip;

    const key = `auth_limit:${ip}`;

    const count = await redisClient.incr(key);

    if (count === 1) {
      await redisClient.expire(
        key,
        60
      );
    }

    const ttl = await redisClient.ttl(key);

    if (count > 5) {
      return res.status(429).json({
        message:
          "Too Many Login Attempts",
        retryAfter: ttl
      });
    }
    next();
  } catch (error) {
    next();
  }
};

module.exports =
  authRateLimiter;