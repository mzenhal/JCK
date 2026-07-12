/* ===================================================================
   JCK Builder's — Construction Cost Estimator
   =================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('estimator-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    calculateEstimate();
  });

  // Also calculate on input change for live feedback
  form.querySelectorAll('input, select').forEach(input => {
    input.addEventListener('change', calculateEstimate);
  });
});

function calculateEstimate() {
  const area = parseFloat(document.getElementById('plot-area')?.value) || 0;
  const floors = parseInt(document.getElementById('num-floors')?.value) || 1;
  const type = document.getElementById('building-type')?.value || 'residential';

  if (area <= 0) return;

  // Rate per sq.ft. based on building type (INR)
  const rates = {
    residential: { low: 1600, high: 2400 },
    villa: { low: 2200, high: 3500 },
    commercial: { low: 1800, high: 3000 },
    renovation: { low: 800, high: 1500 }
  };

  const rate = rates[type] || rates.residential;
  const totalArea = area * floors;
  const lowEstimate = totalArea * rate.low;
  const highEstimate = totalArea * rate.high;

  const result = document.getElementById('estimate-result');
  const amountEl = result?.querySelector('.amount');
  const noteEl = result?.querySelector('.note');

  if (result && amountEl) {
    amountEl.textContent = `₹${formatNumber(lowEstimate)} – ₹${formatNumber(highEstimate)}`;
    if (noteEl) {
      noteEl.textContent = `Estimated cost for ${totalArea.toLocaleString()} sq.ft. (${floors} floor${floors > 1 ? 's' : ''}) — ${capitalize(type)} construction. Actual costs may vary.`;
    }
    result.classList.add('visible');
  }
}

function formatNumber(num) {
  // Indian numbering system
  if (num >= 10000000) {
    return (num / 10000000).toFixed(2) + ' Cr';
  } else if (num >= 100000) {
    return (num / 100000).toFixed(2) + ' L';
  } else {
    return num.toLocaleString('en-IN');
  }
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
