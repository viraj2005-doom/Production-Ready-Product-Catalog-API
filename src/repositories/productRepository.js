const pool = require("../config/database");

const createProduct = async (
  name,
  description,
  price,
  stock_quantity,
  category_id
) => {
  const query = `
    INSERT INTO products
    (name, description, price, stock_quantity, category_id)
    VALUES ($1,$2,$3,$4,$5)
    RETURNING *;
  `;

  const values = [
    name,
    description,
    price,
    stock_quantity,
    category_id,
  ];

  const result = await pool.query(query, values);

  return result.rows[0];
};

const getAllProducts = async () => {
  const result = await pool.query(
    "SELECT * FROM products ORDER BY id"
  );

  return result.rows;
};

const getProductById = async (id) => {
  const result = await pool.query(
    "SELECT * FROM products WHERE id=$1",
    [id]
  );

  return result.rows[0];
};

const updateProduct = async (
  id,
  name,
  description,
  price,
  stock_quantity,
  category_id
) => {
  const query = `
  UPDATE products
  SET
      name=$1,
      description=$2,
      price=$3,
      stock_quantity=$4,
      category_id=$5
  WHERE id=$6
  RETURNING *;
  `;

  const values = [
    name,
    description,
    price,
    stock_quantity,
    category_id,
    id,
  ];

  const result = await pool.query(query, values);

  return result.rows[0];
};

const deleteProduct = async (id) => {
  const result = await pool.query(
    "DELETE FROM products WHERE id=$1 RETURNING *",
    [id]
  );

  return result.rows[0];
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};