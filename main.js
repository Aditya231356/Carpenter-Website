// ============================================
// MAIN JAVASCRIPT FILE - CUSTOMER WEBSITE
// Common functionality for all customer pages
// ============================================

// DOM Elements
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    initializeData();
    updateCartCount();
    
    // MOBILE NAVIGATION - SIDE DRAWER
    if (navToggle && navMenu) {
        // Toggle side drawer menu
        navToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            navMenu.classList.toggle('active');
            
            // Prevent body scroll when menu is open
            if (navMenu.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (navMenu.classList.contains('active') && 
                !navMenu.contains(e.target) && 
                !navToggle.contains(e.target)) {
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
        
        // Close menu when clicking on a link
        document.querySelectorAll('.nav-menu a').forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
        
        // Close menu on window resize if switching to desktop
        window.addEventListener('resize', function() {
            if (window.innerWidth > 768 && navMenu) {
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }
});

// Update cart count in navigation
function updateCartCount() {
    const cartCountElements = document.querySelectorAll('.cart-count');
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    
    cartCountElements.forEach(element => {
        element.textContent = totalItems;
    });
}

// Add product to cart
function addToCart(product) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Check if product is already in cart
    const existingItemIndex = cart.findIndex(item => item.id === product.id);
    
    if (existingItemIndex !== -1) {
        // Update quantity if product exists
        cart[existingItemIndex].quantity += 1;
    } else {
        // Add new product to cart
        cart.push({
            id: product.id,
            name: product.name,
            description: product.description,
            quality: product.quality,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }
    
    // Save cart to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Update cart count display
    updateCartCount();
    
    // Show notification
    showNotification(`${product.name} added to cart!`);
    
    return cart;
}

// Remove product from cart
function removeFromCart(productId) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    return cart;
}

// Update product quantity in cart
function updateCartQuantity(productId, newQuantity) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const itemIndex = cart.findIndex(item => item.id === productId);
    
    if (itemIndex !== -1) {
        if (newQuantity > 0) {
            cart[itemIndex].quantity = newQuantity;
        } else {
            cart.splice(itemIndex, 1);
        }
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    return cart;
}

// Calculate cart total
function calculateCartTotal() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    let subtotal = 0;
    
    cart.forEach(item => {
        subtotal += item.price * item.quantity;
    });
    
    const tax = subtotal * 0.05; // 5% tax
    const delivery = 500;
    const total = subtotal + tax + delivery;
    
    return {
        subtotal: subtotal,
        tax: tax,
        delivery: delivery,
        total: total
    };
}

// Format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0
    }).format(amount);
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

// Get default products
function getDefaultProducts() {
    return [
        {
            id: 1,
            name: "Teak Wood King Bed",
            description: "Premium solid teak wood bed with storage and carved headboard",
            category: "furniture",
            quality: "Solid Teak Wood",
            price: 42500,
            image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400&h=300&fit=crop"
        },
        {
            id: 2,
            name: "Sheesham Dining Set",
            description: "6-seater dining table with matching chairs, traditional design",
            category: "furniture",
            quality: "Sheesham Wood",
            price: 38500,
            image: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=400&h=300&fit=crop"
        },
        {
            id: 3,
            name: "Custom Wardrobe",
            description: "Wall-to-wall wardrobe with mirror and multiple compartments",
            category: "furniture",
            quality: "Engineered Wood",
            price: 32500,
            image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop"
        },
        {
            id: 4,
            name: "Wooden Main Door",
            description: "Carved wooden main door with security features and polish finish",
            category: "doors",
            quality: "Sal Wood",
            price: 28500,
            image: "https://images.unsplash.com/photo-1600585154340-043cd4475cdc?w=400&h=300&fit=crop"
        },
        {
            id: 5,
            name: "Office Workstation",
            description: "Ergonomic office desk with drawers and cable management",
            category: "office",
            quality: "Engineered Wood with Laminate",
            price: 18500,
            image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=400&h=300&fit=crop"
        },
        {
            id: 6,
            name: "TV Unit Cabinet",
            description: "Modern TV unit with shelves, cabinets, and LED lighting",
            category: "furniture",
            quality: "Plywood with Veneer",
            price: 22500,
            image: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=400&h=300&fit=crop"
        },
        {
            id: 7,
            name: "Bookshelf Unit",
            description: "Floor-to-ceiling bookshelf with adjustable shelves",
            category: "custom",
            quality: "Pine Wood",
            price: 16500,
            image: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=400&h=300&fit=crop"
        },
        {
            id: 8,
            name: "French Windows",
            description: "Pair of wooden French windows with glass panes",
            category: "doors",
            quality: "Teak Wood",
            price: 32500,
            image: "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=400&h=300&fit=crop"
        }
    ];
}

// Get default gallery
function getDefaultGallery() {
    return [
        {
            id: 1,
            title: "Luxury Bedroom Set",
            description: "Complete bedroom furniture including bed, wardrobe, and nightstands",
            category: "furniture",
            image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600&h=400&fit=crop"
        },
        {
            id: 2,
            title: "Modern Kitchen Cabinets",
            description: "Custom kitchen cabinets with soft-close drawers",
            category: "custom",
            image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=400&fit=crop"
        },
        {
            id: 3,
            title: "Office Conference Room",
            description: "Complete office furniture setup for conference room",
            category: "commercial",
            image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=600&h=400&fit=crop"
        },
        {
            id: 4,
            title: "Traditional Main Door",
            description: "Carved wooden main door with brass fittings",
            category: "doors",
            image: "https://images.unsplash.com/photo-1600585154340-043cd4475cdc?w=600&h=400&fit=crop"
        },
        {
            id: 5,
            title: "Antique Restoration",
            description: "Restoration of 100-year-old antique wardrobe",
            category: "restoration",
            image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=400&fit=crop"
        },
        {
            id: 6,
            title: "Hotel Room Furniture",
            description: "Complete furniture set for luxury hotel room",
            category: "commercial",
            image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&h=400&fit=crop"
        }
    ];
}

// Initialize data
function initializeData() {
    // Initialize products
    if (!localStorage.getItem('products')) {
        localStorage.setItem('products', JSON.stringify(getDefaultProducts()));
    }
    
    // Initialize gallery
    if (!localStorage.getItem('gallery')) {
        localStorage.setItem('gallery', JSON.stringify(getDefaultGallery()));
    }
}

// Export for use in other files
if (typeof window !== 'undefined') {
    window.addToCart = addToCart;
    window.removeFromCart = removeFromCart;
    window.updateCartQuantity = updateCartQuantity;
    window.calculateCartTotal = calculateCartTotal;
    window.formatCurrency = formatCurrency;
    window.updateCartCount = updateCartCount;
    window.showNotification = showNotification;
}