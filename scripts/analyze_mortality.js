import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const cardsPath = path.resolve(__dirname, '../src/assets/cardsInfo/cards.json');
const cartasObligatoriasPath = path.resolve(__dirname, '../src/assets/cardsInfo/cartasObligatorias.json');
const clubsPath = path.resolve(__dirname, '../src/assets/cardsInfo/clubs.json');

const initialCards = JSON.parse(fs.readFileSync(cardsPath, 'utf8'));
const cartasObligatorias = JSON.parse(fs.readFileSync(cartasObligatoriasPath, 'utf8'));
const clubsData = JSON.parse(fs.readFileSync(clubsPath, 'utf8'));

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

const calculateModifiers = (card, option) => {
  if (!option) return {};
  if (option.modificadores) return option.modificadores;

  const changes = {};
  const incidenciaDelta = { Baja: 5, Media: 10, Alta: 15 };

  if (option.afectadosPositivo) {
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

  if (option.afectadosNegativo) {
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
  
  if (option.bonusProbClasico !== undefined) changes.bonusProbClasico = option.bonusProbClasico;
  if (option.bonusProbPartidoFinal !== undefined) changes.bonusProbPartidoFinal = option.bonusProbPartidoFinal;

  return changes;
};

// Vamos a usar un perfil APASIONADO que es el que mas moria
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

const NUM_SIMULATIONS = 20000;

function runDetailedMortalityAnalysis() {
  console.log(`Ejecutando ${NUM_SIMULATIONS} simulaciones para analizar mortalidad por turno...\n`);

  let turnData = {};
  for(let i=1; i<=20; i++) {
    turnData[i] = { totalMuertes: 0, razones: {} };
  }

  for (let i = 0; i < NUM_SIMULATIONS; i++) {
    const club = clubsData[Math.floor(Math.random() * clubsData.length)];
    const deck = buildSeasonDeck(club);
    
    let state = {
      factions: { vestuario: 50, dirigencia: 50, hinchas: 50, prensa: 50 },
      fama: 50, modificadorProbClasico: 0, modificadorProbPartidoFinal: 0,
      isGameOver: false, gameOverReason: "", turn: 0
    };

    for (let t = 0; t < deck.length; t++) {
      const card = deck[t];
      state.turn++;
      const option1 = card.opciones.opcion1 || card.opciones.A;
      const option2 = card.opciones.opcion2 || card.opciones.B;
      const changes1 = calculateModifiers(card, option1);
      const changes2 = calculateModifiers(card, option2);

      const score1 = evaluatePassionate(state.factions, changes1);
      const score2 = evaluatePassionate(state.factions, changes2);
      const chosenChanges = score1 >= score2 ? changes1 : changes2;

      const mult = (state.fama < 35 || state.fama > 75) ? 2 : 1;
      for (const [key, value] of Object.entries(chosenChanges)) {
        if (state.factions[key] !== undefined) {
          state.factions[key] = Math.max(0, Math.min(100, state.factions[key] + (value * mult)));
          if (state.factions[key] <= 0) { state.isGameOver = true; state.gameOverReason = `Dirigido por Min ${key.toUpperCase()}`; break; }
          if (state.factions[key] >= 100) { state.isGameOver = true; state.gameOverReason = `Echado por Max ${key.toUpperCase()}`; break; }
        }
        if (key === 'bonusProbClasico') state.modificadorProbClasico += value;
        if (key === 'bonusProbPartidoFinal') state.modificadorProbPartidoFinal += value;
      }

      if (state.isGameOver) break;

      if (t === 9) { // Clásico (Turno 10)
        const gana = Math.random() < Math.max(0.15, Math.min(0.85, 0.50 + state.modificadorProbClasico));
        if (gana) {
          state.factions.vestuario += 20; state.factions.dirigencia += 20; state.factions.hinchas += 20;
        } else {
          state.factions.hinchas -= 20; state.factions.vestuario -= 10; state.factions.dirigencia -= 10;
          if (state.factions.hinchas <= 0) { state.isGameOver = true; state.gameOverReason = "Perder el Clásico (Min HINCHAS)"; break; }
          if (state.factions.vestuario <= 0) { state.isGameOver = true; state.gameOverReason = "Perder el Clásico (Min VESTUARIO)"; break; }
          if (state.factions.dirigencia <= 0) { state.isGameOver = true; state.gameOverReason = "Perder el Clásico (Min DIRIGENCIA)"; break; }
        }
      }

      if (t === 19 && !state.isGameOver) { // Final (Turno 20)
        const gana = Math.random() < Math.max(0.15, Math.min(0.85, 0.50 + state.modificadorProbPartidoFinal));
        if (!gana) {
          state.factions.hinchas -= 20; state.factions.dirigencia -= 15; state.factions.vestuario -= 10;
          if (state.factions.hinchas <= 0) { state.isGameOver = true; state.gameOverReason = "Perder Final (Min HINCHAS)"; }
          else if (state.factions.dirigencia <= 0) { state.isGameOver = true; state.gameOverReason = "Perder Final (Min DIRIGENCIA)"; }
          else if (state.factions.vestuario <= 0) { state.isGameOver = true; state.gameOverReason = "Perder Final (Min VESTUARIO)"; }
        }
      }
    }

    if (state.isGameOver) {
      turnData[state.turn].totalMuertes++;
      turnData[state.turn].razones[state.gameOverReason] = (turnData[state.turn].razones[state.gameOverReason] || 0) + 1;
    }
  }

  console.log("=== REPORTE DE MORTALIDAD POR TURNO (Perfil Reactivo/Jugador Promedio) ===\n");
  for(let i=1; i<=20; i++) {
    const info = turnData[i];
    if (info.totalMuertes > 0) {
      console.log(`TURNO ${i} | Total de Muertes: ${info.totalMuertes} (${((info.totalMuertes/NUM_SIMULATIONS)*100).toFixed(1)}%)`);
      
      // Sort razones
      const sortedRazones = Object.entries(info.razones).sort((a,b) => b[1] - a[1]);
      sortedRazones.forEach(([razon, count]) => {
        console.log(`   -> ${razon}: ${count} veces`);
      });
      console.log("-");
    }
  }
}

runDetailedMortalityAnalysis();
