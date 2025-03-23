import React, { useState } from 'react';
import { User, Mail, Building, Lock, LogOut, Moon, Sun, Bell, Shield } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

const AccountSettings = ({ darkMode, setDarkMode, user, onLogout }) => {
  const [accountData, setAccountData] = useState({
    name: 'Aunoma Sp. z o.o.',
    email: 'kontakt@aunoma.ai',
    nip: '123-456-78-90',
    password: '********',
    notifications: {
      invoices: true,
      payments: true,
      tenants: true,
      maintenance: false
    }
  });
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setAccountData({
      ...accountData,
      [name]: value
    });
  };
  
  const handleNotificationChange = (e) => {
    const { name, checked } = e.target;
    setAccountData({
      ...accountData,
      notifications: {
        ...accountData.notifications,
        [name]: checked
      }
    });
  };
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Ustawienia</h2>
      
      <Card darkMode={darkMode}>
        <h3 className="font-semibold mb-4 flex items-center">
          <User size={20} className="mr-2" />
          Konto
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-gray-500 mb-1">Nazwa</label>
            <input
              type="text"
              name="name"
              value={accountData.name}
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
        <h3 className="font-semibold mb-4 flex items-center">
          <Shield size={20} className="mr-2" />
          Bezpieczeństwo
        </h3>
        
        <div className="mb-6">
          <label className="block text-gray-500 mb-1">Hasło</label>
          <div className="flex">
            <input
              type="password"
              name="password"
              value={accountData.password}
              readOnly
              className={`flex-1 px-3 py-2 border rounded-l-lg ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
            />
            <Button 
              className="rounded-l-none"
            >
              <Lock size={16} className="mr-2" />
              Zmień hasło
            </Button>
          </div>
        </div>
        
        <div>
          <h4 className="font-medium mb-2">Ustawienia dwuskładnikowej weryfikacji</h4>
          <Button 
            variant="outline"
          >
            Aktywuj weryfikację dwuskładnikową
          </Button>
        </div>
      </Card>
      
      <Card darkMode={darkMode}>
        <h3 className="font-semibold mb-4 flex items-center">
          <Bell size={20} className="mr-2" />
          Powiadomienia
        </h3>
        
        <div className="space-y-2">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="invoices"
              name="invoices"
              checked={accountData.notifications.invoices}
              onChange={handleNotificationChange}
              className="mr-2"
            />
            <label htmlFor="invoices">Powiadomienia o fakturach</label>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="payments"
              name="payments"
              checked={accountData.notifications.payments}
              onChange={handleNotificationChange}
              className="mr-2"
            />
            <label htmlFor="payments">Powiadomienia o płatnościach</label>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="tenants"
              name="tenants"
              checked={accountData.notifications.tenants}
              onChange={handleNotificationChange}
              className="mr-2"
            />
            <label htmlFor="tenants">Powiadomienia o najemcach</label>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="maintenance"
              name="maintenance"
              checked={accountData.notifications.maintenance}
              onChange={handleNotificationChange}
              className="mr-2"
            />
            <label htmlFor="maintenance">Powiadomienia o konserwacji</label>
          </div>
        </div>
      </Card>
      
      <Card darkMode={darkMode}>
        <h3 className="font-semibold mb-4">Wygląd</h3>
        
        <div className="flex items-center space-x-4">
          <Button 
            onClick={() => setDarkMode(false)}
            variant={!darkMode ? 'primary' : 'outline'}
          >
            <Sun size={16} className="mr-2" />
            Jasny motyw
          </Button>
          
          <Button 
            onClick={() => setDarkMode(true)}
            variant={darkMode ? 'primary' : 'outline'}
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

export default AccountSettings;