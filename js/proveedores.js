/* proveedores.js — Lógica de la página de Proveedores */

let currentProv = null;

document.addEventListener('DOMContentLoaded', () => {
  initSidebar('proveedores');
  loadCategoriaOptions();
  filterProveedores();
  modalClickOutside('modal-proveedor');
  modalClickOutside('modal-qr');
});

function loadCategoriaOptions(selected = '') {
  const cats = DataManager.getCategorias();
  const sel  = document.getElementById('f-categoria');
  const filterSel = document.getElementById('filter-categoria');

  if (sel) {
    sel.innerHTML = cats.map(c =>
      `<option value="${escHtml(c)}" ${c === selected ? 'selected' : ''}>${escHtml(c)}</option>`
    ).join('');
  }
  if (filterSel) {
    filterSel.innerHTML = `<option value="">Todas las categorías</option>` +
      cats.map(c => `<option value="${escHtml(c)}">${escHtml(c)}</option>`).join('');
  }
}

function filterProveedores() {
  const q      = (document.getElementById('search-input')?.value || '').toLowerCase().trim();
  const estado = document.getElementById('filter-estado')?.value  || '';
  const cat    = document.getElementById('filter-categoria')?.value || '';
  const orden  = document.getElementById('filter-orden')?.value   || 'empresa';

  let lista = DataManager.getProveedores();

  if (q) {
    lista = lista.filter(p =>
      (p.empresa   || '').toLowerCase().includes(q) ||
      (p.contacto  || '').toLowerCase().includes(q) ||
      (p.telefono  || '').toLowerCase().includes(q) ||
      (p.correo    || '').toLowerCase().includes(q) ||
      (p.ciudad    || '').toLowerCase().includes(q)
    );
  }

  if (estado) lista = lista.filter(p => p.estado === estado);
  if (cat)    lista = lista.filter(p => p.categoria === cat);

  lista.sort((a, b) => (a[orden] || '').toLowerCase().localeCompare((b[orden] || '').toLowerCase()));

  renderProveedores(lista);

  const counter = document.getElementById('results-count');
  if (counter) {
    const total = DataManager.getProveedores().length;
    counter.textContent = `Mostrando ${lista.length} de ${total} proveedor${total !== 1 ? 'es' : ''}`;
  }
}

function renderProveedores(lista) {
  const grid = document.getElementById('proveedores-grid');
  if (!grid) return;

  if (!lista.length) {
    grid.innerHTML = `
      <div class="empty-state" style="grid-column:1/-1;">
        <div class="empty-icon">🏢</div>
        <div class="empty-title">Sin proveedores encontrados</div>
        <div class="empty-desc">Prueba con otros filtros o agrega un nuevo proveedor.</div>
        <button class="btn btn-success" onclick="openModalNuevo()">➕ Nuevo Proveedor</button>
      </div>`;
    return;
  }

  grid.innerHTML = lista.map(p => proveedorCardHTML(p)).join('');
}

function proveedorCardHTML(p) {
  const esFav = DataManager.esFavorito('proveedor', p.id);
  return `
    <div class="agent-card" id="card-proveedor-${p.id}">
      <div class="agent-status">${getBadge(p.estado)}</div>

      <div class="agent-card-top">
        <div class="agent-avatar">${avatarHTML(p.logo, p.empresa, 60)}</div>
        <div class="agent-info">
          <div class="agent-name">${escHtml(p.empresa)}</div>
          <div class="agent-role">${escHtml(p.contacto || '—')}</div>
          <div class="agent-company">${escHtml(p.ciudad || '—')}</div>
          ${p.categoria ? `<span class="badge badge-purple mt-1">${escHtml(p.categoria)}</span>` : ''}
        </div>
      </div>

      <div class="agent-contacts">
        ${p.telefono ? `<div class="contact-item"><span class="ci">📞</span><a href="tel:${escHtml(p.telefono)}">${escHtml(p.telefono)}</a></div>` : ''}
        ${p.whatsapp ? `<div class="contact-item"><span class="ci">💬</span><a href="${whatsappURL(p.whatsapp)}" target="_blank">${escHtml(p.whatsapp)}</a></div>` : ''}
        ${p.correo   ? `<div class="contact-item"><span class="ci">✉️</span><a href="mailto:${escHtml(p.correo)}">${escHtml(p.correo)}</a></div>` : ''}
        ${p.web      ? `<div class="contact-item"><span class="ci">🌐</span><a href="${escHtml(p.web)}" target="_blank">${escHtml(p.web)}</a></div>` : ''}
      </div>

      <div class="agent-card-footer">
        <a href="perfil.html?tipo=proveedor&id=${p.id}" class="btn btn-ghost btn-sm">👁 Perfil</a>
        <button class="btn btn-success btn-sm" onclick="showQR(${p.id})">📱 QR</button>
        <button class="btn btn-warning btn-sm" onclick="openModalEditar(${p.id})">✏️</button>
        <button class="btn btn-danger btn-sm"  onclick="eliminarProveedor(${p.id})">🗑</button>
        <button class="btn btn-ghost btn-sm"   onclick="toggleFav(${p.id}, this)" title="Favorito">
          ${esFav ? '⭐' : '☆'}
        </button>
      </div>
    </div>`;
}

