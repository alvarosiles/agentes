/* app.js — Dashboard principal */

document.addEventListener('DOMContentLoaded', () => {
  initSidebar('index');
  renderStats();
  renderRecentAgentes();
  renderRecentProveedores();
  fixDashGrid();
});

function renderStats() {
  const agentes    = DataManager.getAgentes();
  const provs      = DataManager.getProveedores();
  const favoritos  = DataManager.getFavoritos();

  setText('stat-agentes',      agentes.length);
  setText('stat-proveedores',  provs.length);
  setText('stat-activos',      agentes.filter(a => a.estado === 'Activo').length);
  setText('stat-prov-activos', provs.filter(p => p.estado === 'Activo').length);
  setText('stat-favoritos',    favoritos.length);
}

function renderRecentAgentes() {
  const agentes = DataManager.getAgentes().slice(-5).reverse();
  const tbody   = document.getElementById('tb-agentes');
  if (!tbody) return;

  if (!agentes.length) {
    tbody.innerHTML = `<tr><td colspan="3" class="text-center text-muted" style="padding:24px;">Sin registros</td></tr>`;
    return;
  }

  tbody.innerHTML = agentes.map(a => `
    <tr style="cursor:pointer;" onclick="goTo('pages/perfil.html?tipo=agente&id=${a.id}')">
      <td>
        <div class="tbl-user">
          <div class="tbl-avatar">${avatarHTML(a.foto, a.nombre, 34)}</div>
          <div>
            <div class="tbl-name truncate" style="max-width:130px;">${escHtml(a.nombre)}</div>
            <div class="tbl-sub truncate" style="max-width:130px;">${escHtml(a.cargo || '')}</div>
          </div>
        </div>
      </td>
      <td class="text-muted">${escHtml(a.ciudad || '—')}</td>
      <td>${getBadge(a.estado)}</td>
    </tr>`).join('');
}

function renderRecentProveedores() {
  const provs = DataManager.getProveedores().slice(-5).reverse();
  const tbody  = document.getElementById('tb-proveedores');
  if (!tbody) return;

  if (!provs.length) {
    tbody.innerHTML = `<tr><td colspan="3" class="text-center text-muted" style="padding:24px;">Sin registros</td></tr>`;
    return;
  }

  tbody.innerHTML = provs.map(p => `
    <tr style="cursor:pointer;" onclick="goTo('pages/perfil.html?tipo=proveedor&id=${p.id}')">
      <td>
        <div class="tbl-user">
          <div class="tbl-avatar">${avatarHTML(p.logo, p.empresa, 34)}</div>
          <div>
            <div class="tbl-name truncate" style="max-width:130px;">${escHtml(p.empresa)}</div>
            <div class="tbl-sub truncate" style="max-width:130px;">${escHtml(p.contacto || '')}</div>
          </div>
        </div>
      </td>
      <td class="text-muted">${escHtml(p.categoria || '—')}</td>
      <td>${getBadge(p.estado)}</td>
    </tr>`).join('');
}

function fixDashGrid() {
  // En móvil el grid de 2 col se hace 1 col
  const grid = document.querySelector('.dash-grid');
  if (!grid) return;
  const update = () => {
    grid.style.gridTemplateColumns = window.innerWidth < 768 ? '1fr' : '1fr 1fr';
  };
  update();
  window.addEventListener('resize', update);
}

// Helpers
function setText(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val;
}

function goTo(url) { window.location.href = url; }
