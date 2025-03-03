const express = require('express');
const { Pool } = require('pg');
const app = express();
const port = 3001;

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'library',
  password: 'trust', 
  port: 5432
});

pool.connect()
  .then(() => console.log('PostgreSQL Connected'))
  .catch(err => console.error('PostgreSQL connection failed:', err));

app.use(express.json());

app.get('/books', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM books');
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.get('/books/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM books WHERE book_id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).send('Book not found');
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.post('/books', async (req, res) => {
	const { title, author, publisher_id, publication_year, isbn, price, category_id, stock_quantity } = req.body;
  
	if (!title || !author || !publisher_id || !publication_year || !isbn || !price || !category_id || !stock_quantity) {
	  return res.status(400).send('All fields are required');
	}
  
	try {
	  const result = await pool.query(
		'INSERT INTO books (title, author, publisher_id, publication_year, isbn, price, category_id, stock_quantity) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
		[title, author, publisher_id, publication_year, isbn, price, category_id, stock_quantity]
	  );
	  res.status(201).json(result.rows[0]);
	} catch (err) {
	  res.status(500).send(err.message);
	}
  });

app.put('/books/:id', async (req, res) => {
  const { id } = req.params;
  const { title, author, publisher_id, publication_year, isbn, price, category_id, stock_quantity } = req.body;
  try {
    const result = await pool.query(
      'UPDATE books SET title = $1, author = $2, publisher_id = $3, publication_year = $4, isbn = $5, price = $6, category_id = $7, stock_quantity = $8 WHERE book_id = $9 RETURNING *',
      [title, author, publisher_id, publication_year, isbn, price, category_id, stock_quantity, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).send('Book not found');
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.delete('/books/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM books WHERE book_id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).send('Book not found');
    }
    res.status(200).send('Book deleted successfully');
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.get('/publishers', async (req, res) => {
	try {
	  const result = await pool.query('SELECT * FROM publishers');
	  res.status(200).json(result.rows);
	} catch (err) {
	  res.status(500).send(err.message);
	}
  });

  app.get('/publishers/:id', async (req, res) => {
	const { id } = req.params;
	try {
	  const result = await pool.query('SELECT * FROM publishers WHERE publisher_id = $1', [id]);
	  if (result.rows.length === 0) {
		return res.status(404).send('Publisher not found');
	  }
	  res.status(200).json(result.rows[0]);
	} catch (err) {
	  res.status(500).send(err.message);
	}
  });

  app.post('/publishers', async (req, res) => {
	const { name, address, phone, email } = req.body;
	if (!name || !address || !phone || !email) {
	  return res.status(400).send('All fields are required');
	}
	try {
	  const result = await pool.query(
		'INSERT INTO publishers (name, address, phone, email) VALUES ($1, $2, $3, $4) RETURNING *',
		[name, address, phone, email]
	  );
	  res.status(201).json(result.rows[0]);
	} catch (err) {
	  res.status(500).send(err.message);
	}
  });

  app.put('/publishers/:id', async (req, res) => {
	const { id } = req.params;
	const { name, address, phone, email } = req.body;
	try {
	  const result = await pool.query(
		'UPDATE publishers SET name = $1, address = $2, phone = $3, email = $4 WHERE publisher_id = $5 RETURNING *',
		[name, address, phone, email, id]
	  );
	  if (result.rows.length === 0) {
		return res.status(404).send('Publisher not found');
	  }
	  res.status(200).json(result.rows[0]);
	} catch (err) {
	  res.status(500).send(err.message);
	}
  });

  app.delete('/publishers/:id', async (req, res) => {
	const { id } = req.params;
	try {
	  const result = await pool.query('DELETE FROM publishers WHERE publisher_id = $1 RETURNING *', [id]);
	  if (result.rows.length === 0) {
		return res.status(404).send('Publisher not found');
	  }
	  res.status(200).send('Publisher deleted successfully');
	} catch (err) {
	  res.status(500).send(err.message);
	}
  });

app.get('/categories', async (req, res) => {
	try {
	  const result = await pool.query('SELECT * FROM categories');
	  res.status(200).json(result.rows);
	} catch (err) {
	  res.status(500).send(err.message);
	}
  });

  app.get('/categories/:id', async (req, res) => {
	const { id } = req.params;
	try {
	  const result = await pool.query('SELECT * FROM categories WHERE category_id = $1', [id]);
	  if (result.rows.length === 0) {
		return res.status(404).send('Category not found');
	  }
	  res.status(200).json(result.rows[0]);
	} catch (err) {
	  res.status(500).send(err.message);
	}
  });

  app.post('/categories', async (req, res) => {
	const { category_name, description } = req.body;
	if (!category_name || !description) {
	  return res.status(400).send('All fields are required');
	}
	try {
	  const result = await pool.query(
		'INSERT INTO categories (category_name, description) VALUES ($1, $2) RETURNING *',
		[category_name, description]
	  );
	  res.status(201).json(result.rows[0]);
	} catch (err) {
	  res.status(500).send(err.message);
	}
  });

  app.put('/categories/:id', async (req, res) => {
	const { id } = req.params;
	const { category_name, description } = req.body;
	try {
	  const result = await pool.query(
		'UPDATE categories SET category_name = $1, description = $2 WHERE category_id = $3 RETURNING *',
		[category_name, description, id]
	  );
	  if (result.rows.length === 0) {
		return res.status(404).send('Category not found');
	  }
	  res.status(200).json(result.rows[0]);
	} catch (err) {
	  res.status(500).send(err.message);
	}
  });

  app.delete('/categories/:id', async (req, res) => {
	const { id } = req.params;
	try {
	  const result = await pool.query('DELETE FROM categories WHERE category_id = $1 RETURNING *', [id]);
	  if (result.rows.length === 0) {
		return res.status(404).send('Category not found');
	  }
	  res.status(200).send('Category deleted successfully');
	} catch (err) {
	  res.status(500).send(err.message);
	}
  });

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
