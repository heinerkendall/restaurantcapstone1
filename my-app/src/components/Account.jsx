import { useEffect, useState } from "react";

const Account = () => {
  const [savedRestaurants, setSavedRestaurants] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSavedRestaurants();
  }, []);

  const fetchSavedRestaurants = async () => {
    try {
      const response = await fetch("http://localhost:6001/api/users/saved-restaurants", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
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

  return (
    <div>
      <h2>Your Account</h2>
      <h3>Saved Restaurants</h3>
      {error && <p>{error}</p>}
      <ul>
        {savedRestaurants.length > 0 ? (
          savedRestaurants.map((restaurant) => (
            <li key={restaurant.id}>
              <strong>{restaurant.name}</strong> - {restaurant.location}
            </li>
          ))
        ) : (
          <p>No saved restaurants.</p>
        )}
      </ul>
    </div>
  );
};

export default Account;