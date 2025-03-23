import React, { useState, useEffect } from 'react';
import { Lock, User, AlertTriangle, ArrowRight, CheckCircle, Home, FileText } from 'lucide-react';

const EnhancedLogin = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [selectedSystem, setSelectedSystem] = useState('developer'); // 'developer' lub 'chimney'
  
  // Dane demonstracyjne użytkowników
  const users = [
    { username: 'deweloper', password: 'test123', role: 'developer' },
    { username: 'kominiarz', password: 'test123', role: 'chimney' },
    { username: 'admin', password: 'admin123', role: 'admin' }
  ];

  // Efekt animacji logo
  useEffect(() => {
    const interval = setInterval(() => {
      const logoElements = document.querySelectorAll('.logo-particle');
      logoElements.forEach(elem => {
        elem.style.transform = `translate(${Math.random() * 10 - 5}px, ${Math.random() * 10 - 5}px)`;
        elem.style.opacity = 0.6 + Math.random() * 0.4;
      });
    }, 2000);
    
    return () => clearInterval(interval);
  }, []);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    // Symulacja opóźnienia zapytania
    setTimeout(() => {
      const user = users.find(u => u.username === username && u.password === password);
      
      if (user) {
        setLoginSuccess(true);
        
        // Po pokazaniu animacji sukcesu, zaloguj użytkownika
        setTimeout(() => {
          onLogin({ ...user, system: selectedSystem });
        }, 1500);
      } else {
        setError('Nieprawidłowa nazwa użytkownika lub hasło');
        setIsLoading(false);
      }
    }, 1000);
  };
  
  const getGradientClass = () => {
    if (selectedSystem === 'developer') {
      return 'from-blue-500 to-blue-700';
    } else {
      return 'from-red-500 to-red-700';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center p-4 login-container">
      {/* Logo animowane */}
      <div className="absolute top-8 left-0 w-full flex justify-center pointer-events-none">
        <div className="relative">
          <div className="login-aunoma-logo text-4xl">
            Aunoma<span className="text-sm align-top">.ai</span>
          </div>
          
          {/* Animowane elementy logo */}
          <div className="absolute -top-8 -left-8 w-6 h-6 rounded-full bg-blue-400 opacity-40 blur-md logo-particle transition-all duration-1000 ease-in-out"></div>
          <div className="absolute -bottom-4 -right-8 w-8 h-8 rounded-full bg-red-400 opacity-50 blur-md logo-particle transition-all duration-1000 ease-in-out"></div>
          <div className="absolute top-2 -right-10 w-4 h-4 rounded-full bg-purple-400 opacity-40 blur-md logo-particle transition-all duration-1000 ease-in-out"></div>
          <div className="absolute -bottom-4 left-2 w-5 h-5 rounded-full bg-green-400 opacity-30 blur-md logo-particle transition-all duration-1000 ease-in-out"></div>
        </div>
      </div>
      
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden transform transition-all duration-300 ease-in-out">
        {/* Nagłówek z wyborem systemu */}
        <div className="relative">
          <div className="grid grid-cols-2">
            <button 
              onClick={() => setSelectedSystem('developer')}
              className={`py-6 px-8 transition-all duration-300 relative overflow-hidden ${
                selectedSystem === 'developer' 
                  ? 'bg-gradient-to-r from-blue-500 to-blue-700 text-white font-medium' 
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <Home size={18} />
                <span>Deweloperski</span>
              </div>
              {selectedSystem === 'developer' && (
                <div className="absolute bottom-0 left-0 w-full h-1 bg-white"></div>
              )}
            </button>
            
            <button 
              onClick={() => setSelectedSystem('chimney')}
              className={`py-6 px-8 transition-all duration-300 relative overflow-hidden ${
                selectedSystem === 'chimney' 
                  ? 'bg-gradient-to-r from-red-500 to-red-700 text-white font-medium' 
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <FileText size={18} />
                <span>Kominiarski</span>
              </div>
              {selectedSystem === 'chimney' && (
                <div className="absolute bottom-0 left-0 w-full h-1 bg-white"></div>
              )}
            </button>
          </div>
        </div>
        
        <div className="p-8">
          <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-1">
            Witaj ponownie
          </h2>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-6">
            Zaloguj się do panelu {selectedSystem === 'developer' ? 'deweloperskiego' : 'kominiarskiego'}
          </p>
          
          {error && (
            <div className="mb-4 p-3 bg-red-100 dark:bg-red-900 border-l-4 border-red-500 text-red-700 dark:text-red-200 flex items-center animate-fadeIn">
              <AlertTriangle size={20} className="mr-2 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
          
          {/* Formularz logowania */}
          {!loginSuccess ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="username" className="block text-gray-700 dark:text-gray-300 mb-2 font-medium">
                    Nazwa użytkownika
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User size={18} className={`text-gray-400 ${selectedSystem === 'developer' ? 'group-focus-within:text-blue-500' : 'group-focus-within:text-red-500'}`} />
                    </div>
                    <input
                      id="username"
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className={`form-input ${selectedSystem === 'developer' ? '' : 'chimney'} pl-10 pr-3 py-3 w-full border dark:bg-gray-700 dark:border-gray-600 dark:text-white border-gray-300 rounded-lg focus:outline-none focus:ring-2 ${
                        selectedSystem === 'developer' ? 'focus:ring-blue-500 focus:border-blue-500' : 'focus:ring-red-500 focus:border-red-500'
                      } transition-all`}
                      placeholder="Wpisz nazwę użytkownika"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between">
                    <label htmlFor="password" className="block text-gray-700 dark:text-gray-300 mb-2 font-medium">
                      Hasło
                    </label>
                    <a href="#" className={`text-sm ${
                      selectedSystem === 'developer' ? 'text-blue-600 hover:text-blue-800' : 'text-red-600 hover:text-red-800'
                    } dark:text-gray-300`}>
                      Zapomniałeś hasła?
                    </a>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock size={18} className={`text-gray-400 ${selectedSystem === 'developer' ? 'group-focus-within:text-blue-500' : 'group-focus-within:text-red-500'}`} />
                    </div>
                    <input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={`form-input ${selectedSystem === 'developer' ? '' : 'chimney'} pl-10 pr-3 py-3 w-full border dark:bg-gray-700 dark:border-gray-600 dark:text-white border-gray-300 rounded-lg focus:outline-none focus:ring-2 ${
                        selectedSystem === 'developer' ? 'focus:ring-blue-500 focus:border-blue-500' : 'focus:ring-red-500 focus:border-red-500'
                      } transition-all`}
                      placeholder="Wpisz hasło"
                      required
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    type="checkbox"
                    className={`h-4 w-4 ${
                      selectedSystem === 'developer' ? 'text-blue-600 focus:ring-blue-500' : 'text-red-600 focus:ring-red-500'
                    } border-gray-300 rounded transition-all`}
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                    Zapamiętaj mnie
                  </label>
                </div>
              </div>
              
              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`login-submit-button group w-full py-3 px-4 flex justify-center items-center ${
                    selectedSystem === 'developer' 
                      ? 'bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800' 
                      : 'bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800'
                  } text-white font-medium rounded-lg shadow focus:outline-none focus:ring-2 ${
                    selectedSystem === 'developer' ? 'focus:ring-blue-500' : 'focus:ring-red-500'
                  } transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {isLoading ? (
                    <div className={`loader ${selectedSystem === 'developer' ? '' : 'chimney'}`}></div>
                  ) : (
                    <>
                      <span>Zaloguj się</span>
                      <ArrowRight size={18} className="ml-2 transform transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            <div className="py-8 text-center">
              <div className="flex justify-center">
                <div className={`h-16 w-16 rounded-full ${selectedSystem === 'developer' ? 'bg-blue-100 text-blue-600' : 'bg-red-100 text-red-600'} flex items-center justify-center mb-4 animate-bounce`}>
                  <CheckCircle size={32} />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2">Logowanie pomyślne!</h3>
              <p className="text-gray-600 dark:text-gray-400">Przekierowujemy Cię do dashboardu...</p>
            </div>
          )}
          
          {/* Przykładowe dane logowania */}
          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                  Przykładowi użytkownicy
                </span>
              </div>
            </div>
            
            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="border dark:border-gray-700 rounded-lg p-3 text-center">
                <p className="font-medium text-gray-800 dark:text-gray-200">Deweloper</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Login: deweloper</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Hasło: test123</p>
              </div>
              
              <div className="border dark:border-gray-700 rounded-lg p-3 text-center">
                <p className="font-medium text-gray-800 dark:text-gray-200">Kominiarz</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Login: kominiarz</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Hasło: test123</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedLogin;