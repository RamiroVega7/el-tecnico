import React from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { Trophy, Star, TrendingUp, Medal, ArrowRight } from 'lucide-react';
import './SeasonSummary.css';

export const SeasonSummary = () => {
  const { 
    clubActual, 
    prestigio, 
    idolatria, 
    fama, 
    resultadoClasico, 
    resultadoPartidoFinal, 
    objetivoCumplido, 
    generateOffers,
    temporadaActual,
    anioActual
  } = useGameStore();

  const handleContinue = () => {
    generateOffers();
  };

  const formatMatchResult = (res) => {
    if (res === 'pendiente') return 'No disputado';
    return res;
  };

  return (
    <motion.div 
      className="season-summary-screen"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.3 }}
    >
      <div className="summary-card" style={{ borderColor: clubActual?.ColorPrincipal }}>
        <div className="summary-header">
          <div className="club-crest" style={{ backgroundColor: clubActual?.ColorPrincipal }} />
          <h2>Balance de Temporada {anioActual}</h2>
          <span className="season-badge">Temporada {temporadaActual} finalizada</span>
        </div>

        <div className="summary-stats-grid">
          <div className="stat-box highlight">
            <Trophy size={24} color="#fbbf24" />
            <div className="stat-content">
              <span className="stat-label">Objetivo Anual</span>
              <span className="stat-value">{objetivoCumplido ? 'Cumplido' : 'Fracasó'}</span>
            </div>
          </div>
          <div className="stat-box highlight">
            <Medal size={24} color="#60a5fa" />
            <div className="stat-content">
              <span className="stat-label">El Clásico</span>
              <span className="stat-value capitalize">{formatMatchResult(resultadoClasico)}</span>
            </div>
          </div>

          <div className="stat-box">
            <TrendingUp size={20} color="var(--accent-color)" />
            <div className="stat-content">
              <span className="stat-label">Prestigio</span>
              <span className="stat-value">{prestigio}%</span>
            </div>
          </div>
          <div className="stat-box">
            <Star size={20} color="var(--accent-color)" />
            <div className="stat-content">
              <span className="stat-label">Idolatría</span>
              <span className="stat-value">{idolatria}%</span>
            </div>
          </div>
        </div>

        <div className="summary-message">
          {objetivoCumplido ? (
            <p className="success-msg">Has logrado el objetivo de la temporada. Tu prestigio como entrenador sigue en aumento.</p>
          ) : (
            <p className="fail-msg">No se alcanzó el objetivo pautado por la dirigencia. Habrá que replantear el proyecto o buscar nuevos rumbos.</p>
          )}
        </div>

        <div className="summary-actions">
          <button className="btn-continue-offers" onClick={handleContinue}>
            <span>Ver Ofertas de Mercado</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};
