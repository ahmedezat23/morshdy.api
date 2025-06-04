const express = require('express');
const connectDB = require('./utils/db');
const swaggerSpec = require('./utils/swaggerConfig');
const swaggerUi = require('swagger-ui-express');
const cors = require('cors');
const path = require('path');
const { app } = require('./utils/socket');
require('dotenv').config();

// إعداد CORS للسماح بالاتصال من تطبيق React
app.use(cors());

// استخدام ملفات JSON
app.use(express.json());

// إعداد مجلد رفع الملفات (للصور)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// الاتصال بقاعدة البيانات
connectDB();

// Swagger - لتوثيق الـ API
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// إعداد المسارات
app.get('/', (req, res) => {
    res.send('Server is running');
});

// مسارات الـ API
app.use('/api/v1/auth', require('./routes/authRoute'));
app.use('/api/v1/user', require('./routes/userRoute'));
app.use('/api/v1/category', require('./routes/categoryRoute'));
app.use('/api/v1/notifications', require('./routes/notificationRoute'));
app.use('/api/v1/orders', require('./routes/orderRoute'));
app.use('/api/v1/product', require('./routes/productRoute'));
app.use('/api/v1/review', require('./routes/reviewRoute'));
app.use('/api/v1/shop', require('./routes/shopeRoure')); // راوت المتاجر
app.use('/api/v1/users', require('./routes/userRoute'));
app.use('/api/v1/profit', require('./routes/profitRoute'));
app.use('/api/v1/discount', require('./routes/discountRoute'));
app.use('/api/v1/admin', require('./routes/adminRoute'));
app.use('/api/v1/cart', require('./routes/cartRoute'));

// بدء الخادم على المنفذ المحدد
const PORT = process.env.PORT ;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
