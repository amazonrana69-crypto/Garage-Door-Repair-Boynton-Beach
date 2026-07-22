document.addEventListener('DOMContentLoaded', () => {
    // 1. STICKY NAVBAR ON SCROLL
    const headerWrapper = document.getElementById('headerWrapper');
    const header = document.getElementById('mainHeader');
    const scrollThreshold = 50;

    function handleScroll() {
        if (window.scrollY > scrollThreshold) {
            headerWrapper.classList.add('scrolled');
        } else {
            headerWrapper.classList.remove('scrolled');
        }
    }

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Run once on load to set initial state

    // 2. MOBILE MENU TOGGLE
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');

    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Mobile Dropdowns
    const dropdownItems = document.querySelectorAll('.nav-item.dropdown');
    
    dropdownItems.forEach(item => {
        const link = item.querySelector('.nav-link');
        
        link.addEventListener('click', (e) => {
            // Only toggle on click for mobile/tablet screens
            if (window.innerWidth <= 768) {
                e.preventDefault();
                e.stopPropagation();
                
                // Close other open dropdowns first
                dropdownItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('open');
                    }
                });
                
                item.classList.toggle('open');
            }
        });
    });

    // Close mobile menu and dropdowns when clicking outside
    document.addEventListener('click', (e) => {
        if (!navMenu.contains(e.target) && !menuToggle.contains(e.target)) {
            menuToggle.classList.remove('active');
            navMenu.classList.remove('active');
            dropdownItems.forEach(item => item.classList.remove('open'));
        }
    });

    // 3. SMOOTH SCROLLING & NAVIGATION MICRO-INTERACTIONS
    const navLinks = document.querySelectorAll('.nav-link, .dropdown-link, a[href^="#"]');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            
            // Allow default behavior if it's not a hash link
            if (!href || !href.startsWith('#')) return;
            
            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                e.preventDefault();
                
                // Close mobile menu
                menuToggle.classList.remove('active');
                navMenu.classList.remove('active');
                dropdownItems.forEach(item => item.classList.remove('open'));

                // Calculate scroll position offset for sticky header
                const headerOffset = header.offsetHeight;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });

                // Micro-interaction: Highlight specific service card if clicked from dropdown
                const serviceId = link.getAttribute('data-target');
                if (serviceId) {
                    const serviceCard = document.getElementById(serviceId);
                    if (serviceCard) {
                        setTimeout(() => {
                            serviceCard.style.transition = 'all 0.5s ease';
                            serviceCard.style.transform = 'translateY(-10px) scale(1.02)';
                            serviceCard.style.borderColor = 'var(--accent)';
                            serviceCard.style.boxShadow = '0 20px 40px rgba(220, 38, 38, 0.2)';
                            
                            setTimeout(() => {
                                serviceCard.style.transform = '';
                                serviceCard.style.borderColor = '';
                                serviceCard.style.boxShadow = '';
                            }, 2500);
                        }, 800);
                    }
                }
            }
        });
    });

    // 4. FAQ ACCORDION TOGGLE
    const faqHeaders = document.querySelectorAll('.faq-header');

    faqHeaders.forEach(headerBtn => {
        headerBtn.addEventListener('click', () => {
            const faqItem = headerBtn.parentElement;
            const faqContent = faqItem.querySelector('.faq-content');
            const isActive = faqItem.classList.contains('active');

            // Close all open FAQs
            document.querySelectorAll('.faq-item').forEach(item => {
                item.classList.remove('active');
                item.querySelector('.faq-content').style.maxHeight = '0px';
            });

            // If it wasn't active, open it
            if (!isActive) {
                faqItem.classList.add('active');
                faqContent.style.maxHeight = faqContent.scrollHeight + 'px';
            }
        });
    });

    // 5. CONTACT FORM VALIDATION & HANDLING
    const contactForm = document.getElementById('contactForm');
    const formSuccess = document.getElementById('formSuccess');

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Inputs
        const firstName = document.getElementById('firstName');
        const lastName = document.getElementById('lastName');
        const email = document.getElementById('email');
        const phone = document.getElementById('phone');
        const message = document.getElementById('message');

        let isValid = true;

        // Reset errors
        document.querySelectorAll('.form-input').forEach(input => {
            input.style.borderColor = '';
        });

        // Simple validation check
        const fields = [firstName, lastName, email, phone, message];
        fields.forEach(field => {
            if (!field.value.trim()) {
                field.style.borderColor = 'var(--accent)';
                isValid = false;
            }
        });

        // Email validation regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (email.value.trim() && !emailRegex.test(email.value.trim())) {
            email.style.borderColor = 'var(--accent)';
            isValid = false;
        }

        // Phone validation (ensure it has at least some numbers)
        const phoneRegex = /^[0-9\-\+\(\)\s]{7,15}$/;
        if (phone.value.trim() && !phoneRegex.test(phone.value.trim())) {
            phone.style.borderColor = 'var(--accent)';
            isValid = false;
        }

        if (isValid) {
            // Show loading animation on the button
            const submitBtn = contactForm.querySelector('.form-submit-btn');
            const originalBtnText = submitBtn.textContent;
            submitBtn.textContent = 'Processing request...';
            submitBtn.disabled = true;

            // Simulate form submission to backend
            setTimeout(() => {
                contactForm.reset();
                contactForm.style.display = 'none';
                formSuccess.style.display = 'block';
                formSuccess.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }, 1200);
        }
    });

    // 6. FUN FACTS COUNTER ANIMATION
    const counters = document.querySelectorAll('.fact-num');
    
    if (counters.length > 0) {
        const countUp = (counter) => {
            const target = +counter.getAttribute('data-val');
            let count = 0;
            const duration = 2000;
            const stepTime = Math.max(Math.floor(duration / (target || 1)), 15);
            
            const timer = setInterval(() => {
                if (target === 10) {
                    count += 1;
                    counter.textContent = count + '+';
                } else if (target === 5000) {
                    count += 100;
                    counter.textContent = count.toLocaleString() + '+';
                } else if (target === 15) {
                    count += 1;
                    counter.textContent = count + ' Min';
                } else if (target === 100) {
                    count += 5;
                    counter.textContent = count + '%';
                } else {
                    count += 1;
                    counter.textContent = count;
                }
                
                if (count >= target) {
                    clearInterval(timer);
                    if (target === 10) counter.textContent = '10+';
                    if (target === 5000) counter.textContent = '5,000+';
                    if (target === 15) counter.textContent = '15 Min';
                    if (target === 100) counter.textContent = '100%';
                }
            }, stepTime);
        };

        const factObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counter = entry.target;
                    countUp(counter);
                    observer.unobserve(counter);
                }
            });
        }, { threshold: 0.2 });

        counters.forEach(counter => {
            factObserver.observe(counter);
        });
    }
});
