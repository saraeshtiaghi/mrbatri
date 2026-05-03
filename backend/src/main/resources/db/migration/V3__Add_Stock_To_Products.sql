ALTER TABLE products ADD COLUMN stock INT NOT NULL DEFAULT 0;

CREATE INDEX idx_products_stock ON products(stock);
