/* ===================================================================
   JCK Builder's — Portfolio Filter
   =================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const items = document.querySelectorAll('.project-card[data-category], .gallery-item[data-category]');
  if (!filterBtns.length || !items.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Toggle active class
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      items.forEach((item, index) => {
        const category = item.getAttribute('data-category');
        const shouldShow = filter === 'all' || category === filter;

        if (shouldShow) {
          item.style.display = '';
          item.style.animation = `PORTFOLIO_FADEUP 0.5s ${index * 0.05}s cubic-bezier(0.22, 1, 0.36, 1) both`;
        } else {
          item.style.display = 'none';
        }
      });
    });
  });
});
