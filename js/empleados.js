import {
  addEmpleado,
  getEmpleados,
  getEmpleado,
  updateEmpleado,
  deleteEmpleado
} from "./firebase.js";

export async function listarEmpleados() {
  return await getEmpleados();
}

export async function guardarEmpleado(data, id) {
  if (id) {
    await updateEmpleado(id, data);
  } else {
    await addEmpleado(data);
  }
}

export async function eliminar(id) {
  await deleteEmpleado(id);
}

export async function obtener(id) {
  return await getEmpleado(id);
}
