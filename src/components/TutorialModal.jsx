import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, ChevronLeft, BookOpen } from 'lucide-react';
import './TutorialModal.css';

const TUTORIAL_STEPS = [
  {
    title: '1. El Tablero de Control',
    content: (
      <div className="tut-content">
        <p>Tu carrera depende del equilibrio de estas métricas:</p>
        <ul className="tut-list">
          <li><strong>Facciones:</strong> (Vestuario, Dirigencia, Hinchas) Van de 0 a 100. Si alguna llega a 0 o a 100 por exceso, estás despedido.</li>
          <li><strong>Prestigio:</strong> Tu estatus global. Define qué clubes te quieren. Si cae a menos de 10, te retiras para siempre.</li>
          <li><strong>Fama:</strong> Si es muy alta (&gt; 75) o muy baja (&lt; 35), tus decisiones harán más ruido mediático, multiplicando su impacto x1.5.</li>
          <li><strong>Finanzas:</strong> El dinero del club. Si quiebras el club cayendo a $0, te despiden sin dudarlo.</li>
        </ul>
      </div>
    )
  },
  {
    title: '2. Mecánica de las Cartas',
    content: (
      <div className="tut-content">
        <p>A lo largo de la temporada se te presentarán diferentes situaciones a resolver:</p>
        <ul className="tut-list">
          <li>Al deslizar (Swipe) la carta hacia la <strong>Izquierda</strong> o <strong>Derecha</strong>, tomarás distintas decisiones.</li>
          <li>Cada decisión siempre tendrá consecuencias tanto <strong>positivas como negativas</strong> en tus métricas.</li>
          <li>No hay respuestas correctas, solo debes elegir el "mal menor" según qué facciones necesiten más atención en ese momento para mantener el club en pie.</li>
        </ul>
      </div>
    )
  },
  {
    title: '3. Puntos de Inflexión',
    content: (
      <div className="tut-content">
        <p>Una temporada regular consta de 20 turnos/cartas, con momentos clave donde te juegas la vida:</p>
        <ul className="tut-list">
          <li><strong>Turno 1 (Pretemporada):</strong> La primera decisión. Suelen ser eventos obligatorios que marcan el rumbo financiero y deportivo del año (ej. grandes fichajes o ventas).</li>
          <li><strong>Turno 10 (El Clásico):</strong> A mitad de año enfrentás a tu eterno rival. Las decisiones previas alteran tus chances de ganarlo.</li>
          <li><strong>Turno 20 (Partido Final):</strong> El cierre de temporada donde definís tu Objetivo Anual (Ej: Ascender, salir campeón o salvarte).</li>
        </ul>
      </div>
    )
  },
  {
    title: '4. Fichar por otro Club',
    content: (
      <div className="tut-content">
        <p>Al final del año (Turno 20) o al ser despedido, volverás al mercado de pases.</p>
        <p>El calibre de los clubes que te busquen dependerá <strong>exclusivamente de tu Prestigio</strong> actual:</p>
        <ul className="tut-list">
          <li><strong>+80 Prestigio:</strong> Te buscarán potencias y gigantes.</li>
          <li><strong>60 a 79:</strong> Clubes de primera línea y media tabla.</li>
          <li><strong>30 a 59:</strong> Clubes peleando el descenso.</li>
          <li><strong>&lt; 30:</strong> Solo encontrarás lugar en el duro Ascenso.</li>
        </ul>
      </div>
    )
  }
];

export const TutorialModal = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const nextStep = () => {
    if (currentStep < TUTORIAL_STEPS.length - 1) setCurrentStep(currentStep + 1);
    else onClose();
  };

  const prevStep = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const step = TUTORIAL_STEPS[currentStep];

  return (
    <AnimatePresence>
      <motion.div 
        className="tutorial-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div 
          className="tutorial-modal"
          initial={{ scale: 0.9, y: 20, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.9, y: 20, opacity: 0 }}
        >
          <div className="tutorial-header">
            <div className="tutorial-title-box">
              <BookOpen size={18} color="#A07A38" />
              <h2>{step.title}</h2>
            </div>
            <button className="tutorial-close-btn" onClick={onClose}>
              <X size={20} />
            </button>
          </div>

          <div className="tutorial-body">
            {step.content}
          </div>

          <div className="tutorial-footer">
            <div className="tutorial-progress">
              {TUTORIAL_STEPS.map((_, idx) => (
                <div 
                  key={idx} 
                  className={`tut-dot ${idx === currentStep ? 'active' : ''}`}
                />
              ))}
            </div>
            
            <div className="tutorial-actions">
              {currentStep > 0 && (
                <button className="tut-btn prev" onClick={prevStep}>
                  <ChevronLeft size={18} />
                  <span>Atrás</span>
                </button>
              )}
              <button className="tut-btn next" onClick={nextStep}>
                <span>{currentStep === TUTORIAL_STEPS.length - 1 ? '¡Entendido!' : 'Siguiente'}</span>
                {currentStep < TUTORIAL_STEPS.length - 1 && <ChevronRight size={18} />}
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
