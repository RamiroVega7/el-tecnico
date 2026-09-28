# Distribución y Recuento de Cartas

Este documento lleva el control y recuento del inventario de cartas para asegurar un balance narrativo y mecánico en el mazo de juego, evitando la sobre-representación de alguna facción o temática en particular.

---

## 1. Resumen General de Cartas Comunes (`cards.json`)

| Facción / Tipo | Personaje / Foco | Clave de Impacto | Cantidad de Cartas | % del Mazo Común |
| :--- | :--- | :--- | :---: | :---: |
| **Jugador** | Vestuario / Plantel | `vestuario` | 9 | 30.0% |
| **Dirigencia** | Comisión Directiva / Presidente | `dirigencia` | 9 | 30.0% |
| **Prensa** | Medios / Periodistas | `prensa` (Fama) | 6 | 20.0% |
| **Hinchada** | Simpatizantes / Barra | `hinchas` | 6 | 20.0% |
| **TOTAL** | | | **30** | **100%** |

---

## 2. Inventario Detallado por Facción

### 2.1. Jugador (Vestuario) — 9 cartas
- **[ID 1]** Cansancio por Doble Competencia
- **[ID 6]** Noche de Boliche Viral
- **[ID 10]** El Pibe Exige Titularidad
- **[ID 14]** Minutos en la Copa
- **[ID 18]** Una sutil recomendación
- **[ID 19]** Piñas en el vestuario
- **[ID 21]** Cambio en el equipo titular
- **[ID 29]** Vacaciones
- **[ID 30]** Victoria importante

### 2.2. Dirigencia — 9 cartas
- **[ID 2]** Oferta Millonaria por la Promesa
- **[ID 7]** Sponsor de Apuestas Online
- **[ID 11]** Gira Relámpago en Fecha FIFA
- **[ID 15]** Software de Scouting y Métricas
- **[ID 22]** Pedido de apoyo
- **[ID 23]** Solicitud inaceptable
- **[ID 26]** Jugada sucia
- **[ID 27]** Naming
- **[ID 28]** La joya asiatica

### 2.3. Prensa — 6 cartas
- **[ID 3]** Rumores en el Cuerpo Médico
- **[ID 5]** Polémica Arbitral al Aire
- **[ID 9]** Invitación a 'El Loco y el Cuerdo'
- **[ID 13]** Filtración del Once Titular
- **[ID 17]** Ataque al Estilo de Juego
- **[ID 25]** Error gramatical

### 2.4. Hinchada — 6 cartas
- **[ID 4]** Apriete por Entradas
- **[ID 8]** Banderazo Previo al partido
- **[ID 12]** Insultos durante el partido
- **[ID 16]** Asado Político en Año Electoral
- **[ID 20]** Magia negra
- **[ID 24]** Alta traición

---

## 3. Cartas Especiales y Obligatorias (`cartasObligatorias.json`)

Las cartas de eventos fijos se gestionan aparte y se insertan en turnos estratégicos (Turno 1, Turno 10 y Turno 19) de cada temporada de 20 turnos:

| Evento | Turno Asignado | Cantidad en Pool | IDs |
| :--- | :---: | :---: | :--- |
| **Fichaje de Pretemporada** | Turno 1 | 3 | `fichaje_01`, `fichaje_02`, `fichaje_03` |
| **Semana del Clásico** | Turno 10 | 3 | `clasico_01`, `clasico_02`, `clasico_03` |
| **Partido Definitorio** | Turno 19 | 3 | `definitorio_01`, `definitorio_02`, `definitorio_03` |
| **TOTAL OBLIGATORIAS** | | **9** | |

---

## 4. Criterios de Balance para Nuevas Cartas
- Mantener paridad equilibrada entre las 4 facciones (~25% cada una).
- Al crear nuevas cartas, verificar que cubran un espectro amplio de `expectativasPermitidas` (desde clubes de "Ascenso"/"Bajas" hasta "Gigante").
- Diversificar las elecciones para que no siempre una facción gane a expensas de la misma contraparte.

