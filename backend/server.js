const express = require('express');
require("dotenv").config();
const connectDB = require("./config/db");
const bcrypt = require('bcryptjs');
const User = require('./models/userModel');
const app = express();
connectDB();
const PORT = process.env.PORT || 5005;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
  res.send('Welcome to the Venwave');
});

// Register the user
app.post('/api/users/register', async (req, res) => {
  const { ownerName, mobileNumber, email, businessName, role, gstNumber, pinCode, district, state, password } = req.body;
  // Validate required fields
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: 'User already exists' });
  }
  if (!ownerName || !mobileNumber || !email || !businessName || !role || !gstNumber || !pinCode || !district || !state || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }
  try {
    const user = new User({
      ownerName,
      mobileNumber,
      email,
      businessName,
      role,
      gstNumber,
      pinCode,
      district,
      state,
      password,
    });

    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Login the user
app.post('/api/users/login', async (req, res) => {
  try {
    const { email, password, role } = req.body;
    const genericErrorResponse = {
        success: false,
        message: 'Invalid credentials',
        timestamp: new Date().toISOString()
      };

    if (!email || !password || !role) {
      return res.status(400).json(genericErrorResponse);
    }

    const user = await User.findOne({ email, role });

    if (!user || !user.password) {
      return res.status(400).json(genericErrorResponse);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json(genericErrorResponse);
    }

    res.status(200).json({ success: true, message: 'Login successful' });
  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});




// Start server
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});

