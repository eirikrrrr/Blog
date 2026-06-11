pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

window.BOOKS_READY = (async () => {
  try {
    const res = await fetch('books/metadata.json');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    window.BOOKS = await res.json();
  } catch (err) {
    console.error('Failed to load books:', err);
    window.BOOKS = [];
  }
})();
