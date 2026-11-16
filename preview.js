// Enhancements for the rendered GitHub Pages preview; the WordPress site is unchanged.
(() => {
  const base = '/es-sg-preview';
  const params = new URLSearchParams(location.search);
  const service = document.querySelector('.enquiry-form select[name="service"]');
  if (service && [...service.options].some(option => option.value === params.get('service'))) {
    service.value = params.get('service');
  }
  const form = document.querySelector('[data-preview-archive]');
  if (!form || !window.ES_PREVIEW_NEWS) return;
  const rows = window.ES_PREVIEW_NEWS;
  const list = document.querySelector('.news-list');
  const count = document.querySelector('.archive-count');
  const pagination = document.querySelector('.news-pagination');
  const search = form.elements.news_search;
  const topic = form.elements.news_topic;
  const render = () => {
    const query = new URLSearchParams(location.search);
    search.value = query.get('news_search') || '';
    topic.value = query.get('news_topic') || '';
    const words = search.value.toLowerCase().trim().split(/\s+/).filter(Boolean);
    const matching = rows.filter(row => (!topic.value || row.topic === topic.value) && words.every(word => row.text.includes(word)));
    const pages = Math.max(1, Math.ceil(matching.length / 9));
    const routePage = Number(location.pathname.match(/\/page\/(\d+)\//)?.[1] || 1);
    const page = Math.max(1, Math.min(pages, Number(query.get('archive_page')) || routePage));
    list.innerHTML = matching.slice((page - 1) * 9, page * 9).map(row => row.html).join('');
    count.textContent = `${matching.length} articles${pages > 1 ? ` · Page ${page} of ${pages}` : ''}`;
    document.querySelector('.news-empty')?.remove();
    if (!matching.length) {
      const empty = document.createElement('div');
      empty.className = 'news-empty';
      empty.innerHTML = `<h2>No matching articles</h2><p>Try another search term or browse all topics.</p><a href="${base}/news/">Browse all ${rows.length} articles</a>`;
      list.after(empty);
    }
    form.querySelector('.news-reset')?.remove();
    if (search.value || topic.value) {
      const reset = document.createElement('a');
      reset.className = 'news-reset';
      reset.href = base + '/news/';
      reset.textContent = 'Clear filters';
      form.append(reset);
    }
    if (!pagination) return;
    const items = [];
    const pageUrl = n => {
      const next = new URLSearchParams();
      if (search.value) next.set('news_search', search.value);
      if (topic.value) next.set('news_topic', topic.value);
      const route = base + (n === 1 ? '/news/' : `/news/page/${n}/`);
      return route + (next.size ? '?' + next : '');
    };
    const link = (n, label) => {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.className = 'page-numbers';
      a.href = pageUrl(n);
      a.textContent = label;
      li.append(a);
      return li;
    };
    if (page > 1) items.push(link(page - 1, '← Newer'));
    for (let n = 1; n <= pages; n++) {
      if (n !== 1 && n !== pages && Math.abs(n - page) > 1) {
        if (n === page - 2 || n === page + 2) {
          const li = document.createElement('li');
          li.innerHTML = '<span class="page-numbers dots">…</span>';
          items.push(li);
        }
        continue;
      }
      const li = link(n, String(n));
      if (n === page) {
        li.firstChild.classList.add('current');
        li.firstChild.setAttribute('aria-current', 'page');
      }
      items.push(li);
    }
    if (page < pages) items.push(link(page + 1, 'Older →'));
    const ul = document.createElement('ul');
    ul.className = 'page-numbers';
    ul.append(...items);
    pagination.replaceChildren(...(pages > 1 ? [ul] : []));
  };
  form.addEventListener('submit', event => {
    event.preventDefault();
    const next = new URLSearchParams();
    if (search.value.trim()) next.set('news_search', search.value.trim());
    if (topic.value) next.set('news_topic', topic.value);
    history.pushState(null, '', base + '/news/' + (next.size ? '?' + next : ''));
    render();
  });
  addEventListener('popstate', render);
  render();
})();
