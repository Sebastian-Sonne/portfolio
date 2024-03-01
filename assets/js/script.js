function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';

    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);

    //update logo
    const logoImg = document.querySelector('.logo img');
    if (logoImg != null) { //* Precaution for projects page
        logoImg.src = newTheme === 'light' ? '/img/logo_light.png' : '/img/logo_dark.png';
    }

    // Update the icon
    const themeIcon = document.getElementById('theme-icon');
    themeIcon.textContent = newTheme === 'light' ? 'light_mode' : 'dark_mode';
}

function checkUrlForTheme() {
    const urlParams = new URLSearchParams(window.location.search);
    const theme = urlParams.get('theme');
    const url = new URL(window.location.href);

    if (theme == 'light') {
        removeThemeFromUrl(urlParams);    
        return 'light';
    } else if (theme == 'dark') {
        removeThemeFromUrl(urlParams);    
        return 'dark';
    }

    removeThemeFromUrl(urlParams);
    return null;
}

function removeThemeFromUrl(urlParams) {
    urlParams.delete('theme');

    let newUrl = window.location.pathname;
    if (urlParams.toString() !== '') {
        newUrl += '?' + urlParams.toString();
    }

    history.replaceState(null, '', newUrl);
}

// Set initial theme and icon
document.addEventListener('DOMContentLoaded', (event) => {
    const urlTheme = checkUrlForTheme();
    let savedTheme;

    if (urlTheme != null) {
        savedTheme = urlTheme;
        document.documentElement.setAttribute('data-theme', urlTheme);
        localStorage.setItem('theme', urlTheme);
    } else {
        savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
    }

    const themeIcon = document.getElementById('theme-icon');
    themeIcon.textContent = savedTheme === 'light' ? 'light_mode' : 'dark_mode';

    const logoImg = document.querySelector('.logo img');
    if (logoImg != null) { //* Precaution for projects page
        logoImg.src = savedTheme === 'light' ? '/img/logo_light.png' : '/img/logo_dark.png';
    }
});