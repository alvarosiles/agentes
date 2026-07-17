/* perfil.js — Perfil completo de agente o proveedor */

let profileData = null;
let profileTipo = null;

document.addEventListener('DOMContentLoaded', () => {
  const tipo = getParam('tipo') || 'agente';
  const id   = getParam('id');

  profileTipo = tipo;

  if (!id) {
    showError('No se especificó un ID.');
    return;
  }

  let data = null;
  if (tipo === 'agente') {
    data = DataManager.getAgente(id);
    initSidebar('agentes');
  } else {
    data = DataManager.getProveedor(id);
    initSidebar('proveedores');
  }

  if (!data) {
    showError('Registro no encontrado.');
    return;
  }

  profileData = data;
  renderPerfil(data, tipo);
  modalClickOutside('modal-qr');
});

function showError(msg) {
  document.getElementById('perfil-content').innerHTML = `
    <div class="empty-state">
      <div class="empty-icon">❌</div>
      <div class="empty-title">${msg}</div>
      <button class="btn btn-ghost" onclick="history.back()">← Volver</button>
    </div>`;
}

function renderPerfil(d, tipo) {
  const isAgente = tipo === 'agente';
  document.getElementById('page-title').innerHTML =
    `${isAgente ? '👤' : '🏢'} Perfil <span class="subtitle">${isAgente ? 'Agente' : 'Proveedor'}</span>`;
  document.title = `Agentes — ${isAgente ? d.nombre : d.empresa}`;

  const foto  = isAgente ? d.foto  : d.logo;
  const nombre = isAgente ? d.nombre : d.empresa;
  const sub1  = isAgente ? (d.cargo || '') : (d.contacto || '');
  const sub2  = isAgente ? (d.empresa || '') : (d.categoria || '');

  const infoItems = buildInfoItems(d, isAgente);
  const redes     = isAgente ? '' : buildRedes(d);

  document.getElementById('perfil-content').innerHTML = `
    <!-- Hero -->
    <div class="profile-hero">
      <div class="profile-avatar">${avatarHTML(foto, nombre, 110)}</div>
      <div class="profile-info">
        <div class="profile-name">${escHtml(nombre)}</div>
        ${sub1 ? `<div class="profile-role">${escHtml(sub1)}</div>` : ''}
        ${sub2 ? `<div class="profile-company">${escHtml(sub2)}</div>` : ''}
        <div style="margin-bottom:12px;">${getBadge(d.estado)}</div>
        <div class="profile-actions">
          <button class="btn btn-primary" onclick="showQRModal()">📱 Mostrar QR</button>
          <button class="btn btn-ghost" onclick="copyInfo()">📋 Copiar Info</button>
          <button class="btn btn-warning" onclick="editarRegistro()">✏️ Editar</button>
          <button class="btn btn-ghost" onclick="toggleFavPerfil()">
            ${DataManager.esFavorito(profileTipo, d.id) ? '⭐ Favorito' : '☆ Favorito'}
          </button>
        </div>
      </div>
    </div>

    <!-- Info grid -->
    <div class="info-grid">${infoItems}</div>

    ${redes}

    <!-- Notas -->
    ${d.notas ? `
    <div class="card mb-4" style="margin-bottom:22px;">
      <div class="card-header"><span class="card-title">📝 Notas</span></div>
      <div class="card-body"><p style="line-height:1.7;color:var(--text-muted);">${escHtml(d.notas)}</p></div>
    </div>` : ''}

    <!-- QR Section -->
    <div class="qr-card">
      <div class="card-title" style="margin-bottom:6px;">📱 Código QR</div>
      <p class="text-muted fs-sm" style="margin-bottom:4px;">Escanea para obtener la información de contacto</p>
      <div id="qr-inline" style="margin:0 auto;display:inline-block;"></div>
      <div style="margin-top:16px;display:flex;gap:10px;justify-content:center;flex-wrap:wrap;">
        <button class="btn btn-primary btn-sm" onclick="showQRModal()">🔍 Ver QR grande</button>
        <button class="btn btn-ghost btn-sm" onclick="downloadQRInline()">⬇️ Descargar QR</button>
      </div>
    </div>
  `;

  // Generar QR inline
  renderQRInline();
}

