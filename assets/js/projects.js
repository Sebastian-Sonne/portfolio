const frame = document.getElementById('project-iframe');
const theme = localStorage.getItem('theme');

frame.src = `http://127.0.0.1:5501?theme=${theme}`;