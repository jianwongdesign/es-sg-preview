(() => {
  const script = document.currentScript;
  const images = {
  "energy-audits": "energy-audit",
  "facility-management-audits": "facility-management",
  "project-management": "project-management",
  "green-mark-consultancy": "green-mark",
  "iso-carbon-consultancy": "iso-systems",
  "esg-reporting": "esg-reporting",
  "iso-50001": "energy-management",
  "iso-14001": "environmental-management",
  "iso-14064": "organisational-carbon",
  "iso-14067": "product-carbon",
  "eco-office": "eco-office",
  "green-gracious": "green-gracious",
  "green-mark-for-interiors": "green-interiors"
};
  const rows = [...document.querySelectorAll('.service-row')];
  if (!rows.length) return;
  const canHover = matchMedia('(hover: hover) and (pointer: fine) and (min-width: 701px)');
  const preview = document.createElement('div');
  preview.className = 'service-hover-preview';
  preview.setAttribute('aria-hidden', 'true');
  const image = document.createElement('img');
  image.src = new URL('../images/higgsfield/energy-audit-480.webp', script.src).href;
  image.alt = '';
  image.width = 480;
  image.height = 360;
  const label = document.createElement('span');
  preview.append(image, label);
  document.body.append(preview);
  let active = null;
  const hide = () => {
    preview.classList.remove('is-visible');
    active?.classList.remove('is-previewing');
    active = null;
  };
  const position = (event) => {
    const { width, height } = preview.getBoundingClientRect();
    const x = event.clientX + width + 28 < innerWidth
      ? event.clientX + 24 : event.clientX - width - 24;
    const y = event.clientY - height / 2;
    preview.style.left = `${Math.max(12, Math.min(x, innerWidth - width - 12))}px`;
    preview.style.top = `${Math.max(12, Math.min(y, innerHeight - height - 12))}px`;
  };
  rows.forEach((row) => {
    row.addEventListener('pointerenter', (event) => {
      if (!canHover.matches || event.pointerType === 'touch') return;
      hide();
      active = row;
      label.textContent = row.querySelector('h3')?.textContent || '';
      const slug = new URL(row.querySelector('h3 a').href).pathname.split('/').filter(Boolean).pop();
      image.src = new URL('../images/higgsfield/' + (images[slug] || 'sustainable-city') + '-480.webp', script.src).href;
      image.style.objectPosition = 'center';
      position(event);
      row.classList.add('is-previewing');
      preview.classList.add('is-visible');
    });
    row.addEventListener('pointermove', (event) => {
      if (active === row) position(event);
    });
    row.addEventListener('pointerleave', hide);
    row.addEventListener('pointercancel', hide);
    row.addEventListener('click', hide);
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' || event.key === 'Tab') hide();
  });
  window.addEventListener('scroll', hide, { passive: true });
  window.addEventListener('resize', hide);
  window.addEventListener('blur', hide);
  canHover.addEventListener('change', hide);
})();
