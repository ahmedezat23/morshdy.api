// models/StoreProfit.js
const mongoose = require('mongoose');


const storeProfitSchema = new mongoose.Schema({
  store: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shop',
    required: true,
  },
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
  },
  amount: {
    type: Number,
    required: true,
  },
  note: {
    type: String,
    default: '',
  }
}, {
  timestamps: true,
});

module.exports = mongoose.model('StoreProfit', storeProfitSchema);
