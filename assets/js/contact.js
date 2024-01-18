function submitForm() {
    var element = document.getElementById("form-submit");
    element.style.width = "100%";
    element.style.transform = "skew(0deg)"

    var content = document.getElementById("contact-main-content");
    content.style.transition = "display 0.3s ease";
    content.style.display = "none";

    DelayNode

    sleep(2000).then(() => {window.location.href = window.location.origin + '/'});
}


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}