import React, { useState, useEffect } from 'react';

const saveRestaurant = async (restaurantId) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in to save restaurants.");
      return;
    }

    const res = await fetch("http://localhost:6001/api/users/save-restaurant", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ restaurantId }),
    });

    const data = await res.json();
    if (res.ok) {
      alert("Restaurant saved successfully!");
    } else {
      alert(data.message);
    }
  } catch (err) {
    console.error("Error saving restaurant:", err);
  }
};

const Restaurants = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await fetch("http://localhost:6001/api/restaurants", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`, 
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch restaurants");
        }

        const data = await response.json();
        setRestaurants(data);  
        setLoading(false);  
      } catch (err) {
        setError(err.message);  
        setLoading(false);
      }
    };

    fetchRestaurants();  
  }, []);  

  if (loading) {
    return <p>Loading restaurants...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div>
      <h2>Restaurants</h2>
      <ul>
        {restaurants.map((restaurant) => (
          <li key={restaurant.id}>
            <img 
              src="https://cdn.vectorstock.com/i/500p/75/55/restaurant-building-city-background-street-vector-26247555.jpg" 
              alt="Restaurant" 
              style={{ width: '150px', height: '150px', objectFit: 'cover' }} 
            />
            <h3>{restaurant.name}</h3>
            <p>{restaurant.location}</p>
            <button onClick={() => saveRestaurant(restaurant.id)}>Save</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Restaurants;
