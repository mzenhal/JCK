const menuToggle = document.querySelector('[data-menu-toggle]');
const menu = document.querySelector('[data-menu]');
const siteHeader = document.querySelector('[data-site-header]');

if (siteHeader) {
  const updateHeader = () => {
    const isActive = window.scrollY > 24 || siteHeader.dataset.menuOpen === 'true';
    siteHeader.classList.toggle('is-scrolled', window.scrollY > 24);
    siteHeader.dataset.state = isActive ? 'active' : '';
  };

  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  siteHeader.updateHeaderState = updateHeader;
}

if (menuToggle && menu) {
  menuToggle.addEventListener('click', () => {
    const isOpen = !menu.classList.contains('hidden');
    menu.classList.toggle('hidden', isOpen);
    menuToggle.setAttribute('aria-expanded', String(!isOpen));
    if (siteHeader) {
      siteHeader.dataset.menuOpen = String(!isOpen);
      siteHeader.updateHeaderState?.();
    }
  });

  menu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      menu.classList.add('hidden');
      menuToggle.setAttribute('aria-expanded', 'false');
      if (siteHeader) {
        siteHeader.dataset.menuOpen = 'false';
        siteHeader.updateHeaderState?.();
      }
    });
  });
}

const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
const animatedItems = [];

document.querySelectorAll('main > section').forEach((section) => {
  if (section.matches('[data-hero-carousel]')) return;

  section.setAttribute('data-animate-section', '');

  const contentRoot = section.querySelector(':scope > .mx-auto') ?? section;
  const items = [];

  Array.from(contentRoot.children).forEach((child) => {
    if (child.classList.contains('grid') && child.children.length > 1) {
      items.push(...Array.from(child.children));
      return;
    }

    items.push(child);
  });

  items.forEach((item, index) => {
    item.setAttribute('data-animate-item', '');
    item.style.setProperty('--animate-delay', `${index * 100}ms`);
    item.classList.add(
      'opacity-0',
      '-translate-y-6',
      'transition',
      'duration-700',
      'ease-[cubic-bezier(0.22,1,0.36,1)]',
      'will-change-transform',
    );
    animatedItems.push(item);
  });
});

if (animatedItems.length) {
  if (motionQuery.matches || !('IntersectionObserver' in window)) {
    animatedItems.forEach((item) => {
      item.classList.remove('opacity-0', '-translate-y-6');
      item.classList.add('opacity-100', 'translate-y-0');
    });
  } else {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          entry.target.classList.remove('opacity-0', '-translate-y-6');
          entry.target.classList.add('opacity-100', 'translate-y-0');
        });
      },
      {
        rootMargin: '0px 0px -8% 0px',
        threshold: 0.18,
      },
    );

    const resetObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) return;

          entry.target.classList.remove('opacity-100', 'translate-y-0');
          entry.target.classList.add('opacity-0', '-translate-y-6');
        });
      },
      {
        rootMargin: '180px 0px 180px 0px',
        threshold: 0,
      },
    );

    animatedItems.forEach((item) => {
      revealObserver.observe(item);
      resetObserver.observe(item);
    });
  }
}

document.querySelectorAll('[data-hero-carousel]').forEach((carousel) => {
  const slides = Array.from(carousel.querySelectorAll('[data-hero-slide]'));
  const prevButton = carousel.querySelector('[data-hero-prev]');
  const nextButton = carousel.querySelector('[data-hero-next]');
  const interactiveItems = Array.from(
    carousel.querySelectorAll('[data-hero-actions] a, [data-hero-prev], [data-hero-next]'),
  );

  if (slides.length < 2) return;

  let activeIndex = slides.findIndex((slide) => slide.classList.contains('is-active'));
  let autoplayTimer;
  let autoplayDirection = 1;
  const autoplayDelay = 6500;
  const interactionDelay = 11000;

  if (activeIndex < 0) activeIndex = 0;

  const showSlide = (nextIndex) => {
    activeIndex = (nextIndex + slides.length) % slides.length;

    slides.forEach((slide, index) => {
      const isActive = index === activeIndex;
      const slideImage = slide.querySelector('img');
      const slideCopy = slide.querySelector('[data-hero-copy]');

      slide.classList.toggle('relative', isActive);
      slide.classList.toggle('z-[2]', isActive);
      slide.classList.toggle('opacity-100', isActive);
      slide.classList.toggle('pointer-events-auto', isActive);
      slide.classList.toggle('absolute', !isActive);
      slide.classList.toggle('inset-0', !isActive);
      slide.classList.toggle('z-[1]', !isActive);
      slide.classList.toggle('opacity-0', !isActive);
      slide.classList.toggle('pointer-events-none', !isActive);

      slideImage?.classList.toggle('scale-100', isActive);
      slideImage?.classList.toggle('scale-[1.035]', !isActive);

      slideCopy?.classList.toggle('opacity-100', isActive);
      slideCopy?.classList.toggle('translate-y-0', isActive);
      slideCopy?.classList.toggle('opacity-0', !isActive);
      slideCopy?.classList.toggle('translate-y-[1.15rem]', !isActive);
    });

  };

  const stopAutoplay = () => {
    if (!autoplayTimer) return;
    window.clearInterval(autoplayTimer);
    autoplayTimer = undefined;
  };

  const startAutoplay = (delay = autoplayDelay) => {
    if (motionQuery.matches) return;

    stopAutoplay();
    autoplayTimer = window.setInterval(() => {
      if (activeIndex === slides.length - 1) autoplayDirection = -1;
      if (activeIndex === 0) autoplayDirection = 1;

      showSlide(activeIndex + autoplayDirection);
    }, delay);
  };

  const move = (direction) => {
    autoplayDirection = direction;
    showSlide(activeIndex + direction);
    startAutoplay(interactionDelay);
  };

  prevButton?.addEventListener('click', () => move(-1));
  nextButton?.addEventListener('click', () => move(1));

  interactiveItems.forEach((item) => {
    item.addEventListener('pointerenter', stopAutoplay);
    item.addEventListener('pointerleave', () => startAutoplay(interactionDelay));
    item.addEventListener('focus', stopAutoplay);
    item.addEventListener('blur', () => startAutoplay(interactionDelay));
    item.addEventListener('pointerdown', () => startAutoplay(interactionDelay));
  });

  motionQuery.addEventListener('change', () => {
    if (motionQuery.matches) {
      stopAutoplay();
      return;
    }

    startAutoplay();
  });

  showSlide(activeIndex);
  startAutoplay();
});

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
