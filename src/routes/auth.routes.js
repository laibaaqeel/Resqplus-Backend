const router = require('express').Router();
const {
  register, login, getMe, updateProfile, changePassword
} = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth.middleware');

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password]
 *             properties:
 *               name:
 *                 type: string
 *                 example: Ahmed Ali
 *               email:
 *                 type: string
 *                 example: ahmed@edhi.org
 *               password:
 *                 type: string
 *                 example: pass123
 *               role:
 *                 type: string
 *                 enum: [admin, paramedic]
 *                 example: paramedic
 *               phone:
 *                 type: string
 *                 example: "0300-1234567"
 *               vehicle_type:
 *                 type: string
 *                 example: ambulance
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Email already exists or missing fields
 */
router.post('/register', register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login and get JWT token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 example: admin@resqplus.pk
 *               password:
 *                 type: string
 *                 example: admin123
 *     responses:
 *       200:
 *         description: Login successful, returns token
 *       401:
 *         description: Wrong email or password
 */
router.post('/login', login);

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Get my profile
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Returns current user profile
 *       401:
 *         description: No token or invalid token
 */
router.get('/me', protect, getMe);

/**
 * @swagger
 * /api/auth/update-profile:
 *   put:
 *     summary: Update my profile
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
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
 *               bio:
 *                 type: string
 *               vehicle_type:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profile updated
 */
router.put('/update-profile', protect, updateProfile);

/**
 * @swagger
 * /api/auth/change-password:
 *   post:
 *     summary: Change password
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [current_password, new_password]
 *             properties:
 *               current_password:
 *                 type: string
 *                 example: admin123
 *               new_password:
 *                 type: string
 *                 example: newpass456
 *     responses:
 *       200:
 *         description: Password changed successfully
 */
router.post('/change-password', protect, changePassword);

module.exports = router;
