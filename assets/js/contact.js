function adjustBackgroundHeight() {
  const contentContainer = document.querySelector('.contact-content-container');
  const backgroundContainer = document.querySelector('.contact-background-container');

  if (contentContainer && backgroundContainer) {
    const contentHeight = contentContainer.offsetHeight;
    backgroundContainer.style.height = `${contentHeight}px`;
  }
}

window.onload = adjustBackgroundHeight;
window.onresize = adjustBackgroundHeight;

//form submission
document.getElementById('contact-form').addEventListener('submit', function (e) {
  e.preventDefault();
  // Start simulating the form submission progress
  simulateFormSubmission(() => {
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
});