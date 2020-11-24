--------------------------------------------------------------------------------
-- Up
--------------------------------------------------------------------------------

-- 在WAL模式下, better-sqlite3可充分发挥性能
PRAGMA journal_mode = WAL;

-- SQLite 会将VARCHAR(255)转换为TEXT, 将BOOLEAN转换为NUMERIC, 使用这些数据类型是出于可读性考虑
-- store资源本身是松散的, 没有自己的表

CREATE TABLE store_blacklist (
  store_id VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE store_whitelist (
  store_id VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE store_token_policy (
  store_id              VARCHAR(255) NOT NULL UNIQUE
, write_token_required  BOOLEAN
, read_token_required   BOOLEAN
, delete_token_required BOOLEAN
);

CREATE TABLE store_token (
  store_id          VARCHAR(255) NOT NULL
, token             VARCHAR(255) NOT NULL
, read_permission   BOOLEAN      NOT NULL DEFAULT 0 CHECK(read_permission IN (0,1))
, write_permission  BOOLEAN      NOT NULL DEFAULT 0 CHECK(write_permission IN (0,1))
, delete_permission BOOLEAN      NOT NULL DEFAULT 0 CHECK(delete_permission IN (0,1))
, UNIQUE (token, store_id)
);

CREATE TABLE store_json_schema (
  store_id   VARCHAR(255) NOT NULL UNIQUE
, json_schema TEXT         NOT NULL
);

CREATE TABLE store_revision_policy (
  store_id                 VARCHAR(255) NOT NULL UNIQUE
, update_revision_required BOOLEAN
, delete_revision_required BOOLEAN
);

--------------------------------------------------------------------------------
-- Down
--------------------------------------------------------------------------------

PRAGMA journal_mode = DELETE;

DROP TABLE store_blacklist;
DROP TABLE store_whitelist;
DROP TABLE store_token_policy;
DROP TABLE store_token;
DROP TABLE store_json_schema;
DROP TABLE store_revision_policy;
