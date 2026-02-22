const router = require('express').Router();
const { getAll, create, update, remove } = require('../controllers/camera.controller');
const { protect, adminOnly } = require('../middleware/auth.middleware');

/**
 * @swagger
 * /api/cameras:
 *   get:
 *     summary: Get all cameras
 *     tags: [Cameras]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of cameras
 */
router.get('/', protect, getAll);

/**
 * @swagger
 * /api/cameras:
 *   post:
 *     summary: Add new camera (admin only)
 *     tags: [Cameras]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name:
 *                 type: string
 *                 example: Camera 01 - Mall Road
 *               location:
 *                 type: string
 *                 example: Mall Road, Lahore
 *               latitude:
 *                 type: number
 *                 example: 31.5204
 *               longitude:
 *                 type: number
 *                 example: 74.3587
 *               stream_url:
 *                 type: string
 *                 example: rtsp://192.168.1.1/stream
 *               fps:
 *                 type: integer
 *                 example: 30
 *     responses:
 *       201:
 *         description: Camera added
 */
router.post('/', protect, adminOnly, create);

/**
 * @swagger
 * /api/cameras/{id}:
 *   put:
 *     summary: Update camera
 *     tags: [Cameras]
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
 *               name:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [active, offline, warning]
 *               fps:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Camera updated
 */
router.put('/:id', protect, adminOnly, update);

/**
 * @swagger
 * /api/cameras/{id}:
 *   delete:
 *     summary: Delete camera
 *     tags: [Cameras]
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
 *         description: Camera deleted
 */
router.delete('/:id', protect, adminOnly, remove);

module.exports = router;