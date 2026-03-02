require('dotenv').config();
const http = require('http');
const app = require('./src/app');
const sequelize = require('./src/config/database');
const { initSocket } = require('./src/config/socket');

const PORT = process.env.PORT || 5000;

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO
initSocket(server);

// Sync database then start server
sequelize.sync({ alter: false })
  .then(() => {
    console.log('✅ Database synced');
    server.listen(PORT, () => {
      console.log(`🚀 RESQ+ Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ Database error:', err.message);
  });