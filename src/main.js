const menuToggle = document.querySelector('[data-menu-toggle]');
const menu = document.querySelector('[data-menu]');

if (menuToggle && menu) {
  menuToggle.addEventListener('click', () => {
    const isOpen = !menu.classList.contains('hidden');
    menu.classList.toggle('hidden', isOpen);
    menuToggle.setAttribute('aria-expanded', String(!isOpen));
  });

  menu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      menu.classList.add('hidden');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

document.querySelectorAll('[data-count]').forEach((counter) => {
  const target = Number(counter.getAttribute('data-count'));
  const suffix = counter.getAttribute('data-suffix') ?? '';

  if (!Number.isFinite(target)) return;

  const animate = () => {
    const start = performance.now();
    const duration = 1400;

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      counter.textContent = `${Math.round(target * eased).toLocaleString()}${suffix}`;

      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  };

  const observer = new IntersectionObserver(
    ([entry]) => {
      if (!entry?.isIntersecting) return;
      animate();
      observer.disconnect();
    },
    { threshold: 0.4 },
  );

  observer.observe(counter);
});

const estimator = document.querySelector('[data-estimator]');

if (estimator) {
  estimator.addEventListener('submit', (event) => {
    event.preventDefault();

    const area = Number(estimator.querySelector('[data-area]')?.value);
    const floors = Number(estimator.querySelector('[data-floors]')?.value);
    const rate = Number(estimator.querySelector('[data-type]')?.value);
    const result = estimator.querySelector('[data-result]');

    if (!area || !floors || !rate || !result) return;

    const low = area * floors * rate;
    const high = low * 1.18;
    const formatter = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    });

    result.textContent = `Estimated range: ${formatter.format(low)} - ${formatter.format(high)}.`;
    result.classList.remove('hidden');
  });
}

document.querySelectorAll('[data-filter-group]').forEach((group) => {
  const buttons = group.querySelectorAll('[data-filter]');
  const items = group.querySelectorAll('[data-category]');

  if (!buttons.length || !items.length) return;

  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      const filter = button.getAttribute('data-filter');

      buttons.forEach((btn) => {
        const isActive = btn === button;
        btn.classList.toggle('bg-amber-400', isActive);
        btn.classList.toggle('text-slate-950', isActive);
        btn.classList.toggle('shadow-sm', isActive);
        btn.classList.toggle('hover:bg-amber-300', isActive);
        btn.classList.toggle('border', !isActive);
        btn.classList.toggle('border-slate-300', !isActive);
        btn.classList.toggle('text-slate-700', !isActive);
        btn.classList.toggle('hover:border-amber-500', !isActive);
        btn.classList.toggle('hover:text-amber-700', !isActive);
      });

      items.forEach((item) => {
        const category = item.getAttribute('data-category');
        item.classList.toggle('hidden', filter !== 'all' && category !== filter);
      });
    });
  });
});

const lightbox = document.querySelector('[data-lightbox-overlay]');
const lightboxImage = lightbox?.querySelector('img');

document.querySelectorAll('[data-lightbox-trigger]').forEach((trigger) => {
  trigger.addEventListener('click', () => {
    const src = trigger.getAttribute('data-lightbox');
    const alt = trigger.querySelector('img')?.getAttribute('alt') ?? 'Gallery Image';
    if (!lightbox || !lightboxImage || !src) return;

    lightboxImage.src = src;
    lightboxImage.alt = alt;
    lightbox.classList.remove('hidden');
    lightbox.classList.add('flex');
    document.body.style.overflow = 'hidden';
  });
});

const closeLightbox = () => {
  if (!lightbox) return;
  lightbox.classList.add('hidden');
  lightbox.classList.remove('flex');
  document.body.style.overflow = '';
};

lightbox?.querySelector('[data-lightbox-close]')?.addEventListener('click', closeLightbox);
lightbox?.addEventListener('click', (event) => {
  if (event.target === lightbox) closeLightbox();
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeLightbox();
});

const toast = document.createElement('div');
toast.className =
  'pointer-events-none fixed inset-x-0 bottom-6 z-[80] flex justify-center px-4 transition-opacity duration-300';
toast.classList.add('opacity-0');
document.body.appendChild(toast);

const toastMessage = document.createElement('p');
toastMessage.className = 'rounded-lg bg-slate-950 px-5 py-3 text-sm font-semibold text-white shadow-xl';
toast.appendChild(toastMessage);

let toastTimer;
const showToast = (message) => {
  toastMessage.textContent = message;
  toast.classList.remove('opacity-0');
  toast.classList.add('opacity-100');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove('opacity-100');
    toast.classList.add('opacity-0');
  }, 2800);
};

document.querySelectorAll('[data-brochure-download]').forEach((button) => {
  button.addEventListener('click', (event) => {
    event.preventDefault();
    showToast('Thank you! The brochure download will begin shortly. (Demo)');
  });
});

document.querySelectorAll('[data-contact-form]').forEach((form) => {
  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const success = form.querySelector('[data-contact-success]');
    if (success) {
      success.classList.remove('hidden');
      success.classList.add('block');
    }
    form.reset();
  });
});

const openModal = (overlay) => {
  if (!overlay) return;
  overlay.classList.remove('hidden');
  overlay.classList.add('flex');
  document.body.style.overflow = 'hidden';
};

const closeModal = (overlay) => {
  if (!overlay) return;
  overlay.classList.add('hidden');
  overlay.classList.remove('flex');
  document.body.style.overflow = '';
};

document.querySelectorAll('[data-modal]').forEach((trigger) => {
  trigger.addEventListener('click', (event) => {
    event.preventDefault();
    openModal(document.getElementById(trigger.getAttribute('data-modal')));
  });
});

document.querySelectorAll('[data-modal-close]').forEach((button) => {
  button.addEventListener('click', () => {
    closeModal(button.closest('[data-modal-overlay]'));
  });
});

document.querySelectorAll('[data-modal-overlay]').forEach((overlay) => {
  overlay.addEventListener('click', (event) => {
    if (event.target === overlay) closeModal(overlay);
  });
});

document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape') return;
  document.querySelectorAll('[data-modal-overlay]:not(.hidden)').forEach(closeModal);
});

document.querySelectorAll('[data-site-visit-form]').forEach((form) => {
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    closeModal(form.closest('[data-modal-overlay]'));
    form.reset();
    showToast('Site visit request submitted successfully! Our team will contact you shortly. (Demo)');
  });
});
