function submitForm() {
    var content = document.getElementById("contact-main-content");
    content.style.transition = "display 0.3s ease";
    content.style.display = "none";

    sleep(2000).then(() => {window.location.href = window.location.origin + '/'});
}


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}