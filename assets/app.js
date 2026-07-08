/* ═══════════════════════════════════════════════════════
   Astral · Biblioteca esotérica — SPA de catálogo
   Datos: window.__BOOKS__ (generado por scripts/export_books.py)
   ═══════════════════════════════════════════════════════ */
(() => {
  'use strict';

  const BOOKS = Array.isArray(window.__BOOKS__) ? window.__BOOKS__ : [];
  const state = { q: '', category: 'Todos', view: [] };

  const $  = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  /* ── Helpers ── */
  const el = (tag, props = {}, ...kids) => {
    const n = document.createElement(tag);
    for (const [k, v] of Object.entries(props)) {
      if (k === 'class') n.className = v;
      else if (k === 'html') n.innerHTML = v;
      else if (k.startsWith('on') && typeof v === 'function') n.addEventListener(k.slice(2), v);
      else if (v !== null && v !== undefined) n.setAttribute(k, v);
    }
    for (const kid of kids.flat()) {
      if (kid == null) continue;
      n.append(kid.nodeType ? kid : document.createTextNode(String(kid)));
    }
    return n;
  };

  const categories = () => ['Todos', ...new Set(BOOKS.map(b => b.category))];

  /* Renderiza estrellas ★ de valoración */
  const starsHTML = r => {
    const v = Math.round(r || 0);
    return '★★★★★'.slice(0, v) + '<span class="empty">' + '★★★★★'.slice(v) + '</span>';
  };

  /* ── Portadas procedurales (fallback si no hay imagen) ── */
  // Paleta degradados derivada del título para portadas sin imagen.
  function gradientFor(title) {
    let h = 0;
    for (let i = 0; i < title.length; i++) h = (h * 31 + title.charCodeAt(i)) % 360;
    const h2 = (h + 40) % 360;
    return `linear-gradient(155deg, hsl(${h} 60% 22%), hsl(${h2} 55% 12%) 70%, #05030f)`;
  }
  const sigilFor = title => {
    const set = ['☽', '✦', '♁', '🜍', '✺', '❂', 'ⵙ'];
    let i = 0;
    for (let c of title) i += c.charCodeAt(0);
    return set[i % set.length];
  };

  function coverInner(book) {
    if (book.cover) {
      const img = el('img', {
        src: book.cover, alt: `Portada de ${book.title}`,
        loading: 'lazy', decoding: 'async'
      });
      img.addEventListener('error', () => proceduralInto(img.parentElement, book));
      return img;
    }
    return proceduralNode(book);
  }
  function proceduralNode(book) {
    return el('div', { class: 'procedural', style: `background:${gradientFor(book.title)}` },
      el('div', {},
        el('div', { class: 'ps' }, sigilFor(book.title)),
        el('div', { class: 'pt' }, book.title),
        el('div', { class: 'pa' }, book.author)
      )
    );
  }
  function proceduralInto(container, book) {
    container.innerHTML = '';
    const node = proceduralNode(book);
    // preservar badges
    const badges = $$(':scope > .badge, :scope > .featured-star', container);
    container.appendChild(node);
    for (const b of badges) container.appendChild(b);
  }

  /* ── Tarjeta de libro ── */
  function bookCard(book) {
    const cover = el('div', { class: 'book-cover' });
    cover.appendChild(coverInner(book));
    if (book.category) cover.appendChild(el('span', { class: 'badge' }, book.category));
    if (book.featured) cover.appendChild(el('span', { class: 'featured-star', title: 'Destacado' }, '✦'));

    const info = el('div', { class: 'book-info' },
      el('h3', {}, book.title),
      el('div', { class: 'book-author' }, book.author),
      el('div', { class: 'book-foot' },
        book.year ? el('span', {}, String(book.year)) : el('span'),
        book.rating ? el('span', { class: 'stars', html: starsHTML(book.rating) }) : el('span', { class: 'muted' }, '·')
      )
    );

    const card = el('article', {
      class: 'book',
      role: 'button',
      tabindex: '0',
      'aria-label': `Ver detalle de ${book.title}`,
      onclick: () => openModal(book),
      onkeydown: e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openModal(book); } }
    }, cover, info);
    return card;
  }

  /* ── Render del catálogo ── */
  function computeView() {
    const q = state.q.trim().toLowerCase();
    state.view = BOOKS.filter(b => {
      if (state.category !== 'Todos' && b.category !== state.category) return false;
      if (!q) return true;
      const hay = [b.title, b.author, b.description, b.category].filter(Boolean).join(' ').toLowerCase();
      return hay.includes(q);
    });
  }

  function renderGrid() {
    computeView();
    const grid = $('#grid');
    const empty = $('#empty');
    grid.innerHTML = '';
    if (state.view.length === 0) {
      empty.hidden = false;
    } else {
      empty.hidden = true;
      state.view.forEach((b, i) => {
        const card = bookCard(b);
        card.style.animationDelay = Math.min(i * 60, 600) + 'ms';
        grid.appendChild(card);
      });
    }
    const count = $('#result-count');
    count.innerHTML = state.view.length === 0
      ? ''
      : `<strong>${state.view.length}</strong> de ${BOOKS.length} obras`;
  }

  /* ── Chips de filtro ── */
  function renderFilters() {
    const wrap = $('#filters');
    wrap.innerHTML = '';
    const cats = categories();
    const counts = Object.fromEntries(cats.map(c => [c, 0]));
    BOOKS.forEach(b => { counts[b.category] = (counts[b.category] || 0) + 1; counts['Todos']++; });
    cats.forEach(cat => {
      const active = cat === state.category;
      const chip = el('button', {
        type: 'button',
        class: 'chip' + (active ? ' active' : ''),
        role: 'tab',
        'aria-selected': String(active),
        onclick: () => { state.category = cat; renderFilters(); renderGrid(); }
      },
        cat,
        el('span', { class: 'count' }, String(counts[cat] || 0))
      );
      wrap.appendChild(chip);
    });
  }

  /* ── Modal ── */
  const modal = $('#modal');
  function openModal(book) {
    const cover = $('#modal-cover');
    cover.innerHTML = '';
    cover.appendChild(coverInner(book));

    $('#modal-cat').textContent = book.category || '';
    $('#modal-title').textContent = book.title;
    $('#modal-author').textContent = book.author;
const meta = $('#modal-meta');
    meta.innerHTML = '';
    if (book.year) meta.appendChild(el('span', {}, `${book.year}`));
    if (book.pages) meta.appendChild(el('span', {}, `${book.pages} págs.`));
    if (book.language) meta.appendChild(el('span', {}, `Idioma: ${book.language}`));
    $('#modal-desc').textContent = book.description || '';
    const link = $('#modal-link');
    link.href = book.link;
    const ratingBox = $('#modal-rating');
    ratingBox.innerHTML = book.rating ? `Valoración: <span class="stars">${starsHTML(book.rating)}</span> ${book.rating.toFixed(1)}/5` : '';

    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    setTimeout(() => $('.modal-close', modal)?.focus(), 50);
  }
  function closeModal() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }
  $$('[data-close]', modal).forEach(n => n.addEventListener('click', closeModal));
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
  });

  /* ── Búsqueda ── */
  let t;
  $('#search').addEventListener('input', e => {
    clearTimeout(t);
    t = setTimeout(() => { state.q = e.target.value; renderGrid(); }, 120);
  });

  /* ── Stats del hero ── */
  function renderStats() {
    const countNode = $('[data-stat="count"]');
    const catsNode = $('[data-stat="cats"]');
    if (countNode) countNode.textContent = BOOKS.length;
    if (catsNode) catsNode.textContent = categories().length - 1;
  }

  /* ── Starfield animado en canvas ── */
  function initStarfield() {
    const canvas = $('#starfield');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let w, h, stars = [];

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.width = innerWidth * dpr;
      h = canvas.height = innerHeight * dpr;
      canvas.style.width = innerWidth + 'px';
      canvas.style.height = innerHeight + 'px';
      ctx.setTransform(1,0,0,1,0,0);
      ctx.scale(dpr, dpr);
      const target = Math.round(innerWidth * innerHeight / 9000);
      stars = Array.from({ length: target }, () => ({
        x: Math.random() * innerWidth,
        y: Math.random() * innerHeight,
        r: Math.random() * 1.3 + 0.2,
        a: Math.random() * 0.6 + 0.2,
        tw: Math.random() * 0.02 + 0.004,
        dir: Math.random() < 0.5 ? -1 : 1,
        c: Math.random() < 0.12 ? '#e8c252' : (Math.random() < 0.3 ? '#a78bfa' : '#ffffff'),
        vx: (Math.random() - 0.5) * 0.04
      }));
    }
    let t0 = 0;
    function draw(t) {
      const dt = Math.min(t - t0, 50); t0 = t;
      ctx.clearRect(0, 0, innerWidth, innerHeight);
      for (const s of stars) {
        s.a += s.tw * s.dir;
        if (s.a <= 0.15 || s.a >= 0.95) s.dir *= -1;
        s.x += s.vx;
        if (s.x > innerWidth + 2) s.x = -2;
        if (s.x < -2) s.x = innerWidth + 2;
        ctx.globalAlpha = s.a;
        ctx.fillStyle = s.c;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
        if (s.r > 1) {
          ctx.globalAlpha = s.a * 0.25;
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.r * 2.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;
      if (!reduce) requestAnimationFrame(draw);
    }
    let rt;
    addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(resize, 150); }, { passive: true });
    resize();
    if (reduce) { // render estático una sola vez
      for (const s of stars) { ctx.globalAlpha = s.a; ctx.fillStyle = s.c; ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI*2); ctx.fill(); }
      ctx.globalAlpha = 1;
    } else {
      requestAnimationFrame(draw);
    }
  }

  /* ── Init ── */
  function init() {
    renderStats();
    renderFilters();
    renderGrid();
    initStarfield();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
  window.addEventListener('pageshow', e => { if (e.persisted) renderGrid(); });
})();