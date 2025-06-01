import React, { useState } from 'react';
import { Calculator } from 'lucide-react';
import { PaybackPeriod, NPVCalculator, CostOfCapital, DCFValuation } from './components';

function BusinessValuation() {
  const [activeModule, setActiveModule] = useState<'npv' | 'cost-of-capital' | 'dcf' | 'payback'>('npv');

  const modules = [
    { id: 'npv', name: 'NPV & IRR', description: 'Calculate Net Present Value and Internal Rate of Return' },
    { id: 'cost-of-capital', name: 'Cost of Capital', description: 'Calculate WACC, Cost of Equity, and Cost of Debt' },
    { id: 'dcf', name: 'DCF Valuation', description: 'Discounted Cash Flow Valuation Model' },
    { id: 'payback', name: 'Payback Period', description: 'Calculate Simple and Discounted Payback Period' }
  ];

  const renderModule = () => {
    switch (activeModule) {
      case 'npv':
        return <NPVCalculator />;
      case 'cost-of-capital':
        return <CostOfCapital />;
      case 'dcf':
        return <DCFValuation />;
      case 'payback':
        return <PaybackPeriod />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 p-4">
      <div className="flex items-center gap-3 mb-8">
        <Calculator className="h-10 w-10 text-indigo-600 dark:text-indigo-400" />
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Business Valuation</h1>
      </div>

      <div className="grid md:grid-cols-4 gap-4 mb-8">
        {modules.map((module) => (
          <button
            key={module.id}
            onClick={() => setActiveModule(module.id as typeof activeModule)}
            className={`p-4 rounded-lg transition-all ${
              activeModule === module.id
                ? 'bg-indigo-50 dark:bg-indigo-900/50 border-2 border-indigo-500 dark:border-indigo-400'
                : 'bg-white dark:bg-gray-800 border-2 border-transparent hover:border-gray-200 dark:hover:border-gray-700'
            }`}
          >
            <h3 className={`text-lg font-semibold mb-2 ${
              activeModule === module.id
                ? 'text-indigo-600 dark:text-indigo-400'
                : 'text-gray-900 dark:text-white'
            }`}>
              {module.name}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {module.description}
            </p>
          </button>
        ))}
      </div>

      {renderModule()}
    </div>
  );
}

export default BusinessValuation;