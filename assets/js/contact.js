function submitForm() {
    var element = document.getElementById("form-submit");
    element.style.width = "100%";
    element.style.transform = "skew(0deg)"

    var content = document.getElementById("contact-form");
    content.style.transition = "display 0.3s ease";
    content.style.display = "none";
}