const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    UserId: {
        type: String,
        required: false
    },
    typeNotification: {
        type: String,
        enum: ['Tourist', 'Shop', 'Order', 'Payment','Review'],
        required: true
    },
    date: {
        type: Date, 
        default: Date.now   
    },
    typeUser: {
        type: String,
        enum: ['Tourist', 'Shop', 'Admin'],
        required: true
    },
    status: {
        type: String,
        enum: ['Read', 'Not Read'],
        default: 'Not Read'
    },
    content: {
        type: String,
        required: true
    },
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);
