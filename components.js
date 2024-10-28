// components.js

/**
 * Function to load an HTML component into a specified placeholder.
 * @param {string} id - The ID of the placeholder element in index.html.
 * @param {string} url - The path to the component HTML file.
 */
function loadComponent(id, url) {
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to load ${url}: ${response.statusText}`);
            }
            return response.text();
        })
        .then(data => {
            document.getElementById(id).innerHTML = data;
        })
        .catch(error => console.error('Error loading component:', error));
}

// Load components after the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    loadComponent('navbar-placeholder', 'navbar.html');
    loadComponent('header-placeholder', 'header.html');
    loadComponent('how-to-use-placeholder', 'how-to-use.html');
    loadComponent('about-placeholder', 'about.html');
    loadComponent('footer-placeholder', 'footer.html');
});
