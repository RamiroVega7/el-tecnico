import { create } from 'zustand';
import derrotas from '../assets/cardsInfo/derrotas.json';
import initialCards from '../assets/cardsInfo/cards.json';
import cartasObligatorias from '../assets/cardsInfo/cartasObligatorias.json';
import clubsData from '../assets/cardsInfo/clubs.json';
import { sendTelemetryEvent } from '../utils/telemetry';

const shuffle = (arr) => arr.sort(() => Math.random() - 0.5);

const buildSeasonDeck = (club) => {
  const expectativas = club?.Expectativas;
  const filteredCards = initialCards.filter(c => 
    !c.expectativasPermitidas || 
    c.expectativasPermitidas.length === 0 || 
    c.expectativasPermitidas.includes(expectativas)
  );

  const pool = shuffle([...filteredCards]);
  
  const fichaje = cartasObligatorias.fichajes[Math.floor(Math.random() * cartasObligatorias.fichajes.length)];
  const clasico = cartasObligatorias.previaClasico[Math.floor(Math.random() * cartasObligatorias.previaClasico.length)];
  const doble = cartasObligatorias.dobleTurno[Math.floor(Math.random() * cartasObligatorias.dobleTurno.length)];

  const deck = [];
  for (let i = 1; i <= 20; i++) {
    if (i === 1) deck.push(fichaje);
    else if (i === 10) deck.push(clasico);
    else if (i === 20) deck.push(doble);
    else {
      if (pool.length === 0) pool.push(...shuffle([...filteredCards]));
      deck.push(pool.pop());
    }
  }
  return deck;
};

