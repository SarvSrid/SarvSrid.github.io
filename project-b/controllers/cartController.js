const db = require('../db');
const cartModel = require('../models/cartModel');

const userId = 1;

exports.getCart = (req, res) => {
    try {
        const userId = 1; // Example hardcoded userId, update based on session or auth logic
        const cart = cartModel.getOrCreateCart(userId);

        if (!cart) {
            return res.status(404).json({ error: 'Cart not found.' });
        }

        const cartItems = cartModel.getCart(cart.id);
        res.json(cartItems);
    } catch (error) {
        console.error('Error fetching cart:', error);
        res.status(500).json({ error: 'Failed to fetch cart items' });
    }
};

exports.addToCart = (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const cart = cartModel.getOrCreateCart(userId);
        cartModel.addToCart(cart.id, productId, quantity);
        const cartItems = cartModel.getCart(cart.id);
        res.json({ message: 'Item added to cart', cart: cartItems });
    } catch (error) {
        console.error('Error adding to cart:', error);
        res.status(500).json({ error: 'Failed to add item to cart' });
    }
};

exports.updateCart = (req, res) => {
    try {
        const productId = parseInt(req.params.productId);
        const { quantity } = req.body;

        console.log(`Updating cart: productId=${productId}, quantity=${quantity}`);

        if (quantity < 1) {
            return res.status(400).json({ error: 'Quantity must be at least 1' });
        }

        const cart = cartModel.getOrCreateCart(1);
        cartModel.updateCart(cart.id, productId, quantity);

        const updatedCart = cartModel.getCart(cart.id);
        res.json({ message: 'Cart updated successfully', cart: updatedCart });
    } catch (error) {
        console.error('Error updating cart:', error);
        res.status(500).json({ error: 'Failed to update cart' });
    }
};

exports.removeFromCart = (req, res) => {
    try {
        const productId = parseInt(req.params.productId);
        const cart = cartModel.getOrCreateCart(userId);
        cartModel.removeFromCart(cart.id, productId);
        const cartItems = cartModel.getCart(cart.id);
        res.json({ message: 'Item removed from cart', cart: cartItems });
    } catch (error) {
        console.error('Error removing from cart:', error);
        res.status(500).json({ error: 'Failed to remove item from cart' });
    }
};

exports.checkoutCart = (req, res) => {
    try {
        const userId = req.body.userId;
        console.log(`Checking out cart for userId=${userId}`);

        const cart = cartModel.getCartByStatus(userId, 'new');
        if (!cart) {
            return res.status(400).json({ error: 'No active cart found for checkout.' });
        }

        const insertOrderStmt = db.prepare('INSERT INTO Orders (cart_id, order_date, total_amount, status, customer_id) VALUES (?, ?, ?, ?, ?)');
        const orderDate = new Date().toISOString();
        const totalAmount = cartModel.calculateCartTotal(cart.id); // Implement this function in your model
        const orderResult = insertOrderStmt.run(cart.id, orderDate, totalAmount, 'processing', userId);

        const cartItems = cartModel.getCartItems(cart.id);
        const insertOrderProductStmt = db.prepare('INSERT INTO OrderProducts (order_id, product_id, quantity, price_per_unit) VALUES (?, ?, ?, ?)');
        for (const item of cartItems) {
            insertOrderProductStmt.run(orderResult.lastInsertRowid, item.product_id, item.quantity, item.price);
        }

        // Mark the cart as purchased
        const updateCartStmt = db.prepare('UPDATE Carts SET status = ? WHERE id = ?');
        updateCartStmt.run('purchased', cart.id);

        // Clear cart products
        const deleteCartProductsStmt = db.prepare('DELETE FROM CartProducts WHERE cart_id = ?');
        deleteCartProductsStmt.run(cart.id);

        res.json({ message: 'Checkout successful', orderId: orderResult.lastInsertRowid });
    } catch (error) {
        console.error('Error during checkout:', error);
        res.status(500).json({ error: 'Failed to complete checkout' });
    }
};