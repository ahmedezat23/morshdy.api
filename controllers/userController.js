const User = require('../models/userModel');
const bcrypt = require('bcryptjs');

// Get user details
const getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json( {
            id:user._id,
            role:user.role,
            fullName:user.fullName,
            mobile:user.mobile,
            address:user.address,
            email:user.email,
            userImg:user.userImg,
            zipCode:user.zipCode,
        });
    } catch (error) {
        next(error);
    }
};

// Get all users
const getUsers = async (req, res) => {
    try {
        const users = await User.find();
        usersData=users.map((user)=>(
            {
                id:user._id,
                role:user.role,
                fullName:user.fullName,
                mobile:user.mobile,
                address:user.address,
                email:user.email,
                userImg:user.userImg,
                zipCode:user.zipCode,
            }
        ))
        res.status(200).json({ success: true, data: usersData });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Get a user by ID
const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ success: false, error: "User not found" });
        }
        res.status(200).json({ success: true, data: 
            {
            id:user._id,
            role:user.role,
            fullName:user.fullName,
            mobile:user.mobile,
            address:user.address,
            email:user.email,
            zipCode:user.zipCode,
        } });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Update a user
const updateUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.userId, req.body, {
            new: true,
            runValidators: true,
        });
        if (!user) {
            return res.status(404).json({ success: false, error: "User not found" });
        }
        res.status(200).json({ success: true, data: user });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// Delete a user
const deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ success: false, error: "User not found" });
        }
        res.status(200).json({ success: true, data: 'User Deleted Successfully' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// reast password
const reastPassword = async (req, res, next) => {
    const {newPassword } = req.body;

    if (!newPassword) {
        return res.status(400).json({ message: 'Please provide new password.' });
    }

    try {
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10); // Hash the new password
        user.password = hashedPassword;
        await user.save();

        res.status(200).json({ message: 'Password reast successfully.' });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    deleteUser,
    updateUser,
    getUserById,
    getUsers,
    reastPassword,
    getUser
}