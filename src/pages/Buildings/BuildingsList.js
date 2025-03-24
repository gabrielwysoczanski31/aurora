import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, Filter, Plus, Building, MapPin, Home, X, AlertTriangle, 
  FileText, Thermometer, BrainCircuit, Zap, Calendar, BarChart2, 
  CheckCircle, TrendingUp, ChevronDown, Cpu, Layers, AlertCircle,
  ArrowDown, Download
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import DataTable from '../../components/ui/DataTable';
import BuildingForm from './BuildingForm';

const BuildingsList = ({ data = [], darkMode, clients = [], isRefreshing }) => {
  // Stan wyszukiwania i filtrowania
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredBuildings, setFilteredBuildings] = useState(data || []);
  const [cityFilter, setCityFilter] = useState('all');
  const [heatingTypeFilter, setHeatingTypeFilter] = useState('all');
  const [lastInspectionFilter, setLastInspectionFilter] = useState('all');
  const [clientFilter, setClientFilter] = useState('all');
  const [yearBuiltFilter, setYearBuiltFilter] = useState({ min: '', max: '' });
  const [floorsFilter, setFloorsFilter] = useState({ min: '', max: '' });
  const [selectedBuildings, setSelectedBuildings] = useState([]);

  // Stan UI
  const [showAddForm, setShowAddForm] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [buildingToEdit, setBuildingToEdit] = useState(null);
  const [buildingToDelete, setBuildingToDelete] = useState(null);
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [showBuildingDetails, setShowBuildingDetails] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Stan AI
  const [showAIInsights, setShowAIInsights] = useState(false);
  const [aiLoading, setAILoading] = useState(false);
  const [aiInsights, setAIInsights] = useState([]);
  const [aiRecommendations, setAIRecommendations] = useState([]);
  const [buildingHealthScores, setBuildingHealthScores] = useState({});
  const [showAIRiskModal, setShowAIRiskModal] = useState(false);
  const [selectedRiskBuilding, setSelectedRiskBuilding] = useState(null);
  const [showAIRecommendations, setShowAIRecommendations] = useState(false);

  // Referencje
  const listRef = useRef(null);
  
  // Initialize filtered buildings whenever data changes
  useEffect(() => {
    setFilteredBuildings(data || []);
    checkMobileView();

    // Event listener for window resize
    window.addEventListener('resize', checkMobileView);
    return () => window.removeEventListener('resize', checkMobileView);
  }, [data]);

  // Check if we should use mobile view
  const checkMobileView = () => {
    setIsMobileView(window.innerWidth < 768);
  };
  
  // Comprehensive filtering function
  const handleFilter = () => {
    let filtered = [...data];
    
    // Filter by search term
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(building => 
        building.address.toLowerCase().includes(searchLower) ||
        building.city.toLowerCase().includes(searchLower) ||
        building.clientName.toLowerCase().includes(searchLower) ||
        (building.postalCode && building.postalCode.toLowerCase().includes(searchLower)) ||
        (building.heatingType && building.heatingType.toLowerCase().includes(searchLower))
      );
    }
    
    // Filter by client
    if (clientFilter !== 'all') {
      filtered = filtered.filter(building => building.clientId.toString() === clientFilter);
    }

    // Filter by city
    if (cityFilter !== 'all') {
      filtered = filtered.filter(building => building.city === cityFilter);
    }
    
    // Filter by heating type
    if (heatingTypeFilter !== 'all') {
      filtered = filtered.filter(building => building.heatingType === heatingTypeFilter);
    }
    
    // Filter by year built
    if (yearBuiltFilter.min) {
      filtered = filtered.filter(building => 
        building.yearBuilt && parseInt(building.yearBuilt) >= parseInt(yearBuiltFilter.min)
      );
    }
    
    if (yearBuiltFilter.max) {
      filtered = filtered.filter(building => 
        building.yearBuilt && parseInt(building.yearBuilt) <= parseInt(yearBuiltFilter.max)
      );
    }
    
    // Filter by number of floors
    if (floorsFilter.min) {
      filtered = filtered.filter(building => 
        building.floors && parseInt(building.floors) >= parseInt(floorsFilter.min)
      );
    }
    
    if (floorsFilter.max) {
      filtered = filtered.filter(building => 
        building.floors && parseInt(building.floors) <= parseInt(floorsFilter.max)
      );
    }
    
    // Filter by last inspection date
    if (lastInspectionFilter !== 'all') {
      const currentDate = new Date();
      const threeMonthsAgo = new Date();
      threeMonthsAgo.setMonth(currentDate.getMonth() - 3);
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(currentDate.getMonth() - 6);
      
      filtered = filtered.filter(building => {
        if (!building.lastInspection) return false;
        
        // Convert date string to Date object (assuming format DD.MM.YYYY)
        const parts = building.lastInspection.split('.');
        const inspectionDate = new Date(parts[2], parts[1] - 1, parts[0]);
        
        if (lastInspectionFilter === 'recent') {
          return inspectionDate >= threeMonthsAgo;
        } else if (lastInspectionFilter === 'medium') {
          return inspectionDate >= sixMonthsAgo && inspectionDate < threeMonthsAgo;
        } else if (lastInspectionFilter === 'old') {
          return inspectionDate < sixMonthsAgo;
        }
        
        return true;
      });
    }
    
    setFilteredBuildings(filtered);
    
    // Update selected buildings - remove ones that are no longer in the filtered list
    setSelectedBuildings(prev => prev.filter(id => 
      filtered.some(building => building.id === id)
    ));
  };
  
  // Run filtering whenever any filter changes
  useEffect(() => {
    handleFilter();
  }, [searchTerm, cityFilter, heatingTypeFilter, lastInspectionFilter, clientFilter, yearBuiltFilter, floorsFilter, data]);
  
  // Reset all filters
  const resetFilters = () => {
    setSearchTerm('');
    setCityFilter('all');
    setHeatingTypeFilter('all');
    setLastInspectionFilter('all');
    setClientFilter('all');
    setYearBuiltFilter({ min: '', max: '' });
    setFloorsFilter({ min: '', max: '' });
  };
  
  // Handle building add form display
  const handleAddBuilding = () => {
    setBuildingToEdit(null);
    setShowAddForm(true);
  };
  
  // Handle building edit
  const handleEditBuilding = (buildingId) => {
    const building = data.find(b => b.id === buildingId);
    if (building) {
      setBuildingToEdit(building);
      setShowAddForm(true);
    }
  };
  
  // Handle form submission (both for adding and editing)
  const handleFormSubmit = (buildingData) => {
    console.log('Form submitted with data:', buildingData);
    
    if (buildingToEdit) {
      // Simulating update in the frontend
      alert(`Budynek "${buildingData.address}" został zaktualizowany.`);
    } else {
      // Simulating add in the frontend
      alert(`Dodano nowy budynek "${buildingData.address}".`);
    }
    
    // Close the form
    setShowAddForm(false);
    setBuildingToEdit(null);
  };
  
  // Handle building delete
  const handleDeleteClick = (buildingId) => {
    const building = data.find(b => b.id === buildingId);
    if (building) {
      setBuildingToDelete(building);
      setShowDeleteModal(true);
    }
  };
  
  // Confirm building delete
  const handleConfirmDelete = () => {
    if (buildingToDelete) {
      // In a real app, this would call an API to delete the building
      console.log(`Usuwanie budynku: ${buildingToDelete.address}`);
      alert(`Budynek ${buildingToDelete.address} został usunięty.`);
      setShowDeleteModal(false);
      setBuildingToDelete(null);
    }
  };
  
  // Handle building details view
  const handleViewDetails = (buildingId) => {
    const building = data.find(b => b.id === buildingId);
    if (building) {
      setSelectedBuilding(building);
      setShowBuildingDetails(true);
    }
  };
  
  // Handle inspection history view
  const handleViewInspections = (buildingId) => {
    const building = data.find(b => b.id === buildingId);
    if (building) {
      // In a real app, this would navigate to inspections filtered by this building
      console.log('Historia kontroli budynku:', building);
      alert(`Przejście do historii kontroli budynku: ${building.address}`);
    }
  };

  // Handle building selection
  const handleBuildingSelect = (buildingId) => {
    setSelectedBuildings(prev => {
      if (prev.includes(buildingId)) {
        return prev.filter(id => id !== buildingId);
      } else {
        return [...prev, buildingId];
      }
    });
  };

  // Handle select all buildings
  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedBuildings(filteredBuildings.map(building => building.id));
    } else {
      setSelectedBuildings([]);
    }
  };

  // Handle export buildings
  const handleExportBuildings = () => {
    if (selectedBuildings.length === 0) {
      alert('Wybierz co najmniej jeden budynek do eksportu.');
      return;
    }

    setIsExporting(true);

    // Simulate export process
    setTimeout(() => {
      // Get selected buildings data
      const selectedBuildingsData = data.filter(building => 
        selectedBuildings.includes(building.id)
      );

      // Create CSV content
      let csvContent = 'data:text/csv;charset=utf-8,';
      
      // Add header
      csvContent += 'ID,Adres,Miasto,Kod pocztowy,Klient,Typ ogrzewania,Ostatnia kontrola,Rok budowy,Piętra,Mieszkania\n';
      
      // Add data rows
      selectedBuildingsData.forEach(building => {
        csvContent += `${building.id},"${building.address}","${building.city}","${building.postalCode}","${building.clientName}","${building.heatingType}","${building.lastInspection || ''}","${building.yearBuilt || ''}","${building.floors || ''}","${building.apartments || ''}"\n`;
      });
      
      // Create download link
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', 'budynki_export.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setIsExporting(false);
      alert(`Wyeksportowano ${selectedBuildings.length} budynków.`);
    }, 1500);
  };

  // AI functionality
  
  // Generate AI insights
  const generateAIInsights = () => {
    setAILoading(true);
    setShowAIInsights(true);
    
    // Simulate AI processing
    setTimeout(() => {
      // Generate building health scores
      const healthScores = {};
      
      data.forEach(building => {
        // Base score starts at 100
        let score = 100;
        
        // Calculate building age
        const currentYear = new Date().getFullYear();
        const buildingAge = building.yearBuilt ? currentYear - building.yearBuilt : 50;
        
        // Reduce score based on building age
        if (buildingAge > 50) {
          score -= 20;
        } else if (buildingAge > 30) {
          score -= 10;
        } else if (buildingAge > 15) {
          score -= 5;
        }
        
        // Check last inspection date
        if (building.lastInspection) {
          const parts = building.lastInspection.split('.');
          const inspectionDate = new Date(parts[2], parts[1] - 1, parts[0]);
          const currentDate = new Date();
          const monthsSinceInspection = (currentDate - inspectionDate) / (1000 * 60 * 60 * 24 * 30);
          
          // Reduce score based on time since last inspection
          if (monthsSinceInspection > 12) {
            score -= 25;
          } else if (monthsSinceInspection > 6) {
            score -= 10;
          } else if (monthsSinceInspection > 3) {
            score -= 5;
          }
        } else {
          // Significant penalty for no inspection data
          score -= 30;
        }
        
        // Factor in heating type risk
        if (building.heatingType === 'Węglowe') {
          score -= 15;
        } else if (building.heatingType === 'Olejowe') {
          score -= 10;
        } else if (building.heatingType === 'Gazowe') {
          score -= 5;
        }
        
        // Ensure score doesn't go below 0
        score = Math.max(0, score);
        
        // Save score
        healthScores[building.id] = score;
      });
      
      setBuildingHealthScores(healthScores);
      
      // Generate insights
      const insights = [];
      
      // Insight on buildings requiring inspection
      const buildingsNeedingInspection = data.filter(building => {
        if (!building.lastInspection) return true;
        
        const parts = building.lastInspection.split('.');
        const inspectionDate = new Date(parts[2], parts[1] - 1, parts[0]);
        const currentDate = new Date();
        const monthsSinceInspection = (currentDate - inspectionDate) / (1000 * 60 * 60 * 24 * 30);
        
        return monthsSinceInspection > 6;
      });
      
      if (buildingsNeedingInspection.length > 0) {
        insights.push({
          type: 'warning',
          title: 'Budynki wymagające kontroli',
          description: `${buildingsNeedingInspection.length} budynków nie miało kontroli od ponad 6 miesięcy.`,
          icon: <Calendar size={16} className="text-yellow-500" />
        });
      }
      
      // Insight on building types
      const heatingTypeCounts = {};
      data.forEach(building => {
        if (building.heatingType) {
          heatingTypeCounts[building.heatingType] = (heatingTypeCounts[building.heatingType] || 0) + 1;
        }
      });
      
      const mostCommonHeatingType = Object.entries(heatingTypeCounts)
        .sort((a, b) => b[1] - a[1])
        .shift();
      
      if (mostCommonHeatingType) {
        insights.push({
          type: 'info',
          title: 'Analiza ogrzewania',
          description: `Najpopularniejszy typ ogrzewania to "${mostCommonHeatingType[0]}" (${mostCommonHeatingType[1]} budynków, ${Math.round(mostCommonHeatingType[1] / data.length * 100)}% całości).`,
          icon: <Thermometer size={16} className="text-blue-500" />
        });
      }
      
      // Insight on building age
      const buildingAges = data
        .filter(building => building.yearBuilt)
        .map(building => new Date().getFullYear() - building.yearBuilt);
      
      if (buildingAges.length > 0) {
        const averageAge = Math.round(buildingAges.reduce((sum, age) => sum + age, 0) / buildingAges.length);
        insights.push({
          type: 'info',
          title: 'Wiek budynków',
          description: `Średni wiek budynków w Twojej bazie to ${averageAge} lat.`,
          icon: <Building size={16} className="text-purple-500" />
        });
      }
      
      // At-risk buildings
      const atRiskBuildings = Object.entries(healthScores)
        .filter(([_, score]) => score < 60)
        .map(([id]) => data.find(building => building.id.toString() === id))
        .filter(Boolean)
        .sort((a, b) => healthScores[a.id] - healthScores[b.id]);
      
      if (atRiskBuildings.length > 0) {
        insights.push({
          type: 'warning',
          title: 'Budynki wysokiego ryzyka',
          description: `Wykryto ${atRiskBuildings.length} budynków o podwyższonym ryzyku wymagających uwagi.`,
          icon: <AlertTriangle size={16} className="text-red-500" />,
          action: 'Pokaż szczegóły',
          handler: () => {
            setSelectedRiskBuilding(atRiskBuildings[0]);
            setShowAIRiskModal(true);
          }
        });
      }
      
      setAIInsights(insights);
      
      // Generate recommendations
      const recommendations = [];
      
      // Recommendation for inspection scheduling
      if (buildingsNeedingInspection.length > 0) {
        recommendations.push({
          title: 'Zaplanuj kontrole',
          description: `Zaplanuj kontrole dla ${buildingsNeedingInspection.length} budynków, które nie miały kontroli od ponad 6 miesięcy.`,
          icon: <Calendar size={16} className="text-green-500" />,
          action: 'Zaplanuj',
          buildings: buildingsNeedingInspection
        });
      }
      
      // Recommendation for building maintenance
      if (atRiskBuildings.length > 0) {
        recommendations.push({
          title: 'Przegląd budynków wysokiego ryzyka',
          description: `Przeprowadź dodatkowy przegląd dla ${atRiskBuildings.length} budynków o podwyższonym ryzyku.`,
          icon: <AlertCircle size={16} className="text-red-500" />,
          action: 'Oznacz',
          buildings: atRiskBuildings
        });
      }
      
      // Find coal-heated buildings for potential modernization
      const coalHeatedBuildings = data.filter(building => building.heatingType === 'Węglowe');
      if (coalHeatedBuildings.length > 0) {
        recommendations.push({
          title: 'Modernizacja ogrzewania',
          description: `Rozważ modernizację ${coalHeatedBuildings.length} budynków z ogrzewaniem węglowym na bardziej ekologiczne.`,
          icon: <Zap size={16} className="text-yellow-500" />,
          action: 'Zobacz budynki',
          buildings: coalHeatedBuildings
        });
      }
      
      setAIRecommendations(recommendations);
      setAILoading(false);
    }, 2000);
  };

  // Handle building health score coloring
  const getHealthScoreColor = (score) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  // Handle building health score bg coloring
  const getHealthScoreBgColor = (score) => {
    if (score >= 80) return 'bg-green-100 dark:bg-green-900 dark:bg-opacity-30';
    if (score >= 60) return 'bg-yellow-100 dark:bg-yellow-900 dark:bg-opacity-30';
    return 'bg-red-100 dark:bg-red-900 dark:bg-opacity-30';
  };

  // Render a mobile card for buildings
  const renderBuildingCard = (building) => (
    <div 
      key={building.id}
      className={`p-4 rounded-lg shadow mb-4 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
      onClick={() => handleViewDetails(building.id)}
    >
      <div className="flex justify-between">
        <div className="flex-1">
          <div className="flex items-center">
            <Home size={16} className="mr-2 text-red-500" />
            <h3 className="font-semibold">{building.address}</h3>
          </div>
          <p className="text-sm text-gray-500">{building.city}, {building.postalCode}</p>
          <p className="text-sm">{building.clientName}</p>
        </div>
        
        {showAIInsights && buildingHealthScores[building.id] !== undefined && (
          <div className={`${getHealthScoreBgColor(buildingHealthScores[building.id])} p-2 rounded-lg ml-2`}>
            <span className={`font-bold ${getHealthScoreColor(buildingHealthScores[building.id])}`}>
              {buildingHealthScores[building.id]}
            </span>
          </div>
        )}
      </div>
      
      <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
        <div>
          <span className="text-gray-500">Ogrzewanie:</span> {building.heatingType}
        </div>
        <div>
          <span className="text-gray-500">Ostatnia kontrola:</span> {building.lastInspection || 'Brak'}
        </div>
      </div>
      
      <div className="mt-3 pt-3 border-t dark:border-gray-700 flex justify-between">
        <Button 
          variant="link" 
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            handleEditBuilding(building.id);
          }}
        >
          Edytuj
        </Button>
        <Button 
          variant="link" 
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            handleViewInspections(building.id);
          }}
        >
          Historia
        </Button>
        <Button 
          variant="link" 
          size="sm"
          className="text-red-500"
          onClick={(e) => {
            e.stopPropagation();
            handleDeleteClick(building.id);
          }}
        >
          Usuń
        </Button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6" ref={listRef}>
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Budynki</h2>
        <div className="flex space-x-2">
          <Button 
            color="red" 
            className="flex items-center"
            onClick={handleAddBuilding}
          >
            <Plus size={16} className="mr-2" />
            Dodaj budynek
          </Button>
          
          {data.length > 0 && (
            <Button
              variant={showAIInsights ? "outline" : "primary"}
              className="flex items-center"
              color="red"
              onClick={() => {
                if (showAIInsights) {
                  setShowAIInsights(false);
                } else {
                  generateAIInsights();
                }
              }}
            >
              <BrainCircuit size={16} className="mr-2" />
              {showAIInsights ? 'Ukryj AI' : 'Analiza AI'}
            </Button>
          )}
        </div>
      </div>
      
      {/* Building form */}
      {showAddForm && (
        <Card darkMode={darkMode}>
          <BuildingForm 
            building={buildingToEdit} 
            onSubmit={handleFormSubmit} 
            onCancel={() => {
              setShowAddForm(false);
              setBuildingToEdit(null);
            }}
            darkMode={darkMode}
            clients={clients}
          />
        </Card>
      )}
      
      {/* AI Insights Panel */}
      {showAIInsights && (
        <Card darkMode={darkMode} className="border-l-4 border-red-500">
          <div className="flex justify-between items-start">
            <div className="flex items-center">
              <BrainCircuit size={20} className="mr-2 text-red-500" />
              <h3 className="font-semibold">Inteligentna analiza budynków</h3>
            </div>
            <Button 
              variant="link" 
              size="sm"
              onClick={() => setShowAIInsights(false)}
            >
              Ukryj
            </Button>
          </div>
          
          {aiLoading ? (
            <div className="flex items-center justify-center p-6">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
              <span className="ml-2">Analizowanie danych...</span>
            </div>
          ) : (
            <div className="mt-4 space-y-4">
              {/* Main insights cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {aiInsights.map((insight, index) => (
                  <div 
                    key={index} 
                    className={`p-3 rounded-lg ${
                      insight.type === 'warning' 
                        ? 'bg-red-50 dark:bg-red-900 dark:bg-opacity-30 border-l-4 border-red-500' 
                        : 'bg-blue-50 dark:bg-blue-900 dark:bg-opacity-30'
                    } flex items-start`}
                  >
                    {insight.icon}
                    <div className="ml-2 flex-1">
                      <h4 className="font-medium">{insight.title}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{insight.description}</p>
                    </div>
                    {insight.action && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={insight.handler}
                      >
                        {insight.action}
                      </Button>
                    )}
                  </div>
                ))}
              </div>
              
              {/* Building health summary */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium flex items-center">
                    <Cpu size={16} className="mr-2 text-purple-500" />
                    Ocena stanu budynków
                  </h4>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center"
                    onClick={() => setShowAIRecommendations(!showAIRecommendations)}
                  >
                    {showAIRecommendations ? 'Ukryj rekomendacje' : 'Pokaż rekomendacje'}
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="md:col-span-3 grid grid-cols-3 gap-4">
                    <div className="p-3 bg-green-100 dark:bg-green-900 dark:bg-opacity-30 rounded-lg text-center">
                      <h5 className="text-sm text-gray-700 dark:text-gray-300">Dobry stan</h5>
                      <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {Object.values(buildingHealthScores).filter(score => score >= 80).length}
                      </p>
                      <p className="text-xs text-gray-500">budynków</p>
                    </div>
                    
                    <div className="p-3 bg-yellow-100 dark:bg-yellow-900 dark:bg-opacity-30 rounded-lg text-center">
                      <h5 className="text-sm text-gray-700 dark:text-gray-300">Wymaga uwagi</h5>
                      <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                        {Object.values(buildingHealthScores).filter(score => score >= 60 && score < 80).length}
                      </p>
                      <p className="text-xs text-gray-500">budynków</p>
                    </div>
                    
                    <div className="p-3 bg-red-100 dark:bg-red-900 dark:bg-opacity-30 rounded-lg text-center">
                      <h5 className="text-sm text-gray-700 dark:text-gray-300">Wysokie ryzyko</h5>
                      <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                        {Object.values(buildingHealthScores).filter(score => score < 60).length}
                      </p>
                      <p className="text-xs text-gray-500">budynków</p>
                    </div>
                  </div>
                  
                  <div className="p-3 bg-blue-50 dark:bg-blue-900 dark:bg-opacity-20 rounded-lg flex flex-col justify-center items-center">
                    <h5 className="text-sm text-gray-700 dark:text-gray-300">Średnia ocena</h5>
                    <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                      {Object.values(buildingHealthScores).length > 0 
                        ? Math.round(Object.values(buildingHealthScores).reduce((sum, score) => sum + score, 0) / Object.values(buildingHealthScores).length)
                        : 'N/A'
                      }
                    </p>
                    <p className="text-xs text-gray-500">na 100 punktów</p>
                  </div>
                </div>
              </div>
              
              {/* AI Recommendations */}
              {showAIRecommendations && aiRecommendations.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-medium mb-2 flex items-center">
                    <Zap size={16} className="mr-2 text-yellow-500" />
                    Rekomendacje
                  </h4>
                  
                  <div className="space-y-3">
                    {aiRecommendations.map((recommendation, index) => (
                      <div 
                        key={index} 
                        className="p-3 rounded-lg border dark:border-gray-700 flex items-start justify-between"
                      >
                        <div className="flex items-start">
                          {recommendation.icon}
                          <div className="ml-2">
                            <h5 className="font-medium">{recommendation.title}</h5>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{recommendation.description}</p>
                            <div className="mt-1 flex space-x-1">
                              {recommendation.buildings.slice(0, 3).map(building => (
                                <span 
                                  key={building.id}
                                  className="px-2 py-0.5 bg-gray-200 dark:bg-gray-700 rounded-full text-xs"
                                >
                                  {building.address.substring(0, 15)}{building.address.length > 15 ? '...' : ''}
                                </span>
                              ))}
                              {recommendation.buildings.length > 3 && (
                                <span className="px-2 py-0.5 bg-gray-200 dark:bg-gray-700 rounded-full text-xs">
                                  +{recommendation.buildings.length - 3} więcej
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="ml-2 whitespace-nowrap"
                          onClick={() => {
                            // Select all buildings in this recommendation
                            setSelectedBuildings(recommendation.buildings.map(b => b.id));
                            
                            // Scroll to the list
                            listRef.current?.scrollIntoView({ behavior: 'smooth' });
                            
                            // Alert that buildings have been selected
                            alert(`Zaznaczono ${recommendation.buildings.length} budynków zgodnie z rekomendacją.`);
                          }}
                        >
                          {recommendation.action}
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Footnote */}
              <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <p className="text-sm">
                  <TrendingUp size={16} className="inline-block mr-1 text-green-500" />
                  <strong>AI Insight:</strong> Regularne kontrole i konserwacja budynków mogą znacząco przedłużyć ich żywotność i zmniejszyć koszty utrzymania w dłuższej perspektywie.
                </p>
              </div>
            </div>
          )}
        </Card>
      )}
      
      {/* Search and filters card */}
      <Card darkMode={darkMode} className="mb-6">
        <div className="flex flex-col md:flex-row md:space-x-2 space-y-2 md:space-y-0">
          {/* Search input */}
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Szukaj budynku..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`pl-9 pr-3 py-2 border rounded-lg w-full ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
            />
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                <X size={16} />
              </button>
            )}
          </div>
          
          {/* Filter buttons */}
          <div className="flex space-x-2">
            <Button 
              variant={showAdvancedFilters ? 'primary' : 'outline'} 
              className="flex items-center"
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              color="red"
            >
              <Filter size={16} className="mr-1" />
              <span>Filtry</span>
              <ChevronDown size={16} className="ml-1" />
            </Button>
            
            {selectedBuildings.length > 0 && (
              <Button
                variant="outline"
                color="red"
                className="flex items-center"
                onClick={handleExportBuildings}
                disabled={isExporting}
              >
                <Download size={16} className="mr-1" />
                {isExporting ? 'Eksportowanie...' : 'Eksportuj'}
              </Button>
            )}
            
            {Object.entries({
              searchTerm,
              cityFilter: cityFilter !== 'all' ? cityFilter : null,
              heatingTypeFilter: heatingTypeFilter !== 'all' ? heatingTypeFilter : null,
              lastInspectionFilter: lastInspectionFilter !== 'all' ? lastInspectionFilter : null,
              clientFilter: clientFilter !== 'all' ? clientFilter : null,
              yearBuiltFilter: (yearBuiltFilter.min || yearBuiltFilter.max) ? yearBuiltFilter : null,
              floorsFilter: (floorsFilter.min || floorsFilter.max) ? floorsFilter : null
            }).filter(([_, value]) => value !== null && value !== '').length > 0 && (
              <Button 
                variant="outline" 
                className="flex items-center"
                onClick={resetFilters}
              >
                <X size={16} className="mr-1" />
                <span className="hidden lg:inline">Wyczyść</span>
              </Button>
            )}
          </div>
        </div>
        
        {/* Advanced filters */}
        {showAdvancedFilters && (
          <div className="mt-4 pt-4 border-t dark:border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-gray-500 mb-1">Miasto</label>
                <div className="relative">
                  <select
                    value={cityFilter}
                    onChange={(e) => setCityFilter(e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                  >
                    <option value="all">Wszystkie miasta</option>
                    <option value="Warszawa">Warszawa</option>
                    <option value="Kraków">Kraków</option>
                    <option value="Poznań">Poznań</option>
                    <option value="Wrocław">Wrocław</option>
                    <option value="Gdańsk">Gdańsk</option>
                    <option value="Katowice">Katowice</option>
                    <option value="Łódź">Łódź</option>
                  </select>
                  <MapPin size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none" />
                </div>
              </div>
              
              <div>
                <label className="block text-gray-500 mb-1">Rodzaj ogrzewania</label>
                <div className="relative">
                  <select
                    value={heatingTypeFilter}
                    onChange={(e) => setHeatingTypeFilter(e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                  >
                    <option value="all">Wszystkie rodzaje</option>
                    <option value="Gazowe">Gazowe</option>
                    <option value="Elektryczne">Elektryczne</option>
                    <option value="Węglowe">Węglowe</option>
                    <option value="Olejowe">Olejowe</option>
                    <option value="Kominkowe">Kominkowe</option>
                  </select>
                  <Thermometer size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none" />
                </div>
              </div>
              
              <div>
                <label className="block text-gray-500 mb-1">Ostatnia kontrola</label>
                <div className="relative">
                  <select
                    value={lastInspectionFilter}
                    onChange={(e) => setLastInspectionFilter(e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                  >
                    <option value="all">Wszystkie daty</option>
                    <option value="recent">Ostatnie 3 miesiące</option>
                    <option value="medium">3-6 miesięcy temu</option>
                    <option value="old">Ponad 6 miesięcy temu</option>
                  </select>
                  <FileText size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none" />
                </div>
              </div>
              
              <div>
                <label className="block text-gray-500 mb-1">Klient</label>
                <div className="relative">
                  <select
                    value={clientFilter}
                    onChange={(e) => setClientFilter(e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                  >
                    <option value="all">Wszyscy klienci</option>
                    {clients.map(client => (
                      <option key={client.id} value={client.id.toString()}>{client.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-gray-500 mb-1">Rok budowy</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    placeholder="Od"
                    value={yearBuiltFilter.min}
                    onChange={(e) => setYearBuiltFilter(prev => ({ ...prev, min: e.target.value }))}
                    className={`w-full px-3 py-2 border rounded-lg ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                    min="1800"
                    max={new Date().getFullYear()}
                  />
                  <input
                    type="number"
                    placeholder="Do"
                    value={yearBuiltFilter.max}
                    onChange={(e) => setYearBuiltFilter(prev => ({ ...prev, max: e.target.value }))}
                    className={`w-full px-3 py-2 border rounded-lg ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                    min="1800"
                    max={new Date().getFullYear()}
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-gray-500 mb-1">Liczba pięter</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    placeholder="Od"
                    value={floorsFilter.min}
                    onChange={(e) => setFloorsFilter(prev => ({ ...prev, min: e.target.value }))}
                    className={`w-full px-3 py-2 border rounded-lg ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                    min="1"
                  />
                  <input
                    type="number"
                    placeholder="Do"
                    value={floorsFilter.max}
                    onChange={(e) => setFloorsFilter(prev => ({ ...prev, max: e.target.value }))}
                    className={`w-full px-3 py-2 border rounded-lg ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                    min="1"
                  />
                </div>
              </div>
            </div>
            
            <div className="mt-4 flex justify-end space-x-2">
              <Button 
                variant="secondary" 
                size="sm"
                onClick={resetFilters}
              >
                Wyczyść filtry
              </Button>
              
              <Button 
                size="sm"
                onClick={handleFilter}
                color="red"
              >
                Zastosuj
              </Button>
            </div>
          </div>
        )}
        
        {/* Active filters display */}
        {(cityFilter !== 'all' || heatingTypeFilter !== 'all' || lastInspectionFilter !== 'all' || clientFilter !== 'all' || yearBuiltFilter.min || yearBuiltFilter.max || floorsFilter.min || floorsFilter.max) && (
          <div className="mt-4 flex flex-wrap gap-2">
            {cityFilter !== 'all' && (
              <div className={`flex items-center px-2 py-1 rounded-full text-sm ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                <span>Miasto: {cityFilter}</span>
                <button
                  onClick={() => setCityFilter('all')}
                  className="ml-1 text-gray-500 hover:text-gray-700"
                >
                  <X size={14} />
                </button>
              </div>
            )}
            
            {heatingTypeFilter !== 'all' && (
              <div className={`flex items-center px-2 py-1 rounded-full text-sm ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                <span>Ogrzewanie: {heatingTypeFilter}</span>
                <button
                  onClick={() => setHeatingTypeFilter('all')}
                  className="ml-1 text-gray-500 hover:text-gray-700"
                >
                  <X size={14} />
                </button>
              </div>
            )}
            
            {lastInspectionFilter !== 'all' && (
              <div className={`flex items-center px-2 py-1 rounded-full text-sm ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                <span>Kontrola: {
                  lastInspectionFilter === 'recent' ? 'Ostatnie 3 miesiące' :
                  lastInspectionFilter === 'medium' ? '3-6 miesięcy temu' :
                  'Ponad 6 miesięcy temu'
                }</span>
                <button
                  onClick={() => setLastInspectionFilter('all')}
                  className="ml-1 text-gray-500 hover:text-gray-700"
                >
                  <X size={14} />
                </button>
              </div>
            )}
            
            {clientFilter !== 'all' && (
              <div className={`flex items-center px-2 py-1 rounded-full text-sm ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                <span>Klient: {clients.find(c => c.id.toString() === clientFilter)?.name || clientFilter}</span>
                <button
                  onClick={() => setClientFilter('all')}
                  className="ml-1 text-gray-500 hover:text-gray-700"
                >
                  <X size={14} />
                </button>
              </div>
            )}
            
            {yearBuiltFilter.min && (
              <div className={`flex items-center px-2 py-1 rounded-full text-sm ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                <span>Rok budowy od: {yearBuiltFilter.min}</span>
                <button
                  onClick={() => setYearBuiltFilter(prev => ({ ...prev, min: '' }))}
                  className="ml-1 text-gray-500 hover:text-gray-700"
                >
                  <X size={14} />
                </button>
              </div>
            )}
            
            {yearBuiltFilter.max && (
              <div className={`flex items-center px-2 py-1 rounded-full text-sm ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                <span>Rok budowy do: {yearBuiltFilter.max}</span>
                <button
                  onClick={() => setYearBuiltFilter(prev => ({ ...prev, max: '' }))}
                  className="ml-1 text-gray-500 hover:text-gray-700"
                >
                  <X size={14} />
                </button>
              </div>
            )}
            
            {floorsFilter.min && (
              <div className={`flex items-center px-2 py-1 rounded-full text-sm ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                <span>Piętra od: {floorsFilter.min}</span>
                <button
                  onClick={() => setFloorsFilter(prev => ({ ...prev, min: '' }))}
                  className="ml-1 text-gray-500 hover:text-gray-700"
                >
                  <X size={14} />
                </button>
              </div>
            )}
            
            {floorsFilter.max && (
              <div className={`flex items-center px-2 py-1 rounded-full text-sm ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                <span>Piętra do: {floorsFilter.max}</span>
                <button
                  onClick={() => setFloorsFilter(prev => ({ ...prev, max: '' }))}
                  className="ml-1 text-gray-500 hover:text-gray-700"
                >
                  <X size={14} />
                </button>
              </div>
            )}
          </div>
        )}

        {/* Selection control section */}
        {selectedBuildings.length > 0 && (
          <div className="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800 dark:bg-yellow-900 dark:border-yellow-500 dark:text-yellow-100 flex justify-between items-center">
            <div className="flex items-center">
              <AlertCircle size={18} className="mr-2 flex-shrink-0" />
              <p>Wybrano {selectedBuildings.length} {selectedBuildings.length === 1 ? 'budynek' : selectedBuildings.length < 5 ? 'budynki' : 'budynków'}</p>
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                color="yellow"
                className="flex items-center"
                onClick={handleExportBuildings}
                disabled={isExporting}
              >
                <Download size={14} className="mr-1" />
                {isExporting ? 'Eksportowanie...' : 'Eksportuj'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedBuildings([])}
              >
                <X size={14} className="mr-1" />
                Wyczyść zaznaczenie
              </Button>
            </div>
          </div>
        )}
      </Card>
      
      {/* Data display - responsive handling */}
      {isMobileView ? (
        /* Mobile view uses cards */
        <div className="space-y-4">
          {filteredBuildings.map(renderBuildingCard)}
          
          {filteredBuildings.length === 0 && (
            <div className="text-center py-8">
              <Building size={48} className="mx-auto mb-4 text-gray-400" />
              <p className="text-gray-500">Nie znaleziono budynków spełniających kryteria</p>
            </div>
          )}
        </div>
      ) : (
        /* Desktop view uses table */
        <Card darkMode={darkMode}>
          <div className="overflow-x-auto">
            <table className="min-w-full data-table chimney">
              <thead>
                <tr className={darkMode ? 'border-b border-gray-700' : 'border-b'}>
                  <th className="py-2 text-left">
                    <div className="flex items-center">
                      <input 
                        type="checkbox" 
                        onChange={handleSelectAll}
                        checked={selectedBuildings.length === filteredBuildings.length && filteredBuildings.length > 0}
                        className="mr-2"
                      />
                      <span>ID</span>
                    </div>
                  </th>
                  <th className="py-2 text-left">Adres</th>
                  <th className="py-2 text-left">Miasto</th>
                  <th className="py-2 text-left">Kod pocztowy</th>
                  <th className="py-2 text-left">Klient</th>
                  <th className="py-2 text-left">Rodzaj ogrzewania</th>
                  <th className="py-2 text-left">Ostatnia kontrola</th>
                  {showAIInsights && <th className="py-2 text-center">Ocena AI</th>}
                  <th className="py-2 text-left">Akcje</th>
                </tr>
              </thead>
              <tbody>
                {filteredBuildings.map((building) => (
                  <tr 
                    key={building.id} 
                    className={`${darkMode ? 'border-b border-gray-700' : 'border-b'} cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700`}
                    onClick={() => handleViewDetails(building.id)}
                  >
                    <td className="py-2">
                      <div className="flex items-center">
                        <input 
                          type="checkbox" 
                          checked={selectedBuildings.includes(building.id)}
                          onChange={() => handleBuildingSelect(building.id)}
                          onClick={(e) => e.stopPropagation()}
                          className="mr-2"
                        />
                        {building.id}
                      </div>
                    </td>
                    <td className="py-2">
                      <div className="flex items-center">
                        <Home size={16} className="mr-2 text-red-500" />
                        {building.address}
                      </div>
                    </td>
                    <td className="py-2">{building.city}</td>
                    <td className="py-2">{building.postalCode}</td>
                    <td className="py-2">{building.clientName}</td>
                    <td className="py-2">
                      <div className="flex items-center">
                        <Thermometer size={16} className="mr-2 text-orange-500" />
                        {building.heatingType}
                      </div>
                    </td>
                    <td className="py-2">
                      {building.lastInspection ? (
                        <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                          {building.lastInspection}
                        </span>
                      ) : (
                        <span className="px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100">
                          Brak danych
                        </span>
                      )}
                    </td>
                    {showAIInsights && (
                      <td className="py-2 text-center">
                        {buildingHealthScores[building.id] !== undefined ? (
                          <div className={`inline-block px-3 py-1 rounded-full ${getHealthScoreBgColor(buildingHealthScores[building.id])}`}>
                            <span className={`font-bold ${getHealthScoreColor(buildingHealthScores[building.id])}`}>
                              {buildingHealthScores[building.id]}
                            </span>
                          </div>
                        ) : (
                          <span className="text-gray-500">-</span>
                        )}
                      </td>
                    )}
                    <td className="py-2">
                      <div className="flex space-x-2">
                        <Button 
                          variant="link"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditBuilding(building.id);
                          }}
                        >
                          Edytuj
                        </Button>
                        <Button 
                          variant="link"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewInspections(building.id);
                          }}
                        >
                          Historia
                        </Button>
                        <Button 
                          variant="link"
                          className="text-red-500"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteClick(building.id);
                          }}
                        >
                          Usuń
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredBuildings.length === 0 && (
            <div className="text-center py-8">
              <Building size={48} className="mx-auto mb-4 text-gray-400" />
              <p className="text-gray-500">Nie znaleziono budynków spełniających kryteria</p>
            </div>
          )}
        </Card>
      )}
      
      {/* Building Details Modal */}
      {showBuildingDetails && selectedBuilding && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className={`max-w-3xl w-full ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-xl overflow-hidden`}>
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center">
                  <Building size={24} className="mr-2 text-red-500" />
                  <h3 className="text-xl font-semibold">{selectedBuilding.address}</h3>
                </div>
                <button
                  onClick={() => setShowBuildingDetails(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={24} />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3">Informacje ogólne</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Miasto:</span>
                      <span>{selectedBuilding.city}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Kod pocztowy:</span>
                      <span>{selectedBuilding.postalCode}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Klient:</span>
                      <span>{selectedBuilding.clientName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Rodzaj ogrzewania:</span>
                      <span>{selectedBuilding.heatingType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Rok budowy:</span>
                      <span>{selectedBuilding.yearBuilt || 'Brak danych'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Liczba pięter:</span>
                      <span>{selectedBuilding.floors || 'Brak danych'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Liczba mieszkań:</span>
                      <span>{selectedBuilding.apartments || 'Brak danych'}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-3">Status kontroli</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Ostatnia kontrola:</span>
                      <span>{selectedBuilding.lastInspection || 'Brak danych'}</span>
                    </div>
                    
                    {showAIInsights && buildingHealthScores[selectedBuilding.id] !== undefined && (
                      <div className="mt-4">
                        <h4 className="font-medium mb-2">Ocena AI</h4>
                        <div className={`p-3 rounded-lg ${getHealthScoreBgColor(buildingHealthScores[selectedBuilding.id])}`}>
                          <div className="flex justify-between items-center">
                            <span className="font-medium">Ocena stanu budynku:</span>
                            <span className={`text-xl font-bold ${getHealthScoreColor(buildingHealthScores[selectedBuilding.id])}`}>
                              {buildingHealthScores[selectedBuilding.id]}/100
                            </span>
                          </div>
                          <p className="mt-2 text-sm">
                            {buildingHealthScores[selectedBuilding.id] >= 80 
                              ? 'Budynek w dobrym stanie technicznym, regularne kontrole są prowadzone prawidłowo.'
                              : buildingHealthScores[selectedBuilding.id] >= 60
                              ? 'Budynek wymaga uwagi. Zalecana jest aktualizacja kontroli i przegląd techniczny.'
                              : 'Budynek wymaga natychmiastowej uwagi. Konieczne są kontrole i potencjalne naprawy.'
                            }
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t dark:border-gray-700 flex justify-end space-x-3">
                <Button 
                  variant="outline"
                  onClick={() => setShowBuildingDetails(false)}
                >
                  Zamknij
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => {
                    setShowBuildingDetails(false);
                    handleEditBuilding(selectedBuilding.id);
                  }}
                >
                  Edytuj
                </Button>
                <Button
                  color="red"
                  onClick={() => {
                    setShowBuildingDetails(false);
                    handleViewInspections(selectedBuilding.id);
                  }}
                >
                  Historia kontroli
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* AI Risk Assessment Modal */}
      {showAIRiskModal && selectedRiskBuilding && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className={`max-w-2xl w-full ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-xl overflow-hidden`}>
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center">
                  <AlertTriangle size={24} className="mr-2 text-red-500" />
                  <h3 className="text-xl font-semibold">Analiza ryzyka budynku</h3>
                </div>
                <button
                  onClick={() => setShowAIRiskModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={24} />
                </button>
              </div>
              
              <div className="mb-6">
                <div className="flex items-center mb-2">
                  <Building size={20} className="mr-2 text-gray-500" />
                  <h4 className="font-medium">{selectedRiskBuilding.address}, {selectedRiskBuilding.city}</h4>
                </div>
                
                <div className={`p-4 rounded-lg ${getHealthScoreBgColor(buildingHealthScores[selectedRiskBuilding.id])}`}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">Ocena stanu budynku:</span>
                    <span className={`text-2xl font-bold ${getHealthScoreColor(buildingHealthScores[selectedRiskBuilding.id])}`}>
                      {buildingHealthScores[selectedRiskBuilding.id]}/100
                    </span>
                  </div>
                  
                  <p className="mb-4">
                    Ten budynek został zidentyfikowany jako wymagający pilnej uwagi ze względu na kilka czynników ryzyka.
                  </p>
                  
                  <h5 className="font-medium mb-2">Czynniki ryzyka:</h5>
                  <ul className="space-y-2 mb-4">
                    {!selectedRiskBuilding.lastInspection && (
                      <li className="flex items-start">
                        <AlertCircle size={16} className="mr-2 text-red-500 mt-0.5 flex-shrink-0" />
                        <span>Brak danych o ostatniej kontroli</span>
                      </li>
                    )}
                    
                    {selectedRiskBuilding.lastInspection && new Date() - new Date(selectedRiskBuilding.lastInspection.split('.').reverse().join('-')) > 6 * 30 * 24 * 60 * 60 * 1000 && (
                      <li className="flex items-start">
                        <AlertCircle size={16} className="mr-2 text-yellow-500 mt-0.5 flex-shrink-0" />
                        <span>Ostatnia kontrola wykonana ponad 6 miesięcy temu</span>
                      </li>
                    )}
                    
                    {selectedRiskBuilding.yearBuilt && new Date().getFullYear() - selectedRiskBuilding.yearBuilt > 30 && (
                      <li className="flex items-start">
                        <AlertCircle size={16} className="mr-2 text-yellow-500 mt-0.5 flex-shrink-0" />
                        <span>Budynek starszy niż 30 lat (rok budowy: {selectedRiskBuilding.yearBuilt})</span>
                      </li>
                    )}
                    
                    {selectedRiskBuilding.heatingType === 'Węglowe' && (
                      <li className="flex items-start">
                        <AlertCircle size={16} className="mr-2 text-red-500 mt-0.5 flex-shrink-0" />
                        <span>Ogrzewanie węglowe wymaga częstszych kontroli</span>
                      </li>
                    )}
                    
                    {selectedRiskBuilding.heatingType === 'Olejowe' && (
                      <li className="flex items-start">
                        <AlertCircle size={16} className="mr-2 text-yellow-500 mt-0.5 flex-shrink-0" />
                        <span>Ogrzewanie olejowe wymaga regularnych kontroli</span>
                      </li>
                    )}
                  </ul>
                  
                  <h5 className="font-medium mb-2">Zalecenia:</h5>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <CheckCircle size={16} className="mr-2 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Zaplanuj kontrolę w ciągu najbliższych 30 dni</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle size={16} className="mr-2 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Przeprowadź kompleksowy przegląd stanu technicznego</span>
                    </li>
                    {selectedRiskBuilding.heatingType === 'Węglowe' && (
                      <li className="flex items-start">
                        <CheckCircle size={16} className="mr-2 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>Rozważ modernizację systemu ogrzewania na bardziej ekologiczny</span>
                      </li>
                    )}
                  </ul>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3">
                <Button 
                  variant="outline"
                  onClick={() => setShowAIRiskModal(false)}
                >
                  Zamknij
                </Button>
                <Button 
                  color="red"
                  onClick={() => {
                    setShowAIRiskModal(false);
                    // Zaznacz ten budynek
                    setSelectedBuildings([selectedRiskBuilding.id]);
                    alert(`Zaznaczono budynek ${selectedRiskBuilding.address} do natychmiastowej uwagi.`);
                  }}
                >
                  Zaznacz do kontroli
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Delete confirmation modal */}
      {showDeleteModal && buildingToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`max-w-md w-full p-6 rounded-lg shadow-xl ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="flex items-start mb-4">
              <div className="mr-3 text-red-500">
                <AlertTriangle size={24} />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Potwierdź usunięcie</h3>
                <p className="text-gray-500 mt-1">
                  Czy na pewno chcesz usunąć budynek pod adresem "{buildingToDelete.address}"? 
                  Ta operacja jest nieodwracalna.
                </p>
              </div>
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button 
                variant="outline" 
                onClick={() => {
                  setShowDeleteModal(false);
                  setBuildingToDelete(null);
                }}
              >
                Anuluj
              </Button>
              <Button 
                color="red"
                onClick={handleConfirmDelete}
              >
                Usuń
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BuildingsList;