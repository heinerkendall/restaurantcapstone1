const express = require('express');
const bcrypt = require('bcrypt');
const { client, init } = require('./db');
const uuid = require('uuid');
const db = require("./db");
const cors = require("cors");


const app = express();
const port = 4000;

app.use(express.json());
app.use(cors());

// Middleware to parse JSON
app.use(express.json());

// User Routes
app.post('/users', async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  
  const SQL = 'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *';
  const result = await client.query(SQL, [username, hashedPassword]);
  res.status(201).json(result.rows[0]);
});

app.get('/users', async (req, res) => {
  const result = await client.query('SELECT * FROM users');
  res.json(result.rows);
});

app.post("/api/users/register", async (req, res, next) => {
  try {
    const { username, password } = req.body;
    
    const hashedPassword = await bcrypt.hash(password, 10);

    const SQL = `INSERT INTO users(username, password) VALUES($1, $2) RETURNING *`;
    const result = await client.query(SQL, [username, hashedPassword]);

    res.json(result.rows[0]);
  } catch (ex) {
    next(ex);
  }
});

app.post("/api/users/login", async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const SQL = "SELECT * FROM users WHERE username = $1";
    const result = await client.query(SQL, [username]);
    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({ error: "Invalid username or password username" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      SECRET_KEY,
      { expiresIn: "1h" }
    );

    res.json({ message: "Login successful", token, user });
  } catch (error) {
    next(error);
  }
});
// Restaurant Routes
app.post('/restaurants', async (req, res) => {
  const { name, description } = req.body;

  const SQL = 'INSERT INTO restaurants (name, description) VALUES ($1, $2) RETURNING *';
  const result = await client.query(SQL, [name, description]);
  res.status(201).json(result.rows[0]);
});

app.get('/restaurants', async (req, res) => {
  const result = await client.query('SELECT * FROM restaurants');
  res.json(result.rows);
});

// // Favorites Routes
// app.post('/favorites', async (req, res) => {
//   const { user_id, restaurant_id } = req.body;

//   const SQL = `
//     INSERT INTO favorites (user_id, restaurant_id)
//     VALUES ($1, $2) 
//     ON CONFLICT (user_id, restaurant_id) DO NOTHING
//     RETURNING *
//   `;
//   const result = await client.query(SQL, [user_id, restaurant_id]);
  
//   if (result.rows.length === 0) {
//     return res.status(400).json({ message: 'Favorite already exists' });
//   }

//   res.status(201).json(result.rows[0]);
// });

// app.delete('/favorites', async (req, res) => {
//   const { user_id, restaurant_id } = req.body;

//   const SQL = 'DELETE FROM favorites WHERE user_id = $1 AND restaurant_id = $2 RETURNING *';
//   const65 result = await client.query(SQL, [user_id, restaurant_id]);

//   if (result.rows.length === 0) {
//     return res.status(404).json({ message: 'Favorite not found' });
//   }

//   res.status(200).json({ message: 'Favorite removed successfully' });
// });

// Start the server
init()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error('Error initializing database:', error);
  });