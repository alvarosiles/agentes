const fs = require("fs");
const path = require("path");

function limpiarTexto(texto) {
	let resultado = texto;

	// Elimina líneas vacías
 	resultado = resultado.replace(/^\s*\/\/.*$/gm, "")

	// Elimina comentarios //
	resultado = resultado.replace(/^\s*\/\/.*\n?/g, "");

	// Elimina múltiples saltos de línea seguidos
	resultado = resultado.replace(/(\r?\n){2,}/g, "\n");


	// Elimina console.log("%c...") ❤
	resultado = resultado.replace(/^\s*console\.log\("%c".*\)\s*;?\s*$/gm, "");
	// Elimina console.clear();❤
	resultado = resultado.replace(/^\s*console\.clear\(\);\s*$/gm, "");
	// Busca: espacios antes de > ❤❤
	resultado = resultado.replace(/\s+>/g, ">");

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