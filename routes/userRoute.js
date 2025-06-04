const express = require('express');
const {
    getUsers,
    getUserById,
    updateUser,
    deleteUser,
    reastPassword,
    getUser,
} = require('../controllers/userController');
const isAuth = require('../middleware/isAuth');

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - fullName
 *         - mobile
 *         - email
 *         - password
 *         - userImg
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the user
 *         role:
 *           type: string
 *           enum: [User, Admin]
 *           default: User
 *           description: Role of the user
 *         fullName:
 *           type: string
 *         mobile:
 *           type: string
 *         address:
 *           type: string
 *         email:
 *           type: string
 *         password:
 *           type: string
 *         userImg:
 *           type: string
 *         verified:
 *           type: boolean
 *           default: false
 *         zipCode:
 *           type: string
 */

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management API
 */

/**
 * @swagger
 * /api/users/current-user:
 *   get:
 *     summary: Get the authenticated user's details
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: User details
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.get('/current-user', isAuth, getUser);

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Returns a list of all users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: List of users
 */
router.get('/',isAuth, getUsers);

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Get a user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user ID
 *     responses:
 *       200:
 *         description: The user details
 *       404:
 *         description: User not found
 */
router.get('/:id',isAuth, getUserById);

/**
 * @swagger
 * /api/users/reast-password:
 *   put:
 *     summary: Reast password
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successful
 *       500:
 *         description: Server error
 */
router.put('/reast-password',isAuth, reastPassword);


/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Update a user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *               mobile:
 *                 type: string
 *               address:
 *                 type: string
 *               email:
 *                 type: string
 *               userImg:
 *                 type: string
 *               zipCode:
 *                 type: string
 *     responses:
 *       200:
 *         description: User updated successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.put('/',isAuth, updateUser);

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Delete a user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user ID
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 */
router.delete('/:id',isAuth, deleteUser);

module.exports = router;
