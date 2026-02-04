// Admin panel functionality

document.addEventListener('DOMContentLoaded', function() {
    // Navigation between admin sections
    setupAdminNavigation();
    
    // Load dashboard stats
    loadDashboardStats();
    
    // Load products for management
    loadAdminProducts();
    
    // Load orders
    loadOrders();
    
    // Setup product form
    setupProductForm();
    
    // Logout button
    document.getElementById('logoutBtn').addEventListener('click', function(e) {
        e.preventDefault();
        window.location.href = 'index.html';
    });
});

// Admin navigation
function setupAdminNavigation() {
    const navLinks = document.querySelectorAll('.admin-nav a');
    const sections = document.querySelectorAll('.admin-section');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links
            navLinks.forEach(l => l.classList.remove('active'));
            // Add active class to clicked link
            this.classList.add('active');
            
            // Hide all sections
            sections.forEach(section => {
                section.style.display = 'none';
            });
            
            // Show target section
            const targetId = this.getAttribute('href').substring(1);
            document.getElementById(targetId).style.display = 'block';
        });
    });
}

// Load dashboard statistics
function loadDashboardStats() {
    const products = JSON.parse(localStorage.getItem('products')) || window.defaultProducts;
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    
    // Calculate total revenue
    const totalRevenue = orders.reduce((total, order) => total + order.total, 0);
    
    // Update dashboard cards
    document.getElementById('totalProducts').textContent = products.length;
    document.getElementById('totalOrders').textContent = orders.length;
    document.getElementById('totalRevenue').textContent = `₹${totalRevenue.toLocaleString()}`;
}

// Load products for admin management
function loadAdminProducts() {
    const products = JSON.parse(localStorage.getItem('products')) || window.defaultProducts;
    const table = document.getElementById('productsTable');
    
    if (!table) return;
    
    table.innerHTML = '';
    
    products.forEach(product => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><img src="${product.image}" alt="${product.name}" style="width: 50px; height: 50px; object-fit: cover;"></td>
            <td>${product.name}</td>
            <td>${product.category}</td>
            <td>₹${product.price.toLocaleString()}</td>
            <td>
                <button class="action-btn edit-btn" onclick="editProduct(${product.id})">Edit</button>
                <button class="action-btn delete-btn" onclick="deleteProduct(${product.id})">Delete</button>
            </td>
        `;
        table.appendChild(row);
    });
}

// Setup product form
function setupProductForm() {
    const form = document.getElementById('productForm');
    const submitBtn = document.getElementById('submitBtn');
    const cancelBtn = document.getElementById('cancelBtn');
    const formTitle = document.getElementById('formTitle');
    
    let editingProductId = null;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const product = {
            id: editingProductId || Date.now(),
            name: document.getElementById('productName').value,
            description: document.getElementById('productDescription').value,
            category: document.getElementById('productCategory').value,
            quality: document.getElementById('productQuality').value,
            price: parseInt(document.getElementById('productPrice').value),
            image: document.getElementById('productImage').value
        };
        
        let products = JSON.parse(localStorage.getItem('products')) || window.defaultProducts;
        
        if (editingProductId) {
            // Update existing product
            const index = products.findIndex(p => p.id === editingProductId);
            if (index !== -1) {
                products[index] = product;
            }
        } else {
            // Add new product
            products.push(product);
        }
        
        localStorage.setItem('products', JSON.stringify(products));
        
        // Reset form
        form.reset();
        editingProductId = null;
        submitBtn.textContent = 'Add Product';
        formTitle.textContent = 'Add New Product';
        cancelBtn.style.display = 'none';
        
        // Reload products
        loadAdminProducts();
        loadDashboardStats();
        
        alert(editingProductId ? 'Product updated successfully!' : 'Product added successfully!');
    });
    
    // Cancel edit
    cancelBtn.addEventListener('click', function() {
        form.reset();
        editingProductId = null;
        submitBtn.textContent = 'Add Product';
        formTitle.textContent = 'Add New Product';
        this.style.display = 'none';
    });
}

// Edit product
function editProduct(productId) {
    const products = JSON.parse(localStorage.getItem('products')) || window.defaultProducts;
    const product = products.find(p => p.id === productId);
    
    if (product) {
        document.getElementById('productId').value = product.id;
        document.getElementById('productName').value = product.name;
        document.getElementById('productDescription').value = product.description;
        document.getElementById('productCategory').value = product.category;
        document.getElementById('productQuality').value = product.quality;
        document.getElementById('productPrice').value = product.price;
        document.getElementById('productImage').value = product.image;
        
        // Update form for editing
        document.getElementById('submitBtn').textContent = 'Update Product';
        document.getElementById('formTitle').textContent = 'Edit Product';
        document.getElementById('cancelBtn').style.display = 'inline-block';
        
        // Scroll to form
        document.getElementById('productName').focus();
    }
}

// Delete product
function deleteProduct(productId) {
    if (confirm('Are you sure you want to delete this product?')) {
        let products = JSON.parse(localStorage.getItem('products')) || window.defaultProducts;
        products = products.filter(p => p.id !== productId);
        localStorage.setItem('products', JSON.stringify(products));
        loadAdminProducts();
        loadDashboardStats();
        alert('Product deleted successfully!');
    }
}

// Load orders
function loadOrders() {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const table = document.getElementById('ordersTable');
    
    if (!table) return;
    
    table.innerHTML = '';
    
    orders.forEach((order, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>ORD${1000 + index}</td>
            <td>${order.customer.name}</td>
            <td>${order.customer.mobile}</td>
            <td>₹${order.total.toLocaleString()}</td>
            <td>${order.date}</td>
            <td><span style="color: green;">Completed</span></td>
        `;
        table.appendChild(row);
    });
}