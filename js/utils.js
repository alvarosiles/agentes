/* ============================================
   utils.js — Datos, Storage y helpers compartidos
   ============================================ */

// ============ Datos por defecto ============

const DEFAULT_AGENTES = [
  {
    id: 1,
    nombre: "Juan Pérez",
    foto: "",
    empresa: "Empresa Demo",
    cargo: "Agente Comercial",
    categoria: "Ventas",
    telefono: "+59170000001",
    whatsapp: "+59170000001",
    correo: "juan@email.com",
    direccion: "Av. Principal 123",
    ciudad: "La Paz",
    pais: "Bolivia",
    fechaRegistro: "2024-01-15",
    estado: "Activo",
    notas: "Agente principal de la zona norte",
    qr: ""
  },
  {
    id: 2,
    nombre: "María García",
    foto: "",
    empresa: "Comercial Sur",
    cargo: "Directora Regional",
    categoria: "Gerencia",
    telefono: "+59176543210",
    whatsapp: "+59176543210",
    correo: "maria@comercialsur.com",
    direccion: "Calle Los Álamos 456",
    ciudad: "Santa Cruz",
    pais: "Bolivia",
    fechaRegistro: "2024-02-20",
    estado: "Activo",
    notas: "Cubre toda la zona sur y este del país",
    qr: ""
  },
  {
    id: 3,
    nombre: "Carlos López",
    foto: "",
    empresa: "Tech Solutions",
    cargo: "Ejecutivo de Ventas",
    categoria: "Tecnología",
    telefono: "+59171234567",
    whatsapp: "+59171234567",
    correo: "carlos@techsol.com",
    direccion: "Av. Tecnológica 789",
    ciudad: "Cochabamba",
    pais: "Bolivia",
    fechaRegistro: "2024-03-10",
    estado: "Inactivo",
    notas: "Especialista en soluciones tecnológicas",
    qr: ""
  },
  {
    id: 4,
    nombre: "Ana Flores",
    foto: "",
    empresa: "Distribuidora Norte",
    cargo: "Agente de Campo",
    categoria: "Distribución",
    telefono: "+59179876543",
    whatsapp: "+59179876543",
    correo: "ana@distnorte.com",
    direccion: "Calle Mercado 321",
    ciudad: "Oruro",
    pais: "Bolivia",
    fechaRegistro: "2024-04-05",
    estado: "Activo",
    notas: "Responsable del altiplano",
    qr: ""
  }
];

const DEFAULT_PROVEEDORES = [
  {
    id: 1,
    empresa: "Proveedor Tech S.A.",
    contacto: "Roberto Mendoza",
    logo: "",
    categoria: "Tecnología",
    telefono: "+59170000002",
    whatsapp: "+59170000002",
    correo: "contacto@provtech.com",
    direccion: "Zona Industrial, Calle 5",
    ciudad: "La Paz",
    pais: "Bolivia",
    web: "https://provtech.com",
    facebook: "",
    instagram: "",
    linkedin: "",
    qr: "",
    estado: "Activo",
    notas: "Proveedor principal de equipos tecnológicos"
  },
  {
    id: 2,
    empresa: "Distribuidora Central",
    contacto: "Ana Rodríguez",
    logo: "",
    categoria: "Distribución",
    telefono: "+59174567890",
    whatsapp: "+59174567890",
    correo: "info@districentral.com",
    direccion: "Mercado Central, Local 45",
    ciudad: "Santa Cruz",
    pais: "Bolivia",
    web: "",
    facebook: "",
    instagram: "",
    linkedin: "",
    qr: "",
    estado: "Activo",
    notas: "Distribuidor mayorista de productos varios"
  },
  {
    id: 3,
    empresa: "Servicios Integrales S.R.L.",
    contacto: "Miguel Torres",
    logo: "",
    categoria: "Servicios",
    telefono: "+59172223344",
    whatsapp: "+59172223344",
    correo: "miguel@servintel.com",
    direccion: "Av. Independencia 567",
    ciudad: "Cochabamba",
    pais: "Bolivia",
    web: "",
    facebook: "",
    instagram: "",
    linkedin: "",
    qr: "",
    estado: "Inactivo",
    notas: "Proveedor de servicios de mantenimiento",
  }
];

const DEFAULT_CATEGORIAS = [
  "Ventas", "Tecnología", "Gerencia", "Distribución",
  "Manufactura", "Servicios", "Comercial", "Importaciones", "Otro"
];

// ============ LocalStorage ============

const Storage = {
  get(key, def = null) {
    try {
      const v = localStorage.getItem(key);
      return v !== null ? JSON.parse(v) : def;
    } catch { return def; }
  },
  set(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); return true; }
    catch { return false; }
  },
  remove(key) { localStorage.removeItem(key); }
};

