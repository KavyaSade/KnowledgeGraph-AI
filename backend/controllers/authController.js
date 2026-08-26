const mongoose = require('mongoose');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');

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
        phone: user.phone || '',
        avatar: user.avatar || null,
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
        phone: user.phone || '',
        avatar: user.avatar || null,
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
        phone: user.phone || '',
        avatar: user.avatar || null,
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
        phone: req.user.phone || '',
        avatar: req.user.avatar || null,
        createdAt: req.user.createdAt,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ success: false, message: 'Please provide an email address' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found with that email' });
    }

    // Generate secure token
    const resetToken = crypto.randomBytes(20).toString('hex');

    // Set reset password token and expire
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 Minutes expiry

    await user.save();

    // Create reset URL
    const clientOrigin = req.headers.referer || req.headers.origin || `${req.protocol}://${req.get('host')}`;
    const resetUrl = `${clientOrigin.replace(/\/$/, '')}/reset-password?token=${resetToken}`;

    // Composition of HTML Email Content
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
        <h2 style="color: #4f46e5; margin-bottom: 20px;">KnowledgeGraph AI - Password Reset Request</h2>
        <p>Hello ${user.name},</p>
        <p>You are receiving this email because you requested a password reset for your KnowledgeGraph AI account.</p>
        <p>Please click the button below to complete the reset process. This link is valid for <strong>10 minutes</strong>:</p>
        <div style="margin: 30px 0; text-align: center;">
          <a href="${resetUrl}" style="background-color: #4f46e5; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: bold; display: inline-block;">
            Reset Password
          </a>
        </div>
        <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;" />
        <p style="font-size: 0.8rem; color: #64748b; line-height: 1.5;">
          If you're having trouble clicking the button, copy and paste the URL below into your web browser:<br />
          <a href="${resetUrl}" style="color: #4f46e5;">${resetUrl}</a>
        </p>
      </div>
    `;

    const emailMessage = `You are receiving this email because you (or someone else) requested a password reset for your KnowledgeGraph AI account.\n\n
Please copy and paste the following link into your web browser to reset your password:\n\n
${resetUrl}\n\n
This link is valid for 10 minutes. If you did not request this, please ignore this email.`;

    // If using real SMTP, run it in the background so the user gets an instant success screen
    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
      sendEmail({
        email: user.email,
        subject: 'KnowledgeGraph AI - Password Reset Link',
        message: emailMessage,
        html: emailHtml
      }).catch((mailErr) => {
        console.error('Background email dispatch failed:', mailErr);
      });

      return res.status(200).json({
        success: true,
        message: 'Reset password link sent successfully to email.',
        resetToken,
        resetUrl,
        previewUrl: null
      });
    }

    // Otherwise, in sandbox mode, await Ethereal account generation to get the preview URL
    try {
      const emailResult = await sendEmail({
        email: user.email,
        subject: 'KnowledgeGraph AI - Password Reset Link',
        message: emailMessage,
        html: emailHtml
      });

      res.status(200).json({
        success: true,
        message: 'Reset password link sent successfully to email.',
        resetToken,
        resetUrl,
        previewUrl: emailResult.previewUrl || null
      });
    } catch (mailErr) {
      // Clear token details in database if mail send fails
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save();
      
      console.error('Email dispatch failed:', mailErr);
      return res.status(500).json({ success: false, message: 'Email could not be sent. Please check your SMTP configuration.' });
    }
  } catch (err) {
    console.error('Forgot password error:', err);
    res.status(500).json({ success: false, message: 'Server error during password reset request' });
  }
};

exports.resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({ success: false, message: 'Please provide a new password' });
  }

  try {
    // Hash token to compare with database value
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    // Find user by token and verify expiry
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid or expired password reset token' });
    }

    // Encrypt new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // Clear reset token fields
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password reset successful'
    });
  } catch (err) {
    console.error('Reset password error:', err);
    res.status(500).json({ success: false, message: 'Server error during password reset' });
  }
};

exports.updateProfile = async (req, res) => {
  const { name, email, phone, avatar } = req.body;

  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Check if email is already taken by another user
    if (email && email !== user.email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        return res.status(400).json({ success: false, message: 'Email is already taken by another account' });
      }
      user.email = email;
    }

    if (name) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (avatar !== undefined) user.avatar = avatar;

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        avatar: user.avatar || null,
        createdAt: user.createdAt
      }
    });
  } catch (err) {
    console.error('Profile update error:', err);
    res.status(500).json({ success: false, message: 'Server error during profile update' });
  }
};
