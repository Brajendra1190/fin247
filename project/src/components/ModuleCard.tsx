import React from 'react';

interface ModuleCardProps {
  id: string;
  title: string;
  description: string;
  color: string;
  onClick: () => void;
}

const ModuleCard: React.FC<ModuleCardProps> = ({
  title,
  description,
  color,
  onClick
}) => {
  const getColorClasses = (color: string) => {
    const classes = {
      indigo: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400',
      emerald: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/50 dark:text-emerald-400',
      blue: 'bg-blue-50 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400',
      violet: 'bg-violet-50 text-violet-600 dark:bg-violet-900/50 dark:text-violet-400',
      rose: 'bg-rose-50 text-rose-600 dark:bg-rose-900/50 dark:text-rose-400',
      amber: 'bg-amber-50 text-amber-600 dark:bg-amber-900/50 dark:text-amber-400'
    };
    return classes[color as keyof typeof classes] || classes.indigo;
  };

  return (
    <div
      className="group relative bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyPress={(e) => e.key === 'Enter' && onClick()}
    >
      <div className="p-6">
        <div className={`inline-flex p-3 rounded-lg ${getColorClasses(color)} mb-4`}>
          <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          {title}
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          {description}
        </p>
      </div>
      <div className="absolute inset-0 border-2 border-transparent group-hover:border-indigo-500 dark:group-hover:border-indigo-400 rounded-xl transition-colors duration-300" />
    </div>
  );
};

export default ModuleCard;