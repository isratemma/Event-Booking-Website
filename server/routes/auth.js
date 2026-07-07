const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { registerUser, loginUser } = require('../controllers/authController');
const User = require('../models/User');

router.post('/register', registerUser);
router.post('/login', loginUser);

// Google OAuth via Firebase
router.post('/google', async (req, res) => {
  const { name, email, googleId, avatar } = req.body;
  try {
    let user = await User.findOne({ email });

    if (user) {
      if (!user.googleId) {
        user.googleId = googleId;
        user.avatar = avatar;
        await user.save();
      }
    } else {
      user = await User.create({
        name,
        email,
        password: Math.random().toString(36).slice(-10),
        googleId,
        avatar,
        role: 'user',
        isVerified: true,
      });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      token,
    });
  } catch (error) {
    res.status(500).json({ message: 'Google auth failed', error });
  }
});

module.exports = router;
