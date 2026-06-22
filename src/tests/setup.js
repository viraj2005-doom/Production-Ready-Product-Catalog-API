const path = require("path");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");

dotenv.config({
  path: path.resolve(__dirname, "../../.env.test"),
});

const mockRedisStore = new Map();

jest.mock("../config/redis", () => {
  const expirations = new Map();

  const isExpired = (key) => {
    const expiresAt = expirations.get(key);

    if (!expiresAt || expiresAt > Date.now()) {
      return false;
    }

    mockRedisStore.delete(key);
    expirations.delete(key);
    return true;
  };

  return {
    isOpen: true,
    connect: jest.fn().mockResolvedValue(undefined),
    quit: jest.fn().mockResolvedValue(undefined),
    disconnect: jest.fn().mockResolvedValue(undefined),
    on: jest.fn(),
    get: jest.fn(async (key) => {
      if (isExpired(key)) {
        return null;
      }

      return mockRedisStore.get(key) || null;
    }),
    set: jest.fn(async (key, value, options = {}) => {
      mockRedisStore.set(key, value);

      if (options.EX) {
        expirations.set(key, Date.now() + options.EX * 1000);
      }

      return "OK";
    }),
    del: jest.fn(async (keys) => {
      const keyList = Array.isArray(keys) ? keys : [keys];

      keyList.forEach((key) => {
        mockRedisStore.delete(key);
        expirations.delete(key);
      });

      return keyList.length;
    }),
    keys: jest.fn(async (pattern) => {
      const regex = new RegExp(`^${pattern.replace("*", ".*")}$`);

      return Array.from(mockRedisStore.keys()).filter((key) => {
        return !isExpired(key) && regex.test(key);
      });
    }),
    incr: jest.fn(async (key) => {
      if (isExpired(key)) {
        mockRedisStore.delete(key);
      }

      const nextValue = Number(mockRedisStore.get(key) || 0) + 1;
      mockRedisStore.set(key, String(nextValue));

      return nextValue;
    }),
    expire: jest.fn(async (key, seconds) => {
      expirations.set(key, Date.now() + seconds * 1000);

      return 1;
    }),
    ttl: jest.fn(async (key) => {
      const expiresAt = expirations.get(key);

      if (!expiresAt) {
        return -1;
      }

      return Math.max(0, Math.ceil((expiresAt - Date.now()) / 1000));
    }),
    flushAll: jest.fn(async () => {
      mockRedisStore.clear();
      expirations.clear();

      return "OK";
    }),
  };
});

const pool = require("../config/database");
const redisClient = require("../config/redis");
const { generateAccessToken } = require("../utils/tokenUtils");

const createSchema = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      role VARCHAR(20) DEFAULT 'user',
      refresh_token TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS categories (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) UNIQUE NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS products (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      description TEXT,
      price NUMERIC(10,2) NOT NULL,
      stock_quantity INTEGER DEFAULT 0,
      category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);
};

const resetDatabase = async () => {
  await pool.query(`
    TRUNCATE TABLE products, categories, users
    RESTART IDENTITY CASCADE;
  `);
};

const createTestUser = async ({
  name = "Test User",
  email = "user@test.local",
  password = "password123",
  role = "user",
} = {}) => {
  const hashedPassword = await bcrypt.hash(password, 10);

  const result = await pool.query(
    `
      INSERT INTO users (name, email, password, role)
      VALUES ($1, $2, $3, $4)
      RETURNING id, name, email, role, created_at;
    `,
    [name, email, hashedPassword, role]
  );

  const user = result.rows[0];

  return {
    user,
    password,
    token: generateAccessToken(user),
  };
};

const createTestCategory = async (name = "Electronics") => {
  const result = await pool.query(
    "INSERT INTO categories (name) VALUES ($1) RETURNING *;",
    [name]
  );

  return result.rows[0];
};

const createTestProduct = async ({
  name = "MacBook Pro M4",
  description = "Apple Laptop",
  price = 199999,
  stock_quantity = 10,
  category_id,
} = {}) => {
  const categoryId =
    category_id || (await createTestCategory("Default Category")).id;

  const result = await pool.query(
    `
      INSERT INTO products
      (name, description, price, stock_quantity, category_id)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `,
    [name, description, price, stock_quantity, categoryId]
  );

  return result.rows[0];
};

beforeAll(async () => {
  await createSchema();
});

beforeEach(async () => {
  await resetDatabase();
  await redisClient.flushAll();
});

afterAll(async () => {
  await resetDatabase();
  await pool.end();
});

global.testDb = {
  pool,
  createTestUser,
  createTestCategory,
  createTestProduct,
};