function buildInfoItems(d, isAgente) {
  const items = [];

  if (isAgente) {
    if (d.telefono) items.push({ icon: '📞', label: 'Teléfono', value: `<a href="tel:${escHtml(d.telefono)}">${escHtml(d.telefono)}</a>`, color: 'blue' });
    if (d.whatsapp) items.push({ icon: '💬', label: 'WhatsApp', value: `<a href="${whatsappURL(d.whatsapp)}" target="_blank">${escHtml(d.whatsapp)}</a>`, color: 'green' });
    if (d.correo)   items.push({ icon: '✉️', label: 'Correo', value: `<a href="mailto:${escHtml(d.correo)}">${escHtml(d.correo)}</a>`, color: 'blue' });
    if (d.ciudad || d.pais) items.push({ icon: '📍', label: 'Ubicación', value: [d.ciudad, d.pais].filter(Boolean).join(', '), color: 'yellow' });
    if (d.direccion) items.push({ icon: '🏠', label: 'Dirección', value: escHtml(d.direccion), color: 'yellow' });
    if (d.categoria) items.push({ icon: '🏷️', label: 'Categoría', value: escHtml(d.categoria), color: 'purple' });
    if (d.fechaRegistro) items.push({ icon: '📅', label: 'Registro', value: formatDate(d.fechaRegistro), color: 'blue' });
  } else {
    if (d.contacto) items.push({ icon: '👤', label: 'Contacto', value: escHtml(d.contacto), color: 'blue' });
    if (d.telefono) items.push({ icon: '📞', label: 'Teléfono', value: `<a href="tel:${escHtml(d.telefono)}">${escHtml(d.telefono)}</a>`, color: 'blue' });
    if (d.whatsapp) items.push({ icon: '💬', label: 'WhatsApp', value: `<a href="${whatsappURL(d.whatsapp)}" target="_blank">${escHtml(d.whatsapp)}</a>`, color: 'green' });
    if (d.correo)   items.push({ icon: '✉️', label: 'Correo', value: `<a href="mailto:${escHtml(d.correo)}">${escHtml(d.correo)}</a>`, color: 'blue' });
    if (d.web)      items.push({ icon: '🌐', label: 'Web', value: `<a href="${escHtml(d.web)}" target="_blank">${escHtml(d.web)}</a>`, color: 'cyan' });
    if (d.ciudad || d.pais) items.push({ icon: '📍', label: 'Ubicación', value: [d.ciudad, d.pais].filter(Boolean).join(', '), color: 'yellow' });
    if (d.direccion) items.push({ icon: '🏠', label: 'Dirección', value: escHtml(d.direccion), color: 'yellow' });
    if (d.categoria) items.push({ icon: '🏷️', label: 'Categoría', value: escHtml(d.categoria), color: 'purple' });
  }

  return items.map(it => `
    <div class="info-item">
      <div class="info-icon ${it.color}">${it.icon}</div>
      <div>
        <div class="info-label">${it.label}</div>
        <div class="info-value">${it.value}</div>
      </div>
    </div>`).join('');
}

function buildRedes(p) {
  const redes = [
    { label: 'Facebook',  val: p.facebook,  icon: '📘' },
    { label: 'Instagram', val: p.instagram, icon: '📸' },
    { label: 'LinkedIn',  val: p.linkedin,  icon: '💼' },
  ].filter(r => r.val);

  if (!redes.length) return '';

  return `
    <div class="card" style="margin-bottom:22px;">
      <div class="card-header"><span class="card-title">🌐 Redes Sociales</span></div>
      <div class="card-body" style="display:flex;gap:12px;flex-wrap:wrap;">
        ${redes.map(r => `
          <a href="${r.val.startsWith('http') ? escHtml(r.val) : 'https://' + escHtml(r.val)}"
             target="_blank" class="btn btn-ghost">
            ${r.icon} ${r.label}
          </a>`).join('')}
      </div>
    </div>`;
}

// ============ QR ============

function getQRText() {
  if (!profileData) return '';
  const d = profileData;

  if (profileTipo === 'agente') {
    return [
      'BEGIN:VCARD', 'VERSION:3.0',
      `FN:${d.nombre || ''}`,
      `ORG:${d.empresa || ''}`,
      `TITLE:${d.cargo || ''}`,
      `TEL;TYPE=CELL:${d.telefono || ''}`,
      `EMAIL:${d.correo || ''}`,
      `ADR;TYPE=WORK:;;${d.direccion || ''};${d.ciudad || ''};;;${d.pais || ''}`,
      'END:VCARD'
    ].join('\n');
  } else {
    return [
      'BEGIN:VCARD', 'VERSION:3.0',
      `FN:${d.empresa || ''}`,
      `ORG:${d.empresa || ''}`,
      `TEL;TYPE=WORK:${d.telefono || ''}`,
      `EMAIL:${d.correo || ''}`,
      `URL:${d.web || ''}`,
      `ADR;TYPE=WORK:;;${d.direccion || ''};${d.ciudad || ''};;;${d.pais || ''}`,
      'END:VCARD'
    ].join('\n');
  }
}

