//server.js
const express = require('express');
const cors = require('cors');
const connection = require('./database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

const corsOptions = {
  origin: 'http://localhost:3000', // Update with your frontend URL
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  allowedHeaders: 'Content-Type, Authorization',
};

app.use(cors(corsOptions));


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

app.get('/check-connection', async (req, res) => {
  try {
    await query('SELECT 1');
    res.json({ success: true, message: 'Database connection is active' });
  } catch (error) {
    console.error('Error checking database connection:', error.message);
    res.status(500).json({ success: false, message: `Database connection error: ${error.message}` });
  }
});

// JWT Secret Key
const secretKey = process.env.JWT_SECRET_KEY || 'happytoenterthejwtsecretkeyforthisproject';
const JWT_SECRET_KEY = secretKey;

// // Add this middleware
const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

  if (!token) {
      return res.status(401).json({ success: false, message: 'Token not provided' });
  }

  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
      if (err) {
          return res.status(401).json({ success: false, message: 'Invalid token' });
      }

      // Extract userId from decoded token
      req.userId = decoded.userId;
      next();
  });
};




// Your API endpoints
app.post('/signup/user', async (req, res) => {
  const { userName, phoneNumber, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 20);
    const result = await query('INSERT INTO users (userName, phoneNumber, email, password) VALUES (?, ?, ?, ?)', [
      userName,
      phoneNumber,
      email,
      hashedPassword,
    ]);

    res.json({ success: true, message: 'User signup successful' });
  } catch (error) {
    // Check if the error is due to a duplicate entry
    console.log("error code",error.code);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ success: false, message: 'Duplicate entry: This user already exists.' });
    }

    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});


app.post('/signup/guest', async (req, res) => {
  const { userName, phoneNumber, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password,20);
    const result = await query('INSERT INTO guest (userName, phoneNumber, email, password) VALUES (?, ?, ?, ?)', [
      userName,
      phoneNumber,
      email,
      hashedPassword,
    ]);

    res.json({ success: true, message: 'Guest signup successful' });
  } catch (error) {
    console.error('Error during guest signup:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

app.post('/signup/doctor', async (req, res) => {
  const { userName, phoneNumber, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 20);
    const result = await query('INSERT INTO doctor (userName, phoneNumber, email, password) VALUES (?, ?, ?, ?)', [
      userName,
      phoneNumber, 
      email,
      hashedPassword,
    ]);

    res.json({ success: true, message: 'Doctor signup successful' });
  } catch (error) {
    console.error('Error during doctor signup:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// app.post('/login',authenticateToken ,async (req, res) => {
app.post('/login' ,async (req, res) => {
  const {email, password, userType } = req.body;

  try {
    let queryStr, userTypeStr;

    // Determine the query and user type based on the request
    if (userType === 'user') {
      queryStr = 'SELECT * FROM users WHERE email = ?';
      userTypeStr = 'user';
    } else if (userType === 'guest') {
      queryStr = 'SELECT * FROM guest WHERE email = ?';
      userTypeStr = 'guest';
    } else if (userType === 'doctor') {
      queryStr = 'SELECT * FROM doctor WHERE email = ?';
      userTypeStr = 'doctor';
    } else {
      return res.status(400).json({ success: false, message: 'Invalid user type' });
    }
    const result = await query(queryStr, [email]);
  
    if (result.length > 0) {
      // Compare the provided password with the hashed password from the database
      const isPasswordValid = await bcrypt.compare(password, result[0].password);
      console.log("logp",result[0].password);
      if (isPasswordValid) {
        // Generate a JSON Web Token (JWT) for authentication
        const token = jwt.sign(
          { userId: result[0].id, 
            userName: result[0].userName,
            phone: result[0].phoneNumber, 
            email: result[0].email, 
            userType: userTypeStr }, JWT_SECRET_KEY, {
          expiresIn: '1h',
        });
        res.json({ success: true, userType: userTypeStr, token,  userName: result[0].userName, phoneNumber: result[0].phoneNumber, 
          email: result[0].email,message: `${userTypeStr} login successful` });
      } else {
        res.status(401).json({ success: false, message: 'Invalid email or password' });
      }
    } else {
      res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

app.put('/editProfile', authenticateToken, async (req, res) => {
  // const userData = req.body; // Assuming the updated user data is sent in the request body
  const userId = req.userId;
  const userData = req.body;


  try {
    // Perform the update operation in the database
    // Replace 'users' with your actual table name
    const result = await query('UPDATE users SET userName = ?, phoneNumber = ?, email = ? WHERE id = ?', [
      userData.userName,
      userData.phoneNumber,
      userData.email,
      userId, // Assuming the user ID is included in the userData
    ]);

    // Check if the update operation was successful
    if (result.affectedRows > 0) {
      res.json({ success: true, message: 'Profile updated successfully' });
    } else {
      res.status(404).json({ success: false, message: 'User not found or profile not updated' });
    }
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

app.delete('/deleteAccount', authenticateToken, async (req, res) => {
  const userId = req.userId; // Assuming the user ID is included in the request after authentication

  try {
    const result = await query('DELETE FROM users WHERE id = ?', [userId]);

    // Check if the delete operation was successful
    if (result.affectedRows > 0) {
      res.json({ success: true, message: 'Account deleted successfully' });
    } else {
      res.status(404).json({ success: false, message: 'User not found or account not deleted' });
    }
  } catch (error) {
    console.error('Error deleting account:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});


module.exports = app;