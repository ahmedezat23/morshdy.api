const express = require('express');
const { getCart, updateQuantity, removeFromCart, clearCart, addToCart } = require('../controllers/cartController');
const router = express.Router();
const isAuth = require('../middleware/isAuth');

router.get('/',isAuth,getCart);
router.post('/add', isAuth,addToCart);
router.patch('/update',isAuth, updateQuantity);
router.put('/',isAuth, removeFromCart);
router.delete('/clear',isAuth, clearCart);

module.exports = router;
