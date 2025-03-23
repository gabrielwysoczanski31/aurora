import React from 'react';
import { BarChart2, Clipboard, FileText, Home, MapPin, Users, Settings } from 'lucide-react';

const ChimneySidebar = ({ darkMode, activeTab, setActiveTab, sidebarOpen }) => {
  // Definicja nawigacji
  const navItems = [
    { 
      id: 'dashboard', 
      label: 'Dashboard', 
      icon: <BarChart2 size={20} className="mr-3" /> 
    },
    { 
      id: 'inspections', 
      label: 'Kontrole', 
      icon: <Clipboard size={20} className="mr-3" /> 
    },
    { 
      id: 'ceeb', 
      label: 'CEEB', 
      icon: <FileText size={20} className="mr-3" /> 
    },
    { 
      id: 'clients', 
      label: 'Klienci', 
      icon: <Users size={20} className="mr-3" /> 
    },
    { 
      id: 'buildings', 
      label: 'Budynki', 
      icon: <Home size={20} className="mr-3" /> 
    },
    { 
      id: 'map', 
      label: 'Mapa', 
      icon: <MapPin size={20} className="mr-3" /> 
    },
    { 
      id: 'settings', 
      label: 'Ustawienia', 
      icon: <Settings size={20} className="mr-3" /> 
    }
  ];
  
  return (
    <aside className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300 fixed md:static top-14 bottom-0 w-64 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg z-10`}>
      <nav className="p-4">
        <ul className="space-y-2">
          {navItems.map(item => (
            <li key={item.id}>
              <button 
                onClick={() => setActiveTab(item.id)} 
                className={`flex items-center w-full px-4 py-2 rounded-lg ${
                  activeTab === item.id 
                    ? (darkMode ? 'bg-red-600' : 'bg-red-100 text-red-800') 
                    : 'hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default ChimneySidebar;