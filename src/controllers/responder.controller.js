const EmergencyRequest = require('../models/EmergencyRequest');
const Accident         = require('../models/Accident');
const User             = require('../models/User');
const Notification     = require('../models/Notification');

// ─── GET MY REQUESTS ──────────────────────────────────────
exports.getMyRequests = async (req, res) => {
  try {
    const requests = await EmergencyRequest.findAll({
      where: { responder_id: req.user.id },
      include: [{
        model: Accident,
        as: 'accident',
        attributes: ['id', 'location', 'severity', 'status', 'latitude', 'longitude', 'timestamp']
      }],
      order: [['created_at', 'DESC']]
    });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─── ACCEPT REQUEST ───────────────────────────────────────
exports.acceptRequest = async (req, res) => {
  try {
    const request_id = parseInt(req.body.request_id);
    if (!request_id) return res.status(400).json({ message: 'request_id is required' });

    const request = await EmergencyRequest.findByPk(request_id);
    if (!request) return res.status(404).json({ message: 'Request not found' });

    if (request.status !== 'pending') {
      return res.status(400).json({ message: 'Request is no longer pending' });
    }

    // Accept this request
    await EmergencyRequest.update(
      { status: 'accepted', responder_id: req.user.id },
      { where: { id: request_id } }
    );

    // Mark this paramedic as busy
    await User.update(
      { status: 'busy' },
      { where: { id: req.user.id } }
    );

    // Cancel all other pending requests for same accident
    const otherRequests = await EmergencyRequest.findAll({
      where: {
        accident_id: request.accident_id,
        status: 'pending'
      }
    });

    for (const otherRequest of otherRequests) {
      await EmergencyRequest.update(
        { status: 'cancelled' },
        { where: { id: otherRequest.id } }
      );

      const acceptingParamedic = await User.findByPk(req.user.id, {
        attributes: ['name']
      });

      await Notification.create({
        user_id: otherRequest.responder_id,
        accident_id: request.accident_id,
        message: ` Emergency at this location has been accepted by ${acceptingParamedic.name}. No action needed.`
      });

      try {
        const { getIO } = require('../config/socket');
        const io = getIO();
        io.to(`user_${otherRequest.responder_id}`).emit('request_cancelled', {
          accident_id: request.accident_id,
          message: `Emergency accepted by ${acceptingParamedic.name}. No action needed.`
        });
      } catch (socketErr) {
        console.log('Socket error:', socketErr.message);
      }
    }

    const accident = await Accident.findByPk(request.accident_id);

    res.json({
      message: 'Request accepted',
      accident: {
        id:        accident.id,
        location:  accident.location,
        latitude:  accident.latitude,
        longitude: accident.longitude,
        severity:  accident.severity
      }
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─── REJECT REQUEST ───────────────────────────────────────
exports.rejectRequest = async (req, res) => {
  try {
    const request_id = parseInt(req.body.request_id);
    if (!request_id) return res.status(400).json({ message: 'request_id is required' });

    const request = await EmergencyRequest.findByPk(request_id);
    if (!request) return res.status(404).json({ message: 'Request not found' });

    await EmergencyRequest.update(
      { status: 'rejected' },
      { where: { id: request_id } }
    );

    res.json({ message: 'Request rejected' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─── ON THE WAY ───────────────────────────────────────────
exports.onWay = async (req, res) => {
  try {
    const request_id = parseInt(req.body.request_id);
    if (!request_id) return res.status(400).json({ message: 'request_id is required' });

    const request = await EmergencyRequest.findByPk(request_id);
    if (!request) return res.status(404).json({ message: 'Request not found' });

    await EmergencyRequest.update(
      { status: 'on_way' },
      { where: { id: request_id } }
    );

    try {
      const { getIO } = require('../config/socket');
      const io = getIO();
      io.emit('accident_status_updated', { id: request.accident_id, status: 'on_way' });
    } catch (socketErr) {
      console.log('Socket error:', socketErr.message);
    }

    res.json({ message: 'Status updated to on the way' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─── COMPLETE REQUEST ─────────────────────────────────────
exports.completeRequest = async (req, res) => {
  try {
    const request_id = parseInt(req.body.request_id);
    if (!request_id) return res.status(400).json({ message: 'request_id is required' });

    const request = await EmergencyRequest.findByPk(request_id);
    if (!request) return res.status(404).json({ message: 'Request not found' });

    const createdAt = new Date(request.createdAt);
    const now = new Date();
    const responseTimeMinutes = Math.round((now - createdAt) / 60000);

    await EmergencyRequest.update(
      { status: 'completed', response_time_minutes: responseTimeMinutes },
      { where: { id: request_id } }
    );

    await Accident.update(
      { status: 'resolved', resolved_at: now },
      { where: { id: request.accident_id } }
    );

    await User.update(
      { status: 'active' },
      { where: { id: req.user.id } }
    );

    res.json({
      message: 'Request completed successfully',
      response_time_minutes: responseTimeMinutes
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─── UPDATE MY STATUS ─────────────────────────────────────
exports.updateMyStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!['active', 'busy', 'inactive'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status. Use active, busy or inactive' });
    }

    await User.update(
      { status },
      { where: { id: req.user.id } }
    );

    res.json({ message: `Your status updated to ${status}` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};