# Contexto de Telemetría (PostHog)

## 1. Objetivo de la Telemetría
El objetivo principal es recolectar estadísticas reales de juego de los usuarios cuando el proyecto esté en producción. A diferencia de las simulaciones Montecarlo, los usuarios reales tienen sesgos y cometen errores. La telemetría nos permitirá:
- Identificar cuellos de botella (Turnos donde ocurre mayor mortalidad).
- Analizar el Win-Rate real de las cartas y las opciones elegidas.
- Validar si la dificultad general del juego se siente justa.

## 2. Plataforma Seleccionada: PostHog
Se utilizará **PostHog Cloud** por sus ventajas en proyectos indie:
- **Gratis hasta 1.000.000 de eventos al mes**, lo que equivale a un millón de partidas registradas sin costo.
- Permite configurar un límite de facturación de $0 para evitar cargos sorpresa.
- No requiere levantar ni mantener un backend o base de datos propios.
- Genera dashboards, histogramas y embudos (funnels) de manera automática.

## 3. Estructura de Datos (El Payload)
Para minimizar el consumo de red y el uso de datos (recordando que es una PWA móvil), **NO** se enviarán eventos por cada click o turno. Se enviará un único evento consolidado al finalizar la temporada (victoria o derrota).

El evento sugerido (`temporada_terminada`) debería contener las siguientes propiedades:

```json
{
  "sessionId": "UUID-anonimo", 
  "resultado": "Derrota", // "Supervivencia" o "Derrota"
  "turnoFinal": 14,
  "motivoFin": "min_dirigencia",
  "faccionesAlFinalizar": { 
    "vestuario": 45, 
    "dirigencia": 0, 
    "hinchas": 80, 
    "prensa": 50 
  },
  "cartasJugadas": [
    { "turno": 1, "idCarta": 1001, "opcionElegida": "A" },
    { "turno": 2, "idCarta": 45, "opcionElegida": "B" }
  ]
}
```

## 4. Privacidad e Identidad
- **100% Anónimo:** No se solicitarán correos electrónicos ni inicios de sesión para evitar fricción y abandono del usuario.
- **Identificador de Sesión:** En el primer inicio de la app, se debe generar un identificador único (UUID) con `crypto.randomUUID()` y guardarlo en `localStorage`. Este ID se adjuntará al payload para diferenciar si 100 derrotas provienen de 100 usuarios distintos o de 1 solo usuario jugando repetidas veces.

## 5. Estrategia Offline-First (Manejo de Sin Conexión)
Muchos usuarios jugarán la PWA sin conexión a internet (en el transporte público, por ejemplo). La telemetría no debe fallar ni bloquear el juego.
- **Al perder/ganar:** Si no hay conexión a internet (`navigator.onLine === false`), el payload JSON se guardará en un array temporal en el `localStorage` (ej. `partidas_pendientes`).
- **Al abrir el juego:** Cada vez que el juego carga la pantalla de menú, se verificará la conexión. Si hay conexión y existen partidas pendientes en el `localStorage`, se enviarán a PostHog y se vaciará el almacenamiento local.
