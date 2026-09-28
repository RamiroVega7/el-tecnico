import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useGameStore } from '../store/gameStore';
import { Trophy, Star, TrendingUp, Medal, RotateCcw, AlertTriangle } from 'lucide-react';
import './CareerSummary.css';

export const CareerSummary = () => {
  const { 
    historialCarrera, 
    careerWon,
    nombreManager,
    resetGame
  } = useGameStore();

  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (careerWon) {
      setShowConfetti(true);
      const duration = 5 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

      const randomInRange = (min, max) => Math.random() * (max - min) + min;

      const interval = setInterval(() => {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
        confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
      }, 250);

      return () => clearInterval(interval);
    }
  }, [careerWon]);

  const handleRestart = () => {
    resetGame();
  };

  const getClasicoOutcome = (res) => {
    if (res === 'pendiente' || !res) return null;
    const parts = res.split('-');
    if (parts.length !== 2) return null;
    const local = parseInt(parts[0].trim());
    const vis = parseInt(parts[1].trim());
    if (local > vis) return 'win';
    if (local < vis) return 'loss';
    return 'draw';
  };

  return (
    <motion.div 
      className={`career-summary-screen ${careerWon ? 'won' : 'lost'}`}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <div className="career-card">
        <header className="career-header">
          {careerWon ? (
            <div className="trophy-icon">
              <Trophy size={48} color="#fbbf24" />
            </div>
          ) : (
            <div className="alert-icon">
              <AlertTriangle size={48} color="#9C3838" />
            </div>
          )}
          
          <h1 className="career-title">Resumen de Carrera</h1>
          <h2 className="manager-name">{nombreManager}</h2>
          
          <p className="career-subtitle">
            {careerWon 
              ? "¡Hazaña Histórica! Sobreviviste 10 temporadas en el fútbol argentino. Sos una verdadera leyenda."
              : "La presión pudo más. Tu prestigio cayó a niveles irreversibles y ningún club quiso contratarte."}
          </p>
        </header>

        <div className="timeline-container">
          {historialCarrera && historialCarrera.map((season, index) => {
            const isFired = season.despedido;
            const clasico = getClasicoOutcome(season.resultadoClasico);
            return (
              <div key={index} className={`timeline-item ${isFired ? 'fired' : 'survived'}`}>
                <div className="timeline-dot" style={{ backgroundColor: season.color || 'var(--text-main)' }}></div>
                <div className="timeline-content" style={{ borderLeftColor: season.color || 'var(--text-main)' }}>
                  <div className="season-meta">
                    <span className="season-year">Año {season.anio} (T{season.temporada})</span>
                    <span className="season-club">{season.club || "Desconocido"}</span>
                  </div>
                  
                  <div className="season-details">
                    <div className="detail-item">
                      <Trophy size={14} color={season.objetivoCumplido ? "#3E6B39" : "#9C3838"} />
                      <span>{season.objetivoCumplido ? 'Objetivo Cumplido' : 'No cumplió'}</span>
                    </div>
                    {season.resultadoClasico && season.resultadoClasico !== 'pendiente' && (
                      <div className="detail-item">
                        <Medal size={14} color={clasico === 'win' ? "#3E6B39" : (clasico === 'loss' ? "#9C3838" : "#60a5fa")} />
                        <span>Clásico: {season.resultadoClasico}</span>
                      </div>
                    )}
                    {isFired && (
                      <div className="fired-badge">Despedido</div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="career-footer">
          <button className="btn-restart" onClick={handleRestart}>
            <RotateCcw size={20} />
            <span>Iniciar Nueva Carrera</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};
