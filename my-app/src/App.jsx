import { Routes, Route, Link } from "react-router-dom"; 
import React, { useState, useEffect } from "react";
import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import Account from "./components/Account";
import Restaurants from "./components/Restaurants";
import RestaurantDetails from "./components/RestaurantDetails";
import "./App.css";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  const handleSignOut = () => {
    localStorage.removeItem("token");  
    setToken(null); 
  };

  return (
    <div>
      <div className="navbar">
        <nav>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/restaurants">Restaurants</Link></li>
            <li><Link to="/account">Account</Link></li>
            {!token ? (
              <>
                <li><Link to="/login">Login</Link></li>
                <li><Link to="/register">Register</Link></li>
              </>
            ) : (
              <li>

              </li>
            )}
          </ul>
        </nav>
      </div>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/restaurants" element={<Restaurants />} />
        <Route path="/restaurants/:restaurantId" element={<RestaurantDetails />} />
        <Route path="/account" element={<Account setToken={setToken} />} />
        <Route path="/login" element={<Login setToken={setToken} />} />
        <Route path="/register" element={<Register setToken={setToken} />} />
      </Routes>
    </div>
  );
}

export default App;