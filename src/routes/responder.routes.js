const router = require('express').Router();
const {
  getMyRequests,
  acceptRequest,
  rejectRequest,
  onWay,
  completeRequest,
  updateMyStatus,
  updateLocation,
  getMyStats,
  sendSOS
} = require('../controllers/responder.controller');
const { protect } = require('../middleware/auth.middleware');

/**
 * @swagger
 * /api/responders/my-requests:
 *   get:
 *     summary: Get my assigned emergency requests
 *     tags: [Responders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of my requests
 */
router.get('/my-requests', protect, getMyRequests);

/**
 * @swagger
 * /api/responders/accept-request:
 *   post:
 *     summary: Accept emergency request
 *     tags: [Responders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [request_id]
 *             properties:
 *               request_id:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       200:
 *         description: Request accepted, returns accident location
 */
router.post('/accept-request', protect, acceptRequest);

/**
 * @swagger
 * /api/responders/reject-request:
 *   post:
 *     summary: Reject emergency request
 *     tags: [Responders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               request_id:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       200:
 *         description: Request rejected
 */
router.post('/reject-request', protect, rejectRequest);

/**
 * @swagger
 * /api/responders/on-way:
 *   post:
 *     summary: Mark as on the way to accident
 *     tags: [Responders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               request_id:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       200:
 *         description: Status updated to on the way
 */
router.post('/on-way', protect, onWay);

/**
 * @swagger
 * /api/responders/complete-request:
 *   post:
 *     summary: Mark emergency request as completed
 *     tags: [Responders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               request_id:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       200:
 *         description: Request completed
 */
router.post('/complete-request', protect, completeRequest);

/**
 * @swagger
 * /api/responders/update-status:
 *   put:
 *     summary: Update my availability status
 *     tags: [Responders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [active, busy, inactive]
 *                 example: active
 *     responses:
 *       200:
 *         description: Status updated
 */
router.put('/update-status', protect, updateMyStatus);
router.post('/update-location', protect, updateLocation);
router.get('/my-stats', protect, getMyStats);
router.post('/sos', protect, sendSOS);

module.exports = router;