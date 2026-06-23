// src/middlewares/errorMiddleware.js

const errorHandler = (err, req, res, _next) => {
  console.error(err);

  res.status(500).json({
    message: err.message || "Internal Server Error",
  });
};

module.exports = errorHandler;
