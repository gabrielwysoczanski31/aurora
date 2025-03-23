import React, { useState, useEffect } from 'react';
import EnhancedLogin from './EnhancedLogin';
import AppDeveloper from './AppDeveloper';
import AppChimney from './AppChimney';

const MainApp = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Sprawdzenie, czy użytkownik jest zalogowany przy uruchomieniu
  useEffect(() => {
    // Sprawdzamy zapisanego użytkownika w localStorage
    const savedUser = localStorage.getItem('user');
    
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Błąd parsowania zapisanego użytkownika:', error);
        localStorage.removeItem('user');
      }
    }
    
    setIsLoading(false);
  }, []);

  // Obsługa logowania
  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  // Obsługa wylogowywania
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Ładowanie...</p>
        </div>
      </div>
    );
  }

  // Wybór właściwego dashboard'u w zależności od roli użytkownika
  const renderDashboard = () => {
    if (!user) {
        return <EnhancedLogin onLogin={handleLogin} />;
    }

    switch (user.role) {
      case 'developer':
        return <AppDeveloper user={user} onLogout={handleLogout} />;
      case 'chimney':
        return <AppChimney user={user} onLogout={handleLogout} />;
      case 'admin':
        // W przypadku admina może być wybór dashboardu
        return (
          <div className="min-h-screen bg-gray-100 p-8">
            <h1 className="text-2xl font-bold mb-6">Panel administratora</h1>
            <p className="mb-4">Wybierz dashboard, do którego chcesz przejść:</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div 
                className="p-6 bg-white rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => setUser({...user, role: 'developer'})}
              >
                <h2 className="text-xl font-semibold mb-2">Dashboard deweloperski</h2>
                <p className="text-gray-600">Zarządzanie mieszkaniami, najemcami, fakturami</p>
              </div>
              
              <div 
                className="p-6 bg-white rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => setUser({...user, role: 'chimney'})}
              >
                <h2 className="text-xl font-semibold mb-2">Dashboard kominiarski</h2>
                <p className="text-gray-600">Kontrole, zgłoszenia CEEB, klienci</p>
              </div>
            </div>
            
            <button 
              onClick={handleLogout}
              className="mt-6 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Wyloguj się
            </button>
          </div>
        );
      default:
        return <div>Nieznana rola użytkownika</div>;
    }
  };

  return renderDashboard();
};

export default MainApp;