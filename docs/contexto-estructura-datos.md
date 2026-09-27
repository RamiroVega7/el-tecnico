## Estructura de Datos (El tecnico)

### Definición de Tipos y Enums Base
- **Facciones:** `[vestuario, dirigencia, hinchas]` // Valores 0-100. Llegar a 0 o 100 es Game Over inmediato.
- **MetricasAfectables:** `[vestuario, dirigencia, hinchas, finanzas, fama, prestigio, idolatria]`
- **Expectativas:** `[Ascenso, Bajas, Medias, Altas, Gigante]`
- **Dificultad:** `[facil, medio, dificil]`
- **Incidencia:** `[Alta, Media, Baja]` // Escala para balancear sin hardcodear números en cada carta.
- **MotivoDerrotaInmediata:** `[HinchadaMin, HinchadaMax, VestuarioMin, VestuarioMax, DirigenciaMin, DirigenciaMax, FinanzasBancarrota]`

---

# Partida

Representa el estado general de la carrera del entrenador.

```text
Dificultad : Dificultad
NombreManager : string
NacionalidadManager : string
Prestigio : int // 1-100 (Define el rango de ofertas a fin de temporada. Si termina con < 10 no recibe ofertas y se retira).
Fama : int // 1-100 (Inicia en 50. Si está en 1-35 o 75-100 multiplica el impacto en facciones).
TemporadaActual : int // Contador de temporadas transcurridas (inicia en 1).
AnioActual : int // Muestra el año, empieza en 2026.
IdClubActual : int // ID del club que está dirigiendo actualmente.
```

---

# Club

Catálogo base de clubes (datos estáticos inmutables).

```text
idClub : int
NombreClub : string
Capitan : string
Presidente : string
HinchaCaracterizado : string
Pais : string
ColorPrincipal : string // Código hexadecimal o nombre de color CSS para personalización de UI.
Expectativas : Expectativas
DivisionInicial : int // [1, 2]
FinanzasInicial : int // Presupuesto anual asignado al comenzar.
ClasicoRivalId : int // Referencia al idClub del clásico rival.
```

---

# ClubEnPartida

Estado dinámico del club que está dirigiendo el usuario en la partida actual.

```text
idClub : int
DivisionActual : int // [1, 2]
ExpectativaActual : Expectativas // Cambia solo si asciende (pasa a Bajas) o si desciende (pasa a Ascenso).
Idolatria : int // 1-100 (Específica del club; se resetea a 0 al cambiar de equipo).
RelacionFacciones : {
    vestuario : int // 1-100 (Inicia en 50; se resetea al cambiar de club).
    dirigencia : int // 1-100 (Inicia en 50; se resetea al cambiar de club).
    hinchas : int // 1-100 (Inicia en 50; se resetea al cambiar de club).
}
```

---

# Temporada

Control del ciclo de 20 cartas correspondiente a un año futbolístico (Vista 3).

```text
NumeroTemporada : int
TurnoActual : int // 1 a 20 (Avanza 1 con cada carta resuelta).
CartasPendientes : int // Inicia en 20 y descuenta hasta 0.
FinanzasActual : int // Presupuesto disponible en la temporada (bajar de 0 es Derrota Inmediata por bancarrota).
ModificadorProbClasico : float // Bonus acumulado para ganar el clásico (inicia en 0.0).
ModificadorProbPartidoFinal : float // Bonus acumulado para el partido final (inicia en 0.0).
ResultadoClasico : string // Marcador final del clásico, ej: "2 - 1" o "pendiente" (Se resuelve en el Turno 10).
ResultadoPartidoFinal : string // Marcador del partido importante, ej: "2 - 1" o "pendiente" (Se resuelve en el Turno 20).
TipoPartidoFinal : string // [PromocionAscenso, DefinicionDescenso, DefinicionCopas, TorneoLocal, TorneoInternacional]
ObjetivoCumplido : bool // true si gana el partido importante acorde a la expectativa del club.
TituloGanado : bool // true si el objetivo cumplido correspondía a ganar un torneo.
```

---

# Carta (Mazo Regular)

Cartas estándar que componen la temporada (5 de Prensa y 12 de situaciones generales: Hinchada, Jugador, Dirigencia).

