const express = require('express');
const router = express.Router();
const discountController = require('../controllers/discountController');

router.post('/', discountController.createDiscountCode);
router.get('/last', discountController.getLastDiscountCode);

module.exports = router;
