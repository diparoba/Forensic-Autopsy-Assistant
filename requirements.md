# Software Requirements Document (SRD)

## Forensic Autopsy Assistant

------------------------------------------------------------------------

## 1. Nombre del Programa

**Forensic Autopsy Assistant**

------------------------------------------------------------------------

## 2. Descripción General

**Forensic Autopsy Assistant** es una aplicación web diseñada para
apoyar prácticas de autopsia forense, proporcionando herramientas
visuales, comandos de voz y un sistema de registro de hallazgos.

La plataforma está orientada a **profesionales y estudiantes de medicina
forense**, permitiendo documentar, guiar y registrar procedimientos
durante una autopsia.

### Funcionalidades principales

-   Seguir **procedimientos guiados de autopsia**
-   Utilizar **comandos de voz manos libres**
-   **Capturar fotografías forenses**
-   Consultar una **base de conocimientos**
-   Registrar **notas privadas durante la práctica**

------------------------------------------------------------------------

# 3. Alcance del Sistema

El sistema funcionará como una **aplicación web progresiva (PWA)**
accesible desde:

-   Navegadores de escritorio
-   Teléfonos móviles
-   Tablets

Debe ofrecer una experiencia **responsiva**, optimizada para uso en
entornos profesionales y educativos.

------------------------------------------------------------------------

# 4. Arquitectura del Sistema

El sistema se divide en tres capas principales:

### Backend

Responsable de:

-   Gestión de API
-   Autenticación de usuarios
-   Almacenamiento de datos
-   Procesamiento de imágenes
-   Gestión de registros forenses

### Frontend

Responsable de:

-   Interfaz de usuario
-   Interacciones en tiempo real
-   Control por voz
-   Manejo de cámara

### Inteligencia Artificial y APIs del navegador

Responsable de:

-   Reconocimiento corporal
-   Comandos de voz
-   Lectura automática de pasos

------------------------------------------------------------------------

# 5. Módulos del Sistema

## 5.1 Backend (Python)

El backend se encargará de la lógica del sistema y gestión de datos.

### Funciones

-   API REST
-   Gestión de usuarios
-   Almacenamiento de autopsias
-   Procesamiento de imágenes
-   Integración con IA

### Tecnologías

-   Python
-   FastAPI
-   SQLite
-   SQLAlchemy
-   Jinja2
-   Pydantic
-   Pillow (PIL)

------------------------------------------------------------------------

## 5.2 Frontend (JavaScript)

Encargado de la experiencia del usuario.

### Módulos principales

**Autenticación** - Registro - Inicio de sesión - Control de sesiones

**Cámara Forense** - Captura de fotografías - Guías de incisión mediante
IA

**Control por Voz** - Reconocimiento de comandos - Navegación sin
contacto

**Cuaderno Privado** - Registro de observaciones - Almacenamiento local

### Tecnologías

-   JavaScript Vanilla
-   HTML5
-   CSS3
-   Tailwind CSS
-   LocalStorage

------------------------------------------------------------------------

## 5.3 Interfaz de Usuario

Pantallas principales:

1.  **Index**
    -   Inicio de sesión
    -   Registro
2.  **Dashboard**
    -   Resumen de autopsias
    -   Acceso a herramientas
3.  **App de Trabajo**
    -   Procedimiento guiado
    -   Cámara
    -   Notas privadas
    -   Control por voz

### Diseño

-   Tema oscuro profesional
-   Estilo moderno
-   Glassmorphism
-   Responsive

------------------------------------------------------------------------

# 6. Inteligencia Artificial y APIs del Navegador

### MediaPipe Pose

Permite:

-   Detectar puntos de referencia corporales
-   Dibujar guías de incisión
-   Asistir visualmente en procedimientos

### Web Speech API

Permite:

-   Reconocimiento de voz
-   Ejecución de comandos
-   Lectura de pasos mediante TTS

------------------------------------------------------------------------

# 7. Requerimientos Funcionales

RF1 --- El sistema debe permitir registro de usuarios.

RF2 --- El sistema debe permitir inicio de sesión seguro.

RF3 --- El usuario podrá crear registros de autopsia.

RF4 --- El sistema permitirá capturar fotografías desde la cámara.

RF5 --- El sistema mostrará guías visuales de incisión.

RF6 --- El sistema reconocerá comandos de voz.

RF7 --- El sistema permitirá guardar notas privadas.

RF8 --- El sistema permitirá consultar una base de conocimiento.

RF9 --- El sistema funcionará en dispositivos móviles y escritorio.

------------------------------------------------------------------------

# 8. Requerimientos No Funcionales

### Rendimiento

-   La aplicación debe responder en menos de **2 segundos** en
    operaciones normales.

### Seguridad

-   Autenticación de usuarios
-   Protección de datos sensibles

### Usabilidad

-   Interfaz intuitiva
-   Compatible con pantallas táctiles

### Portabilidad

-   Compatible con:
    -   Chrome
    -   Edge
    -   Firefox
    -   Navegadores móviles

------------------------------------------------------------------------

# 9. Frameworks Sugeridos

### Backend

Se recomienda:

**FastAPI**

Ventajas:

-   Alto rendimiento
-   Documentación automática
-   Integración fácil con Python
-   Ideal para APIs modernas

Alternativa:

-   Django + Django Rest Framework

------------------------------------------------------------------------

### Frontend

Se recomienda:

**Vue.js**

Ventajas:

-   Ligero
-   Fácil de integrar
-   Excelente para aplicaciones interactivas

Alternativas:

-   React
-   Svelte

------------------------------------------------------------------------

# 10. Base de Datos Recomendada

### Opción inicial

**SQLite**

Ventajas:

-   Ligera
-   Fácil de integrar
-   Ideal para prototipos o aplicaciones locales

### Opción escalable

**PostgreSQL**

Ventajas:

-   Alta seguridad
-   Escalable
-   Excelente rendimiento para aplicaciones profesionales

------------------------------------------------------------------------

# 11. Posibles Extensiones Futuras

-   Exportación automática de reportes
-   Integración con sistemas hospitalarios
-   Análisis avanzado de imágenes
-   Historial completo de autopsias
-   Sistema de aprendizaje para estudiantes

------------------------------------------------------------------------

# 12. Conclusión

Forensic Autopsy Assistant busca modernizar el proceso de documentación
y aprendizaje en autopsias forenses mediante el uso de tecnologías web
modernas, inteligencia artificial y herramientas de interacción manos
libres.
