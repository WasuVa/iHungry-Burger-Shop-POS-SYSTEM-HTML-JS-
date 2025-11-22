function updateUptime() {
    const uptimeElement = document.getElementById('uptime');
    if (uptimeElement) {
        let seconds = 0;
        setInterval(() => {
            seconds++;
            const hours = String(Math.floor(seconds / 3600)).padStart(2, '0');
            const minutes = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
            const secs = String(seconds % 60).padStart(2, '0');
            uptimeElement.textContent = `${hours}:${minutes}:${secs}`;
        }, 1000);
    }
}
let cart = [];
function updateCart() {
    const cartItemsDiv = document.getElementById('cartItems');
    const subtotalEl = document.getElementById('subtotal');
    const totalEl = document.getElementById('total');

    if (!cartItemsDiv) return;

    if (cart.length === 0) {
        cartItemsDiv.innerHTML = '<p class="text-white-50 text-center py-4">Cart is empty</p>';
        if (subtotalEl) subtotalEl.textContent = 'Rs. 0.00';
        if (totalEl) totalEl.textContent = 'Rs. 0.00';
        return;
    }

    let html = '';
    let subtotal = 0;

    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        html += `
            <div class="d-flex justify-content-between align-items-center mb-2 p-2 bg-white bg-opacity-25 rounded">
                <div class="flex-grow-1">
                    <small class="text-white fw-bold">${item.name}</small>
                    <br><small class="text-white-50">Rs. ${item.price} x ${item.quantity}</small>
                </div>
                <div class="d-flex align-items-center gap-2">
                    <button class="btn btn-sm btn-light decrease-qty" data-index="${index}">-</button>
                    <span class="text-white fw-bold">${item.quantity}</span>
                    <button class="btn btn-sm btn-light increase-qty" data-index="${index}">+</button>
                    <button class="btn btn-sm btn-danger remove-item" data-index="${index}">×</button>
                </div>
            </div>
        `;
    });

    cartItemsDiv.innerHTML = html;

    if (subtotalEl) subtotalEl.textContent = `Rs. ${subtotal.toFixed(2)}`;
    if (totalEl) totalEl.textContent = `Rs. ${subtotal.toFixed(2)}`;

    document.querySelectorAll('.increase-qty').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = parseInt(e.target.dataset.index);
            cart[index].quantity++;
            updateCart();
        });
    });

    document.querySelectorAll('.decrease-qty').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = parseInt(e.target.dataset.index);
            if (cart[index].quantity > 1) {
                cart[index].quantity--;
            } else {
                cart.splice(index, 1);
            }
            updateCart();
        });
    });

    document.querySelectorAll('.remove-item').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = parseInt(e.target.dataset.index);
            cart.splice(index, 1);
            updateCart();
        });
    });
}

function initializeCartFunctionality() {
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    console.log('Found add-to-cart buttons:', addToCartButtons.length);
    
    addToCartButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const card = e.target.closest('.menu-item');
            if (!card) {
                console.error('Menu item card not found');
                return;
            }
            
            const name = card.dataset.name;
            const price = parseFloat(card.dataset.price);
            
            console.log('Adding to cart:', name, price);

            const existingItem = cart.find(item => item.name === name);
            if (existingItem) {
                existingItem.quantity++;
            } else {
                cart.push({ name, price, quantity: 1 });
            }

            updateCart();
            
            const originalText = e.target.textContent;
            e.target.textContent = '✓ Added';
            e.target.classList.add('btn-success');
            e.target.classList.remove('btn-warning');
            setTimeout(() => {
                e.target.textContent = originalText;
                e.target.classList.remove('btn-success');
                e.target.classList.add('btn-warning');
            }, 500);
        });
    });

    const clearCartBtn = document.getElementById('clearCartBtn');
    if (clearCartBtn) {
        clearCartBtn.addEventListener('click', () => {
            if (cart.length === 0) {
                alert('Cart is already empty!');
                return;
            }
            if (confirm('Clear all items from cart?')) {
                cart = [];
                updateCart();
            }
        });
    }

    const placeOrderBtn = document.getElementById('placeOrderBtn');
    if (placeOrderBtn) {
        placeOrderBtn.addEventListener('click', () => {
            if (cart.length === 0) {
                alert('Cart is empty! Please add items first.');
                return;
            }

            const customerName = document.getElementById('customerName');
            if (!customerName || !customerName.value.trim()) {
                alert('Please enter customer name!');
                if (customerName) customerName.focus();
                return;
            }

            const totalEl = document.getElementById('total');
            const totalAmount = totalEl ? totalEl.textContent : 'Rs. 0.00';
            
            alert(`Order placed successfully for ${customerName.value}!\nTotal: ${totalAmount}`);
            
            cart = [];
            updateCart();
            
            const orderForm = document.getElementById('orderForm');
            if (orderForm) orderForm.reset();
        });
    }
}

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Loaded - Initializing...');
    
    updateUptime();
    
    const newOrderBtn = document.getElementById('newOrderBtn');
    if (newOrderBtn) {
        newOrderBtn.addEventListener('click', function() {
            window.location.href = 'oderadd.html';
        });
    }
    
    initializeCartFunctionality();
});

