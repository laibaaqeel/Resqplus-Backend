const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Accident = sequelize.define('Accident', {
  id:          { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  camera_id:   { type: DataTypes.INTEGER },
  latitude:    { type: DataTypes.DECIMAL(10, 8) },
  longitude:   { type: DataTypes.DECIMAL(11, 8) },
  location:    { type: DataTypes.STRING(200) },
  severity:    { type: DataTypes.STRING(20), defaultValue: 'medium' },
  description: { type: DataTypes.TEXT },
  video_clip:  { type: DataTypes.STRING(500) },
  status:      { type: DataTypes.STRING(20), defaultValue: 'active' },
  timestamp:   { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  resolved_at: { type: DataTypes.DATE }
}, { tableName: 'accidents', timestamps: true, underscored: true });

module.exports = Accident;