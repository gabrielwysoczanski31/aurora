import React from 'react';
import { PieChart, Home, Users, FileText, DollarSign, Settings } from 'lucide-react';

const Sidebar = ({ darkMode, activeTab, setActiveTab, sidebarOpen }) => {
  // Definicja nawigacji
  const navItems = [
    { 
      id: 'dashboard', 
      label: 'Dashboard', 
      icon: <PieChart size={20} className="mr-3" /> 
    },
    { 
      id: 'properties', 
      label: 'Mieszkania', 
      icon: <Home size={20} className="mr-3" /> 
    },
    { 
      id: 'tenants', 
      label: 'Najemcy', 
      icon: <Users size={20} className="mr-3" /> 
    },
    { 
      id: 'invoices', 
      label: 'Faktury', 
      icon: <FileText size={20} className="mr-3" /> 
    },
    { 
      id: 'finance', 
      label: 'Finanse', 
      icon: <DollarSign size={20} className="mr-3" /> 
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
                    ? (darkMode ? 'bg-blue-600' : 'bg-blue-100 text-blue-800') 
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

export default Sidebar;