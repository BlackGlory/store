--------------------------------------------------------------------------------
-- Up
--------------------------------------------------------------------------------

-- 在WAL模式下, better-sqlite3可充分发挥性能
PRAGMA journal_mode = WAL;

-- SQLite 会将VARCHAR(255)转换为TEXT, 将BOOLEAN转换为NUMERIC, 使用这些数据类型是出于可读性考虑
-- store资源本身是松散的, 没有自己的表

CREATE TABLE store_item (
  store_id VARCHAR(255) NOT NULL
, item_id  VARCHAR(255) NOT NULL
, type     VARCHAR(255) NOT NULL
, rev      VARCHAR(255) NOT NULL
, payload  TEXT         NOT NULL
, UNIQUE (store_id, item_id)
);

--------------------------------------------------------------------------------
-- Down
--------------------------------------------------------------------------------

PRAGMA journal_mode = DELETE;

DROP TABLE store_items;
