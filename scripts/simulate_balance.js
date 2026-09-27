import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Paths to JSON files
const cardsPath = path.resolve(__dirname, '../src/assets/cardsInfo/cards.json');
const cartasObligatoriasPath = path.resolve(__dirname, '../src/assets/cardsInfo/cartasObligatorias.json');
const clubsPath = path.resolve(__dirname, '../src/assets/cardsInfo/clubs.json');

// Read JSON files
const initialCards = JSON.parse(fs.readFileSync(cardsPath, 'utf8'));
const cartasObligatorias = JSON.parse(fs.readFileSync(cartasObligatoriasPath, 'utf8'));
const clubsData = JSON.parse(fs.readFileSync(clubsPath, 'utf8'));

// Utilities
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

// Modifiers logic extracted from SwipeCard
const calculateModifiers = (card, option) => {
  if (!option) return {};
  if (option.modificadores) return option.modificadores;

  const changes = {};
  const incidenciaDelta = {
    Baja: 5,
    Media: 10,
    Alta: 15
  };

  if (option.afectadosPositivo && typeof option.afectadosPositivo === 'object') {
    if (Array.isArray(option.afectadosPositivo)) {
      const baseDelta = incidenciaDelta[card?.incidencia] || 10;
      option.afectadosPositivo.forEach((metric) => {
        changes[metric] = (changes[metric] || 0) + baseDelta;
      });
    } else {
      Object.entries(option.afectadosPositivo).forEach(([metric, inc]) => {
        const delta = incidenciaDelta[inc] || 10;
        changes[metric] = (changes[metric] || 0) + delta;
      });
    }
  }

  if (option.afectadosNegativo && typeof option.afectadosNegativo === 'object') {
    if (Array.isArray(option.afectadosNegativo)) {
      const baseDelta = incidenciaDelta[card?.incidencia] || 10;
      option.afectadosNegativo.forEach((metric) => {
        changes[metric] = (changes[metric] || 0) - baseDelta;
      });
    } else {
      Object.entries(option.afectadosNegativo).forEach(([metric, inc]) => {
        const delta = incidenciaDelta[inc] || 10;
        changes[metric] = (changes[metric] || 0) - delta;
      });
    }
  }

  if (typeof option.impactoFinanzas === 'number' && option.impactoFinanzas !== 0) {
    changes.finanzas = option.impactoFinanzas;
  }

  if (option.impactoFinancieroPorcentaje !== undefined) {
    changes.impactoFinancieroPorcentaje = option.impactoFinancieroPorcentaje;
  }
  
  if (option.bonusProbClasico !== undefined) {
    changes.bonusProbClasico = option.bonusProbClasico;
  }

  if (option.bonusProbPartidoFinal !== undefined) {
    changes.bonusProbPartidoFinal = option.bonusProbPartidoFinal;
  }

  return changes;
};

// Evaluate the best option (Heuristic: minimize distance to 50, avoiding 0 and 100)
const evaluateOption = (factions, changes) => {
  let score = 0;
  let minFaction = 100;
  let maxFaction = 0;

  const newFactions = { ...factions };
  for (const [key, value] of Object.entries(changes)) {
    if (newFactions[key] !== undefined) {
      newFactions[key] += value;
    }
  }

  for (const val of Object.values(newFactions)) {
    if (val <= 0 || val >= 100) return -9999; // Death
    if (val < minFaction) minFaction = val;
    if (val > maxFaction) maxFaction = val;
    
    // Penalty for deviating from 50
    score -= Math.abs(50 - val);
  }

  // Bonus for keeping the extremes safe
  score += minFaction;
  score -= Math.max(0, maxFaction - 80);

  return score;
};

// CONSERVADOR: Elige la opción que genera el menor cambio total (minimiza el riesgo)
const evaluateConservative = (changes) => {
  let totalChange = 0;
  for (const [key, value] of Object.entries(changes)) {
    if (['vestuario', 'dirigencia', 'hinchas', 'prensa'].includes(key)) {
      totalChange += Math.abs(value);
    }
  }
  return -totalChange; // Menor cambio = mejor score
};

