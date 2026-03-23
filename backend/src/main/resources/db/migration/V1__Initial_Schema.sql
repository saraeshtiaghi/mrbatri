-- 1. Users Table
CREATE TABLE users
(
    id        BIGSERIAL PRIMARY KEY,
    phone     VARCHAR(20) UNIQUE NOT NULL,
    role      VARCHAR(20)        NOT NULL DEFAULT 'USER',
    joined_at TIMESTAMP          NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 2. Products Table
CREATE TABLE products
(
    id          BIGSERIAL PRIMARY KEY,
    name        VARCHAR(255)   NOT NULL,
    price       DECIMAL(10, 2) NOT NULL,
    category    VARCHAR(100)   NOT NULL,
    image_url   TEXT           NOT NULL,
    description TEXT           NOT NULL,
    created_at  TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 3. Orders Table
CREATE TABLE orders
(
    id               UUID PRIMARY KEY        DEFAULT gen_random_uuid(),
    user_id          BIGINT         NOT NULL REFERENCES users (id),
    customer_phone   VARCHAR(20)    NOT NULL,
    full_name        VARCHAR(255),
    shipping_address TEXT,
    status           VARCHAR(20)    NOT NULL DEFAULT 'Pending',
    total_amount     DECIMAL(10, 2) NOT NULL,
    created_at       TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 4. Order Items Table
CREATE TABLE order_items
(
    id         BIGSERIAL PRIMARY KEY,
    order_id   UUID           NOT NULL REFERENCES orders (id) ON DELETE CASCADE,
    product_id BIGINT REFERENCES products (id), -- Optional link to original product
    name       VARCHAR(255)   NOT NULL,
    quantity   INT            NOT NULL,
    price      DECIMAL(10, 2) NOT NULL,
    image_url  TEXT           NOT NULL
);