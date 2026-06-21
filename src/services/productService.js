const productRepository = require("../repositories/productRepository");
const { getCache, setCache, deleteCache } = require("../config/cache");

const createProduct = async (data) => {

  const product =
    await productRepository.createProduct(
      data.name,
      data.description,
      data.price,
      data.stock_quantity,
      data.category_id
    );

  const keys =
    await require("../config/redis")
      .keys("products:*");

  if (keys.length > 0) {
    await require("../config/redis")
      .del(keys);
  }

  return product;
};

const getAllProducts = async (queryParams) => {

  const cacheKey =
    `products:${JSON.stringify(queryParams)}`;

  const cachedProducts =
    await getCache(cacheKey);

  if (cachedProducts) {

    console.log("CACHE HIT:", cacheKey);

    return cachedProducts;
  }

  console.log("CACHE MISS:", cacheKey);

  const products =
    await productRepository.getAllProducts(
      queryParams
    );

  await setCache(
    cacheKey,
    products
  );

  return products;
};

const getProductById = async (id) => {

  const cacheKey = `product:${id}`;

  const cachedProduct = await getCache(cacheKey);

  if (cachedProduct) {
    console.log("CACHE HIT:", cacheKey);
    return cachedProduct;
  }

  console.log("CACHE MISS:", cacheKey);

  const product = await productRepository.getProductById(id);

  if (!product) {
    throw new Error("Product not found");
  }

  await setCache(cacheKey, product);

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

  await deleteCache(`product:${id}`); // data invalidation ne prevent karva mate jethi stale data redis ma na rahe 

  const keys =
    await require("../config/redis")
      .keys("products:*");

  if (keys.length > 0) {
    await require("../config/redis")
      .del(keys);
  }

  return product;
};

const deleteProduct = async (id) => {
  const product = await productRepository.deleteProduct(id);

  if (!product) {
    throw new Error("Product not found");
  }

  await deleteCache(`product:${id}`);

  const keys =
    await require("../config/redis")
      .keys("products:*");

  if (keys.length > 0) {
    await require("../config/redis")
      .del(keys);
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