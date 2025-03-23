import React, { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';

const Layout = ({ children, darkMode, setDarkMode, activeTab, setActiveTab, data }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  // Obliczanie nieprzeczytanych powiadomień
  const unpaidInvoices = (data?.invoices || []).filter(inv => inv.status === 'Do zapłaty').length;
  
  return (
    <div className={`min-h-screen flex flex-col ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-800'}`}>
      <Header 
        darkMode={darkMode} 
        setDarkMode={setDarkMode}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        notificationCount={unpaidInvoices}
      />
      
      <div className="flex flex-1">
        <Sidebar 
          darkMode={darkMode} 
          activeTab={activeTab} 
          setActiveTab={setActiveTab}
          sidebarOpen={sidebarOpen}
        />
        
        <main className="flex-1 p-4 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;