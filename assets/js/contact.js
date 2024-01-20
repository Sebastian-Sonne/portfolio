function submitForm() {
    var content = document.getElementById("contact-main-content");
    content.style.transition = "display 0.3s ease";
    content.style.display = "none";

    sleep(2000).then(() => {window.location.href = window.location.origin + '/'});
}


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function adjustBackgroundHeight() {
    const contentContainer = document.querySelector('.contact-content-container');
    const backgroundContainer = document.querySelector('.contact-background-container');

    if (contentContainer && backgroundContainer) {
        const contentHeight = contentContainer.offsetHeight;
        backgroundContainer.style.height = `${contentHeight}px`;
    }
}

// Run the function on load
window.onload = adjustBackgroundHeight;

// Optionally, run the function on window resize if the content might change height responsively
window.onresize = adjustBackgroundHeight;