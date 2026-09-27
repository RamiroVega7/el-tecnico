import React from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import playerImg from '../assets/images/card/player.PNG';
import dirigenciaMaxImg from '../assets/images/derrota/DirigenciaMax.webp';
import dirigenciaMinImg from '../assets/images/derrota/DirigenciaMin.webp';
import finanzasBancarrotaImg from '../assets/images/derrota/FinanzasBancarrota.webp';
import hinchadaMaxImg from '../assets/images/derrota/HinchadaMax.webp';
import hinchadaMinImg from '../assets/images/derrota/HinchadaMin.webp';
import vestuarioMaxImg from '../assets/images/derrota/VestuarioMax.webp';
import vestuarioMinImg from '../assets/images/derrota/VestuarioMin.webp';
import prestigioMinImg from '../assets/images/derrota/PrestigioMin.webp';
import { Newspaper, AlertTriangle, RotateCcw, ArrowRight } from 'lucide-react';
import './GameOverNews.css';

const DEFEAT_IMAGES = {
  DirigenciaMax: dirigenciaMaxImg,
  'DirigenciaMax.webp': dirigenciaMaxImg,
  DirigenciaMin: dirigenciaMinImg,
  'DirigenciaMin.webp': dirigenciaMinImg,
  FinanzasBancarrota: finanzasBancarrotaImg,
  'FinanzasBancarrota.webp': finanzasBancarrotaImg,
  HinchadaMax: hinchadaMaxImg,
  'HinchadaMax.webp': hinchadaMaxImg,
  HinchadaMin: hinchadaMinImg,
  'HinchadaMin.webp': hinchadaMinImg,
  VestuarioMax: vestuarioMaxImg,
  'VestuarioMax.webp': vestuarioMaxImg,
  VestuarioMin: vestuarioMinImg,
  'VestuarioMin.webp': vestuarioMinImg,
  PrestigioMin: prestigioMinImg,
  'PrestigioMin.webp': prestigioMinImg,
};

export const GameOverNews = () => {
  const { defeatCard, defeatId, gameOverReason, handleDefeatAction } = useGameStore();

  const card = defeatCard || {
    idDerrota: defeatId,
    medioPeriodistico: "CRÓNICA DEPORTIVA",
    volanta: "ÚLTIMO MOMENTO",
    titulo: "¡DESPIDO INMEDIATO!",
    bajada: gameOverReason || "La comisión directiva te rescindió el contrato tras perder el rumbo.",
    cuerpoNota: "En una reunión relámpago, la dirigencia decidió poner punto final a tu ciclo como director técnico. No hubo aplausos ni palabras de agradecimiento.",
    descripcionBurlona: "Te echaron del club.",
    personaje: "Presidente",
    epigrafeFoto: "El ex entrenador retirándose del estadio con la cabeza gacha.",
    botonAccion: "Firmar Rescisión y Continuar"
  };

  const photoUrl = 
    (card.imagen && DEFEAT_IMAGES[card.imagen]) ||
    (card.idDerrota && DEFEAT_IMAGES[card.idDerrota]) ||
    (defeatId && DEFEAT_IMAGES[defeatId]) ||
    playerImg;

  const currentDate = new Date().toLocaleDateString('es-AR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <motion.div 
      className="game-over-news-overlay"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      <div className="newspaper-wrapper">
        <article className="newspaper-page">
          {/* Top Bar: Newspaper Header */}
          <header className="newspaper-header">
            <div className="newspaper-meta-top">
              <span className="newspaper-edition">EDICIÓN EXTRAORDINARIA</span>
              <span className="newspaper-date">{currentDate}</span>
              <span className="newspaper-price">$0 (VALOR DEL CONTRATO)</span>
            </div>

            <div className="newspaper-masthead">
              <div className="masthead-icon">
                <Newspaper size={28} />
              </div>
              <h1 className="masthead-title">{card.medioPeriodistico || "DIARIO POPULAR"}</h1>
            </div>

            <div className="newspaper-divider-double"></div>
          </header>

          {/* Breaking News Ribbon */}
          <div className="newspaper-volanta-container">
            <span className="breaking-badge">
              <AlertTriangle size={14} className="inline mr-1" />
              {card.volanta || "BOMBAZO EN EL CLUB"}
            </span>
          </div>

          {/* Main Headline */}
          <h2 className="newspaper-headline">
            {card.titulo}
          </h2>

          {/* Subhead / Bajada */}
          <p className="newspaper-subhead">
            {card.bajada}
          </p>

          <div className="newspaper-divider-thin"></div>

          {/* Media & Article Body */}
          <div className="newspaper-content-layout">
            {/* Photo Column */}
            <div className="newspaper-photo-box">
              <div 
                className="newspaper-photo"
                style={{ backgroundImage: `url(${photoUrl})` }}
              >
                <div className="stamp-dismissed">
                  DESPEDIDO
                </div>
              </div>
              <figcaption className="newspaper-caption">
                <strong>FOTO:</strong> {card.epigrafeFoto || `El ${card.personaje} comunicando la noticia.`}
              </figcaption>
            </div>

            {/* Article Columns */}
            <div className="newspaper-article-text">
              <p className="article-body">
                <span className="drop-cap">{card.cuerpoNota ? card.cuerpoNota.charAt(0) : "T"}</span>
                {card.cuerpoNota ? card.cuerpoNota.slice(1) : ""}
              </p>

              {card.descripcionBurlona && (
                <div className="quote-box">
                  <span className="quote-label">SÍNTESIS DEL FRACASO:</span>
                  <p className="quote-text">"{card.descripcionBurlona}"</p>
                </div>
              )}
            </div>
          </div>

          <div className="newspaper-divider-double"></div>

          {/* Footer & Action Button */}
          <div className="newspaper-footer">
            <button 
              className="newspaper-btn-restart"
              onClick={handleDefeatAction}
              type="button"
            >
              {card.idDerrota === 'PrestigioMin' ? <RotateCcw size={18} /> : <ArrowRight size={18} />}
              <span>{card.botonAccion || "Firmar Rescisión y Continuar"}</span>
            </button>
            <p className="newspaper-footnote">
              * La cláusula de rescisión no incluye indemnización por daños a la reputación deportiva.
            </p>
          </div>
        </article>
      </div>
    </motion.div>
  );
};
