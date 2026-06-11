/* ── State ── */
const state = {
  searchQuery: '',
};

/* ── Router ── */

function getRoute() {
  return (location.hash.slice(1) || '/');
}

function getParams(route) {
  const [base, qs] = route.split('?');
  const params = {};
  if (qs) {
    qs.split('&').forEach(p => {
      const [k, v] = p.split('=');
      params[decodeURIComponent(k)] = decodeURIComponent(v);
    });
  }
  return { base, params };
}

function updateActiveNav(route) {
  document.querySelectorAll('.nav-item').forEach(el => {
    const r = el.dataset.route;
    el.classList.toggle('active', r === route || (route === '/' && r === '/'));
  });
}

/* ── Helpers ── */

function escapeHtml(text) {
  if (text == null) return '';
  const div = document.createElement('div');
  div.textContent = String(text);
  return div.innerHTML;
}

/* ── Shelf Renderer ── */

function renderBookCard(book) {
  return `
    <div class="book-card" data-id="${escapeHtml(book.id)}">
      <div class="book-card-cover" data-pdf="${escapeHtml(book.pdf)}">
        <div class="placeholder">${book.title.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()}</div>
      </div>
      <div class="book-card-info">
        <div class="title">${escapeHtml(book.title)}</div>
        <div class="author">${escapeHtml(book.author)}</div>
        <div class="meta">
          <span>${book.year || ''}</span>
          <span>${book.pages || ''} p&aacute;gs</span>
        </div>
      </div>
    </div>
  `;
}

function renderShelf(title, books, startIndex) {
  if (!books.length) return '';
  const id = title.toLowerCase().replace(/\s+/g, '-');
  return `
    <section class="shelf-section">
      <div class="shelf-header">
        <h2>${escapeHtml(title)}</h2>
        <span class="count">${books.length} libros</span>
      </div>
      <div class="shelf">
        <div class="shelf-books" data-shelf="${id}">
          ${books.map((book, i) => {
            const wrapper = document.createElement('div');
            wrapper.innerHTML = renderBookCard(book);
            const card = wrapper.firstElementChild;
            card.dataset.index = startIndex + i;
            return card.outerHTML;
          }).join('')}
        </div>
      </div>
    </section>
  `;
}

/* ── Dashboard View ── */

function renderDashboard() {
  const books = window.BOOKS || [];
  const count = books.length;

  const app = document.getElementById('app');
  app.innerHTML = `
    <div class="hero-section">
      <h1>Bienvenido a <span>Eirikr Books</span></h1>
      <p>Tu biblioteca personal. Explora, lee y descubre.</p>
    </div>

    <div class="search-bar">
      <input type="text" id="search-input" placeholder="Buscar libros por título o autor..." autocomplete="off">
    </div>

    <div id="shelves-container">
      ${count > 0 ? renderShelf('Leyendo ahora', books.slice(0, 4), 0) : ''}
      ${count > 4 ? renderShelf('Biblioteca', books.slice(4), 4) : ''}
      ${count <= 4 ? renderShelf('Biblioteca', books, 0) : ''}
      ${count === 0 ? '<div class="empty-state"><p>Aún no hay libros en tu biblioteca.</p></div>' : ''}
    </div>
  `;

  // Load covers
  document.querySelectorAll('.book-card').forEach(card => {
    const id = card.dataset.id;
    const book = books.find(b => b.id === id);
    if (book) {
      loadCover(card, book);
      card.addEventListener('click', () => openReader(book));
    }
  });

  // Search
  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      state.searchQuery = searchInput.value.toLowerCase().trim();
      filterBooks();
    });
  }

  updateBookCount(count);
}

function filterBooks() {
  const books = window.BOOKS || [];
  const query = state.searchQuery;

  document.querySelectorAll('.book-card').forEach(card => {
    const id = card.dataset.id;
    const book = books.find(b => b.id === id);
    if (!book) return;
    const match = !query ||
      book.title.toLowerCase().includes(query) ||
      book.author.toLowerCase().includes(query);
    card.style.display = match ? '' : 'none';
  });
}

/* ── Cover Generation ── */

function loadCover(card, book) {
  const cover = card.querySelector('.book-card-cover');
  const placeholder = cover.querySelector('.placeholder');

  if (book.cover) {
    const img = new Image();
    img.alt = book.title;
    img.loading = 'lazy';
    img.onload = () => {
      placeholder.remove();
      cover.appendChild(img);
    };
    img.src = book.cover;
  } else {
    generateCoverFromPDF(book.pdf, cover, placeholder);
  }
}

