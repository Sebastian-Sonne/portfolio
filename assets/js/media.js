let imgData;
let dataRevieved = false;

//load images from json file and //TODO handle errors
async function fetchImgData() {
    try {
        const response = await fetch('/assets/json/imgData.json');
        if (!response.ok) {
            throw new Error('failed to load imgData.json');
        }
        const data = await response.json();
        //store image Data in global variable
        dataRevieved = true;
        imgData = data;
        return data;
    } catch (error) {
        console.log('Error fetching image Data:' + error);
        return await Promise.reject(error);
    }
}

//image category selection
document.addEventListener("DOMContentLoaded", function () {
    const categoryNav = document.getElementById("media-nav");
    const imageContainer = document.getElementById("media-grid");
    let previousElement = null;

    //category nav event listener
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
        const currCategoryLenght = Object.keys(imgData[currCategory]).length;
        let prevImgIndex = (currImgIndex - 1 + currCategoryLenght) % currCategoryLenght;
        if (prevImgIndex == 0) prevImgIndex = currCategoryLenght;
        updateLightboxImage(prevImgIndex);

        setTimeout(() => {
            navigationActive = true;
        }, 250);
    }

    //switches the current lighbox image with the one on the right of it
    function showNextImg() {
        const currCategory = getCategoryFromUrl();
        const currImgIndex = getCurrentImageIndex(currCategory);
        const currCategoryLenght = Object.keys(imgData[currCategory]).length;
        let nextImgIndex = (currImgIndex + 1 + currCategoryLenght) % currCategoryLenght;
        if (nextImgIndex == 0) nextImgIndex = currCategoryLenght;
        updateLightboxImage(nextImgIndex);

        setTimeout(() => {
            navigationActive = true;
        }, 250);
    }

    // Function to get the index of the currently displayed image
    function getCurrentImageIndex() {
        const category = getCategoryFromUrl();
        const pattern = /\/img\/media\/.*\/\w+_img_(\d+)\.jpg/;
        const url = document.getElementById("lightbox-img").src;
        const match = pattern.exec(url);
        return parseInt(match[1]);
    }

    //update the lighbox image
    function updateLightboxImage(index) {
        const category = getCategoryFromUrl();
        const url = `img/media/${category}/${category}_img_${index}.jpg`;
        const lighboxImg = document.getElementById('lightbox-img');

        setLighboxData(index);
        lighboxImg.src = url;
    }

    //sets the location and date for the user in the lighbox
    function setLighboxData(index) {
        const lighboxLocation = document.getElementById('lighbox-h1');
        const lighboxDate = document.getElementById('lightbox-date');
        const category = getCategoryFromUrl();

        const imgDescription = imgData[category][`${category}_img_${index}.jpg`].location;
        const imgDate = imgData[category][`${category}_img_${index}.jpg`].date;

        lighboxLocation.innerHTML = imgDescription;
        lighboxDate.innerHTML = imgDate;
    }

    //update images depending on category. If json data has not been loaded, it will be loaded
    function updateImages(category) {
        if (dataRevieved == false) {
            fetchImgData()
                .then(data => {
                    updateImagesSetup(data, category);
                })
                .catch(error => {
                    //alert user in case of error
                    alert('Failed to load Images. Try reloading this site.\nIf this issue persists, please contact \"hello@sebastian-sonne.com\" and include the following error Message.\nError Message: ' + error);
                    console.log('Error: ' + error);
                });
        } else {
            updateImagesSetup(imgData, category);
        }
    }

    //udate images depending if json file has already been loaded -> see updateImages()
    function updateImagesSetup(data, category) {
        //check for data being null
        if (data == null) {
            if (imgData == null) {
                fetchImgData();
            }
        }

        // Clear previous images
        imageContainer.innerHTML = "";

        //get image objects from category
        const images = data[category];
        for (const keys in images) {
            const key = images[keys];
            const imgElement = document.createElement("img");

            //setup image element
            imgElement.src = key.url;
            imgElement.classList.add('thumbnail');
            if (key.class != null) imgElement.classList.add(key.class);
            imgElement.classList.add('hidden');
            imgElement.setAttribute('alt', key.alt);

            // Add a click event listener to the image element
            imgElement.addEventListener('click', function () {
                document.getElementById("lightbox-img").src = this.src;
                setLighboxData(getCurrentImageIndex());
                lightboxDisplay('flex');
            });

            // Append the image element to the image container
            imageContainer.appendChild(imgElement);
        }
        setupIntersectionObserver();
    }

    //sets the image layout according to the screen dimensions
    function setImageLayout() {
        //! TODO
    }

    //sets url-param "category" to the category parameter
    function updateURL(category) {
        const urlParams = new URLSearchParams(window.location.search);
        urlParams.set("category", category);
        const newUrl = window.location.pathname + '?' + urlParams.toString();
        window.history.pushState({ path: newUrl }, '', newUrl);
    }

    // Function to get category from URL parameter
    function getCategoryFromUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('category') || 'fav';
    }

    // Initial load of images based on category from URL parameter
    const initialCategory = getCategoryFromUrl();
    const initialNavItem = categoryNav.querySelector(`[data-category="${initialCategory}"]`);
    const invalidCategoryDiv = document.getElementById('media-invalid-category');

    if (checkCategory(initialCategory)) {
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
function checkCategory(category) {
    const validCategories = ['fav', 'nature', 'mountain', 'city', 'cars', 'sunset']; //* Define valid categories
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