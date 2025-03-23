import React, { useState } from 'react';
import ChimneyHeader from './ChimneyHeader';
import ChimneySidebar from './ChimneySidebar';

const ChimneyLayout = ({ 
  children, 
  darkMode, 
  setDarkMode, 
  activeTab, 
  setActiveTab, 
  data,
  user,
  onLogout
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  // Obliczanie nieprzeczytanych powiadomień
  const pendingInspections = data.inspections.filter(insp => insp.ceebStatus === 'Do zgłoszenia').length;

  return (
    <div className={`min-h-screen flex flex-col ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-800'}`}>
      <ChimneyHeader 
        darkMode={darkMode} 
        setDarkMode={setDarkMode}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        notificationCount={pendingInspections}
        user={user}
        onLogout={onLogout}
      />
      
      <div className="flex flex-1">
        <ChimneySidebar 
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

export default ChimneyLayout;