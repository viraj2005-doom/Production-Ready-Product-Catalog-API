CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,

    name VARCHAR(255) NOT NULL,

    description TEXT,

    price NUMERIC(10,2) NOT NULL,

    stock_quantity INTEGER DEFAULT 0,

    category_id INTEGER,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_category
    FOREIGN KEY(category_id)
    REFERENCES categories(id)
    ON DELETE SET NULL
);