--------------------------------------------------------------------------------
-- Up
--------------------------------------------------------------------------------

ALTER TABLE store_item
RENAME COLUMN rev TO revision;

--------------------------------------------------------------------------------
-- Down
--------------------------------------------------------------------------------

ALTER TABLE store_item
RENAME COLUMN revision TO rev;