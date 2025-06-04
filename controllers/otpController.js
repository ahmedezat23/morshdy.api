// controllers/otpController.js
const otpGenerator = require('otp-generator');
const OTP = require('../models/otpModel');
const User = require('../models/userModel');

const sendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    let otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });
    let result = await OTP.findOne({ otp: otp });
    while (result) {
      otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
      });
      result = await OTP.findOne({ otp: otp  });
    }
    const otpPayload = { email, otp };
    const otpBody = await OTP.create(otpPayload);
    res.status(200).json({
      success: true,
      message: 'OTP sent successfully',
      otp,
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};
const verifyOTP = async (req, res, next) => {
  try {
    const {email,otp} = req.body;
    // Validate input
    if (!email || !otp) {
      return res.status(400).json({ success: false, error: 'Email and OTP are required' });
    }
    
    // Find and delete the OTP document
    const existingOTP = await OTP.findOneAndDelete(req.body);
    
    if (!existingOTP) {
      // OTP not found
      return res.status(400).json({ success: false, error: 'Invalid OTP' });
    }
    
    // OTP found, now verify user
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    
    if (user.verified) {
      // User already verified
      return res.status(200).json({ success: true, message: 'User is already verified' });
    }
    
    // Verify the user
    user.verified = true;
    await user.save();
    
    // Respond with success
    return res.status(200).json({ success: true, message: 'OTP verification successful' });
    
  } catch (error) {
    // Log detailed error
    console.error('Error verifying OTP:', error.message);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

module.exports = {
  verifyOTP,
  sendOTP
}