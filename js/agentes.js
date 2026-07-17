/* agentes.js — Lógica de la página de Agentes */

let currentAgente = null; // agente activo para el modal QR

document.addEventListener('DOMContentLoaded', () => {
  initSidebar('agentes');
  loadCategoriaOptions();
  filterAgentes();
  modalClickOutside('modal-agente');
  modalClickOutside('modal-qr');

  // Fecha por defecto = hoy
  const fFecha = document.getElementById('f-fecha');
  if (fFecha && !fFecha.value) fFecha.value = today();
});

// ============ Categorías en select ============

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

// ============ Filtrar y Renderizar ============

function filterAgentes() {
  const q      = (document.getElementById('search-input')?.value || '').toLowerCase().trim();
  const estado = document.getElementById('filter-estado')?.value  || '';
  const cat    = document.getElementById('filter-categoria')?.value || '';
  const orden  = document.getElementById('filter-orden')?.value   || 'nombre';

  let lista = DataManager.getAgentes();

  // Búsqueda
  if (q) {
    lista = lista.filter(a =>
      (a.nombre    || '').toLowerCase().includes(q) ||
      (a.empresa   || '').toLowerCase().includes(q) ||
      (a.telefono  || '').toLowerCase().includes(q) ||
      (a.correo    || '').toLowerCase().includes(q) ||
      (a.ciudad    || '').toLowerCase().includes(q) ||
      (a.cargo     || '').toLowerCase().includes(q)
    );
  }

  if (estado) lista = lista.filter(a => a.estado === estado);
  if (cat)    lista = lista.filter(a => a.categoria === cat);

  // Ordenar
  lista.sort((a, b) => {
    if (orden === 'fecha') return new Date(b.fechaRegistro) - new Date(a.fechaRegistro);
    const va = (a[orden] || '').toLowerCase();
    const vb = (b[orden] || '').toLowerCase();
    return va.localeCompare(vb);
  });

  renderAgentes(lista);

  const counter = document.getElementById('results-count');
  if (counter) {
    const total = DataManager.getAgentes().length;
    counter.textContent = `Mostrando ${lista.length} de ${total} agente${total !== 1 ? 's' : ''}`;
  }
}

function renderAgentes(lista) {
  const grid = document.getElementById('agents-grid');
  if (!grid) return;

  if (!lista.length) {
    grid.innerHTML = `
      <div class="empty-state" style="grid-column:1/-1;">
        <div class="empty-icon">👥</div>
        <div class="empty-title">Sin agentes encontrados</div>
        <div class="empty-desc">Prueba con otros filtros o agrega un nuevo agente.</div>
        <button class="btn btn-primary" onclick="openModalNuevo()">➕ Nuevo Agente</button>
      </div>`;
    return;
  }

  grid.innerHTML = lista.map(a => agentCardHTML(a)).join('');
}

function agentCardHTML(a) {
  const esFav = DataManager.esFavorito('agente', a.id);
  return `
    <div class="agent-card" id="card-agente-${a.id}">
      <div class="agent-status">${getBadge(a.estado)}</div>

      <div class="agent-card-top">
        <div class="agent-avatar">${avatarHTML(a.foto, a.nombre, 60)}</div>
        <div class="agent-info">
          <div class="agent-name">${escHtml(a.nombre)}</div>
          <div class="agent-role">${escHtml(a.cargo || '—')}</div>
          <div class="agent-company">${escHtml(a.empresa || '—')}</div>
          ${a.categoria ? `<span class="badge badge-primary mt-1">${escHtml(a.categoria)}</span>` : ''}
        </div>
      </div>

      <div class="agent-contacts">
        ${a.telefono  ? `<div class="contact-item"><span class="ci">📞</span><a href="tel:${escHtml(a.telefono)}">${escHtml(a.telefono)}</a></div>` : ''}
        ${a.whatsapp  ? `<div class="contact-item"><span class="ci">💬</span><a href="${whatsappURL(a.whatsapp)}" target="_blank">${escHtml(a.whatsapp)}</a></div>` : ''}
        ${a.correo    ? `<div class="contact-item"><span class="ci">✉️</span><a href="mailto:${escHtml(a.correo)}">${escHtml(a.correo)}</a></div>` : ''}
        ${a.ciudad    ? `<div class="contact-item"><span class="ci">📍</span>${escHtml(a.ciudad)}${a.pais ? ', '+escHtml(a.pais) : ''}</div>` : ''}
      </div>

      <div class="agent-card-footer">
        <a href="perfil.html?tipo=agente&id=${a.id}" class="btn btn-ghost btn-sm">👁 Perfil</a>
        <button class="btn btn-primary btn-sm" onclick="showQR(${a.id})">📱 QR</button>
        <button class="btn btn-warning btn-sm" onclick="openModalEditar(${a.id})">✏️</button>
        <button class="btn btn-danger btn-sm"  onclick="eliminarAgente(${a.id})">🗑</button>
        <button class="btn btn-ghost btn-sm"   onclick="toggleFav(${a.id}, this)" title="Favorito">
          ${esFav ? '⭐' : '☆'}
        </button>
      </div>
    </div>`;
}

