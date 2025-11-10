import React from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import Home from './Home';
import Login from './Login';
import Register from './Register';


function App() {
const navigate = useNavigate();
const token = localStorage.getItem('token');


function logout() {
localStorage.removeItem('token');
navigate('/login');
}


return (
<div style={{ maxWidth: 800, margin: '20px auto', padding: 20 }}>
<nav style={{ marginBottom: 20 }}>
<Link to="/">Home</Link> | {' '}
{token ? (
<button onClick={logout} style={{ marginLeft: 10 }}>Logout</button>
) : (
<>
<Link to="/login">Login</Link> | <Link to="/register">Register</Link>
</>
)}
</nav>


<Routes>
<Route path="/" element={<Home />} />
<Route path="/login" element={<Login />} />
<Route path="/register" element={<Register />} />
</Routes>
</div>
);
}


export default App;