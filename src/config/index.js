require("dotenv").config();

module.exports = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || "development",
  appName: process.env.APP_NAME || "product-catalog-api",
};
