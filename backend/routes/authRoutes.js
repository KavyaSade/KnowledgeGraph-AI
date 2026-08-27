const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  googleLogin,
  getMe,
  forgotPassword,
  resetPassword,
  updateProfile,
  send2FAOtp,
  verifyAndEnable2FA,
  disable2FA,
  verify2FALogin
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/google', googleLogin);
router.get('/me', protect, getMe);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
router.put('/update-profile', protect, updateProfile);

// Two-Factor Authentication routes
router.post('/2fa/send-otp', protect, send2FAOtp);
router.post('/2fa/verify-enable', protect, verifyAndEnable2FA);
router.post('/2fa/disable', protect, disable2FA);
router.post('/2fa/verify-login', verify2FALogin);

module.exports = router;
