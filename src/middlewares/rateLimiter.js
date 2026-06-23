const redisClient = require("../config/redis");

const rateLimiter = async (req, res, next) => {
  try {
    const ip = req.ip || req.connection.remoteAddress;

    const key = `rate_limit:${ip}`;

    const currentRequests = await redisClient.incr(key);

    if (currentRequests === 1) {
      await redisClient.expire(key, 60);
    }

    const ttl = await redisClient.ttl(key);

    res.setHeader("X-RateLimit-Limit", 100);

    res.setHeader("X-RateLimit-Remaining", Math.max(0, 100 - currentRequests));

    res.setHeader("Retry-After", ttl);

    if (currentRequests > 100) {
      return res.status(429).json({
        message: "Too Many Requests",
        retryAfter: ttl,
      });
    }

    next();
  } catch (error) {
    console.error("Rate Limiter Error:", error.message);

    next();
  }
};

module.exports = rateLimiter;
