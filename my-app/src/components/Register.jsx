// import React, { useState } from 'react';
// import { Register } from '../api';

// export default function Register({ setToken }) {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState(null);
//   const [passwordError, setPasswordError] = useState('');
//   const [loading, setLoading] = useState(false);

//   const authenticate = async (token) => {
//     try {
//       const res = await Register(
//         'http://localhost:4000/api/users/register',
//         {
//           method: 'GET',
//           headers: {
//             'Content-Type': 'application/json',
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       if (!res.ok) throw new Error('Authentication failed.');
//     } catch (err) {
//       console.error('Authentication error:', err);
//       setError(err.message);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError(null);

//     try {
//       if (!email || !password) {
//         setError('Email and password are required');
//         return;
//       }
    
//       const res = await fetch('http://localhost:4000/api/users/register', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ email, password }),
//       });
    
//       const data = await res.json(); // Store response in a variable first
//       console.log('Response from server:', data);
    
//       if (!res.ok) {
//         setError(data.message || 'Sign Up Failed');
//         return;
//       }
    
//       setToken(data.token);
//       localStorage.setItem('token', data.token);
    
//       if (authenticate) {
//         await authenticate(data.token);
//       } else {
//         console.error('authenticate function is not defined');
//       }
//     } catch (err) {
//       setError(err.message || 'An error occurred');
//       console.error('Fetch error:', err);
//     } finally {
//       setLoading(false);
//     }

//   return (
//     <>
//       <h2>Register</h2>
//       {error && <p>{error}</p>}

//       <form onSubmit={handleSubmit} className="form">
//         <label>
//           Email:
//           <input
//             type="email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//           />
//         </label>
//         <br />
//         <label>
//           Password:
//           <input
//             type="password"
//             value={password}
//             onChange={(e) => {
//               setPasswordError('');
//               setPassword(e.target.value);
//             }}
//           />
//           {passwordError && <p>{passwordError}</p>}
//         </label>
//         <br />
//         <button type="submit" disabled={loading}>
//           {'Submit'}
//         </button>
//       </form>
//     </>
//   );
// }};
