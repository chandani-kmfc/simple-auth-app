const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000/api';


export async function api(path, options = {}) {
const token = localStorage.getItem('token');
const headers = options.headers || {};
headers['Content-Type'] = 'application/json';
if (token) headers['Authorization'] = 'Bearer ' + token;
const res = await fetch(API_URL + path, { ...options, headers });
const data = await res.json().catch(() => ({}));
if (!res.ok) throw data;
return data;
}


export default api;