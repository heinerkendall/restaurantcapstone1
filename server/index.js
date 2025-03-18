const express = require("express");
const { init, createUser, createRestaurant, createReview, fetchRestaurants, fetchUsers, fetchReviews } = require("./db");
const app = express();
const db = require("./db");
const port = 4000;

app.use(express.json());



init().then(() => {
    console.log("Database initialized");
  }).catch(err => {
    console.error("Error initializing database", err);
  });

  app.get("/api/users", async (req, res) => {
    try {
      const users = await fetchUsers();
      res.json(users);
    } catch (err) {
      console.error("Error fetching users", err);
      res.status(500).send("Internal Server Error");
    }
  });

  app.post("/api/users", async (req, res) => {
    const { username, password } = req.body;
    try {
      const newUser = await createUser({ username, password });
      res.status(201).json(newUser);
    } catch (err) {
      console.error("Error creating user", err);
      res.status(500).send("Internal Server Error");
    }
  });

  app.get("/api/restaurants", async (req, res) => {
    try {
      const restaurants = await fetchRestaurants();
      res.json(restaurants);
    } catch (err) {
      console.error("Error fetching restaurants", err);
      res.status(500).send("Internal Server Error");
    }
  });

  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });