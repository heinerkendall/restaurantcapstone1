import React, { useState, useEffect } from 'react';

const Restaurants = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  
  const [formData, setFormData] = useState({
    name: '',
    location: '',
  });

 
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

 
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const newRestaurant = {
      name: formData.name,
      location: formData.location,
    };

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('You must be logged in to add a restaurant.');
        return;
      }

      const response = await fetch("http://localhost:6001/api/restaurants", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(newRestaurant),
      });


      if (!response.ok) {
        const errorText = await response.text(); 
        console.error("Error response:", errorText); 
        throw new Error(errorText);
      }

      const data = await response.json(); 
      console.log("New restaurant added:", data);
     
      setRestaurants((prev) => [...prev, data]); 
    } catch (err) {
      console.error("Error adding restaurant:", err);
    }
  };

  const handleSaveRestaurant = async (restaurantId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('You must be logged in to save a restaurant.');
        return;
      }
      const response = await fetch("http://localhost:6001/api/users/save-restaurant", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`, 
        },
        body: JSON.stringify({ restaurantId }),
      });
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error saving restaurant:", errorText);
        throw new Error(errorText);
      }
      const data = await response.json();
      console.log("Restaurant saved:", data);
      alert('Restaurant saved successfully!');
    } catch (err) {
      console.error("Error saving restaurant:", err);
    }
  };

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

     
      <form onSubmit={handleFormSubmit}>
        <h3>Add New Restaurant</h3>
        <input
          type="text"
          name="name"
          placeholder="Restaurant Name"
          value={formData.name}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="location"
          placeholder="Restaurant Location"
          value={formData.location}
          onChange={handleInputChange}
          required
        />
        <button type="submit">Add Restaurant</button>
      </form>

     
      <ul className="restaurant-grid">
        {restaurants.map((restaurant) => (
          <li key={restaurant.id} className="restaurant-card">
            <img
              src="https://cdn.vectorstock.com/i/500p/75/55/restaurant-building-city-background-street-vector-26247555.jpg"
              alt="Restaurant"
              style={{ width: '150px', height: '150px', objectFit: 'cover' }}
            />
            <h3>{restaurant.name}</h3>
            <p>{restaurant.location}</p>
           
            <button onClick={() => handleSaveRestaurant(restaurant.id)}>Save</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Restaurants;
