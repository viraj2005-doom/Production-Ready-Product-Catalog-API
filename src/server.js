const app = require("./app");
const { port } = require("./config");
const redisClient = require("./config/redis");
const testDatabaseConnection = require("./config/dbTest");
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await testDatabaseConnection();

    try {
      await redisClient.connect();
    } catch (error) {
      console.warn(
        "Redis connection skipped:",
        error.code || error.message || "connection failed"
      );
    }

    app.listen(PORT, () => {
      console.log(`Server running on ${PORT} in ${process.env.NODE_ENV} mode`);
    });

  }
  catch (error) {
    console.error(error);
  }
};

startServer();
