import React, { useEffect, useState } from 'react';
import api from './api';


export default function Home() {
const [user, setUser] = useState(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);


useEffect(() => {
let cancelled = false;
async function fetchProfile() {
try {
const data = await api('/profile');
if (!cancelled) setUser(data.user);
} catch (err) {
if (!cancelled) setError(err.error || 'Not logged in');
} finally {
if (!cancelled) setLoading(false);
}
}
fetchProfile();
return () => { cancelled = true; };
}, []);


if (loading) return <p>Loading...</p>;
if (error) return <div>
<h2>Welcome</h2>
<p>{error}</p>
<p>Please <a href="/login">login</a> or <a href="/register">register</a>.</p>
</div>;


return (
<div>
<h2>Home</h2>
<p>Welcome, <strong>{user.email}</strong></p>
<p>Account created at: {new Date(user.created_at).toLocaleString()}</p>
</div>
);
}