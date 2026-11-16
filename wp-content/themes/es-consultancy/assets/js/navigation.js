(() => {
  const nav = document.querySelector('nav.main-navigation');
  const header = document.querySelector('.wp-site-blocks > header');
  if (!nav || !header) return;
  const overlay = nav.querySelector('.wp-block-navigation__responsive-container');
  const close = nav.querySelector('.wp-block-navigation__responsive-container-close');
  const mobile = matchMedia('(max-width: 1100px)');
  const path = location.pathname.replace(/\/$/, '') || '/';

  nav.querySelectorAll('a[href]').forEach(link => {
    const url = new URL(link.href);
    const destination = url.pathname.replace(/\/$/, '') || '/';
    if (url.origin !== location.origin) return;
    if (destination === path) link.setAttribute('aria-current', 'page');
    else if (destination !== '/' && path.startsWith(destination + '/')) link.classList.add('is-current-section');
  });

  // Native WordPress keeps all mobile submenus open. Add separate disclosures
  // for the overlay while retaining its dialog, focus management and desktop menus.
  nav.querySelectorAll('li.has-child').forEach((item, i) => {
    const submenu = item.querySelector(':scope > ul');
    const link = item.querySelector(':scope > a');
    if (!submenu || !link) return;
    submenu.id ||= `es-submenu-${i}`;
    const toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.className = 'es-mobile-submenu-toggle';
    toggle.setAttribute('aria-controls', submenu.id);
    toggle.setAttribute('aria-label', `${link.textContent.trim()} pages`);
    toggle.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>';
    const setOpen = open => {
      item.classList.toggle('es-submenu-open', open);
      toggle.setAttribute('aria-expanded', String(open));
    };
    setOpen(!!submenu.querySelector('[aria-current="page"]'));
    toggle.addEventListener('click', event => {
      event.stopPropagation();
      setOpen(toggle.getAttribute('aria-expanded') !== 'true');
    });
    item.insertBefore(toggle, submenu);
  });
  nav.classList.add('es-navigation-ready');

  const measure = () => document.documentElement.style.setProperty('--header-height', `${header.offsetHeight}px`);
  const observer = new ResizeObserver(measure);
  observer.observe(header);
  measure();
  mobile.addEventListener('change', () => {
    if (!mobile.matches && overlay?.classList.contains('is-menu-open')) close?.click();
  });
  // Dismiss a restored mobile overlay when returning through browser history.
  window.addEventListener('pageshow', event => {
    if (event.persisted && overlay?.classList.contains('is-menu-open')) close?.click();
  });
})();
