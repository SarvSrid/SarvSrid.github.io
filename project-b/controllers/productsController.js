const productsModel = require('../models/productsModel');
require('dotenv').config();
const axios = require('axios');

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

// API call to Unsplash
exports.getProductImages = async (req, res) => {
    try {
        const query = req.query.query || 'pixel art';
        const unsplashUrl = `https://api.unsplash.com/search/photos`;
        const response = await axios.get(unsplashUrl, {
            params: { query, per_page: 6 },
            headers: { Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}` },
        });

        const images = response.data.results.map(img => ({
            id: img.id,
            url: img.urls.small,
            description: img.alt_description,
        }));

        res.json(images);
    } catch (error) {
        console.error('Error fetching images from Unsplash:', error);
        res.status(500).json({ error: 'Failed to fetch images from Unsplash' });
    }
};
