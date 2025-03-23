import React, { useState, useEffect } from 'react';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import PropertiesList from './pages/Properties/PropertiesList';
import TenantsList from './pages/Tenants/TenantsList';
import InvoicesList from './pages/Invoices/InvoicesList';
import FinanceOverview from './pages/Finance/FinanceOverview';
import AccountSettings from './pages/Settings/AccountSettings';
import ClientManagement from './pages/Clients/ClientsList';
import PropertyDetails from './pages/Properties/PropertyDetails';
import { generateData } from './utils/dataGenerator';

function AppDeveloper({ user, onLogout }) {
  const [darkMode, setDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [data, setData] = useState({
    apartments: [],
    invoices: [],
    monthlyIncomeData: [],
    rentalStatusData: [],
    costBreakdownData: [],
    paymentCalendar: [],
    activities: [],
    clients: []
  });
  
  // Stan dla widoku szczegółowego
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [viewingPropertyDetails, setViewingPropertyDetails] = useState(false);
  
  // Symulacja danych aktualizowanych na żywo
  useEffect(() => {
    setData(generateData());
    
    const interval = setInterval(() => {
      setData(generateData());
    }, 30000); // Aktualizacja danych co 30 sekund
    
    return () => clearInterval(interval);
  }, []);

  // Obsługa wyboru mieszkania do widoku szczegółowego
  const handlePropertySelect = (property) => {
    setSelectedProperty(property);
    setViewingPropertyDetails(true);
  };

  // Powrót z widoku szczegółowego do listy
  const handleBackToList = () => {
    setViewingPropertyDetails(false);
    setSelectedProperty(null);
  };

  // Renderowanie aktywnej zakładki
  const renderContent = () => {
    // Jeśli przeglądamy szczegóły mieszkania
    if (viewingPropertyDetails && selectedProperty) {
      return (
        <PropertyDetails 
          property={selectedProperty} 
          darkMode={darkMode}
          onBack={handleBackToList}
        />
      );
    }

    // W przeciwnym razie renderujemy odpowiednią zakładkę
    switch (activeTab) {
      case 'dashboard':
        return (
          <Dashboard 
            data={data} 
            darkMode={darkMode}
            setActiveTab={setActiveTab}
          />
        );
      case 'properties':
        return (
          <PropertiesList 
            data={data.apartments} 
            darkMode={darkMode}
            onPropertySelect={handlePropertySelect}
          />
        );
      case 'tenants':
        return <TenantsList data={data.apartments} darkMode={darkMode} />;
      case 'invoices':
        return <InvoicesList data={data.invoices} darkMode={darkMode} />;
      case 'finance':
        return <FinanceOverview data={data} darkMode={darkMode} />;
      case 'settings':
        return (
          <AccountSettings 
            darkMode={darkMode} 
            setDarkMode={setDarkMode}
            user={user}
            onLogout={onLogout}
          />
        );
      case 'clients':
        return <ClientManagement darkMode={darkMode} type="property" />;
      default:
        return <Dashboard data={data} darkMode={darkMode} />;
    }
  };

  return (
    <Layout 
      darkMode={darkMode} 
      setDarkMode={setDarkMode}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      data={data}
      user={user}
      onLogout={onLogout}
    >
      {renderContent()}
    </Layout>
  );
}

export default AppDeveloper;