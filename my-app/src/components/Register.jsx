import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
export default function Register({ setToken }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [passwordError, setPasswordError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); 

  const authenticate = async (token) => {
    try {
        const res = await fetch("http://localhost:6001/api/users/me", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        if (!res.ok) throw new Error("Authentication failed.");
    } catch (err) {
        console.error("Authentication error:", err);
        setError(err.message);
    }
};

const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
        const res = await fetch("http://localhost:6001/api/users/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username: email, password }),
        });

        const data = await res.json();
        console.log("Register response:", data);

        if (!res.ok) {
            setError(data.message || "Sign Up Failed");
            return;
        }

        if (!data.token) {
            throw new Error("No token received from server");
        }

        setToken(data.token);
        localStorage.setItem("token", data.token);
        await authenticate(data.token);

        
        navigate("/account"); 
    } catch (err) {
        console.error("Register error:", err);
        setError(err.message || "An error occurred");
    } finally {
        setLoading(false);
    }
};

  return (
    <>
      <h2>Register</h2>
      {error && <p>{error}</p>}

      <form onSubmit={handleSubmit} className="form">
        <label>
          Email:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <br />
        <label>
          Password:
          <input
            type="password"
            value={password}
            onChange={(e) => {
              setPasswordError('');
              setPassword(e.target.value);
            }}
          />
          {passwordError && <p>{passwordError}</p>}
        </label>
        <br />
        <button type="submit" disabled={loading}>
          {'Submit'}
        </button>
      </form>
    </>
  );
}
