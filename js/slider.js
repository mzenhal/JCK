/* ===================================================================
   JCK Builder's — Before & After Comparison Slider
   =================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.ba-slider').forEach(initBASlider);
});

function initBASlider(slider) {
  const beforeWrap = slider.querySelector('.ba-before');
  const handle = slider.querySelector('.ba-handle');
  if (!beforeWrap || !handle) return;

  let isDragging = false;

  const updatePosition = (x) => {
    const rect = slider.getBoundingClientRect();
    let position = ((x - rect.left) / rect.width) * 100;
    position = Math.max(2, Math.min(98, position));

    beforeWrap.style.width = position + '%';
    handle.style.left = position + '%';
  };

  // Mouse events
  handle.addEventListener('mousedown', (e) => {
    e.preventDefault();
    isDragging = true;
    slider.style.cursor = 'ew-resize';
  });

  slider.addEventListener('mousedown', (e) => {
    isDragging = true;
    updatePosition(e.clientX);
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    e.preventDefault();
    updatePosition(e.clientX);
  });

  window.addEventListener('mouseup', () => {
    isDragging = false;
    slider.style.cursor = 'ew-resize';
  });

  // Touch events
  handle.addEventListener('touchstart', (e) => {
    isDragging = true;
  }, { passive: true });

  slider.addEventListener('touchstart', (e) => {
    isDragging = true;
    updatePosition(e.touches[0].clientX);
  }, { passive: true });

  window.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    updatePosition(e.touches[0].clientX);
  }, { passive: true });

  window.addEventListener('touchend', () => {
    isDragging = false;
  });
}
