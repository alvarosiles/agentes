import {
  listarEmpleados,
  guardarEmpleado,
  eliminar,
  obtener
} from "./empleados.js";

const tabla = document.getElementById("tablaEmpleados");
const form = document.getElementById("formEmpleado");
const modal = new bootstrap.Modal(document.getElementById("empleadoModal"));
const confirmModal = new bootstrap.Modal(document.getElementById("confirmModal"));

let idEliminar = null;

document.addEventListener("DOMContentLoaded", cargarTabla);

async function cargarTabla() {
  tabla.innerHTML = "";
  const empleados = await listarEmpleados();

  empleados.forEach(doc => {
    const e = doc.data();

    tabla.innerHTML += `
      <tr>
        <td>${e.nombre}</td>
        <td>${e.edad}</td>
        <td>${e.cedula}</td>
        <td>${e.sexo}</td>
        <td>${e.cargo}</td>
        <td>${e.telefono}</td>
        <td>
          <button class="btn btn-warning btn-sm" onclick="editar('${doc.id}')">
            <i class="bi bi-pencil"></i>
          </button>
          <button class="btn btn-danger btn-sm" onclick="confirmarEliminar('${doc.id}')">
            <i class="bi bi-trash"></i>
          </button>
        </td>
      </tr>
    `;
  });
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const id = document.getElementById("idEmpleado").value;

  const data = {
    nombre: nombre.value,
    cedula: cedula.value,
    edad: edad.value,
    sexo: sexo.value,
    cargo: cargo.value,
    telefono: telefono.value
  };

  await guardarEmpleado(data, id);

  modal.hide();
  form.reset();
  cargarTabla();

  iziToast.success({ title: "OK", message: "Guardado correctamente" });
});

window.editar = async (id) => {
  const doc = await obtener(id);
  const data = doc.data();

  idEmpleado.value = id;
  nombre.value = data.nombre;
  cedula.value = data.cedula;
  edad.value = data.edad;
  sexo.value = data.sexo;
  cargo.value = data.cargo;
  telefono.value = data.telefono;

  modal.show();
};

window.confirmarEliminar = (id) => {
  idEliminar = id;
  confirmModal.show();
};

document.getElementById("confirmDelete").addEventListener("click", async () => {
  await eliminar(idEliminar);
  confirmModal.hide();
  cargarTabla();
  iziToast.success({ title: "OK", message: "Eliminado correctamente" });
});
