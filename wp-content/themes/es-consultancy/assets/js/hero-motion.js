(() => {
  const video = document.querySelector('#hero-motion');
  const button = document.querySelector('.hero-motion-toggle');
  if (!video || !button) return;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const desktop = matchMedia('(min-width: 901px)');
  let wanted = false;
  let visible = true;
  const update = () => {
    const playing = !video.paused;
    button.querySelector('.motion-label').textContent = playing ? 'Pause background video' : 'Play background video';
    button.querySelector('.motion-symbol').textContent = playing ? 'Ⅱ' : '▶';
  };
  const play = async () => {
    const panel = video.parentElement.getBoundingClientRect();
    const density = window.devicePixelRatio || 1;
    const smallFits = panel.width * density <= 1440 && panel.height * density <= 1080;
    const source = smallFits && video.dataset.srcSmall ? video.dataset.srcSmall : video.dataset.src;
    if (video.src !== new URL(source, document.baseURI).href) {
      const time = video.currentTime;
      video.classList.remove('is-ready');
      video.src = source;
      if (time) video.addEventListener('loadedmetadata', () => { video.currentTime = Math.min(time, video.duration); }, { once: true });
    }
    try { await video.play(); } catch { wanted = false; update(); }
  };
  button.hidden = false;
  video.muted = true;
  video.addEventListener('playing', () => { video.classList.add('is-ready'); update(); });
  video.addEventListener('pause', () => { video.classList.remove('is-ready'); update(); });
  video.addEventListener('error', () => { wanted = false; video.classList.remove('is-ready'); button.hidden = true; });
  button.addEventListener('click', () => {
    wanted = video.paused;
    if (wanted) play(); else video.pause();
  });
  const sync = () => {
    if (wanted && visible && !document.hidden) play(); else video.pause();
  };
  new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); }, { threshold: 0.05 }).observe(video.parentElement);
  document.addEventListener('visibilitychange', sync);
  new ResizeObserver(() => { if (wanted) sync(); }).observe(video.parentElement);
  reduce.addEventListener('change', () => { if (reduce.matches) { wanted = false; video.pause(); } });
  const start = () => {
    if (!reduce.matches && desktop.matches && !navigator.connection?.saveData) { wanted = true; sync(); }
  };
  if (document.readyState === 'complete') start(); else window.addEventListener('load', start, { once: true });
})();
