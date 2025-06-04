// controllers/discountController.js
const Discount = require('../models/discountModel');

// Create a new discount code
exports.createDiscountCode = async (req, res) => {
  try {
    const { code, percentage } = req.body;

    if (!code || typeof percentage !== 'number') {
      return res.status(400).json({ message: 'Code and percentage are required' });
    }

    const existing = await Discount.findOne({ code });
    if (existing) {
      return res.status(409).json({ message: 'Discount code already exists' });
    }

    const newDiscount = new Discount({ code, percentage });
    await newDiscount.save();

    res.status(201).json({ message: 'Discount code created', discount: newDiscount });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Get the last discount code added
exports.getLastDiscountCode = async (req, res) => {
  try {
    const lastDiscount = await Discount.findOne().sort({ createdAt: -1 });
    if (!lastDiscount) {
      return res.status(404).json({ message: 'No discount codes found' });
    }

    res.json({ discount: lastDiscount });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};
