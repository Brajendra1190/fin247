import React from 'react';

const Background: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-5">
      <div className="absolute inset-0 grid grid-cols-6 gap-8 p-8">
        {Array.from({ length: 24 }).map((_, i) => (
          <div 
            key={i} 
            className="flex flex-col gap-4 text-2xl text-current animate-float" 
            style={{ animationDelay: `${i * 0.1}s` }}
          >
            {['∑', '÷', '×', '±', '∞', '≠', '≈', '∫', '∂', '√', 'π', '∆', '$', '¢', '€', '£', '¥'].map((symbol, j) => (
              <span key={j} className="transform rotate-12">{symbol}</span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Background;