const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const path = require('path');
const cookieParser = require('cookie-parser');

const app = express();
const PORT = 4000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const db = new sqlite3.Database(path.join(__dirname, 'database.sqlite'), (err) => {
  if (err) console.error(err.message);
  else {
    console.log('Connected to SQLite database');
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE,
      password_hash TEXT
    )`);
  }
});

// Middleware to check login
function checkAuth(req, res, next) {
  if (req.cookies.userEmail) next();
  else res.redirect('/login.html');
}

// Home page (protected)
app.get('/', checkAuth, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Send logged-in user's email (AJAX route)
app.get('/user-info', (req, res) => {
  if (req.cookies.userEmail) {
    res.json({ email: req.cookies.userEmail });
  } else {
    res.status(401).json({ error: 'Not logged in' });
  }
});

// Register user
app.post('/register', async (req, res) => {
  const { email, password } = req.body;
  const hash = await bcrypt.hash(password, 10);

  db.run(`INSERT INTO users (email, password_hash) VALUES (?, ?)`, [email, hash], (err) => {
    if (err) {
      res.send(`<script>alert('User already exists!'); window.location='/register.html';</script>`);
    } else {
      res.send(`<script>alert('Registered successfully! Please login.'); window.location='/login.html';</script>`);
    }
  });
});

// Login user
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  db.get(`SELECT * FROM users WHERE email = ?`, [email], async (err, user) => {
    if (err || !user) {
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
});

// Logout
app.get('/logout', (req, res) => {
  res.clearCookie('userEmail');
  res.redirect('/login.html');
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
