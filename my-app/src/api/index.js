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

export async function getBooks() {
  try {
    const response = await fetch(`${BASE_URL}/books`, { headers });
    const result = await handleResponse(response);
    return result.books;
  } catch (error) {
    console.error("Error fetching books:", error);
  }
}

export async function getBookId(bookId) {
  try {
    const response = await fetch(`${BASE_URL}/books/${bookId}`, { headers });
    const result = await handleResponse(response);
    return result.book;
  } catch (error) {
    console.error("Error fetching book:", error);
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
