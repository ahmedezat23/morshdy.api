const express = require('express');
const {
    createProduct,
    getProductById,
    updateProduct,
    deleteProduct,
    getAllProducts,
    getProductsByLocation,
    searchProduct,
    getOtherProductsFromCategory,
} = require('../controllers/productController');

const router = express.Router();
const isAuth = require('../middleware/isAuth');

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       required:
 *         - categoryId
 *         - name
 *         - productImg
 *         - descripition
 *         - price
 *       properties:
 *         categoryId:
 *           type: string
 *           description: The name of the product
 *         name:
 *           type: string
 *           description: The name of the product
 *         productImg:
 *           type: string
 *           description: URL of the product image
 *         descripition:
 *           type: string
 *           description: Description of the product
 *         price:
 *           type: number
 *           description: Price of the product
 */

/**
 * @swagger
 * tags:
 *   name: Product
 *   description: Product management API
 */

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Get a product by ID
 *     tags: [Product]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The product ID
 *     responses:
 *       200:
 *         description: Product details
 *       404:
 *         description: Product not found
 */
router.get('/:id',isAuth, getProductById);

/**
 * @swagger
 * /api/products/{shopeId}:
 *   post:
 *     summary: Create a new product
 *     tags: [Product]
 *     parameters:
 *       - in: path
 *         name: shopeId
 *         schema:
 *           type: string
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       201:
 *         description: Product created successfully
 */
router.post('/:shopeId',isAuth, createProduct);

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Update a product
 *     tags: [Product]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The product ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       200:
 *         description: Product updated successfully
 */
router.put('/:id',isAuth, updateProduct);

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Delete a product
 *     tags: [Product]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The product ID
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *       404:
 *         description: Product not found
 */
router.delete('/:id',isAuth, deleteProduct);

router.get('/location', getProductsByLocation);
router.get('/', getAllProducts);
router.get('/search', searchProduct);
router.get('/other/:productId', getOtherProductsFromCategory);

module.exports = router;