```text
idCarta : int
tipo : string // [Prensa, Hinchada, Jugador, Dirigencia]
personaje : string // Nombre o rol del emisor (ej: "Capitán", "Presidente", "Periodista", "Barra").
expectativasPermitidas : Expectativas[] // Lista de expectativas de club en las que esta carta es elegible (ej: [Ascenso, Bajas]). Si está vacío o no se provee, aplica a todas.
tituloCarta : string
descripcion : string
opciones : {
    opcion1 : {
        texto : string
        afectadosPositivo : { [metrica in MetricasAfectables]?: Incidencia } // Ej: { vestuario: "Alta", fama: "Media" }
        afectadosNegativo : { [metrica in MetricasAfectables]?: Incidencia }
        impactoFinanzas : int // Valor opcional si modifica dinero de forma directa.
    }
    opcion2 : {
        texto : string
        afectadosPositivo : { [metrica in MetricasAfectables]?: Incidencia }
        afectadosNegativo : { [metrica in MetricasAfectables]?: Incidencia }
        impactoFinanzas : int
    }
}
```

---

# CartaObligatoria (Decisiones Clave)

Las 3 cartas obligatorias que aparecen en momentos fijos de cada temporada y condicionan los eventos especiales.

```text
idCartaOb : int
turnoDeAparicion : int // Turno 1 (Fichaje), Turno 10 (Boquear clásico), Turno 19 (Doble turno).
tipoDecision : string // [FichajeEstrella, PreviaClasico, DobleTurno]
expectativasPermitidas : Expectativas[] // Lista de expectativas de club en las que esta carta es elegible (ej: [Ascenso, Bajas]). Si está vacío o no se provee, aplica a todas.
tituloCarta : string
descripcion : string
opciones : {
    opcion1 : {
        texto : string
        afectadosPositivo : { [metrica in MetricasAfectables]?: Incidencia }
        afectadosNegativo : { [metrica in MetricasAfectables]?: Incidencia }
        impactoFinancieroPorcentaje : float // Ej: -0.33 (-1/3 del presupuesto anual en Fichaje Estrella).
        bonusProbClasico : float // Ej: +0.10 (aumenta probabilidad del clásico).
        bonusProbPartidoFinal : float // Ej: +0.15 (aumenta probabilidad del partido importante).
    }
    opcion2 : {
        texto : string
        afectadosPositivo : { [metrica in MetricasAfectables]?: Incidencia }
        afectadosNegativo : { [metrica in MetricasAfectables]?: Incidencia }
    }
}
despliegaEventoEspecialInmediato : bool // true para Turno 10 (el clásico se sortea y muestra inmediatamente tras la decisión).
idEventoEspecialAsociado : int // ID del EventoPartidoEspecial vinculado (Turno 10 -> Clásico; Turno 19 -> Partido Final del Turno 20).
```

---

# EventoPartidoEspecial (Cartas de Resultado)

Cartas especiales automáticas que resuelven los partidos determinantes mediante cálculo de probabilidad (Victoria / Derrota) y muestran una carta de desenlace con sus consecuencias:

- **Clásico (Turno 10):** Se dispara de forma **inmediata** como siguiente carta tras resolver la `CartaObligatoria` de la previa del clásico ("Boquearla").
- **Partido Importante (Turno 20):** Es la última carta de la temporada. Su probabilidad se ve impactada por la `CartaObligatoria` del Turno 19 ("Doble Turno") y el Fichaje Estrella.

```text
idEvento : int
idCartaObligatoriaOrigen : int // Referencia a la CartaObligatoria previa que condiciona o dispara este partido.
tipoPartido : string // [Clasico, PartidoImportante]
subtipoPartidoImportante : string // [PromocionAscenso, DefinicionDescenso, DefinicionCopas, TorneoLocal, TorneoInternacional] (null si es Clásico).
momentoEjecucion : string // [InmediatoPostDecision, CierreTemporadaTurno20]
probabilidadBaseVictoria : float // Empieza en 0.50 y se le suman los modificadores acumulados de la temporada (fichaje estrella, doble turno).
resultadoVictoria : {
    titulo : string
    descripcion : string
    afectadosPositivo : MetricasAfectables[]
    afectadosNegativo : MetricasAfectables[]
}
resultadoDerrota : {
    titulo : string
    descripcion : string
    afectadosPositivo : MetricasAfectables[]
    afectadosNegativo : MetricasAfectables[]
}
```

---

# Situaciones de Derrota (Game Over)

