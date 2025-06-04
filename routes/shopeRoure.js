const express = require('express');
const {
    createShope,
    getAllShopes,
    getShopeById,
    updateShope,
    deleteShope,
    getProductsByShope,
    getProductCountByShope,
    changeShopPassword,
} = require('../controllers/shopeController');
const isAuth = require('../middleware/isAuth');
const multer = require('multer');
const path = require('path');

// إعداد التخزين
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // تأكد أن مجلد uploads موجود
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  }
});

const upload = multer({ storage });

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Shope:
 *       type: object
 *       required:
 *         - nameShope
 *         - ownerShope
 *         - location
 *         - email
 *         - password
 *         - shopeImg
 *         - descripition
 *       properties:
 *         nameShope:
 *           type: string
 *           description: The name of the shop
 *         ownerShope:
 *           type: string
 *           description: The name of the shop owner
 *         latitude:
 *           type: string
 *         longitude:
 *           type: string
 *         email:
 *           type: string
 *         password:
 *           type: string
 *         shopeImg:
 *           type: string
 *         descripition:
 *           type: string
 */

/**
 * @swagger
 * tags:
 *   name: Shope
 *   description: Shop management API
 */

/**
 * @swagger
 * /api/shopes:
 *   get:
 *     summary: Get all shops
 *     tags: [Shope]
 *     responses:
 *       200:
 *         description: List of all shops
 */
router.get('/', isAuth,getAllShopes);

/**
 * @swagger
 * /api/shopes/{id}:
 *   get:
 *     summary: Get a shop by ID
 *     tags: [Shope]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The shop ID
 *     responses:
 *       200:
 *         description: Shop details
 *       404:
 *         description: Shop not found
 */
router.get('/:id',isAuth, getShopeById);

/**
 * @swagger
 * /api/shopes:
 *   post:
 *     summary: Create a new shop
 *     tags: [Shope]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Shope'
 *     responses:
 *       201:
 *         description: Shop created successfully
 */
router.post('/',upload.single('shopeImg'), createShope);

/**
 * @swagger
 * /api/shopes/{id}:
 *   put:
 *     summary: Update a shop
 *     tags: [Shope]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The shop ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nameShope:
 *                 type: string
 *                 description: The name of the shop
 *               ownerShope:
 *                 type: string
 *                 description: The shop owner's name
 *               latitude:
 *                 type: string
 *                 description: The latitude of the shop's location
 *               longitude:
 *                 type: string
 *                 description: The longitude of the shop's location
 *               shopeImg:
 *                 type: string
 *                 description: URL of the shop's image
 *               description:
 *                 type: string
 *                 description: Description of the shop
 *     responses:
 *       200:
 *         description: Shop updated successfully
 */

router.put('/:id',isAuth, updateShope);
router.put('/:id/change-password',isAuth, changeShopPassword);

/**
 * @swagger
 * /api/shopes/{id}:
 *   delete:
 *     summary: Delete a shop
 *     tags: [Shope]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The shop ID
 *     responses:
 *       200:
 *         description: Shop deleted successfully
 *       404:
 *         description: Shop not found
 */
router.delete('/:id',isAuth, deleteShope);

router.get('/products/:shopeId',isAuth, getProductsByShope);
router.get('/products/:shopeId/count',isAuth, getProductCountByShope);
module.exports = router;
