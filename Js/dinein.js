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