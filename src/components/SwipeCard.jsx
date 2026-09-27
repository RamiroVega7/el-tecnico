import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform, useAnimation } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { simulateClasico, simulatePartidoFinal } from '../utils/matchSimulation';
import { MatchResultModal } from './MatchResultModal';
import './SwipeCard.css';
import playerImg from '../assets/images/card/player.PNG';
import dirigenteImg from '../assets/images/card/dirigente.PNG';
import hinchaImg from '../assets/images/card/hincha.PNG';
import prensaImg from '../assets/images/card/prensa.PNG';

const FACTION_CARD_IMAGES = {
  // Jugador / Vestuario
  jugador: playerImg,
  vestuario: playerImg,
  player: playerImg,
  plantel: playerImg,

  // Dirigencia
  dirigencia: dirigenteImg,
  dirigente: dirigenteImg,
  directiva: dirigenteImg,
  comision: dirigenteImg,

  // Hinchada
  hinchada: hinchaImg,
  hinchas: hinchaImg,
  hincha: hinchaImg,
  barra: hinchaImg,

  // Prensa
  prensa: prensaImg,
  periodista: prensaImg,
  periodismo: prensaImg,
  cronista: prensaImg,
};

const isSpecialCard = (card) => {
  if (!card) return false;
  return Boolean(
    card.esEspecial ||
    card.idCartaOb !== undefined ||
    card.tipoDecision !== undefined ||
    card.esObligatoria ||
    card.tipo === 'Especial'
  );
};

const getSpecialCardBadgeLabel = (card) => {
  if (!card) return 'EVENTO DECISIVO';
  if (card.tipoDecision === 'FichajeEstrella') return 'MERCADO DE PASES • DECISIÓN CLAVE';
  if (card.tipoDecision === 'PreviaClasico') return 'SEMANA DEL CLÁSICO • FECHA DECISIVA';
  if (card.tipoDecision === 'DobleTurno') return 'DEFINICIÓN DE TEMPORADA • MOMENTO CUMBRE';
  return 'DECISIÓN CLAVE DE TEMPORADA';
};

const getCardImage = (card) => {
  if (!card) return playerImg;

  // Decisiones especiales fijas
  if (card.tipoDecision === 'FichajeEstrella') return dirigenteImg;
  if (card.tipoDecision === 'PreviaClasico') return prensaImg;
  if (card.tipoDecision === 'DobleTurno') return playerImg;

  // 1. Imagen explícita si la tiene definida
  if (card.imagen) {
    const rawName = card.imagen.toLowerCase().replace(/\.(png|webp|jpg|jpeg)$/i, '');
    if (FACTION_CARD_IMAGES[rawName]) return FACTION_CARD_IMAGES[rawName];
    if (rawName.includes('dirigen')) return dirigenteImg;
    if (rawName.includes('hinch')) return hinchaImg;
    if (rawName.includes('prens')) return prensaImg;
    if (rawName.includes('player') || rawName.includes('jugador')) return playerImg;
  }

  // 2. Por facción o tipo declarado
  const factionKey = (card.faccion || card.tipo || '')
    .toString()
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  if (FACTION_CARD_IMAGES[factionKey]) {
    return FACTION_CARD_IMAGES[factionKey];
  }

  // 3. Detección por contexto / palabras clave en personaje
  const context = `${factionKey} ${card.personaje || ''}`
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  if (context.includes('dirigen') || context.includes('presiden') || context.includes('tesorero') || context.includes('secretario')) {
    return dirigenteImg;
  }
  if (context.includes('hinch') || context.includes('barra') || context.includes('socio') || context.includes('filial') || context.includes('tribuna')) {
    return hinchaImg;
  }
  if (context.includes('prens') || context.includes('periodis') || context.includes('cronista') || context.includes('radio') || context.includes('tv') || context.includes('panelista')) {
    return prensaImg;
  }
  if (context.includes('jugador') || context.includes('vestuario') || context.includes('plantel') || context.includes('capitan') || context.includes('arquero') || context.includes('delantero') || context.includes('pibe')) {
    return playerImg;
  }

  return playerImg;
};

