const productsModel = require('../models/productsModel');

exports.getAllProducts = (req, res) => {
    const products = productsModel.getAllProducts();
    res.json(products);
};

exports.getProductDetails = (req, res) => {
    const productId = parseInt(req.params.id);
    const product = productsModel.getProductDetails(productId);

    if (product) {
        res.json(product);
    } else {
        res.status(404).json({ error: 'Product not found' });
    }
};

// Get all categories
exports.getAllCategories = (req, res) => {
    try {
        const categories = productsModel.getAllCategories();
        res.json(categories);
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ error: 'Failed to fetch categories' });
    }
};

exports.getProducts = (req, res) => {
    try {
        const categoryId = req.query.categoryId || 'all'; // Default to all categories
        const products = productsModel.getProductsByCategory(categoryId);
        res.json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error: 'Failed to fetch products' });
    }
};