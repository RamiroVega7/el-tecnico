import clubs from '../assets/cardsInfo/clubs.json';

const RIVALES_PARTIDO_FINAL = {
  Ascenso: [
    { NombreClub: 'San Telmo', ColorPrincipal: '#0055A5', Ciudad: 'Isla Maciel' },
    { NombreClub: 'Nueva Chicago', ColorPrincipal: '#006400', Ciudad: 'Mataderos' },
    { NombreClub: 'Defensores de Belgrano', ColorPrincipal: '#8B0000', Ciudad: 'Núñez' },
    { NombreClub: 'Ferro Carril Oeste', ColorPrincipal: '#2E7D32', Ciudad: 'Caballito' }
  ],
  Bajas: [
    { NombreClub: 'Sarmiento de Junín', ColorPrincipal: '#1B5E20', Ciudad: 'Junín' },
    { NombreClub: 'Platense', ColorPrincipal: '#5D4037', Ciudad: 'Vicente López' },
    { NombreClub: 'Central Córdoba', ColorPrincipal: '#212121', Ciudad: 'Santiago del Estero' },
    { NombreClub: 'Riestra', ColorPrincipal: '#111111', Ciudad: 'Bajo Flores' }
  ],
  Medias: [
    { NombreClub: 'Argentinos Juniors', ColorPrincipal: '#B71C1C', Ciudad: 'La Paternal' },
    { NombreClub: 'Estudiantes de La Plata', ColorPrincipal: '#C62828', Ciudad: 'La Plata' },
    { NombreClub: 'Lanús', ColorPrincipal: '#4A148C', Ciudad: 'Lanús' },
    { NombreClub: 'Defensa y Justicia', ColorPrincipal: '#FBC02D', Ciudad: 'Florencio Varela' }
  ],
  Altas: [
    { NombreClub: 'Vélez Sarsfield', ColorPrincipal: '#0D47A1', Ciudad: 'Liniers' },
    { NombreClub: 'Talleres de Córdoba', ColorPrincipal: '#0A192F', Ciudad: 'Córdoba' },
    { NombreClub: 'Racing Club', ColorPrincipal: '#6CB3E4', Ciudad: 'Avellaneda' },
    { NombreClub: 'River Plate', ColorPrincipal: '#ED1B24', Ciudad: 'Núñez' }
  ],
  Gigante: [
    { NombreClub: 'Palmeiras', ColorPrincipal: '#006437', Ciudad: 'São Paulo' },
    { NombreClub: 'Flamengo', ColorPrincipal: '#C4122D', Ciudad: 'Río de Janeiro' },
    { NombreClub: 'Atlético Mineiro', ColorPrincipal: '#212121', Ciudad: 'Belo Horizonte' },
    { NombreClub: 'Fluminense', ColorPrincipal: '#800020', Ciudad: 'Río de Janeiro' }
  ]
};

const SCORES_VICTORIA = [
  { local: 2, visitante: 1 },
  { local: 1, visitante: 0 },
  { local: 3, visitante: 2 },
  { local: 2, visitante: 0 },
  { local: 3, visitante: 1 }
];

const SCORES_DERROTA = [
  { local: 1, visitante: 2 },
  { local: 0, visitante: 1 },
  { local: 2, visitante: 3 },
  { local: 0, visitante: 2 },
  { local: 1, visitante: 3 }
];

const getRandomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