function getQRImageURL(size = 220) {
  const d = profileData;
  const foto = profileTipo === 'agente' ? d.foto : d.logo;
  if (foto && (foto.startsWith('data:') || foto.startsWith('http'))) return foto;

  const text = getQRText();
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(text)}`;
}

function renderQRInline() {
  const wrap = document.getElementById('qr-inline');
  if (!wrap) return;

  const url = getQRImageURL(160);
  wrap.innerHTML = `
    <div class="qr-box">
      <img src="${url}" width="160" height="160" alt="QR" onerror="this.parentElement.innerHTML='<p class=\\'text-muted\\'>Sin QR disponible</p>'">
    </div>`;
}

function showQRModal() {
  const display = document.getElementById('qr-modal-display');
  const nombre  = profileTipo === 'agente' ? profileData?.nombre : profileData?.empresa;
  display.innerHTML = '';

  const url = getQRImageURL(220);
  display.innerHTML = `
    <div class="qr-box" style="display:inline-block;">
      <img src="${url}" width="220" height="220" alt="QR">
    </div>`;

  document.getElementById('qr-modal-name').textContent = nombre || '';
  openModal('modal-qr');
}

function downloadQRInline() {
  const img = document.querySelector('#qr-inline img');
  if (!img) { showToast('No hay QR para descargar', 'warning'); return; }
  downloadImgSrc(img.src);
}

function downloadQR() {
  const img = document.querySelector('#qr-modal-display img');
  if (!img) return;
  downloadImgSrc(img.src);
}

function downloadImgSrc(src) {
  const nombre = profileTipo === 'agente' ? profileData?.nombre : profileData?.empresa;
  const filename = `qr-${(nombre || 'perfil').replace(/\s+/g,'-').toLowerCase()}.png`;

  if (src.startsWith('data:')) {
    const a = document.createElement('a');
    a.href = src; a.download = filename; a.click();
  } else {
    fetch(src)
      .then(r => r.blob())
      .then(blob => {
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = filename; a.click();
        URL.revokeObjectURL(a.href);
      })
      .catch(() => showToast('Error al descargar', 'error'));
  }
}

function copyInfo() {
  if (!profileData) return;
  const d = profileData;
  const lines = profileTipo === 'agente'
    ? [`Nombre: ${d.nombre}`, `Cargo: ${d.cargo}`, `Empresa: ${d.empresa}`,
       `Teléfono: ${d.telefono}`, `WhatsApp: ${d.whatsapp}`, `Correo: ${d.correo}`,
       `Ciudad: ${d.ciudad}${d.pais ? ', '+d.pais : ''}`]
    : [`Empresa: ${d.empresa}`, `Contacto: ${d.contacto}`, `Teléfono: ${d.telefono}`,
       `WhatsApp: ${d.whatsapp}`, `Correo: ${d.correo}`, `Web: ${d.web}`,
       `Ciudad: ${d.ciudad}${d.pais ? ', '+d.pais : ''}`];

  const txt = lines.filter(l => !l.endsWith(': ')).join('\n');
  navigator.clipboard.writeText(txt)
    .then(() => showToast('Información copiada', 'success'))
    .catch(() => showToast('No se pudo copiar', 'error'));
}

function editarRegistro() {
  if (!profileData) return;
  const url = profileTipo === 'agente'
    ? `agentes.html?edit=${profileData.id}`
    : `proveedores.html?edit=${profileData.id}`;
  window.location.href = url;
}

function toggleFavPerfil() {
  if (!profileData) return;
  const ahora = DataManager.toggleFavorito(profileTipo, profileData.id);
  // Update button text
  const btn = document.querySelector('.profile-actions .btn:last-child');
  if (btn) btn.textContent = ahora ? '⭐ Favorito' : '☆ Favorito';
  showToast(ahora ? 'Agregado a favoritos' : 'Quitado de favoritos', 'info', 1800);
}
