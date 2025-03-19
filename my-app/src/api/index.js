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

// export async function getRestaurants() {
//   try {
//     const response = await fetch(`${BASE_URL}/`, { headers });
//     const result = await handleResponse(response);
//     return result.books;
//   } catch (error) {
//     console.error("Error fetching books:", error);
//   }
// }

// export async function getRestaurantId(restaurantId) {
//   try {
//     const response = await fetch(`${BASE_URL}/books/${bookId}`, { headers });
//     const result = await handleResponse(response);
//     return result.book;
//   } catch (error) {
//     console.error("Error fetching book:", error);
//   }
// }

export async function Login(formData) {
    const res = await fetch("http://localhost:6001/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: formData.username, password: formData.password }), // Match with register
    });

    if (!res.ok) {
        throw new Error("Invalid credentials");
    }

    const data = await res.json();
    return data.token;

}export async function Register(formData) {

const res = await fetch("http://localhost:6001/api/users/me", {
    method: "GET",
    headers: { "Authorization": "Bearer YOUR_TOKEN_HERE" }
}).then(res => res.json()).then(console.log);}