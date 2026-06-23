const express = require("express");

const router = express.Router();
/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health Check
 *     description: Returns application health status.
 *     tags:
 *       - Health
 *     responses:
 *       200:
 *         description: Application is healthy
 *         content:
 *           application/json:
 *             example:
 *               status: healthy
 *               service: product-catalog-api
 */
router.get("/", (req, res) => {
  res.status(200).json({
    status: "healthy",
    service: "product-catalog-api",
  });
});

module.exports = router;