export const simulateClasico = (clubActual, storeState = {}) => {
  const rivalId = clubActual?.ClasicoRivalId;
  let rival = clubs.find(c => c.idClub === rivalId);
  
  if (!rival) {
    rival = clubs.find(c => c.idClub !== clubActual?.idClub) || {
      NombreClub: 'Clásico Rival',
      ColorPrincipal: '#3F3A3A'
    };
  }

  const bonusProb = storeState.modificadorProbClasico || 0;
  const rawProb = 0.50 + bonusProb;
  const clampedProb = Math.max(0.15, Math.min(0.85, rawProb));
  const gana = Math.random() < clampedProb;

  const scorePair = getRandomItem(gana ? SCORES_VICTORIA : SCORES_DERROTA);
  // El equipo del usuario siempre es el número ganador si gana, o perdedor si pierde
  const golesUsuario = gana ? Math.max(scorePair.local, scorePair.visitante) : Math.min(scorePair.local, scorePair.visitante);
  const golesRival = gana ? Math.min(scorePair.local, scorePair.visitante) : Math.max(scorePair.local, scorePair.visitante);

  const titular = gana
    ? '¡FIESTA EN EL CLÁSICO! ¡EL PUEBLO ESTÁ DE CARNAVAL!'
    : 'DERROTA DOLOROSA: EL CLÁSICO FUE PARA EL RIVAL';

  const relato = gana
    ? `En una batalla épica de 90 minutos con pierna fuerte y corazón caliente, ${clubActual?.NombreClub || 'tu equipo'} derrotó a ${rival.NombreClub}. Con un final infartante y el aliento incesante de las tribunas, la ciudad se tiñe con tus colores.`
    : `En un clásico áspero y cargado de nerviosismo, ${rival.NombreClub} aprovechó las dudas defensivas y se llevó la victoria. El vestuario quedó en silencio sepulcral y la hinchada mastica una bronca que tardará en sanar.`;

  const highlights = gana
    ? [
        { minuto: "18'", texto: `Golpe por golpe: pierna fuerte y amonestados en ambos bandos.` },
        { minuto: "64'", texto: `¡GOLAZO! Desborde letal y definición cruzada para poner el festejo.` },
        { minuto: "89'", texto: `Aguante heroico en el área propia sacando todo lo que caía.` }
      ]
    : [
        { minuto: "27'", texto: `Pelota parada letal del rival que no se logró despejar a tiempo.` },
        { minuto: "71'", texto: `Tiro en el travesaño que ahogó el grito del empate.` },
        { minuto: "90+2'", texto: `Pitazo final en medio del festejo desmedido de ${rival.NombreClub}.` }
      ];

  const currentFactions = storeState?.factions || {};
  let consecuencias;

  if (gana) {
    consecuencias = {
      idolatria: 20,
      prestigio: 10,
      fama: 10
    };
    // Filtro de equilibrio: sumar 20 a cada facción solo si está por debajo de 40
    // para evitar que ganar el clásico provoque despido por exceso de relación (>= 100)
    if ((currentFactions.vestuario ?? 50) < 40) consecuencias.vestuario = 20;
    if ((currentFactions.dirigencia ?? 50) < 40) consecuencias.dirigencia = 20;
    if ((currentFactions.hinchas ?? 50) < 40) consecuencias.hinchas = 20;
  } else {
    consecuencias = {
      hinchas: -20,
      vestuario: -10,
      dirigencia: -10,
      prestigio: -10,
      fama: -5
    };
  }

  return {
    tipo: 'clasico',
    tituloCompeticion: 'SUPERCLÁSICO DE LA TEMPORADA',
    subtituloCompeticion: clubActual?.DivisionInicial === 2 ? 'Torneo Primera Nacional' : 'Torneo de Primera División',
    equipoLocal: {
      nombre: clubActual?.NombreClub || 'Tu Club',
      color: clubActual?.ColorPrincipal || '#3F3A3A',
      esUsuario: true
    },
    equipoVisitante: {
      nombre: rival.NombreClub,
      color: rival.ColorPrincipal || '#6E5B5B',
      esUsuario: false
    },
    golesLocal: golesUsuario,
    golesVisitante: golesRival,
    gana,
    titular,
    relato,
    highlights,
    consecuencias,
    probabilidadCalculada: Math.round(clampedProb * 100)
  };
};

