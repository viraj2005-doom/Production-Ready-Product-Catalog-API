const redisClient = require("../config/redis");

const CACHE_TTL = 300;

const getCache = async (key) => {
  try {
    const data = await redisClient.get(key);

    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error("Cache Read Error:", error.message);
    return null;
  }
};

const setCache = async (key, value, ttl = CACHE_TTL) => {
  try {
    await redisClient.set(key, JSON.stringify(value), {
      EX: ttl,
    });
  } catch (error) {
    console.error("Cache Write Error:", error.message);
  }
};

const deleteCache = async (key) => {
  try {
    await redisClient.del(key);
  } catch (error) {
    console.error("Cache Delete Error:", error.message);
  }
};

module.exports = {
  getCache,
  setCache,
  deleteCache,
};
