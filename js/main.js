document.addEventListener('DOMContentLoaded', () => {
    // --- Homepage Slideshow Logic (unchanged) ---
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.prev-slide');
    const nextBtn = document.querySelector('.next-slide');
    const slideshowContainer = document.querySelector('.slideshow-container');

    let currentSlide = 0;
    let slideInterval;

    function showSlide(index) {
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        if (slides[index]) {
            slides[index].classList.add('active');
        }
        if (dots[index]) {
            dots[index].classList.add('active');
        }
        currentSlide = index;
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }

    function prevSlide() {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(currentSlide);
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            prevSlide();
            resetAutoPlay();
        });
    }
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            nextSlide();
            resetAutoPlay();
        });
    }

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showSlide(index);
            resetAutoPlay();
        });
    });

    function startAutoPlay() {
        if (slides.length > 1) {
            slideInterval = setInterval(nextSlide, 3500); // 3.5 seconds
        }
    }

    function resetAutoPlay() {
        clearInterval(slideInterval);
        startAutoPlay();
    }

    if (slideshowContainer) {
        slideshowContainer.addEventListener('mouseenter', () => clearInterval(slideInterval));
        slideshowContainer.addEventListener('mouseleave', () => startAutoPlay());
    }

    if (slides.length > 0) {
        showSlide(currentSlide);
        startAutoPlay();
    }


    // --- Smooth Scroll Animation (unchanged) ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // --- Section Animation (Scroll-triggered - unchanged) ---
    const sections = document.querySelectorAll('.hero-section, .latest-posts-section, .newsletter-signup-section, .related-articles-section'); // Added .related-articles-section
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.2
    };
    const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-ready');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    sections.forEach(section => {
        sectionObserver.observe(section);
    });
    const mainHeader = document.querySelector('.main-header');
    if (mainHeader) {
        mainHeader.classList.add('animate-ready');
    }

    // --- Article Click and Data Storage Logic (unchanged) ---
    const postCards = document.querySelectorAll('.post-card');

    postCards.forEach(card => {
        card.addEventListener('click', (event) => {
            const clickedLink = event.target.closest('a[href="post.html"]');
            if (clickedLink) {
                event.preventDefault();
            } else if (event.target.tagName === 'A') {
                return;
            } else {
                event.preventDefault();
            }

            const postTitleElement = card.querySelector('.post-title-link');
            const fullContentElement = card.querySelector('.full-article-content');

            const articleData = {
                title: postTitleElement ? postTitleElement.textContent : 'Untitled Article',
                content: fullContentElement ? fullContentElement.innerHTML : '<p>No content available for this article.</p>'
            };

            localStorage.setItem('currentArticle', JSON.stringify(articleData));
            window.location.href = 'post.html';
        });
    });

    const featuredPostLinks = document.querySelectorAll('.hero-section .featured-post .post-title-link, .hero-section .featured-post .button.primary');
    
    featuredPostLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();

            const featuredPostDiv = event.target.closest('.featured-post');
            if (featuredPostDiv) {
                const postTitleElement = featuredPostDiv.querySelector('.post-title-link');
                const heroHeadlineElement = event.target.closest('.hero-content').querySelector('h2');
                const heroParagraphElement = event.target.closest('.hero-content').querySelector('p:not(.post-meta)');

                let simulatedFullContent = '';
                if (heroHeadlineElement) {
                    simulatedFullContent += `<h2>${heroHeadlineElement.textContent}</h2>`;
                }
                if (heroParagraphElement) {
                    simulatedFullContent += `<p>${heroParagraphElement.textContent}</p>`;
                }
                if (featuredPostDiv.querySelector('.featured-image')) {
                    simulatedFullContent += `<img src="${featuredPostDiv.querySelector('.featured-image').src}" alt="${postTitleElement ? postTitleElement.textContent : ''}" class="post-detail-image">`;
                }
                if (featuredPostDiv.querySelector('.post-meta')) {
                    simulatedFullContent += `<p class="post-meta-detail">${featuredPostDiv.querySelector('.post-meta').textContent}</p>`;
                }
                if (featuredPostDiv.querySelector('.post-excerpt')) {
                    simulatedFullContent += `<p>${featuredPostDiv.querySelector('.post-excerpt').textContent}</p>`;
                }
                simulatedFullContent += `<p>This is a featured article. In a real application, clicking 'Read More' here would load the full, detailed content from a database or a dedicated article file.</p>`;

                const articleData = {
                    title: postTitleElement ? postTitleElement.textContent : 'Featured Article',
                    content: simulatedFullContent
                };

                localStorage.setItem('currentArticle', JSON.stringify(articleData));
                window.location.href = 'post.html';
            }
        });
    });

    // --- Newsletter Signup Functionality ---
    const newsletterForm = document.getElementById('newsletter-form');
    const emailInput = document.getElementById('email-input');
    const newsletterMessage = document.getElementById('newsletter-message');

    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Prevent the form from submitting normally and refreshing the page

            const email = emailInput.value.trim(); // Get the email and remove whitespace

            if (email) {
                // Get existing subscriptions or initialize an empty array
                let subscriptions = JSON.parse(localStorage.getItem('newsletterEmails')) || [];

                // Check if email already exists
                if (subscriptions.includes(email)) {
                    newsletterMessage.textContent = 'You are already subscribed!';
                    newsletterMessage.style.color = '#ffc107'; // Optional: A warning color
                } else {
                    // Add the new email
                    subscriptions.push(email);
                    // Save the updated array to localStorage
                    localStorage.setItem('newsletterEmails', JSON.stringify(subscriptions));

                    // Display success message
                    newsletterMessage.textContent = 'Subscribed!';
                    newsletterMessage.style.color = '#28a745'; // Optional: A success color

                    // Clear the input field
                    emailInput.value = '';
                }
            } else {
                newsletterMessage.textContent = 'Please enter a valid email address.';
                newsletterMessage.style.color = '#dc3545'; // Optional: An error color
            }

            // Optional: Hide message after a few seconds
            setTimeout(() => {
                newsletterMessage.textContent = '';
                newsletterMessage.style.color = ''; // Reset color
            }, 5000); // Clear message after 5 seconds
        });
    }
});