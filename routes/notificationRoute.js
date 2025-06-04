const express = require('express');
const {
    getAllNotificationsByAdmin,
    getNotificationsByTouristId,
    getNotificationsByShopeId,
    IsReadNotification,
    deleteNotification,
    getUnreadNotificationCount,
    getUnreadAdminNotificationCount
} = require('../controllers/notificationController');
const isAuth = require('../middleware/isAuth');

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Notification:
 *       type: object
 *       required:
 *         - userId
 *         - content
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated ID of the notification
 *         userId:
 *           type: string
 *           description: The ID of the user associated with the notification
 *         content:
 *           type: string
 *           description: The notification content
 *         typeNotification:
 *           type: string
 *           description: The type notification
 *         typeUser:
 *           type: string
 *           description: The type user  
 *         status:
 *           type: string
 *           description: The status notification 
 *         date:
 *           type: string
 *           description: The date notification   
 */

/**
 * @swagger
 * tags:
 *   name: Notification
 *   description: Notification management API
 */

/**
 * @swagger
 * /api/notifications/admin:
 *   get:
 *     summary: Get all notifications by Admin
 *     tags: [Notification]
 *     responses:
 *       200:
 *         description: List of all notifications by Admin
 */
router.get('/admin',isAuth, getAllNotificationsByAdmin);
router.get('/unread-count/admin',isAuth, getUnreadAdminNotificationCount);
router.get('/unread-count',isAuth, getUnreadNotificationCount);
router.get('/shop',isAuth, getNotificationsByShopeId);

/**
 * @swagger
 * /api/notifications/user/{touristId}:
 *   get:
 *     summary: Get notifications by tourist ID
 *     tags: [Notification]
 *     parameters:
 *       - in: path
 *         name: touristId
 *         schema:
 *           type: string
 *         required: true
 *         description: The Tourist ID
 *     responses:
 *       200:
 *         description: Notifications for the specified tourist
 */
// router.get('/user/:touristId',isAuth, getNotificationsByTouristId);


/**
 * @swagger
 * /api/notifications/user/{shopeId}:
 *   get:
 *     summary: Get notifications by shope Id
 *     tags: [Notification]
 *     parameters:
 *       - in: path
 *         name: shopeId
 *         schema:
 *           type: string
 *         required: true
 *         description: The Shope ID
 *     responses:
 *       200:
 *         description: Notifications for the specified shope
 */


/**
 * @swagger
 * /api/notifications/{id}:
 *   post:
 *     summary: IsRead a notification
 *     tags: [Notification]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The notification ID
 *     responses:
 *       200:
 *         description: Notification IsRead successfully
 *       404:
 *         description: Notification not found
 */
router.patch('/:id/read',isAuth, IsReadNotification);

/**
 * @swagger
 * /api/notifications/{id}:
 *   delete:
 *     summary: Delete a notification
 *     tags: [Notification]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The notification ID
 *     responses:
 *       200:
 *         description: Notification deleted successfully
 *       404:
 *         description: Notification not found
 */
router.delete('/:id', deleteNotification);

module.exports = router;
