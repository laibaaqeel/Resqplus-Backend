const Camera = require('../models/Camera');

exports.getAll = async (req, res) => {
  try {
    const cameras = await Camera.findAll({ order: [['created_at', 'DESC']] });
    res.json(cameras);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { name, location, latitude, longitude, stream_url, fps } = req.body;
    if (!name) return res.status(400).json({ message: 'Camera name is required' });
    const camera = await Camera.create({ name, location, latitude, longitude, stream_url, fps });
    res.status(201).json({ message: 'Camera added', camera });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    await Camera.update(req.body, { where: { id: req.params.id } });
    const updated = await Camera.findByPk(req.params.id);
    res.json({ message: 'Camera updated', camera: updated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    await Camera.destroy({ where: { id: req.params.id } });
    res.json({ message: 'Camera deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};