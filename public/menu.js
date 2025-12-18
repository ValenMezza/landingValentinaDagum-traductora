document.addEventListener("DOMContentLoaded", () => {
    const toggle = document.querySelector('.nav__toggle');
    const navList = document.querySelector('.nav__list');
    const navLinks = document.querySelectorAll('.nav__link');

    // Abrir/cerrar menú
    toggle.addEventListener('click', () => {
        const isOpen = navList.classList.toggle('nav__list--open');
        toggle.classList.toggle('nav__toggle--open', isOpen);
        toggle.setAttribute('aria-expanded', isOpen);
    });

    // Cerrar menú al hacer click en un enlace
    navLinks.forEach(link => {
        link.addEventListener("click", () => {
            navList.classList.remove('nav__list--open');
            toggle.classList.remove('nav__toggle--open');
            toggle.setAttribute('aria-expanded', "false");
        });
    });
});
