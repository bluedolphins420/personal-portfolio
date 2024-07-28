document.addEventListener('DOMContentLoaded', () => {
    const links = document.querySelectorAll('nav ul li a');
    const menuToggle = document.getElementById('mobile-menu');
    const nav = document.querySelector('nav ul');

    menuToggle.addEventListener('click', () => {
        nav.classList.toggle('active');
    });

    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = e.target.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            targetElement.scrollIntoView({ behavior: 'smooth' });
            nav.classList.remove('active');
        });
    });

    const contactForm = document.getElementById('contact-form');
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Form submitted successfully!');
        contactForm.reset();
    });

    const lightboxLinks = document.querySelectorAll('.lightbox');
    lightboxLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const lightboxImage = document.createElement('img');
            lightboxImage.src = link.href;
            const lightboxOverlay = document.createElement('div');
            lightboxOverlay.classList.add('lightbox-overlay');
            lightboxOverlay.appendChild(lightboxImage);
            document.body.appendChild(lightboxOverlay);
            lightboxOverlay.addEventListener('click', () => {
                document.body.removeChild(lightboxOverlay);
            });
        });
    });

    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        observer.observe(section);
    });
});
