document.addEventListener('DOMContentLoaded', () => {
    const mobileMenuButton = document.getElementById('mobile-menu');
    const mainNav = document.getElementById('navigation-menu'); // Updated selector for the UL
    const navLinks = document.querySelectorAll('#navigation-menu li a');
    const header = document.querySelector('header');
    const contactForm = document.getElementById('contact-form');

    // 1. Mobile Menu Toggle with ARIA attributes
    if (mobileMenuButton && mainNav) {
        mobileMenuButton.addEventListener('click', () => {
            const isActive = mainNav.classList.toggle('active');
            mobileMenuButton.classList.toggle('active'); // For styling the button itself (e.g., X icon)
            mobileMenuButton.setAttribute('aria-expanded', isActive.toString());

            // Optional: Toggle body scroll to prevent scrolling when menu is open
            // document.body.style.overflow = isActive ? 'hidden' : '';
        });
    }

    // Function to get header height - ensures it's callable for dynamic calculations
    function getHeaderHeight() {
        return header ? header.offsetHeight : 0;
    }

    function updateHeaderHeight() {
        const height = getHeaderHeight();
        if (height > 0) {
            document.documentElement.style.setProperty('--header-height', `${height}px`);
        }
    }

    // Set initial header height and update on resize
    updateHeaderHeight();
    window.addEventListener('resize', updateHeaderHeight);

    // 2. Smooth Scrolling with Sticky Header Offset
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = e.target.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                const headerOffset = getHeaderHeight();
                const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                const offsetPosition = elementPosition - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });

                // Close mobile menu if open
                if (mainNav && mainNav.classList.contains('active')) {
                    mainNav.classList.remove('active');
                    mobileMenuButton.classList.remove('active');
                    mobileMenuButton.setAttribute('aria-expanded', 'false');
                    // document.body.style.overflow = ''; // Restore scroll
                }
            }
        });
    });

    // 3. Header Scroll Effect
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) { // Add 'scrolled' class after 50px scroll
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }, { passive: true }); // Use passive listener for scroll performance
    }

    // 4. Contact Form Submission (keeping it simple as per requirement)
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            // In a real app, you'd send data to a server here
            alert('Form submitted successfully! (This is a demo)');
            contactForm.reset();
        });
    }

    // 5. Lightbox Functionality
    const lightboxLinks = document.querySelectorAll('a[href$=".jpg"], a[href$=".jpeg"], a[href$=".png"], a[href$=".gif"]'); // More generic selector for image links
    let currentLightboxOverlay = null; // To keep track of the current lightbox

    function closeLightbox() {
        if (currentLightboxOverlay) {
            currentLightboxOverlay.classList.remove('active');
            // Remove after transition (optional, depends on CSS transition duration)
            setTimeout(() => {
                if (currentLightboxOverlay && document.body.contains(currentLightboxOverlay)) {
                    document.body.removeChild(currentLightboxOverlay);
                }
                currentLightboxOverlay = null;
                document.removeEventListener('keydown', handleLightboxKeydown);
            }, 250); // Match CSS transition-speed (0.25s)
        }
    }

    function handleLightboxKeydown(e) {
        if (e.key === 'Escape') {
            closeLightbox();
        }
    }

    lightboxLinks.forEach(link => {
        // Check if the link is part of a project card or intended to be a lightbox trigger
        // This avoids making ALL image links into lightboxes if not desired.
        // For this example, we assume any link to an image file is a lightbox trigger.
        // In a more complex app, you might add a specific class like '.enable-lightbox'
        if (link.closest('.project') || link.classList.contains('lightbox')) { // Ensure it's a project image or has lightbox class
            link.addEventListener('click', (e) => {
                e.preventDefault();

                if (currentLightboxOverlay) { // Close any existing lightbox
                    closeLightbox();
                }

                const lightboxOverlay = document.createElement('div');
                lightboxOverlay.classList.add('lightbox-overlay');

                const lightboxImage = document.createElement('img');
                lightboxImage.src = link.href;
                lightboxImage.alt = link.querySelector('img')?.alt || 'Lightbox image'; // Try to get alt from inner img

                lightboxOverlay.appendChild(lightboxImage);
                document.body.appendChild(lightboxOverlay);
                currentLightboxOverlay = lightboxOverlay;

                // Show with transition
                setTimeout(() => lightboxOverlay.classList.add('active'), 10);


                // Close on overlay click (but not on image click)
                lightboxOverlay.addEventListener('click', (event) => {
                    if (event.target === lightboxOverlay) { // Only close if overlay itself is clicked
                        closeLightbox();
                    }
                });
                document.addEventListener('keydown', handleLightboxKeydown);
            });
        }
    });

    // 6. Intersection Observer for Scroll Animations
    const observerOptions = {
        root: null, // viewport
        rootMargin: '0px',
        threshold: 0.1 // 10% of the element is visible
    };

    const intersectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                observer.unobserve(entry.target); // Stop observing once animated
            }
        });
    }, observerOptions);

    const sectionsToAnimate = document.querySelectorAll('section[id]'); // Target sections with an ID
    sectionsToAnimate.forEach(section => {
        intersectionObserver.observe(section);
    });

    // Add .no-js class to html if JS is enabled, then remove it.
    // CSS can use .js instead of .no-js for JS-dependent styles.
    document.documentElement.classList.remove('no-js');
    document.documentElement.classList.add('js');

});
