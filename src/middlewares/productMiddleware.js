const { body, validationResult } = require("express-validator");

const validateProduct = [
  body("name").notEmpty().withMessage("Product name is required"),

  body("price").isFloat({ min: 0 }).withMessage("Price must be positive"),

  body("stock_quantity")
    .isInt({ min: 0 })
    .withMessage("Stock quantity must be positive"),

  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }

    next();
  },
];

module.exports = validateProduct;
