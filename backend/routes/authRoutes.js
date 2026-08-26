const express = require('express');
const router = express.Router();
const { registerUser, loginUser, googleLogin, getMe, forgotPassword, resetPassword, updateProfile } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/google', googleLogin);
router.get('/me', protect, getMe);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
router.put('/update-profile', protect, updateProfile);

module.exports = router;
