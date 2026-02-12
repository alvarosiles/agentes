import {
  addEmpleado,
  getEmpleados,
  getEmpleado,
  updateEmpleado,
  deleteEmpleado
} from "./firebase.js";

/* LISTAR */
export async function listarEmpleados() {
  return await getEmpleados();
}

/* GUARDAR */
export async function guardarEmpleado(data, id) {
  if (id) {
    await updateEmpleado(id, data);
  } else {
    await addEmpleado(data);
  }
}

/* ELIMINAR UNO */
export async function eliminar(id) {
  await deleteEmpleado(id);
}

/* OBTENER UNO */
export async function obtener(id) {
  return await getEmpleado(id);
}

/* ELIMINAR TODO */
export async function eliminarTodo() {
  const snapshot = await getEmpleados();

  const promises = [];

  snapshot.forEach(doc => {
    promises.push(deleteEmpleado(doc.id));
  });

  await Promise.all(promises);
}
