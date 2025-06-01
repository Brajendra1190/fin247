import React, { useEffect } from 'react';
import { X, AlertTriangle, CheckCircle } from 'lucide-react';
import { getRatioAnalysis } from '../utils/ratioCalculations';

interface RatioModalProps {
  isOpen: boolean;
  onClose: () => void;
  name: string;
  value: number;
  formula: string;
  description: string;
}

const RatioModal: React.FC<RatioModalProps> = ({
  isOpen,
  onClose,
  name,
  value,
  formula,
  description
}) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const analysis = getRatioAnalysis(value, name);
  const isGood = analysis.includes('Good') || analysis.includes('Healthy');

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm"
      onClick={handleBackdropClick}
      aria-modal="true"
      role="dialog"
      aria-labelledby="modal-title"
    >
      <div 
        className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6 relative animate-fade-in shadow-xl"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          aria-label="Close modal"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="space-y-6">
          <div className="flex items-start gap-3">
            <div className={`p-2 rounded-lg ${isGood ? 'bg-green-100 dark:bg-green-900/50' : 'bg-amber-100 dark:bg-amber-900/50'}`}>
              {isGood ? (
                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
              ) : (
                <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              )}
            </div>
            <div>
              <h3 id="modal-title" className="text-xl font-bold text-gray-900 dark:text-white">{name}</h3>
              <p className={`text-2xl font-bold mt-1 ${
                isGood 
                  ? 'text-green-600 dark:text-green-400' 
                  : 'text-amber-600 dark:text-amber-400'
              }`}>
                {value.toFixed(2)}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold text-gray-700 dark:text-gray-300">Formula</h4>
            <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">
              <code className="text-sm text-gray-800 dark:text-gray-200 font-mono">{formula}</code>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold text-gray-700 dark:text-gray-300">Description</h4>
            <p className="text-gray-600 dark:text-gray-400">{description}</p>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold text-gray-700 dark:text-gray-300">Analysis</h4>
            <div className={`p-3 rounded-lg ${
              isGood 
                ? 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300' 
                : 'bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300'
            }`}>
              <p className="flex items-center gap-2">
                {isGood ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <AlertTriangle className="h-4 w-4" />
                )}
                {analysis}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RatioModal;