export const simulatePartidoFinal = (clubActual, storeState = {}) => {
  const expectativa = clubActual?.Expectativas || 'Medias';

  let configCompeticion = {
    titulo: 'FINAL POR EL ASCENSO A PRIMERA',
    subtitulo: 'Partido Definitorio por el Boleto a la Máxima Categoría',
    tipoInterno: 'PromocionAscenso'
  };

  if (expectativa === 'Bajas') {
    configCompeticion = {
      titulo: 'DESEMPATE POR LA PERMANENCIA',
      subtitulo: 'Duelo a Todo o Nada para Salvar la Categoría',
      tipoInterno: 'DefinicionDescenso'
    };
  } else if (expectativa === 'Medias') {
    configCompeticion = {
      titulo: 'DEFINICIÓN POR CLASIFICACIÓN A COPAS',
      subtitulo: 'Último Boleto Disponible a la Copa Internacional',
      tipoInterno: 'DefinicionCopas'
    };
  } else if (expectativa === 'Altas') {
    configCompeticion = {
      titulo: 'GRAN FINAL DEL TORNEO LOCAL',
      subtitulo: 'Duelo Mano a Mano por la Corona de Campeón Nacional',
      tipoInterno: 'TorneoLocal'
    };
  } else if (expectativa === 'Gigante') {
    configCompeticion = {
      titulo: 'GRAN FINAL CONTINENTAL',
      subtitulo: 'La Gloria Máxima en Juego a Nivel Internacional',
      tipoInterno: 'TorneoInternacional'
    };
  }

  const poolRivales = RIVALES_PARTIDO_FINAL[expectativa] || RIVALES_PARTIDO_FINAL.Medias;
  // Filtrar si el rival tiene el mismo nombre que el club actual
  const rivalesDisponibles = poolRivales.filter(r => r.NombreClub !== clubActual?.NombreClub);
  const rival = getRandomItem(rivalesDisponibles.length > 0 ? rivalesDisponibles : poolRivales);

  const bonusProb = storeState.modificadorProbPartidoFinal || 0;
  const rawProb = 0.50 + bonusProb;
  const clampedProb = Math.max(0.15, Math.min(0.85, rawProb));
  const gana = Math.random() < clampedProb;

  const scorePair = getRandomItem(gana ? SCORES_VICTORIA : SCORES_DERROTA);
  const golesUsuario = gana ? Math.max(scorePair.local, scorePair.visitante) : Math.min(scorePair.local, scorePair.visitante);
  const golesRival = gana ? Math.min(scorePair.local, scorePair.visitante) : Math.max(scorePair.local, scorePair.visitante);

  const titular = gana
    ? '¡HAZAÑA HISTÓRICA! ¡OBJETIVO DE TEMPORADA CUMPLIDO!'
    : 'DESAZÓN TOTAL: SE ESCAPÓ EL OBJETIVO EN LA HORA';

  const relato = gana
    ? `¡Inolvidable consagración! Con una muestra descomunal de carácter y concentración, ${clubActual?.NombreClub || 'tu equipo'} doblegó a ${rival.NombreClub}. Los jugadores te llevan en andas, la directiva festeja el presupuesto asegurado y los hinchas lloran de emoción.`
    : `Un final doloroso y cruel. El equipo dio batalla hasta el último suspiro, pero ${rival.NombreClub} aprovechó su momento de gracia para quedarse con el objetivo. El vestuario queda destrozado y se abre un manto de incertidumbre.`;

  const highlights = gana
    ? [
        { minuto: "31'", texto: `Parada monumental de nuestro arquero en el mano a mano decisivo.` },
        { minuto: "78'", texto: `¡GOL DE CAMPEONATO! Jugada colectiva magistral que desata la locura.` },
        { minuto: "90+4'", texto: `¡FINAL! Emoción, abrazos y desahogo en una fiesta inolvidable.` }
      ]
    : [
        { minuto: "44'", texto: `Descuido en la marca que el rival cambia por gol antes del entretiempo.` },
        { minuto: "82'", texto: `Remate agónico en el poste que casi nos daba la resurrección.` },
        { minuto: "90+3'", texto: `Final del partido: la desilusión se apodera de todo el plantel.` }
      ];

  const currentFactions = storeState?.factions || {};
  let consecuencias;

  if (gana) {
    consecuencias = {
      idolatria: 20,
      prestigio: 20,
      fama: 15
    };
    // Filtro de equilibrio: sumar 20 a cada facción solo si está por debajo de 40
    // para evitar que ganar el partido importante provoque despido por exceso de relación (>= 100)
    if ((currentFactions.vestuario ?? 50) < 40) consecuencias.vestuario = 20;
    if ((currentFactions.dirigencia ?? 50) < 40) consecuencias.dirigencia = 20;
    if ((currentFactions.hinchas ?? 50) < 40) consecuencias.hinchas = 20;
  } else {
    consecuencias = {
      hinchas: -20,
      dirigencia: -15,
      vestuario: -10,
      prestigio: -15,
      fama: -5
    };
  }

  return {
    tipo: 'partido_importante',
    tituloCompeticion: configCompeticion.titulo,
    subtituloCompeticion: configCompeticion.subtitulo,
    equipoLocal: {
      nombre: clubActual?.NombreClub || 'Tu Club',
      color: clubActual?.ColorPrincipal || '#3F3A3A',
      esUsuario: true
    },
    equipoVisitante: {
      nombre: rival.NombreClub,
      color: rival.ColorPrincipal || '#6E5B5B',
      esUsuario: false
    },
    golesLocal: golesUsuario,
    golesVisitante: golesRival,
    gana,
    titular,
    relato,
    highlights,
    consecuencias,
    probabilidadCalculada: Math.round(clampedProb * 100)
  };
};
