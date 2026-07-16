Actúa como un desarrollador Senior especializado en HTML5, CSS3, JavaScript ES6, UX/UI y aplicaciones web estáticas.

Quiero crear una aplicación web llamada **Agentes**.

URL del proyecto:

agentes.alvarosiles.cloud

Objetivo:

Crear una aplicación web para administrar agentes, proveedores y contactos asociados.

La aplicación debe permitir registrar información de agentes, guardar los datos en archivos JSON, mostrar perfiles, almacenar códigos QR relacionados y facilitar la consulta rápida de información.

Debe funcionar como un sistema personal de gestión de agentes.

---

# Tecnologías

Utilizar únicamente:

* HTML5
* CSS3
* JavaScript ES6
* JSON
* LocalStorage

No utilizar frameworks.

No utilizar backend.

Debe funcionar como aplicación web estática.

---

# Diseño

Crear un Dashboard profesional.

Inspiración:

* CRM empresarial
* Panel administrativo moderno
* Gestión de contactos

Diseño:

Modo oscuro elegante.

Colores:

Fondo:
#111827

Sidebar:
#1F2937

Tarjetas:
#1F2937

Color principal:
#2563EB

Éxito:
#10B981

Advertencia:
#F59E0B

Texto:
#FFFFFF

Bordes redondeados.

Sombras suaves.

Responsive:

* Desktop
* Tablet
* Móvil

---

# Menú lateral

Crear:

🏠 Dashboard

👥 Agentes

🏢 Proveedores

📱 Códigos QR

📁 Categorías

📊 Reportes

⚙ Configuración

---

# Dashboard

Mostrar estadísticas:

Total de agentes

Total de proveedores

Total de QR registrados

Agentes activos

Proveedores activos

Últimos registros

---

# Registro de agentes

Crear formulario:

Campos:

ID

Nombre completo

Foto

Empresa

Cargo

Categoría

Teléfono

WhatsApp

Correo electrónico

Dirección

Ciudad

País

Fecha de registro

Estado:

Activo

Inactivo

Notas

Código QR asociado

---

# Registro de proveedores

Formulario:

ID

Nombre de empresa

Persona contacto

Logo

Categoría

Teléfono

WhatsApp

Correo

Dirección

Página web

Redes sociales

Código QR

Estado

Notas

---

# Gestión de QR

Cada agente o proveedor puede tener un QR.

Guardar:

Nombre

Tipo:

* Pago
* Contacto
* WhatsApp
* Ubicación
* Otro

Imagen QR

Descripción

Fecha

Relacionado con:

Agente

Proveedor

---

# Archivo JSON

Crear carpeta:

data/

Crear:

agentes.json

Ejemplo:

{
"agentes":[
{
"id":1,
"nombre":"Juan Pérez",
"empresa":"Empresa Demo",
"cargo":"Agente Comercial",
"telefono":"+59170000000",
"whatsapp":"+59170000000",
"correo":"[juan@email.com](mailto:juan@email.com)",
"ciudad":"La Paz",
"estado":"Activo",
"qr":"qr/juan.png",
"notas":"Proveedor principal"
}
]
}

Crear también:

proveedores.json

Ejemplo:

{
"proveedores":[
{
"id":1,
"empresa":"Proveedor Demo",
"contacto":"Carlos López",
"categoria":"Tecnología",
"telefono":"+59170000000",
"correo":"[contacto@email.com](mailto:contacto@email.com)",
"qr":"qr/proveedor.png",
"estado":"Activo"
}
]
}

---

# Carpeta QR

Crear:

qr/

Ejemplo:

qr/

juan.png

proveedor1.png

empresa.png

---

# Vista de agentes

Mostrar tarjetas:

Ejemplo:

---

👤 Foto

Juan Pérez

Agente Comercial

Empresa Demo

📞 Teléfono

📱 WhatsApp

✉ Correo

📍 Ciudad

[Ver perfil]

[Mostrar QR]

[Editar]

---

---

# Perfil del agente

Mostrar:

Foto

Información completa

QR grande

Botón:

Descargar QR

Mostrar al cliente

Copiar información

---

# Búsqueda

Agregar:

Buscar por:

Nombre

Empresa

Teléfono

Categoría

Ciudad

---

# Filtros

Permitir filtrar:

Activo

Inactivo

Categoría

Empresa

---

# Funciones

Implementar:

✔ Leer datos desde JSON

✔ Mostrar información automáticamente

✔ Buscar agentes

✔ Buscar proveedores

✔ Mostrar QR

✔ Descargar QR

✔ Vista completa del perfil

✔ Guardar favoritos

✔ Guardar configuración con LocalStorage

✔ Ordenar registros

---

# Diseño de tarjetas

Cada tarjeta debe tener:

Imagen

Nombre

Empresa

Estado con badge:

🟢 Activo

🔴 Inactivo

Botones modernos.

---

# Estructura del proyecto

Crear:

agentes/

│
├── index.html
├── style.css
├── app.js
│
├── pages/
│   ├── agentes.html
│   ├── proveedores.html
│   ├── perfil.html
│
├── data/
│   ├── agentes.json
│   └── proveedores.json
│
├── qr/
│
├── assets/
│   ├── icons/
│   └── images/
│
├── js/
│   ├── agentes.js
│   ├── proveedores.js
│   └── utils.js
│
├── README.md
└── LICENSE

---

# Seguridad

No enviar datos a servidores.

No recopilar información.

Todo debe funcionar localmente.

---

# README.md

Crear documentación:

* Descripción
* Funciones
* Instalación
* Cómo agregar agentes
* Cómo agregar proveedores
* Cómo subir QR
* Cómo publicar en GitHub Pages
* Cómo conectar agentes.alvarosiles.cloud

---

# Calidad del código

El código debe ser:

* Profesional
* Ordenado
* Modular
* Comentado
* Fácil de mantener

---

# Entrega

Genera el proyecto archivo por archivo.

Orden:

1. Estructura del proyecto
2. index.html
3. style.css
4. app.js
5. archivos JSON con datos de ejemplo
6. páginas internas
7. JavaScript adicional
8. README.md

Explica cada archivo antes de mostrar el código.

No resumas.

Espera mi confirmación antes de continuar con el siguiente archivo.
