const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');

require('./models/index'); // load all associations

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Health check
app.get('/', (req, res) => {
  res.json({ message: '🚑 RESQ+ Backend is running!', status: 'OK' });
});

// Routes
app.use('/api/auth',          require('./routes/auth.routes'));
app.use('/api/organizations', require('./routes/organization.routes'));
app.use('/api/cameras',       require('./routes/camera.routes'));
app.use('/api/accidents',     require('./routes/accident.routes'));

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.originalUrl} not found` });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong', error: err.message });
});

module.exports = app;