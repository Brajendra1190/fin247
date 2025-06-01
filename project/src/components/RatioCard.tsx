import React, { useState } from 'react';
import { getRatioAnalysis, getRatioDetails } from '../utils/ratioCalculations';
import RatioModal from './RatioModal';

interface RatioCardProps {
  name: string;
  value: number;
}

const RatioCard: React.FC<RatioCardProps> = ({ name, value }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const analysis = getRatioAnalysis(value, name);
  const { formula, description } = getRatioDetails(name);
  const isGood = analysis.includes('Good') || analysis.includes('Healthy');
  
  return (
    <>
      <div 
        className="card cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        onClick={() => setIsModalOpen(true)}
        onKeyPress={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsModalOpen(true);
          }
        }}
        role="button"
        tabIndex={0}
        aria-label={`View details for ${name}`}
      >
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-600 dark:text-gray-300">{name}</span>
          <div className="flex items-center gap-2">
            {isGood ? (
              <svg className="h-4 w-4 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            ) : (
              <svg className="h-4 w-4 text-amber-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
              </svg>
            )}
            <span className={`text-lg font-bold ${
              isGood 
                ? 'text-green-600 dark:text-green-400' 
                : 'text-amber-600 dark:text-amber-400'
            }`}>
              {value.toFixed(2)}
            </span>
          </div>
        </div>
        <div className={`flex items-center gap-2 p-2 rounded ${
          isGood 
            ? 'bg-green-50 dark:bg-green-900/50' 
            : 'bg-amber-50 dark:bg-amber-900/50'
        }`}>
          <svg className={`h-4 w-4 ${
            isGood 
              ? 'text-green-500 dark:text-green-400' 
              : 'text-amber-500 dark:text-amber-400'
          }`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01" />
          </svg>
          <span className={`text-sm ${
            isGood 
              ? 'text-green-700 dark:text-green-300' 
              : 'text-amber-700 dark:text-amber-300'
          }`}>
            {analysis}
          </span>
        </div>
      </div>

      <RatioModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        name={name}
        value={value}
        formula={formula}
        description={description}
      />
    </>
  );
};

export default RatioCard;