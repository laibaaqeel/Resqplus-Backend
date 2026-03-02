
const Accident          = require('./Accident');
const Camera            = require('./Camera');
const User              = require('./User');
const Organization      = require('./Organization');
const EmergencyRequest  = require('./EmergencyRequest');
const Notification      = require('./Notification');

// Accident ↔ Camera
Accident.belongsTo(Camera, { foreignKey: 'camera_id', as: 'camera' });
Camera.hasMany(Accident,   { foreignKey: 'camera_id', as: 'accidents' });

// User ↔ Organization
User.belongsTo(Organization, { foreignKey: 'org_id', as: 'organization' });
Organization.hasMany(User,   { foreignKey: 'org_id', as: 'users' });

// EmergencyRequest ↔ Accident
EmergencyRequest.belongsTo(Accident, { foreignKey: 'accident_id', as: 'accident' });
Accident.hasMany(EmergencyRequest,   { foreignKey: 'accident_id', as: 'requests' });

// EmergencyRequest ↔ User
EmergencyRequest.belongsTo(User, { foreignKey: 'responder_id', as: 'responder' });
User.hasMany(EmergencyRequest,   { foreignKey: 'responder_id', as: 'requests' });

// Notification ↔ User
Notification.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
User.hasMany(Notification,   { foreignKey: 'user_id', as: 'notifications' });

// Notification ↔ Accident
Notification.belongsTo(Accident, { foreignKey: 'accident_id', as: 'accident' });
Accident.hasMany(Notification,   { foreignKey: 'accident_id', as: 'notifications' });

module.exports = { Accident, Camera, User, Organization, EmergencyRequest, Notification };