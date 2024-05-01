-- Deploy ocabas:1.init to pg

BEGIN;

-- validate email format
CREATE DOMAIN valid_email AS TEXT CHECK(VALUE ~ '^[\w\-\.]+@([\w-]+\.)+[\w-]{2,}$');
-- validate phones numbers from france
CREATE DOMAIN valid_phone_number AS TEXT CHECK(VALUE ~ '^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$');
-- validate french zip code
CREATE DOMAIN valid_zip_code AS TEXT CHECK (VALUE ~ '^[\d\-]{5}$');
-- type numeric dont la valeur est strictement supérieur à 0.0 
CREATE DOMAIN posnumeric AS NUMERIC CHECK ( value > 0.00);

CREATE TABLE users (
  id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  firstname TEXT  NOT NULL,
  lastname TEXT  NOT NULL,
  email valid_email UNIQUE NOT NULL,
  password TEXT NOT NULL,
  phone_number valid_phone_number,
  date_of_birth DATE NOT NULL,
  address TEXT NOT NULL,
  zip_code valid_zip_code NOT NULL,
  city TEXT NOT NULL,
  avatar TEXT,
  is_admin BOOLEAN DEFAULT false,
  status BOOLEAN DEFAULT false,
  createdAt TIMESTAMPTZ NOT NULL default(now()),
  updatedAt TIMESTAMPTZ
);

CREATE TABLE producers (
  id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  company TEXT UNIQUE NOT NULL,
  firstname TEXT NOT NULL,
  lastname TEXT NOT NULL,
  description TEXT NOT NULL,
  city TEXT NOT NULL,
  website_url TEXT,
  picture TEXT,
  status BOOLEAN DEFAULT true,
  createdAt TIMESTAMPTZ NOT NULL default(now()),
  updatedAt TIMESTAMPTZ
);

CREATE TABLE categories (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    color VARCHAR(7)
);

CREATE TABLE products (
  id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  producers_id INT NOT NULL REFERENCES producers(id),
  categories_id INT NOT NULL REFERENCES categories(id),
  name TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  unit_type TEXT NOT NULL,
  price posnumeric NOT NULL,
  quantity INT DEFAULT 1,
  picture TEXT,
  status BOOLEAN DEFAULT true,
  createdAt TIMESTAMPTZ NOT NULL default(now()),
  updatedAt TIMESTAMPTZ
);


CREATE TABLE orders (
  id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  users_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  total_price posnumeric NOT NULL,
  status BOOLEAN default true,
  createdAt TIMESTAMPTZ NOT NULL default(now()),
  updatedAt TIMESTAMPTZ
);


CREATE TABLE ordered_products (
    orders_id INT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    products_id INT NOT NULL REFERENCES products(id),
    quantity INT NOT NULL,
    total_price posnumeric NOT NULL,
    createdAt TIMESTAMPTZ NOT NULL default(now()),
    updatedAt TIMESTAMPTZ,
    PRIMARY KEY (orders_id, products_id)
);



COMMIT;
