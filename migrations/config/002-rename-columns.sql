--------------------------------------------------------------------------------
-- Up
--------------------------------------------------------------------------------

ALTER TABLE store_blacklist
RENAME COLUMN store_id TO namespace;

ALTER TABLE store_whitelist
RENAME COLUMN store_id TO namespace;

ALTER TABLE store_token_policy
RENAME COLUMN store_id TO namespace;

ALTER TABLE store_token
RENAME COLUMN store_id TO namespace;

ALTER TABLE store_json_schema
RENAME COLUMN store_id TO namespace;

ALTER TABLE store_revision_policy
RENAME COLUMN store_id TO namespace;

--------------------------------------------------------------------------------
-- Down
--------------------------------------------------------------------------------

ALTER TABLE store_blacklist
RENAME COLUMN namespace TO store_id;

ALTER TABLE store_whitelist
RENAME COLUMN namespace TO store_id;

ALTER TABLE store_token_policy
RENAME COLUMN namespace TO store_id;

ALTER TABLE store_token
RENAME COLUMN namespace TO store_id;

ALTER TABLE store_json_schema
RENAME COLUMN namespace TO store_id;

ALTER TABLE store_revision_policy
RENAME COLUMN namespace TO store_id;
