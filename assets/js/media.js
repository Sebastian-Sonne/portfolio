let imgData; //img Data for all images, as Json file
let dataRevieved = false; //validation for recieving of image data, to prevent unnesecairy fetching of data
let currLayout = getLayout(); //used for amount of grid cols available

//load images from json file
async function fetchImgData() {
    try {
        const response = await fetch('/assets/json/imgData.json');
        if (!response.ok) {
            throw new Error('failed to fetch and load imgData.json');
        }
        const data = await response.json();
        //store image Data in global variable
        dataRevieved = true;
        imgData = data;
        return data;
    } catch (error) {
        alert('Failed to load Images. Try reloading this site.\nIf this issue persists, please contact \"hello@sebastian-sonne.com\" and include the following error Message.\nError Message: ' + error);
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

    //lighbox nav left button event listener
    const prevBtn = document.getElementById("media-nav-arrow-left");
    prevBtn.addEventListener('click', function () {
        if (lightbox.style.display === 'flex') {
            showPrevImg();
        }
    });

    //lighbox nav right button event listener
    const nextBtn = document.getElementById("media-nav-arrow-right");
    nextBtn.addEventListener('click', function () {
        if (lightbox.style.display === 'flex') {
            showNextImg();
        }
    });

    //update the lighbox image
    function updateLightboxImage(imgKey) {
        const category = getCategoryFromUrl();
        const newImgData = imgData[category][imgKey];
        const lighboxImg = document.getElementById('lightbox-img');

        //set lighbox url
        lighboxImg.src = "";
        lighboxImg.src = newImgData.url;
        setLighboxData(imgKey);
    }

    // Function to navigate to the previous image
    function showPrevImg() {
        const category = getCategoryFromUrl();
        const currIndex = getCurrentImageIndex();
        const keys = Object.keys(imgData[category]);
        const newIndex = (currIndex - 1 + keys.length) % keys.length;

        //update lightbox image with appropriate url
        updateLightboxImage(keys[newIndex]);

        setTimeout(() => {
            navigationActive = true;
        }, 100);
    }

    // Function to navigate to the next image
    function showNextImg() {
        const category = getCategoryFromUrl();
        const currIndex = getCurrentImageIndex();
        const keys = Object.keys(imgData[category]);
        const newIndex = (currIndex + 1 + keys.length) % keys.length;

        //update lightbox image with appropriate url
        updateLightboxImage(keys[newIndex]);

        setTimeout(() => {
            navigationActive = true;
        }, 100);
    }

    function getCurrentImageKey() {
        const category = getCategoryFromUrl();
        const currIndex = getCurrentImageIndex();
        const keys = Object.keys(imgData[category]);

        return keys[currIndex];
    }

    // Function to get the index of the currently displayed image
    function getCurrentImageIndex() {
        //get image key of current image
        const url = document.getElementById("lightbox-img").src;
        const imageKey = url.split('/').pop(); // Extracting the image filename

        //get all keys of current category
        const category = getCategoryFromUrl();
        const keys = Object.keys(imgData[category]);

        //return the index of current image key in all keys
        return keys.indexOf(imageKey);
    }

    //sets the location and date for the user in the lighbox
    function setLighboxData(imgKey) {
        //img Data
        const category = getCategoryFromUrl();
        const imageData = imgData[category][imgKey];

        //lighbox Elements
        const lighboxLocation = document.getElementById('lighbox-h1');
        const lighboxDate = document.getElementById('lightbox-date');

        lighboxLocation.textContent = imageData.location;
        lighboxDate.textContent = imageData.date;
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
        const classes = getLayout();
        const images = data[category];

        for (const keys in images) {
            const key = images[keys];
            const imgElement = document.createElement("img");
            const imgLayout = key.layout[classes];

            //setup image element
            imgElement.src = key.url;
            imgElement.loading = 'lazy';
            imgElement.classList.add('thumbnail');
            imgElement.classList.add('hidden');
            //add layout class(es) to image
            if (imgLayout != null) {
                const layoutClasses = imgLayout.split(' '); //if multiple, than split classes
                imgElement.classList.add(...layoutClasses);
            }
            imgElement.setAttribute('alt', key.alt);

            // Add a click event listener to the image element
            imgElement.addEventListener('click', function () {
                document.getElementById("lightbox-img").src = this.src;
                setLighboxData(getCurrentImageKey());
                lightboxDisplay('flex');
            });

            // Append the image element to the image container
            imageContainer.appendChild(imgElement);
        }
        setupIntersectionObserver();
    }

    //sets url-param "category" to the category parameter
    function updateURL(category) {
        const urlParams = new URLSearchParams(window.location.search);
        urlParams.set("category", category);
        const newUrl = window.location.pathname + '?' + urlParams.toString();
        window.history.pushState({ path: newUrl }, '', newUrl);
    }

    //set nav category based on url parameter
    function setNavCategory(initialCategory) {
        const initialNavItem = categoryNav.querySelector(`[data-category="${initialCategory}"]`);
        const invalidCategoryDiv = document.getElementById('media-invalid-category');

        if (checkCategory(initialCategory)) {
            if (initialNavItem) {
                if (previousElement != null) {
                    previousElement.style.backgroundColor = 'unset';
                    previousElement.classList.remove('media-li-active');
                }
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
    }

    // Initial load of images based on category from URL parameter
    setNavCategory(getCategoryFromUrl());

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

    //listens for user navigation using browser arrows
    window.addEventListener('popstate', function (event) {
        const category = getCategoryFromUrl();
        if (category) {
            setNavCategory(category);
            updateImages(category);
        }
    });

    // Show image on click
    const closeBtn = document.getElementById("close");
    closeBtn.addEventListener("click", function () {
        lightboxDisplay('none');
    });
});

//function to set the layout according to the current screen width
function updateLayout() {
    const newLayout = getLayout();
    if (currLayout == newLayout) return; //exit the function early if layout didnt change
    currLayout = newLayout; //change currLayout (global variable)


    const mediaGrid = document.getElementById('media-grid');
    const imgElements = mediaGrid.childNodes;

    //get image data for category
    const images = imgData[getCategoryFromUrl()];

    //iterate over all image elements in the current category
    for (let i = 0; i < imgElements.length; i++) {
        const imgElement = imgElements[i];
        const imgName = getFilenameFromURL(imgElement.src);
        const imgClass = images[imgName].layout[newLayout];

        // remove old layout classes -> convert to array 
        Array.from(imgElement.classList).forEach(function (className) {
            if (className.startsWith('grid-col-') || className.startsWith('grid-row-') || className.startsWith('display-none')) {
                // Remove the class from the class list
                imgElement.classList.remove(className);
            }
        });

        //add updated classes
        if (imgClass != null) {
            const layoutClasses = imgClass.split(' '); //if multiple, than split classes
            imgElement.classList.add(...layoutClasses);
        }
    }

}

//gets the current layout depending on screen layout; returns 'l' followed by the colum amout (1-4 possible)
function getLayout() {
    const vw = window.innerWidth;

    if (vw < 769) { //1 col visible
        return "l1";

    } else if (vw < 1101) { //2 col visible
        return "l2";

    } else if (vw < 1465) { //3 col visible
        return "l3";

    } else { // 4 col visible
        return "l4";
    }
}

// Function to extract filename from URL
function getFilenameFromURL(url) {
    var parts = url.split('/');

    var filename = parts[parts.length - 1];
    return filename;
}

// checks for valid category
function checkCategory(category) {
    const validCategories = ['fav', 'nature', 'mountain', 'city', 'cars', 'sunset']; //* Define valid categories
    if (validCategories.includes(category)) {
        return true;
    } else {
        return false;
    }
}

// Function to get category from URL parameter
function getCategoryFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('category') || 'fav';
}

//disables the possibility for the user to scroll wherever he is on the site
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

//enables the possibility for the user to scroll
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

//website observer setup for smooth ux -> images pop in when revealed by scrolling
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
window.addEventListener('resize', updateLayout);