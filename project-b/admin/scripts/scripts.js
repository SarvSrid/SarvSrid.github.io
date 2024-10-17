//admin upload page
function uploadFile() {
    const fileInput = document.getElementById('fileUpload');
    const file = fileInput.files[0];
    if (!file) {
        alert("Please select a file to upload.");
        return;
    }
    const allowedExtensions = ['json', 'csv', 'txt'];
    const fileExtension = file.name.split('.').pop().toLowerCase();
    
    if (!allowedExtensions.includes(fileExtension)) {
        alert("Invalid file type. Please upload a .json, .csv, or .txt file.");
        return;
    }
    alert("File uploaded successfully.");
}

//admin products page
function filterProducts() {
    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    const tableRows = document.querySelectorAll('#productTableBody tr');
    tableRows.forEach(row => {
        const name = row.cells[1].textContent.toLowerCase();
        const category = row.cells[3].textContent.toLowerCase();
        row.style.display = (name.includes(searchInput) || category.includes(searchInput)) ? '' : 'none';
    });
}

function editProduct(productId) {
    window.location.href = `product-edit.html?id=${productId}`;
}

function deleteProduct(productId) {
    if (confirm("Are you sure you want to delete this product?")) {
        const row = document.querySelector(`#productTableBody tr[data-id="${productId}"]`);
        row.remove();
    }
}

function archiveProduct(productId) {
    const row = document.querySelector(`#productTableBody tr[data-id="${productId}"]`);
    row.style.backgroundColor = 'gray';
    row.style.opacity = '0.5';
}

function addProduct() {
    const newId = document.querySelectorAll('#productTableBody tr').length + 1;
    const name = prompt("Enter product name:");
    const description = prompt("Enter product description:");
    const category = prompt("Enter product category:");
    const imagePath = prompt("Enter image path:");
    const price = prompt("Enter product price:");

    if (name && description && category && imagePath && price) {
        const tableBody = document.getElementById('productTableBody');
        const newRow = document.createElement('tr');
        newRow.setAttribute('data-id', newId);

        newRow.innerHTML = `
            <td>${newId}</td>
            <td>${name}</td>
            <td>${description}</td>
            <td>${category}</td>
            <td>${imagePath}</td>
            <td>$${price}</td>
            <td>
                <a href="product-edit.html?id=${newId}"><button type="button">Edit</button></a>
                <button onclick="deleteProduct(${newId})">Delete</button>
                <button onclick="archiveProduct(${newId})">Archive</button>
            </td>
        `;
        tableBody.appendChild(newRow);
    } else {
        alert("All fields are required to add a new product.");
    }
}

function getProductIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
}

function displayProductId() {
    const productId = getProductIdFromUrl();
    if (productId) {
        document.getElementById('productIdDisplay').textContent = productId;
    }
}

document.addEventListener("DOMContentLoaded", displayProductId);

// products edit page
function saveProduct() {
    alert('Product details saved successfully.');
    window.location.href = 'admin-products.html';
}