import { useState } from "react";
import Account from "./components/account";
import Register from "./components/Register";
import Login from "./components/Login";
import Books from "./components/Restaurants";
import { Route, Routes } from "react-router-dom";
import Navigation from "./components/Navigation";
import { getBooks } from "./api";
import BookDetails from "./components/RestaurantsDetails";
import Home from "./components/Home";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [books, setBooks] = useState([]);

  async function getData() {
    const bookData = await getBooks();
    setBooks(bookData);
  }

  return (
    <>
      <Home/>
      <Navigation token={token} setToken={setToken} />
      <Routes>
        <Route
          path="/"
          element={<Books getData={getData} books={books} token={token} />}
        />

        <Route path="/login" element={<Login setToken={setToken} />} />

        <Route path="/register" element={<Register setToken={setToken} />} />

        <Route
          path="/account"
          element={<Account token={token} books={books} getData={getData} />}
        />
        <Route
          path="/:id"
          element={<BookDetails token={token} key={window.location.pathname} />}
        />
      </Routes>
    </>
  );
}

export default App;
