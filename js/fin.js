
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