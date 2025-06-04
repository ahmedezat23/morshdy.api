const Product = require('../models/productModel');
const Shop = require('../models/shopModel');

// Create a new product
const createProduct = async (req, res) => {
    try {
        const shopeId=req.params.shopeId
        const {categoryId,name,productImg,descripition,price} = req.body
        const product = new Product({shopeId,categoryId:Object(categoryId),name,productImg,descripition,price});
        await product.save();
        res.status(201).json({ success: true, data: "Product Created Successfully " });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// Get all products
const getAllProducts = async (req, res) => {
    const {categoryId, shopeId, sortBy = 'name' } = req.query;

    try {
      const filter = {};
      if (categoryId) filter.categoryId = categoryId;
      if (shopeId) filter.shopeId = shopeId;
  
      const products = await Product.find(filter)
        .sort({ [sortBy]: 1 })
        .populate('categoryId shopeId');
  
      const count = await Product.countDocuments(filter);
  
      res.json({
        total: count,
        products
      });
    } catch (err) {
      res.status(500).json({ error: 'Server error' });
    }
};

// Get product by ID
const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
            .populate('categoryId')
            .populate('shopeId');
        if (!product) {
            return res.status(404).json({ success: false, error: "Product not found" });
        }
        res.status(200).json({ success: true, data: {
            productId:product._id,
            productName:product.name,
            productImage:product.productImg,
            descripition:product.descripition,
            price:product.price,
            categoryName:product.categoryId.name,
            shopeName:product.shopeId.nameShope,
            ShopeOwner:product.shopeId.ownerShope
        } });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Update a product
const updateProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!product) {
            return res.status(404).json({ success: false, error: "Product not found" });
        }
        res.status(200).json({ success: true, message: "product Updated Successfully" });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// Delete a product
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).json({ success: false, error: "Product not found" });
        }
        res.status(200).json({ success: true, message: "Product Deleted Successfully" });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

const getProductsByLocation = async (req, res) => {
    const { lat, lng, radius = 10 } = req.query;
  
    try {
      const shops = await Shop.find({
        latitude: { $exists: true },
        longitude: { $exists: true },
      });
  
      const nearShopIds = shops
        .filter(shop => {
          const distance = Math.sqrt(
            Math.pow(shop.latitude - lat, 2) + Math.pow(shop.longitude - lng, 2)
          );
          return distance <= radius / 111; // تقريبًا نصف قطر الدائرة بالكيلومترات
        })
        .map(shop => shop._id);
  
      const products = await Product.find({ shopeId: { $in: nearShopIds } });
      res.json(products);
    } catch (err) {
      res.status(500).json({ error: 'Server Error' });
    }
}
;

const searchProduct = async (req, res) => {
    const { q } = req.query;
    try {
      const products = await Product.find({
        name: { $regex: q, $options: 'i' }
      }).populate('categoryId shopeId');
      res.status(500).json(products);
    } catch (err) {
      res.status(500).json({ error: 'Server error' });
    }
  };

  const getOtherProductsFromCategory = async (req, res) => {
    const { productId } = req.params;
  
    try {
      const product = await Product.findById(productId);
      if (!product) return res.status(404).json({ message: 'Product not found' });
  
      const others = await Product.find({
        categoryId: product.categoryId,
        _id: { $ne: productId }
      }).limit(10);
  
      res.json(others);
    } catch (err) {
      res.status(500).json({ error: 'Server error' });
    }
  };
  
  
module.exports = {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    getProductsByLocation,
    searchProduct,
    getOtherProductsFromCategory
}