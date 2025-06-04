// controllers/cartController.js
const Cart = require('../models/cartModel');

// Get cart by user
const getCart = async (req, res) => {
  try {
    const userId  = req.userId;
    const cart = await Cart.findOne({ userId }).populate('products.productId');
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Add product to cart
const addToCart = async (req, res) => {
  try {
    const userId=req.userId
    const { productId, quantity = 1 } = req.body;

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId:Object(userId), products: [{ productId, quantity }] });
    } else {
      const item = cart.products.find(p => p.productId.toString() === productId);
      if (item) {
        item.quantity += quantity;
      } else {
        cart.products.push({ productId, quantity });
      }
    }

    await cart.save();
    res.status(200).json({ message: 'Product added to cart', cart });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update product quantity
const updateQuantity = async (req, res) => {
  try {
    const userId  = req.userId;
    const { productId, quantity } = req.body;

    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    const item = cart.products.find(p => p.productId.toString() === productId);
    if (!item) return res.status(404).json({ message: 'Product not in cart' });

    item.quantity = quantity;
    await cart.save();

    res.status(200).json({ message: 'Quantity updated', cart });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Remove product from cart
const removeFromCart = async (req, res) => {
  try {
    const userId = req.userId;
    const { productId } = req.body;

    if (!productId) return res.status(400).json({ message: 'Product ID is required' });

    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    const initialLength = cart.products.length;
    cart.products = cart.products.filter(p => p.productId.toString() !== productId);

    if (cart.products.length === initialLength) {
      return res.status(404).json({ message: 'Product not found in cart' });
    }

    await cart.save();

    res.status(200).json({ message: 'Product removed successfully', cart });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};


// Clear entire cart
const clearCart = async (req, res) => {
  try {
    const userId  = req.userId;

    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    cart.products = [];
    await cart.save();

    res.status(200).json({ message: 'Cart cleared', cart });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};



module.exports = {
    clearCart,
    removeFromCart,
    updateQuantity,
    getCart,
    addToCart
};
