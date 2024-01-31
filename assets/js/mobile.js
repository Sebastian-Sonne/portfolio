const doc = document;
const menuOpen = doc.querySelector(".menu");
const menuClose = doc.querySelector(".close");
const overlay = doc.querySelector(".overlay");
const bioContent = doc.getElementById("#bio-content");

menuOpen.addEventListener("click", () => {
  overlay.classList.add("overlay--active");
  bioContent.style.display = "none";
});

menuClose.addEventListener("click", () => {
  overlay.classList.remove("overlay--active");
});
