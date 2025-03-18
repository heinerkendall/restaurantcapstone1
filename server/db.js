const pg = require("pg");
const uuid = require("uuid");
const bcrypt = require("bcrypt");

const client = new pg.Client("postgres://postgres:2123@localhost:5432/review_site_db");

const createTables = async () => {
    const SQL = `
       
        DROP TABLE IF EXISTS reviews;
        DROP TABLE IF EXISTS favorites;
        DROP TABLE IF EXISTS restaurant_photos;
        DROP TABLE IF EXISTS categories;
        DROP TABLE IF EXISTS restaurants;
        DROP TABLE IF EXISTS users;

      
        CREATE TABLE users (
            id UUID PRIMARY KEY,
            username VARCHAR(50) UNIQUE NOT NULL,
            password VARCHAR(100) NOT NULL
        );

       
        CREATE TABLE restaurants (
            id UUID PRIMARY KEY,
            name VARCHAR(50) NOT NULL, 
            description TEXT
        );

       
        CREATE TABLE categories (
            id UUID PRIMARY KEY,
            name VARCHAR(50) UNIQUE NOT NULL
        );

       
        CREATE TABLE reviews (
            id UUID PRIMARY KEY, 
            user_id UUID REFERENCES users(id) ON DELETE CASCADE, 
            restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE, 
            rating INT CHECK (rating BETWEEN 1 AND 5), 
            review_text TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

       
        CREATE TABLE favorites (
            id UUID PRIMARY KEY,
            user_id UUID REFERENCES users(id) ON DELETE CASCADE,
            restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,
            CONSTRAINT unique_user_restaurant UNIQUE (user_id, restaurant_id)
        );

       
        CREATE TABLE restaurant_photos (
            id UUID PRIMARY KEY,
            restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,
            photo_url TEXT NOT NULL
        );
    `;
    await client.query(SQL);
};
// User functions
const createUser = async ({ username, password }) => {
    const hashedPassword = await bcrypt.hash(password, 5);
    const SQL = `INSERT INTO users(id, username, password) VALUES($1, $2, $3) RETURNING *`;
    const result = await client.query(SQL, [uuid.v4(), username, hashedPassword]);
    return result.rows[0];
};

const fetchUsers = async () => {
    const SQL = `SELECT * FROM users`;
    const result = await client.query(SQL);
    return result.rows;
};

const loginUser = async ({ username, password }) => {
    const SQL = `SELECT * FROM users WHERE username = $1`;
    const result = await client.query(SQL, [username]);

    if (!result.rows.length) return null;
    const user = result.rows[0];

    const isMatch = await bcrypt.compare(password, user.password);
    return isMatch ? user : null;
};

const getUser = async (id) => {
    const SQL = `SELECT id, username FROM users WHERE id = $1`;
    const result = await client.query(SQL, [id]);
    return result.rows[0];
};

// Restaurant functions
const fetchRestaurants = async () => {
    const SQL = `SELECT * FROM restaurants`;
    const result = await client.query(SQL);
    return result.rows;
};

const fetchRestaurantById = async (restaurantId) => {
    const SQL = `SELECT * FROM restaurants WHERE id = $1`;
    const result = await client.query(SQL, [restaurantId]);
    return result.rows[0];
};

const updateRestaurant = async (restaurantId, description) => {
    const SQL = `UPDATE restaurants SET description = $1 WHERE id = $2 RETURNING *`;
    const result = await client.query(SQL, [description, restaurantId]);
    return result.rows[0];
};

// Review functions
const fetchReviews = async () => {
    const SQL = `SELECT * FROM reviews`;
    const result = await client.query(SQL);
    return result.rows;
};

const deleteReview = async (reviewId) => {
    const SQL = `DELETE FROM reviews WHERE id = $1 RETURNING *`;
    const result = await client.query(SQL, [reviewId]);
    return result.rows[0];
};

// Initialize database
const init = async () => {
    await client.connect();
    await createTables();
    console.log("Database initialized");
};

module.exports = {
    init,
    createUser,
    fetchUsers,
    loginUser,
    getUser,
    fetchRestaurants,
    fetchRestaurantById,
    updateRestaurant,
    fetchReviews,
    deleteReview
};