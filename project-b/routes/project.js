const express = require('express');
const router = express.Router();
const productsController = require('../controllers/productsController');
const cartController = require('../controllers/cartController');
const adminController = require('../controllers/adminController');

// Sign-in page
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/signin.html'));
});

// Products routes
router.get('/products', productsController.getProducts);
router.get('/products/:id', productsController.getProductDetails);
router.get('/categories', productsController.getAllCategories);

// Cart routes
router.get('/cart', cartController.getCart);
router.post('/cart/add', cartController.addToCart);

// Route to update the quantity of an item in the cart
router.put('/cart/update/:productId', cartController.updateCart);
router.delete('/cart/delete/:productId', cartController.removeFromCart);
router.post('/cart/checkout', cartController.checkoutCart);

// Admin Routes
router.post('/admin/products', adminController.addProduct);
router.put('/admin/products/:id', adminController.editProduct);
router.delete('/admin/products/:id', adminController.deleteProduct);
router.post('/admin/bulk-upload', adminController.bulkUpload);

module.exports = router;
