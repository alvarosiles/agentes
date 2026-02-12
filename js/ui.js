import { listarEmpleados, guardarEmpleado, eliminarTodo } from "./empleados.js";
import { initDB, guardarCache, obtenerCache } from "./indexedDB.js";

const tabla = document.getElementById("tablaEmpleados");
const excelInput = document.getElementById("excelFile");
const btnImportar = document.getElementById("btnImportar");
const btnConsolidar = document.getElementById("btnConsolidar");
const btnExportar = document.getElementById("btnExportar");
const btnEliminarTodo = document.getElementById("btnEliminarTodo");

let datosExcel = [];

/* ========================== */
/* INICIALIZAR                */
/* ========================== */
document.addEventListener("DOMContentLoaded", async () => {
  await initDB();

  const cache = await obtenerCache();
  if (cache.length > 0) {
    renderTabla(cache, "Cache");
  }

  cargarDesdeFirebase();
});

/* ========================== */
/* CARGAR FIREBASE            */
/* ========================== */
async function cargarDesdeFirebase() {
  const empleados = await listarEmpleados();
  const data = [];

  empleados.forEach(doc => {
    const e = doc.data();
    data.push({ id: doc.id, ...e });
  });

  guardarCache(data);
  renderTabla(data, "Guardado");
}

function renderTabla(data, estadoDefault) {
  tabla.innerHTML = "";

  data.forEach(emp => {
    tabla.innerHTML += `
      <tr>
        <td>${emp.nombre || ""}</td>
        <td>${emp.edad || ""}</td>
        <td>${emp.cedula || ""}</td>
        <td>${emp.sexo || ""}</td>
        <td>${emp.cargo || ""}</td>
        <td>${emp.telefono || ""}</td>
        <td>${estadoDefault}</td>
      </tr>
    `;
  });
}

/* ========================== */
/* IMPORTAR EXCEL             */
/* ========================== */
btnImportar.addEventListener("click", () => {

  const file = excelInput.files[0];
  if (!file) return;

  const reader = new FileReader();

  reader.onload = (e) => {
    const workbook = XLSX.read(new Uint8Array(e.target.result), { type: "array" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    datosExcel = XLSX.utils.sheet_to_json(sheet);

    renderTabla(datosExcel, "📄 Pendiente");
    btnConsolidar.disabled = false;
  };

  reader.readAsArrayBuffer(file);
});

/* ========================== */
/* CONSOLIDAR                 */
/* ========================== */
btnConsolidar.addEventListener("click", async () => {

  const filas = tabla.querySelectorAll("tr");

  for (let i = 0; i < datosExcel.length; i++) {

    const emp = datosExcel[i];
    const estadoCell = filas[i].children[6];

    try {
      estadoCell.innerHTML = "🔄 Guardando...";

      await guardarEmpleado(emp);

      estadoCell.innerHTML = "✅ Guardado";

    } catch {
      estadoCell.innerHTML = "❌ Error";
    }
  }

  cargarDesdeFirebase();
  btnConsolidar.disabled = true;
});

/* ========================== */
/* EXPORTAR                   */
/* ========================== */
btnExportar.addEventListener("click", async () => {

  const empleados = await listarEmpleados();
  let data = [];

  empleados.forEach(doc => data.push(doc.data()));

  if (data.length === 0) {
    data.push({
      nombre: "",
      edad: "",
      cedula: "",
      sexo: "",
      cargo: "",
      telefono: ""
    });
  }

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Empleados");

  XLSX.writeFile(wb, "empleados.xlsx");
});

/* ========================== */
/* ELIMINAR TODO              */
/* ========================== */
btnEliminarTodo.addEventListener("click", async () => {

  if (!confirm("¿Seguro que desea eliminar todo?")) return;

  await eliminarTodo();
  renderTabla([], "");
  guardarCache([]);

  iziToast.success({
    title: "OK",
    message: "Todos los registros eliminados"
  });
});
