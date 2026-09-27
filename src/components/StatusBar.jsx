import React from 'react';
import { useGameStore } from '../store/gameStore';
import { Users, Briefcase, Megaphone, Mic, Trophy, DollarSign, Crown, Star } from 'lucide-react';
import './StatusBar.css';

const FactionBar = ({ icon: Icon, value, color, label }) => {
  return (
    <div className="faction-bar">
      <div className="icon-wrapper" style={{
        boxShadow: value < 20 || value > 80 ? `0 0 6px ${color}88` : 'none',
        borderColor: color
      }}>
        <Icon size={16} color={color} />
        <div className="value-badge">{Math.round(value)}</div>
      </div>

      <div className="progress-track">
        <div
          className="progress-fill"
          style={{
            width: `${value}%`,
            backgroundColor: color
          }}
        />
      </div>
      <span className="faction-label">{label}</span>
    </div>
  );
};

const HorizontalBar = ({ icon: Icon, value, color, label, isText, textValue }) => {
  return (
    <div className="horizontal-metric">
      <div className="metric-icon" style={{ color: color, borderColor: color }}>
        <Icon size={11} />
      </div>
      <div className="metric-content">
        <div className="metric-header" style={{ marginBottom: isText ? '0.12rem' : '0' }}>
          <span className="metric-label">{label}</span>
          <span className="metric-value">{isText ? textValue : `${Math.round(value)}%`}</span>
        </div>
        {!isText && (
          <div className="progress-track horizontal-track">
            <div
              className="progress-fill"
              style={{
                width: `${Math.min(100, Math.max(0, value))}%`,
                backgroundColor: color
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

const FLAG_MAP = {
  Alemania: '🇩🇪',
  Argentina: '🇦🇷',
  Bolivia: '🇧🇴',
  Brasil: '🇧🇷',
  Canadá: '🇨🇦',
  Chile: '🇨🇱',
  Colombia: '🇨🇴',
  'Costa Rica': '🇨🇷',
  Ecuador: '🇪🇨',
  España: '🇪🇸',
  'Estados Unidos': '🇺🇸',
  Francia: '🇫🇷',
  Inglaterra: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
  Italia: '🇮🇹',
  México: '🇲🇽',
  'Países Bajos': '🇳🇱',
  Paraguay: '🇵🇾',
  Perú: '🇵🇪',
  Portugal: '🇵🇹',
  Uruguay: '🇺🇾',
  Venezuela: '🇻🇪'
};

const getObjectiveLabel = (expectativa) => {
  switch (expectativa) {
    case 'Gigante': return 'Objetivo: Copa Internacional';
    case 'Altas': return 'Objetivo: Campeonato Local';
    case 'Medias': return 'Objetivo: Clasificar a Copas';
    case 'Bajas': return 'Objetivo: Evitar el Descenso';
    case 'Ascenso': return 'Objetivo: Ascenso a 1ra';
    default: return 'Objetivo de Temporada';
  }
};

const getIdolatriaLabel = (value) => {
  if (value < 20) return 'Don Nadie';
  if (value < 50) return 'Respetado';
  if (value < 70) return 'Querido';
  if (value < 90) return 'Referente';
  return 'Ídolo';
};

const getFamaLabel = (value) => {
  if (value < 35) return 'Seco';
  if (value < 75) return 'Normal';
  if (value < 95) return 'Farandulero';
  return 'Vende Humo';
};

export const StatusBar = () => {
  const {
    factions,
    prestigio,
    finanzas,
    idolatria,
    fama,
    clubActual,
    nombreManager,
    nacionalidadManager,
    temporadaActual,
    anioActual
  } = useGameStore();

  const formatShortMoney = (amount) => {
    if (Math.abs(amount) >= 1_000_000) {
      const millions = amount / 1_000_000;
      return `$${Number.isInteger(millions) ? millions : millions.toFixed(1)}M`;
    }
    if (Math.abs(amount) >= 1_000) {
      const thousands = amount / 1_000;
      return `$${Number.isInteger(thousands) ? thousands : thousands.toFixed(0)}K`;
    }
    return `$${amount.toLocaleString('es-AR')}`;
  };

  return (
    <div className="status-bar-container">
      {/* Encabezado del Club y Manager */}
      {clubActual && (
        <div className="game-header-bar">
          <div className="game-header-club">
            <div
              className="club-header-dot"
              style={{ backgroundColor: clubActual.ColorPrincipal || '#3F3A3A' }}
            />
            <div className="club-header-texts">
              <span className="club-header-name">{clubActual.NombreClub}</span>
              <span className="club-header-objective">
                {getObjectiveLabel(clubActual.Expectativas)}
              </span>
            </div>
          </div>

          <div className="game-header-meta">
            <span className="manager-pill">
              {FLAG_MAP[nacionalidadManager] || '⚽'} {nombreManager || 'DT Míster'}
            </span>
            <span className="season-pill">
              Temp {temporadaActual || 1} • {anioActual || 2026}
            </span>
          </div>
        </div>
      )}

      {/* 4 Facciones Principales */}
      <div className="factions-container">
        <FactionBar icon={Users} value={factions.vestuario} color="var(--vestuario-color)" label="Vestuario" />
        <FactionBar icon={Briefcase} value={factions.dirigencia} color="var(--dirigencia-color)" label="Dirigencia" />
        <FactionBar icon={Megaphone} value={factions.hinchas} color="var(--hinchas-color)" label="Hinchas" />
      </div>

      {/* Métricas Secundarias: Finanzas a la izquierda, Prestigio, Idolatría y Fama a la derecha */}
      <div className="metrics-container">
        {/* Columna Izquierda: Finanzas */}
        <div className="finance-section">
          <div className="finance-header">
            <div className="finance-icon-box">
              <DollarSign size={11} color="#3F3A3A" />
            </div>
            <span className="finance-label">Finanzas</span>
          </div>
          <div className="finance-amount">
            {formatShortMoney(finanzas)}
          </div>
          <span className="finance-exact">
            ${finanzas.toLocaleString('es-AR')}
          </span>
        </div>

        {/* Separador estético */}
        <div className="metrics-divider" />

        {/* Columna Derecha: Barras apiladas de Prestigio, Idolatría y Fama */}
        <div className="metrics-bars-section">
          <HorizontalBar icon={Trophy} value={prestigio} color="#A07A38" label="Prestigio" />
          <HorizontalBar icon={Crown} isText textValue={getIdolatriaLabel(idolatria)} color="#A66248" label="Idolatría" />
          <HorizontalBar icon={Star} isText textValue={getFamaLabel(fama)} color="#6E5B5B" label="Fama" />
        </div>
      </div>
    </div>
  );
};
