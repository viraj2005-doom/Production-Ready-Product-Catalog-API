// src/routes/authRoutes.js

const express = require("express");

const router = express.Router();

const authController =
  require("../controllers/authController");

const authenticate =
  require("../middlewares/authMiddleware");

const authRateLimiter =
  require("../middlewares/authrateLimiter");

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register User
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             name: Viraj
 *             email: viraj@example.com
 *             password: StrongPassword123
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Validation error
 *       409:
 *         description: Email already exists
 */
router.post(
  "/register",
  authController.register
);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login User
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             email: viraj@example.com
 *             password: StrongPassword123
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */
router.post(
  "/login",
  authRateLimiter,
  authController.login
);

/**
 * @swagger
 * /auth/refresh:
 *   post:
 *     summary: Refresh Access Token
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             refreshToken: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *     responses:
 *       200:
 *         description: Access token refreshed successfully
 *       400:
 *         description: Refresh token is required
 *       401:
 *         description: Invalid or expired refresh token
 */
router.post(
  "/refresh",
  authController.refreshToken
);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Logout User
 *     tags:
 *       - Authentication
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logged out successfully
 *         content:
 *           application/json:
 *             example:
 *               message: Logged out successfully
 *       401:
 *         description: Unauthorized
 */
router.post(
  "/logout",
  authenticate,
  authController.logout
);

module.exports = router;
