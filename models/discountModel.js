// models/DiscountModel.js
const mongoose = require('mongoose');

const DiscountSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
  },
  percentage: {
    type: Number,
    required: true,
  }
}, { timestamps: true });

module.exports = mongoose.model('Discount', DiscountSchema);
