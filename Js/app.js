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
                Swal.fire({
                    position: "center",
                    icon: "error",
                    title: "Oops...",
                    text: "Cart is empty! Please add items first.",
                    footer: '<a href="#">Why do I have this issue?</a>'
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
    const bookTableButtons = document.querySelectorAll('.book-table-btn');
    const modalTableName = document.getElementById('modalTableName');
    const tableCapacity = document.getElementById('tableCapacity');
    const confirmBookingBtn = document.getElementById('confirmBookingBtn');
    const bookingForm = document.getElementById('bookingForm');
    let currentTableType = '';

    const bookingDateInput = document.getElementById('bookingDate');
    if (bookingDateInput) {
        const today = new Date().toISOString().split('T')[0];
        bookingDateInput.setAttribute('min', today);
    }

    bookTableButtons.forEach(button => {
        button.addEventListener('click', function () {
            const tableName = this.dataset.table;
            const capacity = this.dataset.capacity;
            currentTableType = tableName;

            if (modalTableName) modalTableName.textContent = `Book ${tableName}`;
            if (tableCapacity) tableCapacity.textContent = `${capacity} guests`;
        });
    });

    if (confirmBookingBtn) {
        confirmBookingBtn.addEventListener('click', function () {
            if (!bookingForm.checkValidity()) {
                bookingForm.reportValidity();
                return;
            }

            const customerName = document.getElementById('customerName').value;
            const customerPhone = document.getElementById('customerPhone').value;
            const bookingDate = document.getElementById('bookingDate').value;
            const bookingTime = document.getElementById('bookingTime').value;
            const guestCount = document.getElementById('guestCount').value;
            const specialRequests = document.getElementById('specialRequests').value;

            const dateObj = new Date(bookingDate);
            const formattedDate = dateObj.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });

            const confirmationMessage = `
Booking Confirmed!

Table: ${currentTableType}
Name: ${customerName}
Phone: ${customerPhone}
Date: ${formattedDate}
Time: ${bookingTime}
Guests: ${guestCount}
${specialRequests ? 'Special Requests: ' + specialRequests : ''}

We look forward to serving you!
            `;

            alert(confirmationMessage);

            const modal = bootstrap.Modal.getInstance(document.getElementById('bookingModal'));
            modal.hide();
            bookingForm.reset();
        });
    }
});

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

(() => {
    document.addEventListener('DOMContentLoaded', () => {
        const form = document.getElementById('reportForm');
        const reportsList = document.getElementById('reportsList');
        if (!form || !reportsList) return;

        const STORAGE_KEY = 'ihungry_reports_data';
        const SEQUENCE_KEY = 'ihungry_reports_sequence';

        let sequence = Number(localStorage.getItem(SEQUENCE_KEY)) || 0;
        let reports = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');

        const saveState = () => {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
            localStorage.setItem(SEQUENCE_KEY, sequence.toString());
        };

        const updateSummary = () => {
            const total = reports.length;
            const resolved = reports.filter(r => r.status === 'Resolved').length;
            const pending = total - resolved;

            document.querySelector('[data-summary="total"]').textContent = total.toString().padStart(2, '0');
            document.querySelector('[data-summary="resolved"]').textContent = resolved.toString().padStart(2, '0');
            document.querySelector('[data-summary="pending"]').textContent = pending.toString().padStart(2, '0');
        };

        const renderReports = () => {
            if (!reports.length) {
                reportsList.innerHTML = `
                    <div class="text-center text-muted py-5">
                        <div class="fs-1 mb-3">📭</div>
                        <p class="mb-0">No reports logged yet.<br>Use the form to add your first entry.</p>
                    </div>
                `;
                updateSummary();
                return;
            }

            const items = reports.map(report => `
                <div class="card mb-3 border-start border-4 ${report.status === 'Resolved' ? 'border-success' : 'border-warning'}" 
                     data-id="${report.id}">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-start mb-2">
                            <div>
                                <h6 class="mb-1">${report.id} · ${report.customer}</h6>
                                <small class="text-muted">Order: ${report.orderId} · Logged: ${report.timestamp}</small>
                            </div>
                            <span class="badge ${report.status === 'Resolved' ? 'bg-success' : 'bg-warning text-dark'}">
                                ${report.status}
                            </span>
                        </div>
                        <p class="mb-2 small">${report.details}</p>
                        <div class="d-flex gap-2">
                            <button class="btn btn-sm ${report.status === 'Resolved' ? 'btn-outline-secondary' : 'btn-success'}" 
                                    data-action="toggle-status">
                                ${report.status === 'Resolved' ? '↩️ Reopen' : '✅ Mark Resolved'}
                            </button>
                            <button class="btn btn-sm btn-outline-danger" data-action="delete">
                                🗑️ Delete
                            </button>
                        </div>
                    </div>
                </div>
            `).join('');

            reportsList.innerHTML = items;
            updateSummary();
        };

        const formatTimestamp = () => {
            const now = new Date();
            return now.toLocaleString([], {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        };

        form.addEventListener('submit', event => {
            event.preventDefault();
            const data = new FormData(form);
            const customer = (data.get('customerName') || '').toString().trim();
            const orderId = (data.get('orderID') || '').toString().trim();
            const details = (data.get('report') || '').toString().trim();

            if (!customer || !orderId || !details) {
                alert('⚠️ Please fill out all fields before submitting.');
                return;
            }

            sequence += 1;
            reports.unshift({
                id: `#${sequence}`,
                customer,
                orderId,
                details,
                timestamp: formatTimestamp(),
                status: 'Pending'
            });

            saveState();
            renderReports();
            form.reset();

            const firstCard = reportsList.querySelector('.card');
            if (firstCard) {
                firstCard.classList.add('border-primary');
                setTimeout(() => firstCard.classList.remove('border-primary'), 1500);
            }
        });

        reportsList.addEventListener('click', event => {
            const target = event.target;
            if (!(target instanceof HTMLElement)) return;

            const card = target.closest('[data-id]');
            const id = card?.dataset.id;
            if (!id) return;

            if (target.matches('[data-action="toggle-status"]') || target.closest('[data-action="toggle-status"]')) {
                reports = reports.map(report =>
                    report.id === id
                        ? { ...report, status: report.status === 'Resolved' ? 'Pending' : 'Resolved' }
                        : report
                );
                saveState();
                renderReports();
            }

            if (target.matches('[data-action="delete"]') || target.closest('[data-action="delete"]')) {
                if (confirm(`Delete report ${id}? This action cannot be undone.`)) {
                    reports = reports.filter(report => report.id !== id);
                    saveState();
                    renderReports();
                }
            }
        });

        renderReports();
    });
})();

