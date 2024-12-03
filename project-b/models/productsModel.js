const db = require('../db');

// Fetch all products
exports.getAllProducts = () => {
    const stmt = db.prepare('SELECT * FROM Products');
    return stmt.all();
};

// Fetch a product by ID
exports.getProductDetails = (id) => {
    const stmt = db.prepare('SELECT * FROM Products WHERE id = ?');
    return stmt.get(id);
};

// Fetch all categories
exports.getAllCategories = () => {
    const categories = db.prepare('SELECT * FROM Categories').all();
    return categories;
};

// Fetch products by category
exports.getProductsByCategory = (categoryId) => {
    if (categoryId === 'all') {
        return db.prepare('SELECT * FROM Products').all();
    }

    return db.prepare('SELECT * FROM Products WHERE category_id = ?').all(categoryId);
};