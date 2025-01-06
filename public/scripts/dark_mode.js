const darkModeToggle = document.getElementById('DarkMode');
const darkModeIcon = darkModeToggle.querySelector('.material-symbols-outlined');

if (localStorage.getItem('darkMode') === 'enabled') {
    document.body.classList.add('dark');
    darkModeIcon.textContent = 'light_mode';
} else {
    document.body.classList.remove('dark');
    darkModeIcon.textContent = 'dark_mode';
}

darkModeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark'); 
    if (document.body.classList.contains('dark')) {
        darkModeIcon.textContent = 'light_mode';
        localStorage.setItem('darkMode', 'enabled');
    } else {
        darkModeIcon.textContent = 'dark_mode';
        localStorage.setItem('darkMode', 'disabled');
    }
});
