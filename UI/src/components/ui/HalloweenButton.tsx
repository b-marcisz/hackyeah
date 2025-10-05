import React, { useState } from 'react';
import { useSpring, animated, config } from '@react-spring/web';
import { motion } from 'framer-motion';

interface HalloweenButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  className?: string;
  icon?: React.ReactNode;
}

const HalloweenButton: React.FC<HalloweenButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  className = '',
  icon,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  // Простые анимации - только масштабирование
  const hoverSpring = useSpring({
    scale: isHovered ? 1.05 : 1,
    boxShadow: isHovered 
      ? '0 4px 8px rgba(0, 0, 0, 0.3)' 
      : '0 2px 4px rgba(0, 0, 0, 0.1)',
    config: config.gentle,
  });

  const pressSpring = useSpring({
    scale: isPressed ? 0.95 : 1,
    config: config.gentle,
  });

  // Минималистичная цветовая схема - только 3 цвета
  const getVariantStyles = () => {
    // Основные цвета: #1a1a1a (темно-серый), #ffffff (белый), #3b82f6 (синий)
    switch (variant) {
      case 'primary':
        return {
          background: '#3b82f6',
          border: '3px solid #1a1a1a',
          textShadow: '2px 2px 0px #1a1a1a',
          glow: '0 0 10px rgba(59, 130, 246, 0.3)',
        };
      case 'secondary':
        return {
          background: '#1a1a1a',
          border: '3px solid #ffffff',
          textShadow: '2px 2px 0px #ffffff',
          glow: '0 0 10px rgba(26, 26, 26, 0.3)',
        };
      case 'danger':
        return {
          background: '#1a1a1a',
          border: '3px solid #ffffff',
          textShadow: '2px 2px 0px #ffffff',
          glow: '0 0 10px rgba(26, 26, 26, 0.3)',
        };
      case 'success':
        return {
          background: '#3b82f6',
          border: '3px solid #1a1a1a',
          textShadow: '2px 2px 0px #1a1a1a',
          glow: '0 0 10px rgba(59, 130, 246, 0.3)',
        };
      default:
        return {
          background: '#3b82f6',
          border: '3px solid #1a1a1a',
          textShadow: '2px 2px 0px #1a1a1a',
          glow: '0 0 10px rgba(59, 130, 246, 0.3)',
        };
    }
  };

  // Размеры кнопок - комиксный стиль
  const getSizeStyles = () => {
    return {
      padding: '16px 32px',
      fontSize: '20px',
      minHeight: '56px',
      fontWeight: '900',
      letterSpacing: '0.5px',
    };
  };

  const variantStyles = getVariantStyles();
  const sizeStyles = getSizeStyles();

  return (
    <animated.button
      style={{
        ...hoverSpring,
        ...pressSpring,
        background: variantStyles.background,
        border: variantStyles.border,
        borderRadius: '12px',
        color: '#ffffff',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.6 : 1,
        position: 'relative',
        overflow: 'hidden',
        textShadow: variantStyles.textShadow,
        boxShadow: isHovered ? variantStyles.glow : '0 10px 20px rgba(0, 0, 0, 0.3)',
        transition: 'all 0.3s ease',
        ...sizeStyles,
      }}
      className={`halloween-button uppercase ${className}`}
      onClick={disabled ? undefined : onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsPressed(false);
      }}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      disabled={disabled}
    >
      {/* Простой фон */}
      <div className="absolute inset-0 rounded-lg" />
      
      {/* Содержимое кнопки */}
      <div className="relative z-10 flex items-center justify-center space-x-2">
        {icon && (
          <motion.div
            animate={{
              scale: isHovered ? 1.1 : 1,
            }}
            transition={{
              duration: 0.2,
              ease: 'easeInOut',
            }}
          >
            {icon}
          </motion.div>
        )}
        <span>{children}</span>
      </div>

      {/* Простой эффект при наведении */}
      {isHovered && (
        <motion.div
          className="absolute inset-0 rounded-lg"
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />
      )}
    </animated.button>
  );
};

export default HalloweenButton;
