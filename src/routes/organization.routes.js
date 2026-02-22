const router = require('express').Router();
const { getAll, getOne, create, update, remove } = require('../controllers/organization.controller');
const { protect, adminOnly } = require('../middleware/auth.middleware');

/**
 * @swagger
 * /api/organizations:
 *   get:
 *     summary: Get all organizations
 *     tags: [Organizations]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of organizations
 */
router.get('/', protect, getAll);

/**
 * @swagger
 * /api/organizations/{id}:
 *   get:
 *     summary: Get one organization
 *     tags: [Organizations]
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
 *         description: Organization details
 */
router.get('/:id', protect, getOne);

/**
 * @swagger
 * /api/organizations:
 *   post:
 *     summary: Create organization (admin only)
 *     tags: [Organizations]
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
 *                 example: Edhi Foundation
 *               type:
 *                 type: string
 *                 example: ambulance_service
 *               phone:
 *                 type: string
 *                 example: "115"
 *               email:
 *                 type: string
 *                 example: info@edhi.org
 *               address:
 *                 type: string
 *                 example: Multiple Locations, Lahore
 *     responses:
 *       201:
 *         description: Organization created
 */
router.post('/', protect, adminOnly, create);

/**
 * @swagger
 * /api/organizations/{id}:
 *   put:
 *     summary: Update organization (admin only)
 *     tags: [Organizations]
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
 *               type:
 *                 type: string
 *               phone:
 *                 type: string
 *               email:
 *                 type: string
 *               address:
 *                 type: string
 *     responses:
 *       200:
 *         description: Organization updated
 */
router.put('/:id', protect, adminOnly, update);

/**
 * @swagger
 * /api/organizations/{id}:
 *   delete:
 *     summary: Delete organization (admin only)
 *     tags: [Organizations]
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
 *         description: Organization deleted
 */
router.delete('/:id', protect, adminOnly, remove);

module.exports = router;