function generateCoverFromPDF(pdfUrl, coverEl, placeholder) {
  const loadingTask = pdfjsLib.getDocument(pdfUrl);
  loadingTask.promise
    .then(pdf => pdf.getPage(1))
    .then(page => {
      const scale = 0.5;
      const viewport = page.getViewport({ scale });
      const canvas = document.createElement('canvas');
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      return page.render({
        canvasContext: canvas.getContext('2d'),
        viewport,
      }).promise.then(() => {
        canvas.toBlob(blob => {
          if (!blob) return;
          const url = URL.createObjectURL(blob);
          const img = new Image();
          img.alt = '';
          img.onload = () => {
            placeholder.remove();
            coverEl.appendChild(img);
            URL.revokeObjectURL(url);
          };
          img.onerror = () => URL.revokeObjectURL(url);
          img.src = url;
        }, 'image/jpeg', 0.7);
      });
    })
    .catch(() => {
      if (placeholder) {
        placeholder.textContent = '?';
        placeholder.style.fontSize = '1.6rem';
      }
    });
}

function updateBookCount(count) {
  const el = document.getElementById('book-count');
  if (el) el.textContent = count;
}

/* ── Router ── */

function router() {
  const route = getRoute();
  const { base, params } = getParams(route);

  const viewer = document.getElementById('viewer-overlay');

  if (base === '/viewer') {
    viewer.style.display = '';
    renderViewer(params.book);
    return;
  }

  viewer.style.display = 'none';
  document.title = 'Eirikr Books';
  renderDashboard();
  updateActiveNav(base);
}

/* ── PDF Reader ── */

function openReader(book) {
  navigate(`/viewer?book=${encodeURIComponent(book.id)}`);
}

function renderViewer(bookId) {
  const books = window.BOOKS || [];
  const book = books.find(b => b.id === bookId);
  const container = document.getElementById('viewer-container');

  if (!book) {
    navigate('/');
    return;
  }

  document.title = `${book.title} — Eirikr Books`;

  const initials = book.title.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();

  container.innerHTML = `
    <button class="close-viewer" id="close-viewer" title="Cerrar">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
    </button>
    <aside class="viewer-sidebar">
      <div class="viewer-sidebar-cover" id="viewer-cover">
        <span class="placeholder">${initials}</span>
      </div>
      <h1>${escapeHtml(book.title)}</h1>
      <p class="author">${escapeHtml(book.author)}</p>
      <div class="year">${book.year || ''} &middot; ${book.pages || '?'} p&aacute;ginas</div>
      <p class="description">${escapeHtml(book.description)}</p>
    </aside>
    <div class="viewer-main" id="viewer-main">
      <div class="loader-overlay" id="viewer-loader">
        <div class="spinner"></div>
        <p style="color:var(--text-muted);font-size:0.9rem">Cargando PDF...</p>
      </div>
      <div id="viewer-pages"></div>
      <div class="viewer-controls" id="viewer-controls" style="display:none">
        <button id="zoom-out" title="Alejar">A−</button>
        <span class="zoom-level" id="zoom-level">100%</span>
        <button id="zoom-in" title="Acercar">A+</button>

        <span class="divider"></span>

        <button id="prev-page" title="Anterior">&larr;</button>
        <span class="page-info" id="page-info">1 / 1</span>
        <input type="number" class="page-input" id="page-input" min="1" placeholder="Ir" title="Ir a p&aacute;gina">
        <button id="next-page" title="Siguiente">&rarr;</button>
      </div>
    </div>
  `;

  document.getElementById('close-viewer').addEventListener('click', () => navigate('/'));

  if (book.cover) {
    const coverEl = document.getElementById('viewer-cover');
    const img = new Image();
    img.alt = book.title;
    img.onload = () => {
      const ph = coverEl.querySelector('.placeholder');
      if (ph) ph.remove();
      coverEl.appendChild(img);
    };
    img.src = book.cover;
  }

  initPDFViewer(book.pdf);
}

