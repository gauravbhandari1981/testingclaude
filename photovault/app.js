const dropzone   = document.getElementById('dropzone');
const fileInput  = document.getElementById('fileInput');
const gallery    = document.getElementById('gallery');
const lightbox   = document.getElementById('lightbox');
const lbImg      = document.getElementById('lightboxImg');
const lbInfo     = document.getElementById('lightboxInfo');
const countEl    = document.getElementById('count');

let photos = [];
let current = 0;

// ── Upload ────────────────────────────────────────────────
dropzone.addEventListener('click', () => fileInput.click());
fileInput.addEventListener('change', e => addFiles(e.target.files));

dropzone.addEventListener('dragover', e => { e.preventDefault(); dropzone.classList.add('drag-over'); });
dropzone.addEventListener('dragleave', () => dropzone.classList.remove('drag-over'));
dropzone.addEventListener('drop', e => {
  e.preventDefault();
  dropzone.classList.remove('drag-over');
  addFiles(e.dataTransfer.files);
});

function addFiles(files) {
  [...files].filter(f => f.type.startsWith('image/')).forEach(file => {
    const url = URL.createObjectURL(file);
    photos.push({ url, name: file.name, size: formatSize(file.size) });
    renderCard(photos.length - 1);
  });
  updateCount();
}

function formatSize(bytes) {
  return bytes > 1048576
    ? (bytes / 1048576).toFixed(1) + ' MB'
    : (bytes / 1024).toFixed(0) + ' KB';
}

// ── Gallery ───────────────────────────────────────────────
function renderCard(index) {
  const { url, name, size } = photos[index];
  const card = document.createElement('div');
  card.className = 'photo-card';
  card.dataset.index = index;
  card.innerHTML = `
    <img src="${url}" alt="${name}" loading="lazy">
    <div class="overlay"><span>${name}</span></div>
    <button class="delete-btn" title="Delete">✕</button>
  `;
  card.querySelector('img').addEventListener('click', () => openLightbox(index));
  card.querySelector('.delete-btn').addEventListener('click', e => {
    e.stopPropagation();
    deletePhoto(index);
  });
  gallery.appendChild(card);
}

function deletePhoto(index) {
  URL.revokeObjectURL(photos[index].url);
  photos.splice(index, 1);
  rebuildGallery();
  updateCount();
}

function rebuildGallery() {
  gallery.innerHTML = '';
  photos.forEach((_, i) => renderCard(i));
}

function updateCount() {
  const n = photos.length;
  countEl.textContent = n === 0 ? '0 photos' : `${n} photo${n > 1 ? 's' : ''}`;
}

// ── Lightbox ──────────────────────────────────────────────
function openLightbox(index) {
  current = index;
  showCurrent();
  lightbox.classList.add('open');
}

function showCurrent() {
  const p = photos[current];
  lbImg.src = p.url;
  lbImg.alt = p.name;
  lbInfo.textContent = `${p.name} · ${p.size} · ${current + 1} / ${photos.length}`;
}

document.getElementById('close').addEventListener('click', () => lightbox.classList.remove('open'));
document.getElementById('prev').addEventListener('click', () => { current = (current - 1 + photos.length) % photos.length; showCurrent(); });
document.getElementById('next').addEventListener('click', () => { current = (current + 1) % photos.length; showCurrent(); });

lightbox.addEventListener('click', e => { if (e.target === lightbox) lightbox.classList.remove('open'); });

document.addEventListener('keydown', e => {
  if (!lightbox.classList.contains('open')) return;
  if (e.key === 'ArrowLeft')  { current = (current - 1 + photos.length) % photos.length; showCurrent(); }
  if (e.key === 'ArrowRight') { current = (current + 1) % photos.length; showCurrent(); }
  if (e.key === 'Escape')     lightbox.classList.remove('open');
});
