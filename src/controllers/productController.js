const productService = require("../services/productService");

const createProduct = async (req, res) => {
  try {
    const product = await productService.createProduct(req.body);

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getAllProducts = async (req, res, next) => {
  try {
    const { page, limit, search, category, sort } = req.query;

    const products = await productService.getAllProducts({
      page: Number(page) || 1,
      limit: Number(limit) || 10,
      search,
      category,
      sort,
    });

    res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await productService.getProductById(req.params.id);

    res.json(product);
  } catch (error) {
    res.status(404).json({
      message: error.message,
    });
  }
};

const updateProduct = async (req, res) => {
  try {
    const product = await productService.updateProduct(req.params.id, req.body);

    res.json(product);
  } catch (error) {
    res.status(404).json({
      message: error.message,
    });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await productService.deleteProduct(req.params.id);

    res.json({
      message: "Product deleted",
      product,
    });
  } catch (error) {
    res.status(404).json({
      message: error.message,
    });
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