// ============ DataManager ============

const DataManager = {
  // --- Agentes ---
  getAgentes()    { return Storage.get('ag_agentes', DEFAULT_AGENTES); },
  saveAgentes(a)  { Storage.set('ag_agentes', a); },
  getAgente(id)   { return this.getAgentes().find(a => a.id == id) || null; },

  addAgente(data) {
    const list = this.getAgentes();
    const id = list.length ? Math.max(...list.map(a => a.id)) + 1 : 1;
    const item = { ...data, id, fechaRegistro: data.fechaRegistro || today() };
    list.push(item);
    this.saveAgentes(list);
    return item;
  },

  updateAgente(id, data) {
    const list = this.getAgentes();
    const i = list.findIndex(a => a.id == id);
    if (i === -1) return false;
    list[i] = { ...list[i], ...data, id: list[i].id };
    this.saveAgentes(list);
    return true;
  },

  deleteAgente(id) {
    this.saveAgentes(this.getAgentes().filter(a => a.id != id));
  },

  // --- Proveedores ---
  getProveedores()   { return Storage.get('ag_proveedores', DEFAULT_PROVEEDORES); },
  saveProveedores(p) { Storage.set('ag_proveedores', p); },
  getProveedor(id)   { return this.getProveedores().find(p => p.id == id) || null; },

  addProveedor(data) {
    const list = this.getProveedores();
    const id = list.length ? Math.max(...list.map(p => p.id)) + 1 : 1;
    const item = { ...data, id };
    list.push(item);
    this.saveProveedores(list);
    return item;
  },

  updateProveedor(id, data) {
    const list = this.getProveedores();
    const i = list.findIndex(p => p.id == id);
    if (i === -1) return false;
    list[i] = { ...list[i], ...data, id: list[i].id };
    this.saveProveedores(list);
    return true;
  },

  deleteProveedor(id) {
    this.saveProveedores(this.getProveedores().filter(p => p.id != id));
  },

  // --- Categorías ---
  getCategorias()    { return Storage.get('ag_categorias', DEFAULT_CATEGORIAS); },
  saveCategorias(c)  { Storage.set('ag_categorias', c); },

  addCategoria(nombre) {
    const cats = this.getCategorias();
    if (!cats.includes(nombre)) { cats.push(nombre); this.saveCategorias(cats); }
  },

  deleteCategoria(nombre) {
    this.saveCategorias(this.getCategorias().filter(c => c !== nombre));
  },

  // --- Favoritos ---
  getFavoritos()     { return Storage.get('ag_favoritos', []); },
  esFavorito(tipo, id) { return this.getFavoritos().includes(`${tipo}-${id}`); },
  toggleFavorito(tipo, id) {
    const favs = this.getFavoritos();
    const key = `${tipo}-${id}`;
    const i = favs.indexOf(key);
    if (i === -1) favs.push(key); else favs.splice(i, 1);
    Storage.set('ag_favoritos', favs);
    return i === -1; // true = ahora es favorito
  },

  // --- Config ---
  getConfig()     { return Storage.get('ag_config', { orden: 'nombre', vista: 'tarjetas' }); },
  saveConfig(c)   { Storage.set('ag_config', c); },
};

// ============ Helpers ============

function today() {
  return new Date().toISOString().split('T')[0];
}

function formatDate(str) {
  if (!str) return '—';
  try {
    return new Date(str + 'T12:00:00').toLocaleDateString('es-ES', {
      day: '2-digit', month: 'short', year: 'numeric'
    });
  } catch { return str; }
}

function getInitials(name) {
  return (name || '?').trim().split(/\s+/).slice(0, 2).map(n => n[0].toUpperCase()).join('');
}

function getBadge(estado) {
  const ok = estado === 'Activo';
  return `<span class="badge ${ok ? 'badge-success' : 'badge-danger'}">${ok ? '🟢' : '🔴'} ${estado}</span>`;
}

function avatarHTML(foto, nombre, size = 60) {
  const s = `width:${size}px;height:${size}px;border-radius:50%;object-fit:cover;`;
  if (foto && (foto.startsWith('data:') || foto.startsWith('http'))) {
    return `<img src="${foto}" alt="${escHtml(nombre)}" style="${s}" onerror="this.replaceWith(document.createTextNode('${getInitials(nombre)}'))">`;
  }
  return `<span style="font-size:${Math.round(size * 0.33)}px;font-weight:700;">${getInitials(nombre)}</span>`;
}

function whatsappURL(num, msg = '') {
  const clean = (num || '').replace(/\D/g, '');
  if (!clean) return '#';
  return `https://wa.me/${clean}${msg ? '?text=' + encodeURIComponent(msg) : ''}`;
}

