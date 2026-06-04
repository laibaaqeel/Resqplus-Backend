const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// ─── REGISTER ─────────────────────────────────────────────
exports.register = async (req, res) => {
  try {
    const { name, email, password, phone, role, vehicle_type, org_id } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required' });
    }

    // Check if email already exists
    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
  name, email, password: hashedPassword,
  phone, role, vehicle_type, org_id: org_id || null
});
    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// ─── LOGIN ────────────────────────────────────────────────
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required' });
    }

    // Find user
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check if account is active
    if (user.status === 'inactive') {
      return res.status(401).json({ message: 'Account is inactive. Contact admin.' });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, role: user.role, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        phone: user.phone,
        image_url: user.image_url
      }
    });

  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// ─── GET MY PROFILE ───────────────────────────────────────
exports.getMe = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] } // never send password
    });

    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// ─── UPDATE PROFILE ───────────────────────────────────────
exports.updateProfile = async (req, res) => {
  try {
    const { name, phone, bio, vehicle_type } = req.body;

    await User.update(
      { name, phone, bio, vehicle_type },
      { where: { id: req.user.id } }
    );

    const updated = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }
    });

    res.json({ message: 'Profile updated', user: updated });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// ─── REGISTER PUSH TOKEN ──────────────────────────────────
exports.registerPushToken = async (req, res) => {
  try {
    const { push_token } = req.body;
    if (!push_token) return res.status(400).json({ message: 'push_token is required' });
    await User.update({ fcm_token: push_token }, { where: { id: req.user.id } });
    res.json({ message: 'Push token registered' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─── CHANGE PASSWORD ──────────────────────────────────────
exports.changePassword = async (req, res) => {
  try {
    const { current_password, new_password } = req.body;

    if (!current_password || !new_password) {
      return res.status(400).json({ message: 'Both current and new password are required' });
    }

    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(current_password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is wrong' });
    }

    user.password = await bcrypt.hash(new_password, 10);
    await user.save();

    res.json({ message: 'Password changed successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};