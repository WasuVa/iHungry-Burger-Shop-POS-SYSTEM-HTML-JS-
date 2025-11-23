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
                    <small class="text-black fw-bold">${item.name}</small>
                    <br><small class="text-black-80">Rs. ${item.price} x ${item.quantity}</small>
                </div>
                <div class="d-flex align-items-center gap-2">
                    <button class="btn btn-sm btn-light decrease-qty" data-index="${index}">-</button>
                    <span class="text-black fw-bold">${item.quantity}</span>
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
                Swal.fire({
                    position: "center",
                    icon: "error",
                    text: "Cart is already empty!",
                    // footer: '<a href="#">Why do I have this issue?</a>'
                });
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
                Swal.fire({
                    position: "center",
                    icon: "error",
                    text: "Cart is empty! Please add items first.",
                    // footer: '<a href="#">Why do I have this issue?</a>'
                });
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

            Swal.fire({
                position: "center",
                icon: "success",
                title: `Order placed successfully for ${customerName.value}!\nTotal: ${totalAmount}`,
                showConfirmButton: false,
                timer: 2000
            });

            cart = [];
            updateCart();

            const orderForm = document.getElementById('orderForm');
            if (orderForm) orderForm.reset();
        });
    }
}

document.addEventListener('DOMContentLoaded', function () {
    console.log('DOM Loaded - Initializing...');

    updateUptime();

    const newOrderBtn = document.getElementById('newOrderBtn');
    if (newOrderBtn) {
        newOrderBtn.addEventListener('click', function () {
            window.location.href = 'oderadd.html';
        });
    }

    initializeCartFunctionality();
});

document.addEventListener('DOMContentLoaded', () => {
    const categoryButtons = document.querySelectorAll('[data-category]');
    const menuItems = document.querySelectorAll('#menuItems > div[data-category]');

    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const category = button.dataset.category;
            menuItems.forEach(item => {
                if (category === 'all' || item.dataset.category === category) {
                    item.style.display = '';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });

    const originalUpdateCart = window.updateCart;
    if (originalUpdateCart) {
        window.updateCart = customUpdateCart;
    }
});

