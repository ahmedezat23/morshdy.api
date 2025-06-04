const Category = require('../models/categoryModel');


// Create a new category
const createCategory = async (req, res) => {
    try {
        const { name, description } = req.body;
        const newCategory = new Category({ name, description });
        await newCategory.save();
        res.status(201).json({  success: true, message: 'Category created successfully'});
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get all categories
const getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        const categoriesData = categories.map(category => ({
            id: category._id,
            name: category.name,
            description: category.description
        }));
        res.status(200).json({success: true,data:categoriesData});
    } catch (error) {
        res.status(400).json({ success: false,error: error.message });
    }
};

// Get a category by ID
const getCategoryById = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ success: false,message: 'Category not found' });
        }
        res.status(200).json({
            id: category._id,
            name: category.name,
            description: category.description
        });
    } catch (error) {
        res.status(400).json({ success: false,error: error.message });
    }
};

// Update a category by ID
const updateCategory = async (req, res) => {
    try {
        const updatedCategory = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedCategory) {
            return res.status(404).json({success: false, message: 'Category not found' });
        }
        res.status(200).json({success: true, message: 'Category updated successfully'});
    } catch (error) {
        res.status(400).json({ success: false,error: error.message });
    }
};

// Delete a category by ID
const deleteCategory = async (req, res) => {
    try {
        const deletedCategory = await Category.findByIdAndDelete(req.params.id);
        if (!deletedCategory) {
            return res.status(404).json({success: false, message: 'Category not found' });
        }
        res.status(200).json({ success: true,message: 'Category deleted successfully' });
    } catch (error) {
        res.status(400).json({ success: false,error: error.message });
    }
};

module.exports = {
    deleteCategory,
    updateCategory,
    getCategoryById,
    getAllCategories,
    createCategory
}