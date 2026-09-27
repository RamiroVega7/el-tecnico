import React, { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import clubsData from '../assets/cardsInfo/clubs.json';
import { 
  ArrowLeft, 
  Play, 
  UserCheck, 
  DollarSign, 
  Users, 
  Briefcase, 
  Swords, 
  Flame,
  Search,
  ChevronDown,
  Check,
  Shield,
  X
} from 'lucide-react';
import './ClubSelection.css';

const COUNTRIES = [
  { name: 'Alemania', flag: '🇩🇪' },
  { name: 'Argentina', flag: '🇦🇷' },
  { name: 'Bolivia', flag: '🇧🇴' },
  { name: 'Brasil', flag: '🇧🇷' },
  { name: 'Canadá', flag: '🇨🇦' },
  { name: 'Chile', flag: '🇨🇱' },
  { name: 'Colombia', flag: '🇨🇴' },
  { name: 'Costa Rica', flag: '🇨🇷' },
  { name: 'Ecuador', flag: '🇪🇨' },
  { name: 'España', flag: '🇪🇸' },
  { name: 'Estados Unidos', flag: '🇺🇸' },
  { name: 'Francia', flag: '🇫🇷' },
  { name: 'Inglaterra', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
  { name: 'Italia', flag: '🇮🇹' },
  { name: 'México', flag: '🇲🇽' },
  { name: 'Países Bajos', flag: '🇳🇱' },
  { name: 'Paraguay', flag: '🇵🇾' },
  { name: 'Perú', flag: '🇵🇪' },
  { name: 'Portugal', flag: '🇵🇹' },
  { name: 'Uruguay', flag: '🇺🇾' },
  { name: 'Venezuela', flag: '🇻🇪' },
];

export const ClubSelection = () => {
  const { dificultad, setGamePhase, iniciarPartida } = useGameStore();

  // El input arranca por defecto vacío y sin dadito
  const [managerName, setManagerName] = useState('');
  const [managerNationality, setManagerNationality] = useState('Argentina');

  // Estado para los desplegables con buscador
  const [nationalityOpen, setNationalityOpen] = useState(false);
  const [nationalitySearch, setNationalitySearch] = useState('');
  const nationalityRef = useRef(null);

  const [clubOpen, setClubOpen] = useState(false);
  const [clubSearch, setClubSearch] = useState('');
  const clubRef = useRef(null);

  // Filtrado de clubes según reglas de contexto-flujo.md
  const availableClubs = useMemo(() => {
    if (dificultad === 'facil') {
      return clubsData; // Cualquier club
    }
    if (dificultad === 'medio') {
      return clubsData.filter(
        (c) => c.Expectativas === 'Medias' || c.Expectativas === 'Bajas'
      );
    }
    if (dificultad === 'dificil') {
      return clubsData.filter(
        (c) => c.DivisionInicial === 2 || c.Expectativas === 'Ascenso'
      );
    }
    return clubsData;
  }, [dificultad]);

  const [selectedClubId, setSelectedClubId] = useState(null);

  // Derivamos el club activo asegurando que siempre pertenezca a la dificultad actual
  const effectiveClubId = useMemo(() => {
    if (selectedClubId && availableClubs.some(c => c.idClub === selectedClubId)) {
      return selectedClubId;
    }
    return availableClubs[0]?.idClub ?? null;
  }, [availableClubs, selectedClubId]);

  const selectedClub = useMemo(() => {
    return availableClubs.find((c) => c.idClub === effectiveClubId) || availableClubs[0] || null;
  }, [availableClubs, effectiveClubId]);

  // Cerrar desplegables al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (nationalityRef.current && !nationalityRef.current.contains(e.target)) {
        setNationalityOpen(false);
      }
      if (clubRef.current && !clubRef.current.contains(e.target)) {
        setClubOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filtrado de países según búsqueda interna
  const filteredCountries = useMemo(() => {
    const q = nationalitySearch.trim().toLowerCase();
    if (!q) return COUNTRIES;
    return COUNTRIES.filter(c => c.name.toLowerCase().includes(q));
  }, [nationalitySearch]);

  // Filtrado de clubes según búsqueda interna
  const filteredClubs = useMemo(() => {
    const q = clubSearch.trim().toLowerCase();
    if (!q) return availableClubs;
    return availableClubs.filter(c => 
      c.NombreClub.toLowerCase().includes(q) ||
      c.Expectativas.toLowerCase().includes(q) ||
      (c.DivisionInicial === 1 ? '1ra división primera' : '2da división segunda ascenso').includes(q)
    );
  }, [availableClubs, clubSearch]);

  const handleStartGame = () => {
    if (!selectedClub) return;
    iniciarPartida({
      club: selectedClub,
      nombreManager: managerName.trim() || 'DT Míster',
      nacionalidadManager: managerNationality
    });
  };

  const formatShortMoney = (amount) => {
    if (!amount) return '$0';
    if (amount >= 1_000_000) {
      return `$${amount / 1_000_000}M`;
    }
    return `$${amount.toLocaleString('es-AR')}`;
  };

  const getRivalName = (rivalId) => {
    const rival = clubsData.find((c) => c.idClub === rivalId);
    return rival ? rival.NombreClub : 'Clásico';
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

  const difficultyColors = {
    facil: '#3E6B39', // Vintage forest green
    medio: '#A07A38', // Vintage gold/ochre
    dificil: '#9C3838' // Vintage wine/crimson
  };

  const currentCountryObj = COUNTRIES.find(c => c.name === managerNationality) || COUNTRIES[1];

  return (
    <motion.div 
      className="club-selection-screen"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.25 }}
    >
      <div className="club-selection-scrollable">
        {/* Top Nav */}
        <div className="club-nav-header">
        <button 
          className="btn-back-nav"
          onClick={() => setGamePhase('difficulty')}
          type="button"
        >
          <ArrowLeft size={14} />
          <span>Volver a Dificultad</span>
        </button>

        <span className="step-indicator-pill">
          Paso 2 de 2
        </span>
      </div>

      {/* Screen Title */}
      <div className="club-screen-title-area">
        <h2>Ficha y Selección de Club</h2>
        <p className="club-screen-desc">
          Configura tu perfil de DT y elige tu equipo para comenzar la temporada.
        </p>
      </div>

      {/* Manager Customization Box */}
      <section className={`manager-customization-box ${nationalityOpen ? 'dropdown-active' : ''}`}>
        <div className="manager-box-title">
          <UserCheck size={16} color="var(--accent-color)" />
          <span>Ficha del Entrenador</span>
        </div>

        {/* Name Input (Sin dado y arranca vacío) */}
        <div className="form-group">
          <label className="form-label" htmlFor="manager-name-input">
            <span>Nombre del Manager</span>
            <span className="label-subnote">Visible en prensa</span>
          </label>
          <input 
            id="manager-name-input"
            type="text"
            className="manager-input-full"
            value={managerName}
            onChange={(e) => setManagerName(e.target.value)}
            placeholder="Ingresa tu nombre..."
            maxLength={32}
            autoComplete="off"
          />
        </div>

        {/* Nationality Dropdown with Internal Search */}
        <div className="form-group" ref={nationalityRef}>
          <label className="form-label">
            <span>Nacionalidad</span>
          </label>
          
          <div className={`dropdown-wrapper ${nationalityOpen ? 'is-open' : ''}`}>
            <button
              type="button"
              className={`dropdown-trigger ${nationalityOpen ? 'open' : ''}`}
              onClick={() => {
                setNationalityOpen(!nationalityOpen);
                if (clubOpen) setClubOpen(false);
              }}
            >
              <div className="dropdown-trigger-content">
                <span className="country-flag-icon">{currentCountryObj.flag}</span>
                <span className="dropdown-selected-text">{currentCountryObj.name}</span>
              </div>
              <ChevronDown size={16} className={`chevron-icon ${nationalityOpen ? 'rotated' : ''}`} />
            </button>

            <AnimatePresence>
              {nationalityOpen && (
                <motion.div 
                  className="dropdown-menu-panel"
                  initial={{ opacity: 0, y: -6, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.98 }}
                  transition={{ duration: 0.15 }}
                >
                  <div className="dropdown-search-box">
                    <Search size={14} className="search-icon" />
                    <input 
                      type="text"
                      className="dropdown-search-input"
                      placeholder="Buscar país o nacionalidad..."
                      value={nationalitySearch}
                      onChange={(e) => setNationalitySearch(e.target.value)}
                      autoFocus
                    />
                    {nationalitySearch && (
                      <button 
                        type="button" 
                        className="btn-clear-search"
                        onClick={() => setNationalitySearch('')}
                      >
                        <X size={13} />
                      </button>
                    )}
                  </div>

                  <div className="dropdown-options-list">
                    {filteredCountries.length > 0 ? (
                      filteredCountries.map((c) => {
                        const isSelected = managerNationality === c.name;
                        return (
                          <button
                            key={c.name}
                            type="button"
                            className={`dropdown-option-item ${isSelected ? 'selected' : ''}`}
                            onClick={() => {
                              setManagerNationality(c.name);
                              setNationalityOpen(false);
                              setNationalitySearch('');
                            }}
                          >
                            <span className="country-flag-icon">{c.flag}</span>
                            <span className="option-name">{c.name}</span>
                            {isSelected && <Check size={14} className="option-check-icon" />}
                          </button>
                        );
                      })
                    ) : (
                      <div className="dropdown-empty-state">
                        No se encontró "{nationalitySearch}"
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Clubs Section with Dropdown & Search */}
      <section className={`clubs-selection-section ${clubOpen ? 'dropdown-active' : ''}`}>
        <div className="clubs-section-header">
          <div className="clubs-header-title-row">
            <Shield size={16} color="var(--accent-color)" />
            <h3 className="clubs-section-title">
              Selección de Club ({availableClubs.length})
            </h3>
          </div>
          <span 
            className="difficulty-filter-tag"
            style={{ 
              color: difficultyColors[dificultad] || '#38bdf8',
              backgroundColor: `${difficultyColors[dificultad] || '#38bdf8'}18`,
              border: `1px solid ${difficultyColors[dificultad] || '#38bdf8'}40`
            }}
          >
            Dificultad: {dificultad?.toUpperCase()}
          </span>
        </div>

        {/* Club Dropdown with Internal Search */}
        <div className="form-group" ref={clubRef}>
          <div className={`dropdown-wrapper ${clubOpen ? 'is-open' : ''}`}>
            <button
              type="button"
              className={`dropdown-trigger club-trigger ${clubOpen ? 'open' : ''}`}
              onClick={() => {
                setClubOpen(!clubOpen);
                if (nationalityOpen) setNationalityOpen(false);
              }}
              style={{
                borderColor: selectedClub ? `${selectedClub.ColorPrincipal}70` : undefined
              }}
            >
              <div className="dropdown-trigger-content">
                {selectedClub && (
                  <div 
                    className="club-crest-dot"
                    style={{ backgroundColor: selectedClub.ColorPrincipal }}
                  />
                )}
                <span className="dropdown-selected-text font-bold">
                  {selectedClub?.NombreClub || 'Selecciona un Club'}
                </span>
                {selectedClub && (
                  <span className="trigger-club-badge">
                    {selectedClub.DivisionInicial === 1 ? '1ra Div' : '2da Div'}
                  </span>
                )}
              </div>
              <ChevronDown size={16} className={`chevron-icon ${clubOpen ? 'rotated' : ''}`} />
            </button>

            <AnimatePresence>
              {clubOpen && (
                <motion.div 
                  className="dropdown-menu-panel"
                  initial={{ opacity: 0, y: -6, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.98 }}
                  transition={{ duration: 0.15 }}
                >
                  <div className="dropdown-search-box">
                    <Search size={14} className="search-icon" />
                    <input 
                      type="text"
                      className="dropdown-search-input"
                      placeholder="Buscar club por nombre, división..."
                      value={clubSearch}
                      onChange={(e) => setClubSearch(e.target.value)}
                      autoFocus
                    />
                    {clubSearch && (
                      <button 
                        type="button" 
                        className="btn-clear-search"
                        onClick={() => setClubSearch('')}
                      >
                        <X size={13} />
                      </button>
                    )}
                  </div>

                  <div className="dropdown-options-list">
                    {filteredClubs.length > 0 ? (
                      filteredClubs.map((club) => {
                        const isSelected = selectedClub?.idClub === club.idClub;
                        return (
                          <button
                            key={club.idClub}
                            type="button"
                            className={`dropdown-option-item ${isSelected ? 'selected' : ''}`}
                            onClick={() => {
                              setSelectedClubId(club.idClub);
                              setClubOpen(false);
                              setClubSearch('');
                            }}
                          >
                            <div 
                              className="club-crest-dot"
                              style={{ backgroundColor: club.ColorPrincipal }}
                            />
                            <div className="club-option-text">
                              <span className="option-name">{club.NombreClub}</span>
                              <span className="club-option-sub">
                                {club.DivisionInicial === 1 ? '1ra División' : '2da División'} • {club.Expectativas}
                              </span>
                            </div>
                            {isSelected && <Check size={14} className="option-check-icon" />}
                          </button>
                        );
                      })
                    ) : (
                      <div className="dropdown-empty-state">
                        No se encontró ningún club con "{clubSearch}"
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Selected Club Preview Card */}
        {selectedClub && (
          <motion.div 
            className="selected-club-card"
            key={selectedClub.idClub}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            style={{
              borderColor: selectedClub.ColorPrincipal,
              boxShadow: `0 0 18px ${selectedClub.ColorPrincipal}25`
            }}
          >
            {/* Color Stripe on the left */}
            <div 
              className="club-color-bar"
              style={{ backgroundColor: selectedClub.ColorPrincipal }}
            />

            {/* Club Header */}
            <div className="club-card-header">
              <div className="club-name-group">
                <div 
                  className="club-crest-dot"
                  style={{ backgroundColor: selectedClub.ColorPrincipal }}
                />
                <h4 className="club-name-title">{selectedClub.NombreClub}</h4>
              </div>

              <div className="club-badges-row">
                <span className="badge-division">
                  {selectedClub.DivisionInicial === 1 ? '1ra División' : '2da División'}
                </span>
                <span className={`badge-expectativa ${getExpectativaClass(selectedClub.Expectativas)}`}>
                  {selectedClub.Expectativas}
                </span>
              </div>
            </div>

            {/* Key Details Grid */}
            <div className="club-details-grid">
              <div className="club-detail-item">
                <Briefcase size={12} color="#fbbf24" />
                <span>Pres: <strong>{selectedClub.Presidente}</strong></span>
              </div>
              <div className="club-detail-item">
                <Users size={12} color="#f472b6" />
                <span>Cap: <strong>{selectedClub.Capitan}</strong></span>
              </div>
              <div className="club-detail-item">
                <Flame size={12} color="#60a5fa" />
                <span>Hincha: <strong>{selectedClub.HinchaCaracterizado}</strong></span>
              </div>
              <div className="club-detail-item club-finance-badge">
                <DollarSign size={13} />
                <span>Caja: {formatShortMoney(selectedClub.FinanzasInicial)}</span>
              </div>
            </div>

            {/* Clásico Rival info */}
            <div className="club-rival-info">
              <Swords size={12} color="#f43f5e" />
              <span>Clásico Rival: <strong>{getRivalName(selectedClub.ClasicoRivalId)}</strong></span>
            </div>
          </motion.div>
        )}
      </section>
      </div>

      {/* Floating Bottom Bar */}
      <div className="club-bottom-bar">
        <button 
          className="btn-start-game"
          onClick={handleStartGame}
          disabled={!selectedClub}
          type="button"
        >
          <Play size={18} fill="currentColor" />
          <span>Iniciar Partida: {selectedClub?.NombreClub || 'Selecciona Club'}</span>
        </button>
        <p className="start-preview-text">
          DT: {managerName.trim() || 'DT Míster'} ({managerNationality}) • Temporada 2026
        </p>
      </div>
    </motion.div>
  );
};
