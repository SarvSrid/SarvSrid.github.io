const db = require('../db');

// Add a new product
exports.addProduct = (name, description, imagePath, price, category) => {
    const stmt = db.prepare('INSERT INTO Products (name, description, image_url, price, category_id) VALUES (?, ?, ?, ?, ?)');
    const result = stmt.run(name, description, imagePath, price, category);
    return result.lastInsertRowid;
};

// Edit an existing product
exports.editProduct = (id, name, description, imagePath, price, category) => {
    const stmt = db.prepare('UPDATE Products SET name = ?, description = ?, image_url = ?, price = ?, category_id = ? WHERE id = ?');
    const result = stmt.run(name, description, imagePath, price, category, id);
    return result.changes;
};

// Delete a product
exports.deleteProduct = (id) => {
    const stmt = db.prepare('DELETE FROM Products WHERE id = ?');
    const result = stmt.run(id);

    // Reset the auto-increment counter after deletion
    db.prepare("DELETE FROM sqlite_sequence WHERE name = 'Products'").run();

    return result.changes;
};

//Return existing products
exports.productExists = (name, imagePath) => {
    const stmt = db.prepare('SELECT COUNT(*) AS count FROM Products WHERE name = ? OR image_url = ?');
    const result = stmt.get(name, imagePath);
    return result.count > 0;
};
