const router = require('express').Router();
const { getAll, getOne, create, updateStatus, getRecent } = require('../controllers/accident.controller');
const { protect, adminOnly } = require('../middleware/auth.middleware');

/**
 * @swagger
 * /api/accidents:
 *   get:
 *     summary: Get all accidents
 *     tags: [Accidents]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [active, resolved, false_alarm]
 *         description: Filter by status
 *     responses:
 *       200:
 *         description: List of accidents
 */
router.get('/', protect, getAll);

/**
 * @swagger
 * /api/accidents/recent:
 *   get:
 *     summary: Get last 10 accidents
 *     tags: [Accidents]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Recent accidents
 */
router.get('/recent', protect, getRecent);

/**
 * @swagger
 * /api/accidents/{id}:
 *   get:
 *     summary: Get one accident
 *     tags: [Accidents]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Accident details
 */
router.get('/:id', protect, getOne);

/**
 * @swagger
 * /api/accidents:
 *   post:
 *     summary: Report new accident (called by YOLO model)
 *     tags: [Accidents]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               camera_id:
 *                 type: integer
 *                 example: 1
 *               latitude:
 *                 type: number
 *                 example: 31.5204
 *               longitude:
 *                 type: number
 *                 example: 74.3587
 *               location:
 *                 type: string
 *                 example: Mall Road, Lahore
 *               severity:
 *                 type: string
 *                 enum: [low, medium, high, extreme]
 *                 example: high
 *               description:
 *                 type: string
 *                 example: Two vehicles collision detected
 *               video_clip:
 *                 type: string
 *                 example: clips/accident_001.mp4
 *     responses:
 *       201:
 *         description: Accident reported successfully
 */
router.post('/', create);

/**
 * @swagger
 * /api/accidents/{id}/status:
 *   put:
 *     summary: Update accident status (admin only)
 *     tags: [Accidents]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [active, resolved, false_alarm]
 *                 example: resolved
 *     responses:
 *       200:
 *         description: Status updated
 */
router.put('/:id/status', protect, adminOnly, updateStatus);

module.exports = router;