export const useGameStore = create((set) => ({
  gamePhase: 'difficulty',
  dificultad: null,
  nombreManager: '',
  nacionalidadManager: 'Argentina',
  clubActual: null,
  idClubActual: null,
  temporadaActual: 1,
  anioActual: 2026,

  deck: [],
  modificadorProbClasico: 0,
  modificadorProbPartidoFinal: 0,
  resultadoClasico: 'pendiente',
  resultadoPartidoFinal: 'pendiente',
  objetivoCumplido: false,

  factions: {
    vestuario: 50,
    dirigencia: 50,
    hinchas: 50,
    prensa: 50,
  },
  prestigio: 50,
  idolatria: 0,
  finanzas: 10000000,
  fama: 50,
  isGameOver: false,
  gameOverReason: "",
  defeatId: null,
  defeatCard: null,
  offers: [],
  
  historialCarrera: [],
  careerWon: false,
  cartasJugadasTemporada: [],
  turnoTemporada: 0,

  setDificultad: (dificultad) => set({ 
    dificultad, 
    gamePhase: 'select_club' 
  }),

  setGamePhase: (gamePhase) => set({ gamePhase }),

  registrarCartaJugada: (idCarta, opcionElegida) => set((state) => ({
    turnoTemporada: state.turnoTemporada + 1,
    cartasJugadasTemporada: [...state.cartasJugadasTemporada, { turno: state.turnoTemporada + 1, idCarta, opcionElegida }]
  })),

  iniciarPartida: ({ club, nombreManager, nacionalidadManager }) => set({
    gamePhase: 'playing',
    clubActual: club,
    idClubActual: club?.idClub ?? null,
    nombreManager: nombreManager?.trim() || 'DT Míster',
    nacionalidadManager: nacionalidadManager || 'Argentina',
    finanzas: club?.FinanzasInicial ?? 10000000,
    factions: { vestuario: 50, dirigencia: 50, hinchas: 50, prensa: 50 },
    prestigio: 50,
    idolatria: 0,
    fama: 50,
    temporadaActual: 1,
    anioActual: 2026,
    isGameOver: false,
    gameOverReason: "",
    defeatId: null,
    defeatCard: null,
    deck: buildSeasonDeck(club),
    modificadorProbClasico: 0,
    modificadorProbPartidoFinal: 0,
    resultadoClasico: 'pendiente',
    resultadoPartidoFinal: 'pendiente',
    objetivoCumplido: false,
    offers: [],
    historialCarrera: [],
    careerWon: false,
    cartasJugadasTemporada: [],
    turnoTemporada: 0
  }),

  finishSeason: () => set((state) => {
    const newHistory = [...(state.historialCarrera || []), {
      temporada: state.temporadaActual,
      anio: state.anioActual,
      club: state.clubActual?.NombreClub,
      color: state.clubActual?.ColorPrincipal,
      resultadoClasico: state.resultadoClasico,
      resultadoPartidoFinal: state.resultadoPartidoFinal,
      objetivoCumplido: state.objetivoCumplido,
      prestigio: state.prestigio,
      idolatria: state.idolatria,
      finanzas: state.finanzas,
      despedido: false,
    }];
    
    if (state.temporadaActual >= 10) {
      sendTelemetryEvent('temporada_terminada', {
        resultado: "Supervivencia",
        turnoFinal: state.turnoTemporada,
        motivoFin: "fin_temporada",
        faccionesAlFinalizar: state.factions,
        cartasJugadas: state.cartasJugadasTemporada
      });
      return { 
        historialCarrera: newHistory,
        gamePhase: 'career_summary',
        careerWon: true,
        isGameOver: false,
        cartasJugadasTemporada: [],
        turnoTemporada: 0
      };
    }
    
    sendTelemetryEvent('temporada_terminada', {
      resultado: "Supervivencia",
      turnoFinal: state.turnoTemporada,
      motivoFin: "fin_temporada",
      faccionesAlFinalizar: state.factions,
      cartasJugadas: state.cartasJugadasTemporada
    });
    return {
      historialCarrera: newHistory,
      gamePhase: 'season_summary',
      cartasJugadasTemporada: [],
      turnoTemporada: 0
    };
  }),

  resolverClasico: () => set((state) => {
    const chance = 0.50 + state.modificadorProbClasico;
    const gana = Math.random() < chance;
    return { resultadoClasico: gana ? 'gana' : 'pierde' };
  }),

  resolverPartidoFinal: () => set((state) => {
    const chance = 0.50 + state.modificadorProbPartidoFinal;
    const gana = Math.random() < chance;
    return { resultadoPartidoFinal: gana ? 'gana' : 'pierde' };
  }),
  
  applyChanges: (changes) => set((state) => {
    const newFactions = { ...state.factions };
    let newPrestigio = state.prestigio;
    let newIdolatria = state.idolatria;
    let newFinanzas = state.finanzas;
    let newFama = state.fama ?? 50;
    let newModificadorProbClasico = state.modificadorProbClasico;
    let newModificadorProbPartidoFinal = state.modificadorProbPartidoFinal;
    let isGameOver = false;
    let gameOverReason = "";
    let defeatId = null;

    for (const [key, value] of Object.entries(changes)) {
      if (newFactions[key] !== undefined) {
        const mult = (state.fama < 35 || state.fama > 75) ? 1.5 : 1;
        newFactions[key] = Math.max(0, Math.min(100, Math.round(newFactions[key] + (value * mult))));
        
        if (newFactions[key] <= 0) {
          isGameOver = true;
          if (key === 'vestuario') defeatId = 'VestuarioMin';
          else if (key === 'dirigencia') defeatId = 'DirigenciaMin';
          else if (key === 'hinchas') defeatId = 'HinchadaMin';
          else defeatId = 'VestuarioMin';
          gameOverReason = `Despedido por inoperancia: ${key}`;
        } else if (newFactions[key] >= 100) {
          isGameOver = true;
          if (key === 'vestuario') defeatId = 'VestuarioMax';
          else if (key === 'dirigencia') defeatId = 'DirigenciaMax';
          else if (key === 'hinchas') defeatId = 'HinchadaMax';
          else defeatId = 'VestuarioMax';
          gameOverReason = `Despedido por exceso de poder: ${key}`;
        }
      }
      
      if (key === 'prestigio') newPrestigio = Math.max(0, Math.min(100, newPrestigio + value));
      if (key === 'idolatria') newIdolatria = Math.max(0, Math.min(100, newIdolatria + value));
      if (key === 'fama') newFama = Math.max(0, Math.min(100, newFama + value));
      if (key === 'bonusProbClasico') newModificadorProbClasico += value;
      if (key === 'bonusProbPartidoFinal') newModificadorProbPartidoFinal += value;
      if (key === 'impactoFinancieroPorcentaje') newFinanzas += (state.clubActual?.FinanzasInicial ?? 10000000) * value;
      
      if (key === 'finanzas') {
        const delta = (Math.abs(value) <= 100 && value !== 0) ? value * 1_000_000 : value;
        newFinanzas += delta;
      }
    }

    if (newFinanzas <= 0) {
      isGameOver = true;
      defeatId = 'FinanzasBancarrota';
      gameOverReason = "Despedido por bancarrota. El club se quedó sin fondos.";
    }

    let newHistorialCarrera = state.historialCarrera || [];
    if (isGameOver) {
      newHistorialCarrera = [...newHistorialCarrera, {
        temporada: state.temporadaActual,
        anio: state.anioActual,
        club: state.clubActual?.NombreClub,
        color: state.clubActual?.ColorPrincipal,
        resultadoClasico: state.resultadoClasico,
        resultadoPartidoFinal: state.resultadoPartidoFinal,
        objetivoCumplido: false,
        prestigio: newPrestigio,
        idolatria: newIdolatria,
        finanzas: newFinanzas,
        despedido: true,
      }];
    }

    let defeatCard = null;
    if (isGameOver && defeatId) {
      defeatCard = derrotas.find(d => d.idDerrota === defeatId) || {
        idDerrota: defeatId,
        motivo: "General",
        valorDetonante: 0,
        medioPeriodistico: "DIARIO EXTRA",
        volanta: "ÚLTIMO MOMENTO",
        titulo: "¡DESPIDO INMEDIATO!",
        bajada: gameOverReason,
        cuerpoNota: "La dirigencia del club decidió rescindir el contrato del director técnico en medio de un clima tenso y confuso.",
        descripcionBurlona: gameOverReason,
        personaje: "Comisión Directiva",
        epigrafeFoto: "El ex DT retirándose de las instalaciones en soledad.",
        botonAccion: "Nuevo DT (Reiniciar)"
      };
      gameOverReason = defeatCard.titulo;
    }
    
    if (!state.isGameOver && isGameOver) {
      sendTelemetryEvent('temporada_terminada', {
        resultado: "Derrota",
        turnoFinal: state.turnoTemporada,
        motivoFin: defeatId,
        faccionesAlFinalizar: newFactions,
        cartasJugadas: state.cartasJugadasTemporada
      });
    }

    return { 
      factions: newFactions, 
      prestigio: newPrestigio, 
      idolatria: newIdolatria,
      finanzas: newFinanzas, 
      fama: newFama,
      modificadorProbClasico: newModificadorProbClasico,
      modificadorProbPartidoFinal: newModificadorProbPartidoFinal,
      isGameOver, 
      gameOverReason,
      defeatId,
      defeatCard,
      historialCarrera: newHistorialCarrera
    };
  }),

  generateOffers: () => set((state) => {
    if (state.prestigio < 10) {
      return {
        isGameOver: true,
        defeatId: 'PrestigioMin',
        gameOverReason: "Nadie te quiere contratar."
      };
    }
    
    // Oferta de renovación
    const renewal = {
      id: 'renovacion',
      club: state.clubActual,
      tipo: 'renovacion'
    };

    // Otras ofertas basadas en prestigio
    const allClubs = clubsData.filter(c => c.idClub !== state.idClubActual);
    let allowedExpectations = [];
    if (state.prestigio >= 80) allowedExpectations = ['Gigante', 'Altas'];
    else if (state.prestigio >= 70) allowedExpectations = ['Altas', 'Medias'];
    else if (state.prestigio >= 60) allowedExpectations = ['Medias'];
    else if (state.prestigio >= 30) allowedExpectations = ['Bajas'];
    else allowedExpectations = ['Ascenso'];

    const filtered = allClubs.filter(c => allowedExpectations.includes(c.Expectativas));
    const randomClubs = shuffle(filtered).slice(0, 2);
    
    const offers = [
      renewal,
      ...randomClubs.map(c => ({ id: c.idClub, club: c, tipo: 'nuevo' }))
    ];

    return { offers, gamePhase: 'offers' };
  }),

  acceptOffer: (offer) => set((state) => {
    if (offer.tipo === 'renovacion') {
      return {
        gamePhase: 'playing',
        temporadaActual: state.temporadaActual + 1,
        anioActual: state.anioActual + 1,
        deck: buildSeasonDeck(state.clubActual),
        modificadorProbClasico: 0,
        modificadorProbPartidoFinal: 0,
        resultadoClasico: 'pendiente',
        resultadoPartidoFinal: 'pendiente',
        objetivoCumplido: false,
        factions: {
          vestuario: Math.round((state.factions.vestuario + 50) / 2),
          dirigencia: Math.round((state.factions.dirigencia + 50) / 2),
          hinchas: Math.round((state.factions.hinchas + 50) / 2),
          prensa: Math.round((state.factions.prensa + 50) / 2),
        },
        offers: [],
        cartasJugadasTemporada: [],
        turnoTemporada: 0
      };
    } else {
      // Cambio de club
      return {
        gamePhase: 'playing',
        clubActual: offer.club,
        idClubActual: offer.club.idClub,
        temporadaActual: 1,
        anioActual: state.anioActual + 1,
        deck: buildSeasonDeck(offer.club),
        finanzas: offer.club.FinanzasInicial,
        factions: { vestuario: 50, dirigencia: 50, hinchas: 50, prensa: 50 },
        idolatria: 0,
        modificadorProbClasico: 0,
        modificadorProbPartidoFinal: 0,
        resultadoClasico: 'pendiente',
        resultadoPartidoFinal: 'pendiente',
        objetivoCumplido: false,
        offers: [],
        cartasJugadasTemporada: [],
        turnoTemporada: 0
      };
    }
  }),

  handleDefeatAction: () => set((state) => {
    if (state.defeatId === 'PrestigioMin') {
      return {
        gamePhase: 'career_summary',
        careerWon: false,
        isGameOver: false
      };
    }

    const newPrestigio = Math.max(0, state.prestigio - 20);

    if (newPrestigio < 10) {
      const defeatCard = derrotas.find(d => d.idDerrota === 'PrestigioMin');
      sendTelemetryEvent('temporada_terminada', {
        resultado: "Derrota",
        turnoFinal: state.turnoTemporada,
        motivoFin: 'PrestigioMin',
        faccionesAlFinalizar: state.factions,
        cartasJugadas: state.cartasJugadasTemporada
      });
      return {
        prestigio: newPrestigio,
        isGameOver: true,
        defeatId: 'PrestigioMin',
        gameOverReason: "Nadie te quiere contratar.",
        defeatCard: defeatCard || {
          idDerrota: 'PrestigioMin',
          medioPeriodistico: "YTC SPORTS",
          volanta: "RETIRO OBLIGADO",
          titulo: "NADIE QUIERE CONTRATARLO",
          bajada: "Sin ofertas sobre la mesa tras una pésima gestión, el DT se ve obligado a colgar el buzo y sentarse como panelista.",
          cuerpoNota: "El teléfono nunca sonó. Ningún club, ni siquiera de las categorías más bajas del ascenso profundo, quiso arriesgarse a contratar a un entrenador con un historial tan pobre. Su prestigio cayó por los suelos. Ahora, su futuro está en discutir polémicas arbitrales a los gritos en el mediodía televisivo.",
          descripcionBurlona: "Tu prestigio es tan bajo que nadie te quiere. Terminaste como panelista de un programa de TV.",
          personaje: "Productor de TV",
          epigrafeFoto: "El ex DT debutando como columnista en un programa de debates.",
          botonAccion: "Ir a la Tele y Reiniciar"
        }
      };
    }

    const allClubs = clubsData.filter(c => c.idClub !== state.idClubActual);
    let allowedExpectations = [];
    if (newPrestigio >= 80) allowedExpectations = ['Gigante', 'Altas'];
    else if (newPrestigio >= 70) allowedExpectations = ['Altas', 'Medias'];
    else if (newPrestigio >= 60) allowedExpectations = ['Medias'];
    else if (newPrestigio >= 30) allowedExpectations = ['Bajas'];
    else allowedExpectations = ['Ascenso'];

    const filtered = allClubs.filter(c => allowedExpectations.includes(c.Expectativas));
    const randomClubs = shuffle(filtered).slice(0, 2);
    
    const offers = randomClubs.map(c => ({ id: c.idClub, club: c, tipo: 'nuevo' }));

    return { 
      prestigio: newPrestigio,
      isGameOver: false,
      defeatId: null,
      defeatCard: null,
      offers, 
      gamePhase: 'offers' 
    };
  }),

  resetGame: () => set({
    gamePhase: 'difficulty',
    dificultad: null,
    clubActual: null,
    idClubActual: null,
    nombreManager: '',
    nacionalidadManager: 'Argentina',
    factions: { vestuario: 50, dirigencia: 50, hinchas: 50, prensa: 50 },
    prestigio: 50,
    idolatria: 0,
    finanzas: 10000000,
    fama: 50,
    temporadaActual: 1,
    anioActual: 2026,
    isGameOver: false,
    gameOverReason: "",
    defeatId: null,
    defeatCard: null,
    deck: [],
    modificadorProbClasico: 0,
    modificadorProbPartidoFinal: 0,
    resultadoClasico: 'pendiente',
    resultadoPartidoFinal: 'pendiente',
    objetivoCumplido: false,
    offers: []
  })
}));
