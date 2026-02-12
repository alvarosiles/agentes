import {
  listarEmpleados,
  guardarEmpleado,
  eliminar,
  obtener,
  eliminarTodo
} from "./empleados.js";

const tabla = document.getElementById("tablaEmpleados");
const paginacion = document.getElementById("paginacion");
const buscador = document.getElementById("buscador");
const btnNuevo = document.getElementById("btnNuevo");
const btnEliminarTodo = document.getElementById("btnEliminarTodo");
const confirmDeleteBtn = document.getElementById("confirmDelete");

const excelFile = document.getElementById("excelFile");
const btnImportar = document.getElementById("btnImportar");
const btnExportar = document.getElementById("btnExportar");
const btnConsolidar = document.getElementById("btnConsolidar");

let empleadosGlobal = [];
let empleadosFiltrados = [];
let datosExcel = [];

let paginaActual = 1;
const registrosPorPagina = 10;
let idEliminar = null;

/* ========================= */
/* INICIALIZAR               */
/* ========================= */
document.addEventListener("DOMContentLoaded", async () => {
  await cargarDesdeFirebase();
});

/* ========================= */
/* CARGAR DESDE FIREBASE     */
/* ========================= */
async function cargarDesdeFirebase() {
  const snapshot = await listarEmpleados();
  empleadosGlobal = [];

  snapshot.forEach(doc => {
    empleadosGlobal.push({ id: doc.id, ...doc.data() });
  });

  empleadosFiltrados = [...empleadosGlobal];
  paginaActual = 1;

  renderTabla();
  renderPaginacion();
}

/* ========================= */
/* RENDER TABLA              */
/* ========================= */
function renderTabla() {

  const inicio = (paginaActual - 1) * registrosPorPagina;
  const fin = inicio + registrosPorPagina;

  const datosPagina = empleadosFiltrados.slice(inicio, fin);

  let html = "";

  datosPagina.forEach((emp, index) => {
    html += `
      <tr>
        <td>${inicio + index + 1}</td>
        <td>${emp.nombre || ""}</td>
        <td>${emp.edad || ""}</td>
        <td>${emp.cedula || ""}</td>
        <td>${emp.sexo || ""}</td>
        <td>${emp.cargo || ""}</td>
        <td>${emp.telefono || ""}</td>
        <td>Guardado</td>
        <td class="text-center">
          <button class="btn btn-sm btn-warning me-1 btnEditar" data-id="${emp.id}">
            <i class="bi bi-pencil"></i>
          </button>
          <button class="btn btn-sm btn-danger btnEliminar" data-id="${emp.id}">
            <i class="bi bi-trash"></i>
          </button>
        </td>
      </tr>
    `;
  });

  tabla.innerHTML = html;
}

/* ========================= */
/* PAGINACIÓN                */
/* ========================= */
function renderPaginacion() {

  const totalPaginas = Math.ceil(empleadosFiltrados.length / registrosPorPagina);
  let html = "";

  for (let i = 1; i <= totalPaginas; i++) {
    html += `
      <li class="page-item ${i === paginaActual ? "active" : ""}">
        <a class="page-link" href="#">${i}</a>
      </li>
    `;
  }

  paginacion.innerHTML = html;

  document.querySelectorAll(".page-link").forEach((btn, index) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      paginaActual = index + 1;
      renderTabla();
      renderPaginacion();
    });
  });
}

/* ========================= */
/* BUSCADOR                  */
/* ========================= */
buscador.addEventListener("input", (e) => {

  const valor = e.target.value.toLowerCase();

  empleadosFiltrados = empleadosGlobal.filter(emp =>
    emp.nombre?.toLowerCase().includes(valor) ||
    emp.cedula?.toLowerCase().includes(valor) ||
    emp.cargo?.toLowerCase().includes(valor)
  );

  paginaActual = 1;
  renderTabla();
  renderPaginacion();
});

/* ========================= */
/* NUEVO EMPLEADO            */
/* ========================= */
btnNuevo.addEventListener("click", () => {
  document.getElementById("formEmpleado").reset();
  document.getElementById("idEmpleado").value = "";
  new bootstrap.Modal(document.getElementById("empleadoModal")).show();
});

