// Default products data
window.defaultProducts = [
    {
        id: 1,
        name: "Teak Wood Bed",
        description: "King size bed with storage, made from premium teak wood",
        category: "furniture",
        quality: "Premium Teak Wood",
        price: 45000,
        image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop"
    },
    {
        id: 2,
        name: "Sheesham Dining Table",
        description: "6-seater dining table with matching chairs",
        category: "furniture",
        quality: "Solid Sheesham Wood",
        price: 35000,
        image: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=400&h=300&fit=crop"
    },
    {
        id: 3,
        name: "Wooden Main Door",
        description: "Carved wooden main entrance door with security features",
        category: "doors",
        quality: "Seasoned Teak Wood",
        price: 28000,
        image: "https://images.unsplash.com/photo-1600585154340-043cd4475cdc?w=400&h=300&fit=crop"
    },
    {
        id: 4,
        name: "Wardrobe Unit",
        description: "Walk-in wardrobe with mirror and storage",
        category: "furniture",
        quality: "Engineered Wood",
        price: 32000,
        image: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=400&h=300&fit=crop"
    },
    {
        id: 5,
        name: "Custom Bookshelf",
        description: "Wall-mounted bookshelf, custom size",
        category: "custom",
        quality: "Plywood with Laminate",
        price: 15000,
        image: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=400&h=300&fit=crop"
    },
    {
        id: 6,
        name: "French Window",
        description: "Wooden frame window with glass panes",
        category: "doors",
        quality: "Sal Wood",
        price: 12000,
        image: "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=400&h=300&fit=crop"
    }
];

// Initialize products in localStorage if empty
document.addEventListener('DOMContentLoaded', function() {
    if (!localStorage.getItem('products')) {
        localStorage.setItem('products', JSON.stringify(window.defaultProducts));
    }
});