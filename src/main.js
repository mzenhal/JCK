const menuToggle = document.querySelector('[data-menu-toggle]');
const menu = document.querySelector('[data-menu]');
const siteHeader = document.querySelector('[data-site-header]');

if (siteHeader) {
  const updateHeader = () => {
    siteHeader.classList.toggle('is-scrolled', window.scrollY > 24);
  };

  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });
}

if (menuToggle && menu) {
  menuToggle.addEventListener('click', () => {
    const isOpen = !menu.classList.contains('hidden');
    menu.classList.toggle('hidden', isOpen);
    menuToggle.setAttribute('aria-expanded', String(!isOpen));
    siteHeader?.classList.toggle('is-open', !isOpen);
  });

  menu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      menu.classList.add('hidden');
      menuToggle.setAttribute('aria-expanded', 'false');
      siteHeader?.classList.remove('is-open');
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
