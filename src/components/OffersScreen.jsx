import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { Briefcase, ArrowRight, Shield, TrendingUp, DollarSign } from 'lucide-react';
import './OffersScreen.css';

export const OffersScreen = () => {
  const { offers, acceptOffer, nombreManager } = useGameStore();
  const [selectedOffer, setSelectedOffer] = useState(null);

  const formatShortMoney = (amount) => {
    if (!amount) return '$0';
    if (amount >= 1_000_000) {
      return `$${amount / 1_000_000}M`;
    }
    return `$${amount.toLocaleString('es-AR')}`;
  };

  const getExpectativaClass = (expectativa) => {
    switch (expectativa) {
      case 'Gigante': return 'gigante';
      case 'Altas': return 'altas';
      case 'Medias': return 'medias';
      case 'Bajas': return 'bajas';
      case 'Ascenso': return 'ascenso';
      default: return '';
    }
  };

  const handleAccept = () => {
    if (selectedOffer) {
      acceptOffer(selectedOffer);
    }
  };

  return (
    <motion.div 
      className="offers-screen"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="offers-header">
        <Briefcase size={28} color="var(--color-3)" />
        <h2>Mercado de Pases</h2>
        <p>Ofertas sobre la mesa para el DT {nombreManager}</p>
      </div>

      <div className="offers-list">
        {offers.map((offer) => (
          <motion.div 
            key={offer.id}
            className={`offer-card ${selectedOffer?.id === offer.id ? 'selected' : ''} ${offer.tipo === 'renovacion' ? 'renewal' : ''}`}
            onClick={() => setSelectedOffer(offer)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            style={{ 
              borderColor: selectedOffer?.id === offer.id ? offer.club.ColorPrincipal : undefined
            }}
          >
            {offer.tipo === 'renovacion' && (
              <div className="offer-badge renewal-badge">Renovación</div>
            )}
            {offer.tipo === 'nuevo' && (
              <div className="offer-badge new-badge">Nuevo Club</div>
            )}

            <div className="offer-club-header">
              <div className="club-crest-dot" style={{ backgroundColor: offer.club.ColorPrincipal }} />
              <h3>{offer.club.NombreClub}</h3>
            </div>

            <div className="offer-details">
              <div className="detail-item">
                <Shield size={14} />
                <span>{offer.club.DivisionInicial === 1 ? '1ra División' : '2da División'}</span>
              </div>
              <div className="detail-item">
                <TrendingUp size={14} />
                <span className={`badge-expectativa ${getExpectativaClass(offer.club.Expectativas)}`}>
                  {offer.club.Expectativas}
                </span>
              </div>
              <div className="detail-item">
                <DollarSign size={14} />
                <span>Ppto: {formatShortMoney(offer.club.FinanzasInicial)}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="offers-footer">
        <button 
          className="btn-accept-offer" 
          disabled={!selectedOffer}
          onClick={handleAccept}
        >
          <span>{selectedOffer ? `Firmar con ${selectedOffer.club.NombreClub}` : 'Selecciona una oferta'}</span>
          <ArrowRight size={18} />
        </button>
      </div>
    </motion.div>
  );
};
