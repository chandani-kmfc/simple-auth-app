import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from './api';


export default function Login() {
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [error, setError] = useState(null);
const navigate = useNavigate();


async function submit(e) {
e.preventDefault();
setError(null);
try {
const res = await api('/login', {
method: 'POST',
body: JSON.stringify({ email, password })
});
localStorage.setItem('token', res.token);
navigate('/');
} catch (err) {
setError(err.error || 'Login failed');
}
}


return (
<div>
<h2>Login</h2>
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
<button type="submit">Login</button>
</form>
</div>
);
}