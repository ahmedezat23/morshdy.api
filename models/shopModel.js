const mongoose = require('mongoose');

const shopSchema = new mongoose.Schema({
    nameShope: {
        type: String,
        required: true
    },
    ownerShope: {
        type: String,
        required: true
    },
    latitude: {
        type: Number,
        required: true
    },
    longitude: {
        type: Number,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    shopeImg:{
        type: String,
        required: true
    },
    descripition:{
        type: String,
        required: true
    },
    
}, { timestamps: true });

module.exports = mongoose.model('Shop', shopSchema);
