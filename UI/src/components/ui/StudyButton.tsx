import React from 'react';
import { CheckCircle, XCircle, RotateCcw, ArrowLeft } from 'lucide-react';
import HalloweenButton from './HalloweenButton';

interface StudyButtonProps {
  type: 'check' | 'restart' | 'back' | 'next';
  onClick?: () => void;
  disabled?: boolean;
  children?: React.ReactNode;
  className?: string;
}

const StudyButton: React.FC<StudyButtonProps> = ({
  type,
  onClick,
  disabled = false,
  children,
  className = '',
}) => {
  const getButtonConfig = () => {
    switch (type) {
      case 'check':
        return {
          variant: 'success' as const,
          size: 'md' as const,
          icon: <CheckCircle className="h-5 w-5" />,
          defaultText: 'Sprawdź Odpowiedź',
        };
      case 'restart':
        return {
          variant: 'secondary' as const,
          size: 'md' as const,
          icon: <RotateCcw className="h-5 w-5" />,
          defaultText: '🔄 Rozpocznij Ponownie',
        };
      case 'back':
        return {
          variant: 'secondary' as const,
          size: 'md' as const,
          icon: <ArrowLeft className="h-5 w-5" />,
          defaultText: '⬅️ Powrót do Dashboard',
        };
      case 'next':
        return {
          variant: 'primary' as const,
          size: 'md' as const,
          icon: <CheckCircle className="h-5 w-5" />,
          defaultText: '➡️ Następne',
        };
      default:
        return {
          variant: 'primary' as const,
          size: 'md' as const,
          icon: null,
          defaultText: 'Button',
        };
    }
  };

  const config = getButtonConfig();

  return (
    <HalloweenButton
      variant={config.variant}
      size={config.size}
      onClick={onClick}
      disabled={disabled}
      icon={config.icon}
      className={className}
    >
      {children || config.defaultText}
    </HalloweenButton>
  );
};

export default StudyButton;
