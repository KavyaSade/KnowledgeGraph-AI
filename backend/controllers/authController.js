const mongoose = require('mongoose');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Helper to sign JWTs
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'jwt_secret_placeholder_123', {
    expiresIn: '30d',
  });
};

// Verify Google ID token via official Google API
const verifyGoogleToken = async (idToken) => {
  try {
    const response = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${idToken}`);
    const data = await response.json();
    
    if (data.error_description || !data.email) {
      throw new Error(data.error_description || 'Invalid email scope returned');
    }
    
    return {
      email: data.email,
      name: data.name,
      uid: data.sub
    };
  } catch (error) {
    console.error('Google ID token verification failed:', error);
    return null;
  }
};

exports.registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: 'Please provide all fields' });
  }

  try {
    // Check if user exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    // Encrypt password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = await User.create({
      name,
      email,
      password: hashedPassword
    });

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Please provide email and password' });
  }

  try {
    // We must select +password because it's hidden by default in the Schema
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    // Match hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    res.status(200).json({
      success: true,
      message: 'User logged in successfully',
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.googleLogin = async (req, res) => {
  const { idToken } = req.body;

  if (!idToken) {
    return res.status(400).json({ success: false, message: 'Please provide Google idToken' });
  }

  try {
    // Perform real-time validation against Google tokeninfo endpoint
    const googleProfile = await verifyGoogleToken(idToken);
    
    if (!googleProfile) {
      return res.status(401).json({ success: false, message: 'Google authentication token verification failed' });
    }

    // Sync database user
    let user = await User.findOne({ email: googleProfile.email });
    if (!user) {
      // Create user with a secure randomized password placeholder
      const randomPassword = Math.random().toString(36).substring(2, 15);
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(randomPassword, salt);

      user = await User.create({
        name: googleProfile.name || 'Google User',
        email: googleProfile.email,
        password: hashedPassword
      });
    }

    res.status(200).json({
      success: true,
      message: 'Google login successful',
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    console.error('Google login controller error:', err);
    res.status(500).json({ success: false, message: 'Server error during Google auth' });
  }
};

exports.getMe = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'User context not found' });
    }
    
    res.status(200).json({
      success: true,
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        createdAt: req.user.createdAt,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
