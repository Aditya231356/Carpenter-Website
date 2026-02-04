// ============================================
// CART PAGE JAVASCRIPT
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    // Initialize cart
    updateCartCount();
    loadCartItems();
    
    // Setup modal functionality
    setupModal();
    
    // Setup checkout button
    document.getElementById('checkoutBtn').addEventListener('click', function() {
        openCheckoutModal();
    });
});

// Load and display cart items
function loadCartItems() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartItemsContainer = document.getElementById('cartItems');
    const emptyCartMessage = document.getElementById('emptyCart');
    const checkoutBtn = document.getElementById('checkoutBtn');
    
    // Clear container
    cartItemsContainer.innerHTML = '';
    
    // Display empty cart message or cart items
    if (cart.length === 0) {
        emptyCartMessage.style.display = 'block';
        checkoutBtn.disabled = true;
        updateOrderSummary();
        return;
    }
    
    emptyCartMessage.style.display = 'none';
    checkoutBtn.disabled = false;
    
    // Display cart items
    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-image">
                <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="cart-item-details">
                <h3>${item.name}</h3>
                <p class="cart-item-description">${item.description}</p>
                <p class="cart-item-quality"><strong>Material:</strong> ${item.quality}</p>
                
                <div class="cart-item-controls">
                    <div class="quantity-control">
                        <button class="quantity-btn decrease-btn" data-id="${item.id}">-</button>
                        <span class="quantity-value">${item.quantity}</span>
                        <button class="quantity-btn increase-btn" data-id="${item.id}">+</button>
                    </div>
                    <button class="remove-btn" data-id="${item.id}">
                        <i class="fas fa-trash"></i> Remove
                    </button>
                </div>
                
                <div class="cart-item-price">
                    ₹${(item.price * item.quantity).toLocaleString()}
                </div>
            </div>
        `;
        cartItemsContainer.appendChild(cartItem);
    });
    
    // Add event listeners to cart controls
    setupCartControls();
    
    // Update order summary
    updateOrderSummary();
}

// Setup cart control event listeners
function setupCartControls() {
    // Decrease quantity buttons
    document.querySelectorAll('.decrease-btn').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            const cart = JSON.parse(localStorage.getItem('cart')) || [];
            const item = cart.find(item => item.id === productId);
            
            if (item && item.quantity > 1) {
                item.quantity -= 1;
                localStorage.setItem('cart', JSON.stringify(cart));
                loadCartItems();
                updateCartCount();
                showNotification('Quantity updated');
            }
        });
    });
    
    // Increase quantity buttons
    document.querySelectorAll('.increase-btn').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            const cart = JSON.parse(localStorage.getItem('cart')) || [];
            const item = cart.find(item => item.id === productId);
            
            if (item) {
                item.quantity += 1;
                localStorage.setItem('cart', JSON.stringify(cart));
                loadCartItems();
                updateCartCount();
                showNotification('Quantity updated');
            }
        });
    });
    
    // Remove buttons
    document.querySelectorAll('.remove-btn').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            const cart = JSON.parse(localStorage.getItem('cart')) || [];
            const item = cart.find(item => item.id === productId);
            
            if (item && confirm('Remove this item from cart?')) {
                removeFromCart(productId);
                loadCartItems();
                showNotification('Item removed from cart');
            }
        });
    });
}

// Update order summary
function updateOrderSummary() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    let subtotal = 0;
    
    cart.forEach(item => {
        subtotal += item.price * item.quantity;
    });
    
    const tax = subtotal * 0.05; // 5% tax
    const delivery = 500;
    const total = subtotal + tax + delivery;
    
    // Update summary elements
    document.getElementById('subtotalAmount').textContent = `₹${subtotal.toLocaleString()}`;
    document.getElementById('taxAmount').textContent = `₹${tax.toLocaleString()}`;
    document.getElementById('totalAmount').textContent = `₹${total.toLocaleString()}`;
}

// Setup modal functionality
function setupModal() {
    const modal = document.getElementById('checkoutModal');
    const closeModalBtn = document.getElementById('closeModal');
    const checkoutForm = document.getElementById('checkoutForm');
    
    // Close modal when clicking X
    closeModalBtn.addEventListener('click', function() {
        modal.style.display = 'none';
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
    
    // Handle form submission
    checkoutForm.addEventListener('submit', function(e) {
        e.preventDefault();
        placeOrder();
    });
}

// Open checkout modal
function openCheckoutModal() {
    const modal = document.getElementById('checkoutModal');
    const orderReview = document.getElementById('orderReview');
    
    // Load order review
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totals = calculateCartTotal();
    
    let reviewHTML = `
        <div class="order-review-items">
    `;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        reviewHTML += `
            <div class="order-review-item">
                <span>${item.name} x${item.quantity}</span>
                <span>₹${itemTotal.toLocaleString()}</span>
            </div>
        `;
    });
    
    reviewHTML += `
            <div class="order-review-divider"></div>
            <div class="order-review-summary">
                <div class="order-review-row">
                    <span>Subtotal</span>
                    <span>₹${totals.subtotal.toLocaleString()}</span>
                </div>
                <div class="order-review-row">
                    <span>Tax (5%)</span>
                    <span>₹${totals.tax.toLocaleString()}</span>
                </div>
                <div class="order-review-row">
                    <span>Delivery</span>
                    <span>₹${totals.delivery.toLocaleString()}</span>
                </div>
                <div class="order-review-row total">
                    <span>Total Amount</span>
                    <span>₹${totals.total.toLocaleString()}</span>
                </div>
            </div>
        </div>
    `;
    
    orderReview.innerHTML = reviewHTML;
    
    // Show modal
    modal.style.display = 'block';
}

// Place order
function placeOrder() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    
    // Get form data
    const orderData = {
        orderId: 'ORD' + Date.now(),
        customerName: document.getElementById('customerName').value,
        customerMobile: document.getElementById('customerMobile').value,
        customerEmail: document.getElementById('customerEmail').value || '',
        deliveryAddress: document.getElementById('deliveryAddress').value,
        city: document.getElementById('city').value,
        pincode: document.getElementById('pincode').value,
        paymentMethod: document.querySelector('input[name="paymentMethod"]:checked').value,
        items: cart,
        totals: calculateCartTotal(),
        orderDate: new Date().toLocaleString(),
        status: 'pending'
    };
    
    // Save order to localStorage
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    orders.push(orderData);
    localStorage.setItem('orders', JSON.stringify(orders));
    
    // Clear cart
    localStorage.removeItem('cart');
    
    // Close modal
    document.getElementById('checkoutModal').style.display = 'none';
    
    // Show success message
    alert(`Order placed successfully!\nOrder ID: ${orderData.orderId}\nWe will contact you shortly for confirmation.`);
    
    // Redirect to home page
    window.location.href = 'index.html';
}

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}