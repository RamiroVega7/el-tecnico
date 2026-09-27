# Contexto: Estructura de Archivos y Mapa de Funcionalidades

Este documento describe la arquitectura global, la distribución de archivos y la localización exacta de cada funcionalidad del proyecto **El tecnico**. Su objetivo es servir como mapa de referencia técnico para que cualquier desarrollador pueda localizar, modificar o extender rápidamente las características del juego.

---

## 1. Stack Tecnológico y Arquitectura General

- **Framework Core:** [React 19](https://react.dev/) + [Vite 8](https://vite.dev/) (módulo ESM nativo).
- **Gestión de Estado:** [Zustand 5](https://github.com/pmndrs/zustand) (`src/store/gameStore.js`).
- **Animaciones y Físicas de Swipe:** [Framer Motion 13](https://www.framer-motion.com/) (`motion.div`, gestos de arrastre táctil `drag="x"`).
- **Iconografía:** [Lucide React](https://lucide.dev/).
- **Sistema de Estilos:** Vanilla CSS modular por componente con tokens globales y paleta temática vintage invertida en `src/index.css`.
- **Persistencia y Datos:** Estáticos locales en JSON (sin backend en la fase actual).
- **Formato de Dispositivo:** Interfaz adaptativa contenida con aspecto móvil (máximo 480px centrado) simulando una Progressive Web App (PWA).

---

## 2. Árbol de Directorios del Proyecto

```text
El tecnico/
├── docs/                                    # Documentación técnica y de diseño de juego
│   ├── contexto-general.md                 # Visión macro, core loop, stack y reglas base
│   ├── contexto-flujo.md                   # Flujo paso a paso, temporadas, cartas fijas y derrotas
│   ├── contexto-estructura-datos.md        # Definición de tipos, modelos de datos y catálogos
│   ├── contexto-vistas-aplicacion.md       # Descripción de las pantallas (Vistas 1 a 6)
│   ├── contexto-estructura-archivos.md     # [ESTE ARCHIVO] Mapa de archivos y funcionalidades
│   └── distribucion-cartas.md              # Balance, recuento e inventario de cartas por facción
│
├── public/                                  # Recursos estáticos servidos directamente
│   ├── favicon.svg                          # Favicon de la aplicación
│   └── icons.svg                            # Sprite/iconos SVG auxiliares
│
├── src/                                     # Código fuente de la aplicación
│   ├── main.jsx                             # Bootstrap de React (renderiza App en el DOM)
│   ├── App.jsx                              # Router/Orquestador principal según gamePhase e isGameOver
│   ├── App.css                              # Estilos contenedores de App
│   ├── index.css                            # Sistema de diseño, fuentes, tokens CSS y layout raíz
│   │
│   ├── components/                          # Componentes de la interfaz de usuario
│   │   ├── DifficultySelection.jsx          # Vista 1: Selector de dificultad inicial
│   │   ├── DifficultySelection.css          # Estilos de tarjetas y badges de dificultad
│   │   ├── ClubSelection.jsx                # Vista 2: Ficha del DT y selector de clubes filtrados
│   │   ├── ClubSelection.css                # Estilos del formulario, dropdowns con búsqueda y card de club
│   │   ├── StatusBar.jsx                    # Vista 3: Barra superior de facciones, finanzas y métricas
│   │   ├── StatusBar.css                    # Estilos de medidores, barras de progreso y header del club
│   │   ├── SwipeCard.jsx                    # Vista 3: Mecánica de deslizamiento, cartas e impacto
│   │   ├── SwipeCard.css                    # Estilos del mazo, hint badges, cartas especiales y gradiente reactivo
│   │   ├── MatchResultModal.jsx             # Vista 3: Modal de resultado de partidos clave (Clásico y Partido Final)
│   │   ├── MatchResultModal.css             # Estilos de marcador, crónica periodística, timeline y consecuencias
│   │   ├── GameOverNews.jsx                 # Vista 6: Portada de diario deportivo al perder la partida
│   │   └── GameOverNews.css                 # Estilos de periódico, tipografía masthead y sello de despido
│   │
│   ├── utils/                               # Utilidades y simulaciones lógicas
│   │   └── matchSimulation.js               # Simulación de El Clásico y Partido Importante según club y expectativas
│   │
│   ├── store/                               # Estado global y lógica reactiva
│   │   └── gameStore.js                     # Store central de Zustand (stats, transiciones y derrotas)
│   │
│   └── assets/                              # Recursos gráficos y fuentes de datos
│       ├── cardsInfo/                       # Catálogos de datos del juego en JSON
│       │   ├── cards.json                   # Mazo de 50 cartas regulares de temporada
│       │   ├── clubs.json                   # Catálogo de 8 clubes con presidentes, capitanes y colores
│       │   ├── derrotas.json                # Catálogo de las 7 situaciones de derrota periodística
│       │   └── index.js                     # Exportador consolidado (barrel file)
│       ├── images/                          # Ilustraciones y recursos visuales
│       │   ├── card/                        # Ilustraciones para personajes de cartas regulares
│       │   │   ├── player.PNG               # Jugador / Vestuario / Capitán
│       │   │   ├── dirigente.PNG            # Dirigente / Presidente / Directiva
│       │   │   ├── hincha.PNG               # Hincha / Barra / Tribuna
│       │   │   └── prensa.PNG               # Periodista / Medios / Rueda de prensa
│       │   └── derrota/                     # Ilustraciones temáticas para portadas de diario de Game Over
│       │       ├── VestuarioMin.webp        # Derrota: Cama de los jugadores (Vestuario = 0)
│       │       ├── VestuarioMax.webp        # Derrota: Club de amigos (Vestuario = 100)
│       │       ├── DirigenciaMin.webp       # Derrota: Pelea a golpes con presidente (Dirigencia = 0)
│       │       ├── DirigenciaMax.webp       # Derrota: Despedido por chupamedias (Dirigencia = 100)
│       │       ├── HinchadaMin.webp         # Derrota: Banderas dadas vuelta y apriete (Hinchada = 0)
│       │       ├── HinchadaMax.webp         # Derrota: Barras en el vestuario (Hinchada = 100)
│       │       └── FinanzasBancarrota.webp  # Derrota: Quiebra financiera total (Finanzas <= 0)
│       ├── hero.png                         # Imagen de cabecera / portada
│       ├── react.svg                        # Asset react
│       └── vite.svg                         # Asset vite
│
├── assets/                                  # Datos estáticos raíz complementarios
│   └── cardsInfo/                           # Copia/respaldo de cards.json, clubs.json, derrotas.json
│
├── index.html                               # HTML base de entrada y carga de fuentes
├── package.json                             # Dependencias, scripts npm y metadatos
├── vite.config.js                           # Configuración de compilación y plugins de Vite
├── .oxlintrc.json                           # Configuración del linter Oxlint
└── .gitignore                               # Exclusiones de Git
```

---

## 3. Mapa de Funcionalidades y Dónde Encontrarlas

### 3.1. Orquestación de Vistas y Fases del Juego (Game Router)
- **Archivos:** [App.jsx](file:///d:/Proyectos/Football%20Slide%20Manager/src/App.jsx) y [gameStore.js](file:///d:/Proyectos/Football%20Slide%20Manager/src/store/gameStore.js).
- **Descripción:** Controla el renderizado condicional de la vista activa según la propiedad `gamePhase` y el flag `isGameOver`:
  - `isGameOver === true` $\rightarrow$ Renderiza [GameOverNews.jsx](file:///d:/Proyectos/Football%20Slide%20Manager/src/components/GameOverNews.jsx).
  - `gamePhase === 'difficulty'` $\rightarrow$ Renderiza [DifficultySelection.jsx](file:///d:/Proyectos/Football%20Slide%20Manager/src/components/DifficultySelection.jsx) (Paso 1).
  - `gamePhase === 'select_club'` $\rightarrow$ Renderiza [ClubSelection.jsx](file:///d:/Proyectos/Football%20Slide%20Manager/src/components/ClubSelection.jsx) (Paso 2).
  - `gamePhase === 'playing'` $\rightarrow$ Renderiza simultáneamente [StatusBar.jsx](file:///d:/Proyectos/Football%20Slide%20Manager/src/components/StatusBar.jsx) y [SwipeCard.jsx](file:///d:/Proyectos/Football%20Slide%20Manager/src/components/SwipeCard.jsx) (Partida activa).

---

### 3.2. Selección de Dificultad (Vista 1)
- **Archivos:** [DifficultySelection.jsx](file:///d:/Proyectos/Football%20Slide%20Manager/src/components/DifficultySelection.jsx) y [DifficultySelection.css](file:///d:/Proyectos/Football%20Slide%20Manager/src/components/DifficultySelection.css).
- **Descripción:** 
  - Muestra las tres dificultades de partida: **Fácil** (acceso a todos los clubes), **Medio** (clubes con expectativas medias o bajas) y **Difícil** (clubes de Segunda División con objetivo de Ascenso).
  - Al seleccionar una opción y pulsar *Continuar*, despacha `setDificultad(id)` en el store, lo que actualiza la dificultad y cambia la fase automáticamente a `'select_club'`.

---

### 3.3. Ficha del Entrenador y Selección de Club (Vista 2)
- **Archivos:** [ClubSelection.jsx](file:///d:/Proyectos/Football%20Slide%20Manager/src/components/ClubSelection.jsx) y [ClubSelection.css](file:///d:/Proyectos/Football%20Slide%20Manager/src/components/ClubSelection.css).
- **Fuente de Datos:** [clubs.json](file:///d:/Proyectos/Football%20Slide%20Manager/src/assets/cardsInfo/clubs.json).
- **Sub-funcionalidades y dónde encontrarlas:**
  - **Filtro de clubes por dificultad:** Método `availableClubs` usando `useMemo` filtrando por `Expectativas` y `DivisionInicial`.
  - **Selector de Nacionalidad con Búsqueda:** Dropdown interactivo con lista de 21 banderas/países, barra de búsqueda en tiempo real y detección de clic exterior.
  - **Selector de Clubes con Búsqueda:** Dropdown customizado con buscador predictivo por nombre, división o expectativa.
  - **Ficha Preview del Club:** Panel con el color distintivo del club, insignias de división y expectativa, presidente, capitán, hincha caracterizado, presupuesto anual de fichajes y clásico rival.
  - **Inicio de Partida:** Función `handleStartGame` que invoca `iniciarPartida(...)` en el store e inicializa las métricas y la temporada 2026.

---

### 3.4. Barra de Estado y Métricas (StatusBar - Vista 3)
- **Archivos:** [StatusBar.jsx](file:///d:/Proyectos/Football%20Slide%20Manager/src/components/StatusBar.jsx) y [StatusBar.css](file:///d:/Proyectos/Football%20Slide%20Manager/src/components/StatusBar.css).
- **Sub-funcionalidades y dónde encontrarlas:**
  - **Header del Club y Entrenador:** Muestra el escudo de color, nombre del club, etiqueta de objetivo dinámico (`getObjectiveLabel`), bandera y nombre del DT, y temporada/año.
  - **Facciones Principales (Condición de Derrota):** Componente `FactionBar` con barras verticales e iconos reactivos para **Vestuario**, **Dirigencia** e **Hinchas** (valores 0 a 100, con alerta visual de brillo cuando el valor entra en zona crítica $< 20$ o $> 80$).
  - **Finanzas:** Cuadro numérico con formateador inteligente de moneda (`formatShortMoney` a `$M` o `$K`) y desglose exacto en pesos argentinos.
  - **Métricas Secundarias:** Componente `HorizontalBar` con barras horizontales para **Prestigio** (0-100%), **Idolatría** (0-100%) y **Fama** (0-100%).

---

### 3.5. Mecánica de Swipe y Cartas de Temporada (SwipeCard - Vista 3)
- **Archivos:** [SwipeCard.jsx](file:///d:/Proyectos/Football%20Slide%20Manager/src/components/SwipeCard.jsx) y [SwipeCard.css](file:///d:/Proyectos/Football%20Slide%20Manager/src/components/SwipeCard.css).
- **Fuente de Datos:** [cards.json](file:///d:/Proyectos/Football%20Slide%20Manager/src/assets/cardsInfo/cards.json) (Mazo regular) y [cartasObligatorias.json](file:///d:/Proyectos/Football%20Slide%20Manager/src/assets/cardsInfo/cartasObligatorias.json) (Eventos fijos de la temporada).
- **Sub-funcionalidades y dónde encontrarlas:**
  - **Físicas y Gestos de Swipe:** Implementado con `framer-motion` usando `useMotionValue(x)`, `useTransform(x, [-150, 150], [-10, 10])` para rotación sutil, y `drag="x"` bloqueado exclusivamente al eje horizontal.
  - **Pistas Visuales de Decisión (Hints):** Badges superpuestos (`hint-left` y `hint-right`) que aparecen al superar los $\pm 50\text{px}$ de arrastre revelando el texto de la opción antes de soltar.
  - **Umbral de Disparo:** En `handleDragEnd`, si el arrastre supera los $\pm 100\text{px}$, la carta sale expulsada de la pantalla (`start({ x: 300 / -300 })`) y aplica los cambios. Si no supera el umbral, regresa con efecto resorte (*spring*).
  - **Cálculo de Consecuencias e Incidencia:** Función `calculateModifiers`:
    - Convierte la incidencia de la carta en deltas (`Baja` = 5, `Media` = 10, `Alta` = 15).
    - Aplica positivos a `afectadosPositivo`, negativos a `afectadosNegativo` y modificaciones directas a `impactoFinanzas`.
  - **Sustitución Contextual de Personajes:** Función `getCardCharacterName`: reemplaza automáticamente el rol genérico por el nombre real del club activo (ej. si la carta es de *Vestuario/Jugador*, muestra el nombre del Capitán del club seleccionado; si es de *Dirigencia*, el del Presidente; si es de *Hinchada*, el del Hincha Caracterizado).
  - **Asignación Dinámica de Ilustración:** Función `getCardImage`: mapea la imagen adecuada (`player`, `dirigente`, `hincha`, `prensa`) evaluando la facción, el tipo o las palabras clave del personaje.
  - **Gradiente Ambiental de Club:** Div `.club-ambient-gradient` con gradiente reactivo calculado a partir de `clubActual.ColorPrincipal`.
  - **Pila Visual de Cartas (Stacking):** Renderiza en segundo plano la carta siguiente (`nextCard`) para simular profundidad de mazo físico.
  - **Diferenciación Visual de Cartas Especiales:** Cartas de eventos fijos (`cartasObligatorias.json`) identificadas con `.is-special`:
    - Borde dorado metálico con animación de pulso y resplandor áureo (`specialGoldPulse`).
    - Filigranas vintage ornamentales en las 4 esquinas (`❖`).
    - Cinta superior (`special-card-ribbon`) con estrellas y etiqueta contextual de evento clave (ej. *"MERCADO DE PASES • DECISIÓN CLAVE"*, *"SEMANA DEL CLÁSICO • FECHA DECISIVA"*, *"DEFINICIÓN DE TEMPORADA • MOMENTO CUMBRE"*).
    - Reflejo áureo en la carta en cola del mazo (`.next-card.is-special`).

---

### 3.5.1. Modal de Resultado de Partidos Clave (MatchResultModal - Vista 3)
- **Archivos:** [MatchResultModal.jsx](file:///d:/Proyectos/Football%20Slide%20Manager/src/components/MatchResultModal.jsx), [MatchResultModal.css](file:///d:/Proyectos/Football%20Slide%20Manager/src/components/MatchResultModal.css) y [matchSimulation.js](file:///d:/Proyectos/Football%20Slide%20Manager/src/utils/matchSimulation.js).
- **Flujo e Integración:**
  - Cuando se juegan los partidos cruciales de la temporada (**El Clásico** tras la decisión del Turno 10 o **El Partido Importante** tras la decisión del Turno 19), la ejecución de la siguiente carta se suspende temporalmente.
  - Se despliega el modal interactivo de resultado antes de revelar la siguiente carta del mazo.
- **Componentes del Marcador (Diseño Compacto y Directo):**
  - **Cinta de Torneo:** Identifica el certamen (ej. *"SUPERCLÁSICO DE LA TEMPORADA"*, *"FINAL POR EL ASCENSO A PRIMERA"*, *"GRAN FINAL CONTINENTAL"*).
  - **Marcador de Estadio:** Escudos y colores oficiales del equipo del usuario vs su clásico rival (o rival de división según expectativas), con números de tanteador estilo estadio y reloj de tiempo cumplido (`90' FINAL`).
  - **Banner de Resultado:** Distintivo en verde esmeralda con trofeo para `¡VICTORIA ÉPICA!` o carmesí oscuro para `DERROTA DOLOROSA`.
  - **Acción Inmediata:** Botón directo *"Ver Siguiente Carta"* que aplica las consecuencias en el store, actualiza el estado y avanza de forma fluida a la siguiente carta del mazo (sin saturar con textos secundarios de crónica ni desgloses).

---

### 3.6. Gestión del Estado Global y Reglas de Negocio (gameStore)
- **Archivo:** [gameStore.js](file:///d:/Proyectos/Football%20Slide%20Manager/src/store/gameStore.js).
- **Lógica Central:**
  - **`iniciarPartida(...)`:** Inicializa los valores base (facciones en 50, fama en 50, prestigio en 50, idolatría en 0, finanzas según el club, temporada 1, año 2026).
  - **`applyChanges(changes)`:**
    - **Multiplicador de Fama:** Si la fama es baja ($< 35$) o excesiva ($> 75$), las decisiones tienen el doble de impacto ($\times 2$) en las facciones.
    - **Límites (Clamping):** Mantiene facciones y métricas acotadas entre 0 y 100.
    - **Finanzas:** Maneja montos pequeños como millones y detecta quiebra si `finanzas <= 0`.
    - **Detección de Derrota Inmediata:** Si cualquier facción llega a $0$ o $100$, o las finanzas caen a $\le 0$, marca `isGameOver: true`, asigna el `defeatId` correspondiente (`VestuarioMin`, `VestuarioMax`, `DirigenciaMin`, etc.) y enlaza la carta periodística desde [derrotas.json](file:///d:/Proyectos/Football%20Slide%20Manager/src/assets/cardsInfo/derrotas.json).
  - **`resetGame()`:** Restablece todo el estado a la fase de selección de dificultad inicial.

---

### 3.7. Noticia de Derrota / Game Over (GameOverNews - Vista 6)
- **Archivos:** [GameOverNews.jsx](file:///d:/Proyectos/Football%20Slide%20Manager/src/components/GameOverNews.jsx) y [GameOverNews.css](file:///d:/Proyectos/Football%20Slide%20Manager/src/components/GameOverNews.css).
- **Fuente de Datos:** [derrotas.json](file:///d:/Proyectos/Football%20Slide%20Manager/src/assets/cardsInfo/derrotas.json).
- **Sub-funcionalidades y dónde encontrarlas:**
  - **Formato Periódico Sensacionalista:** Cabecera con cabezal periodístico dinámico (*Diario Olé*, *Crónica Deportiva*, *La Voz del Tablón*), fecha actual formateada en español, precio satírico y volanta de alerta.
  - **Titular y Cuerpo de Crónica:** Título catástrofe, bajada periodística y crónica narrativa con humor costumbrista del fútbol argentino.
  - **Fotografía con Sello:** Imagen vinculada en `DEFEAT_IMAGES` ([derrota/](file:///d:/Proyectos/Football%20Slide%20Manager/src/assets/images/derrota/)) con sello rojo de "DESPEDIDO" en ángulo y epígrafe formal.
  - **Cuadro de Cita Burlona:** Muestra la síntesis del fracaso deportivo.
  - **Reinicio:** Botón de acción "Firmar Rescisión y Reiniciar" conectado a `resetGame()`.

---

### 3.8. Capa de Datos Estáticos (Data Layer)
- **Directorio:** `src/assets/cardsInfo/`
- **Archivos:**
  - [cards.json](file:///d:/Proyectos/Football%20Slide%20Manager/src/assets/cardsInfo/cards.json): Catálogo de las 50 cartas de juego con atributos: `idCarta`, `tipo`, `personaje`, `tituloCarta`, `descripcion`, `incidencia`, `opciones` (`opcion1` y `opcion2` con `afectadosPositivo`, `afectadosNegativo`, `impactoFinanzas`) y `faccion`.
  - [clubs.json](file:///d:/Proyectos/Football%20Slide%20Manager/src/assets/cardsInfo/clubs.json): Lista de 8 clubes con `idClub`, `NombreClub`, `Capitan`, `Presidente`, `HinchaCaracterizado`, `Pais`, `ColorPrincipal`, `Expectativas`, `DivisionInicial`, `FinanzasInicial` y `ClasicoRivalId`.
  - [derrotas.json](file:///d:/Proyectos/Football%20Slide%20Manager/src/assets/cardsInfo/derrotas.json): Las 7 condiciones de derrota inmediata con textos periodísticos, volantas, titulares, bajadas, crónicas, fotos y botones.
  - [index.js](file:///d:/Proyectos/Football%20Slide%20Manager/src/assets/cardsInfo/index.js): Barrel file que facilita la importación limpia de los datos.

---

### 3.9. Tokens Globales y Sistema de Diseño (Design System)
- **Archivo:** [index.css](file:///d:/Proyectos/Football%20Slide%20Manager/src/index.css).
- **Propiedades clave:**
  - **Paleta Vintage Invertida:**
    - `--color-1` / `--bg-page`: `#E4D5B7` (Pergamino base claro).
    - `--color-2`: `#C9B79C`.
    - `--color-3`: `#A78A7F`.
    - `--color-4`: `#6E5B5B` (Bordes y textos secundarios).
    - `--color-5` / `--text-main`: `#3F3A3A` (Tinta oscura principal).
    - `--bg-dark` / `--bg-card`: `#FAF6EE` (Fondo claro de tarjetas y paneles).
  - **Tipografías:**
    - `--font-serif`: Google Font `'Cinzel'`, Georgia, serif (títulos, encabezados, estética clásica).
    - `--font-sans`: Google Font `'Plus Jakarta Sans'`, sans-serif (textos de interfaz, legibilidad).
  - **Colores de Facciones:**
    - `--vestuario-color`: `#A66248` (Terracota / Cuero).
    - `--dirigencia-color`: `#A07A38` (Dorado / Ocre).
    - `--hinchas-color`: `#4E7355` (Verde laurel / Tribuna).
    - `--prensa-color`: `#6E5B5B` (Gris editorial).
  - **Contenedor `#root`:** Centrado con ancho máximo de 480px y altura 100vh para emular la experiencia mobile.

---

## 4. Guía Rápida de Modificación ("¿Dónde toco si quiero...?")

| Quiero hacer... | Archivo(s) a modificar | Ubicación / Parámetro clave |
| :--- | :--- | :--- |
| **Agregar o editar una carta del mazo** | `src/assets/cardsInfo/cards.json` | Agregar objeto con `idCarta`, `tipo`, `incidencia`, `opciones` |
| **Agregar un nuevo club de fútbol** | `src/assets/cardsInfo/clubs.json` | Agregar club con `ColorPrincipal`, `Expectativas`, `DivisionInicial`, `ClasicoRivalId` |
| **Modificar los textos o crónicas de derrota** | `src/assets/cardsInfo/derrotas.json` | Modificar `titulo`, `bajada`, `cuerpoNota`, `descripcionBurlona` |
| **Agregar o cambiar imágenes de derrota** | `src/assets/images/derrota/` y `GameOverNews.jsx` | Subir archivo `.webp` y mapearlo en `DEFEAT_IMAGES` |
| **Cambiar el umbral o sensibilidad del Swipe** | `src/components/SwipeCard.jsx` | Constantes `threshold` (línea 195) y `dragElastic` |
| **Modificar el balance de impacto de las cartas** | `src/components/SwipeCard.jsx` | Objeto `incidenciaDelta` en función `calculateModifiers` |
| **Ajustar el multiplicador de Fama** | `src/store/gameStore.js` | Condicional `(state.fama < 35 \|\| state.fama > 75) ? 2 : 1` en `applyChanges` |
| **Cambiar condiciones o disparadores de Game Over** | `src/store/gameStore.js` | Evaluaciones de `newFactions[key] <= 0`, `>= 100` o `newFinanzas <= 0` |
| **Cambiar los filtros de dificultad para elegir clubes** | `src/components/ClubSelection.jsx` | Bloque `availableClubs` (`useMemo`) |
| **Cambiar los colores base o tipografías** | `src/index.css` | Bloque `:root` y reglas `@import url(...)` |
| **Modificar las etiquetas de objetivos por club** | `src/components/StatusBar.jsx` | Función `getObjectiveLabel` |

---

## 5. Funcionalidades en Desarrollo / Próximos Pasos (Backlog)

Según lo detallado en [contexto-flujo.md](file:///d:/Proyectos/Football%20Slide%20Manager/docs/contexto-flujo.md) y [contexto-estructura-datos.md](file:///d:/Proyectos/Football%20Slide%20Manager/docs/contexto-estructura-datos.md), los siguientes módulos se incorporarán en las próximas fases:
1. **Control de Temporada (20 cartas por año):**
   - Contador de cartas jugadas y límite de temporada (`turnoActual: 1..20`).
2. **Cartas Obligatorias Fijas:**
   - Turno 1: Fichaje estrella (impacta finanzas, vestuario, dirigencia y probabilidad de partidos).
   - Turno 10: Previa del Clásico ("Boquearla") + Evento especial del resultado del Clásico.
   - Turno 19: Doble turno antes de la definición.
   - Turno 20: Partido importante final de temporada (Promoción, Descenso, Copas, Torneo).
3. **Resumen de Fin de Temporada (Vista 4):**
   - Pantalla de balance anual (clásico ganado, objetivo cumplido, prestigio e idolatría acumulados).
4. **Mercado de Ofertas y Renovación (Vista 5):**
   - Elección de renovación con el club actual o aceptar ofertas de 2 clubes nuevos según prestigio.
   - Si `Prestigio < 10`: Derrota por falta de ofertas y retiro obligado.
