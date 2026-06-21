const express = require("express");

const router = express.Router();

const categoryController = require("../controllers/categoryController");

const authenticate = require("../middlewares/authMiddleware");
const authorizeRole = require("../middlewares/roleMiddleware");
const validateCategory = require("../middlewares/validationMiddleware");

/**
 * @swagger
 * /categories:
 *   post:
 *     summary: Create Category
 *     tags:
 *       - Categories
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             name: Electronics
 *     responses:
 *       201:
 *         description: Category created
 *       400:
 *         description: Category name is required
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin only
 */
router.post(
  "/",
  authenticate,
  authorizeRole("Admin"),
  validateCategory,
  categoryController.createCategory
);

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Get All Categories
 *     tags:
 *       - Categories
 *     responses:
 *       200:
 *         description: List of categories
 *         content:
 *           application/json:
 *             example:
 *               - id: 1
 *                 name: Electronics
 */
router.get("/", categoryController.getAllCategories);

/**
 * @swagger
 * /categories/{id}:
 *   get:
 *     summary: Get Category By ID
 *     tags:
 *       - Categories
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Category found
 *         content:
 *           application/json:
 *             example:
 *               id: 1
 *               name: Electronics
 *       404:
 *         description: Category not found
 */
router.get("/:id", categoryController.getCategoryById);

/**
 * @swagger
 * /categories/{id}:
 *   put:
 *     summary: Update Category
 *     tags:
 *       - Categories
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             name: Computers
 *     responses:
 *       200:
 *         description: Category updated
 *       400:
 *         description: Category name is required
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin only
 *       404:
 *         description: Category not found
 */
router.put(
  "/:id",
  authenticate,
  authorizeRole("Admin"),
  validateCategory,
  categoryController.updateCategory
);

/**
 * @swagger
 * /categories/{id}:
 *   delete:
 *     summary: Delete Category
 *     tags:
 *       - Categories
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Category deleted
 *         content:
 *           application/json:
 *             example:
 *               message: Category deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin only
 *       404:
 *         description: Category not found
 */
router.delete(
  "/:id",
  authenticate,
  authorizeRole("Admin"),
  categoryController.deleteCategory
);

module.exports = router;
