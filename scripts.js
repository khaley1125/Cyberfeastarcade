document.addEventListener('DOMContentLoaded', () => {
    // Global Elements
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const header = document.querySelector('header');
    const body = document.body;
    const currentYear = document.getElementById('current-year');

    // Mobile Menu System with Animation
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            body.classList.toggle('menu-open');
        });

        document.addEventListener('click', (e) => {
            if (!navMenu.contains(e.target) && !menuToggle.contains(e.target)) {
                navMenu.classList.remove('active');
                menuToggle.classList.remove('active');
                body.classList.remove('menu-open');
            }
        });
    }

    // Smooth Scroll and Active Section Highlight
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-menu a');

    document.addEventListener('click', (e) => {
        const targetLink = e.target.closest('a[href^="#"]');
        if (targetLink) {
            e.preventDefault();
            const target = document.querySelector(targetLink.getAttribute('href'));
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - header.offsetHeight,
                    behavior: 'smooth'
                });
                navLinks.forEach(link => link.classList.remove('active'));
                targetLink.classList.add('active');
            }
        }
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navLinks.forEach(link => link.classList.remove('active'));
                document.querySelector(`.nav-menu a[href="#${entry.target.id}"]`)?.classList.add('active');
            }
        });
    }, { threshold: 0.5 });

    sections.forEach(section => observer.observe(section));

    // Theme Toggle
    const themeToggle = document.createElement('button');
    themeToggle.id = 'theme-toggle';
    themeToggle.innerHTML = '🌓';
    themeToggle.setAttribute('aria-label', 'Toggle theme');
    document.body.appendChild(themeToggle);

    const savedTheme = localStorage.getItem('theme') || 'dark';
    body.classList.add(savedTheme);

    themeToggle.addEventListener('click', () => {
        body.classList.toggle('dark');
        body.classList.toggle('light');
        localStorage.setItem('theme', body.classList.contains('dark') ? 'dark' : 'light');
    });

    // Dynamic Copyright Year
    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }

    // Form Validation
    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', (e) => {
            let isValid = true;
            form.querySelectorAll('input, textarea').forEach(input => {
                if (!input.checkValidity()) {
                    isValid = false;
                    input.classList.add('invalid');
                }
            });
            if (!isValid) {
                e.preventDefault();
                form.classList.add('shake');
                setTimeout(() => form.classList.remove('shake'), 500);
            }
        });
    });

    // Scroll Progress Indicator
    const progressBar = document.createElement('div');
    progressBar.id = 'scroll-progress';
    document.body.prepend(progressBar);

    window.addEventListener('scroll', () => {
        const scrolled = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        progressBar.style.width = `${scrolled}%`;
    });

    // Lazy Loading Images
    document.querySelectorAll('img[data-src]').forEach(img => {
        const imgObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    observer.unobserve(img);
                }
            });
        });
        imgObserver.observe(img);
    });

    // Back to Top Button
    const backToTop = document.createElement('button');
    backToTop.id = 'back-to-top';
    backToTop.innerHTML = '↑';
    backToTop.setAttribute('aria-label', 'Back to top');
    document.body.appendChild(backToTop);

    window.addEventListener('scroll', () => {
        backToTop.style.display = window.scrollY > 500 ? 'block' : 'none';
    });

    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Enhanced Keyboard Navigation
    document.addEventListener('keydown', (e) => {
        const focusableElements = Array.from(document.querySelectorAll(
            'a[href], button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
        )).filter(el => !el.hidden && el.offsetParent !== null);

        const currentIndex = focusableElements.indexOf(document.activeElement);

        if (e.key === 'ArrowDown') {
            focusableElements[(currentIndex + 1) % focusableElements.length].focus();
            e.preventDefault();
        } else if (e.key === 'ArrowUp') {
            focusableElements[(currentIndex - 1 + focusableElements.length) % focusableElements.length].focus();
            e.preventDefault();
        }
    });
});
