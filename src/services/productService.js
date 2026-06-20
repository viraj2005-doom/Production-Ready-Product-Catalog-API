const productRepository = require("../repositories/productRepository");

const createProduct = async (data) => {
  return await productRepository.createProduct(
    data.name,
    data.description,
    data.price,
    data.stock_quantity,
    data.category_id
  );
};

const getAllProducts = async () => {
  return await productRepository.getAllProducts();
};

const getProductById = async (id) => {
  const product = await productRepository.getProductById(id);

  if (!product) {
    throw new Error("Product not found");
  }

  return product;
};

const updateProduct = async (id, data) => {
  const product = await productRepository.updateProduct(
    id,
    data.name,
    data.description,
    data.price,
    data.stock_quantity,
    data.category_id
  );

  if (!product) {
    throw new Error("Product not found");
  }

  return product;
};

const deleteProduct = async (id) => {
  const product = await productRepository.deleteProduct(id);

  if (!product) {
    throw new Error("Product not found");
  }

  return product;
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};