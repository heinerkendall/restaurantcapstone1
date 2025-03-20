import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


const Account = ({ setToken }) => {
  const [savedRestaurants, setSavedRestaurants] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSavedRestaurants();
  }, []);

  const fetchSavedRestaurants = async () => {
    try {
      const response = await fetch("http://localhost:6001/api/users/saved-restaurants", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch saved restaurants");
      }

      const data = await response.json();
      setSavedRestaurants(data);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem("token"); 
    setToken(""); 
    navigate("/login"); 
  };

  const handleDeleteRestaurant = async (restaurantId) => {
    try {
      const response = await fetch("http://localhost:6001/api/users/delete-saved-restaurant", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ restaurantId }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete restaurant");
      }

    
      setSavedRestaurants(savedRestaurants.filter((restaurant) => restaurant.id !== restaurantId));
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div>
      <h2>Your Account</h2>

      <button onClick={handleSignOut} style={{ marginBottom: "10px" }}>
        Signout
      </button>

      <h3>Saved Restaurants</h3>
      {error && <p>{error}</p>}
      <div className="saved-restaurants-grid">
      <ul>
        {savedRestaurants.length > 0 ? (
          savedRestaurants.map((restaurant) => (
            <li key={restaurant.id}>
              <strong>{restaurant.name}</strong> - {restaurant.location}
              <button
                onClick={() => handleDeleteRestaurant(restaurant.id)}
                style={{ marginLeft: "10px", color: "red" }}
              >
                Delete
              </button>
            </li>
          ))
        ) : (
          <p>No saved restaurants.</p>
        )}
      </ul>
      </div>
    </div>
  );
};

export default Account;