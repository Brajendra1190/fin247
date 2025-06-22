import React from 'react';
import { Sun, Moon, User, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { AVAILABLE_CURRENCIES } from '../../utils/formatters';
import toast from 'react-hot-toast';

interface HeaderProps {
  darkMode: boolean;
  onDarkModeToggle: () => void;
  currency: string;
  onCurrencyChange: (currency: string) => void;
}

const Header: React.FC<HeaderProps> = ({ 
  darkMode, 
  onDarkModeToggle,
  currency,
  onCurrencyChange
}) => {
  const { currentUser, userProfile, logout } = useAuth();
  const navigate = useNavigate();
  const [isChangingCurrency, setIsChangingCurrency] = React.useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/signin');
    } catch (error) {
      console.error('Failed to log out:', error);
      toast.error('Failed to log out. Please try again.');
    }
  };

  const handleCurrencyChange = async (newCurrency: string) => {
    if (isChangingCurrency || newCurrency === currency) return;
    
    setIsChangingCurrency(true);
    const prevCurrency = currency;
    
    try {
      // Update localStorage without triggering navigation
      localStorage.setItem('currency', newCurrency);
      
      // Dispatch currency change event
      window.dispatchEvent(new CustomEvent('currencyChange', { 
        detail: { 
          currency: newCurrency,
          previousCurrency: prevCurrency
        }
      }));

      // Call the parent handler
      onCurrencyChange(newCurrency);

      toast.success(`Currency changed to ${newCurrency}`);
    } catch (error) {
      console.error('Error changing currency:', error);
      toast.error('Failed to change currency. Please try again.');
      
      // Revert to previous currency in localStorage
      localStorage.setItem('currency', prevCurrency);
    } finally {
      setIsChangingCurrency(false);
    }
  };

  return (
    <div className="flex justify-between items-center h-16 px-4 lg:px-8 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      {/* User Profile Section */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center">
            <User className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {userProfile?.displayName || currentUser?.email}
            </p>
          </div>
        </div>
      </div>

      {/* Settings Section */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Currency:
          </label>
          <select
            value={currency}
            onChange={(e) => handleCurrencyChange(e.target.value)}
            className="input-field w-auto bg-gray-100 dark:bg-gray-700 border-none"
            disabled={isChangingCurrency}
          >
            {AVAILABLE_CURRENCIES.map(curr => (
              <option key={curr} value={curr}>{curr}</option>
            ))}
          </select>
        </div>
        
        <button
          onClick={onDarkModeToggle}
          className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
          aria-label="Toggle dark mode"
        >
          {darkMode ? (
            <Sun className="h-5 w-5 text-amber-500" />
          ) : (
            <Moon className="h-5 w-5 text-indigo-600" />
          )}
        </button>

        <button
          onClick={handleLogout}
          className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
          aria-label="Logout"
        >
          <LogOut className="h-5 w-5 text-gray-600 dark:text-gray-400" />
        </button>
      </div>
    </div>
  );
};

export default Header;