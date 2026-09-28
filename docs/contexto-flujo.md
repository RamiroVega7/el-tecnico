## Flujo de juego

# Inicio:

Cuando un usuario entra a la aplicación web, lo primero que debe hacer es seleccionar la dificultad. 

Luego, en funcion de la dificultad se le permite elegir el club. En dificultad facil puede elegir cualquier club, en dificultad media solo clubes con expectativas medias o bajas, en dificultad dificil debe empezar en un club de 2da division (expectativa Ascenso). 

También antes de empezar va a tener que ingresar el nombre del manager y la nacionalidad.

# Situacion inicial: Temporada

Al presionar el boton iniciar, empieza la primera temporada. Cada temporada dura 20 cartas. De estas 3 son obligatorias e influyen directamente en la posibilidad de ganar partidos importantes/titulos. Además estos eventos obligatorios despliegan una carta especial que arroja un resultado. Al final de la temporada se juega el partido importante, que dependiendo las expectativas del club es: [Promocion por el ascenso, Definicion del descenso, Definicion de entrada a copas, Definicion del torneo local, Definicion del torneo internacional]

Eventos obligatorios (Decisiones Clave):

1. [PRETEMPORADA] Ej: Pedir fichaje estrella: Hacerlo afecta negativamente a la dirigencia pero positivamente a la hinchada y sube tu fama y tu idolatria. Ademas, perdes 1/3 del presupuesto anual. Sin embargo, aumenta las probabilidades de ganar el partido importante y el clasico.

2. [PREVIA AL CLASICO] Ej: Boquearla antes del clasico (Turno 10): Hacerlo afecta negativamente a la dirigencia y aumenta tu fama. Inmediatamente luego de la decisión y antes de mostrar la siguiente carta, se despliega la pantalla interactiva con el resultado del Clásico. Si ganas, otorga +20 de Idolatría, +10 de Prestigio y aplica el **filtro de equilibrio en facciones**: solo suma +20 a una facción si dicha facción se encuentra por debajo de 40 de relación (evitando que ganar un partido clave provoque un despido injusto por exceso de relación >= 100). Si pierdes, afecta negativamente (-20 hinchas, -10 vestuario, -10 dirigencia, -10 prestigio).

3. [PREVIA AL PARTIDO IMPORTANTE] Ej: Doble turno en momento decisivo (Turno 20): Hacerlo afecta negativamente al vestuario, pero da mas posibilidades de ganar el partido importante de la temporada. Inmediatamente luego de la decisión y antes de mostrar la siguiente carta, se despliega el resultado del Partido Importante (Promoción, Permanencia, Copas, Torneo Local o Torneo Internacional). Si ganas, otorga +20 de Idolatría, +20 de Prestigio y aplica el mismo filtro de equilibrio: suma +20 a cada facción únicamente si está por debajo de 40 de relación. Si pierdes, penaliza las métricas.

Al final de la temporada vas a ver el resumen de tu prestigio y tu idolatria y te van a llegar 2 ofertas de clubes (con que expectativas depende del prestigio) y la oferta de renovacion con tu club actual. Además, si tenés mas de 80 de prestigio una de las ofertas va a ser de la seleccion del pais del entrenador. 

# Situacion al cambiar de club:

Al comenzar en el nuevo club, se resetea la idolatría y también la relacion con las facciones (en 50 cada una), pero el prestigio y la fama se mantiene.

# Situacion al agarrar la seleccion (QUEDA EXCLUIDA DE LA VERSION ACTUAL):

La dinámica de temporada cambia, pasan a haber 10 tarjetas por temporada. Además, se intercalan años de eliminatorias, copa continental y mundial. El objetivo es ganar el torneo que toque o llevar al pais al mundial si son eliminatorias. Ahora hay solo 2 tarjetas obligatorias, la del clásico y la del partido importante de la competición que toque.

## Situaciones de derrota: 

Cuando perdes por alguno de los siguientes motivos, aparece una carta especial que te explica por qué perdiste de una forma jocosa y burlona y te da la opcion de reiniciar el juego. 

# Situacion de derrota 1: Facciones

### Faccion Hinchada:

Si la relacion con la hinchada cae a 0, los hinchas van a colgar banderas en contra tuyo y la dirigencia termina por echarte. Si la relacion con la hinchada llega a 100, la dirigencia te va a echar porque la prensa te acusa de corrupción y los barras se te meten en el vestuario.

### Faccion Jugadores: 

Si la relacion con los jugadores cae a 0, los jugadores te van a hacer la cama y van a perder a proposito hasta que finalmente te echan. Si llega a 100, la prensa va a hablar de "club de amigos" y la dirigencia va a tomar la decisión de echarte.

### Faccion dirigencia: 

Si la relacion cae a 0, lo que ocurrio es que el manager se fue a golpes de puño con el presidente del club. Si la relacion sube a 100, el presidente se va a dar cuenta que sos un chupamedias y va a buscar a otro.

### Problemas financieros:

Si se da, no solo te echan sino que fundís el club.

### Poco prestigio:

Si tenes menos de 10 de prestigio, no perdes inmediatamente sino que perdes la posibilidad de renovar y de fichar por otro club, ya que nadie te quiere, viendote obligado al retiro y a terminar como panelista en un canal de television de poca monta que sale al mediodia por YtC sports.

## Aclaracion sobre las derrotas: 

Perder no implica volver a empezar la partida, sino que te despiden de tu club actual y volves a generar ofertas de otros clubes (con que expectativas depende del prestigio). Por lo que la unica derrota real es perder por bajo prestigio. Cuando te despiden de un club perdes 20 puntos de prestigio.

## Final del juego.

El juego dura un máximo de 10 temporadas. Si lográs sobrevivir (es decir, no perder por prestigio mínimo) las 10 temporadas, habrás completado la carrera y ganado el juego, lo cual es una verdadera hazaña. En ese momento (o cuando pierdas tu carrera al llegar a menos de 10 de prestigio y no recibir más ofertas), se muestra la pantalla de **Resumen de Carrera**. 

Esta vista final exhibe una línea de tiempo (timeline) detallada con el balance final de cada una de tus temporadas: el club que dirigiste, si ganaste el clásico, si cumpliste o fracasaste en el objetivo, y si te echaron de tu puesto a mitad de temporada. 

Si llegaste al final y ganaste el juego, la pantalla se viste de detalles dorados y se activa una animación de confetis en celebración de tu éxito rotundo como director técnico. Desde allí, puedes reiniciar una nueva historia. 