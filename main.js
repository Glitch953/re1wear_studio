const products = [
    {
        id: 1,
        name: "BEAUTIFUL DISASTER SWEATER",
        price: 45.00,
        description: "Size : xlarge fits large",
        image: "1.jpg",
        category: "Outerwear"
    },
    {
        id: 2,
        name: "TYLOR SWIFT HOODIE",
        price: 32.00,
        description: "Size: m",
        image: "2.jpg",
        category: "Outerwear"
    },
    {
        id: 3,
        name: "H&M JACKET",
        price: 18.00,
        description: "Size : small fits medium",
        image: "3.jpg",
        category: "Outerwear"
    },
    {
        id: 4,
        name: "🧸HOODIE",
        price: 28.00,
        description: "Size: large fits xlarge",
        image: "4.jpg",
        category: "Outerwear"
    },
    {
        id: 5,
        name: "PORSCH SWEATER",
        price: 55.00,
        description: "Size:Medium",
        image: "5.jpg",
        category: "Outerwear"
    },
    {
        id: 6,
        name: "FRIENDS HOODIE",
        price: 85.00,
        description: "Size :Medium fits large",
        image: "6.jpg",
        category: "Outerwear"
    }
];

let cart = [];

// DOM Elements
const productGrid = document.getElementById('product-grid');
const cartBtn = document.getElementById('cart-btn');
const cartModal = document.getElementById('cart-modal');
const closeModal = document.querySelector('.close-modal');
const cartItemsContainer = document.getElementById('cart-items');
const cartCount = document.getElementById('cart-count');
const cartSubtotal = document.getElementById('cart-subtotal');
const cartTotal = document.getElementById('cart-total');
const checkoutBtn = document.getElementById('checkout-btn');
const themeToggle = document.getElementById('theme-toggle');
const customerNameInput = document.getElementById('customer-name');
const customerLocationInput = document.getElementById('customer-location');

const DELIVERY_FEE = 2.50; // Fixed delivery fee (2-3 JD range)

// Theme Logic
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
}

function updateThemeIcon(theme) {
    const icon = themeToggle.querySelector('i');
    if (theme === 'dark') {
        icon.classList.replace('fa-moon', 'fa-sun');
    } else {
        icon.classList.replace('fa-sun', 'fa-moon');
    }
}

themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';

    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
});

// Initialize Products
function displayProducts() {
    productGrid.innerHTML = products.map(product => `
        <div class="product-card">
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <div class="product-name">${product.name}</div>
                <div class="product-description">${product.description}</div>
                <div class="product-price">${product.price.toFixed(2)} JOD</div>
                <button class="add-to-cart" onclick="addToCart(${product.id})">Add to Bag</button>
            </div>
        </div>
    `).join('');
}

// Cart Functions
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingEntry = cart.find(item => item.id === productId);

    if (existingEntry) {
        existingEntry.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    updateUI();
    showToast(`${product.name} added to bag!`);
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateUI();
}

function updateUI() {
    // Update Cart Count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;

    // Update Modal Content
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p style="text-align:center; padding: 2rem;">Your bag is empty.</p>';
    } else {
        cartItemsContainer.innerHTML = cart.map(item => `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}" class="cart-item-img">
                <div class="cart-item-info">
                    <div style="font-weight: 600;">${item.name}</div>
                    <div style="font-size: 0.9rem; color: #666;">${item.quantity} x ${item.price.toFixed(2)} JOD</div>
                </div>
                <button onclick="removeFromCart(${item.id})" style="background:none; border:none; color: #ff4d4d; cursor:pointer;">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `).join('');
    }

    // Update Prices
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const total = subtotal > 0 ? subtotal + DELIVERY_FEE : 0;

    cartSubtotal.textContent = `${subtotal.toFixed(2)} JOD`;
    cartTotal.textContent = `${total.toFixed(2)} JOD`;
}

// Modal Toggle
cartBtn.addEventListener('click', () => cartModal.style.display = 'block');
closeModal.addEventListener('click', () => cartModal.style.display = 'none');
window.addEventListener('click', (e) => {
    if (e.target === cartModal) cartModal.style.display = 'none';
});

// Toast Notification
function showToast(message) {
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: #1D2D44;
        color: white;
        padding: 1rem 2rem;
        border-radius: 30px;
        z-index: 3000;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        animation: fadeInUp 0.3s ease;
    `;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2500);
}

// WhatsApp Checkout
checkoutBtn.addEventListener('click', () => {
    if (cart.length === 0) {
        showToast("Your bag is empty!");
        return;
    }

    const name = customerNameInput.value.trim();
    const location = customerLocationInput.value.trim();

    if (!name || !location) {
        showToast("Please enter your name and location!");
        return;
    }

    const phoneNumber = "962779461465";
    let message = `Hello Re:Wear Studio!\n\n*Order Details:*\n`;
    message += `Name: ${name}\n`;
    message += `Location: ${location}\n\n`;
    message += `*Items:*\n`;

    cart.forEach(item => {
        message += `• ${item.name} (${item.quantity}x) - ${(item.price * item.quantity).toFixed(2)} JOD\n`;
    });

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const total = subtotal + DELIVERY_FEE;

    message += `\nSubtotal: ${subtotal.toFixed(2)} JOD\n`;
    message += `Delivery Fee: ${DELIVERY_FEE.toFixed(2)} JOD\n`;
    message += `*TOTAL: ${total.toFixed(2)} JOD*\n\nThank you!`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

    window.open(whatsappUrl, '_blank');
});

// Initialize
initTheme();
displayProducts();
updateUI();
