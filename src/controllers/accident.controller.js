const Accident         = require('../models/Accident');
const Camera           = require('../models/Camera');
const User             = require('../models/User');
const EmergencyRequest = require('../models/EmergencyRequest');
const Notification     = require('../models/Notification');
const { getIO }        = require('../config/socket');

exports.getAll = async (req, res) => {
  try {
    const { status } = req.query;
    const where = status ? { status } : {};
    const accidents = await Accident.findAll({
      where,
      order: [['timestamp', 'DESC']],
      include: [{ model: Camera, as: 'camera', attributes: ['name', 'location'] }]
    });
    res.json(accidents);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getOne = async (req, res) => {
  try {
    const accident = await Accident.findByPk(req.params.id, {
      include: [{ model: Camera, as: 'camera', attributes: ['name', 'location'] }]
    });
    if (!accident) return res.status(404).json({ message: 'Accident not found' });
    res.json(accident);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { camera_id, latitude, longitude, location, severity, description, video_clip } = req.body;

    // Save accident to database
    const accident = await Accident.create({
      camera_id, latitude, longitude,
      location, severity, description, video_clip
    });

    // Find all active paramedics
    const paramedics = await User.findAll({
      where: { role: 'paramedic', status: 'active' }
    });

   // Create emergency request + notification for each paramedic
    for (const paramedic of paramedics) {
      await EmergencyRequest.create({
        accident_id:  accident.id,
        responder_id: paramedic.id,
        status:       'pending'
      });

      await Notification.create({
        user_id:     paramedic.id,
        accident_id: accident.id,
        message:     `🚨 Accident detected at ${location}! Severity: ${severity}`
      });
    }

    // Also create notification for all admins
    const admins = await User.findAll({ where: { role: 'admin', status: 'active' } });
    for (const admin of admins) {
      await Notification.create({
        user_id:     admin.id,
        accident_id: accident.id,
        message:     `🚨 Accident detected at ${location}! Severity: ${severity}`
      });
    }

    // Send real-time alert via Socket.IO
    try {
      const io = getIO();

      // Emit to all connected clients
      io.emit('new_accident', {
        accident: {
          id:          accident.id,
          location:    accident.location,
          severity:    accident.severity,
          latitude:    accident.latitude,
          longitude:   accident.longitude,
          timestamp:   accident.timestamp,
          description: accident.description
        },
        message: `🚨 Accident detected at ${location}`
      });

      // Also emit to each paramedic's personal room
      for (const paramedic of paramedics) {
        io.to(`user_${paramedic.id}`).emit('emergency_request', {
          accident_id: accident.id,
          location:    accident.location,
          severity:    accident.severity,
          latitude:    accident.latitude,
          longitude:   accident.longitude,
          message:     `New emergency request at ${location}`
        });
      }
    } catch (socketErr) {
      console.log('Socket not available:', socketErr.message);
    }

    res.status(201).json({
      message:           'Accident reported',
      accident,
      paramedics_alerted: paramedics.length
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const resolved_at = status === 'resolved' ? new Date() : null;
    await Accident.update({ status, resolved_at }, { where: { id: req.params.id } });
    const updated = await Accident.findByPk(req.params.id);
    res.json({ message: 'Status updated', accident: updated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getRecent = async (req, res) => {
  try {
    const accidents = await Accident.findAll({
      order: [['timestamp', 'DESC']],
      limit: 10
    });
    res.json(accidents);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};