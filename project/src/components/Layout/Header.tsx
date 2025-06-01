import React from 'react';
import { Sun, Moon, User, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

interface HeaderProps {
  darkMode: boolean;
  onDarkModeToggle: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  darkMode, 
  onDarkModeToggle,
}) => {
  const { currentUser, userProfile, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/signin');
    } catch (error) {
      console.error('Failed to log out:', error);
      toast.error('Failed to log out. Please try again.');
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