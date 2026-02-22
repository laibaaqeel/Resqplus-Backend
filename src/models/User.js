const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  email: {
    type: DataTypes.STRING(150),
    allowNull: false,
    unique: true,
    validate: { isEmail: true }
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  phone: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  role: {
    type: DataTypes.ENUM('admin', 'paramedic'),
    defaultValue: 'paramedic'
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive', 'busy'),
    defaultValue: 'active'
  },
  vehicle_type: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  bio: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  image_url: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  fcm_token: {
    type: DataTypes.STRING(500),
    allowNull: true
  }
}, {
  tableName: 'users',
  timestamps: true,
  underscored: true  // createdAt → created_at in DB
});

module.exports = User;