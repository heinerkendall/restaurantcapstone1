require("dotenv").config();
const express = require("express");
const { Client } = require("pg");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();
const port = process.env.PORT || 6001;
const saltRounds = 10;
const SECRET_KEY = process.env.JWT_SECRET || "supersecretkey";

// PostgreSQL client setup
const client = new Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Middleware
app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
  console.log("Request Body:", req.body); 
  next();
});

// Connect to the database
client.connect()
  .then(() => console.log("Connected to PostgreSQL"))
  .catch((err) => console.error("Connection error", err.stack));

// Authentication middleware
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; 
  
  if (!token) return res.status(401).json({ error: "Token is required" });
  
  try {
    const decoded = jwt.verify(token, SECRET_KEY); 
    req.user = decoded; 
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid or expired token" });
  }
};

// Routes

// Get all users
app.get("/api/users", async (req, res) => {
  try {
    const result = await client.query("SELECT id, username FROM users");
    if (result.rows.length === 0) return res.status(404).json({ error: "No users found" });
    res.json(result.rows);
  } catch (err) {
    console.error("Error executing query", err.stack);
    res.status(500).json({ error: err.message });
  }
});


app.get("/api/users/me", authenticate, async (req, res) => {
  try {
    const result = await client.query("SELECT id, username FROM users WHERE id = $1", [req.user.id]);
    if (result.rows.length === 0) return res.status(404).json({ message: "User not found" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Register new user
app.post("/api/users/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ message: "Username and password are required." });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Save user to DB
    const result = await client.query("INSERT INTO users(username, password) VALUES($1, $2) RETURNING id, username", [username, hashedPassword]);
    const user = result.rows[0];

    // Generate JWT token
    const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, { expiresIn: "1h" });

    res.json({ token, user });
  } catch (err) {
    console.error("Error during registration:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Login user
app.post("/api/users/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: "Username and password are required" });

    const result = await client.query("SELECT * FROM users WHERE username = $1", [username]);
    if (result.rows.length === 0) return res.status(401).json({ error: "Invalid username or password" });

    const user = result.rows[0];
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) return res.status(401).json({ error: "Invalid username or password" });

    const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, { expiresIn: "1h" });
    res.json({ token });
  } catch (err) {
    console.error("Error during login:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Save a restaurant for a user
app.post("/api/users/save-restaurant", authenticate, async (req, res) => {
  try {
    const { restaurantId } = req.body;
    if (!restaurantId) return res.status(400).json({ message: "Restaurant ID is required" });

    
    const checkRestaurant = await client.query("SELECT id FROM restaurants WHERE id = $1", [restaurantId]);
    if (checkRestaurant.rows.length === 0) return res.status(400).json({ message: "Restaurant not found" });

    await client.query("INSERT INTO saved_restaurants (restaurant_id, user_id) VALUES ($1, $2)", [restaurantId, req.user.id]);
    res.status(200).json({ message: "Restaurant saved successfully" });
  } catch (err) {
    console.error("Error saving restaurant:", err);
    res.status(500).json({ error: err.message });
  }
  
});

// Get saved restaurants for the user
app.get("/api/users/saved-restaurants", authenticate, async (req, res) => {
  try {
    const result = await client.query(
      `SELECT r.id, r.name, r.location 
       FROM saved_restaurants sr
       JOIN restaurants r ON sr.restaurant_id = r.id
       WHERE sr.user_id = $1`,
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching saved restaurants:", err);
    res.status(500).json({ error: err.message });
  }
});

// Get all restaurants
app.get("/api/restaurants", async (req, res) => {
  try {
    const result = await client.query("SELECT * FROM restaurants");
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching restaurants:", error);
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/api/restaurants", authenticate, async (req, res) => {
  const { name, location } = req.body;
  
  if (!name || !location) {
    return res.status(400).json({ message: "Name and location are required" });
  }

  try {
    const result = await client.query(
      "INSERT INTO restaurants (name, location) VALUES ($1, $2) RETURNING id, name, location",
      [name, location]
    );
    
    const newRestaurant = result.rows[0];
    res.status(201).json(newRestaurant); 
  } catch (err) {
    console.error("Error adding restaurant:", err);
    res.status(500).json({ error: err.message });
  }
});
// Delete Saved Resturaunt
app.delete("/api/users/delete-saved-restaurant", authenticate, async (req, res) => {
  try {
    const { restaurantId } = req.body;
    if (!restaurantId) return res.status(400).json({ message: "Restaurant ID is required" });


    const checkSavedRestaurant = await client.query(
      "SELECT id FROM saved_restaurants WHERE restaurant_id = $1 AND user_id = $2", 
      [restaurantId, req.user.id]
    );
    if (checkSavedRestaurant.rows.length === 0) {
      return res.status(400).json({ message: "Restaurant not found in saved list" });
    }

   
    await client.query("DELETE FROM saved_restaurants WHERE restaurant_id = $1 AND user_id = $2", [restaurantId, req.user.id]);
    
    res.status(200).json({ message: "Restaurant removed from saved list" });
  } catch (err) {
    console.error("Error deleting saved restaurant:", err);
    res.status(500).json({ error: err.message });
  }
});

// Delete restaurant by ID
app.delete("/api/restaurants/:restaurantId", authenticate, async (req, res) => {
  try {
    const { restaurantId } = req.params;

    const result = await client.query("DELETE FROM restaurants WHERE id = $1 RETURNING id", [restaurantId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    res.status(200).json({ message: "Restaurant deleted successfully" });
  } catch (err) {
    console.error("Error deleting restaurant:", err);
    res.status(500).json({ error: err.message });
  }
});



const init = async () => {
  try {
    const hashedPassword1 = await bcrypt.hash("password123", saltRounds);
    const hashedPassword2 = await bcrypt.hash("password456", saltRounds);
    
    await client.query("DROP TABLE IF EXISTS reviews CASCADE;");
    await client.query("DROP TABLE IF EXISTS saved_restaurants CASCADE;");
    await client.query("DROP TABLE IF EXISTS restaurants CASCADE;");
    await client.query("DROP TABLE IF EXISTS users CASCADE;");

    const SQL = `
    CREATE TABLE users (
      id SERIAL PRIMARY KEY,
      username VARCHAR(100) UNIQUE NOT NULL,
      password TEXT NOT NULL
    );

    CREATE TABLE restaurants (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100),
      location TEXT NOT NULL
    );

    CREATE TABLE saved_restaurants (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      restaurant_id INTEGER REFERENCES restaurants(id) ON DELETE CASCADE,
      UNIQUE(user_id, restaurant_id)
    );

    INSERT INTO users (username, password) VALUES
      ('john_doe', '${hashedPassword1}'),
      ('jane_smith', '${hashedPassword2}');

    INSERT INTO restaurants (name, location) VALUES
      ('Papa Johns', 'NY, NY'),
      ('Bahamama Mama', 'Houston, TX'),
      ('Kusty Krab', 'Bikkini Bottom'),
      ('Chum Bucket', 'Bikkini Bottom'),
      ('Grandmas House', 'Huntington, WV'),
      ('Grandpas Garage Bar', 'Bozeman, MT'),
      ('The Hub', 'Point Place, WI');


    `;
    await client.query(SQL);
    console.log("Tables created and data inserted.");
  } catch (err) {
    console.error("Error creating tables or inserting data:", err);
  }
};

init().then(() => {
  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
});
