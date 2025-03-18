const pg = require("pg");
const uuid = require("uuid");
const bcrypt = require("bcrypt");

const client = new pg.Client(
  "postgres://postgres:2123@localhost:5432/review_site_db"
);


const createCategory = async (name) => {
    const SQL = `INSERT INTO categories(id, name) VALUES($1, $2) RETURNING *`;
    const result = await client.query(SQL, [uuid.v4(), name]);
    return result.rows[0];
  };

  const createPhoto = async (restaurantId, photoUrl) => {
    const SQL = `INSERT INTO restaurant_photos(id, restaurant_id, photo_url) VALUES($1, $2, $3) RETURNING *`;
    const result = await client.query(SQL, [uuid.v4(), restaurantId, photoUrl]);
    return result.rows[0];
  };

  const fetchRestaurantPhotos = async () => {
    const SQL = `SELECT * FROM restaurant_photos`;
    const result = await client.query(SQL);
    return result.rows;
  };

const createTables = async () => {
    const SQL = `
      DROP TABLE IF EXISTS restaurant_photos;
      DROP TABLE IF EXISTS reviews;
      DROP TABLE IF EXISTS favorites;
      DROP TABLE IF EXISTS restaurants;
      DROP TABLE IF EXISTS users;
      DROP TABLE IF EXISTS categories;
  
      CREATE TABLE users(
          id uuid PRIMARY KEY,
          username VARCHAR(50) UNIQUE,
          password VARCHAR(100)
      );
  
      CREATE TABLE restaurants(
          id uuid PRIMARY KEY,
          name VARCHAR(50), 
          description TEXT
      );
  
      CREATE TABLE favorites(
          id uuid PRIMARY KEY,
          product_id uuid REFERENCES restaurants(id) NOT NULL,
          user_id uuid REFERENCES users(id) NOT NULL,
          CONSTRAINT unique_product_user UNIQUE (product_id, user_id)
      );
  
      CREATE TABLE reviews (
          review_id uuid PRIMARY KEY, 
          user_id uuid, 
          restaurant_id uuid, 
          rating INT CHECK (rating BETWEEN 1 AND 5), 
          review_text TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
          FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE
      );
  
      CREATE TABLE restaurant_photos (
          id uuid PRIMARY KEY,
          restaurant_id uuid REFERENCES restaurants(id) ON DELETE CASCADE,
          photo_url TEXT NOT NULL
      );
  
     CREATE TABLE categories (
        id uuid PRIMARY KEY,
        name VARCHAR(50) UNIQUE NOT NULL
    );
    `;
    await client.query(SQL);
  };
  
const createRestaurant = async ({ name, description, photos = [] }) => {
    try {
      console.log("Attempting to insert restaurant:", { name, description });
  
      const SQL = `INSERT INTO restaurants(id, name, description) VALUES($1, $2, $3) RETURNING *`;
      const result = await client.query(SQL, [uuid.v4(), name, description]);
  
      console.log("Inserted restaurant:", result.rows[0]);
  
    
      for (const photo of photos) {
        const photoSQL = `INSERT INTO restaurant_photos(id, restaurant_id, photo_url)
                          VALUES($1, $2, $3)`;
        await client.query(photoSQL, [
          uuid.v4(),
          result.rows[0].id, 
          photo,
        ]);
      }
  
      return result.rows[0];
    } catch (error) {
      console.error("Error inserting restaurant:", error);
    }
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
    try {
      const SQL = `
        SELECT r.name AS restaurant_name, r.description AS restaurant_description, 
               rp.photo_url
        FROM restaurants r
        LEFT JOIN restaurant_photos rp ON r.id = rp.restaurant_id
      `;
      const result = await client.query(SQL);
      console.table(result.rows);
      return result.rows;
    } catch (error) {
      console.error("Error fetching restaurants:", error);
    }
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

  const createReview = async ({ username, restaurantName, rating, reviewText }) => {
    try {
        const SQL = `
            INSERT INTO reviews (review_id, user_id, restaurant_id, rating, review_text)
            VALUES ($1, 
                    (SELECT id FROM users WHERE username = $2 LIMIT 1), 
                    (SELECT id FROM restaurants WHERE name = $3 LIMIT 1), 
                    $4, $5) 
            RETURNING *;
        `;

        const result = await client.query(SQL, [
            uuid.v4(),
            username,
            restaurantName,
            rating,
            reviewText
        ]);

        console.log("Inserted review:", result.rows[0]); 
        return result.rows[0];

    } catch (error) {
        console.error("Error creating review:", error);
    }
};

  const fetchReviews = async () => {
    const SQL = `SELECT * FROM reviews`;
    const result = await client.query(SQL);
    return result.rows;
};


  
const init = async () => {
    await client.connect();
    await createTables();
    
    await createUser({ username: "heinerkendall", password: "password" });
    await createUser({ username: "dannykopp", password: "password" });
  
    await createRestaurant({ name: "chilis", description: "fast food", photos: [
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSnlvLcLo6pbGXZTNsJYBgMbfKTdaF5zlU3Og&s"
      ]});
  
    await createReview({ 
        username: "heinerkendall", 
        restaurantName: "chilis", 
        rating: 5,  
        reviewText: "chili queso is so good" 
    });

  
    console.table(await fetchUsers());
    console.table(await fetchRestaurants());
    console.table(await fetchReviews()); 
    console.table(await fetchRestaurantPhotos());
  };
  

  

  
module.exports = {
    init,
    createTables,
    createUser,
    createRestaurant,
    createCategory,
    createReview,
    fetchUsers,
    fetchRestaurants,
    fetchReviews,
    fetchFavorites,
    destroyFavorite,
    createPhoto,     
    fetchRestaurantPhotos,
  };