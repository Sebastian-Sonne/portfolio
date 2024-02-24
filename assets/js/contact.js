function adjustBackgroundHeight() {
  const contentContainer = document.querySelector('.contact-content-container');
  const backgroundContainer = document.querySelectorAll('.contact-background-container');

  if (!contentContainer) return;

  for (let i = 0; i < backgroundContainer.length; i++) {
    const contentHeight = contentContainer.offsetHeight;
    backgroundContainer[i].style.height = `${contentHeight}px`;
  }
}

window.onload = adjustBackgroundHeight;
window.onresize = adjustBackgroundHeight;

//form submission
document.getElementById('contact-form').addEventListener('submit', function (e) {
  e.preventDefault();
  // Start simulating the form submission progress

  // Get the form data
  var formData = new FormData(this);

  // Send a POST request to Formspree
  fetch(this.action, {
    method: this.method,
    body: formData,
    headers: {
      'Accept': 'application/json'
    }
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      window.location.href = window.location.origin + '/success';
    })
    .catch(error => {
      // Handle errors
      console.error('There was an error!', error);
      alert('An error occurred. Please try again.');
    });

});