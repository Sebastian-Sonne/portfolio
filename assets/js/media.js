//image category selection
document.addEventListener("DOMContentLoaded", function () {
    const categoryNav = document.getElementById("media-nav");
    const imageContainer = document.getElementById("media-grid");
    let previousElement = null;

    categoryNav.addEventListener("click", function (event) {
        if (event.target.tagName === "LI") {
            const selectedCategory = event.target.dataset.category;
            const prevCategory = getCategoryFromUrl();

            if (selectedCategory != prevCategory) {
                updateImages(selectedCategory);
                updateURL(selectedCategory);

                const invalidCategoryDiv = document.getElementById('media-invalid-category');
                invalidCategoryDiv.style.display = "none";

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
            if (category != 'invalid') {
                imgElement.setAttribute('alt', 'Image in Image Galery - auto generated, no exact image description available.');
            } else {
                imgElement.setAttribute('alt', 'Error 404 - category not found');
            }
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
        //list of folder lengths, for link generation purpose
        const imgFolderLenght = {
            all: 55,    //* Not accurate yet
            nature: 26,
            city: 35,
            cars: 5,    //* Not accurate yet
            birdseye: 2,    //* Not accurate yet
            invalid: 4,    //* Not accurate yet
        }

        const numImages = imgFolderLenght[category];
        const imageUrls = [];

        for (let i = 1; i <= numImages; i++) {
            const imageUrl = `/img/media/${category}/img_${i}.jpg`;
            console.log(imageUrl);
            imageUrls.push(imageUrl);
        }
        return imageUrls;
    }

    // Function to get category from URL parameter
    function getCategoryFromUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get("category") || "all";
    }

    // Initial load of images based on category from URL parameter
    const initialCategory = getCategoryFromUrl();
    const initialNavItem = categoryNav.querySelector(`[data-category="${initialCategory}"]`);
    const invalidCategoryDiv = document.getElementById('media-invalid-category');

    if (handleCategoryChange(initialCategory)) {
        if (initialNavItem) {
            initialNavItem.style.backgroundColor = 'var(--primary';
            initialNavItem.classList.add('media-li-active');
            previousElement = initialNavItem;
        }
        invalidCategoryDiv.style.display = "none";
        updateImages(initialCategory);
    } else {
        invalidCategoryDiv.style.display = "block";
        updateImages('invalid');
    }
});

// checks for valid category
function handleCategoryChange(category) {
    const validCategories = ['all', 'nature', 'city', 'cars', 'birdseye']; //* Define valid categories
    if (validCategories.includes(category)) {
        return true;
    } else {
        return false;
    }
}

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
