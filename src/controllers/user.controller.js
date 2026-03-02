const User         = require('../models/User');
const Organization = require('../models/Organization');
const bcrypt       = require('bcryptjs');

// ─── GET ALL USERS ────────────────────────────────────────
exports.getAll = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] },
      include: [{ model: Organization, as: 'organization', attributes: ['id', 'name', 'type'] }],
      order: [['createdAt', 'DESC']]
    });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─── GET ONE USER ─────────────────────────────────────────
exports.getOne = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password'] },
      include: [{ model: Organization, as: 'organization', attributes: ['id', 'name', 'type'] }]
    });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─── GET ALL PARAMEDICS ───────────────────────────────────
exports.getParamedics = async (req, res) => {
  try {
    const paramedics = await User.findAll({
      where: { role: 'paramedic' },
      attributes: { exclude: ['password'] },
      include: [{ model: Organization, as: 'organization', attributes: ['id', 'name'] }],
      order: [['createdAt', 'DESC']]
    });
    res.json(paramedics);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─── UPDATE USER ──────────────────────────────────────────
exports.update = async (req, res) => {
  try {
    const { name, phone, role, status, vehicle_type, bio, org_id } = req.body;

    await User.update(
      { name, phone, role, status, vehicle_type, bio, org_id },
      { where: { id: req.params.id } }
    );

    const updated = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password'] }
    });

    res.json({ message: 'User updated', user: updated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─── UPDATE USER STATUS ───────────────────────────────────
exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    await User.update({ status }, { where: { id: req.params.id } });
    res.json({ message: `User status updated to ${status}` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─── DELETE USER ──────────────────────────────────────────
exports.remove = async (req, res) => {
  try {
    // Prevent admin from deleting themselves
    if (req.params.id == req.user.id) {
      return res.status(400).json({ message: 'You cannot delete your own account' });
    }
    await User.destroy({ where: { id: req.params.id } });
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─── GET NOTIFICATIONS ────────────────────────────────────
exports.getNotifications = async (req, res) => {
  try {
    const Notification = require('../models/Notification');
    const Accident     = require('../models/Accident');

    const notifications = await Notification.findAll({
      where: { user_id: req.user.id },
      include: [{ model: Accident, as: 'accident', attributes: ['id', 'location', 'severity'] }],
      order: [['created_at', 'DESC']],
      limit: 20
    });
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─── MARK NOTIFICATION READ ───────────────────────────────
exports.markRead = async (req, res) => {
  try {
    const Notification = require('../models/Notification');
    await Notification.update(
      { is_read: true },
      { where: { user_id: req.user.id } }
    );
    res.json({ message: 'All notifications marked as read' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};