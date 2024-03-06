//server.js
const express = require('express');
const cors = require('cors');
const connection = require('./database');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Define the query function
const query = (sql, values) => {
  return new Promise((resolve, reject) => {
    connection.query(sql, values, (error, results) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(results);
    });
  });
};

// Your API endpoints
app.post('/signup/user', async (req, res) => {
  const { username, phoneNumber, email, password } = req.body;

  try {
    const result = await query('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', [
      username,
      email,
      password,
    ]);

    res.json({ success: true, message: 'User signup successful' });
  } catch (error) {
    console.error('Error during user signup:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});


app.post('/signup/guest', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const result = await query('INSERT INTO guest (username, email, password) VALUES (?, ?, ?)', [
      username,
      email,
      password,
    ]);

    res.json({ success: true, message: 'Guest signup successful' });
  } catch (error) {
    console.error('Error during guest signup:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

app.post('/signup/doctor', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const result = await query('INSERT INTO doctor (username, email, password) VALUES (?, ?, ?)', [
      username,
      email,
      password,
    ]);

    res.json({ success: true, message: 'Doctor signup successful' });
  } catch (error) {
    console.error('Error during doctor signup:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

app.post('/login', async (req, res) => {
  const { email, password, userType } = req.body;

  try {
    let queryStr, userTypeStr;

    // Determine the query and user type based on the request
    if (userType === 'user') {
      queryStr = 'SELECT * FROM users WHERE email = ? AND password = ?';
      userTypeStr = 'user';
    } else if (userType === 'guest') {
      queryStr = 'SELECT * FROM guest WHERE email = ? AND password = ?';
      userTypeStr = 'guest';
    } else if (userType === 'doctor') {
      queryStr = 'SELECT * FROM doctor WHERE email = ? AND password = ?';
      userTypeStr = 'doctor';
    } else {
      return res.status(400).json({ success: false, message: 'Invalid user type' });
    }

    const result = await query(queryStr, [email, password]);

    if (result.length > 0) {
      res.json({ success: true, userType: userTypeStr, message: `${userTypeStr} login successful` });
    } else {
      res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});


app.get('/check-connection', async (req, res) => {
  try {
    await query('SELECT 1');
    res.json({ success: true, message: 'Database connection is active' });
  } catch (error) {
    console.error('Error checking database connection:', error.message);
    res.status(500).json({ success: false, message: `Database connection error: ${error.message}` });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = app;