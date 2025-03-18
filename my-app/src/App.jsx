import { react } from "react";
import { BrowserRouter } from "BrowserRouter";
import Home from "./components/Home";
import Account from "./components/Account";
import Login from "./components/Login";
import Navigation from "./components/Navigation";
import Register from "./components/Register";
import RestaurantDetails from "./components/RestaurantDetails";
import Restaurants from "./components/Restaurants";
import SingleRestaurant from "./components/SingleRestaurant";



function App() {
  return (
    <Router>
      <Navigation /> {}
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Restaurant Routes */}
        <Route path="/restaurants" element={<Restaurants />} />
        <Route path="/restaurants/:restaurantId" element={<SingleRestaurant />} />
        
        {/* Account Route */}
        <Route path="/account" element={<Account />} />

        {/* Restaurant Details Route */}
        <Route path="/restaurant-details/:id" element={<RestaurantDetails />} />
        
        {/* 404 Page Not Found */}
        <Route path="*" element={<div>Page Not Found</div>} />
      </Routes>
    </Router>
  );
}

export default App;



