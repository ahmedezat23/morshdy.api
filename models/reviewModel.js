const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
    },
    content: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        enum: [0,1,2,3,4,5],
        required: true
    },
    verified: {
        type: Boolean,
        default:false
    },
}, { timestamps: true });

module.exports = mongoose.model('Review', reviewSchema);
