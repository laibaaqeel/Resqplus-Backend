const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Organization = sequelize.define('Organization', {
  id:      { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name:    { type: DataTypes.STRING(150), allowNull: false },
  type:    { type: DataTypes.STRING(50) },
  phone:   { type: DataTypes.STRING(30) },
  email:   { type: DataTypes.STRING(150) },
  address: { type: DataTypes.TEXT }
}, { tableName: 'organizations', timestamps: true, underscored: true });

module.exports = Organization;