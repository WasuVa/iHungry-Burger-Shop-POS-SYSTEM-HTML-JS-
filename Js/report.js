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
                                ${report.status === 'Resolved'?'Reopen':'Mark Resolved'}
                            </button>
                            <button class="btn btn-sm btn-outline-danger" data-action="delete">
                                Delete
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
                alert('Please fill out all fields before submitting.');
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