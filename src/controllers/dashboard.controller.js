const { Op, fn, col, literal } = require('sequelize');
const Accident = require('../models/Accident');
const User = require('../models/User');
const Camera = require('../models/Camera');
const EmergencyRequest = require('../models/EmergencyRequest');

// ─── DASHBOARD STATS ──────────────────────────────────────
exports.getStats = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Total accidents today
    const accidentsToday = await Accident.count({
      where: { timestamp: { [Op.gte]: today } }
    });

    // Total active emergencies
    const activeEmergencies = await Accident.count({
      where: { status: 'active' }
    });

    // Total resolved
    const totalResolved = await Accident.count({
      where: { status: 'resolved' }
    });

    // Total accidents ever
    const totalAccidents = await Accident.count();

    // Total paramedics
    const totalParamedics = await User.count({
      where: { role: 'paramedic' }
    });

    // Available paramedics
    const availableParamedics = await User.count({
      where: { role: 'paramedic', status: 'active' }
    });

    res.json({
      accidentsToday,
      activeEmergencies,
      totalResolved,
      totalAccidents,
      totalParamedics,
      availableParamedics
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─── MAP DATA ─────────────────────────────────────────────
exports.getMapData = async (req, res) => {
  try {
    const accidents = await Accident.findAll({
      where: { status: 'active' },
      attributes: ['id', 'latitude', 'longitude', 'location', 'severity', 'timestamp'],
      order: [['timestamp', 'DESC']]
    });

    res.json(accidents);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─── CAMERA STATUS ────────────────────────────────────────
exports.getCameraStatus = async (req, res) => {
  try {
    const cameras = await Camera.findAll({
      attributes: ['id', 'name', 'location', 'status', 'fps'],
      order: [['id', 'ASC']]
    });

    res.json(cameras);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};