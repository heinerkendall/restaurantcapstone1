const express = require("express");
const { init, createUser, createRestaurant, createReview, fetchRestaurants, fetchUsers, fetchReviews } = require("./db");
const app = express();
const port = 3003;

app.use(express.json());

init().then(() => {
    console.log("Database initialized");
  }).catch(err => {
    console.error("Error initializing database", err);
  });

  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });