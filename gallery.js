// ============================================
// GALLERY PAGE JAVASCRIPT
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    // Initialize cart count
    updateCartCount();
    
    // Load gallery images
    loadGallery();
    
    // Setup filter buttons
    setupGalleryFilters();
    
    // Setup lightbox
    setupLightbox();
});

// Load and display gallery images
function loadGallery(filter = 'all') {
    const gallery = JSON.parse(localStorage.getItem('gallery')) || getDefaultGallery();
    const container = document.getElementById('galleryGrid');
    
    // Clear container
    container.innerHTML = '';
    
    // Filter images
    const filteredImages = filter === 'all' 
        ? gallery 
        : gallery.filter(item => item.category === filter);
    
    // Display images
    filteredImages.forEach(item => {
        const galleryItem = document.createElement('div');
        galleryItem.className = 'gallery-item';
        galleryItem.setAttribute('data-category', item.category);
        galleryItem.setAttribute('data-id', item.id);
        galleryItem.innerHTML = `
            <img src="${item.image}" alt="${item.title}" loading="lazy">
            <div class="gallery-overlay">
                <h4>${item.title}</h4>
                <p>${item.description}</p>
            </div>
        `;
        container.appendChild(galleryItem);
    });
    
    // Add click event to gallery items
    document.querySelectorAll('.gallery-item').forEach(item => {
        item.addEventListener('click', function() {
            const itemId = parseInt(this.getAttribute('data-id'));
            openLightbox(itemId);
        });
    });
}

// Setup gallery filter buttons
function setupGalleryFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Get filter value
            const filter = this.getAttribute('data-filter');
            
            // Load gallery with filter
            loadGallery(filter);
        });
    });
}

// Setup lightbox
function setupLightbox() {
    const lightbox = document.getElementById('imageLightbox');
    const closeLightboxBtn = document.getElementById('closeLightbox');
    const prevBtn = document.getElementById('prevImage');
    const nextBtn = document.getElementById('nextImage');
    
    let currentImageIndex = 0;
    let galleryItems = [];
    
    // Close lightbox
    closeLightboxBtn.addEventListener('click', function() {
        lightbox.style.display = 'none';
    });
    
    // Close lightbox when clicking outside
    lightbox.addEventListener('click', function(event) {
        if (event.target === lightbox) {
            lightbox.style.display = 'none';
        }
    });
    
    // Previous image
    prevBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        navigateLightbox(-1);
    });
    
    // Next image
    nextBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        navigateLightbox(1);
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (lightbox.style.display === 'block') {
            if (e.key === 'Escape') {
                lightbox.style.display = 'none';
            } else if (e.key === 'ArrowLeft') {
                navigateLightbox(-1);
            } else if (e.key === 'ArrowRight') {
                navigateLightbox(1);
            }
        }
    });
    
    // Navigate lightbox
    function navigateLightbox(direction) {
        const gallery = JSON.parse(localStorage.getItem('gallery')) || getDefaultGallery();
        const activeFilter = document.querySelector('.filter-btn.active').getAttribute('data-filter');
        
        // Get filtered gallery items
        galleryItems = activeFilter === 'all' 
            ? gallery 
            : gallery.filter(item => item.category === activeFilter);
        
        // Update current index
        currentImageIndex = (currentImageIndex + direction + galleryItems.length) % galleryItems.length;
        
        // Update lightbox content
        updateLightboxContent(galleryItems[currentImageIndex]);
    }
    
    // Update lightbox content
    window.updateLightboxContent = function(item) {
        document.getElementById('lightboxImage').src = item.image;
        document.getElementById('lightboxImage').alt = item.title;
        document.getElementById('lightboxTitle').textContent = item.title;
        document.getElementById('lightboxDescription').textContent = item.description;
    };
}

// Open lightbox with specific image
function openLightbox(itemId) {
    const gallery = JSON.parse(localStorage.getItem('gallery')) || getDefaultGallery();
    const activeFilter = document.querySelector('.filter-btn.active').getAttribute('data-filter');
    
    // Get filtered gallery items
    const galleryItems = activeFilter === 'all' 
        ? gallery 
        : gallery.filter(item => item.category === activeFilter);
    
    // Find item index
    const itemIndex = galleryItems.findIndex(item => item.id === itemId);
    
    if (itemIndex !== -1) {
        // Update lightbox content
        updateLightboxContent(galleryItems[itemIndex]);
        
        // Store current index
        window.currentImageIndex = itemIndex;
        window.galleryItems = galleryItems;
        
        // Show lightbox
        document.getElementById('imageLightbox').style.display = 'block';
    }
}

// Get default gallery items
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