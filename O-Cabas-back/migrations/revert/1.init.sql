-- Revert ocabas:1.init from pg

BEGIN;

DROP TABLE IF EXISTS
    ordered_products,
    orders,
    products,
    categories,
    producers,
    users

CASCADE;

DROP DOMAIN IF EXISTS
    posnumeric,
    valid_zip_code,
    valid_phone_number,
    valid_email

CASCADE;


COMMIT;