// REACTIVO (MIOPE): Solo se fija en la facción que tiene más baja y trata de subirla
const evaluateReactive = (factions, changes) => {
  let minFactionKey = 'vestuario';
  let minVal = 100;
  for (const [key, val] of Object.entries(factions)) {
    if (val < minVal) {
      minVal = val;
      minFactionKey = key;
    }
  }
  
  // Si la decisión te mata en otra facción, sigue siendo mala
  const newFactions = { ...factions };
  for (const [key, value] of Object.entries(changes)) {
    if (newFactions[key] !== undefined) newFactions[key] += value;
  }
  for (const val of Object.values(newFactions)) {
    if (val <= 0 || val >= 100) return -9999;
  }

  // Prioriza el cambio positivo a la facción más baja
  return changes[minFactionKey] || 0;
};

// APASIONADO: Favorece a la Hinchada y al Vestuario, ignorando Dirigencia y Prensa (salvo que sea letal)
const evaluatePassionate = (factions, changes) => {
  const newFactions = { ...factions };
  for (const [key, value] of Object.entries(changes)) {
    if (newFactions[key] !== undefined) newFactions[key] += value;
  }
  for (const val of Object.values(newFactions)) {
    if (val <= 0 || val >= 100) return -9999;
  }

  let score = 0;
  if (changes.hinchas) score += changes.hinchas * 2;
  if (changes.vestuario) score += changes.vestuario * 1.5;
  if (changes.dirigencia) score -= Math.abs(changes.dirigencia); // Odia favorecer a la dirigencia
  
  return score;
};

// Simulation settings
const NUM_SIMULATIONS = 10000;

