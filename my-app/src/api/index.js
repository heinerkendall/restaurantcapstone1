const BASE_URL = `http://localhost:6001/api`;

const headers = {
  "Content-Type": "application/json",
};

const handleResponse = async (response) => {
  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.message || "Something went wrong");
  }
  return result;
};



export async function Login(credentials) {
    const res = await fetch("http://localhost:6001/api/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });
  
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Login failed");
  
    return data.token;

}export async function Register(formData) {

const res = await fetch("http://localhost:6001/api/users/me", {
    method: "GET",
    headers: { "Authorization": "Bearer YOUR_TOKEN_HERE" }
}).then(res => res.json()).then(console.log);}

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
  

