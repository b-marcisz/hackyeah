import React from 'react';

interface AssociationImageProps {
  src: string;
  alt: string;
  title: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const AssociationImage: React.FC<AssociationImageProps> = ({
  src,
  alt,
  title,
  size = 'md',
  className = '',
}) => {
  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return {
          container: 'w-6 h-6 mb-1', // Уменьшено на 30% для ультра-компактности
          image: 'w-4 h-4',
          text: 'text-xs',
        };
      case 'md':
        return {
          container: 'w-10 h-10 mb-3', // Компактный размер для 3 в ряд
          image: 'w-8 h-8',
          text: 'text-xs',
        };
      case 'lg':
        return {
          container: 'w-12 h-12 mb-4', // Средний размер
          image: 'w-10 h-10',
          text: 'text-sm',
        };
      default:
        return {
          container: 'w-10 h-10 mb-3',
          image: 'w-8 h-8',
          text: 'text-xs',
        };
    }
  };

  const sizeClasses = getSizeClasses();

  return (
    <div className={`relative ${sizeClasses.container} ${className}`}>
      {/* Изображение */}
      <div className="relative w-full h-full">
        <img
          src={src}
          alt={alt}
          className={`${sizeClasses.image} object-contain mx-auto`}
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />
        
        {/* Название с комиксным стилем */}
        <div className="absolute bottom-0 left-0 right-0">
          <div className="bg-black/80 backdrop-blur-sm rounded-b-lg px-1 py-0.5">
            <div className={`${sizeClasses.text} font-black text-white text-center uppercase tracking-wide leading-tight`}
                 style={{
                   textShadow: '1px 1px 0px #000, -1px -1px 0px #000, 1px -1px 0px #000, -1px 1px 0px #000',
                   lineHeight: '1.1',
                 }}>
              {title}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssociationImage;