function initPDFViewer(url) {
  const loader = document.getElementById('viewer-loader');
  const pagesContainer = document.getElementById('viewer-pages');
  const controls = document.getElementById('viewer-controls');
  const pageInfo = document.getElementById('page-info');
  const prevBtn = document.getElementById('prev-page');
  const nextBtn = document.getElementById('next-page');
  const zoomInBtn = document.getElementById('zoom-in');
  const zoomOutBtn = document.getElementById('zoom-out');
  const zoomLevel = document.getElementById('zoom-level');
  const pageInput = document.getElementById('page-input');

  let pdfDoc = null;
  let currentPage = 1;
  let totalPages = 0;
  let isRendering = false;
  let zoom = 1;
  let fitScale = 1;

  const MAX_ZOOM = 3;
  const MIN_ZOOM = 0.4;

  function calcFitScale(page) {
    const vp = page.getViewport({ scale: 1 });
    const cw = pagesContainer.clientWidth || 700;
    return cw / vp.width;
  }

  function renderPage(num) {
    if (isRendering || !pdfDoc) return;
    isRendering = true;

    pdfDoc.getPage(num).then(page => {
      if (!fitScale) fitScale = calcFitScale(page);
      const renderScale = fitScale * zoom;
      const viewport = page.getViewport({ scale: renderScale });

      const pageEl = document.createElement('div');
      pageEl.className = 'viewer-page';
      const canvas = document.createElement('canvas');
      canvas.width = viewport.width;
      canvas.height = viewport.height;

      pageEl.appendChild(canvas);
      pagesContainer.innerHTML = '';
      pagesContainer.appendChild(pageEl);

      return page.render({
        canvasContext: canvas.getContext('2d'),
        viewport,
      }).promise;
    }).then(() => {
      currentPage = num;
      pageInfo.textContent = `${num} / ${totalPages}`;
      isRendering = false;
    }).catch(() => {
      isRendering = false;
    });
  }

  function updateZoomDisplay() {
    zoomLevel.textContent = `${Math.round(zoom * 100)}%`;
  }

  function changeZoom(delta) {
    const next = Math.min(Math.max(zoom + delta, MIN_ZOOM), MAX_ZOOM);
    if (next !== zoom) {
      zoom = next;
      updateZoomDisplay();
      renderPage(currentPage);
    }
  }

  pdfjsLib.getDocument(url).promise
    .then(pdf => {
      pdfDoc = pdf;
      totalPages = pdf.numPages;
      pageInput.max = totalPages;
      return pdf.getPage(1);
    })
    .then(page => {
      fitScale = calcFitScale(page);
      loader.classList.add('hidden');
      controls.style.display = 'flex';
      pageInfo.textContent = `1 / ${totalPages}`;
      renderPage(1);
    })
    .catch(err => {
      loader.classList.add('hidden');
      pagesContainer.innerHTML = `
        <p style="color: var(--accent); margin-top: 80px;">No se pudo cargar el PDF.</p>
        <p style="color: var(--text-muted); font-size: 0.85rem; margin-top: 8px;">${escapeHtml(err.message)}</p>
      `;
    });

  zoomInBtn.addEventListener('click', () => changeZoom(0.2));
  zoomOutBtn.addEventListener('click', () => changeZoom(-0.2));

  prevBtn.addEventListener('click', () => {
    if (currentPage > 1) renderPage(currentPage - 1);
  });

  nextBtn.addEventListener('click', () => {
    if (currentPage < totalPages) renderPage(currentPage + 1);
  });

  pageInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      const num = parseInt(pageInput.value, 10);
      if (num >= 1 && num <= totalPages && num !== currentPage) {
        renderPage(num);
      }
      pageInput.value = '';
    }
  });

  document.addEventListener('keydown', function onKey(e) {
    if (e.key === 'ArrowLeft' && currentPage > 1) {
      renderPage(currentPage - 1);
    } else if (e.key === 'ArrowRight' && currentPage < totalPages) {
      renderPage(currentPage + 1);
    } else if (e.key === '+' || e.key === '=') {
      changeZoom(0.2);
    } else if (e.key === '-') {
      changeZoom(-0.2);
    } else if (e.key === 'Escape') {
      navigate('/');
    }
  });

  window.addEventListener('resize', () => {
    fitScale = null;
    renderPage(currentPage);
  });
}

function navigate(path) {
  location.hash = path;
}

/* ── Init ── */

async function init() {
  await window.BOOKS_READY;
  router();
  window.addEventListener('hashchange', router);
}

window.addEventListener('DOMContentLoaded', init);
