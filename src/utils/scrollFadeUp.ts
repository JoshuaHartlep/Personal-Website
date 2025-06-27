const FADE_UP_SELECTOR = '[data-animate="fade-up"]:not(.sticky-nav-container):not(.sticky-nav-container *):not(.theme-dropdown):not(.theme-dropdown *)';

export function initFadeUpAnimations() {
  console.log('[fade-up] Initializing scroll-triggered animations...');
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
    console.warn('[fade-up] IntersectionObserver not supported. Showing all elements.');
    document.querySelectorAll(FADE_UP_SELECTOR).forEach(el => {
      el.classList.remove('fade-up-init');
      el.classList.add('is-visible');
    });
    return;
  }

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    console.log('[fade-up] Prefers reduced motion. Showing all elements.');
    document.querySelectorAll(FADE_UP_SELECTOR).forEach(el => {
      el.classList.remove('fade-up-init');
      el.classList.add('is-visible');
    });
    return;
  }

  const elements = document.querySelectorAll(FADE_UP_SELECTOR);
  console.log(`[fade-up] Found ${elements.length} elements to animate.`);
  
  // Initialize elements to hidden state
  elements.forEach(el => {
    el.classList.remove('is-visible');
    el.classList.add('fade-up-init');
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // Element is entering viewport - animate in
        setTimeout(() => {
          entry.target.classList.add('is-visible');
          entry.target.classList.remove('fade-up-init');
          console.log('[fade-up] Animated in:', entry.target);
        }, 0); // No stagger for individual elements, just immediate animation
      } else {
        // Element is leaving viewport - animate out
        setTimeout(() => {
          entry.target.classList.remove('is-visible');
          entry.target.classList.add('fade-up-init');
          console.log('[fade-up] Animated out:', entry.target);
        }, 0);
      }
    });
  }, {
    threshold: 0.2,
    rootMargin: '0px 0px -10% 0px'
  });

  elements.forEach(el => {
    observer.observe(el);
  });

  console.log('[fade-up] IntersectionObserver set up for reversible animations.');
} 