// Add product to cart functionality
function addToCart(productId, productName, productPrice) {
    fetch('/api/cart/add', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId, quantity: 1 }), // Always add one item
    })
        .then(response => response.json())
        .then(data => {
            alert(`${productName} added to your cart!`);
            console.log('Cart updated:', data);
        })
        .catch(error => console.error('Error adding to cart:', error));
}

// Populate product details dynamically
function populateProductDetails() {
    const queryString = new URLSearchParams(window.location.search);
    const productId = queryString.get('id');

    if (!productId) {
        document.getElementById('product-details').innerHTML = '<p>Product not found.</p>';
        return;
    }

    fetch(`/api/products/${productId}`)
        .then(response => response.json())
        .then(product => {
            const productDetails = document.getElementById('product-details');
            productDetails.innerHTML = `
                <img src="${product.image_url}" alt="${product.name}">
                <h2>${product.name}</h2>
                <p>Price: $${product.price.toFixed(2)}</p>
                <p>${product.description}</p>
                <button onclick="addToCart(${product.id}, '${product.name}', ${product.price})">Add to Cart</button>
            `;
        })
        .catch(error => {
            console.error('Error fetching product details:', error);
            document.getElementById('product-details').innerHTML = '<p>Error loading product details.</p>';
        });
}

// Fetch products and populate the product grid for index.html and products.html
function populateProductGrid() {
    fetch('/api/products')
        .then(response => response.json())
        .then(products => {
            const productGrid = document.querySelector('.product-grid-list');
            productGrid.innerHTML = products.map(product => `
                <div class="product-item">
                    <img src="${product.image_url}" alt="${product.name}">
                    <h2>${product.name}</h2>
                    <p>Price: $${product.price.toFixed(2)}</p>
                    <button onclick="viewDetails(${product.id})">View Details</button>
                </div>
            `).join('');
        })
        .catch(error => console.error('Error fetching products:', error));
}

// View product details
function viewDetails(productId) {
    window.location.href = `/details.html?id=${productId}`;
}

// Populate the cart dynamically
function populateCart() {
    fetch('/api/cart')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch cart items.');
            }
            return response.json();
        })
        .then(cartItems => {
            const productList = document.querySelector('#shopping-cart .product-list');
            let subtotal = 0;

            if (cartItems.length === 0) {
                productList.innerHTML = '<p>Your cart is empty.</p>';
                document.getElementById('subtotal').textContent = '$0.00';
                document.getElementById('tax').textContent = '$0.00';
                document.getElementById('total').textContent = '$0.00';
                return;
            }

            productList.innerHTML = cartItems.map(item => {
                subtotal += item.price * item.quantity;
                return `
                    <li class="product-item">
                        <img src="${item.image}" alt="${item.name}">
                        <p><strong>Name:</strong> ${item.name}</p>
                        <p><strong>Price:</strong> $${item.price.toFixed(2)}</p>
                        <p><strong>Quantity:</strong> 
                            <input type="number" value="${item.quantity}" min="1" onchange="updateQuantity(${item.productId}, this.value)">
                        </p>
                        <button onclick="removeFromCart(${item.productId})">Remove</button>
                    </li>
                `;
            }).join('');

            const tax = subtotal * 0.0675;
            const total = subtotal + tax + 5 + 3;

            document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
            document.getElementById('tax').textContent = `$${tax.toFixed(2)}`;
            document.getElementById('total').textContent = `$${total.toFixed(2)}`;
        })
        .catch(error => {
            console.error('Error fetching cart:', error);
            document.querySelector('#shopping-cart .product-list').innerHTML = '<p>Error loading cart.</p>';
        });
}

// Function to update quantity of a product in the cart
function updateQuantity(productId, newQuantity) {
    console.log(`Updating quantity: productId=${productId}, newQuantity=${newQuantity}`);

    fetch(`/api/cart/update/${productId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ quantity: newQuantity }),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to update quantity');
            }
            return response.json();
        })
        .then(data => {
            console.log('Cart updated successfully:', data);
            location.reload(); // Refresh the cart
        })
        .catch(error => console.error('Error updating quantity:', error));
}

// Remove from cart
function removeFromCart(productId) {
    if (confirm('Are you sure you want to remove this product from the cart?')) {
        fetch(`/api/cart/delete/${productId}`, {
            method: 'DELETE',
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to remove product from cart');
                }
                return response.json();
            })
            .then(data => {
                alert(data.message); // Show success message
                populateCart();
            })
            .catch(error => {
                console.error('Error removing product from cart:', error);
                alert('Failed to remove product from cart. Please try again.');
            });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const pathname = window.location.pathname;

    if (pathname === '/index.html' || pathname === '/products.html') {
        populateProductGrid();
    } else if (pathname === '/details.html') {
        populateProductDetails();
    } else if (pathname === '/cart.html') {
        populateCart();
    }
});

function proceedToCheckout() {
    console.log('Proceeding to checkout...');

    fetch('/api/cart/checkout', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: 1 }), // Hardcoded user ID
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to complete checkout');
            }
            return response.json();
        })
        .then(data => {
            console.log('Checkout successful:', data);

            // Redirect to order confirmation or error check
            alert(data.message || 'Order placed successfully!');
            window.location.href = '/order-confirmation.html';
        })
        .catch(error => {
            console.error('Error during checkout:', error);
            alert('Failed to complete checkout. Please try again.');
        });
}

document.addEventListener('DOMContentLoaded', () => {

    if (window.location.pathname === '/products.html') {
        fetchCategories(); // Fetch categories dropdown
        fetchProducts();   // Fetch all products

        //Event listener for category dropdown
        const categorySelect = document.getElementById('category-select');
        if (categorySelect) {
            categorySelect.addEventListener('change', filterByCategory);
        }
    }
});

// Fetch categories in the dropdown
function fetchCategories() {
    fetch('/api/categories')
        .then(response => response.json())
        .then(categories => {
            const categorySelect = document.getElementById('category-select');

            categorySelect.innerHTML = '<option value="all">All Categories</option>';

            // Populate categories from response
            categories.forEach(category => {
                const option = document.createElement('option');
                option.value = category.id; // Use category ID as the value
                option.textContent = category.name;
                categorySelect.appendChild(option);
            });
        })
        .catch(error => console.error('Error fetching categories:', error));
}

// Fetch products
function fetchProducts(categoryId = 'all') {
    const url = categoryId === 'all' ? '/api/products' : `/api/products?categoryId=${categoryId}`;
    fetch(url)
        .then(response => response.json())
        .then(products => {
            const productGrid = document.querySelector('.product-grid-list');
            if (products.length === 0) {
                productGrid.innerHTML = '<p>No products available in this category.</p>';
                return;
            }
            productGrid.innerHTML = products.map(product => `
                <div class="product-item">
                    <img src="${product.image_url}" alt="${product.name}">
                    <h2>${product.name}</h2>
                    <p>Price: $${product.price.toFixed(2)}</p>
                    <button onclick="viewDetails(${product.id})">View Details</button>
                </div>
            `).join('');
        })
        .catch(error => console.error('Error fetching products:', error));
}

// Handle category filtering
function filterByCategory() {
    const categoryId = document.getElementById('category-select').value;
    fetchProducts(categoryId);
}

// Redirect to product details page
function viewDetails(productId) {
    window.location.href = `/details.html?id=${productId}`;
}

//Admin Scripts

// Add a new product
function addProduct() {
    const newProduct = {
        name: prompt('Enter product name:'),
        description: prompt('Enter product description:'),
        category: parseInt(prompt('Enter category ID:')),
        imagePath: prompt('Enter image path:'),
        price: parseFloat(prompt('Enter product price:')),
    };

    fetch('/api/admin/products', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(newProduct),
    })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            location.reload();
        })
        .catch(error => console.error('Error adding product:', error));
}

// Edit an existing product
function saveProduct() {
    const productId = document.getElementById('productIdDisplay').value;
    const updatedProduct = {
        name: document.getElementById('productName').value,
        description: document.getElementById('productDescription').value,
        category: parseInt(document.getElementById('productCategory').value),
        imagePath: document.getElementById('productImage').value,
        price: parseFloat(document.getElementById('productPrice').value),
    };

    fetch(`/api/admin/products/${productId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedProduct),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to update product');
            }
            return response.json();
        })
        .then(data => {
            alert(data.message);
            window.location.href = 'admin-products.html'; // Redirect to product list
        })
        .catch(error => {
            console.error('Error updating product:', error);
            alert('Failed to update product. Please try again.');
        });
}


// Delete a product
function deleteProduct(productId) {
    if (confirm('Are you sure you want to delete this product?')) {
        fetch(`/api/admin/products/${productId}`, {
            method: 'DELETE',
        })
            .then(response => response.json())
            .then(data => {
                alert(data.message);
                location.reload();
            })
            .catch(error => console.error('Error deleting product:', error));
    }
}

// Add a new product
function addProduct() {
    const newProduct = {
        name: prompt('Enter product name:'),
        description: prompt('Enter product description:'),
        category: parseInt(prompt('Enter category ID:')),
        imagePath: prompt('Enter image path:'),
        price: parseFloat(prompt('Enter product price:')),
    };

    fetch('/api/admin/products', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(newProduct),
    })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            location.reload();
        })
        .catch(error => console.error('Error adding product:', error));
}

// Delete a product
function deleteProduct(productId) {
    if (confirm('Are you sure you want to delete this product?')) {
        fetch(`/api/admin/products/${productId}`, {
            method: 'DELETE',
        })
            .then(response => response.json())
            .then(data => {
                alert(data.message);
                location.reload();
            })
            .catch(error => console.error('Error deleting product:', error));
    }
}

//Fetching products and displaying on frontend
document.addEventListener('DOMContentLoaded', () => {
    fetch('/api/products')
        .then(response => response.json())
        .then(products => {
            const productList = document.getElementById('product-list');
            productList.innerHTML = products.map(product => `
                <tr>
                    <td>${product.id}</td>
                    <td>${product.name}</td>
                    <td>${product.description}</td>
                    <td>${product.category_id}</td>
                    <td>$${product.price.toFixed(2)}</td>
                    <td>
                        <a href="product-edit.html?id=${product.id}"><button>Edit</button></a>
                        <button onclick="deleteProduct(${product.id})">Delete</button>
                    </td>
                </tr>
            `).join('');
        })
        .catch(error => console.error('Error fetching products:', error));
});

function addProductFromForm() {
    const form = document.getElementById('add-product-form');
    const newProduct = {
        name: form.name.value,
        description: form.description.value,
        category: parseInt(form.category.value),
        imagePath: form.imagePath.value,
        price: parseFloat(form.price.value),
    };

    fetch('/api/admin/products', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(newProduct),
    })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            window.location.href = 'admin-products.html';
        })
        .catch(error => console.error('Error adding product:', error));
}

document.addEventListener('DOMContentLoaded', () => {
    // Get the product ID from the URL
    const queryParams = new URLSearchParams(window.location.search);
    const productId = queryParams.get('id');
    document.getElementById('productIdDisplay').value = productId;

    // Fetch product details from the backend
    fetch(`/api/products/${productId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch product details');
            }
            return response.json();
        })
        .then(product => {
            // Display form with product details
            document.getElementById('productName').value = product.name;
            document.getElementById('productDescription').value = product.description;
            document.getElementById('productCategory').value = product.category_id;
            document.getElementById('productImage').value = product.image_url;
            document.getElementById('productPrice').value = product.price;
        })
        .catch(error => {
            console.error('Error fetching product details:', error);
            alert('Failed to load product details. Please try again.');
        });
});

function uploadFile() {
    const fileInput = document.getElementById('fileUpload');
    const file = fileInput.files[0];

    if (!file) {
        alert('Please select a file to upload.');
        return;
    }

    const reader = new FileReader();

    reader.onload = function (event) {
        try {
            const data = JSON.parse(event.target.result);
            console.log('Parsed JSON Data:', data);

            fetch('/api/admin/bulk-upload', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            })
                .then(response => response.json())
                .then(result => {
                    if (result.error) {
                        throw new Error(result.error);
                    }

                    alert(
                        `${result.message}\n` +
                        `${result.duplicates}`
                    );
                })
                .catch(error => {
                    console.error('Error during bulk upload:', error);
                    alert('Bulk upload failed. Please try again.');
                });
        } catch (error) {
            console.error('Invalid JSON file:', error);
            alert('Invalid JSON file. Please upload a valid JSON file.');
        }
    };

    reader.readAsText(file);
}