El juego contempla dos formas de derrota según el momento en que se produzcan:

### 1. CartaDerrotaInmediata (Vista 6 en Pantalla de Juego - Formato Nota Periodística)
No es una vista separada, sino una **carta especial de fin de partida** diseñada con la estética de una **nota periodística de última hora / portada de diario deportivo sensacionalista**. Interrumpe la partida en el momento exacto en que una facción llega a 0/100 o las finanzas quiebran. Explica los motivos del despido con narrativa humorística, sarcástica y costumbrista del fútbol argentino, y ofrece un botón de acción para reiniciar la partida.

```text
idDerrota : MotivoDerrotaInmediata // [HinchadaMin, HinchadaMax, VestuarioMin, VestuarioMax, DirigenciaMin, DirigenciaMax, FinanzasBancarrota]
motivo : string // [Hinchada, Jugadores, Dirigencia, Finanzas]
valorDetonante : int // 0, 100 o Finanzas < 0
medioPeriodistico : string // Nombre del medio (ej: "DIARIO OLÉ", "CRÓNICA TV", "LA GAZETA DEL TABLÓN")
volanta : string // Encabezado superior de impacto (ej: "¡ESCÁNDALO EN EL VESTUARIO!", "ÚLTIMO MOMENTO")
titulo : string // Titular catástrofe (ej: "¡TE HICIERON LA CAMA Y TE VAS POR LA PUERTA DE ATRÁS!")
bajada : string // Copete / resumen periodístico de la catástrofe
cuerpoNota : string // Crónica periodística detallada con humor ácido sobre cómo te echaron
descripcionBurlona : string // Resumen burlón del motivo del despido
personaje : string // Rostro de la imagen en la noticia (ej: "Capitán enojado", "Presidente furioso", "Síndico de Quiebra")
epigrafeFoto : string // Pie de foto de la nota periodística
botonAccion : string // "Firmar Rescisión y Reiniciar" (Vuelve a Vista 1)
```

#### Catálogo de Motivos de Derrota Inmediata:
1. **Hinchada = 0:** Cuelgan banderas en tu contra y la dirigencia termina por echarte.
2. **Hinchada = 100:** Te echan porque la prensa te acusa de corrupción y los barras se te meten en el vestuario.
3. **Jugadores = 0:** Te hacen la cama y van a menos hasta que la dirigencia te echa.
4. **Jugadores = 100:** La prensa denuncia un "club de amigos" ingobernable y la dirigencia te echa.
5. **Dirigencia = 0:** Te vas a golpes de puño con el presidente del club.
6. **Dirigencia = 100:** El presidente se da cuenta de que sos un chupamedias y busca a otro DT con más personalidad.
7. **Finanzas < 0:** Quiebra total: no solo te echan, sino que fundís el club.

---

### 2. DerrotaFinTemporada (Derrota por Prestigio en Vista 5)
Ocurre únicamente al finalizar la temporada (tras pasar la Vista 4 de Resumen). Si el DT terminó con **Prestigio < 10**, la Vista 5 no ofrece ningún club para fichar ni permite renovar.

```text
esDerrotaPorPrestigio : bool // true si Prestigio < 10 al llegar a Vista 5
titulo : string // "Sin ofertas en el mercado: Fin de tu carrera"
descripcionBurlona : string // Nadie te quiere contratar ni renovar. Te ves obligado al retiro y terminas como panelista en un programa de TV de poca monta al mediodía por YtC Sports.
botonAccion : string // "Reiniciar Carrera" (Vuelve a Vista 1)
```

---

# Cierre y Transición de Temporada

Estructuras de datos para las vistas de final de temporada (Vistas 4 y 5):

### ResumenFinTemporada (Vista 4)
Datos consolidados que se muestran en el panel de resumen al terminar las 20 cartas:
```text
faccionesFinales : { vestuario: int, dirigencia: int, hinchas: int }
prestigioActual : int
idolatriaActual : int
resultadoClasico : string // Marcador final, ej: "2 - 1"
objetivoCumplido : bool
```

### OfertaFinTemporada (Vista 5)
Opciones de contratación disponibles si `Prestigio >= 10`:
```text
idClub : int
nombreClub : string
division : int
expectativas : Expectativas
esRenovacion : bool // true para la oferta de tu club actual; false para las 2 ofertas aleatorias
```