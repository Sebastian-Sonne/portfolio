//image category selection
document.addEventListener("DOMContentLoaded", function () {
    const categoryNav = document.getElementById("media-nav");
    const imageContainer = document.getElementById("media-grid");
    let previousElement = null;

    categoryNav.addEventListener("click", function (event) {
        if (event.target.tagName === "LI") {
            const selectedCategory = event.target.dataset.category;
            const prevCategory = getCategoryFromUrl();

            //prevent unnesecary reload
            if (selectedCategory != prevCategory) {
                updateImages(selectedCategory);
                updateURL(selectedCategory);

                const currentElement = document.querySelector(`[data-category="${selectedCategory}"]`);

                if (previousElement) {
                    previousElement.style.backgroundColor = '';
                    previousElement.classList.remove('media-li-active');
                }
                currentElement.style.backgroundColor = 'var(--primary)';
                currentElement.classList.add('media-li-active');

                previousElement = currentElement;
                setupIntersectionObserver();
            }
        }
    });

    function updateImages(category) {
        // Clear previous images
        imageContainer.innerHTML = "";

        // Fetch images based on the category (you can replace this with your own logic)
        const images = getImagesForCategory(category);

        // Append images to the container
        images.forEach(image => {
            const imgElement = document.createElement("img");
            imgElement.src = image;
            imgElement.classList.add('hidden');
            imgElement.setAttribute('alt', 'Image in Image Galery - auto generated, no description available.');
            imageContainer.appendChild(imgElement);
        });
    }

    //sets url-param "category" to the category parameter
    function updateURL(category) {
        const urlParams = new URLSearchParams(window.location.search);
        urlParams.set("category", category);
        const newUrl = window.location.pathname + '?' + urlParams.toString();
        window.history.pushState({ path: newUrl }, '', newUrl);
    }

    //returns list of image urls depending on category
    function getImagesForCategory(category) {
        // Simulated image URLs for demonstration
        const imageUrls = {
            all: ["/img/b-roll/mountain_2.jpg", "/img/b-roll/singapore_1.webp", "/img/b-roll/snow_1.jpg", "/img/b-roll/sunset_1.jpg", "/img/b-roll/tennis_1.webp", "/img/b-roll/munich_1.webp", "/img/b-roll/mountain_2.jpg", "/img/b-roll/singapore_1.webp", "/img/b-roll/snow_1.jpg", "/img/b-roll/sunset_1.jpg", "/img/b-roll/tennis_1.webp", "/img/b-roll/munich_1.webp", "/img/b-roll/mountain_2.jpg", "/img/b-roll/singapore_1.webp", "/img/b-roll/snow_1.jpg", "/img/b-roll/sunset_1.jpg", "/img/b-roll/tennis_1.webp", "/img/b-roll/munich_1.webp", "/img/b-roll/mountain_2.jpg", "/img/b-roll/singapore_1.webp", "/img/b-roll/snow_1.jpg", "/img/b-roll/sunset_1.jpg", "/img/b-roll/tennis_1.webp", "/img/b-roll/munich_1.webp"],
            nature: ["/img/b-roll/mountain_2.jpg", "/img/b-roll/snow_1.jpg", "/img/b-roll/sunset_1.jpg"],
            city: ["/img/b-roll/munich_1.webp", "/img/b-roll/singapore_1.webp"],
            birdseye: ["", ""]
            // Add more categories as needed
        };

        return imageUrls[category] || [];
    }

    // Function to get category from URL parameter
    function getCategoryFromUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get("category") || "all";
    }

    // Initial load of images based on category from URL parameter
    const initialCategory = getCategoryFromUrl();
    const initialNavItem = categoryNav.querySelector(`[data-category="${initialCategory}"]`);
    if (initialNavItem) {
        initialNavItem.style.backgroundColor = 'var(--primary';
        initialNavItem.classList.add('media-li-active');
        previousElement = initialNavItem;
    }
    updateImages(initialCategory);
});

function setupIntersectionObserver() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
            } else {
                entry.target.classList.remove('show');
            }
        });
    });

    const hiddenElements = document.querySelectorAll('.hidden');
    hiddenElements.forEach((el) => observer.observe(el));
}

window.addEventListener('load', setupIntersectionObserver);
