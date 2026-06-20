const { createClient } = require("redis");

const redisClient = createClient({
  socket: {
    host: process.env.REDIS_HOST || "127.0.0.1",
    port: Number(process.env.REDIS_PORT) || 6379,
    reconnectStrategy: false
  }
});

redisClient.on("connect", () => {
  console.log("Redis Connected");
});

redisClient.on("error", (err) => {
  if (redisClient.isOpen) {
    console.error("Redis Error:", err.message);
  }
});

module.exports = redisClient;
