const pool = require("../config/database");

const createUser = async ({
  name,
  email,
  password,
  role = "user",
}) => {
  const query = `
    INSERT INTO users
    (name,email,password,role)
    VALUES ($1,$2,$3,$4)
    RETURNING id,name,email,role,created_at
  `;

  const values = [name, email, password, role];

  const result = await pool.query(query, values);

  return result.rows[0];
};

const findByEmail = async (email) => {
  const result = await pool.query(
    "SELECT * FROM users WHERE email = $1",
    [email]
  );

  return result.rows[0];
};

const findById = async (id) => {
  const result = await pool.query(
    "SELECT id,name,email,role,created_at FROM users WHERE id = $1",
    [id]
  );

  return result.rows[0];
};

const saveRefreshToken = async (userId, refreshToken) => {
  await pool.query(
    "UPDATE users SET refresh_token = $1 WHERE id = $2",
    [refreshToken, userId]
  );
};

const removeRefreshToken = async (userId) => {
  await pool.query(
    "UPDATE users SET refresh_token = NULL WHERE id = $1",
    [userId]
  );
};

const findByRefreshToken = async (
  refreshToken
) => {

  const result = await pool.query(
    `
    SELECT *
    FROM users
    WHERE refresh_token = $1
    `,
    [refreshToken]
  );

  return result.rows[0];
};

module.exports = {
  createUser,
  findByEmail,
  findById,
  saveRefreshToken,
  removeRefreshToken,
  findByRefreshToken,
};