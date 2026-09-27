import React from 'react';
import { StatusBar } from './components/StatusBar';
import { SwipeCard } from './components/SwipeCard';
import { GameOverNews } from './components/GameOverNews';
import { DifficultySelection } from './components/DifficultySelection';
import { ClubSelection } from './components/ClubSelection';
import { SeasonSummary } from './components/SeasonSummary';
import { OffersScreen } from './components/OffersScreen';
import { useGameStore } from './store/gameStore';
import './index.css';

function App() {
  const { isGameOver, gamePhase, resetGame, deck } = useGameStore();

  const handleDeckEmpty = () => {
    useGameStore.setState({ gamePhase: 'season_summary' });
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
    </div>
  );
}

export default App;
