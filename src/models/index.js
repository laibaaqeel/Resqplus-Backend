const Accident = require('./Accident');
const Camera   = require('./Camera');
const User     = require('./User');
const Organization = require('./Organization');

// Accident belongs to Camera
Accident.belongsTo(Camera, { foreignKey: 'camera_id', as: 'camera' });
Camera.hasMany(Accident,   { foreignKey: 'camera_id', as: 'accidents' });

// User belongs to Organization
User.belongsTo(Organization, { foreignKey: 'org_id', as: 'organization' });
Organization.hasMany(User,   { foreignKey: 'org_id', as: 'users' });

module.exports = { Accident, Camera, User, Organization };