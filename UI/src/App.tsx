import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { GameProvider } from './contexts/GameContext';
import HomePage from './pages/HomePage';
import GamePage from './pages/GamePage';
import GameResultPage from './pages/GameResultPage';
import AssociationsPage from './pages/AssociationsPage';
import Dashboard from './pages/Dashboard';
import Course from './pages/Course';
import Header from './components/Header';

function App() {
  return (
    <GameProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600">
          <Header />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/course" element={<Course />} />
              <Route path="/associations" element={<AssociationsPage />} />
              <Route path="/game/:gameId" element={<GamePage />} />
              <Route path="/game/:gameId/result" element={<GameResultPage />} />
            </Routes>
          </main>
        </div>
        <Toaster 
          position="bottom-left"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#1a1a1a',
              color: '#ffffff',
              border: '2px solid #ffffff',
              borderRadius: '12px',
              fontWeight: 'bold',
              fontSize: '16px',
            },
          }}
        />
      </Router>
    </GameProvider>
  );
}

export default App;
