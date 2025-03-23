import React from 'react';
import { Bell, Moon, Sun, Menu, X } from 'lucide-react';

const Header = ({ darkMode, setDarkMode, sidebarOpen, setSidebarOpen, notificationCount }) => {
  return (
    <header className={`flex justify-between items-center px-4 py-2 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
      <div className="flex items-center">
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)} 
          className="mr-4 md:hidden"
        >
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        <h1 className="text-2xl font-bold">Aunoma.ai</h1>
      </div>
      
      <div className="flex items-center space-x-4">
        <button className="relative">
          <Bell size={20} />
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
          <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
            A
          </div>
          <span className="hidden md:inline">Admin</span>
        </div>
      </div>
    </header>
  );
};

export default Header;