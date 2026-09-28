(() => {
  const root = document.documentElement;
  const themeToggle = document.querySelector('[data-theme-toggle]');
  const themeIcon = themeToggle?.querySelector('.theme-toggle__icon');
  const themeLabel = themeToggle?.querySelector('.theme-toggle__label');
  const themeMeta = document.querySelector('meta[name="theme-color"]');

  let savedTheme = 'dark';

  try {
    savedTheme = window.localStorage.getItem('portfolio-theme') === 'light' ? 'light' : 'dark';
  } catch {
    savedTheme = 'dark';
  }

  const setTheme = (theme) => {
    const isLight = theme === 'light';
    root.dataset.theme = isLight ? 'light' : 'dark';

    if (themeToggle) {
      themeToggle.setAttribute('aria-pressed', String(isLight));
      themeToggle.setAttribute('aria-label', isLight ? 'Switch to dark mode' : 'Switch to light mode');
      themeToggle.setAttribute('title', isLight ? 'Switch to dark mode' : 'Switch to light mode');
    }

    if (themeIcon) themeIcon.textContent = isLight ? '☾' : '☼';
    if (themeLabel) themeLabel.textContent = isLight ? 'Dark mode' : 'Light mode';
    if (themeMeta) themeMeta.setAttribute('content', isLight ? '#ffffff' : '#000000');

    try {
      window.localStorage.setItem('portfolio-theme', isLight ? 'light' : 'dark');
    } catch {
      // Theme still works for the current page when storage is unavailable.
    }
  };

  setTheme(savedTheme);
  themeToggle?.addEventListener('click', () => {
    setTheme(root.dataset.theme === 'light' ? 'dark' : 'light');
  });

  const navToggle = document.querySelector('.nav-toggle');
  const siteNav = document.querySelector('.site-nav');
  const navLinks = [...document.querySelectorAll('.nav-link:not(.nav-link--contact)')];
  const sections = [...document.querySelectorAll('main section[id]')];
  const year = document.querySelector('[data-current-year]');

  if (year) {
    year.textContent = new Date().getFullYear();
  }

  const setMenuState = (isOpen) => {
    if (!navToggle || !siteNav) return;
    navToggle.setAttribute('aria-expanded', String(isOpen));
    navToggle.querySelector('.sr-only').textContent = isOpen ? 'Close navigation' : 'Open navigation';
    siteNav.classList.toggle('is-open', isOpen);
    document.body.classList.toggle('nav-open', isOpen);
  };

  navToggle?.addEventListener('click', () => {
    setMenuState(navToggle.getAttribute('aria-expanded') !== 'true');
  });

  navLinks.forEach((link) => {
    link.addEventListener('click', () => setMenuState(false));
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') setMenuState(false);
  });

  const setActiveLink = (id) => {
    navLinks.forEach((link) => {
      const isActive = link.getAttribute('href') === `#${id}`;
      link.classList.toggle('is-active', isActive);
      if (isActive) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
  };

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      const visibleSection = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (visibleSection) setActiveLink(visibleSection.target.id);
    }, { rootMargin: '-25% 0px -60% 0px', threshold: [0, 0.2, 0.5, 1] });

    sections.forEach((section) => observer.observe(section));
  }
})();
