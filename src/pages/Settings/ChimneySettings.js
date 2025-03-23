import React, { useState } from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { LogOut, Moon, Sun } from 'lucide-react';

const ChimneySettings = ({ darkMode, setDarkMode, user, onLogout }) => {
  const [accountData, setAccountData] = useState({
    companyName: 'Usługi Kominiarskie Sp. z o.o.',
    email: 'biuro@kominiarz.pl',
    nip: '987-654-32-10',
    ceebLogin: 'kominiarz_ceeb',
    ceebPassword: '********',
    apiKey: 'ceeb_api_key_12345'
  });
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setAccountData({
      ...accountData,
      [name]: value
    });
  };
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Ustawienia</h2>
      
      <Card darkMode={darkMode}>
        <h3 className="font-semibold mb-4">Konto</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-gray-500 mb-1">Nazwa firmy</label>
            <input
              type="text"
              name="companyName"
              value={accountData.companyName}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
            />
          </div>
          
          <div>
            <label className="block text-gray-500 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={accountData.email}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
            />
          </div>
          
          <div>
            <label className="block text-gray-500 mb-1">NIP</label>
            <input
              type="text"
              name="nip"
              value={accountData.nip}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
            />
          </div>
        </div>
      </Card>
      
      <Card darkMode={darkMode}>
        <h3 className="font-semibold mb-4">Dane CEEB</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-gray-500 mb-1">Login CEEB</label>
            <input
              type="text"
              name="ceebLogin"
              value={accountData.ceebLogin}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
            />
          </div>
          
          <div>
            <label className="block text-gray-500 mb-1">Hasło CEEB</label>
            <input
              type="password"
              name="ceebPassword"
              value={accountData.ceebPassword}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
            />
          </div>
          
          <div>
            <label className="block text-gray-500 mb-1">API Key</label>
            <input
              type="text"
              name="apiKey"
              value={accountData.apiKey}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
            />
          </div>
        </div>
      </Card>
      
      <Card darkMode={darkMode}>
        <h3 className="font-semibold mb-4">Wygląd</h3>
        
        <div className="flex items-center space-x-4">
          <Button 
            onClick={() => setDarkMode(false)}
            variant={!darkMode ? 'primary' : 'outline'}
            color="red"
          >
            <Sun size={16} className="mr-2" />
            Jasny motyw
          </Button>
          
          <Button 
            onClick={() => setDarkMode(true)}
            variant={darkMode ? 'primary' : 'outline'}
            color="red"
          >
            <Moon size={16} className="mr-2" />
            Ciemny motyw
          </Button>
        </div>
      </Card>
      
      <Card darkMode={darkMode}>
        <h3 className="font-semibold mb-4">Konto użytkownika</h3>
        <p className="text-gray-500 mb-4">Zalogowany jako: <span className="font-medium">{user?.username || 'Użytkownik'}</span></p>
        
        {onLogout && (
          <Button 
            color="red"
            variant="outline"
            onClick={onLogout}
            className="flex items-center"
          >
            <LogOut size={16} className="mr-2" />
            Wyloguj się
          </Button>
        )}
      </Card>
    </div>
  );
};

export default ChimneySettings;