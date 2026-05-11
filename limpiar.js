const fs = require("fs");
const path = require("path");

function limpiarTexto(texto) {
	let resultado = texto;

	// Elimina líneas vacías o con solo espacios
	// Ejemplo:
	//
	// "     \n"
	//
	// Explicación:
	// ^      = inicio de línea
	// \s*    = espacios/tabs opcionales
	// \n     = salto de línea
	// gm     = global + multiline
	resultado = resultado.replace(/^\s*\n/gm, "");

	// Elimina líneas con:
	// console.log("%c ...");
	//
	// Ejemplo:
	// console.log("%cHola", "color:red");
	//
	// Explicación:
	// ^\s*                 = espacios al inicio
	// console\.log         = texto literal
	// \("%c"               = busca ("%c"
	// .*                   = cualquier cosa después
	// \n?                  = salto opcional
	resultado = resultado.replace(/^\s*console\.log\("%c".*\n?/gm, "");

	// Elimina líneas con:
	// console.clear();
	//
	// Explicación:
	// console\.clear\(\); = detecta exactamente console.clear();
	resultado = resultado.replace(/^\s*console\.clear\(\);.*\n?/gm, "");

	// Elimina comentarios de una línea:
	// // comentario
	//
	// Explicación:
	// ^\s* = espacios al inicio
	// //   = comentario
	// .*   = cualquier texto
	resultado = resultado.replace(/^\s*\/\/.*\n?/gm, "");

	return resultado;
}

function recorrerArchivos(dir) {
	const entradas = fs.readdirSync(dir, { withFileTypes: true });

	for (const entrada of entradas) {
		const rutaCompleta = path.join(dir, "archivos");
		// const rutaCompleta = path.join(dir, entrada.name);

		// Si es carpeta, entra recursivamente
		if (entrada.isDirectory()) {
			recorrerArchivos(rutaCompleta);
			continue;
		}

		// Solo procesa archivos .js
		if (!entrada.name.endsWith(".js")) {
			continue;
		}

		// Evita modificar este mismo script
		if (entrada.name === path.basename(__filename)) {
			continue;
		}

		const textoOriginal = fs.readFileSync(rutaCompleta, "utf8");

		// Limpia el contenido
		const textoLimpio = limpiarTexto(textoOriginal);

		// Guarda solo si hubo cambios
		if (textoLimpio !== textoOriginal) {
			fs.writeFileSync(rutaCompleta, textoLimpio, "utf8");
			console.log(`Limpiado: ${rutaCompleta}`);
		}
	}
}

// Empieza desde la carpeta actual
recorrerArchivos(__dirname);

console.log("Proceso de limpieza completado");