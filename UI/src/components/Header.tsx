import React from 'react';
import { Link } from 'react-router-dom';
import { Brain, Trophy, Home } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-white/10 backdrop-blur-md border-b border-white/20">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2 text-white hover:text-white/80 transition-colors">
            <Brain className="h-8 w-8" />
            <span className="text-xl font-bold">Number Association</span>
          </Link>
          
          <nav className="flex items-center space-x-6">
            <Link 
              to="/" 
              className="flex items-center space-x-1 text-white/80 hover:text-white transition-colors"
            >
              <Home className="h-4 w-4" />
              <span>Główna</span>
            </Link>
            
            <div className="flex items-center space-x-1 text-white/80">
              <Trophy className="h-4 w-4" />
              <span>Punkty: 0</span>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
