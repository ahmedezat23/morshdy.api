const express = require('express');
const {
    createReview,
    getAllReviewsByProduct,
    getReviewById,
    updateReview,
    deleteReview,
    getReviewsByShopeId,
    getAllReviews,
} = require('../controllers/reviewController');
const isAuth = require('../middleware/isAuth');

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Review:
 *       type: object
 *       required:
 *         - userId
 *         - productId
 *         - content
 *         - Rating
 *       properties:
 *         content:
 *           type: string
 *           description: The content of the review
 *         rating:
 *           type: number
 *           description: The rating for the product
 */

/**
 * @swagger
 * tags:
 *   name: Review
 *   description: Review management API
 */

/**
 * @swagger
 * /api/reviews/{productId}:
 *   get:
 *     summary: Get all reviews
 *     tags: [Review]
 *     parameters:
 *       - in: path
 *         name: productId
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: List of all reviews
 */
router.get('/',isAuth, getAllReviews);
router.get('/:productId',isAuth, getAllReviewsByProduct);

/**
 * @swagger
 * /api/reviews/shope/{shopeId}:
 *   get:
 *     summary: Get all reviews
 *     tags: [Review]
 *     parameters:
 *       - in: path
 *         name: shopeId
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: List of all reviews by Shope
 */
router.get('/shop/:shopeId',isAuth, getReviewsByShopeId);

/**
 * @swagger
 * /api/reviews/review/{id}:
 *   get:
 *     summary: Get a review by ID
 *     tags: [Review]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The review ID
 *     responses:
 *       200:
 *         description: Review details
 *       404:
 *         description: Review not found
 */
router.get('/review/:id',isAuth, getReviewById);

/**
 * @swagger
 * /api/reviews/{productId}:
 *   post:
 *     summary: Create a new review
 *     tags: [Review]
 *     parameters:
 *       - in: path
 *         name: productId
 *         schema:
 *           type: string
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Review'
 *     responses:
 *       201:
 *         description: Review created successfully
 */
router.post('/:productId',isAuth, createReview);

/**
 * @swagger
 * /api/reviews/{id}:
 *   put:
 *     summary: Update a review
 *     tags: [Review]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The review ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Review'
 *     responses:
 *       200:
 *         description: Review updated successfully
 */
router.put('/:id/verify',isAuth, updateReview);

/**
 * @swagger
 * /api/reviews/{id}:
 *   delete:
 *     summary: Delete a review
 *     tags: [Review]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The review ID
 *     responses:
 *       200:
 *         description: Review deleted successfully
 *       404:
 *         description: Review not found
 */
router.delete('/:id',isAuth, deleteReview);

module.exports = router;
