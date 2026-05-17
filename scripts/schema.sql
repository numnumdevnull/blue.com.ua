-- schema.sql — source of truth for the Blue database structure
-- Run this on a fresh MySQL 8 instance to initialize the schema.
-- After running schema.sql, run: npm run seed

CREATE TABLE IF NOT EXISTS tree_types (
  id    INT AUTO_INCREMENT PRIMARY KEY,
  value VARCHAR(255) NOT NULL
);

INSERT IGNORE INTO tree_types (id, value)
VALUES (1, 'Головна'), (2, 'Категорія'), (3, 'Товар'), (4, 'Сторінка');

CREATE TABLE IF NOT EXISTS tree (
  id         BIGINT AUTO_INCREMENT PRIMARY KEY,
  type_id    INT NOT NULL,
  slug       VARCHAR(255) NOT NULL UNIQUE,
  value      VARCHAR(255) NOT NULL,
  meta       JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_tree_type FOREIGN KEY (type_id) REFERENCES tree_types (id),
  INDEX idx_type (type_id),
  INDEX idx_created (created_at)
);

CREATE TABLE IF NOT EXISTS tree_parents (
  parent_id BIGINT NOT NULL,
  child_id  BIGINT NOT NULL,
  PRIMARY KEY (parent_id, child_id),
  INDEX idx_parent (parent_id),
  INDEX idx_child  (child_id),
  CONSTRAINT fk_parent FOREIGN KEY (parent_id) REFERENCES tree (id) ON DELETE CASCADE,
  CONSTRAINT fk_child  FOREIGN KEY (child_id)  REFERENCES tree (id) ON DELETE CASCADE
);

-- Orders tables (Sprint 4 — add when implementing cart/payment)
-- CREATE TABLE IF NOT EXISTS orders ( ... );
-- CREATE TABLE IF NOT EXISTS order_items ( ... );
