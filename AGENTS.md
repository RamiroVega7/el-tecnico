# Reglas del Proyecto: El tecnico

Este archivo define las directivas y directrices permanentes que el asistente de IA debe seguir al operar dentro de este repositorio.

---

## 1. Sincronización Automática con Codebase Memory (MANDATORIO)

- **Indexación post-modificación:** Cada vez que se implementen, modifiquen, creen o eliminen archivos de código fuente (`src/`), documentación (`docs/`), catálogos de datos (`assets/cardsInfo/`), estilos (`*.css`) o archivos de configuración (`package.json`, `vite.config.js`, etc.), es **obligatorio** que el agente ejecute como paso final de la tarea la herramienta de indexación:
  - **Tool:** `codebase-memory:index_repository`
  - **Argumentos:** `repo_path: "d:/Proyectos/Football Slide Manager"`
- Esto garantiza que el grafo de conocimiento, las dependencias y los símbolos del proyecto se mantengan permanentemente sincronizados tras cada cambio.

---

## 2. Convenciones de Desarrollo y Código

- **Pila Tecnológica:** React 19, Vite 8, Zustand 5, Framer Motion 13 y Vanilla CSS.
- **Estilos y Paleta:**
  - Respetar rigurosamente los tokens de color vintage invertidos definidos en `src/index.css` (`--color-1` a `--color-5`, `--bg-dark`, `--text-main`, etc.).
  - Mantener el diseño contenido con estética de PWA móvil (ancho máximo de 480px centrado).
- **Documentación:**
  - Cuando se añadan nuevas funcionalidades, vistas o componentes, actualizar la documentación correspondiente en la carpeta `docs/` (en particular `docs/contexto-estructura-archivos.md` y `docs/contexto-flujo.md`).
