
const mongoose = require('mongoose');


const platformProfitSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    source: {
      type: String,
      required: true,
      enum: ['subscription', 'commission', 'ads', 'other'], // تقدر تزود حسب نظامك
    },
    note: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true, // بتسجل createdAt و updatedAt تلقائي
  }
);
module.exports = mongoose.model('PlatformProfit', platformProfitSchema);

