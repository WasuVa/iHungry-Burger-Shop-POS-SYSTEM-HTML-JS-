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
document.addEventListener('DOMContentLoaded', updateUptime);

const button = document.getElementById('newOrderBtn');
const targetUrl = 'oderadd.html';
button.addEventListener('click', function() {
    window.location.href = targetUrl;
});