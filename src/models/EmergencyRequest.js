const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const EmergencyRequest = sequelize.define('EmergencyRequest', {
  id:                    { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  accident_id:           { type: DataTypes.INTEGER, allowNull: false },
  responder_id:          { type: DataTypes.INTEGER },
  status:                { type: DataTypes.STRING(20), defaultValue: 'pending' },
  response_time_minutes: { type: DataTypes.INTEGER },
  notes:                 { type: DataTypes.TEXT }
}, { tableName: 'emergency_requests', timestamps: true, underscored: true });

module.exports = EmergencyRequest;