const router = require('express').Router();
const {
  getAll, getOne, getParamedics,
  update, updateStatus, remove,
  getNotifications, markRead
} = require('../controllers/user.controller');
const { protect, adminOnly } = require('../middleware/auth.middleware');

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users (admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all users
 */
router.get('/', protect, adminOnly, getAll);

/**
 * @swagger
 * /api/users/paramedics:
 *   get:
 *     summary: Get all paramedics
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of paramedics
 */
router.get('/paramedics', protect, getParamedics);

/**
 * @swagger
 * /api/users/notifications:
 *   get:
 *     summary: Get my notifications
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: My notifications list
 */
router.get('/notifications', protect, getNotifications);

/**
 * @swagger
 * /api/users/notifications/mark-read:
 *   put:
 *     summary: Mark all notifications as read
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Notifications marked as read
 */
router.put('/notifications/mark-read', protect, markRead);

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Get one user
 *     tags: [Users]
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
 *         description: User details
 */
router.get('/:id', protect, getOne);

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Update user (admin only)
 *     tags: [Users]
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
 *               phone:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [admin, paramedic]
 *               status:
 *                 type: string
 *                 enum: [active, inactive, busy]
 *               vehicle_type:
 *                 type: string
 *               org_id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: User updated
 */
router.put('/:id', protect, adminOnly, update);

/**
 * @swagger
 * /api/users/{id}/status:
 *   put:
 *     summary: Update user status
 *     tags: [Users]
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
 *                 enum: [active, inactive, busy]
 *                 example: inactive
 *     responses:
 *       200:
 *         description: Status updated
 */
router.put('/:id/status', protect, adminOnly, updateStatus);

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Delete user (admin only)
 *     tags: [Users]
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
 *         description: User deleted
 */
router.delete('/:id', protect, adminOnly, remove);

module.exports = router;