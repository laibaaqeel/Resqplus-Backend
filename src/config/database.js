const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: false,
  dialectOptions: {
    ssl: false
  }
});

sequelize.authenticate()
  .then(() => console.log('✅ Database connected'))
  .catch(err => console.error('❌ DB connection failed:', err.message));

module.exports = sequelize;
