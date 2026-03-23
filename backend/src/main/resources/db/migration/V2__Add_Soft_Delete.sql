-- Add deleted_at column to main entities
ALTER TABLE products ADD COLUMN deleted_at TIMESTAMP;
ALTER TABLE users ADD COLUMN deleted_at TIMESTAMP;
ALTER TABLE orders ADD COLUMN deleted_at TIMESTAMP;

-- Create an index for performance, as we will filter by this column constantly
CREATE INDEX idx_products_deleted_at ON products(deleted_at);
CREATE INDEX idx_users_deleted_at ON users(deleted_at);