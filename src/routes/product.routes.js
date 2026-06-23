const express = require("express");

const router = express.Router();

const authenticate = require("../middlewares/authMiddleware");

const authorizeRole = require("../middlewares/roleMiddleware");

const validateProduct = require("../middlewares/productMiddleware");

const productController = require("../controllers/productController");

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Create Product
 *     tags:
 *       - Products
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             name: MacBook Pro M4
 *             description: Apple Laptop
 *             price: 199999
 *             stock_quantity: 10
 *             category_id: 1
 *     responses:
 *       201:
 *         description: Product created
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin only
 */
router.post(
  "/",
  authenticate,
  authorizeRole("Admin"),
  validateProduct,
  productController.createProduct,
);

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Get All Products
 *     tags:
 *       - Products
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of products per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search text for product names or descriptions
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Category filter
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *         description: Sort option
 *     responses:
 *       200:
 *         description: List of products
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               count: 1
 *               data:
 *                 - id: 1
 *                   name: MacBook Pro M4
 *                   description: Apple Laptop
 *                   price: 199999
 *                   stock_quantity: 10
 *                   category_id: 1
 */
router.get("/", productController.getAllProducts);

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Get Product By ID
 *     tags:
 *       - Products
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Product found
 *       404:
 *         description: Product not found
 */
router.get("/:id", productController.getProductById);

/**
 * @swagger
 * /products/{id}:
 *   put:
 *     summary: Update Product
 *     tags:
 *       - Products
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
 *             name: MacBook Pro M4
 *             description: Apple Laptop
 *             price: 189999
 *             stock_quantity: 8
 *             category_id: 1
 *     responses:
 *       200:
 *         description: Product updated
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin only
 *       404:
 *         description: Product not found
 */
router.put(
  "/:id",
  authenticate,
  authorizeRole("Admin"),
  validateProduct,
  productController.updateProduct,
);

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Delete Product
 *     tags:
 *       - Products
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
 *         description: Product deleted
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin only
 *       404:
 *         description: Product not found
 */
router.delete(
  "/:id",
  authenticate,
  authorizeRole("Admin"),
  productController.deleteProduct,
);

module.exports = router;
