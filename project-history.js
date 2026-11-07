/* Project History photo viewer. The shared script.js remains unchanged. */
(() => {
  const dialog = document.getElementById('historyLightbox');

  // Without native dialog support, photo links still open their original files.
  if (!dialog || typeof dialog.showModal !== 'function') return;

  const image = document.getElementById('historyLightboxImage');
  const title = document.getElementById('historyLightboxTitle');
  const caption = document.getElementById('historyLightboxCaption');
  const counter = document.getElementById('historyLightboxCounter');
  const error = document.getElementById('historyLightboxError');
  const closeButton = document.getElementById('historyLightboxClose');
  const previousButton = document.getElementById('historyLightboxPrevious');
  const nextButton = document.getElementById('historyLightboxNext');

  let photos = [];
  let currentIndex = 0;
  let openingLink = null;
  let previousOverflow = '';

  function restorePage() {
    document.body.style.overflow = previousOverflow;
    if (openingLink) openingLink.focus({ preventScroll: true });
  }

  function closeViewer() {
    dialog.close();
    restorePage();
  }

  // Display the full original image, with no cropping in the viewer.
  function showPhoto(index) {
    currentIndex = (index + photos.length) % photos.length;
    const link = photos[currentIndex];
    const thumbnail = link.querySelector('img');

    error.hidden = true;
    image.hidden = false;
    image.alt = thumbnail.alt;
    image.src = link.href;
    caption.textContent = thumbnail.alt;
    counter.textContent = `${currentIndex + 1} / ${photos.length}`;
    previousButton.disabled = photos.length < 2;
    nextButton.disabled = photos.length < 2;
  }

  // Keep navigation within the project that the visitor opened.
  document.querySelectorAll('[data-project-gallery]').forEach((gallery) => {
    const links = Array.from(gallery.querySelectorAll('.history-photo'));

    links.forEach((link, index) => {
      link.addEventListener('click', (event) => {
        if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;

        event.preventDefault();
        openingLink = link;
        photos = links;
        title.textContent = gallery.closest('.history-project').dataset.projectName;
        showPhoto(index);

        previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        dialog.showModal();
        closeButton.focus();
      });
    });
  });

  closeButton.addEventListener('click', closeViewer);
  previousButton.addEventListener('click', () => showPhoto(currentIndex - 1));
  nextButton.addEventListener('click', () => showPhoto(currentIndex + 1));

  // Restore page scrolling immediately when Escape closes the native dialog.
  dialog.addEventListener('cancel', (event) => {
    event.preventDefault();
    closeViewer();
  });

  // Arrow keys browse this album.
  dialog.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      showPhoto(currentIndex - 1);
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      showPhoto(currentIndex + 1);
    }
  });

  // Close when the visitor clicks outside the dialog panel.
  dialog.addEventListener('click', (event) => {
    if (event.target !== dialog) return;
    const bounds = dialog.getBoundingClientRect();
    const outsidePanel = event.clientX < bounds.left || event.clientX > bounds.right ||
      event.clientY < bounds.top || event.clientY > bounds.bottom;
    if (outsidePanel) closeViewer();
  });

  dialog.addEventListener('close', () => {
    // An earlier close event may arrive after another album has opened.
    if (!dialog.open) restorePage();
  });

  image.addEventListener('error', () => {
    image.hidden = true;
    error.hidden = false;
  });
})();
