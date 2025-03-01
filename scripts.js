document.addEventListener('DOMContentLoaded', () => {
    // Global Elements
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('nav');
    const header = document.querySelector('header');
    const body = document.body;
    const currentYear = document.getElementById('current-year');

    // 1. Mobile Menu System with Animation
    if (menuToggle && nav) {
        const menuLinks = nav.querySelectorAll('a');
        let isMenuAnimating = false;

        const toggleMenu = () => {
            if (isMenuAnimating) return;
            isMenuAnimating = true;

            menuToggle.classList.toggle('active');
            nav.classList.toggle('active');
            body.classList.toggle('menu-open');

            // GSAP Animation
            if (nav.classList.contains('active')) {
                gsap.from(nav, {
                    duration: 0.3,
                    opacity: 0,
                    y: -20,
                    ease: 'power2.out',
                    onComplete: () => {
                        menuLinks[0].focus();
                        isMenuAnimating = false;
                    }
                });
            } else {
                gsap.to(nav, {
                    duration: 0.2,
                    opacity: 0,
                    y: -20,
                    ease: 'power2.in',
                    onComplete: () => {
                        menuToggle.focus();
                        isMenuAnimating = false;
                    }
                });
            }
        };

        // Menu Interactions
        menuToggle.addEventListener('click', toggleMenu);
        
        // Close menu on outside click
        document.addEventListener('click', (e) => {
            if (!nav.contains(e.target) && !menuToggle.contains(e.target)) {
                if (nav.classList.contains('active')) toggleMenu();
            }
        });

        // Keyboard Navigation
        nav.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && nav.classList.contains('active')) {
                toggleMenu();
            }
        });
    }

    // 2. Smooth Scroll with Active Section Detection
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('nav a');

    const smoothScroll = (e) => {
        const targetLink = e.target.closest('a[href^="#"]');
        if (targetLink) {
            e.preventDefault();
            const targetId = targetLink.hash.substring(1);
            const target = document.getElementById(targetId);

            if (target) {
                const headerHeight = header.offsetHeight;
                const targetPosition = target.offsetTop - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });

                // Update active state
                navLinks.forEach(link => link.classList.remove('active'));
                targetLink.classList.add('active');
            }
        }
    };

    document.addEventListener('click', smoothScroll);

    // 3. Dynamic Active Section Highlight
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.5
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const id = entry.target.getAttribute('id');
            const navLink = document.querySelector(`nav a[href="#${id}"]`);
            
            if (entry.isIntersecting) {
                navLinks.forEach(link => link.classList.remove('active'));
                navLink?.classList.add('active');
            }
        });
    }, observerOptions);

    sections.forEach(section => observer.observe(section));

    // 4. Dark/Light Mode Toggle
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

    // 5. Dynamic Copyright Year
    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }

    // 6. Form Validation System
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        const inputs = form.querySelectorAll('input, textarea');
        
        form.addEventListener('submit', (e) => {
            let isValid = true;
            
            inputs.forEach(input => {
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

        // Real-time Validation
        inputs.forEach(input => {
            input.addEventListener('input', () => {
                input.classList.toggle('invalid', !input.checkValidity());
            });
        });
    });

    // 7. Scroll Progress Indicator
    const progressBar = document.createElement('div');
    progressBar.id = 'scroll-progress';
    document.body.prepend(progressBar);

    window.addEventListener('scroll', () => {
        const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrolled = (window.scrollY / windowHeight) * 100;
        progressBar.style.width = `${scrolled}%`;
    });

    // 8. Lazy Loading Images
    const lazyImages = document.querySelectorAll('img[data-src]');
    const imgObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });

    lazyImages.forEach(img => imgObserver.observe(img));

    // 9. Back to Top Button
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

    // 10. Enhanced Keyboard Navigation
    document.addEventListener('keydown', (e) => {
        const focusableElements = Array.from(document.querySelectorAll(
            'a[href], button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
        )).filter(el => !el.disidden && el.offsetParent !== null);

        const currentIndex = focusableElements.indexOf(document.activeElement);

        if (e.key === 'ArrowDown') {
            const nextIndex = (currentIndex + 1) % focusableElements.length;
            focusableElements[nextIndex].focus();
            e.preventDefault();
        } else if (e.key === 'ArrowUp') {
            const prevIndex = (currentIndex - 1 + focusableElements.length) % focusableElements.length;
            focusableElements[prevIndex].focus();
            e.preventDefault();
        }
    });
});
document.addEventListener("DOMContentLoaded", function () {
    const menuToggle = document.querySelector(".menu-toggle");
    const navMenu = document.querySelector(".nav-menu");

    if (menuToggle && navMenu) {
        menuToggle.addEventListener("click", function () {
            navMenu.classList.toggle("active");
        });
    }
});
