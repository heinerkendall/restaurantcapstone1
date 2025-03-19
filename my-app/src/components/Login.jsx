import { useState } from "react";
import { Login } from "../api"; 
import { useNavigate } from "react-router-dom";

export default function LoginForm({ setToken }) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [nameError, setNameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    try {
        const res = await fetch("http://localhost:6001/api/users/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username: formData.email, password: formData.password }),
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.message || "Login failed");
        }

        setToken(data.token);
        localStorage.setItem("token", data.token);
        navigate("/account");
    } catch (error) {
        console.error("Login error:", error);
        setNameError(error.message);
    }
}

  return (
    <>
      <h2>Log In</h2>

      <form onSubmit={handleSubmit} className="form" id="form">
        <label>
          Email:
          <input
            type="text"
            value={formData.email}
            onChange={(e) => {
              setNameError("");
              setFormData((prev) => ({ ...prev, email: e.target.value }));
            }}
          />
          {nameError && <p>{nameError}</p>}
        </label>
        <br />
        <label>
          Password:
          <input
            type="password"
            value={formData.password}
            onChange={(e) => {
              setPasswordError(""); 
              setFormData((prev) => ({ ...prev, password: e.target.value }));
            }}
          />
          {passwordError && <p>{passwordError}</p>}
        </label>
        <br />
        <button type="submit">Submit</button>
      </form>
    </>
  );
};