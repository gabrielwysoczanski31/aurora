import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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

function AppDeveloper({ user, onLogout, initialTab }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [darkMode, setDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState(initialTab || 'dashboard');
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
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [viewingPropertyDetails, setViewingPropertyDetails] = useState(false);
  
  // Handle tab changes through URL
  useEffect(() => {
    // Parse the current path to determine active tab
    const path = location.pathname.split('/').pop();
    if (path && ['dashboard', 'properties', 'tenants', 'invoices', 'finance', 'settings', 'clients'].includes(path)) {
      setActiveTab(path);
    }
  }, [location]);
  
  // Initial data load
  useEffect(() => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setData(generateData());
      setIsLoading(false);
    }, 1000);
  }, []);
  
  // Handle data refresh with less disruption
  useEffect(() => {
    const refreshInterval = setInterval(() => {
      // Only refresh if user isn't in the middle of viewing details
      if (!viewingPropertyDetails) {
        setIsRefreshing(true);
        // Get new data
        const newData = generateData();
        
        // Apply updates carefully to preserve selected items
        setData(prevData => {
          // If there's a selected property, ensure it remains in the updated data
          if (selectedProperty) {
            const updatedProperty = newData.apartments.find(p => p.id === selectedProperty.id);
            if (updatedProperty) {
              setSelectedProperty(updatedProperty);
            }
          }
          return newData;
        });
        
        setIsRefreshing(false);
      }
    }, 60000); // Less frequent updates - every minute
    
    return () => clearInterval(refreshInterval);
  }, [viewingPropertyDetails, selectedProperty]);
  
  // Tab change handler that updates URL
  const handleTabChange = useCallback((tab) => {
    setActiveTab(tab);
    navigate(`/developer/${tab}`);
  }, [navigate]);
  
  // Property selection handler
  const handlePropertySelect = (property) => {
    setSelectedProperty(property);
    setViewingPropertyDetails(true);
  };
  
  // Return from property details
  const handleBackToList = () => {
    setViewingPropertyDetails(false);
    setSelectedProperty(null);
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading data...</p>
        </div>
      </div>
    );
  }

  // Render active tab content
  const renderContent = () => {
    // If viewing property details
    if (viewingPropertyDetails && selectedProperty) {
      return (
        <PropertyDetails 
          property={selectedProperty} 
          darkMode={darkMode}
          onBack={handleBackToList}
        />
      );
    }

    // Regular tab content
    switch (activeTab) {
      case 'dashboard':
        return (
          <Dashboard 
            data={data} 
            darkMode={darkMode}
            setActiveTab={handleTabChange}
            isRefreshing={isRefreshing}
          />
        );
      case 'properties':
        return (
          <PropertiesList 
            data={data.apartments} 
            darkMode={darkMode}
            onPropertySelect={handlePropertySelect}
            isRefreshing={isRefreshing}
          />
        );
      case 'tenants':
        return <TenantsList data={data.apartments} darkMode={darkMode} isRefreshing={isRefreshing} />;
      case 'invoices':
        return <InvoicesList data={data.invoices} darkMode={darkMode} isRefreshing={isRefreshing} />;
      case 'finance':
        return <FinanceOverview data={data} darkMode={darkMode} isRefreshing={isRefreshing} />;
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
        return <ClientManagement darkMode={darkMode} type="property" isRefreshing={isRefreshing} />;
      default:
        return <Dashboard data={data} darkMode={darkMode} setActiveTab={handleTabChange} />;
    }
  };

  return (
    <Layout 
      darkMode={darkMode} 
      setDarkMode={setDarkMode}
      activeTab={activeTab}
      setActiveTab={handleTabChange}
      data={data}
      user={user}
      onLogout={onLogout}
    >
      {isRefreshing && (
        <div className="fixed top-4 right-4 bg-blue-100 text-blue-800 px-4 py-2 rounded-md shadow-md animate-pulse z-50">
          Refreshing data...
        </div>
      )}
      {renderContent()}
    </Layout>
  );
}

export default AppDeveloper;