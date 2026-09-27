import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { ShieldCheck, Flame, Zap, Check, ArrowRight, Trophy } from 'lucide-react';
import './DifficultySelection.css';

const DIFFICULTIES = [
  {
    id: 'facil',
    title: 'Fácil',
    subtitle: 'Todos los clubes disponibles',
    color: '#3E6B39', // Vintage forest/laurel green
    icon: ShieldCheck,
  },
  {
    id: 'medio',
    title: 'Medio',
    subtitle: 'Expectativas medias o bajas',
    color: '#A07A38', // Vintage warm ochre/gold
    icon: Flame,
  },
  {
    id: 'dificil',
    title: 'Difícil',
    subtitle: 'Segunda División (Ascenso)',
    color: '#9C3838', // Vintage deep wine/crimson
    icon: Zap,
  }
];

export const DifficultySelection = () => {
  const { setDificultad, dificultad } = useGameStore();
  const [selected, setSelected] = useState(dificultad || 'medio');

  const handleContinue = () => {
    if (selected) {
      setDificultad(selected);
    }
  };

  return (
    <motion.div 
      className="difficulty-screen"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.25 }}
    >
      <header className="difficulty-header">
        <span className="step-badge">
          <Trophy size={13} />
          Paso 1 de 2
        </span>
        <h1 className="game-title-main">EL TÉCNICO</h1>
        <p className="difficulty-subtitle">
          Selecciona la dificultad de tu partida
        </p>
      </header>

      <div className="difficulty-list">
        {DIFFICULTIES.map((diff) => {
          const Icon = diff.icon;
          const isSelected = selected === diff.id;

          return (
            <motion.div
              key={diff.id}
              className={`difficulty-card ${isSelected ? 'selected' : ''}`}
              style={{
                borderColor: isSelected ? '#3F3A3A' : '#6E5B5B',
                boxShadow: isSelected ? '0 4px 18px rgba(63, 58, 58, 0.22)' : '0 2px 8px rgba(63, 58, 58, 0.08)'
              }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelected(diff.id)}
            >
              <div className="diff-card-content">
                <div 
                  className="diff-icon-box"
                  style={{ 
                    color: diff.color,
                    backgroundColor: `${diff.color}15`,
                    borderColor: diff.color
                  }}
                >
                  <Icon size={22} />
                </div>

                <div className="diff-text-group">
                  <div className="diff-title-row">
                    <span className="diff-title">{diff.title}</span>
                  </div>
                  <span className="diff-subtitle">{diff.subtitle}</span>
                </div>

                <div 
                  className="diff-check-circle"
                  style={{
                    backgroundColor: isSelected ? '#3F3A3A' : 'transparent',
                    borderColor: isSelected ? '#3F3A3A' : '#6E5B5B',
                    color: isSelected ? '#E4D5B7' : 'transparent'
                  }}
                >
                  <Check size={14} strokeWidth={3} />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="difficulty-actions">
        <button 
          className="btn-continue-difficulty"
          onClick={handleContinue}
          disabled={!selected}
          type="button"
        >
          <span>Continuar</span>
          <ArrowRight size={18} />
        </button>
      </div>
    </motion.div>
  );
};
