import React from 'react';
import { Calendar, Moon, Sun, Menu, X, LogOut } from 'lucide-react';

const ChimneyHeader = ({ 
  darkMode, 
  setDarkMode, 
  sidebarOpen, 
  setSidebarOpen, 
  notificationCount,
  user,
  onLogout
}) => {
  return (
    <header className={`flex justify-between items-center px-4 py-2 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
      <div className="flex items-center">
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)} 
          className="mr-4 md:hidden"
        >
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        <h1 className="text-2xl font-bold">Kominiarz CEEB</h1>
      </div>
      
      <div className="flex items-center space-x-4">
        <button className="relative">
          <Calendar size={20} />
          {notificationCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
              {notificationCount}
            </span>
          )}
        </button>
        
        <button onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-full bg-red-500 flex items-center justify-center text-white">
            {user?.username?.charAt(0).toUpperCase() || 'K'}
          </div>
          <span className="hidden md:inline">
            {user?.username || 'Technik'}
          </span>
        </div>
        
        {onLogout && (
          <button 
            onClick={onLogout}
            className="text-gray-500 hover:text-red-500"
            title="Wyloguj się"
          >
            <LogOut size={20} />
          </button>
        )}
      </div>
    </header>
  );
};

export default ChimneyHeader;