function runSimulation(type = 'SMART') {
  let results = {
    totalGames: NUM_SIMULATIONS,
    survivedFullSeason: 0,
    firedDueToFactionMin: { vestuario: 0, dirigencia: 0, hinchas: 0, prensa: 0 },
    firedDueToFactionMax: { vestuario: 0, dirigencia: 0, hinchas: 0, prensa: 0 },
    averageTurnsSurvived: 0,
    averageTurnsInCriticalState: 0, // Métrica de Tensión
    mortalityByTurn: Array(22).fill(0), // Histograma de muerte por turno
    clasicosWon: 0,
    clasicosLost: 0,
    finalesWon: 0,
    finalesLost: 0,
    finalPrestigio: 0,
    cardStats: {} // Interno para calcular winrates
  };

  let totalTurnsSurvived = 0;
  let totalCriticalTurns = 0;
  let totalPrestigio = 0;

  console.log(`\n======================================================`);
  console.log(`Ejecutando ${NUM_SIMULATIONS} simulaciones usando perfil: ${type}`);
  console.log(`======================================================`);

  for (let i = 0; i < NUM_SIMULATIONS; i++) {
    const club = clubsData[Math.floor(Math.random() * clubsData.length)];
    const deck = buildSeasonDeck(club);
    
    let state = {
      factions: { vestuario: 50, dirigencia: 50, hinchas: 50, prensa: 50 },
      prestigio: 50,
      fama: 50,
      modificadorProbClasico: 0,
      modificadorProbPartidoFinal: 0,
      isGameOver: false,
      gameOverReason: "",
      turn: 0,
      criticalTurns: 0
    };

    for (let t = 0; t < deck.length; t++) {
      const card = deck[t];
      state.turn++;

      const option1 = card.opciones.opcion1 || card.opciones.A;
      const option2 = card.opciones.opcion2 || card.opciones.B;

      const changes1 = calculateModifiers(card, option1);
      const changes2 = calculateModifiers(card, option2);

      let chosenChanges;
      
      if (type === 'SMART') {
        const score1 = evaluateOption(state.factions, changes1);
        const score2 = evaluateOption(state.factions, changes2);
        chosenChanges = score1 >= score2 ? changes1 : changes2;
      } else if (type === 'CONSERVADOR') {
        const score1 = evaluateConservative(changes1);
        const score2 = evaluateConservative(changes2);
        chosenChanges = score1 >= score2 ? changes1 : changes2;
      } else if (type === 'REACTIVO') {
        const score1 = evaluateReactive(state.factions, changes1);
        const score2 = evaluateReactive(state.factions, changes2);
        chosenChanges = score1 >= score2 ? changes1 : changes2;
      } else if (type === 'APASIONADO') {
        const score1 = evaluatePassionate(state.factions, changes1);
        const score2 = evaluatePassionate(state.factions, changes2);
        chosenChanges = score1 >= score2 ? changes1 : changes2;
      } else { // RANDOM
        chosenChanges = Math.random() > 0.5 ? changes1 : changes2;
      }

      // Apply changes
      const mult = (state.fama < 35 || state.fama > 75) ? 2 : 1;
      for (const [key, value] of Object.entries(chosenChanges)) {
        if (state.factions[key] !== undefined) {
          state.factions[key] = Math.max(0, Math.min(100, state.factions[key] + (value * mult)));
          if (state.factions[key] <= 0) {
            state.isGameOver = true;
            state.gameOverReason = `min_${key}`;
            break;
          } else if (state.factions[key] >= 100) {
            state.isGameOver = true;
            state.gameOverReason = `max_${key}`;
            break;
          }
        }
        if (key === 'prestigio') state.prestigio = Math.max(0, Math.min(100, state.prestigio + value));
        if (key === 'fama') state.fama = Math.max(0, Math.min(100, state.fama + value));
        if (key === 'bonusProbClasico') state.modificadorProbClasico += value;
        if (key === 'bonusProbPartidoFinal') state.modificadorProbPartidoFinal += value;
      }

      if (state.isGameOver) break;

      // Evaluar Tensión (alguna facción en riesgo < 20 o > 80)
      let isCritical = false;
      for (const val of Object.values(state.factions)) {
        if (val <= 20 || val >= 80) isCritical = true;
      }
      if (isCritical) state.criticalTurns++;

      // Simulate Clasico
      if (t === 9) { // turn 10
        const chance = 0.50 + state.modificadorProbClasico;
        const clampedProb = Math.max(0.15, Math.min(0.85, chance));
        const gana = Math.random() < clampedProb;
        if (gana) {
          results.clasicosWon++;
          state.prestigio += 10;
          state.fama += 10;
          if (state.factions.vestuario < 40) state.factions.vestuario += 20;
          if (state.factions.dirigencia < 40) state.factions.dirigencia += 20;
          if (state.factions.hinchas < 40) state.factions.hinchas += 20;
        } else {
          results.clasicosLost++;
          state.factions.hinchas -= 20;
          state.factions.vestuario -= 10;
          state.factions.dirigencia -= 10;
          state.prestigio -= 10;
          state.fama -= 5;
          
          // Check game over
          if (state.factions.hinchas <= 0) { state.isGameOver = true; state.gameOverReason = `min_hinchas`; break; }
          if (state.factions.vestuario <= 0) { state.isGameOver = true; state.gameOverReason = `min_vestuario`; break; }
          if (state.factions.dirigencia <= 0) { state.isGameOver = true; state.gameOverReason = `min_dirigencia`; break; }
        }
      }

      // Simulate Final
      if (t === 19 && !state.isGameOver) { // turn 20
        const chance = 0.50 + state.modificadorProbPartidoFinal;
        const clampedProb = Math.max(0.15, Math.min(0.85, chance));
        const gana = Math.random() < clampedProb;
        if (gana) {
          results.finalesWon++;
          state.prestigio += 20;
          state.fama += 15;
        } else {
          results.finalesLost++;
          state.factions.hinchas -= 20;
          state.factions.dirigencia -= 15;
          state.factions.vestuario -= 10;
          state.prestigio -= 15;
          state.fama -= 5;
          
          // Check game over after final just in case
          if (state.factions.hinchas <= 0) { state.isGameOver = true; state.gameOverReason = `min_hinchas`; }
          if (state.factions.dirigencia <= 0) { state.isGameOver = true; state.gameOverReason = `min_dirigencia`; }
          if (state.factions.vestuario <= 0) { state.isGameOver = true; state.gameOverReason = `min_vestuario`; }
        }
      }
    }

    // Register results for this simulation
    totalTurnsSurvived += state.turn;
    totalCriticalTurns += state.criticalTurns;
    const wonGame = !state.isGameOver;

    if (wonGame) {
      results.survivedFullSeason++;
      totalPrestigio += state.prestigio;
    } else {
      results.mortalityByTurn[state.turn]++;
      if (state.gameOverReason.startsWith('min_')) {
        results.firedDueToFactionMin[state.gameOverReason.replace('min_', '')]++;
      } else if (state.gameOverReason.startsWith('max_')) {
        results.firedDueToFactionMax[state.gameOverReason.replace('max_', '')]++;
      }
    }

    // Register card stats (Win Rate analysis)
    for (let t = 0; t < state.turn; t++) {
      const card = deck[t];
      const textChunk = card.tituloCarta || card.descripcion || 'SinTitulo';
      const cardId = card.idCarta || card.id || (`${card.personaje || 'Desc'}_${textChunk.substring(0, 15)}`); 
      if (!results.cardStats[cardId]) {
        results.cardStats[cardId] = { seen: 0, wins: 0, id: cardId, titulo: card.tituloCarta, descripcion: card.descripcion };
      }
      results.cardStats[cardId].seen++;
      if (wonGame) results.cardStats[cardId].wins++;
    }
  }

  // Process Aggregates
  results.averageTurnsSurvived = (totalTurnsSurvived / NUM_SIMULATIONS).toFixed(2);
  results.averageTurnsInCriticalState = (totalCriticalTurns / NUM_SIMULATIONS).toFixed(2);
  results.averageFinalPrestigio = results.survivedFullSeason > 0 ? (totalPrestigio / results.survivedFullSeason).toFixed(2) : 0;
  
  const totalClasicos = results.clasicosWon + results.clasicosLost;
  results.winRateClasicos = totalClasicos > 0 ? ((results.clasicosWon / totalClasicos) * 100).toFixed(2) + '%' : '0%';
  
  const totalFinales = results.finalesWon + results.finalesLost;
  results.winRateFinales = totalFinales > 0 ? ((results.finalesWon / totalFinales) * 100).toFixed(2) + '%' : '0%';

  // Calculate Card Win Rates
  const sortedCards = Object.values(results.cardStats)
    .map(c => ({
      id: c.id,
      preview: c.titulo || (c.descripcion ? c.descripcion.substring(0, 30) + '...' : 'Unknown'),
      seen: c.seen,
      winRate: (c.wins / c.seen) * 100
    }))
    .filter(c => c.seen > NUM_SIMULATIONS * 0.01) // Ignorar cartas muy raras
    .sort((a, b) => b.winRate - a.winRate);

  // Top 5 OP Cards
  results.topCartasOP = sortedCards.slice(0, 5).map(c => 
    `[${c.winRate.toFixed(1)}% WR] ${c.id}: ${c.preview}`
  );
  
  // Top 5 Punishing Cards
  results.topCartasPunitivas = sortedCards.slice(-5).reverse().map(c => 
    `[${c.winRate.toFixed(1)}% WR] ${c.id}: ${c.preview}`
  );

  delete results.cardStats; // Ocultamos el objeto masivo del JSON final
  
  // Limpiar mortalidad por turno vacía (para que no ensucie el log)
  results.mortalityByTurn = results.mortalityByTurn.reduce((acc, count, turn) => {
    if (count > 0) acc[`Turno ${turn}`] = count;
    return acc;
  }, {});

  console.log(JSON.stringify(results, null, 2));
}

runSimulation('RANDOM');
runSimulation('SMART');
runSimulation('CONSERVADOR');
runSimulation('REACTIVO');
runSimulation('APASIONADO');
