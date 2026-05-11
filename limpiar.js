const fs = require("fs");
const path = require("path");

function limpiarTexto(texto) {
	let resultado = texto;
	resultado = resultado.replace(/^\s*\n/gm, "");
	resultado = resultado.replace(/^\s*console\.log\("%c".*\n?/gm, "");
	resultado = resultado.replace(/^\s*console\.clear\(\);.*\n?/gm, "");
	resultado = resultado.replace(/^\s*\/\/.*\n?/gm, "");
	return resultado;
}

function recorrerArchivos(dir) {
	const entradas = fs.readdirSync(dir, { withFileTypes: true });

	for (const entrada of entradas) {
		const rutaCompleta = path.join(dir, entrada.name);

		if (entrada.isDirectory()) {
			recorrerArchivos(rutaCompleta);
			continue;
		}

		if (!entrada.name.endsWith(".js")) {
			continue;
		}

		if (entrada.name === path.basename(__filename)) {
			continue;
		}

		const textoOriginal = fs.readFileSync(rutaCompleta, "utf8");
		const textoLimpio = limpiarTexto(textoOriginal);

		if (textoLimpio !== textoOriginal) {
			fs.writeFileSync(rutaCompleta, textoLimpio, "utf8");
			console.log(`Limpiado: ${rutaCompleta}`);
		}
	}
}

recorrerArchivos(__dirname);

console.log("Proceso de limpieza completado");