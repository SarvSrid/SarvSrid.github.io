const adminModel = require('../models/adminModel');

// Add a new product
exports.addProduct = (req, res) => {
    try {
        const { name, description, category, imagePath, price } = req.body;

        const newProductId = adminModel.addProduct(name, description, imagePath, price, category);

        res.status(201).json({ message: 'Product added successfully', productId: newProductId });
    } catch (error) {
        console.error('Error adding product:', error);
        res.status(500).json({ error: 'Failed to add product' });
    }
};

// Edit an existing product
exports.editProduct = (req, res) => {
    try {
        const productId = req.params.id;
        const { name, description, category, imagePath, price } = req.body;

        const rowsUpdated = adminModel.editProduct(productId, name, description, imagePath, price, category);

        if (rowsUpdated === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.json({ message: 'Product updated successfully' });
    } catch (error) {
        console.error('Error editing product:', error);
        res.status(500).json({ error: 'Failed to edit product' });
    }
};

// Delete a product
exports.deleteProduct = (req, res) => {
    try {
        const productId = req.params.id;

        const rowsDeleted = adminModel.deleteProduct(productId);

        if (rowsDeleted === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ error: 'Failed to delete product' });
    }
};

exports.bulkUpload = (req, res) => {
    try {
        const products = req.body;

        if (!Array.isArray(products)) {
            return res.status(400).json({ error: 'Invalid data format. Expected an array of products.' });
        }

        let addedCount = 0;
        let duplicateCount = 0;

        products.forEach(product => {
            if (
                product.name &&
                product.description &&
                product.category &&
                product.imagePath &&
                product.price
            ) {
                // Check for duplicate products
                const exists = adminModel.productExists(product.name, product.imagePath);
                if (exists) {
                    console.log(`Duplicate product skipped: ${product.name}`);
                    duplicateCount++;
                } else {
                    // Add product if it does not exist
                    adminModel.addProduct(
                        product.name,
                        product.description,
                        product.imagePath,
                        product.price,
                        parseInt(product.category)
                    );
                    addedCount++;
                }
            } else {
                console.error('Invalid product format:', product);
            }
        });

        res.json({
            message: `${addedCount} products successfully uploaded.`,
            duplicates: `${duplicateCount} duplicate products were skipped.`,
        });
    } catch (error) {
        console.error('Error during bulk upload:', error);
        res.status(500).json({ error: 'Bulk upload failed.' });
    }
};
