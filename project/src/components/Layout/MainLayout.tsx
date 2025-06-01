import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Header, Sidebar } from './index';

interface MainLayoutProps {
  darkMode: boolean;
  handleDarkModeToggle: () => void;
}

export default function MainLayout({
  darkMode,
  handleDarkModeToggle,
}: MainLayoutProps) {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <Navigate to="/signin" />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header darkMode={darkMode} onDarkModeToggle={handleDarkModeToggle} />
      <div className="flex">
        <Sidebar onModuleSelect={() => {}} />
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}