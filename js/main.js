// js/main.js

document.addEventListener('DOMContentLoaded', () => {

    // Ensure the articles array is available (from articlesData.js)
    if (typeof articles === 'undefined') {
        console.error('Error: articles array not found. Make sure articlesData.js is loaded before main.js');
        return; // Stop execution if data isn't available
    }

    // --- Homepage Slideshow Logic ---
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


    // --- Smooth Scroll Animation ---
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

    // --- Section Animation (Scroll-triggered) ---
    const sections = document.querySelectorAll('.hero-section, .latest-posts-section, .newsletter-signup-section, .related-articles-section'); // Re-added related-articles-section here for animation
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0
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

    // --- Dynamic Post Card Generation on index.html (Main Articles List) ---
    // *******************************************************************
    // CORRECTED: Targeting 'posts-container' as per index.html
    const latestPostsGrid = document.getElementById('posts-container');
    // *******************************************************************

    if (latestPostsGrid) {
        latestPostsGrid.innerHTML = ''; // Clear any existing content

        // Sort articles by date (most recent first)
        const sortedArticles = [...articles].sort((a, b) => {
            // Robust date parsing (if meta format can vary, make this more complex)
            const dateA = new Date(a.meta.split('|')[1].trim()); 
            const dateB = new Date(b.meta.split('|')[1].trim());
            return dateB - dateA; // Sort descending (latest first)
        });

        sortedArticles.forEach(article => {
            const postCard = document.createElement('article');
            postCard.classList.add('post-card'); 

            postCard.innerHTML = `
                <img src="${article.thumbnail}" alt="Post Thumbnail for ${article.title}" class="post-thumbnail">
                <div class="post-card-content">
                    <h3><a href="post.html?slug=${article.slug}" class="post-title-link" data-slug="${article.slug}">${article.title}</a></h3>
                    <p class="post-meta">${article.meta}</p>
                    <p class="post-excerpt">${article.excerpt}</p>
                </div>
            `;
            latestPostsGrid.appendChild(postCard);

            // Add event listener to each article link to store its data before navigating
            const links = postCard.querySelectorAll('.post-title-link, .button.primary');
            links.forEach(link => {
                link.addEventListener('click', (event) => {
                    event.preventDefault(); 
                    const slug = event.target.dataset.slug;
                    const selectedArticle = articles.find(a => a.slug === slug);
                    if (selectedArticle) {
                        localStorage.setItem('currentArticle', JSON.stringify(selectedArticle));
                        window.location.href = `post.html?slug=${slug}`;
                    }
                });
            });
        });
    } else {
        console.warn('Element with id "posts-container" (for latest posts) not found. Cannot populate all articles.');
    }

    // --- Dynamic Post Card Generation on index.html (Related Articles List) ---
    // This section assumes you want a subset or different logic for related posts.
    // If you just want the same articles as 'latest', you could append to both grids in the same loop above.
    const relatedPostsGrid = document.getElementById('related-posts-container');

    if (relatedPostsGrid) {
        relatedPostsGrid.innerHTML = ''; // Clear any existing content

        // Example: Get a subset of articles for related posts (e.g., first 3, or random)
        // For demonstration, let's just use the first 3 sorted articles.
        const relatedArticles = sortedArticles.slice(0, 3); // Adjust this logic as needed for 'related'

        relatedArticles.forEach(article => {
            const postCard = document.createElement('article');
            postCard.classList.add('post-card'); 

            postCard.innerHTML = `
                <img src="${article.thumbnail}" alt="Post Thumbnail for ${article.title}" class="post-thumbnail">
                <div class="post-card-content">
                    <h3><a href="post.html?slug=${article.slug}" class="post-title-link" data-slug="${article.slug}">${article.title}</a></h3>
                    <p class="post-meta">${article.meta}</p>
                    <p class="post-excerpt">${article.excerpt}</p>
                </div>
            `;
            relatedPostsGrid.appendChild(postCard);

            // Add event listener to each article link to store its data before navigating
            const links = postCard.querySelectorAll('.post-title-link, .button.primary');
            links.forEach(link => {
                link.addEventListener('click', (event) => {
                    event.preventDefault(); 
                    const slug = event.target.dataset.slug;
                    const selectedArticle = articles.find(a => a.slug === slug);
                    if (selectedArticle) {
                        localStorage.setItem('currentArticle', JSON.stringify(selectedArticle));
                        window.location.href = `post.html?slug=${slug}`;
                    }
                });
            });
        });
    } else {
        console.warn('Element with id "related-posts-container" not found. Cannot populate related articles.');
    }

    // --- Featured Post Click Logic ---
    const featuredPostLinks = document.querySelectorAll('.hero-section .featured-post .post-title-link, .hero-section .featured-post .button.primary');
    
    featuredPostLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();

            // IMPORTANT: The slug should come from the data-slug attribute on the clicked link itself.
            // This makes the featured section dynamic without hardcoding slugs here.
            const featuredArticleSlug = event.target.dataset.slug; // Get slug from data-slug attribute
            const selectedArticle = articles.find(article => article.slug === featuredArticleSlug);

            if (selectedArticle) {
                localStorage.setItem('currentArticle', JSON.stringify(selectedArticle));
                window.location.href = `post.html?slug=${selectedArticle.slug}`;
            } else {
                console.error('Error: Featured article not found for slug:', featuredArticleSlug);
                window.location.href = 'index.html'; // Fallback
            }
        });
    });


    // --- Newsletter Signup Functionality ---
    const newsletterForm = document.getElementById('newsletter-form');
    const emailInput = document.getElementById('email-input');
    const newsletterMessage = document.getElementById('newsletter-message');

    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault(); 

            const email = emailInput.value.trim(); 

            if (email) {
                let subscriptions = JSON.parse(localStorage.getItem('newsletterEmails')) || [];

                if (subscriptions.includes(email)) {
                    newsletterMessage.textContent = 'You are already subscribed!';
                    newsletterMessage.style.color = '#ffc107'; 
                } else {
                    subscriptions.push(email);
                    localStorage.setItem('newsletterEmails', JSON.stringify(subscriptions));

                    newsletterMessage.textContent = 'Subscribed!';
                    newsletterMessage.style.color = '#28a745'; 

                    emailInput.value = '';
                }
            } else {
                newsletterMessage.textContent = 'Please enter a valid email address.';
                newsletterMessage.style.color = '#dc3545'; 
            }

            setTimeout(() => {
                newsletterMessage.textContent = '';
                newsletterMessage.style.color = ''; 
            }, 3000);
        });
    }
});