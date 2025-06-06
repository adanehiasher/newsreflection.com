document.addEventListener('DOMContentLoaded', () => {
    const postTitleElement = document.getElementById('post-title');
    const postBodyContentElement = document.getElementById('post-body-content');

    // Retrieve the stored article data from localStorage
    const storedArticle = localStorage.getItem('currentArticle');

    if (storedArticle) {
        const articleData = JSON.parse(storedArticle);

        // Set the header
        if (postTitleElement) {
            postTitleElement.textContent = articleData.title || 'No Title Available';
        }

        // Set the body content directly using innerHTML
        if (postBodyContentElement) {
            postBodyContentElement.innerHTML = articleData.content || '<p>No content available for this article.</p>';
        }

        // Optional: Clear the stored data after displaying it
        // localStorage.removeItem('currentArticle'); 
    } else {
        // Handle cases where no article data is found (e.g., direct access to post.html)
        if (postTitleElement) {
            postTitleElement.textContent = 'Article Not Found';
        }
        if (postBodyContentElement) {
            postBodyContentElement.innerHTML = '<p>The article you are looking for could not be loaded. Please return to the <a href="index.html">homepage</a>.</p>';
        }
    }
});


