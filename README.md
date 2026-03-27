# 🔬 Forensic Autopsy Assistant

Aplicación web de apoyo para prácticas de autopsia forense. Diseñada para **profesionales** y **estudiantes** de medicina forense.

---

## 🚀 Cómo ejecutar

> **Importante:** La app necesita un servidor local para funcionar (cámara y micrófono no funcionan abriendo el archivo directamente).

Luego abre **http://localhost:3000** en Chrome o Edge y permite el acceso a cámara y micrófono.

---

## 👤 Roles y credenciales

| Rol | Cómo registrarse | Permisos |
|---|---|---|
| **Dueño** | Email: `owner` / Contraseña: `owner2024` | Control total de la app |
| **Profesional** | Registro normal → espera aprobación del dueño | Edita base de conocimientos |
| **Estudiante** | Registro normal | Lectura + cuaderno privado |

> La contraseña del dueño se puede cambiar en `config.js`.

---

## 🗂️ Funcionalidades

### 📷 Cámara & Incisión
- Feed en vivo de la cámara con overlay de **incisión en Y** (líneas rojas entrecortadas).
- Captura de foto con botón o comando de voz **"capturar"**.

### 🎙️ Control por Voz
Activa el micrófono con el botón o diciendo **"Anótalo, Mario Hugo"**.

| Comando | Acción |
|---|---|
| `"hallazgo: [descripción]"` | Registra hallazgo y sugiere el paso siguiente |
| `"siguiente paso"` | Avanza al siguiente paso |
| `"paso anterior"` | Retrocede al paso anterior |
| `"capturar"` | Toma una foto |
| `"leer paso"` | Lee el paso actual en voz alta |
| `"anotar: [texto]"` | Guarda nota privada en el cuaderno |

### 📚 Base de Conocimientos
- Visible para todos los roles.
- Solo **profesionales aprobados** pueden escribir o editar entradas.
- El **dueño** aprueba o revoca permisos desde el Panel Admin.

### 📓 Mi Cuaderno *(solo estudiantes)*
- Notas completamente privadas, solo visibles para el estudiante.
- Se nutren automáticamente con los comandos de voz `"anotar: ..."`.

### 🛠️ Panel Admin *(solo dueño)*
- Ver lista de profesionales registrados.
- Aprobar o revocar permisos de escritura.

---

## 📁 Estructura del proyecto

```
Antigravity/
├── index.html              ← Login / Registro
├── app.html                ← Aplicación principal
├── config.js               ← Configuración del dueño
├── knowledge_base.json     ← Base de conocimientos (datos semilla)
├── implementation_plan.txt ← Plan de implementación (texto plano)
├── README.md               ← Este archivo
├── modules/
│   ├── auth.js             ← Autenticación y roles
│   ├── camera.js           ← Cámara + overlay de incisión
│   ├── voice.js            ← Reconocimiento de voz
│   ├── procedure.js        ← Procedimientos guiados
│   ├── knowledge.js        ← Base de conocimientos
│   └── notebook.js         ← Cuaderno privado
└── styles/
    └── main.css            ← Estilos
```

---

## ⚙️ Tecnologías

- **HTML5 / CSS3 / JavaScript** (100% frontend, sin servidor)
- **Web Speech API** — reconocimiento de voz y texto a voz (TTS)
- **MediaDevices API** — acceso a cámara
- **Canvas API** — overlay de incisión animado
- **localStorage** — persistencia de datos

---

## 🛠️ Ingeniería de Requerimientos

### 1. Requerimientos Funcionales (RF)
- **RF-01: Autenticación de Roles.** El sistema debe permitir el acceso diferenciado para Dueño, Profesional y Estudiante.
- **RF-02: Asistencia Visual.** El sistema debe superponer una guía de incisión en Y sobre el feed de la cámara.
- **RF-03: Comandos de Voz.** Soporte para captura de fotos, registro de hallazgos y lectura de procedimientos vía voz.
- **RF-04: Análisis de Imagen.** Integración de un script de Python para el post-procesamiento de capturas forenses.

### 2. Requerimientos No Funcionales (RNF)
- **RNF-01: Privacidad Estudiantil.** El cuaderno de notas debe ser estrictamente privado por usuario (localStorage).
- **RNF-02: UI Moderna.** Uso de **Tailwind CSS** para una interfaz limpia, responsiva y profesional.
- **RNF-03: Disponibilidad Offline-first.** Funcionamiento basado en tecnologías de navegador y almacenamiento local.

---

*Versión 1.1 — Febrero 2026*
