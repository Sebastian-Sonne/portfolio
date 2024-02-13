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

    //nav arrows
    const prevBtn = document.getElementById("media-nav-arrow-left");
    const nextBtn = document.getElementById("media-nav-arrow-right");

    prevBtn.addEventListener('click', function () {
        if (lightbox.style.display === 'flex') {
            showPrevImg();
        }
    });

    nextBtn.addEventListener('click', function () {
        if (lightbox.style.display === 'flex') {
            showNextImg();
        }
    });

    //image navigation left right functions =>

    //switches the current lighbox image with the one on the left of it
    function showPrevImg() {
        const currCategory = getCategoryFromUrl();
        const currImgIndex = getCurrentImageIndex(currCategory);
        const imgURLs = getImagesForCategory(getCategoryFromUrl());
        const prevImgIndex = (currImgIndex - 1 + imgURLs.length) % imgURLs.length;
        updateLightboxImage(prevImgIndex);

        setTimeout(() => {
            navigationActive = true;
        }, 100);
    }

    //switches the current lighbox image with the one on the right of it
    function showNextImg() {
        const currCategory = getCategoryFromUrl();
        const currImgIndex = getCurrentImageIndex(currCategory);
        const imgURLs = getImagesForCategory(getCategoryFromUrl());
        const nextImgIndex = (currImgIndex + 1 + imgURLs.length) % imgURLs.length;
        updateLightboxImage(nextImgIndex);

        setTimeout(() => {
            navigationActive = true;
        }, 100);
    }

    // Function to get the index of the currently displayed image
    function getCurrentImageIndex(category) {
        const currentImgSrc = document.getElementById("lightbox-img").src;
        const imgURLs = getImagesForCategory(category);
        // Find the index of the current image by checking if the currentImgSrc contains each URL
        return imgURLs.findIndex(img => currentImgSrc.includes(img));
    }

    //update the lighbox image
    function updateLightboxImage(index) {
        const imgURLs = getImagesForCategory(getCategoryFromUrl());
        const lighboxImg = document.getElementById('lightbox-img');
        if (imgURLs[index] != '') {
            lighboxImg.setAttribute('alt', 'Image auto generated - no description available');
        }
        lighboxImg.src = imgURLs[index];
    }


    function updateImages(category) {
        // Clear previous images
        imageContainer.innerHTML = "";

        // Fetch images based on the category (you can replace this with your own logic)
        const images = getImagesForCategory(category);

        // Append images to the container
        images.forEach(image => {
            const imgElement = document.createElement("img");

            imgElement.src = image;
            imgElement.classList.add('thumbnail');
            imgElement.classList.add('hidden');

            if (category != 'invalid') {
                imgElement.setAttribute('alt', 'Image in Image Galery - auto generated, no exact image description available.');
            } else {
                imgElement.setAttribute('alt', 'Error 404 - category not found');
            }

            imageContainer.appendChild(imgElement);

            imgElement.addEventListener("click", function () {
                document.getElementById("lightbox-img").src = this.src;
                lightboxDisplay('flex');
            })
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
        const numImages = getImgFolderLengh(category);
        const imageUrls = [];

        for (let i = 1; i <= numImages; i++) {
            const imageUrl = `/img/media/${category}/img_${i}.jpg`;
            imageUrls.push(imageUrl);
        }
        return imageUrls;
    }

    //returns all image descriptions for the according image category
    function getDescriptionsForCategory(category) {
        const numImages = getImgFolderLengh(category);

    }

    //* SET FOLDER LENGTHs HERE
    function getImgFolderLengh(category) {
        const imgFolderLenght = {
            all: 55,    //* Not accurate yet
            nature: 26,
            city: 35,
            cars: 5,    //* Not accurate yet
            birdseye: 2,    //* Not accurate yet
            invalid: 4,    //* Not accurate yet
        }
        return imgFolderLenght[category];
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
            initialNavItem.style.backgroundColor = 'var(--primary)';
            initialNavItem.classList.add('media-li-active');
            previousElement = initialNavItem;
        }
        invalidCategoryDiv.style.display = "none";
        updateImages(initialCategory);
    } else {
        invalidCategoryDiv.style.display = "block";
        updateImages('invalid');
    }

    //set display style of lighbox
    function lightboxDisplay(style) {
        if (style == 'flex') {
            disableScroll();
        } else {
            enableScroll();
        }
        document.getElementById("lightbox").style.display = style;
    }
    
    //closes lightbox when escape key is pressed
    document.addEventListener('keydown', function (event) {
        if (event.key === "Escape") {
            lightboxDisplay('none');
        }

        if (lightbox.style.display === 'flex') {
            if (event.key === 'ArrowLeft') {
                showPrevImg();
            }

            if (event.key === 'ArrowRight') {
                showNextImg();
            }
        }
    })

    // Show image on click
    const closeBtn = document.getElementById("close");
    closeBtn.addEventListener("click", function () {
        lightboxDisplay('none');
    });
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

function disableScroll() {
    // Get the current scroll position
    const scrollY = window.scrollY;

    // Calculate the width of the scrollbar
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    // Add styles to the body to disable scrolling and account for scrollbar width
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
    document.body.style.paddingRight = `${scrollbarWidth}px`;
    document.body.style.top = `-${scrollY}px`;
}

function enableScroll() {
    // Retrieve the original scroll position
    const scrollY = parseInt(document.body.style.top, 10);

    // Remove the styles to enable scrolling
    document.body.style.overflow = '';
    document.body.style.position = '';
    document.body.style.width = '';
    document.body.style.paddingRight = '';
    document.body.style.top = '';

    // Scroll to the original position if a valid scroll position is available
    if (!isNaN(scrollY)) {
        window.scrollTo(0, Math.abs(scrollY)); // Ensure scroll position is non-negative
    }
}

//website observer setup for smooth ux
function setupIntersectionObserver() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
            }
        });
    });

    const hiddenElements = document.querySelectorAll('.hidden');
    hiddenElements.forEach((el) => observer.observe(el));
}

window.addEventListener('load', setupIntersectionObserver);