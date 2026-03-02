const router = require('express').Router();
const { getStats, getMapData, getCameraStatus } = require('../controllers/dashboard.controller');
const { protect } = require('../middleware/auth.middleware');

/**
 * @swagger
 * /api/dashboard/stats:
 *   get:
 *     summary: Get dashboard statistics
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard stats
 */
router.get('/stats', protect, getStats);

/**
 * @swagger
 * /api/dashboard/map-data:
 *   get:
 *     summary: Get active accident locations for map
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Active accident coordinates
 */
router.get('/map-data', protect, getMapData);

/**
 * @swagger
 * /api/dashboard/cameras:
 *   get:
 *     summary: Get camera status for dashboard panel
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Camera status list
 */
router.get('/cameras', protect, getCameraStatus);

module.exports = router;