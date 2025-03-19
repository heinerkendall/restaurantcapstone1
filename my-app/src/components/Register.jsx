import React, { useState } from 'react';

export default function Register({ setToken }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [passwordError, setPasswordError] = useState('');
  const [loading, setLoading] = useState(false);

  const authenticate = async (token) => {
    if (!token) {
      console.error("No token provided");
      setError("No token provided");
      return;
    }

    try {
      const res = await fetch(
        'http://localhost:6001/api/users/me',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error('Authentication failed.');
      }
      console.log("Authentication successful");
    } catch (err) {
      console.error('Authentication error:', err);
      setError(err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
        const res = await fetch(
            'http://localhost:6001/api/users/register',
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: email, password }),
            }
        );

        if (!res.ok) {
            const err = await res.json();
            setError(err.message || 'Sign Up Failed');
            return;
        }

        const data = await res.json();
        console.log("Registration Response:", data);

        if (!data.token) {
            throw new Error("No token received from server.");
        }

        setToken(data.token); 
        localStorage.setItem('token', data.token); 
        await authenticate(data.token); 
    } catch (err) {
        console.error('Registration error:', err);
        setError(err.message || 'An error occurred');
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
