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

const getAllProducts = async ({
  page = 1,
  limit = 10,
  search = "",
  category,
  sort = "id",
}) => {

  const offset = (page - 1) * limit;

  let query = `
    SELECT *
    FROM products
    WHERE 1=1
  `;

  const values = [];
  let count = 1;

  if (search) {
    query += ` AND name ILIKE $${count}`;
    values.push(`%${search}%`);
    count++;
  }

  if (category) {
    query += ` AND category_id = $${count}`;
    values.push(category);
    count++;
  }

  const allowedSort = [
    "id",
    "name",
    "price",
    "created_at",
  ];

  let sortField = "id";
  let sortOrder = "ASC";

  if (sort) {

    if (sort.startsWith("-")) {
      sortField = sort.substring(1);
      sortOrder = "DESC";
    } else {
      sortField = sort;
    }

    if (!allowedSort.includes(sortField)) {
      sortField = "id";
    }
  }

  query += `
    ORDER BY ${sortField} ${sortOrder}
    LIMIT $${count}
    OFFSET $${count + 1}
  `;

  values.push(limit);
  values.push(offset);

  const result = await pool.query(query, values);

  return result.rows;
};

module.exports = {
  getAllProducts,
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