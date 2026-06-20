const express = require("express");

const router = express.Router();

const categoryController = require("../controllers/categoryController");

const authenticate = require("../middlewares/authMiddleware");
const authorizeRole = require("../middlewares/roleMiddleware");
const validateCategory = require("../middlewares/validationMiddleware");

router.post(
  "/",
  authenticate,
  authorizeRole("Admin"),
  validateCategory,
  categoryController.createCategory
);

router.get("/", categoryController.getAllCategories);

router.get("/:id", categoryController.getCategoryById);

router.put(
  "/:id",
  authenticate,
  authorizeRole("Admin"),
  validateCategory,
  categoryController.updateCategory
);

router.delete(
  "/:id",
  authenticate,
  authorizeRole("Admin"),
  categoryController.deleteCategory
);

module.exports = router;