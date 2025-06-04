// controllers/profitController.js
const Profit = require('../models/profitModel');

// GET: Get profit percentage
exports.getProfitPercentage = async (req, res) => {
  try {
    const profit = await Profit.findOne();
    if (!profit) return res.status(404).json({ message: 'No profit data found' });

    res.json({ percentage: profit.percentage });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// PUT: Update profit percentage
exports.updateProfitPercentage = async (req, res) => {
  try {
    const { percentage } = req.body;

    if (typeof percentage !== 'number') {
      return res.status(400).json({ message: 'Percentage must be a number' });
    }

    let profit = await Profit.findOne();

    if (!profit) {
      profit = new Profit({ percentage });
    } else {
      profit.percentage = percentage;
    }

    await profit.save();
    res.json({ message: 'Profit percentage updated', percentage: profit.percentage });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};
