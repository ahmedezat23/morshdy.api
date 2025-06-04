const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
      },
      quantity: {
        type: Number,
        required: true
      }
    }
  ],
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    totalPrice:{
        type: Number,
        required: true
    },
    StatusPaymentbyTourist:{
        type:String,
        enum: ['Paid','UnPaid'],
        default: 'UnPaid',
    },
    StatusPaymentbyShope:{
        type:String,
        enum: ['Paid','UnPaid'],
        default: 'UnPaid',
    }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
