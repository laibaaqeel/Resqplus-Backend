const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Notification = sequelize.define('Notification', {
  id:          { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  user_id:     { type: DataTypes.INTEGER, allowNull: false },
  accident_id: { type: DataTypes.INTEGER },
  message:     { type: DataTypes.TEXT, allowNull: false },
  is_read:     { type: DataTypes.BOOLEAN, defaultValue: false }
}, { tableName: 'notifications', timestamps: true, underscored: true });

module.exports = Notification;