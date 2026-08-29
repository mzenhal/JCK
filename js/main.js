/* ===================================================================
   JCK Builder's & Interior LLP — Main JavaScript
   =================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initSiteHeader();
  initNavbar();
  initMobileMenu();
  initScrollReveal();
  initCounters();
  initTestimonialSlider();
  initLightbox();
  initModals();
});

/* --- Site Header (homepage-style fixed header) --- */
function initSiteHeader() {
  const siteHeader = document.querySelector('[data-site-header]');
  const menuToggle = document.querySelector('[data-menu-toggle]');
  const menu = document.querySelector('[data-menu]');
  if (!siteHeader) return;

  if (!window.location.hash && 'scrollRestoration' in window.history) {
    window.history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);
  }

  const updateHeader = () => {
    const scrollTop = Math.max(
      window.scrollY,
      document.documentElement.scrollTop || 0,
      document.body.scrollTop || 0
    );
    const hasScrolled = scrollTop > 8;
    const isActive = hasScrolled || siteHeader.dataset.menuOpen === 'true';
    siteHeader.classList.toggle('is-scrolled', hasScrolled);
    siteHeader.classList.toggle('is-at-top', !isActive);
    if (isActive) {
      siteHeader.dataset.state = 'active';
    } else {
      siteHeader.removeAttribute('data-state');
    }
  };

  updateHeader();
  requestAnimationFrame(updateHeader);
  window.addEventListener('scroll', updateHeader, { passive: true });

  siteHeader.updateHeaderState = updateHeader;

  if (menuToggle && menu) {
    menuToggle.addEventListener('click', () => {
      const isOpen = !menu.classList.contains('hidden');
      menu.classList.toggle('hidden', isOpen);
      menuToggle.setAttribute('aria-expanded', String(!isOpen));
      siteHeader.dataset.menuOpen = String(!isOpen);
      siteHeader.updateHeaderState();
    });

    menu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        menu.classList.add('hidden');
        menuToggle.setAttribute('aria-expanded', 'false');
        siteHeader.dataset.menuOpen = 'false';
        siteHeader.updateHeaderState();
      });
    });
  }
}

/* --- Sticky Navbar --- */
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  const onScroll = () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Active link highlight
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}

/* --- Mobile Menu --- */
function initMobileMenu() {
  const toggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (!toggle || !navLinks) return;

  toggle.addEventListener('click', () => {
    toggle.classList.toggle('active');
    navLinks.classList.toggle('active');
    document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
  });

  // Close on link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      toggle.classList.remove('active');
      navLinks.classList.remove('active');
      document.body.style.overflow = '';
    });
  });
}

/* --- Scroll Reveal Animation --- */
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');
  if (!reveals.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  reveals.forEach((el, index) => {
    el.style.transitionDelay = `${index % 4 * 0.1}s`;
    observer.observe(el);
  });
}

/* --- Animated Counters --- */
function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const animateCounter = (el) => {
    const target = parseInt(el.getAttribute('data-count'), 10);
    const suffix = el.getAttribute('data-suffix') || '';
    const duration = 2000;
    const startTime = performance.now();

    const step = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out quad
      const eased = 1 - (1 - progress) * (1 - progress);
      const current = Math.round(eased * target);
      el.textContent = current.toLocaleString() + suffix;

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };
    requestAnimationFrame(step);
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => observer.observe(counter));
}

/* --- Testimonial Slider --- */
function initTestimonialSlider() {
  const track = document.querySelector('.testimonial-track');
  const dots = document.querySelectorAll('.testimonial-dot');
  if (!track || !dots.length) return;

  let currentSlide = 0;
  const totalSlides = dots.length;

  const goToSlide = (index) => {
    currentSlide = index;
    track.style.transform = `translateX(-${currentSlide * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === currentSlide));
  };

  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => goToSlide(index));
  });

  // Auto-play
  let interval = setInterval(() => {
    goToSlide((currentSlide + 1) % totalSlides);
  }, 5000);

  // Pause on hover
  const slider = document.querySelector('.testimonial-slider');
  if (slider) {
    slider.addEventListener('mouseenter', () => clearInterval(interval));
    slider.addEventListener('mouseleave', () => {
      interval = setInterval(() => {
        goToSlide((currentSlide + 1) % totalSlides);
      }, 5000);
    });
  }
}

/* --- Lightbox --- */
function initLightbox() {
  const items = document.querySelectorAll('.gallery-item');
  const lightbox = document.querySelector('.lightbox');
  if (!items.length || !lightbox) return;

  const lightboxImg = lightbox.querySelector('img');
  const closeBtn = lightbox.querySelector('.lightbox-close');

  items.forEach(item => {
    item.addEventListener('click', () => {
      const imgSrc = item.querySelector('img').src;
      lightboxImg.src = imgSrc;
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  const closeLightbox = () => {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  };

  closeBtn.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });
}

/* --- Modals --- */
function initModals() {
  // Open modal
  document.querySelectorAll('[data-modal]').forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const modalId = trigger.getAttribute('data-modal');
      const modal = document.getElementById(modalId);
      if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  // Close modal
  document.querySelectorAll('.modal-close').forEach(btn => {
    btn.addEventListener('click', () => {
      btn.closest('.modal-overlay').classList.remove('active');
      document.body.style.overflow = '';
    });
  });

  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        overlay.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  });
}

/* --- Smooth Scroll for Anchor Links --- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
