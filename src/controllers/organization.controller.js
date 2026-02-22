const Organization = require('../models/Organization');

exports.getAll = async (req, res) => {
  try {
    const orgs = await Organization.findAll({ order: [['created_at', 'DESC']] });
    res.json(orgs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getOne = async (req, res) => {
  try {
    const org = await Organization.findByPk(req.params.id);
    if (!org) return res.status(404).json({ message: 'Organization not found' });
    res.json(org);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { name, type, phone, email, address } = req.body;
    if (!name) return res.status(400).json({ message: 'Name is required' });
    const org = await Organization.create({ name, type, phone, email, address });
    res.status(201).json({ message: 'Organization created', org });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { name, type, phone, email, address } = req.body;
    await Organization.update({ name, type, phone, email, address }, { where: { id: req.params.id } });
    const updated = await Organization.findByPk(req.params.id);
    res.json({ message: 'Organization updated', org: updated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    await Organization.destroy({ where: { id: req.params.id } });
    res.json({ message: 'Organization deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};