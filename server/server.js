const express = require('express');
const bodyParser = require('body-parser');
const Database = require('better-sqlite3');
const bcrypt = require('bcryptjs');  // ✅ Changed from bcrypt to bcryptjs
const path = require('path');
const cookieParser = require('cookie-parser');

const app = express();
const PORT = 4000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// === SQLite setup ===
const dbPath = path.join(__dirname, 'database.sqlite');
const db = new Database(dbPath);
console.log('Connected to SQLite database');

// Create table if not exists
db.prepare(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE,
    password_hash TEXT
  )
`).run();

// === Middleware to check login ===
function checkAuth(req, res, next) {
  if (req.cookies.userEmail) next();
  else res.redirect('/login.html');
}

// === Home page (protected) ===
app.get('/', checkAuth, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// === Send logged-in user's email ===
app.get('/user-info', (req, res) => {
  if (req.cookies.userEmail) {
    res.json({ email: req.cookies.userEmail });
  } else {
    res.status(401).json({ error: 'Not logged in' });
  }
});

// === Register user ===
app.post('/register', async (req, res) => {
  const { email, password } = req.body;
  const hash = await bcrypt.hash(password, 10);

  try {
    db.prepare(`INSERT INTO users (email, password_hash) VALUES (?, ?)`).run(email, hash);
    res.send(`<script>alert('Registered successfully! Please login.'); window.location='/login.html';</script>`);
  } catch (err) {
    res.send(`<script>alert('User already exists!'); window.location='/register.html';</script>`);
  }
});

// === Login user ===
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = db.prepare(`SELECT * FROM users WHERE email = ?`).get(email);

  if (!user) {
    return res.send(`<script>alert('Invalid email or password'); window.location='/login.html';</script>`);
  }

  const match = await bcrypt.compare(password, user.password_hash);
  if (match) {
    res.cookie('userEmail', email, { httpOnly: true });
    res.redirect('/');
  } else {
    res.send(`<script>alert('Invalid email or password'); window.location='/login.html';</script>`);
  }
});

// === Logout ===
app.get('/logout', (req, res) => {
  res.clearCookie('userEmail');
  res.redirect('/login.html');
});

app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
