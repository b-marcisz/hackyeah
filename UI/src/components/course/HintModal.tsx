import React from 'react';
import { X, RotateCcw, Lightbulb } from 'lucide-react';

interface HintModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRetry: () => void;
  correctAnswer: {
    hero: string;
    action: string;
    object: string;
  };
  number: number;
}

const HintModal: React.FC<HintModalProps> = ({
  isOpen,
  onClose,
  onRetry,
  correctAnswer,
  number
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-r from-purple-800 to-orange-800 rounded-xl p-8 shadow-2xl border-2 border-orange-500 max-w-2xl w-full relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-orange-200 hover:text-orange-100 transition-colors"
        >
          <X className="h-6 w-6" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="text-6xl mb-4">💡</div>
          <h2 className="text-3xl font-bold text-orange-200 mb-2">
            Podpowiedź
          </h2>
          <p className="text-lg text-orange-300">
            Oto prawidłowa odpowiedź dla liczby {number}
          </p>
        </div>

        {/* Correct Answer Display */}
        <div className="bg-gradient-to-r from-black to-gray-900 rounded-xl p-6 mb-6 border-2 border-orange-500">
          <div className="text-center mb-4">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-500 to-purple-500 rounded-full shadow-2xl mb-4">
              <span className="text-2xl font-bold text-white">
                {number}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Hero */}
            <div className="bg-gradient-to-r from-red-800 to-pink-800 rounded-lg p-4 border-2 border-red-500">
              <div className="text-center">
                <div className="text-2xl mb-2">👻</div>
                <h3 className="text-lg font-bold text-red-200 mb-2">Bohater</h3>
                <div className="text-xl font-bold text-red-100">
                  {correctAnswer.hero}
                </div>
              </div>
            </div>

            {/* Action */}
            <div className="bg-gradient-to-r from-green-800 to-emerald-800 rounded-lg p-4 border-2 border-green-500">
              <div className="text-center">
                <div className="text-2xl mb-2">⚡</div>
                <h3 className="text-lg font-bold text-green-200 mb-2">Działanie</h3>
                <div className="text-xl font-bold text-green-100">
                  {correctAnswer.action}
                </div>
              </div>
            </div>

            {/* Object */}
            <div className="bg-gradient-to-r from-blue-800 to-cyan-800 rounded-lg p-4 border-2 border-blue-500">
              <div className="text-center">
                <div className="text-2xl mb-2">🎃</div>
                <h3 className="text-lg font-bold text-blue-200 mb-2">Przedmiot</h3>
                <div className="text-xl font-bold text-blue-100">
                  {correctAnswer.object}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Explanation */}
        <div className="bg-gradient-to-r from-yellow-800 to-orange-800 rounded-lg p-4 mb-6 border-2 border-yellow-500">
          <div className="flex items-center space-x-3 mb-3">
            <Lightbulb className="h-6 w-6 text-yellow-400" />
            <h3 className="text-lg font-bold text-yellow-200">Wskazówka</h3>
          </div>
          <p className="text-yellow-100">
            Zapamiętaj to skojarzenie: <strong>{correctAnswer.hero}</strong> wykonuje 
            <strong> {correctAnswer.action}</strong> z <strong>{correctAnswer.object}</strong> 
            dla liczby <strong>{number}</strong>. Spróbuj ponownie!
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={onRetry}
            className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all duration-300 font-bold text-xl shadow-2xl hover:scale-105 flex items-center justify-center space-x-3"
          >
            <RotateCcw className="h-6 w-6" />
            <span>🔄 Spróbuj Ponownie</span>
          </button>

          <button
            onClick={onClose}
            className="px-8 py-4 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-xl hover:from-gray-600 hover:to-gray-700 transition-all duration-300 font-bold text-xl shadow-2xl hover:scale-105 flex items-center justify-center space-x-3"
          >
            <span>❌ Zamknij</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default HintModal;