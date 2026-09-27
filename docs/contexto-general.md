# Contexto de Proyecto: El tecnico

## Resumen del Proyecto
Desarrollo de un videojuego web estilo "swipe" (similar a Tinder o Reigns) centrado en la gestión de un club de fútbol. El jugador asume el rol de Director Técnico (DT) y debe tomar decisiones binarias que afectan diferentes métricas de su carrera y su relación con el entorno del club.

## Bucle Principal (Core Loop)
1. **Dilema:** El sistema presenta una carta (archivo JSON) con un personaje (Jugador, Periodista, Presidente, Hincha) y una situación.
2. **Acción:** El jugador desliza a la izquierda (Opción A) o a la derecha (Opción B).
3. **Consecuencia:** Los modificadores ocultos actualizan las métricas, avanza el tiempo (una semana / un partido) y aparece la siguiente carta.

## Sistema de Métricas y Reglas
### 1. Facciones (Condición de Derrota Principal)
Barras de progreso que van de 0 a 100. Empezarán balanceadas.
* **Vestuario:** Moral y relación con los jugadores.
* **Dirigencia:** Apoyo de la junta y el presidente.
* **Hinchas:** Popularidad en la tribuna.
* *Game Over:* Si cualquier barra llega a **0** (despido por inoperancia) o a **100** (despido por exceso de poder), la partida termina y se debe iniciar con un nuevo DT.

### 2. Prestigio (Carrera)
Valor de 1 a 100. Aumenta ganando títulos y clásicos. Define el nivel de los clubes que ofertan al finalizar la temporada.
* **1-9:** Game Over (Retiro por falta de ofertas).
* **10-50:** Ofertas de 2da división.
* **51-60:** Ofertas de 1ra división (sin equipos grandes).
* **61-80:** Ofertas de cualquier equipo.
* **80-95:** Ofertas de Selecciones Nacionales (implica renunciar al club). Competiciones cada 4 años.
* **95-100:** Modo libre (elección de club/selección sin esperar oferta).

### 3. Fama (Multiplicador)
Valor de 1 a 100 (Inicia en 50).
* Si está entre **1-35** o **75-100**, el impacto de las decisiones en las facciones recibe un multiplicador (ej. una decisión de +10 pasa a ser +20).

### 4. Idolatría y Objetivos (LOS OBJETIVOS QUEDAN EXCLUIDOS DE LA VERSIÓN ACTUAL)
Valor acumulativo para ganar reputación local en el club actual.
* **Objetivos por temporada:** 3 misiones (una por facción). Completar cada una otorga +10 de Idolatría.
  * *Hinchas:* Ganar el clásico o títulos.
  * *Dirigencia:* Metas financieras.
  * *Jugadores:* Relación equilibrada con la prensa.
Cabe aclarar que al cambiar de club se reinicia la idolatría.
### 5. Finanzas
* Presupuesto asignado al inicio de temporada. Exceder el límite resulta en Game Over.

## Alcance del MVP (Fase 1)
* **UI Base:** Pantalla principal con las barras de progreso (Jugadores, Dirigencia, Hinchas).
* **Mecánica:** Swipe (izquierda/derecha) y animaciones de cartas.
* **Estado:** Lógica funcional de suma/resta a las barras.
* **Game Over:** Pantalla de fin de juego por llegar a 0 o 100 en las facciones.
* **Datos:** Mazo inicial de 50 cartas *hardcodeadas* en un archivo `cards.json` local.

## Stack Tecnológico y Entorno de Trabajo
* **Frontend / UI:** React.js configurado como PWA (Progressive Web App).
* **Animaciones / Físicas:** `framer-motion` o `react-tinder-card`.
* **Estado Global:** Zustand.
* **Base de Datos (MVP):** Archivo estático `.json` (Sin backend en Fase 1).
* **Arte:** Diseño minimalista, iconos simples, ilustraciones planas/pixel-art básico para rostros.