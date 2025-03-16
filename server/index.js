// // backend-starter-repo/index.js
// require('dotenv').config();
// const express = require('express');
// const { Client } = require('pg');
// const cors = require('cors');

// const app = express();
// const port = process.env.PORT || 3000;

// // Middleware
// app.use(cors());
// app.use(express.json());

// // PostgreSQL client setup
// const client = new Client({
//     user: process.env.DB_USER,
//     host: process.env.DB_HOST,
//     database: process.env.DB_NAME,
//     password: process.env.DB_PASSWORD,
//     port: process.env.DB_PORT,
// });

// // Connect to the database
// client.connect()
//     .then(() => console.log('Connected to PostgreSQL'))
//     .catch((err) => console.error('Connection error', err.stack));

// // Example route
// app.get('/api/users', async (req, res) => {
//     try {
//         const result = await client.query('SELECT * FROM users');
//         res.json(result.rows);
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// });

// // Start the server
// app.listen(port, () => {
//     console.log(`Server running on http://localhost:${port}`);
// });

// // CREATE TABLE users (
// //   id SERIAL PRIMARY KEY,
// //   name VARCHAR(100),
// //   email VARCHAR(100)
// // );

// const SQL 
// CREATE TABLE users (`
//     id SERIAL PRIMARY KEY,
//     name VARCHAR(100),
//     email VARCHAR(100),
//     password VARCHAR(255)
// `
// );

// INSERT INTO users (`
//     INSERT INTO users (name, email, password) VALUES ('John Doe', 'john@example.com', 'hashed_password');
// `)

// module.exports = {
    
//   };

const db = require("./db");
const express = require("express");
const app = express();
app.use(express.json());

app.get("/api/users", async (req, res, next) => {
    try {
      const result = await db.fetchUsers();
      res.send(result);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/users/:username/favorites", async (req, res, next) => {
    try {
      const result = await db.fetchFavorites(req.params.username);
      res.send(result);
    } catch (ex) {
      next(ex);
    }
  });

  app.get("/api/products", async (req, res, next) => {
    try {
      const result = await db.fetchProducts();
      res.send(result);
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/users", async (req, res, next) => {
    try {
      const result = await db.createUser({
        username: req.body.username,
        password: req.body.password,
      });
      res.send(result);
    } catch (ex) {
      next(ex);
    }
  });

  app.post("/api/products", async (req, res, next) => {
    try {
      const result = await db.createProduct(req.body.name);
      res.send(result);
    } catch (ex) {
      next(ex);
    }
  });

  app.post("/api/users/:username/favorites", async (req, res, next) => {
    console.log(req.body);
    try {
      res.status(201).send(
        await db.createFavorite({
          username: req.params.username,
          name: req.body.name,
        })
      );
    } catch (ex) {
      next(ex);
    }
  });
  
  app.delete("/api/users/:username/favorites/:name", async (req, res, next) => {
    const { username } = req.params.username;
    const { name } = req.params.name;
  
    try {
      await db.destroyFavorite({
        username: username,
        name: name,
      });
      res.sendStatus(204);
    } catch (ex) {
      next(ex);
    }
  });


const init = async () => {
    app.listen(3000, () => console.log("listening on port 3002"));
  
    db.init();
  };
  
  init();