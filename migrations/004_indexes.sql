CREATE INDEX IF NOT EXISTS idx_users_email
ON users(email);

CREATE INDEX IF NOT EXISTS idx_products_name
ON products(name);

CREATE INDEX IF NOT EXISTS idx_products_category
ON products(category_id);
