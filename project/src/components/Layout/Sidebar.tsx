import React, { useState } from 'react';
import { Home, TrendingUp, Calculator, ChevronLeft, ChevronRight, Menu, Wallet } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

interface SidebarProps {
  onModuleSelect: (moduleId: string | null) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onModuleSelect }) => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const modules = [
    {
      id: 'home',
      name: 'Home',
      icon: Home,
      description: 'Dashboard Overview',
      path: '/'
    },
    {
      id: 'financial-dashboard',
      name: 'Financial Analysis',
      icon: TrendingUp,
      description: 'Ratio Analysis',
      path: '/financial-dashboard'
    },
    {
      id: 'business-valuation',
      name: 'Business Valuation',
      icon: Calculator,
      description: 'Company Valuation',
      path: '/business-valuation'
    },
    {
      id: 'personal-finance',
      name: 'Personal Finance',
      icon: Wallet,
      description: 'Personal Finance Management',
      path: '/personal-finance'
    },
    {
      id: 'crm',
      name: 'CRM',
      icon: ChevronRight, // Use a default icon or previous icon, not CRM image
      description: 'Customer Relationship Management',
      path: '/crm'
    }
  ];

  const handleModuleSelect = (moduleId: string, path: string) => {
    onModuleSelect(moduleId);
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="fixed top-4 left-4 p-2 rounded-lg bg-white dark:bg-gray-800 shadow-md lg:hidden z-50"
        aria-label="Toggle mobile menu"
      >
        <Menu className="h-7 w-7 text-gray-600 dark:text-gray-400" />
      </button>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed left-0 top-0 h-screen bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 shadow-lg transition-all duration-300 ease-in-out z-50
          ${isCollapsed ? 'w-24' : 'w-64'} 
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="flex flex-col h-full p-4">
          {/* Collapse Toggle Button - Hidden on Mobile */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="absolute -right-3 top-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full p-1 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors hidden lg:block"
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            ) : (
              <ChevronLeft className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            )}
          </button>

          {/* Logo */}
          {/* Removed database image from center/top, only FinAnalytics text and logo remain */}
          <button 
            onClick={() => handleModuleSelect('home', '/')}
            className={`flex items-center gap-3 mb-8 hover:opacity-80 transition-opacity ${isCollapsed ? 'justify-center' : ''}`}
          >
            <svg 
              className="h-10 w-10 text-indigo-600 dark:text-indigo-400 flex-shrink-0" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </button>
          
          {/* Navigation */}
          <nav className="space-y-6">
            {modules.map((module) => {
              const isActive = location.pathname === module.path;
              return (
                <button
                  key={module.id}
                  onClick={() => handleModuleSelect(module.id, module.path)}
                  className={`w-full flex flex-col items-center gap-1 py-2 text-sm font-medium rounded-lg transition-all ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  {React.createElement(module.icon, { className: 'h-7 w-7' })}
                  {isCollapsed ? (
                    <span className="text-xs text-center px-1">
                      {module.name.split(' ')[0]}
                    </span>
                  ) : (
                    <span className="text-sm">
                      {module.name}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;