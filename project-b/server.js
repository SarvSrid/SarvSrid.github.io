const express = require('express');
const app = express();
const path = require('path');
const projectRoutes = require('./routes/project');

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Log all incoming requests
app.use((req, res, next) => {
    console.log(`Incoming request: ${req.method} ${req.url}`);
    next();
});

// API Routes
app.use('/api', projectRoutes);

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});

//Handling shutdown and clearing cart
function clearCartOnShutdown() {
    console.log('Clearing cart as the server is shutting down...');
    try {
        const stmt = db.prepare('DELETE FROM CartProducts');
        stmt.run(); // Clear all cart products
        console.log('Cart cleared successfully.');
    } catch (error) {
        console.error('Error clearing cart on shutdown:', error);
    }
}


process.on('SIGINT', () => {
    console.log('SIGINT signal received.');
    clearCartOnShutdown();
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('SIGTERM signal received.');
    clearCartOnShutdown();
    process.exit(0);
});
