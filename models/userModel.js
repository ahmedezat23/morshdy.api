const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    role: {
        type: String,
        require:true,
        enum: ['Tourist','Admin'],
        default: 'Tourist',
    },
    fullName: {
        type: String,
        required: true
    },
    mobile: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: false
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
    userImg:{
        type: String,
        required: false
    },
    verified: {
        type: Boolean,
        default:false
    },
    zipCode:{
        type: String,
        required:false
    }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
