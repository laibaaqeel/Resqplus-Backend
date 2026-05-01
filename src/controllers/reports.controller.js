const { Op, fn, col, literal } = require('sequelize');
const Accident = require('../models/Accident');
const User = require('../models/User');
const EmergencyRequest = require('../models/EmergencyRequest');

// Monthly accidents count (last 6 months)
exports.getMonthlyStats = async (req, res) => {
  try {
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const start = new Date(date.getFullYear(), date.getMonth(), 1);
      const end = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59);
      
      const count = await Accident.count({
        where: { timestamp: { [Op.between]: [start, end] } }
      });

      months.push({
        month: start.toLocaleString('en-US', { month: 'short' }),
        year: start.getFullYear(),
        count
      });
    }
    res.json(months);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Accidents by severity
exports.getSeverityStats = async (req, res) => {
  try {
    const severities = ['low', 'medium', 'high', 'extreme'];
    const result = await Promise.all(
      severities.map(async (s) => ({
        severity: s,
        count: await Accident.count({ where: { severity: s } })
      }))
    );
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Accidents by status
exports.getStatusStats = async (req, res) => {
  try {
    const statuses = ['active', 'resolved', 'false_alarm'];
    const result = await Promise.all(
      statuses.map(async (s) => ({
        status: s,
        count: await Accident.count({ where: { status: s } })
      }))
    );
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Top locations
exports.getTopLocations = async (req, res) => {
  try {
    const [results] = await Accident.sequelize.query(`
      SELECT location, COUNT(*) as count 
      FROM accidents 
      GROUP BY location 
      ORDER BY count DESC 
      LIMIT 5
    `);
    res.json(results);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Summary stats
exports.getSummary = async (req, res) => {
  try {
    const total = await Accident.count();
    const resolved = await Accident.count({ where: { status: 'resolved' } });
    const active = await Accident.count({ where: { status: 'active' } });
    const falseAlarm = await Accident.count({ where: { status: 'false_alarm' } });
    const totalParamedics = await User.count({ where: { role: 'paramedic' } });
    const resolutionRate = total > 0 ? Math.round((resolved / total) * 100) : 0;

    res.json({ total, resolved, active, falseAlarm, totalParamedics, resolutionRate });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};