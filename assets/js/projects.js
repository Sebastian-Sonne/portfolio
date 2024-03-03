const frame = document.getElementById('project-iframe');
const theme = localStorage.getItem('theme');

frame.src = `https://sebastian-sonne.com?theme=${theme}`;