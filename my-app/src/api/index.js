const BASE_URL = `http://localhost:4000`;

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

export async function getRestaurants() {
  try {
    const response = await fetch(`${BASE_URL}/restaurants`, { headers });
    const result = await handleResponse(response);
    return result.restaurants;
  } catch (error) {
    console.error("Error fetching restaurants:", error);
  }
}

export async function getRestaurantId(Id) {
  try {
    const response = await fetch(`${BASE_URL}/restaurants/${restaurantId}`, { headers });
    const result = await handleResponse(response);
    return result.restaurants;
  } catch (error) {
    console.error("Error fetching restaurants:", error);
  }
}

export async function Login(formData) {
  try {
    const response = await fetch(`${BASE_URL}/users/login`, {
      method: "POST",
      headers,
      body: JSON.stringify(formData),
    });
    const result = await handleResponse(response);
    return result.token;
  } catch (error) {
    console.error("Having Trouble Logging you in", error);
    setError(error.message);
  }
}
