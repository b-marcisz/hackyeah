import React from 'react';
import { PoolTransitionResult } from '../../utils/strictPoolTransitionUtils';

interface StrictPoolTransitionStatusProps {
  result: PoolTransitionResult | null;
  showDetails?: boolean;
}

export const StrictPoolTransitionStatus: React.FC<StrictPoolTransitionStatusProps> = ({ 
  result, 
  showDetails = false 
}) => {
  if (!result) {
    return null; // Не показываем ничего, если нет результата
  }

  const getStatusColor = (success: boolean) => {
    return success ? 'text-green-400' : 'text-red-400';
  };

  const getStatusIcon = (success: boolean) => {
    return success ? '✅' : '❌';
  };

  const getBackgroundColor = (success: boolean) => {
    return success ? 'bg-green-900/20 border-green-500/30' : 'bg-red-900/20 border-red-500/30';
  };

  return (
    <div className={`${getBackgroundColor(result.success)} rounded-xl p-4 shadow-lg border mt-4`}>
      <div className="text-center">
        <p className={`text-lg font-semibold ${getStatusColor(result.success)}`}>
          {getStatusIcon(result.success)} {result.success ? 'Pool Transition Successful' : 'Pool Transition Failed'}
        </p>
        
        <div className="mt-2 text-sm text-gray-300">
          <p>API Response: {result.apiResponse ? '✅' : '❌'}</p>
          <p>DB Verification: {result.dbVerification ? '✅' : '❌'}</p>
          <p>Transition Completed: {result.transitionCompleted ? '✅' : '❌'}</p>
          <p>Attempts: {result.attempts}/{result.maxAttempts}</p>
        </div>

        {showDetails && (
          <div className="mt-4 space-y-2">
            {result.errors.length > 0 && (
              <div className="bg-red-900/30 border border-red-700 rounded-lg p-3">
                <h4 className="font-bold text-red-400 mb-2">Errors:</h4>
                <ul className="list-disc list-inside text-red-300 text-sm">
                  {result.errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            )}

            {result.warnings.length > 0 && (
              <div className="bg-yellow-900/30 border border-yellow-700 rounded-lg p-3">
                <h4 className="font-bold text-yellow-400 mb-2">Warnings:</h4>
                <ul className="list-disc list-inside text-yellow-300 text-sm">
                  {result.warnings.map((warning, index) => (
                    <li key={index}>{warning}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="text-xs text-gray-400 mt-2">
              Timestamp: {result.timestamp}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
