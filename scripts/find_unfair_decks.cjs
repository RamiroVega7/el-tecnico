const fs = require('fs');
const path = require('path');

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

const incidenciaDelta = { baja: 5, media: 10, alta: 15 };

const calculateModifiers = (card, option) => {
  if (!option) return {};
  if (option.modificadores) return option.modificadores;

  const changes = {};
  
  if (option.afectadosPositivo) {
    if (Array.isArray(option.afectadosPositivo)) {
      const inc = card?.incidencia ? card.incidencia.toLowerCase() : 'media';
      const baseDelta = incidenciaDelta[inc] || 10;
      option.afectadosPositivo.forEach((metric) => {
        changes[metric] = (changes[metric] || 0) + baseDelta;
      });
    } else {
      Object.entries(option.afectadosPositivo).forEach(([metric, intensidad]) => {
        const inc = intensidad ? intensidad.toLowerCase() : 'media';
        const delta = incidenciaDelta[inc] || 10;
        changes[metric] = (changes[metric] || 0) + delta;
      });
    }
  }

  if (option.afectadosNegativo) {
    if (Array.isArray(option.afectadosNegativo)) {
      const inc = card?.incidencia ? card.incidencia.toLowerCase() : 'media';
      const baseDelta = incidenciaDelta[inc] || 10;
      option.afectadosNegativo.forEach((metric) => {
        changes[metric] = (changes[metric] || 0) - baseDelta;
      });
    } else {
      Object.entries(option.afectadosNegativo).forEach(([metric, intensidad]) => {
        const inc = intensidad ? intensidad.toLowerCase() : 'media';
        const delta = incidenciaDelta[inc] || 10;
        changes[metric] = (changes[metric] || 0) - delta;
      });
    }
  }
  
  return changes;
};

function canSurvive(deck, turnIndex, state, memo) {
  if (state.isGameOver) return false;
  if (turnIndex === deck.length) return true;

  const key = turnIndex + '-' + state.factions.vestuario + '-' + state.factions.dirigencia + '-' + state.factions.hinchas + '-' + state.factions.prensa + '-' + state.fama;
  if (memo.has(key)) return memo.get(key);

  const card = deck[turnIndex];
  const options = [card.opciones.opcion1 || card.opciones.A, card.opciones.opcion2 || card.opciones.B].filter(Boolean);

  for (const option of options) {
    const changes = calculateModifiers(card, option);
    
    let nextState = {
      factions: { ...state.factions },
      fama: state.fama,
      isGameOver: false
    };

    const mult = (nextState.fama < 35 || nextState.fama > 75) ? 2 : 1;
    
    for (const [k, value] of Object.entries(changes)) {
      const keyMap = k.toLowerCase();
      if (nextState.factions[keyMap] !== undefined) {
        nextState.factions[keyMap] = Math.max(0, Math.min(100, nextState.factions[keyMap] + (value * mult)));
        if (nextState.factions[keyMap] <= 0 || nextState.factions[keyMap] >= 100) {
          nextState.isGameOver = true;
        }
      }
      if (keyMap === 'fama') {
        nextState.fama = Math.max(0, Math.min(100, nextState.fama + (value * mult)));
      }
    }

    if (!nextState.isGameOver) {
      if (turnIndex === 9) { 
        nextState.factions.vestuario = Math.min(100, nextState.factions.vestuario + 20);
        nextState.factions.dirigencia = Math.min(100, nextState.factions.dirigencia + 20);
        nextState.factions.hinchas = Math.min(100, nextState.factions.hinchas + 20);
        if (nextState.factions.vestuario >= 100 || nextState.factions.dirigencia >= 100 || nextState.factions.hinchas >= 100) {
          nextState.isGameOver = true;
        }
      }
    }

    if (canSurvive(deck, turnIndex + 1, nextState, memo)) {
      memo.set(key, true);
      return true;
    }
  }

  memo.set(key, false);
  return false;
}

const NUM_SIMULATIONS = 10000;
let unfairDecksFound = 0;

console.log('Buscando mazos "Injustos" entre ' + NUM_SIMULATIONS + ' simulaciones...');
console.log('(Un mazo injusto es aquel donde, incluso tomando decisiones perfectas y ganando el clasico, es matematicamente imposible sobrevivir)');

for (let i = 0; i < NUM_SIMULATIONS; i++) {
  const club = clubsData[Math.floor(Math.random() * clubsData.length)];
  const deck = buildSeasonDeck(club);
  
  const initialState = {
    factions: { vestuario: 50, dirigencia: 50, hinchas: 50, prensa: 50 },
    fama: 50,
    isGameOver: false
  };

  const memo = new Map();
  const possible = canSurvive(deck, 0, initialState, memo);

  if (!possible) {
    unfairDecksFound++;
    if (unfairDecksFound <= 1) {
      console.log('\n=========================================');
      console.log('Ejemplo de Mazo Injusto:');
      console.log('Expectativa del Club: ' + club.Expectativas);
      deck.forEach((c, idx) => {
        console.log('  Turno ' + (idx+1) + ': [ID ' + (c.idCarta || c.idCartaOb) + '] ' + c.tituloCarta);
      });
    }
  }
}

console.log('\n=========================================');
console.log('RESULTADOS:');
console.log('Mazos testeados: ' + NUM_SIMULATIONS);
console.log('Mazos INJUSTOS: ' + unfairDecksFound + ' (' + ((unfairDecksFound/NUM_SIMULATIONS)*100).toFixed(2) + '%)');
