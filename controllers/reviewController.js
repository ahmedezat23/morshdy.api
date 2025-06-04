const Review = require('../models/reviewModel');
const Product = require('../models/productModel');
const Notification = require('../models/notificationModel');

// Create a new review
const createReview = async (req, res) => {
    try {
        const userId = req.userId;
        const productId = req.params.productId;
        const { content, rating } = req.body;

        if (!content || !rating) {
            return res.status(400).json({ success: false, message: "Content and rating are required" });
        }

        const review = new Review({ userId, productId, content, rating });
        await review.save();

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        const shopId = product.shopeId;
        const notification = new Notification({
            typeNotification: 'Review',
            typeUser: "Shop",
            UserId: shopId,
            content: "A new review has been added to one of your products"
        });
        await notification.save();

        res.status(201).json({ success: true, message: "Your rating has been sent for review." });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};



// Get all reviews By Shope
const getReviewsByShopeId = async (req, res) => {
    try {
        const shopeId = req.params.shopeId
        const products = await Product.find({ shopeId }).select('_id');

        const productIds = products.map(product => product._id);

        const reviews = await Review.find({ productId: { $in: productIds } })
            .populate('userId')
            .populate('productId');
        const reviewsData = reviews.map((review) => ({
            id: review._id,
            content: review.content,
            rating: review.rating,
            productName: review.productId.name,
            userName: review.userId.fullName,
            userImg: review.userId.userImg,
            verified: review.verified,

        }))
        res.status(200).json({ success: true, data: reviewsData });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
const getAllReviews = async (req, res) => {
    try {
      const reviews = await Review.find({})
        .populate('userId', 'name email') // لو حابب تجيب بيانات بسيطة عن المستخدم
        .sort({ createdAt: -1 }); // الأحدث أولًا
  
      res.status(200).json({ success: true, data: reviews });
    } catch (err) {
      res.status(500).json({ error: 'Server Error' });
    }
};

// Get a review by ID
const getReviewById = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id).populate('userId').populate('productId');
        if (!review) {
            return res.status(404).json({ success: false, error: "Review not found" });
        }
        res.status(200).json({
            success: true, data: {
                id: review._id,
                userName: review.userId.fullName,
                userImg: review.userId.userImg,
                productName: review.productId.name,
                productImg: review.productId.productImg,
                content: review.content,
                rating: review.rating
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
// Get all reviews
const getAllReviewsByProduct = async (req, res) => {
    try {
        const productId = req.params.productId
        const reviews = await Review.find({verified:true}).populate('userId');
        reviewsData = reviews.map((review) => ({
            id: review._id,
            userName: review.userId.fullName,
            userImg: review.userId.userImg,
            content: review.content,
            rating: review.rating,
            createdAt:review.createdAt
        }))
        res.status(200).json({ success: true, data: reviewsData });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Update a review
const updateReview = async (req, res) => {
    try {
        const review = await Review.findByIdAndUpdate(req.params.id, req.body);
        if (!review) {
            return res.status(404).json({ success: false, error: "Review not found" });
        }
        res.status(200).json({ success: true, message: "Review Updated Successfully" });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

const deleteReview = async (req, res) => {
    try {
        const review = await Review.findByIdAndDelete(req.params.id);
        if (!review) {
            return res.status(404).json({ success: false, error: "Review not found" });
        }
        res.status(200).json({ success: true, message: "Review Deleted Successfully" });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};


module.exports = {
    deleteReview,
    getAllReviews,
    updateReview,
    getReviewById,
    getAllReviewsByProduct,
    createReview,
    getReviewsByShopeId
}