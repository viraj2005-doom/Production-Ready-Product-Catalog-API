const winston = require("winston");

const logger = winston.createLogger({
  level: "info", // Set the default log level to 'info' 

  format: winston.format.combine( // Combine multiple formats for log messages
    winston.format.timestamp(),
    winston.format.json()
  ),

  defaultMeta: { // Default metadata to include in log messages 
    service: "product-catalog-api",
  },

  transports: [ // Define the transports for log messages , including file and console transports
    new winston.transports.File({
      filename: "logs/error.log",
      level: "error",
    }),

    new winston.transports.File({
      filename: "logs/combined.log",
    }),
  ],
});

if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    })
  );
}

module.exports = logger;