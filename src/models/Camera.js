const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Camera = sequelize.define('Camera', {
  id:         { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name:       { type: DataTypes.STRING(100), allowNull: false },
  location:   { type: DataTypes.STRING(200) },
  latitude:   { type: DataTypes.DECIMAL(10, 8) },
  longitude:  { type: DataTypes.DECIMAL(11, 8) },
  stream_url: { type: DataTypes.STRING(500) },
  status:     { type: DataTypes.STRING(20), defaultValue: 'active' },
  fps:        { type: DataTypes.INTEGER, defaultValue: 30 }
}, { tableName: 'cameras', timestamps: true, underscored: true });

module.exports = Camera;