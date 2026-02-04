// ============================================
// PRODUCTS PAGE JAVASCRIPT
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    // Initialize data
    updateCartCount();
    
    // Load products
    loadProducts();
    
    // Setup filter event listeners
    setupFilters();
    
    // Setup reset filters button
    document.getElementById('resetFilters').addEventListener('click', function() {
        resetFilters();
        loadProducts();
    });
});

// Load and display products
function loadProducts() {
    const products = JSON.parse(localStorage.getItem('products')) || getDefaultProducts();
    const container = document.getElementById('productsContainer');
    const noProductsMessage = document.getElementById('noProductsMessage');
    
    // Get filter values
    const searchTerm = document.getElementById('searchProducts').value.toLowerCase();
    const categoryFilter = document.getElementById('categoryFilter').value;
    const priceFilter = document.getElementById('priceFilter').value;
    
    // Filter products
    let filteredProducts = products.filter(product => {
        // Search filter
        const matchesSearch = searchTerm === '' || 
            product.name.toLowerCase().includes(searchTerm) ||
            product.description.toLowerCase().includes(searchTerm) ||
            product.quality.toLowerCase().includes(searchTerm);
        
        // Category filter
        const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
        
        // Price filter
        let matchesPrice = true;
        if (priceFilter !== 'all') {
            const [min, max] = priceFilter.split('-').map(val => {
                if (val.endsWith('+')) {
                    return parseInt(val.replace('+', ''));
                }
                return parseInt(val);
            });
            
            if (priceFilter.endsWith('+')) {
                matchesPrice = product.price >= min;
            } else {
                matchesPrice = product.price >= min && product.price <= max;
            }
        }
        
        return matchesSearch && matchesCategory && matchesPrice;
    });
    
    // Clear container
    container.innerHTML = '';
    
    // Display filtered products or no products message
    if (filteredProducts.length === 0) {
        noProductsMessage.style.display = 'block';
        return;
    }
    
    noProductsMessage.style.display = 'none';
    
    // Display products
    filteredProducts.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" loading="lazy">
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <p class="product-quality"><strong>Material:</strong> ${product.quality}</p>
                <div class="product-footer">
                    <span class="product-price">₹${product.price.toLocaleString()}</span>
                    <button class="btn btn-primary btn-small add-to-cart-btn" data-id="${product.id}">
                        <i class="fas fa-cart-plus"></i> Add to Cart
                    </button>
                </div>
            </div>
        `;
        container.appendChild(productCard);
    });
    
    // Add event listeners to Add to Cart buttons
    document.querySelectorAll('.add-to-cart-btn').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            const products = JSON.parse(localStorage.getItem('products')) || getDefaultProducts();
            const product = products.find(p => p.id === productId);
            
            if (product) {
                addToCart(product);
                showNotification(`${product.name} added to cart!`);
            }
        });
    });
}

// Setup filter event listeners
function setupFilters() {
    // Search input
    document.getElementById('searchProducts').addEventListener('input', debounce(loadProducts, 300));
    
    // Category filter
    document.getElementById('categoryFilter').addEventListener('change', loadProducts);
    
    // Price filter
    document.getElementById('priceFilter').addEventListener('change', loadProducts);
}

// Reset all filters
function resetFilters() {
    document.getElementById('searchProducts').value = '';
    document.getElementById('categoryFilter').value = 'all';
    document.getElementById('priceFilter').value = 'all';
}

// Debounce function for search input
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Show notification
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>${message}</span>
    `;
    
    // Add to body
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}