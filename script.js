const menuButton = document.getElementById('menuButton');
const navLinks = document.getElementById('navLinks');

if (menuButton && navLinks) {
  menuButton.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', String(isOpen));
    menuButton.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
  });

  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      menuButton.setAttribute('aria-expanded', 'false');
      menuButton.setAttribute('aria-label', 'Open navigation menu');
    });
  });
}

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && navLinks?.classList.contains('open')) {
    navLinks.classList.remove('open');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Open navigation menu');
    menuButton.focus();
  }
});

// Current copyright year.
const currentYear = document.getElementById('currentYear');
if (currentYear) currentYear.textContent = new Date().getFullYear();

// Content stays readable if scroll observation is unavailable.
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });
  document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));
} else {
  document.querySelectorAll('.reveal').forEach((element) => element.classList.add('visible'));
}

// Local assets are used first. If a photo is not in /assets yet,
// show a branded placeholder instead of a broken-image icon.
function fallbackSvg(label) {
  const safeLabel = String(label || 'SWAM YEE').replace(/[<>&]/g, '');
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800" viewBox="0 0 1200 800">
      <defs>
        <linearGradient id="g" x1="0" x2="1">
          <stop offset="0" stop-color="#083f70"/>
          <stop offset="1" stop-color="#0d67ad"/>
        </linearGradient>
      </defs>
      <rect width="1200" height="800" fill="url(#g)"/>
      <circle cx="960" cy="150" r="190" fill="rgba(255,255,255,0.08)"/>
      <circle cx="1070" cy="650" r="270" fill="rgba(255,255,255,0.05)"/>
      <text x="80" y="380" fill="#ffffff" font-size="54" font-family="Arial, sans-serif" font-weight="700">${safeLabel}</text>
      <text x="80" y="450" fill="#cfeaff" font-size="28" font-family="Arial, sans-serif">Engineering services in Myanmar</text>
    </svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

document.querySelectorAll('img.asset-photo').forEach((img) => {
  img.addEventListener('error', () => {
    if (img.dataset.fallbackApplied === 'true') return;
    img.dataset.fallbackApplied = 'true';
    img.src = fallbackSvg(img.dataset.fallback || img.alt);
  });
});

// Certificate preview modal.
const modal = document.getElementById('imageModal');
const modalImage = document.getElementById('modalImage');
const modalTitle = document.getElementById('modalTitle');
const modalClose = document.getElementById('modalClose');
let modalOpener = null;
let previousOverflow = '';
if (modal) {
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.setAttribute('aria-labelledby', 'modalTitle');
}

function closeModal() {
  if (!modal || !modal.classList.contains('open')) return;
  document.body.style.overflow = previousOverflow;
  modalOpener?.focus({ preventScroll: true });
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
}

document.querySelectorAll('[data-modal-image]').forEach((button) => {
  button.addEventListener('click', () => {
    if (!modal || !modalImage || !modalTitle) return;
    const imagePath = button.dataset.modalImage;
    const sourceImage = button.querySelector('img');
    modalOpener = button;
    previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    modalImage.src = sourceImage && sourceImage.complete && sourceImage.naturalWidth ? sourceImage.src : imagePath;
    modalImage.alt = sourceImage?.alt || button.dataset.modalTitle || 'Image preview';
    modalTitle.textContent = button.dataset.modalTitle || 'Certificate';
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    modalClose?.focus();
  });
});

if (modalClose) modalClose.addEventListener('click', closeModal);
if (modal) {
  modal.addEventListener('click', (event) => {
    if (event.target === modal) closeModal();
  });
}

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeModal();
  if (event.key === 'Tab' && modal?.classList.contains('open')) {
    event.preventDefault();
    modalClose?.focus();
  }
});
// BACK TO TOP
document.querySelectorAll('a[href="#top"]').forEach((link) => {
  link.addEventListener("click", function (event) {
    event.preventDefault();

    window.scrollTo({
      top: 0,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth"
    });
  });
});