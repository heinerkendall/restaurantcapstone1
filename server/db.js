const pg = require("pg");
const uuid = require("uuid");
const bcrypt = require("bcrypt");

const client = new pg.Client(
  "postgres://postgres:2123@localhost:5432/review_site_db"
);

const createTables = async () => {
    const SQL = `
  DROP TABLE IF EXISTS favorites;
  DROP TABLE IF EXISTS users;
  DROP TABLE IF EXISTS restaurants;
  
  CREATE TABLE users(
  id uuid PRIMARY KEY,
  username VARCHAR(50) UNIQUE,
  password VARCHAR(100)
  );
  
  CREATE TABLE restaurants(
  id uuid PRIMARY KEY,
  name VARCHAR(50)
  );
  
  CREATE TABLE favorites(
  id uuid PRIMARY KEY,
  product_id uuid REFERENCES restaurants(id) NOT NULL,
  user_id uuid REFERENCES users(id) NOT NULL,
  CONSTRAINT unique_product_user UNIQUE (product_id, user_id)
  );
  `;
    await client.query(SQL);
  };
  
  const createProduct = async (name) => {
    const SQL = `INSERT INTO restaurants(id, name) VALUES($1, $2) RETURNING *`;
    const result = await client.query(SQL, [uuid.v4(), name]);
    return result.rows[0];
  };
  
  const createUser = async ({ username, password }) => {
    const SQL = `INSERT INTO users(id, username, password) VALUES($1, $2, $3) RETURNING *`;
    const hashedPassword = await bcrypt.hash(password, 5);
    const result = await client.query(SQL, [uuid.v4(), username, hashedPassword]);
    return result.rows[0];
  };
  
  const createFavorite = async ({ username, name }) => {
    const SQL = `
      INSERT INTO favorites(id, user_id, product_id)
      VALUES($1, (SELECT id FROM users WHERE username = $2), (SELECT id FROM restaurants WHERE name = $3)) 
      RETURNING * `;
    const result = await client.query(SQL, [uuid.v4(), username, name]);
    return result.rows[0];
  };
  
  const fetchUsers = async () => {
    const SQL = `SELECT * FROM users`;
    result = await client.query(SQL);
    return result.rows;
  };
  
  const fetchRestaurants = async () => {
    const SQL = `SELECT * FROM restaurants`;
    result = await client.query(SQL);
    return result.rows;
  };
  
  const fetchFavorites = async (username) => {
    const SQL = `SELECT * FROM favorites WHERE user_id = (SELECT id FROM users WHERE username = $1)`;
    result = await client.query(SQL, [username]);
    return result.rows;
  };
  
  const destroyFavorite = async (username, name) => {
    const SQL = `
      DELETE FROM favorites
      WHERE user_id = (SELECT id FROM users WHERE username = $1) AND product_id = (SELECT id FROM restaurants WHERE name = $2)
    `;
    await client.query(SQL, [username, name]);
  };
  
  const init = async () => {
    await client.connect();
    await createTables();
    await createUser({ username: "heinerkendall", password: "password" });
    await createUser({ username: "dannykopp", password: "password" });
    console.table(await fetchUsers())
  };

  
  module.exports = {
    init,
    createTables,
    createUser,

  };