document.addEventListener('DOMContentLoaded', () => {
    // --- MOBILE MENU TOGGLE ---
    const menuButton = document.getElementById('menuButton');
    const mobileNav = document.getElementById('mobileNav');

    if (menuButton && mobileNav) {
        menuButton.addEventListener('click', () => {
            // Check if the menu is currently hidden
            const isHidden = mobileNav.hasAttribute('hidden');
            
            if (isHidden) {
                mobileNav.removeAttribute('hidden');
                menuButton.setAttribute('aria-expanded', 'true');
                menuButton.innerText = '✕'; // Change to close icon
            } else {
                mobileNav.setAttribute('hidden', '');
                menuButton.setAttribute('aria-expanded', 'false');
                menuButton.innerText = '☰'; // Change back to hamburger icon
            }
        });
    }
});
