-- Verify ocabas:1.init on pg

BEGIN;

SELECT * FROM users WHERE false;
SELECT * FROM producers WHERE false;
SELECT * FROM categories WHERE false;
SELECT * FROM products WHERE false;
SELECT * FROM orders WHERE false;
SELECT * FROM ordered_products WHERE false;

ROLLBACK;
