function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';

    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);

    //update logo
    const logoImg = document.querySelector('.logo img');
    logoImg.src = newTheme === 'light' ? '/img/logo_light.png' : '/img/logo_dark.png';

    // Update the icon
    const themeIcon = document.getElementById('theme-icon');
    themeIcon.textContent = newTheme === 'light' ? 'light_mode' : 'dark_mode';
}

// Set initial theme and icon
document.addEventListener('DOMContentLoaded', (event) => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    const themeIcon = document.getElementById('theme-icon');
    themeIcon.textContent = savedTheme === 'light' ? 'light_mode' : 'dark_mode';
});
