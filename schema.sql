CREATE TABLE publishers (
  publisher_id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  address VARCHAR(255),
  phone VARCHAR(50),
  email VARCHAR(100)
);

CREATE TABLE categories (
  category_id SERIAL PRIMARY KEY,
  category_name VARCHAR(100),
  description TEXT
);

CREATE TABLE books (
  book_id SERIAL PRIMARY KEY,
  title VARCHAR(255),
  publisher_id INT REFERENCES publishers(publisher_id),
  publication_year INT,
  isbn VARCHAR(20),
  price DECIMAL,
  category_id INT REFERENCES categories(category_id),
  stock_quantity INT
);

