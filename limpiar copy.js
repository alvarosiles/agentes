const fs = require("fs");
const path = require("path");

function limpiarTexto(texto) {
	let resultado = texto;
 
// resultado = resultado.replace(
//   /<SView\b[^>]*>/g,
//   (match) => {
//     return match
//       // elimina comentarios //
//       .replace(/\s*\/\/.*?(?=\s|>)/g, "")
//       // limpia espacios dobles
//       .replace(/\s{2,}/g, " ")
//       .trim();
//   }
// );
 
//  resultado = resultado.replace(
//   /style=\{\{([\s\S]*?)\}\}/g,
//   (match, contenido) => {
//     return `style={{ ${contenido
//       .replace(/\s*\/\/.*$/gm, "")   // elimina comentarios //
//       .replace(/\s*\n\s*/g, " ")     // quita saltos de línea
//       .replace(/\s{2,}/g, " ")       // espacios dobles
//       .trim()} }}`;
//   }
// );

//  resultado = resultado.replace(
//   /<SPage\b[^>]*>/g,
//   (match) => {
//     let limpio = match;

//     // no tocar si hay funciones dentro
//     if (match.includes("=>") || match.includes("function")) {
//       return match;
//     }

//     limpio = limpio
//       .replace(/\s*\/\/.*?(?=\s|>)/g, "")
//       .replace(/\s*\n\s*/g, " ")
//       .replace(/\s{2,}/g, " ")
//       .trim();

//     return limpio;
//   }
// );

 resultado = resultado.replace(
  /(\w+\s*=\s*(await\s+)?[a-zA-Z0-9_.]+\(([\s\S]*?)\))/g,
  (match) => {
    if (match.includes("=>") || match.includes("function")) {
      return match; // no tocar funciones complejas
    }

    return match
      .replace(/\s*\n\s*/g, " ")
      .replace(/\s{2,}/g, " ")
      .replace(/\(\s+/g, "(")
      .replace(/\s+\)/g, ")")
      .trim();
  }
);

	return resultado;
}

function recorrerArchivos(dir) {
	const entradas = fs.readdirSync(dir, { withFileTypes: true });

	for (const entrada of entradas) {
		const rutaCompleta = path.join(dir, entrada.name);

		// Entrar en subcarpetas
		if (entrada.isDirectory()) {
			recorrerArchivos(rutaCompleta);
			continue;
		}

		// Solo archivos .js
		if (!entrada.name.endsWith(".js")) {
			continue;
		}

		// Evita modificar este mismo script
		if (entrada.name === path.basename(__filename)) {
			continue;
		}

		try {
			const textoOriginal = fs.readFileSync(rutaCompleta, "utf8");

			// Limpia contenido
			const textoLimpio = limpiarTexto(textoOriginal);

			// Guarda solo si hubo cambios
			if (textoLimpio !== textoOriginal) {
				fs.writeFileSync(rutaCompleta, textoLimpio, "utf8");
				console.log(`Limpiado: ${rutaCompleta}`);
			}
		} catch (error) {
			console.log(`Error en ${rutaCompleta}:`, error.message);
		}
	}
}

// Carpeta objetivo
const carpetaObjetivo = path.join(__dirname, "archivos");

// Verifica existencia
if (!fs.existsSync(carpetaObjetivo)) {
	console.log('La carpeta "archivos" no existe');
	process.exit(1);
}

// Ejecuta limpieza
recorrerArchivos(carpetaObjetivo);

console.log("Proceso de limpieza completado");