---

## 5. Distribución por Expectativas (Mazo Común)

El mazo común consta de un total de 30 cartas. La siguiente tabla muestra cuántas cartas están habilitadas para aparecer según la expectativa actual del club.

| Expectativa del Club | Cartas Habilitadas | % del Mazo Común (sobre 30) |
| :--- | :---: | :---: |
| **Ascenso** | 21 | 70.0% |
| **Bajas** | 24 | 80.0% |
| **Medias** | 29 | 96.7% |
| **Altas** | 29 | 96.7% |
| **Gigante** | 28 | 93.3% |

---

## 6. Distribución de Afectaciones (Balance de Opciones)

Este análisis contabiliza los **Puntos Totales de Impacto** que recibe cada métrica a través de todas las opciones posibles (sumando tanto el mazo común como las cartas obligatorias). Para este cálculo se pondera la incidencia: `Baja = 5 pts, Media = 10 pts, Alta = 15 pts`. Es vital para evaluar el desbalance real de las facciones considerando la magnitud del efecto, y no solo la cantidad de veces que aparecen.

| Métrica / Facción | Puntos Positivos | Puntos Negativos | Balance Neto (Pts) |
| :--- | :---: | :---: | :---: |
| **Vestuario** | +230 | -215 | +15 |
| **Dirigencia** | +250 | -245 | +5 |
| **Hinchas** | +260 | -250 | +10 |
| **Fama (Prensa)** | +135 | -130 | +5 |
| **Prestigio** | +50 | -45 | +5 |

*Nota Analítica:* Ponderado por impacto, **se ha alcanzado el equilibrio perfecto de diseño**. Todas las facciones del juego principal oscilan ahora en un rango ultracompacto (entre +5 y +15 puntos netos). Esto asegura que ninguna facción actúe como un "Game Over estadístico" ni como una barra "inmune", logrando que la supervivencia o la derrota del jugador dependa puramente de sus decisiones y no del azar.

---

## 7. Balance Financiero (Sistema Porcentual Dinámico)

Para equilibrar el juego entre los clubes de distintas expectativas (que manejan cajas iniciales muy diferentes, desde $2M en el Ascenso hasta $25M en un Gigante), el sistema financiero ha sido migrado a **impactos porcentuales** (`impactoFinancieroPorcentaje`). 

Esto garantiza que una buena o mala decisión tenga el mismo "peso" relativo para cualquier club, evitando que una opción quiebre instantáneamente a un club chico o pase desapercibida para uno grande.

### Distribución de Impactos Porcentuales por Carta:

*   **[ID 2]** Oferta Millonaria por la Promesa: **+50%** del presupuesto inicial.
*   **[ID 4]** Apriete por Entradas: **-2%** del presupuesto inicial.
*   **[ID 5]** Polémica Arbitral al Aire: **-1%** del presupuesto inicial.
*   **[ID 7]** Sponsor de Apuestas Online: **+30%** del presupuesto inicial.
*   **[ID 11]** Gira Relámpago en Fecha FIFA: **+15%** del presupuesto inicial.
*   **[ID 15]** Software de Scouting y Métricas: **-4%** del presupuesto inicial.
*   **[ID 26]** Jugada sucia: **-4%** del presupuesto inicial.
*   **[ID 27]** Naming: **+20%** del presupuesto inicial.
*   **[ID 28]** La joya asiática: **+40%** del presupuesto inicial.
*   **[ID 30]** Victoria importante: **-5%** del presupuesto inicial.

*Nota Analítica:* Utilizando un ancla porcentual sobre el presupuesto base del club, el riesgo de "hiperinflación" está completamente mitigado, permitiendo también que el club vaya a la quiebra si acumula demasiados impactos negativos (lo cual era imposible si se calculaba sobre la caja actual menguante). La curva de dificultad se mantiene estandarizada sin importar si diriges a Boca Juniors o a Chacarita.
