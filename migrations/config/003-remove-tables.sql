--------------------------------------------------------------------------------
-- Up
--------------------------------------------------------------------------------

DROP TABLE store_blacklist;
DROP TABLE store_whitelist;
DROP TABLE store_token_policy;
DROP TABLE store_token;
DROP TABLE store_json_schema;

--------------------------------------------------------------------------------
-- Down
--------------------------------------------------------------------------------

CREATE TABLE store_blacklist (
  namespace VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE store_whitelist (
  namespace VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE store_token_policy (
  namespace             VARCHAR(255) NOT NULL UNIQUE
, write_token_required  BOOLEAN
, read_token_required   BOOLEAN
, delete_token_required BOOLEAN
);

CREATE TABLE store_token (
  namespace         VARCHAR(255) NOT NULL
, token             VARCHAR(255) NOT NULL
, read_permission   BOOLEAN      NOT NULL DEFAULT 0 CHECK(read_permission IN (0,1))
, write_permission  BOOLEAN      NOT NULL DEFAULT 0 CHECK(write_permission IN (0,1))
, delete_permission BOOLEAN      NOT NULL DEFAULT 0 CHECK(delete_permission IN (0,1))
, UNIQUE (token, namespace)
);

CREATE TABLE store_json_schema (
  namespace   VARCHAR(255) NOT NULL UNIQUE
, json_schema TEXT         NOT NULL
);
