// models/ProfitModel.js
const mongoose = require('mongoose');

const ProfitSchema = new mongoose.Schema({
  percentage: {
    type: Number,
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Profit', ProfitSchema);