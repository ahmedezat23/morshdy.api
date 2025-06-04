
const User = require('../models/userModel');
const Order = require('../models/orderModel');
const Shope = require('../models/shopModel');
const bcrypt = require('bcryptjs');

// Add a new admin
const addAdmin = async (req, res) => {
    try {
        const { fullName, mobile, address, email, password, zipCode } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already in use' });
        }

        const newAdmin = new User({
            role: 'Admin',
            fullName,
            mobile,
            address,
            email,
            password, 
            zipCode,
            verified:true
        });
        const salt = await bcrypt.genSalt(10);
        newAdmin.password = await bcrypt.hash(password, salt);
        await newAdmin.save();
        res.status(201).json({ message: 'Admin created successfully', admin: newAdmin });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get all admins
const getAllAdmins = async (req, res) => {
    try {
        const admins = await User.find({ role: 'Admin' });
        res.status(200).json(admins);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Delete an admin by ID
const deleteAdmin = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedAdmin = await User.findOneAndDelete({ _id: id, role: 'Admin' });

        if (!deletedAdmin) {
            return res.status(404).json({ message: 'Admin not found' });
        }

        res.status(200).json({ message: 'Admin deleted successfully', admin: deletedAdmin });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const getStatistics = async (req, res) => {
    try {
      const totalOrders = await Order.countDocuments();
      const totalTourists = await User.countDocuments({ role: 'Tourist' });
      const totalShop = await User.countDocuments({ role: 'Shop' });
      const totalStories = await Shope.countDocuments();
  
      res.json({
        orders: totalOrders,
        tourists: totalTourists,
        stories: totalStories+totalShop
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  };

const markStoreAsPaid = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    if (order.StatusPaymentbyShope=="Paid") {
      return res.status(400).json({ message: 'Store already marked as paid' });
    }

    order.StatusPaymentbyShope = "Paid";
    await order.save();

    res.status(200).json({ message: 'Store marked as paid successfully' });

  } catch (err) {
    res.status(500).json({ message: 'Error updating store payment status', error: err.message });
  }
};


module.exports = {
    addAdmin,
    getAllAdmins,
    deleteAdmin,
    markStoreAsPaid,
    getStatistics
};