// ============ CRUD ============

function openModalNuevo() {
  document.getElementById('modal-title').textContent = '➕ Nuevo Agente';
  document.getElementById('form-agente').reset();
  document.getElementById('f-id').value = '';
  document.getElementById('f-foto').value = '';
  document.getElementById('f-fecha').value = today();
  document.getElementById('foto-preview').innerHTML = '👤';
  loadCategoriaOptions();
  openModal('modal-agente');
}

function openModalEditar(id) {
  const a = DataManager.getAgente(id);
  if (!a) return;

  document.getElementById('modal-title').textContent = '✏️ Editar Agente';
  document.getElementById('f-id').value       = a.id;
  document.getElementById('f-nombre').value   = a.nombre   || '';
  document.getElementById('f-empresa').value  = a.empresa  || '';
  document.getElementById('f-cargo').value    = a.cargo    || '';
  document.getElementById('f-telefono').value = a.telefono || '';
  document.getElementById('f-whatsapp').value = a.whatsapp || '';
  document.getElementById('f-correo').value   = a.correo   || '';
  document.getElementById('f-direccion').value= a.direccion|| '';
  document.getElementById('f-ciudad').value   = a.ciudad   || '';
  document.getElementById('f-pais').value     = a.pais     || '';
  document.getElementById('f-fecha').value    = a.fechaRegistro || today();
  document.getElementById('f-notas').value    = a.notas    || '';
  document.getElementById('f-estado').value   = a.estado   || 'Activo';
  document.getElementById('f-foto').value     = a.foto     || '';
  loadCategoriaOptions(a.categoria);

  const prev = document.getElementById('foto-preview');
  prev.innerHTML = a.foto ? `<img src="${a.foto}" alt="foto" style="width:56px;height:56px;object-fit:cover;border-radius:50%;">` : '👤';

  openModal('modal-agente');
}

async function submitAgente(e) {
  e.preventDefault();
  const id = document.getElementById('f-id').value;

  const data = {
    nombre:        document.getElementById('f-nombre').value.trim(),
    empresa:       document.getElementById('f-empresa').value.trim(),
    cargo:         document.getElementById('f-cargo').value.trim(),
    categoria:     document.getElementById('f-categoria').value,
    telefono:      document.getElementById('f-telefono').value.trim(),
    whatsapp:      document.getElementById('f-whatsapp').value.trim(),
    correo:        document.getElementById('f-correo').value.trim(),
    direccion:     document.getElementById('f-direccion').value.trim(),
    ciudad:        document.getElementById('f-ciudad').value.trim(),
    pais:          document.getElementById('f-pais').value.trim(),
    fechaRegistro: document.getElementById('f-fecha').value,
    estado:        document.getElementById('f-estado').value,
    notas:         document.getElementById('f-notas').value.trim(),
    foto:          document.getElementById('f-foto').value,
  };

  if (id) {
    DataManager.updateAgente(id, data);
    showToast(`Agente "${data.nombre}" actualizado`, 'success');
  } else {
    DataManager.addAgente(data);
    showToast(`Agente "${data.nombre}" registrado`, 'success');
  }

  closeModal('modal-agente');
  filterAgentes();
}

async function eliminarAgente(id) {
  const a = DataManager.getAgente(id);
  if (!a) return;
  const ok = await confirmDialog(`¿Eliminar al agente <strong>${escHtml(a.nombre)}</strong>? Esta acción no se puede deshacer.`);
  if (!ok) return;
  DataManager.deleteAgente(id);
  showToast(`Agente "${a.nombre}" eliminado`, 'error');
  filterAgentes();
}

