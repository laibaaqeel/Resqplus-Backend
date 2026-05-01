const router = require('express').Router();
const { protect } = require('../middleware/auth.middleware');
const {
  getMonthlyStats,
  getSeverityStats,
  getStatusStats,
  getTopLocations,
  getSummary
} = require('../controllers/reports.controller');

router.get('/monthly', protect, getMonthlyStats);
router.get('/severity', protect, getSeverityStats);
router.get('/status', protect, getStatusStats);
router.get('/locations', protect, getTopLocations);
router.get('/summary', protect, getSummary);

module.exports = router;