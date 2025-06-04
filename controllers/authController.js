const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel'); 
const OTP = require('../models/otpModel'); 
const Shop = require('../models/shopModel'); 
const Notification = require('../models/notificationModel'); 
const { validationResult } = require('express-validator');

const register = async (req, res, next) => {

    const { email, password, fullName,mobile, address ,zipCode} = req.body;

    try {
        // Check if user already exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        // Create and save the new user
        user = new User({email, password, fullName,mobile, address ,zipCode });
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        await user.save();

        // create notification 
        if(user.role==="Tourist"){
            const notification=new Notification({
                typeNotification:user.role,
                typeUser:"Admin",
                content: "Add New Tourist into Platform Now"
            })
            await notification.save();
        }

        // Generate OTP
        const otp = (100000 + Math.floor(Math.random() * 900000)).toString();
        const newOTP = new OTP({ email, otp });
        await newOTP.save(); // Ensure OTP is saved before proceeding

        // Find the most recent OTP for the email
        const response = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1);
        
        if (response.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'The OTP is not valid',
            });
        }

        return res.status(201).json({
            success: true,
            message: 'OTP sent successfully',
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send(err.message);
    }
};

// Login user
const login = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { email, password } = req.body;

    // البحث أولاً في المستخدمين
    let user = await User.findOne({ email });

    if (!user) {
      // لو مش موجود، ابحث في المتاجر
      const shop = await Shop.findOne({ email });
      if (!shop) {
        return res.status(404).json({ error: 'This Email does not exist in Users or Shops' });
      }

      const isMatch = await bcrypt.compare(password, shop.password);
      if (!isMatch) {
        return res.status(401).json({ error: 'Incorrect password' });
      }

      const tokenData = { userId: shop._id };
      const token = jwt.sign(tokenData, process.env.JWT_SECRET, { expiresIn: '24h' });

      const Role = 'Store';

      return res.status(200).json({ Token: token, user: shop, Role, message: 'Login Successfully' });
    }

    // لو المستخدم موجود
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Incorrect password' });
    }

    if (user.verified === false) {
      return res.status(403).json({ error: 'User not verified' });
    }

    const tokenData = { userId: user._id };
    const token = jwt.sign(tokenData, process.env.JWT_SECRET, { expiresIn: '24h' });

    const Role = user.role || "";

    res.status(200).json({ Token: token, user, Role, message: 'Login Successfully' });

  } catch (err) {
    console.error('Error logging in:', err);
    next(err);
  }
};


const forgetPassword = async (req, res, next) => {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
        return res.status(400).json({ message: 'Please provide email, OTP, and new password.', success: false });
    }

    try {
        const otpRecord = await OTP.findOne({ otp }).sort({ createdAt: -1 }).limit(1);
        if (!otpRecord) {
            return res.status(400).json({ message: 'Invalid OTP.', success: false });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        let user = await User.findOne({ email });
        if (user) {
            user.password = hashedPassword;
            await user.save();
            return res.status(200).json({ message: 'User password updated successfully.',success: true });
        }

        let shop = await Shop.findOne({ email });
        if (shop) {
            shop.password = hashedPassword;
            await shop.save();
            return res.status(200).json({ message: 'Shop password updated successfully.',success: true});
        }

        return res.status(404).json({ message: 'No user or shop found with this email.' , success: false});

    } catch (error) {
        next(error);
    }
};




// Refresh token
const refreshToken = async (req, res, next) => {
    const { token } = req.body;

    if (!token) {
        return res.status(401).json({ msg: 'No token provided' });
    }

    try {
        // تحقق من التوكين الأصلي
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // تأكد من أن SECRET يتم تحميله من البيئة
        const userId = decoded.userId; // تحقق من أن البيانات التي تحتاجها موجودة في التوكين

        if (!userId) {
            return res.status(401).json({ msg: 'Invalid token data' });
        }

        // قم بإنشاء توكين جديد يتضمن بيانات المستخدم
        const payload = {userId};
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, newToken) => {
            if (err) {
                console.error(err.message);
                return res.status(500).json({ msg: 'Error signing token' });
            }
            res.status(200).json({ token: newToken });
        });
    } catch (err) {
        console.error(err.message);
        res.status(401).json({ msg: 'Invalid token' });
    }
};

module.exports = {
    register,
    login,
    forgetPassword,
    refreshToken,
};
