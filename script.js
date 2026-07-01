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
// --- PRODUCT MODAL LOGIC ---
const modal = document.getElementById('productModal');
const backdrop = document.getElementById('modalBackdrop');
const closeBtn = document.getElementById('modalClose');

// Function to open modal and inject the right product data
function openModal(title, price, imageSrc, description, id, tag) {
    // Fill in the visual text/images
    document.getElementById('modalTitle').innerText = title;
    document.getElementById('modalPrice').innerText = price;
    document.getElementById('modalImage').src = imageSrc;
    document.getElementById('modalDescription').innerText = description;
    document.getElementById('modalTag').innerText = tag;

    // Update the Snipcart button data attributes
    const buyBtn = document.getElementById('modalBuyBtn');
    buyBtn.setAttribute('data-item-id', id);
    buyBtn.setAttribute('data-item-price', price);
    buyBtn.setAttribute('data-item-name', title);
    buyBtn.setAttribute('data-item-image', imageSrc);
    buyBtn.setAttribute('data-item-description', description);

    // Show the modal
    modal.removeAttribute('hidden');
}

// Functions to close the modal
function closeModal() {
    modal.setAttribute('hidden', '');
}

if (closeBtn && backdrop) {
    closeBtn.addEventListener('click', closeModal);
    backdrop.addEventListener('click', closeModal); // Closes if they click the dark background
}
