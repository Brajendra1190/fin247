import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Background, Header, Sidebar } from './components/Layout';
import FinancialDashboard from './modules/financial-dashboard/App';
import BusinessValuation from './modules/business-valuation/App';
import PersonalFinance from './modules/personal-finance/App';
import HomePage from './modules/home/App';
import { AVAILABLE_CURRENCIES } from './utils/formatters';
import { convertAllAmounts, verifyApiConnection } from './utils/currencyConverter';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/auth/PrivateRoute';
import SignIn from './components/auth/SignIn';
import SignUp from './components/auth/SignUp';
import ResetPassword from './components/auth/ResetPassword';
import { Toaster } from 'react-hot-toast';

function App() {
  const [selectedModule, setSelectedModule] = useState<string | null>('home');
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('darkMode') === 'true';
    }
    return false;
  });
  const [globalCurrency, setGlobalCurrency] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('currency') || 'USD';
    }
    return 'USD';
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', darkMode.toString());
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem('currency', globalCurrency);
    
    // Verify API connection when currency changes
    verifyApiConnection().then(isConnected => {
      if (!isConnected) {
        console.warn('Currency conversion API is not available');
      }
    });

    // Dispatch currency change event
    window.dispatchEvent(new CustomEvent('currencyChange', { 
      detail: { 
        currency: globalCurrency,
        convertAmount: async (amount: number, fromCurrency: string) => {
          return await convertAllAmounts({ amount }, fromCurrency, globalCurrency);
        }
      }
    }));
  }, [globalCurrency]);

  // Initialize currency on mount
  useEffect(() => {
    window.dispatchEvent(new CustomEvent('currencyChange', { 
      detail: { 
        currency: globalCurrency,
        convertAmount: async (amount: number, fromCurrency: string) => {
          return await convertAllAmounts({ amount }, fromCurrency, globalCurrency);
        }
      }
    }));
  }, []);

  const AuthenticatedApp = () => (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
      <Sidebar selectedModule={selectedModule} onModuleSelect={setSelectedModule} />
      <div className="pl-0 lg:pl-16 transition-all duration-300">
        <Header 
          darkMode={darkMode} 
          onDarkModeToggle={() => setDarkMode(!darkMode)}
          currency={globalCurrency}
          onCurrencyChange={setGlobalCurrency}
          currencies={AVAILABLE_CURRENCIES}
        />
        <main className="relative px-4 lg:px-8">
          <Background />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/financial-dashboard" element={<FinancialDashboard />} />
            <Route path="/business-valuation" element={<BusinessValuation />} />
            <Route path="/personal-finance" element={<PersonalFinance />} />
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