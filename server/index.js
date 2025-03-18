const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { 
    init, 
    createUser, 
    fetchUsers, 
    fetchRestaurants, 
    fetchReviews 
} = require("./db");

const app = express();
const port = 4000;
const SECRET_KEY = "supersecretkey"; 

app.use(express.json()); 

// Initialize db
init()
    .then(() => console.log("Database initialized"))
    .catch(err => console.error("Error initializing database", err));

//  AUTHENTICATION MIDDLEWARE 

// Middleware to authenticate users
const authenticateUser = (req, res, next) => {
    const token = req.header("Authorization");

    if (!token) {
        return res.status(401).json({ error: "Access denied. No token provided." });
    }

    try {
        const decoded = jwt.verify(token.replace("Bearer ", "testing-key"), SECRET_KEY);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(400).json({ error: "Invalid token." });
    }
};

// USER ENDPOINTS

// Register a new user
app.post("/users/register", async (req, res) => {
    const { username, password } = req.body;
    try {
        const newUser = await createUser({ username, password });
        res.status(201).json({ message: "User created successfully", user: newUser });
    } catch (err) {
        console.error("Error creating user:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// User login and JWT token generation
app.post("/users/login", async (req, res) => {
    const { username, password } = req.body;

    try {
        const users = await fetchUsers();
        const user = users.find(u => u.username === username);

        if (!user) {
            return res.status(400).json({ error: "Invalid username or password" });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(400).json({ error: "Invalid username or password" });
        }

        const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, { expiresIn: "1h" });
        res.json({ message: "Login successful", token });
    } catch (err) {
        console.error("Error logging in:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Get current user 
app.get("/users/me", authenticateUser, async (req, res) => {
    res.json({ user: req.user });
});

// RESTAURANT ENDPOINTS 

// Get all restaurants 
app.get("/restaurants", authenticateUser, async (req, res) => {
    try {
        const restaurants = await fetchRestaurants();
        res.json(restaurants);
    } catch (err) {
        console.error("Error fetching restaurants:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Get a single restaurant by ID 
app.get("/restaurants/:restaurantId", authenticateUser, async (req, res) => {
    res.status(501).json({ message: "Fetching a single restaurant not implemented yet" });
});

// Update restaurant details (PATCH) 
app.patch("/restaurants/:restaurantId", authenticateUser, async (req, res) => {
    res.status(501).json({ message: "Updating a restaurant not implemented yet" });
});

//  REVIEWS ENDPOINTS 

// Get all reviews 
app.get("/reviews", authenticateUser, async (req, res) => {
    try {
        const reviews = await fetchReviews();
        res.json(reviews);
    } catch (err) {
        console.error("Error fetching reviews:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Delete a review 
app.delete("/reviews/:reviewId", authenticateUser, async (req, res) => {
    res.status(501).json({ message: "Deleting a review not implemented yet" });
});



app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});