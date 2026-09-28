import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, XCircle, ArrowRight, Shield, FastForward } from 'lucide-react';
import confetti from 'canvas-confetti';
import './MatchResultModal.css';

export const MatchResultModal = ({ result, onContinue }) => {
  if (!result) return null;

  const {
    tituloCompeticion,
    subtituloCompeticion,
    equipoLocal,
    equipoVisitante,
    golesLocal,
    golesVisitante,
    gana
  } = result;

  const [minute, setMinute] = useState(0);
  const [currentGolesLocal, setCurrentGolesLocal] = useState(0);
  const [currentGolesVisitante, setCurrentGolesVisitante] = useState(0);
  const [isSimulating, setIsSimulating] = useState(true);

  // Distribuir goles al azar a lo largo de los 90 minutos
  const goalEvents = useMemo(() => {
    const events = [];
    for (let i = 0; i < golesLocal; i++) {
      events.push({ isLocal: true, minute: Math.floor(Math.random() * 88) + 2 });
    }
    for (let i = 0; i < golesVisitante; i++) {
      events.push({ isLocal: false, minute: Math.floor(Math.random() * 88) + 2 });
    }
    return events.sort((a, b) => a.minute - b.minute);
  }, [golesLocal, golesVisitante]);

  // Reloj simulado
  useEffect(() => {
    if (!isSimulating) return;

    const interval = setInterval(() => {
      setMinute(prev => {
        const nextMin = prev + 1;
        if (nextMin >= 90) {
          clearInterval(interval);
          setIsSimulating(false);
          return 90;
        }
        return nextMin;
      });
    }, 40); // ~3.6s de simulacion (40ms * 90)

    return () => clearInterval(interval);
  }, [isSimulating]);

  // Chequear goles en el minuto actual
  useEffect(() => {
    if (isSimulating) {
      const goalsThisMin = goalEvents.filter(g => g.minute === minute);
      goalsThisMin.forEach(g => {
        if (g.isLocal) setCurrentGolesLocal(prev => prev + 1);
        else setCurrentGolesVisitante(prev => prev + 1);
      });
    }
  }, [minute, isSimulating, goalEvents]);

  const handleSkip = () => {
    setIsSimulating(false);
    setMinute(90);
    setCurrentGolesLocal(golesLocal);
    setCurrentGolesVisitante(golesVisitante);
  };

  // Efecto de fuegos artificiales al ganar
  useEffect(() => {
    if (!isSimulating && gana) {
      const duration = 3000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 1000 };

      const randomInRange = (min, max) => Math.random() * (max - min) + min;

      const interval = setInterval(function() {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        // Fuegos artificiales desde 2 posiciones aleatorias de los bordes
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
        });
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
        });
      }, 250);

      return () => clearInterval(interval);
    }
  }, [isSimulating, gana]);

  return (
    <AnimatePresence>
      <motion.div 
        className="match-modal-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div 
          className="match-modal-container"
          initial={{ scale: 0.88, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.92, opacity: 0, y: 15 }}
          transition={{ type: "spring", stiffness: 320, damping: 25 }}
        >
          {/* Header de la competición */}
          <div className="match-competition-header">
            <div className="competition-ribbon">
              <span className="ribbon-sparkle">★</span>
              <span className="competition-title">{tituloCompeticion}</span>
              <span className="ribbon-sparkle">★</span>
            </div>
            {subtituloCompeticion && (
              <span className="competition-subtitle">{subtituloCompeticion}</span>
            )}
          </div>

          {/* Marcador del Estadio */}
          <div className="stadium-scoreboard">
            {/* Equipo Usuario */}
            <div className="team-col team-user">
              <div 
                className="team-crest" 
                style={{ backgroundColor: equipoLocal.color }}
              >
                <Shield size={28} color="#FFF" />
              </div>
              <span className="team-name">{equipoLocal.nombre}</span>
              <span className="team-badge user-badge">Tu Club</span>
            </div>

            {/* Números del Score */}
            <div className="score-center">
              <div className="score-numbers">
                <span className="score-digit">{isSimulating ? currentGolesLocal : golesLocal}</span>
                <span className="score-divider">-</span>
                <span className="score-digit">{isSimulating ? currentGolesVisitante : golesVisitante}</span>
              </div>
              <div className={`match-time-tag ${isSimulating ? 'simulating' : ''}`}>
                {isSimulating ? `${minute}'` : "90' FINAL"}
              </div>
            </div>

            {/* Equipo Rival */}
            <div className="team-col team-rival">
              <div 
                className="team-crest" 
                style={{ backgroundColor: equipoVisitante.color }}
              >
                <Shield size={28} color="#FFF" />
              </div>
              <span className="team-name">{equipoVisitante.nombre}</span>
              <span className="team-badge rival-badge">Rival</span>
            </div>
          </div>

          {/* Banner de Resultado Ganó / Perdió */}
          {!isSimulating && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`result-banner ${gana ? 'banner-win' : 'banner-loss'}`}
            >
              {gana ? (
                <>
                  <Trophy size={20} className="banner-icon" />
                  <span className="banner-text">¡VICTORIA ÉPICA!</span>
                </>
              ) : (
                <>
                  <XCircle size={20} className="banner-icon" />
                  <span className="banner-text">DERROTA DOLOROSA</span>
                </>
              )}
            </motion.div>
          )}

          {/* Botón de Acción para Continuar */}
          <div className="match-actions">
            {isSimulating ? (
              <button 
                type="button" 
                className="match-continue-btn skip-btn"
                onClick={handleSkip}
              >
                <span>Omitir Simulación</span>
                <FastForward size={18} />
              </button>
            ) : (
              <button 
                type="button" 
                className="match-continue-btn"
                onClick={onContinue}
              >
                <span>Ver Siguiente Carta</span>
                <ArrowRight size={18} />
              </button>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
