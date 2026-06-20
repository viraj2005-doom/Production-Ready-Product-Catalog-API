const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
require("dotenv").config();

const testDatabaseConnection = require("./config/dbTest");
const healthRoutes = require("./routes/health.routes");
const authRoutes = require("./routes/auth.routes.js");
const userRoutes = require("./routes/user.routes.js");
const errorHandler = require("./middlewares/errorMiddleware");
const productRoutes = require("./routes/product.routes.js");
const categoryRoutes = require("./routes/category.routes.js");

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(errorHandler);

app.use("/health", healthRoutes);
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/products", productRoutes);
app.use("/categories", categoryRoutes);


testDatabaseConnection();

app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    service: "product-catalog-api",
  });
});

module.exports = app;