// src/routes/userRoutes.js

const express = require("express");

const router = express.Router();

const authenticate =
  require("../middlewares/authMiddleware");

const userController =
  require("../controllers/userController");

/**
 * @swagger
 * /users/profile:
 *   get:
 *     summary: Get User Profile
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile returned
 *       401:
 *         description: Unauthorized
 */
router.get(
  "/profile",
  authenticate,
  userController.getProfile
);

module.exports = router;