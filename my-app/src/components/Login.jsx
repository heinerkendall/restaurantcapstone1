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
      const token = await Login(formData); 
      setToken(token); 
      localStorage.setItem("token", token); 
      navigate("/account"); 
    } catch (error) {
      setNameError("Incorrect Email or Password");
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