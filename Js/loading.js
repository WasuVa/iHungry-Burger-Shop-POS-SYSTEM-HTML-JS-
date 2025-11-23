document.addEventListener('DOMContentLoaded', () => {
    const particlesContainer = document.getElementById('particles');
    const particleCount = 40;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 5 + 's';
        particle.style.animationDuration = (Math.random() * 4 + 4) + 's';
        particlesContainer.appendChild(particle);
    }

    const percentageEl = document.getElementById('percentage');
    const loadingBar = document.getElementById('loadingBar');
    let currentPercentage = 0;
    const targetPercentage = 100;
    const duration = 2500;
    const interval = 20;
    const increment = (targetPercentage / duration) * interval;

    const updatePercentage = () => {
        if (currentPercentage < targetPercentage) {
            currentPercentage += increment;
            if (currentPercentage > targetPercentage) {
                currentPercentage = targetPercentage;
            }
            percentageEl.textContent = Math.floor(currentPercentage) + '%';
            setTimeout(updatePercentage, interval);
        } else {
            // Once loading is complete, redirect
            setTimeout(() => {
                // Add fade out effect
                document.body.style.transition = 'opacity 0.5s ease-out';
                document.body.style.opacity = '0';
                
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 500);
            }, 300);
        }
    };

    updatePercentage();

    const logo = document.getElementById('logo');
    setInterval(() => {
        logo.style.filter = `brightness(${1 + Math.random() * 0.3})`;
    }, 200);

    let loadingComplete = false;
    setTimeout(() => {
        loadingComplete = true;
    }, duration + 800);

    window.addEventListener('beforeunload', (e) => {
        if (!loadingComplete) {
            e.preventDefault();
            e.returnValue = '';
        }
    });
});