function escHtml(str) {
  return String(str || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function getParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}

function fileToBase64(file) {
  return new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = e => res(e.target.result);
    r.onerror = rej;
    r.readAsDataURL(file);
  });
}

// ============ Toast ============

function showToast(msg, type = 'info', ms = 3200) {
  let box = document.getElementById('toast-container');
  if (!box) {
    box = document.createElement('div');
    box.id = 'toast-container';
    box.className = 'toast-container';
    document.body.appendChild(box);
  }
  const icons = { success: '✅', error: '❌', info: 'ℹ️', warning: '⚠️' };
  const t = document.createElement('div');
  t.className = `toast ${type}`;
  t.innerHTML = `<span>${icons[type] || 'ℹ️'}</span><span style="flex:1">${escHtml(msg)}</span>`;
  box.appendChild(t);
  setTimeout(() => {
    t.classList.add('out');
    setTimeout(() => t.remove(), 320);
  }, ms);
}

// ============ Confirm Dialog ============

function confirmDialog(msg) {
  return new Promise(resolve => {
    const ov = document.createElement('div');
    ov.className = 'modal-overlay active';
    ov.innerHTML = `
      <div class="modal" style="max-width:400px;">
        <div class="modal-header">
          <span class="modal-title">⚠️ Confirmar acción</span>
        </div>
        <div class="modal-body">
          <p style="font-size:14px;line-height:1.6;">${msg}</p>
        </div>
        <div class="modal-footer">
          <button class="btn btn-ghost" id="cd-no">Cancelar</button>
          <button class="btn btn-danger" id="cd-yes">Eliminar</button>
        </div>
      </div>`;
    document.body.appendChild(ov);
    const done = v => { ov.remove(); resolve(v); };
    ov.querySelector('#cd-yes').onclick = () => done(true);
    ov.querySelector('#cd-no').onclick  = () => done(false);
    ov.onclick = e => { if (e.target === ov) done(false); };
  });
}

// ============ Sidebar ============

function initSidebar(activePage) {
  const el = document.getElementById('sidebar');
  if (!el) return;

  const sub = window.location.pathname.includes('/pages/');
  const base = sub ? '../' : '';

  const items = [
    { href: `${base}index.html`,              icon: '🏠', label: 'Dashboard',     key: 'index' },
    { href: `${base}pages/agentes.html`,      icon: '👥', label: 'Agentes',       key: 'agentes' },
    { href: `${base}pages/proveedores.html`,  icon: '🏢', label: 'Proveedores',   key: 'proveedores' },
    { href: `${base}pages/qr.html`,           icon: '📱', label: 'Códigos QR',    key: 'qr' },
    { href: `${base}pages/categorias.html`,   icon: '📁', label: 'Categorías',    key: 'categorias' },
    { href: `${base}pages/reportes.html`,     icon: '📊', label: 'Reportes',      key: 'reportes' },
    { href: `${base}pages/configuracion.html`,icon: '⚙️', label: 'Configuración', key: 'configuracion' },
  ];

  el.innerHTML = `
    <div class="sidebar-header">
      <a href="${base}index.html" class="sidebar-logo">
        <div class="logo-icon">👥</div>
        <div>
          <div class="logo-text">Agentes</div>
          <div class="logo-sub">Sistema de Gestión</div>
        </div>
      </a>
    </div>
    <nav class="sidebar-nav">
      <div class="nav-section-title">Menú</div>
      ${items.map(it => `
        <a href="${it.href}" class="nav-item${it.key === activePage ? ' active' : ''}">
          <span class="nav-icon">${it.icon}</span>
          <span>${it.label}</span>
        </a>`).join('')}
    </nav>
    <div class="sidebar-footer">agentes.alvarosiles.cloud</div>
  `;

  // Hamburger
  const ham = document.getElementById('hamburger');
  const ov  = document.getElementById('sidebar-overlay');
  if (ham) {
    ham.onclick = () => { el.classList.toggle('open'); ov && ov.classList.toggle('active'); };
  }
  if (ov) {
    ov.onclick = () => { el.classList.remove('open'); ov.classList.remove('active'); };
  }
}

// Cerrar modal al hacer click fuera
function modalClickOutside(overlayId) {
  const ov = document.getElementById(overlayId);
  if (ov) ov.addEventListener('click', e => { if (e.target === ov) closeModal(overlayId); });
}

function openModal(id)  { const m = document.getElementById(id); if (m) m.classList.add('active'); }
function closeModal(id) { const m = document.getElementById(id); if (m) m.classList.remove('active'); }
