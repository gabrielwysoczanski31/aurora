import React, { useState, useEffect } from 'react';
import ChimneyLayout from './components/layout/ChimneyLayout';
import ChimneyDashboard from './pages/ChimneyDashboard';
import InspectionsList from './pages/Inspections/InspectionsList';
import CeebReportsList from './pages/Ceeb/CeebReportsList';
import ClientsList from './pages/Clients/ClientsList';
import BuildingsList from './pages/Buildings/BuildingsList';
import MapView from './pages/Map/MapView';
import ChimneySettings from './pages/Settings/ChimneySettings';
import { generateChimneyData } from './utils/chimneyDataGenerator';

function AppChimney({ user, onLogout }) {
  const [darkMode, setDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [data, setData] = useState({
    inspections: [],
    inspectionsByMonthData: [],
    inspectionsByTypeData: [],
    inspectionsByResultData: [],
    ceebStatusData: [],
    activities: [],
    clients: [],
    buildings: [],
    ceebReports: []
  });
  
  // Symulacja danych aktualizowanych na żywo
  useEffect(() => {
    setData(generateChimneyData());
    
    const interval = setInterval(() => {
      setData(generateChimneyData());
    }, 30000); // Aktualizacja danych co 30 sekund
    
    return () => clearInterval(interval);
  }, []);

  // Renderowanie aktywnej zakładki
  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <ChimneyDashboard data={data} darkMode={darkMode} />;
      case 'inspections':
        return <InspectionsList data={data.inspections} darkMode={darkMode} />;
      case 'ceeb':
        return <CeebReportsList data={data} darkMode={darkMode} />;
      case 'clients':
        return <ClientsList data={data.clients} darkMode={darkMode} />;
      case 'buildings':
        return <BuildingsList data={data.buildings} darkMode={darkMode} />;
      case 'map':
        return <MapView data={data.inspections} darkMode={darkMode} />;
      case 'settings':
        return <ChimneySettings darkMode={darkMode} setDarkMode={setDarkMode} user={user} onLogout={onLogout} />;
      default:
        return <ChimneyDashboard data={data} darkMode={darkMode} />;
    }
  };

  return (
    <ChimneyLayout 
      darkMode={darkMode} 
      setDarkMode={setDarkMode}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      data={data}
      user={user}
      onLogout={onLogout}
    >
      {renderContent()}
    </ChimneyLayout>
  );
}

export default AppChimney;