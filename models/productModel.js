const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
    },
    shopeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Shop',
    },
    name:{
        type: String,
        required: true
    },
    productImg:{
        type: String,
        required: true
    },
    descripition:{
        type: String,
        required: true
    },
    price:{
        type: Number,
        required: true
    },
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
