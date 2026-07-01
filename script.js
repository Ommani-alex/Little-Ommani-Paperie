document.addEventListener('DOMContentLoaded', () => {
  const newsletterForm = document.getElementById('newsletter-form');
  const newsletterNote = document.getElementById('newsletter-note');

  if (newsletterForm && newsletterNote) {
    newsletterForm.addEventListener('submit', (event) => {
      event.preventDefault();
      newsletterNote.textContent = 'Email signup is almost ready. Connect this form to your email service before launch.';
    });
  }
});
