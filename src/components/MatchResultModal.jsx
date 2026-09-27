import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, XCircle, ArrowRight, Shield } from 'lucide-react';
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
                <span className="score-digit">{golesLocal}</span>
                <span className="score-divider">-</span>
                <span className="score-digit">{golesVisitante}</span>
              </div>
              <div className="match-time-tag">90' FINAL</div>
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
          <div className={`result-banner ${gana ? 'banner-win' : 'banner-loss'}`}>
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
          </div>

          {/* Botón de Acción para Continuar */}
          <div className="match-actions">
            <button 
              type="button" 
              className="match-continue-btn"
              onClick={onContinue}
            >
              <span>Ver Siguiente Carta</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