// ============ CRUD ============

function openModalNuevo() {
  document.getElementById('modal-title').textContent = '➕ Nuevo Proveedor';
  document.getElementById('form-proveedor').reset();
  document.getElementById('f-id').value = '';
  document.getElementById('f-logo').value = '';
  document.getElementById('logo-preview').innerHTML = '🏢';
  loadCategoriaOptions();
  openModal('modal-proveedor');
}

function openModalEditar(id) {
  const p = DataManager.getProveedor(id);
  if (!p) return;

  document.getElementById('modal-title').textContent = '✏️ Editar Proveedor';
  document.getElementById('f-id').value        = p.id;
  document.getElementById('f-empresa').value   = p.empresa   || '';
  document.getElementById('f-contacto').value  = p.contacto  || '';
  document.getElementById('f-telefono').value  = p.telefono  || '';
  document.getElementById('f-whatsapp').value  = p.whatsapp  || '';
  document.getElementById('f-correo').value    = p.correo    || '';
  document.getElementById('f-direccion').value = p.direccion || '';
  document.getElementById('f-ciudad').value    = p.ciudad    || '';
  document.getElementById('f-pais').value      = p.pais      || '';
  document.getElementById('f-web').value       = p.web       || '';
  document.getElementById('f-facebook').value  = p.facebook  || '';
  document.getElementById('f-instagram').value = p.instagram || '';
  document.getElementById('f-linkedin').value  = p.linkedin  || '';
  document.getElementById('f-notas').value     = p.notas     || '';
  document.getElementById('f-estado').value    = p.estado    || 'Activo';
  document.getElementById('f-logo').value      = p.logo      || '';
  loadCategoriaOptions(p.categoria);

  const prev = document.getElementById('logo-preview');
  prev.innerHTML = p.logo
    ? `<img src="${p.logo}" style="width:56px;height:56px;object-fit:cover;border-radius:50%;">`
    : '🏢';

  openModal('modal-proveedor');
}

async function submitProveedor(e) {
  e.preventDefault();
  const id = document.getElementById('f-id').value;

  const data = {
    empresa:   document.getElementById('f-empresa').value.trim(),
    contacto:  document.getElementById('f-contacto').value.trim(),
    categoria: document.getElementById('f-categoria').value,
    telefono:  document.getElementById('f-telefono').value.trim(),
    whatsapp:  document.getElementById('f-whatsapp').value.trim(),
    correo:    document.getElementById('f-correo').value.trim(),
    direccion: document.getElementById('f-direccion').value.trim(),
    ciudad:    document.getElementById('f-ciudad').value.trim(),
    pais:      document.getElementById('f-pais').value.trim(),
    web:       document.getElementById('f-web').value.trim(),
    facebook:  document.getElementById('f-facebook').value.trim(),
    instagram: document.getElementById('f-instagram').value.trim(),
    linkedin:  document.getElementById('f-linkedin').value.trim(),
    notas:     document.getElementById('f-notas').value.trim(),
    estado:    document.getElementById('f-estado').value,
    logo:      document.getElementById('f-logo').value,
  };

  if (id) {
    DataManager.updateProveedor(id, data);
    showToast(`Proveedor "${data.empresa}" actualizado`, 'success');
  } else {
    DataManager.addProveedor(data);
    showToast(`Proveedor "${data.empresa}" registrado`, 'success');
  }

  closeModal('modal-proveedor');
  filterProveedores();
}

