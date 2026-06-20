const express = require("express");

const router = express.Router();

const authenticate =
  require("../middlewares/authMiddleware");

const authorizeRole =
  require("../middlewares/roleMiddleware");

const validateProduct =
  require("../middlewares/productMiddleware");

const productController =
  require("../controllers/productController");

router.post(
  "/",
  authenticate,
  authorizeRole("Admin"),
  validateProduct,
  productController.createProduct
);

router.get(
  "/",
  productController.getAllProducts
);

router.get(
  "/:id",
  productController.getProductById
);

router.put(
  "/:id",
  authenticate,
  authorizeRole("Admin"),
  validateProduct,
  productController.updateProduct
);

router.delete(
  "/:id",
  authenticate,
  authorizeRole("Admin"),
  productController.deleteProduct
);

module.exports = router;
