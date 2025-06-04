const Shope = require('../models/shopModel');
const Order = require('../models/orderModel');
const Notification=require('../models/notificationModel');
const User = require('../models/userModel'); // تأكد من استدعاء موديل المستخدم
const Product = require('../models/productModel');
const bcrypt = require('bcryptjs');
// Create a new shop

const createShope = async (req, res) => {
  try {
    const { nameShope, ownerShope, latitude, longitude, email, password, descripition } = req.body;
    const shopeImg = req.file.filename;

    // تحقق من وجود الإيميل في المتاجر
    const existingShop = await Shope.findOne({ email });
    if (existingShop) {
      return res.status(400).json({ success: false, error: "Email already exists in shops" });
    }

    // تحقق من وجود الإيميل في المستخدمين
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, error: "Email already exists in System" });
    }

    // تشفير كلمة المرور
    const hashedPassword = await bcrypt.hash(password, 10);

    const shope = new Shope({
      nameShope,
      ownerShope,
      latitude,
      longitude,
      email,
      password: hashedPassword,
      descripition,
      shopeImg
    });

    await shope.save();

    const notification = new Notification({
      typeNotification: 'Shop',
      typeUser: "Admin",
      content: "Add New Shope into Platform Now"
    });
    await notification.save();

    res.status(201).json({ success: true, message: "Shope Created Successfully" });

  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};


// Get all shops
const getAllShopes = async (req, res) => {
    try {
        const shopes = await Shope.find({});
        shopesData=shopes.map((shope)=>(
            {
                id:shope._id,
                nameShope:shope.nameShope,
                ownerShope:shope.ownerShope,
                email:shope.email,
                shopeImg:shope.shopeImg,
                descripition:shope.descripition
            }
        ))
        res.status(200).json({ success: true, data: shopesData });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Get a shop by ID
const getShopeById = async (req, res) => {
    try {
        const shope = await Shope.findById(req.params.id);
        if (!shope) {
            return res.status(404).json({ success: false, error: "Shop not found" });
        }
        res.status(200).json({ success: true, data:  {
            id:shope._id,
            nameShope:shope.nameShope,
            ownerShope:shope.ownerShope,
            email:shope.email,
            shopeImg:shope.shopeImg,
            descripition:shope.descripition
        } });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Update a shop
const updateShope = async (req, res) => {
    try {
        const shope = await Shope.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!shope) {
            return res.status(404).json({ success: false, error: "Shop not found" });
        }
        res.status(200).json({ success: true, data: "Shope Updated Successfully" });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// / Change password endpoint
const changeShopPassword = async (req, res) => {
  const { id } = req.params;
  const { currentPassword, newPassword } = req.body;

  try {
    const shop = await Shope.findById(id);
    if (!shop) {
      return res.status(404).json({ success: false, message: 'Shop not found' });
    }

    if (currentPassword != shop.password) {
      return res.status(400).json({ success: false, message: 'Current password is incorrect' });
    }
    shop.password=newPassword;
    await shop.save();

    res.status(200).json({ success: true, message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete a shop
const deleteShope = async (req, res) => {
    try {
        const shope = await Shope.findByIdAndDelete(req.params.id);
        if (!shope) {
            return res.status(404).json({ success: false, error: "Shop not found" });
        }
        const notification=new Notification({
            typeNotification:'Shop',
            typeUser:"Admin",
            content:"Delete Shope Now"
        })
        await notification.save();
        res.status(200).json({ success: true, message:"Shope Deleted Successfully"  });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};


// Get all products by shopeId
const getProductsByShope = async (req, res) => {
    try {
      const { shopeId } = req.params;
      const products = await Product.find({ shopeId }).populate('categoryId shopeId');
  
      res.status(200).json({ products });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error',err:err.message });
    }
  };
  // Get number of products by shopeId
  const getProductCountByShope = async (req, res) => {
    try {
      const { shopeId } = req.params;
      const count = await Product.countDocuments({ shopeId });
  
      res.status(200).json({ shopeId, count });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  };

  


module.exports = {
    createShope,
    getAllShopes,
    getShopeById,
    changeShopPassword,
    updateShope,
    deleteShope,
    getProductsByShope,
    getProductCountByShope
}