function toggleFav(id, btn) {
  const ahora = DataManager.toggleFavorito('agente', id);
  btn.textContent = ahora ? '⭐' : '☆';
  showToast(ahora ? 'Agregado a favoritos' : 'Quitado de favoritos', 'info', 1800);
}

// ============ Preview foto ============

async function previewFoto(input) {
  const file = input.files[0];
  if (!file) return;
  if (file.size > 2 * 1024 * 1024) {
    showToast('La imagen es muy grande (máx. 2MB)', 'warning');
    input.value = '';
    return;
  }
  const b64 = await fileToBase64(file);
  document.getElementById('f-foto').value = b64;
  document.getElementById('foto-preview').innerHTML =
    `<img src="${b64}" style="width:56px;height:56px;object-fit:cover;border-radius:50%;">`;
}

// ============ QR ============

function showQR(id) {
  const a = DataManager.getAgente(id);
  if (!a) return;
  currentAgente = a;

  document.getElementById('qr-modal-title').textContent = `📱 QR — ${a.nombre}`;
  document.getElementById('qr-name').textContent = a.nombre;
  document.getElementById('qr-info').textContent = `${a.cargo || ''} · ${a.empresa || ''}`;

  const display = document.getElementById('qr-display');
  display.innerHTML = '';

  if (a.qr && (a.qr.startsWith('data:') || a.qr.startsWith('http'))) {
    // QR guardado como imagen
    const wrap = document.createElement('div');
    wrap.className = 'qr-box';
    wrap.innerHTML = `<img src="${a.qr}" style="width:200px;height:200px;object-fit:contain;" alt="QR">`;
    display.appendChild(wrap);
  } else {
    // Generar QR desde vCard
    const qrText = buildVCard(a);
    generateQRCode(display, qrText);
  }

  openModal('modal-qr');
}

function buildVCard(a) {
  return [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `FN:${a.nombre || ''}`,
    `ORG:${a.empresa || ''}`,
    `TITLE:${a.cargo || ''}`,
    `TEL;TYPE=CELL:${a.telefono || ''}`,
    `EMAIL:${a.correo || ''}`,
    `ADR;TYPE=WORK:;;${a.direccion || ''};${a.ciudad || ''};;;${a.pais || ''}`,
    'END:VCARD'
  ].join('\n');
}

function generateQRCode(container, text) {
  const wrap = document.createElement('div');
  wrap.className = 'qr-box';

  // Usar QR server API
  const size = 220;
  const url  = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(text)}&color=000000&bgcolor=ffffff`;
  const img  = document.createElement('img');
  img.src    = url;
  img.width  = size;
  img.height = size;
  img.alt    = 'QR Code';
  img.onerror = () => {
    wrap.innerHTML = `<p class="text-muted">No se pudo generar el QR.<br>Verifica tu conexión a internet.</p>`;
  };

  wrap.appendChild(img);
  container.appendChild(wrap);
}

function downloadQR() {
  const img = document.querySelector('#qr-display img');
  if (!img) { showToast('No hay QR para descargar', 'warning'); return; }

  if (img.src.startsWith('data:')) {
    const a = document.createElement('a');
    a.href     = img.src;
    a.download = `qr-${(currentAgente?.nombre || 'agente').replace(/\s+/g,'-').toLowerCase()}.png`;
    a.click();
  } else {
    // Descargar desde URL
    fetch(img.src)
      .then(r => r.blob())
      .then(blob => {
        const a = document.createElement('a');
        a.href     = URL.createObjectURL(blob);
        a.download = `qr-${(currentAgente?.nombre || 'agente').replace(/\s+/g,'-').toLowerCase()}.png`;
        a.click();
        URL.revokeObjectURL(a.href);
      })
      .catch(() => showToast('Error al descargar el QR', 'error'));
  }
}

function copyContactInfo() {
  if (!currentAgente) return;
  const a = currentAgente;
  const txt = [
    `Nombre: ${a.nombre || ''}`,
    `Cargo: ${a.cargo || ''}`,
    `Empresa: ${a.empresa || ''}`,
    `Teléfono: ${a.telefono || ''}`,
    `WhatsApp: ${a.whatsapp || ''}`,
    `Correo: ${a.correo || ''}`,
    `Ciudad: ${a.ciudad || ''}${a.pais ? ', ' + a.pais : ''}`,
  ].filter(l => !l.endsWith(': ')).join('\n');

  navigator.clipboard.writeText(txt)
    .then(() => showToast('Información copiada', 'success'))
    .catch(() => showToast('No se pudo copiar', 'error'));
}
