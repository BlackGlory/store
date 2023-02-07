--------------------------------------------------------------------------------
-- Up
--------------------------------------------------------------------------------

ALTER TABLE store_item
RENAME COLUMN store_id TO namespace;

ALTER TABLE store_item
RENAME COLUMN item_id TO id;

--------------------------------------------------------------------------------
-- Down
--------------------------------------------------------------------------------

ALTER TABLE store_item
RENAME COLUMN namespace TO store_id;

ALTER TABLE store_item
RENAME COLUMN id TO item_id;