const hexToRgba = (hex, alpha = 1) => {
  if (!hex || typeof hex !== 'string') return `rgba(63, 58, 58, ${alpha})`;
  const cleanHex = hex.replace('#', '').trim();
  const fullHex = cleanHex.length === 3 
    ? cleanHex.split('').map(char => char + char).join('') 
    : cleanHex;
  const num = parseInt(fullHex, 16);
  if (isNaN(num)) return `rgba(63, 58, 58, ${alpha})`;
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export const SwipeCard = ({ cards, onDeckEmpty }) => {
  const { applyChanges, clubActual } = useGameStore();
  const clubColor = clubActual?.ColorPrincipal || '#3F3A3A';
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [hint, setHint] = useState(null); // 'left' or 'right'
  const [pendingMatchResult, setPendingMatchResult] = useState(null);

  const getCardCharacterName = (card) => {
    if (!card) return '';

    // Manejo especial según tipo de decisión clave
    if (card.tipoDecision === 'FichajeEstrella') {
      return clubActual?.Presidente ? `${clubActual.Presidente} (Presidente)` : 'Consejo Directivo';
    }
    if (card.tipoDecision === 'PreviaClasico') {
      return 'Conferencia de Prensa Oficial';
    }
    if (card.tipoDecision === 'DobleTurno') {
      return clubActual?.Capitan ? `${clubActual.Capitan} (Capitán)` : 'Plantel Profesional';
    }

    // Si la carta es de tipo Jugador / vestuario, se usa el Capitán del club actual
    if ((card.tipo === 'Jugador' || card.faccion === 'vestuario' || card.personaje === 'Jugador') && clubActual?.Capitan) {
      return clubActual.Capitan;
    }
    // Si la carta es de tipo Dirigencia / Presidente, se usa el Presidente del club actual
    if ((card.tipo === 'Dirigencia' || card.tipo === 'Presidente' || card.faccion === 'dirigencia' || card.personaje === 'Dirigente' || card.personaje === 'Presidente') && clubActual?.Presidente) {
      return clubActual.Presidente;
    }
    // Si la carta es de tipo Hinchada / Hincha, se usa el Hincha Caracterizado del club actual
    if ((card.tipo === 'Hinchada' || card.tipo === 'Hincha' || card.faccion === 'hinchas' || card.faccion === 'hinchada' || card.personaje === 'Hincha' || card.personaje === 'HinchaCaracterizado') && clubActual?.HinchaCaracterizado) {
      return clubActual.HinchaCaracterizado;
    }
    return card.personaje || card.tipo || '';
  };
  
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-150, 150], [-10, 10]);
  const controls = useAnimation();

  useEffect(() => {
    const unsubscribe = x.onChange((latest) => {
      if (latest > 50) {
        setHint('right');
      } else if (latest < -50) {
        setHint('left');
      } else {
        setHint(null);
      }
    });
    return () => unsubscribe();
  }, [x]);

  useEffect(() => {
    setCurrentCardIndex(0);
    setPendingMatchResult(null);
  }, [cards]);

  useEffect(() => {
    if (cards && currentCardIndex >= cards.length) {
      if (onDeckEmpty) onDeckEmpty();
      setCurrentCardIndex(0);
    }
  }, [currentCardIndex, cards, onDeckEmpty]);

  if (!cards || cards.length === 0 || currentCardIndex >= cards.length) {
    return null;
  }

  const activeCard = cards[currentCardIndex];
  const nextCard = cards[currentCardIndex + 1];

  const getOption = (card, dir) => {
    if (!card || !card.opciones) return null;
    if (dir === 'left') {
      return card.opciones.opcion1 || card.opciones.A || null;
    }
    return card.opciones.opcion2 || card.opciones.B || null;
  };

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

  const optLeft = getOption(activeCard, 'left');
  const optRight = getOption(activeCard, 'right');

  const handleDragEnd = async (event, info) => {
    const threshold = 100;
    let direction = null;

    if (info.offset.x > threshold) {
      direction = 'right';
    } else if (info.offset.x < -threshold) {
      direction = 'left';
    }

    if (direction) {
      // Animate off screen
      await controls.start({
        x: direction === 'right' ? 300 : -300,
        opacity: 0,
        transition: { duration: 0.2 }
      });

      // Apply card effects
      const selectedOption = direction === 'left' ? optLeft : optRight;
      const changes = calculateModifiers(activeCard, selectedOption);

      if (Object.keys(changes).length > 0) {
        applyChanges(changes);
      }

      // Si la decisión produjo Game Over inmediato, detener aquí
      if (useGameStore.getState().isGameOver) {
        return;
      }

      // Si se jugó el Clásico o el Partido Importante, mostrar resultado del partido antes de la siguiente carta
      if (activeCard.tipoDecision === 'PreviaClasico') {
        const matchRes = simulateClasico(clubActual, useGameStore.getState());
        setPendingMatchResult(matchRes);
        // Reset card motion for when deck returns
        x.set(0);
        controls.set({ x: 0, opacity: 1 });
        setHint(null);
        return;
      }

      if (activeCard.tipoDecision === 'DobleTurno') {
        const matchRes = simulatePartidoFinal(clubActual, useGameStore.getState());
        setPendingMatchResult(matchRes);
        // Reset card motion for when deck returns
        x.set(0);
        controls.set({ x: 0, opacity: 1 });
        setHint(null);
        return;
      }

      // Move to next card normalmente
      setCurrentCardIndex(prev => prev + 1);
      
      // Reset position for the new card
      x.set(0);
      controls.set({ x: 0, opacity: 1 });
      setHint(null);
    } else {
      // Spring back to center
      controls.start({ x: 0, transition: { type: "spring", stiffness: 300, damping: 20 } });
      setHint(null);
    }
  };

  const handleContinueFromMatch = () => {
    if (!pendingMatchResult) return;

    // 1. Aplicar las consecuencias del partido a las métricas del DT
    if (pendingMatchResult.consecuencias) {
      applyChanges(pendingMatchResult.consecuencias);
    }

    // 2. Actualizar estado del store
    if (pendingMatchResult.tipo === 'clasico') {
      useGameStore.setState({ resultadoClasico: `${pendingMatchResult.golesLocal} - ${pendingMatchResult.golesVisitante}` });
    } else if (pendingMatchResult.tipo === 'partido_importante') {
      useGameStore.setState({ 
        resultadoPartidoFinal: `${pendingMatchResult.golesLocal} - ${pendingMatchResult.golesVisitante}`,
        objetivoCumplido: pendingMatchResult.gana
      });
    }

    // 3. Cerrar el modal
    setPendingMatchResult(null);

    // 4. Si el resultado del partido produjo Game Over (ej. hinchada cae a 0), detener
    if (useGameStore.getState().isGameOver) {
      return;
    }

    // 5. Ahora sí avanzar a la siguiente carta del mazo
    setCurrentCardIndex(prev => prev + 1);
    x.set(0);
    controls.set({ x: 0, opacity: 1 });
    setHint(null);
  };

  const activeImage = getCardImage(activeCard);
  const nextImage = getCardImage(nextCard);
  const activeIsSpecial = isSpecialCard(activeCard);
  const nextIsSpecial = isSpecialCard(nextCard);

  return (
    <div className="swipe-container">
      {/* Modal interactivo con el resultado del partido (Clásico o Partido Importante) */}
      {pendingMatchResult && (
        <MatchResultModal 
          result={pendingMatchResult} 
          onContinue={handleContinueFromMatch} 
        />
      )}

      {/* Gradiente ambiental con el color principal del club desde abajo hacia arriba */}
      <div 
        className="club-ambient-gradient" 
        style={{
          background: `linear-gradient(to top, ${hexToRgba(clubColor, 0.8)} 0%, ${hexToRgba(clubColor, 0.45)} 35%, ${hexToRgba(clubColor, 0.15)} 70%, ${hexToRgba(clubColor, 0.02)} 90%, transparent 100%)`
        }} 
      />

      <div className="card-stack">
        {/* Render next card for visual depth */}
        {nextCard && (
          <div 
            className={`game-card next-card ${nextIsSpecial ? 'is-special' : ''}`} 
            style={{ backgroundImage: `url(${nextImage})` }}
          >
            {/* Cinta para carta especial en cola */}
            {nextIsSpecial && (
              <div className="special-card-ribbon ribbon-next">
                <span className="ribbon-text">{getSpecialCardBadgeLabel(nextCard)}</span>
              </div>
            )}

            <div className="card-character-image"></div>
            <div className="card-content">
              <span className="text-xs text-muted font-bold tracking-wider uppercase mb-1 block">
                {getCardCharacterName(nextCard)} {nextCard.tipo ? `• ${nextCard.tipo}` : ''}
              </span>
              <h2 className="card-character">{nextCard.tituloCarta || getCardCharacterName(nextCard)}</h2>
              <p className="card-situation">{nextCard.descripcion || nextCard.situacion}</p>
            </div>
          </div>
        )}
        
        {/* Render current active card */}
        <motion.div 
          className={`game-card active-card ${activeIsSpecial ? 'is-special' : ''}`}
          style={{ backgroundImage: `url(${activeImage})`, x, rotate }}
          drag="x" // CONSTRAIN TO X AXIS ONLY
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.7}
          onDragEnd={handleDragEnd}
          animate={controls}
        >
          {/* Elementos visuales distintivos para cartas especiales */}
          {activeIsSpecial && (
            <>
              <div className="special-card-ribbon">
                <span className="ribbon-star">★</span>
                <span className="ribbon-text">{getSpecialCardBadgeLabel(activeCard)}</span>
                <span className="ribbon-star">★</span>
              </div>
              <div className="corner-filigree top-left">❖</div>
              <div className="corner-filigree top-right">❖</div>
              <div className="corner-filigree bottom-left">❖</div>
              <div className="corner-filigree bottom-right">❖</div>
            </>
          )}

          {/* Hint Overlays */}
          <div className={`swipe-hint hint-left ${hint === 'left' ? 'visible' : ''}`}>
            <span className="hint-text">{optLeft?.texto || ''}</span>
          </div>
          <div className={`swipe-hint hint-right ${hint === 'right' ? 'visible' : ''}`}>
            <span className="hint-text">{optRight?.texto || ''}</span>
          </div>

          <div className="card-character-image"></div>
          
          <div className="card-content">
            <span className="text-xs text-muted font-bold tracking-wider uppercase mb-1 block">
              {getCardCharacterName(activeCard)} {activeCard.tipo ? `• ${activeCard.tipo}` : ''}
            </span>
            <h2 className="card-character">{activeCard.tituloCarta || getCardCharacterName(activeCard)}</h2>
            <p className="card-situation">{activeCard.descripcion || activeCard.situacion}</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
