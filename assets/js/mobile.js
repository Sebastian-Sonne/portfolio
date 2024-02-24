const doc = document;
const menuOpen = doc.querySelector(".menu");
const menuClose = doc.querySelector(".close");
const overlay = doc.querySelector(".overlay");
const bioContent = doc.getElementById("bio-content");

menuOpen.addEventListener("click", () => {
  overlay.classList.add("overlay--active");
  //bioContent.style.display = "none";
  disableScroll();
});

menuClose.addEventListener("click", () => {
  overlay.classList.remove("overlay--active");
  enableScroll();
});

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