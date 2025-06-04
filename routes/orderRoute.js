const express = require('express');
const {
    createOrder,
    getAllOrders,
    getOrderById,
    getOrderByShope,
    getOrdersByUserId,
    getOrdersByShopeId,
    checkIfUserPurchasedProduct,
    markOrderAsPaidByTourist
} = require('../controllers/orderController');
const isAuth = require('../middleware/isAuth');

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Order:
 *       type: object
 *       required:
 *         - productIds
 *         - totalPrice
 *       properties:
 *         productIds:
 *           type: array
 *           items:
 *             type: string
 *           description: Array of product IDs included in the order
 *         totalPrice:
 *           type: number
 *           description: Total price of the order
 */

/**
 * @swagger
 * tags:
 *   name: Order
 *   description: Order management API
 */

/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Get all orders
 *     tags: [Order]
 *     responses:
 *       200:
 *         description: List of all orders
 */
router.get('/user',isAuth, getOrdersByUserId);
router.get('/',isAuth, getAllOrders);
router.get('/checkPurchase', isAuth,checkIfUserPurchasedProduct);
/**
 * @swagger
 * /api/orders/{id}:
 *   get:
 *     summary: Get an order by ID
 *     tags: [Order]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The order ID
 *     responses:
 *       200:
 *         description: Order details
 *       404:
 *         description: Order not found
 */
router.get('/:id',isAuth, getOrderById);

/**
 * @swagger
 * /api/orders/shope/{id}:
 *   get:
 *     summary: Get an order by ID
 *     tags: [Order]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The order ID
 *     responses:
 *       200:
 *         description: Order details
 *       404:
 *         description: Order not found
 */
router.get('/shope/:id',isAuth, getOrderByShope);

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Create a new order
 *     tags: [Order]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Order'
 *     responses:
 *       201:
 *         description: Order created successfully
 */
router.post('/',isAuth, createOrder);
router.get('/shop/:shopeId',isAuth, getOrdersByShopeId);
router.put('/mark-paid/:orderId', isAuth, markOrderAsPaidByTourist);
module.exports = router;