async function eliminarProveedor(id) {
  const p = DataManager.getProveedor(id);
  if (!p) return;
  const ok = await confirmDialog(`¿Eliminar al proveedor <strong>${escHtml(p.empresa)}</strong>? Esta acción no se puede deshacer.`);
  if (!ok) return;
  DataManager.deleteProveedor(id);
  showToast(`Proveedor "${p.empresa}" eliminado`, 'error');
  filterProveedores();
}

function toggleFav(id, btn) {
  const ahora = DataManager.toggleFavorito('proveedor', id);
  btn.textContent = ahora ? '⭐' : '☆';
  showToast(ahora ? 'Agregado a favoritos' : 'Quitado de favoritos', 'info', 1800);
}

async function previewLogo(input) {
  const file = input.files[0];
  if (!file) return;
  if (file.size > 2 * 1024 * 1024) {
    showToast('La imagen es muy grande (máx. 2MB)', 'warning');
    input.value = '';
    return;
  }
  const b64 = await fileToBase64(file);
  document.getElementById('f-logo').value = b64;
  document.getElementById('logo-preview').innerHTML =
    `<img src="${b64}" style="width:56px;height:56px;object-fit:cover;border-radius:50%;">`;
}

// ============ QR ============

function showQR(id) {
  const p = DataManager.getProveedor(id);
  if (!p) return;
  currentProv = p;

  document.getElementById('qr-modal-title').textContent = `📱 QR — ${p.empresa}`;
  document.getElementById('qr-name').textContent = p.empresa;
  document.getElementById('qr-info').textContent = `${p.contacto || ''} · ${p.categoria || ''}`;

  const display = document.getElementById('qr-display');
  display.innerHTML = '';

  if (p.qr && (p.qr.startsWith('data:') || p.qr.startsWith('http'))) {
    const wrap = document.createElement('div');
    wrap.className = 'qr-box';
    wrap.innerHTML = `<img src="${p.qr}" style="width:200px;height:200px;object-fit:contain;" alt="QR">`;
    display.appendChild(wrap);
  } else {
    const qrText = buildProvVCard(p);
    generateQRCode(display, qrText);
  }

  openModal('modal-qr');
}

function buildProvVCard(p) {
  return [
    'BEGIN:VCARD', 'VERSION:3.0',
    `FN:${p.empresa || ''}`,
    `ORG:${p.empresa || ''}`,
    `TEL;TYPE=WORK:${p.telefono || ''}`,
    `EMAIL:${p.correo || ''}`,
    `URL:${p.web || ''}`,
    `ADR;TYPE=WORK:;;${p.direccion || ''};${p.ciudad || ''};;;${p.pais || ''}`,
    'END:VCARD'
  ].join('\n');
}

function generateQRCode(container, text) {
  const wrap = document.createElement('div');
  wrap.className = 'qr-box';
  const size = 220;
  const url  = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(text)}`;
  const img  = document.createElement('img');
  img.src = url; img.width = size; img.height = size; img.alt = 'QR Code';
  img.onerror = () => { wrap.innerHTML = `<p class="text-muted">No se pudo generar el QR.</p>`; };
  wrap.appendChild(img);
  container.appendChild(wrap);
}

function downloadQR() {
  const img = document.querySelector('#qr-display img');
  if (!img) { showToast('No hay QR para descargar', 'warning'); return; }
  fetch(img.src)
    .then(r => r.blob())
    .then(blob => {
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `qr-${(currentProv?.empresa || 'proveedor').replace(/\s+/g,'-').toLowerCase()}.png`;
      a.click();
      URL.revokeObjectURL(a.href);
    })
    .catch(() => showToast('Error al descargar el QR', 'error'));
}

function copyContactInfo() {
  if (!currentProv) return;
  const p = currentProv;
  const txt = [
    `Empresa: ${p.empresa || ''}`,
    `Contacto: ${p.contacto || ''}`,
    `Teléfono: ${p.telefono || ''}`,
    `WhatsApp: ${p.whatsapp || ''}`,
    `Correo: ${p.correo || ''}`,
    `Web: ${p.web || ''}`,
    `Ciudad: ${p.ciudad || ''}${p.pais ? ', ' + p.pais : ''}`,
  ].filter(l => !l.endsWith(': ')).join('\n');

  navigator.clipboard.writeText(txt)
    .then(() => showToast('Información copiada', 'success'))
    .catch(() => showToast('No se pudo copiar', 'error'));
}
