/* Animate native details without changing the editable WordPress blocks. */
(() => {
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const controllers = [];
  document.querySelectorAll('.faq-section details').forEach(details => {
    const summary = details.querySelector(':scope > summary');
    if (!summary || !details.animate) return;
    const body = document.createElement('div');
    body.className = 'es-faq-body';
    while (summary.nextSibling) body.append(summary.nextSibling);
    details.append(body);
    let animation = null;
    let expanded = details.open;
    const finish = () => {
      details.open = expanded;
      animation?.cancel();
      animation = null;
      details.removeAttribute('data-animating');
      details.dataset.expanded = String(expanded);
      body.inert = !expanded;
    };
    controllers.push(finish);
    summary.addEventListener('click', event => {
      // Leave links and other controls inside an edited summary alone.
      if (event.target.closest('a, button, input, select, textarea')) return;
      event.preventDefault();
      const from = details.getBoundingClientRect().height;
      animation?.cancel();
      animation = null;
      expanded = !expanded;
      details.dataset.expanded = String(expanded);
      body.inert = !expanded;
      if (motion.matches) { finish(); return; }
      // Only two endpoint measurements; no layout reads during frame updates.
      details.open = expanded;
      const to = details.getBoundingClientRect().height;
      details.open = true;
      details.dataset.animating = '';
      animation = details.animate([{ height: `${from}px` }, { height: `${to}px` }], {
        duration: expanded ? 280 : 200,
        easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
        fill: 'both',
      });
      animation.onfinish = finish;
    });
    details.addEventListener('toggle', () => {
      if (!animation) {
        expanded = details.open;
        details.dataset.expanded = String(expanded);
        body.inert = !expanded;
      }
    });
    // A responsive wrap/font change must not leave an old pixel height behind.
    let measuredWidth = summary.getBoundingClientRect().width;
    const observer = new ResizeObserver(([entry]) => {
      const nextWidth = entry.borderBoxSize?.[0]?.inlineSize ?? entry.contentRect.width;
      if (Math.abs(nextWidth - measuredWidth) > 1) {
        measuredWidth = nextWidth;
        if (animation) finish();
      }
    });
    observer.observe(summary);
  });
  motion.addEventListener('change', () => {
    if (motion.matches) controllers.forEach(finish => finish());
  });
})();
