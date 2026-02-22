require('dotenv').config();
const app = require('./src/app');
const sequelize = require('./src/config/database');

const PORT = process.env.PORT || 5000;

// Sync database then start server
sequelize.sync({ alter: false })
  .then(() => {
    console.log('✅ Database synced');
    app.listen(PORT, () => {
      console.log(`🚀 RESQ+ Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ Database error:', err.message);
  });