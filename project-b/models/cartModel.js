const db = require('../db');

// Get or create a cart for a user
exports.getOrCreateCart = (userId) => {
    let cart = db.prepare("SELECT * FROM Carts WHERE user_id = ? AND status = 'new'").get(userId);

    if (!cart) {
        const stmt = db.prepare("INSERT INTO Carts (status, user_id) VALUES ('new', ?)");
        const result = stmt.run(userId);
        cart = { id: result.lastInsertRowid, status: 'new', user_id: userId };
    }
    return cart;
};

// Fetch all items in cart for a specific cart ID
exports.getCart = (cartId) => {
    const stmt = db.prepare(`
        SELECT cp.id AS cartProductId, p.id AS productId, p.name, p.image_url AS image, p.price, cp.quantity 
        FROM CartProducts cp
        JOIN Products p ON cp.product_id = p.id
        WHERE cp.cart_id = ?
    `);
    return stmt.all(cartId);
};

// Add an item to the cart
exports.addToCart = (cartId, productId, quantity) => {
    const productExists = db.prepare('SELECT * FROM Products WHERE id = ?').get(parseInt(productId));
    if (!productExists) {
        throw new Error(`Product with ID ${productId} does not exist.`);
    }

    const existingItem = db
        .prepare('SELECT * FROM CartProducts WHERE cart_id = ? AND product_id = ?')
        .get(cartId, productId);

    if (existingItem) {
        const updateStmt = db.prepare('UPDATE CartProducts SET quantity = quantity + ? WHERE id = ?');
        updateStmt.run(quantity, existingItem.id);
    } else {
        const insertStmt = db.prepare('INSERT INTO CartProducts (cart_id, product_id, quantity) VALUES (?, ?, ?)');
        const result = insertStmt.run(cartId, productId, quantity);
        console.log(`Inserted product into CartProducts: rowId=${result.lastInsertRowid}`);
    }
};

// Function to update quantity of a product in the cart
exports.updateCart = (cartId, productId, quantity) => {
    console.log(`Executing update: cartId=${cartId}, productId=${productId}, quantity=${quantity}`);

    // Update the quantity of the product in the cart
    const stmt = db.prepare('UPDATE CartProducts SET quantity = ? WHERE cart_id = ? AND product_id = ?');
    const result = stmt.run(quantity, cartId, productId);

    if (result.changes === 0) {
        throw new Error(`Product with ID ${productId} not found in cart`);
    }
};

// Remove an item from the cart
exports.removeFromCart = (cartId, productId) => {
    const stmt = db.prepare('DELETE FROM CartProducts WHERE cart_id = ? AND product_id = ?');
    stmt.run(cartId, productId);
};

// Get cart by user ID and status
exports.getCartByStatus = (userId, status) => {
    return db.prepare('SELECT * FROM Carts WHERE user_id = ? AND status = ?').get(userId, status);
};

// Getitems
exports.getCartItems = (cartId) => {
    return db.prepare(`
        SELECT cp.product_id, cp.quantity, p.price
        FROM CartProducts cp
        JOIN Products p ON cp.product_id = p.id
        WHERE cp.cart_id = ?
    `).all(cartId);
};

// Calculate total
exports.calculateCartTotal = (cartId) => {
    const cartItems = exports.getCartItems(cartId);
    return cartItems.reduce((total, item) => total + item.quantity * item.price, 0);
};