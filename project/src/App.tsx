import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Background, Header, Sidebar } from './components/Layout';
import FinancialDashboard from './modules/financial-dashboard/App';
import BusinessValuation from './modules/business-valuation/App';
import PersonalFinance from './modules/personal-finance/App';
import HomePage from './modules/home/App';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/auth/PrivateRoute';
import SignIn from './components/auth/SignIn';
import SignUp from './components/auth/SignUp';
import ResetPassword from './components/auth/ResetPassword';
import { Toaster } from 'react-hot-toast';
import CRMApp from './modules/crm/CRMApp';

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('darkMode') === 'true';
    }
    return false;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', darkMode.toString());
  }, [darkMode]);

  const AuthenticatedApp = () => (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
      <Sidebar onModuleSelect={() => {}} />
      <div className="pl-0 lg:pl-16 transition-all duration-300">
        <Header 
          darkMode={darkMode} 
          onDarkModeToggle={() => setDarkMode(!darkMode)}
        />
        <main className="relative px-4 lg:px-8">
          <Background />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/financial-dashboard" element={<FinancialDashboard />} />
            <Route path="/business-valuation" element={<BusinessValuation />} />
            <Route path="/personal-finance" element={<PersonalFinance />} />
            <Route path="/crm" element={<CRMApp />} />
          </Routes>
        </main>
      </div>
    </div>
  );

  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          {/* Protected Routes */}
          <Route path="/*" element={
            <PrivateRoute>
              <AuthenticatedApp />
            </PrivateRoute>
          } />
        </Routes>
        <Toaster position="top-right" />
      </Router>
    </AuthProvider>
  );
}

export default App;