/* ========================= */
/* GUARDAR EMPLEADO          */
/* ========================= */
document.getElementById("formEmpleado").addEventListener("submit", async (e) => {
  e.preventDefault();

  const id = document.getElementById("idEmpleado").value;

  const data = {
    nombre: document.getElementById("nombre").value,
    cedula: document.getElementById("cedula").value,
    edad: document.getElementById("edad").value,
    sexo: document.getElementById("sexo").value,
    cargo: document.getElementById("cargo").value,
    telefono: document.getElementById("telefono").value
  };

  await guardarEmpleado(data, id);

  bootstrap.Modal.getInstance(document.getElementById("empleadoModal")).hide();

  iziToast.success({
    title: "OK",
    message: id ? "Empleado actualizado" : "Empleado registrado"
  });

  cargarDesdeFirebase();
});

/* ========================= */
/* EDITAR / ELIMINAR         */
/* ========================= */
document.addEventListener("click", async (e) => {

  if (e.target.closest(".btnEditar")) {
    const id = e.target.closest(".btnEditar").dataset.id;
    const doc = await obtener(id);

    if (doc.exists()) {
      const emp = doc.data();

      document.getElementById("idEmpleado").value = id;
      document.getElementById("nombre").value = emp.nombre;
      document.getElementById("cedula").value = emp.cedula;
      document.getElementById("edad").value = emp.edad;
      document.getElementById("sexo").value = emp.sexo;
      document.getElementById("cargo").value = emp.cargo;
      document.getElementById("telefono").value = emp.telefono;

      new bootstrap.Modal(document.getElementById("empleadoModal")).show();
    }
  }

  if (e.target.closest(".btnEliminar")) {
    idEliminar = e.target.closest(".btnEliminar").dataset.id;
    new bootstrap.Modal(document.getElementById("confirmModal")).show();
  }
});

/* ========================= */
/* CONFIRMAR ELIMINAR        */
/* ========================= */
confirmDeleteBtn.addEventListener("click", async () => {

  if (!idEliminar) return;

  await eliminar(idEliminar);

  bootstrap.Modal.getInstance(document.getElementById("confirmModal")).hide();

  iziToast.success({
    title: "OK",
    message: "Empleado eliminado"
  });

  cargarDesdeFirebase();
});

/* ========================= */
/* ELIMINAR TODO             */
/* ========================= */
btnEliminarTodo.addEventListener("click", async () => {

  if (!confirm("¿Eliminar todos los empleados?")) return;

  await eliminarTodo();

  iziToast.success({
    title: "OK",
    message: "Todos eliminados"
  });

  cargarDesdeFirebase();
});

/* ========================= */
/* IMPORTAR EXCEL            */
/* ========================= */
btnImportar.addEventListener("click", () => {
  excelFile.click();
});

excelFile.addEventListener("change", (e) => {

  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();

  reader.onload = (event) => {

    const workbook = XLSX.read(new Uint8Array(event.target.result), { type: "array" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    datosExcel = XLSX.utils.sheet_to_json(sheet);

    if (datosExcel.length === 0) {
      iziToast.warning({ title: "Vacío", message: "El Excel no tiene datos" });
      return;
    }

    empleadosFiltrados = [...datosExcel];
    paginaActual = 1;

    renderTabla();
    renderPaginacion();

    btnConsolidar.disabled = false;
  };

  reader.readAsArrayBuffer(file);
});

/* ========================= */
/* CONSOLIDAR EXCEL          */
/* ========================= */
btnConsolidar.addEventListener("click", async () => {

  for (let emp of datosExcel) {
    await guardarEmpleado(emp);
  }

  iziToast.success({
    title: "OK",
    message: "Datos importados correctamente"
  });

  btnConsolidar.disabled = true;

  cargarDesdeFirebase();
});

/* ========================= */
/* EXPORTAR EXCEL            */
/* ========================= */
btnExportar.addEventListener("click", () => {

  if (empleadosGlobal.length === 0) {
    iziToast.warning({
      title: "Vacío",
      message: "No hay empleados para exportar"
    });
    return;
  }

  const data = empleadosGlobal.map(emp => ({
    nombre: emp.nombre,
    edad: emp.edad,
    cedula: emp.cedula,
    sexo: emp.sexo,
    cargo: emp.cargo,
    telefono: emp.telefono
  }));

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Empleados");

  XLSX.writeFile(wb, "empleados.xlsx");
});
