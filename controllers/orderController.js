const PlatformProfit = require('../models/PlatformProfit');
const profitModel = require('../models/profitModel');
const StoreProfit = require('../models/StoreProfit');
const Order = require('../models/orderModel');
const Product = require('../models/productModel');
const Notification = require('../models/notificationModel');
const Cart = require('../models/cartModel');

// Create a new order
const createOrder = async (req, res) => {
  try {
    const userId = req.userId;
    const { products, totalPrice } = req.body;

    if (!products || products.length === 0) {
      return res.status(400).json({ success: false, message: "No products provided" });
    }

    const productIds = products.map(p => p.product);
    const validProducts = await Product.find({ _id: { $in: productIds } });

    if (validProducts.length === 0) {
      return res.status(404).json({ success: false, message: "Products not found" });
    }

    const shopIds = [...new Set(validProducts.map(product => product.shopeId))];

    const order = new Order({ userId, products, totalPrice });
    await order.save();

    for (const shopId of shopIds) {
      const notification = new Notification({
        typeNotification: 'Order',
        typeUser: "Shop",
        UserId: shopId,
        content: "Add New Order to Your Shop"
      });
      await notification.save();
    }

    await Cart.findOneAndDelete({ userId });

    res.status(201).json({ success: true, message: "Add Order Successfully" });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};
// Get all orders
const getAllOrders = async (req, res) => {
    try {
// استرجاع جميع الطلبات
    const orders = await Order.find()
      .populate({
        path: 'products.product',
      })
      .populate('userId');

    // فلترة الطلبات التي تحتوي على منتج يخص المتجر المطلوب
    const filteredOrders = orders.filter(order => 
      order.products.some(p => p.product) // يعني فيه منتج بعد الـ match
    );

    res.status(200).json(filteredOrders);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Get order by ID
const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('userId').populate('productIds', 'name price');
        if (!order) {
            return res.status(404).json({ success: false, error: "Order not found" });
        }
        res.status(200).json({
            success: true, data: {
                id: order._id,
                productIds: order.productIds,
                userId: order.userId,
                totalPrice: order.totalPrice,
                StatusPaymentbyTourist: order.StatusPaymentbyTourist,
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// // Get order by ID
const getOrderByShope = async (req, res) => {
    try {
        const shopeId = req.params.id
        const products = await Product.find({ shopeId }).select('_id');
        

        const productIds = products.map(product => product._id);

        const orders = await Order.find({ productIds: { $in: productIds } })
            .populate('productIds')
            .populate('userId');

        res.status(200).json({ success: true, data: orders });

    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
const getOrdersByUserId = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.userId })
      .populate('products.product') // ✅ بدل productIds
      .populate('userId');

    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ error: 'Server Error' });
  }
};

const getOrdersByShopeId = async (req, res) => {
  try {
    const { shopeId } = req.params;

    // استرجاع جميع الطلبات
    const orders = await Order.find()
      .populate({
        path: 'products.product',
        match: { shopeId }, // فلترة المنتجات حسب المتجر
      })
      .populate('userId');

    // فلترة الطلبات التي تحتوي على منتج يخص المتجر المطلوب
    const filteredOrders = orders.filter(order => 
      order.products.some(p => p.product) // يعني فيه منتج بعد الـ match
    );

    res.status(200).json(filteredOrders);
  } catch (err) {
    res.status(500).json({ error: 'Server Error' });
  }
};


const checkIfUserPurchasedProduct = async (req, res) => {
  try {
    const { userId, productId } = req.query;
    if (!userId || !productId) {
      return res.status(400).json({ success: false, message: "Missing userId or productId" });
    }

    // ابحث عن طلب يحتوي على هذا المنتج
    const order = await Order.findOne({
userId,
      StatusPaymentbyTourist: "Paid",
      products: {
        $elemMatch: { product: productId } // لأن المنتجات عبارة عن مصفوفة من كائنات
      }
    });
    const hasPurchased = !!order;

    res.status(200).json({ hasPurchased });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};



const markOrderAsPaidByTourist = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId);
    const profit = await profitModel.find({});

    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (!profit[0]) return res.status(500).json({ message: 'Profit percentage data missing' });

    if (order.StatusPaymentbyTourist === 'Paid') {
      return res.status(400).json({ message: 'Order already paid or not valid for payment' });
    }

    // افترض أن products يحتوي على productId فقط
    const productId = order.products[0]?.product; 
    if (!productId) return res.status(400).json({ message: 'No products in order' });

    // جلب بيانات المنتج من قاعدة البيانات
    const productData = await Product.findById(productId);
    if (!productData) return res.status(404).json({ message: 'Product not found' });

    const storeId = productData.shopeId;

    const totalAmount = order.totalPrice;
    const platformCommission = totalAmount * (parseFloat(profit[0].percentage) / 100);
    const storeProfit = totalAmount - platformCommission;

    order.StatusPaymentbyTourist = 'Paid';
    await order.save();

    const platformProfit = new PlatformProfit({
      amount: platformCommission,
      source: 'commission',
      note: `Commission from order ${orderId}`
    });
    await platformProfit.save();

    const storeProfitnew = new StoreProfit({
      amount: storeProfit,
      store: storeId,
      orderId: order._id
    });
    await storeProfitnew.save();

    res.status(200).json({ message: 'Order marked as paid by tourist, profits distributed' });
  } catch (err) {
    res.status(500).json({ message: 'Error marking order as paid', error: err.message });
  }
};



module.exports = {
    createOrder,
    checkIfUserPurchasedProduct,
    getAllOrders,
    markOrderAsPaidByTourist,
    getOrderById,
    getOrderByShope,
    getOrdersByShopeId,
    getOrdersByUserId
}