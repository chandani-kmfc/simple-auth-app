import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from './api';


export default function Register() {
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [error, setError] = useState(null);
const navigate = useNavigate();


async function submit(e) {
e.preventDefault();
setError(null);
try {
const res = await api('/register', {
method: 'POST',
body: JSON.stringify({ email, password })
});
localStorage.setItem('token', res.token);
navigate('/');
} catch (err) {
setError(err.error || 'Registration failed');
}
}


return (
<div>
<h2>Register</h2>
<form onSubmit={submit}>
<div>
<label>Email</label><br />
<input value={email} onChange={e => setEmail(e.target.value)} required />
</div>
<div>
<label>Password</label><br />
<input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
</div>
{error && <p style={{ color: 'red' }}>{error}</p>}
<button type="submit">Register</button>
</form>
</div>
);
}