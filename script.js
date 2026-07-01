document.addEventListener('DOMContentLoaded', () => {
  const mainImage = document.getElementById('main-product-image');
  const thumbs = document.querySelectorAll('[data-gallery-key]');
  const galleryImages = window.productGalleryImages || {};

  function selectGalleryImage(thumb) {
    if (!mainImage) return;
    const image = galleryImages[thumb.dataset.galleryKey];
    if (!image) return;
    mainImage.src = image;
    mainImage.alt = thumb.dataset.galleryAlt || '';
    thumbs.forEach((item) => item.classList.remove('is-active'));
    thumb.classList.add('is-active');
  }

  thumbs.forEach((thumb) => thumb.addEventListener('click', () => selectGalleryImage(thumb)));
  if (thumbs.length) selectGalleryImage(thumbs[0]);

  const newsletterForm = document.getElementById('newsletter-form');
  const newsletterNote = document.getElementById('newsletter-note');
  if (newsletterForm && newsletterNote) {
    newsletterForm.addEventListener('submit', (event) => {
      event.preventDefault();
      newsletterNote.textContent = 'Email signup is almost ready. Connect this form to your email service before launch.';
    });
  }
});
