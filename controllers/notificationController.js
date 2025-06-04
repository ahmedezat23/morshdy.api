const Notification = require('../models/notificationModel');

const getUnreadNotificationCount = async (req, res) => {
  try {
    const count = await Notification.countDocuments({ status: "Not Read",UserId:req.userId });
    res.json({ count });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

const getUnreadAdminNotificationCount = async (req, res) => {
  try {
    const count = await Notification.countDocuments({status: "Not Read", typeUser: "Admin" });
    res.json({ count });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Get all notifications by Tourist
const getNotificationsByTouristId = async (req, res) => {
    try {
        const { userId } = req.params;
        const notifications = await Notification.find({ UserId: userId, typeUser: 'Tourist' }).sort({ date: -1 });
        res.status(200).json({ success: true, data: notifications });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// Get all notifications by Admin
const getAllNotificationsByAdmin = async (req, res) => {
    try {
        const notifications = await Notification.find({ typeUser: 'Admin' }).sort({ date: -1 });
        res.status(200).json({ success: true, data: notifications });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Get notifications by Shope ID
const getNotificationsByShopeId = async (req, res) => {
    try {
        const notifications = await Notification.find({ UserId: req.userId, typeUser: 'Shop' }).sort({ date: -1 });
        res.status(200).json({ success: true, data: notifications });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// is read notification
const IsReadNotification = async (req, res) => {
    try {
        const { id } = req.params;
        const notification = await Notification.findByIdAndUpdate(
            id,
            { status: 'Read' },
            { new: true }
        );
        if (!notification) {
            return res.status(404).json({ success: false, message: "Notification not found" });
        }
        res.status(200).json({ success: true, data: notification });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Delete a notification
const deleteNotification = async (req, res) => {
    try {
        const notification = await Notification.findByIdAndDelete(req.params.id);
        if (!notification) {
            return res.status(404).json({ success: false, error: "Notification not found" });
        }
        res.status(200).json({ success: true, message: "Delete Notification Successfully" });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

module.exports = {
    getAllNotificationsByAdmin,
    getNotificationsByTouristId,
    getNotificationsByShopeId,
    IsReadNotification,
    getUnreadAdminNotificationCount,
    getUnreadNotificationCount,
    deleteNotification
}