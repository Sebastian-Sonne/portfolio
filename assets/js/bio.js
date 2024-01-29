document.addEventListener("DOMContentLoaded", function () {
    const slider = document.querySelector(".slider");
  
    // Replace these image URLs with your own
    const images = [
      "image1.jpg",
      "image2.jpg",
      "image3.jpg",
      // Add more image URLs as needed
    ];
  
    images.forEach((imageUrl) => {
      const img = document.createElement("img");
      img.src = imageUrl;
      slider.appendChild(img);
    });
  });