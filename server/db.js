const { Client } = require('pg');
const uuid = require('uuid');
const cors = require('cors');

// Database client
const client = new Client({
  connectionString: "postgres://postgres:2123@localhost:5432/review_site_db",
});

const createTables = async () => {
  const SQL = `
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp"; -- Enable UUID extension

    DROP TABLE IF EXISTS favorites;
    DROP TABLE IF EXISTS restaurants;
    DROP TABLE IF EXISTS users;

    CREATE TABLE users (
      id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
      username VARCHAR(100) UNIQUE NOT NULL,
      password TEXT NOT NULL
    );

    CREATE TABLE restaurants (
      id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
      name VARCHAR(100) UNIQUE NOT NULL,
      description TEXT
    );

    CREATE TABLE favorites (
      id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
      user_id uuid REFERENCES users(id) ON DELETE CASCADE,
      restaurant_id uuid REFERENCES restaurants(id) ON DELETE CASCADE,
      CONSTRAINT unique_favorite UNIQUE (user_id, restaurant_id)
    );
  `;
  await client.query(SQL);
};

const init = async () => {
  await client.connect();
  await createTables();
};

module.exports = { client, init };