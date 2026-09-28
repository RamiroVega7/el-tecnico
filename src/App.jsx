import React, { useEffect } from 'react';
import { StatusBar } from './components/StatusBar';
import { SwipeCard } from './components/SwipeCard';
import { GameOverNews } from './components/GameOverNews';
import { DifficultySelection } from './components/DifficultySelection';
import { ClubSelection } from './components/ClubSelection';
import { SeasonSummary } from './components/SeasonSummary';
import { OffersScreen } from './components/OffersScreen';
import { CareerSummary } from './components/CareerSummary';
import { useGameStore } from './store/gameStore';
import { syncOfflineTelemetry } from './utils/telemetry';
import './index.css';

function App() {
  useEffect(() => {
    const handleOnline = () => syncOfflineTelemetry();
    window.addEventListener('online', handleOnline);
    syncOfflineTelemetry(); // Try on initial load

    return () => window.removeEventListener('online', handleOnline);
  }, []);

  const { isGameOver, gamePhase, resetGame, deck } = useGameStore();

  const handleDeckEmpty = () => {
    useGameStore.getState().finishSeason();
  };

  return (
    <div id="root">
      {isGameOver && <GameOverNews />}
      
      {!isGameOver && gamePhase === 'difficulty' && (
        <DifficultySelection />
      )}

      {!isGameOver && gamePhase === 'select_club' && (
        <ClubSelection />
      )}

      {!isGameOver && gamePhase === 'playing' && (
        <>
          <StatusBar />
          <SwipeCard cards={deck} onDeckEmpty={handleDeckEmpty} />
        </>
      )}

      {!isGameOver && gamePhase === 'season_summary' && (
        <SeasonSummary />
      )}

      {!isGameOver && gamePhase === 'offers' && (
        <OffersScreen />
      )}

      {!isGameOver && gamePhase === 'career_summary' && (
        <CareerSummary />
      )}
    </div>
  );
}

export default App;
