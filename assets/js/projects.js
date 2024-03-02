const frame = document.getElementById('project-iframe');
const theme = localStorage.getItem('theme');

frame.src = `http://sebastian-sonne.com?theme=${theme}`;