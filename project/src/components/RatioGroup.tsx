import React from 'react';
import RatioCard from './RatioCard';

interface RatioGroupProps {
  title: string;
  ratios: Array<{ name: string; value: number }>;
}

const RatioGroup: React.FC<RatioGroupProps> = ({ title, ratios }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      <div className="space-y-3">
        {ratios.map((ratio) => (
          <RatioCard key={ratio.name} name={ratio.name} value={ratio.value} />
        ))}
      </div>
    </div>
  );
};

export default RatioGroup;