import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, Filter, Plus, Download, AlertCircle, ArrowUpRight, 
  Check, Calendar, BrainCircuit, FileText, AlertTriangle, 
  BarChart2, Cpu, ChevronDown, X, MapPin, Thermometer 
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import DataTable from '../../components/ui/DataTable';
import StatusBadge from '../../components/ui/StatusBadge';
import InspectionForm from './InspectionForm';

const InspectionsList = ({ data = [], darkMode, isRefreshing, onViewDetails }) => {
  // Stany dla wyszukiwania i filtrowania
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [resultFilter, setResultFilter] = useState('all');
  const [ceebFilter, setCeebFilter] = useState('all');
  const [cityFilter, setCityFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState({ start: '', end: '' });
  
  // Stany dla UI
  const [showAddForm, setShowAddForm] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [showCEEBModal, setShowCEEBModal] = useState(false);
  const [selectedInspection, setSelectedInspection] = useState(null);
  const [filteredInspections, setFilteredInspections] = useState([]);
  const [selectedInspections, setSelectedInspections] = useState([]);
  const [columns, setColumns] = useState([]);
  const [isExporting, setIsExporting] = useState(false);
  
  // Stany dla funkcji AI
  const [showAIInsights, setShowAIInsights] = useState(false);
  const [aiInsights, setAIInsights] = useState([]);
  const [aiLoading, setAILoading] = useState(false);
  const [aiRecommendations, setAIRecommendations] = useState([]);
  const [anomalies, setAnomalies] = useState([]);
  const [predictionData, setPredictionData] = useState(null);

  // Referencja do komponentu dla responsywności
  const containerRef = useRef(null);
  
  // Efekt dla obsługi responsywności
  useEffect(() => {
    const handleResize = () => {
      setColumns(getColumns());
    };
    
    window.addEventListener('resize', handleResize);
    handleResize(); // Inicjalne ustawienie kolumn
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Efekt do inicjalizacji danych
  useEffect(() => {
    if (data && data.length) {
      filterInspections();
    }
  }, [data, searchTerm, typeFilter, resultFilter, ceebFilter, cityFilter, dateFilter]);
  
  // Funkcja filtrowania
  const filterInspections = () => {
    let filtered = [...data];
    
    // Filtrowanie po wyszukiwanym tekście
    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(inspection => 
        (inspection.id && inspection.id.toString().includes(term)) ||
        (inspection.address && inspection.address.toLowerCase().includes(term)) ||
        (inspection.city && inspection.city.toLowerCase().includes(term)) ||
        (inspection.type && inspection.type.toLowerCase().includes(term)) ||
        (inspection.clientName && inspection.clientName.toLowerCase().includes(term))
      );
    }
    
    // Filtrowanie po typie kontroli
    if (typeFilter !== 'all') {
      filtered = filtered.filter(inspection => inspection.type === typeFilter);
    }
    
    // Filtrowanie po wyniku
    if (resultFilter !== 'all') {
      filtered = filtered.filter(inspection => inspection.result === resultFilter);
    }
    
    // Filtrowanie po statusie CEEB
    if (ceebFilter !== 'all') {
      filtered = filtered.filter(inspection => inspection.ceebStatus === ceebFilter);
    }

    // Filtrowanie po mieście
    if (cityFilter !== 'all') {
      filtered = filtered.filter(inspection => inspection.city === cityFilter);
    }
    
    // Filtrowanie po dacie
    if (dateFilter.start) {
      const startDate = new Date(dateFilter.start);
      filtered = filtered.filter(inspection => {
        const dateParts = inspection.date.split('.');
        const inspectionDate = new Date(dateParts[2], dateParts[1] - 1, dateParts[0]);
        return inspectionDate >= startDate;
      });
    }
    
    if (dateFilter.end) {
      const endDate = new Date(dateFilter.end);
      filtered = filtered.filter(inspection => {
        const dateParts = inspection.date.split('.');
        const inspectionDate = new Date(dateParts[2], dateParts[1] - 1, dateParts[0]);
        return inspectionDate <= endDate;
      });
    }
    
    setFilteredInspections(filtered);
    
    // Aktualizuj zaznaczone kontrole, aby usunąć te, które nie są widoczne po filtrowaniu
    setSelectedInspections(prev => prev.filter(id => 
      filtered.some(inspection => inspection.id === id)
    ));
  };

  // Zerowanie filtrów
  const resetFilters = () => {
    setSearchTerm('');
    setTypeFilter('all');
    setResultFilter('all');
    setCeebFilter('all');
    setCityFilter('all');
    setDateFilter({ start: '', end: '' });
  };
  
  // Dodawanie nowej kontroli
  const handleAddInspection = (inspectionData) => {
    console.log('Dodano nową kontrolę:', inspectionData);
    
    // W prawdziwej aplikacji wysłalibyśmy te dane do API
    // Na potrzeby demo pokażemy powiadomienie
    alert(`Kontrola dla adresu "${inspectionData.address}" została dodana. Typ: ${inspectionData.type}`);
    setShowAddForm(false);
    
    // Symulacja dodania do listy przez wywołanie filtrowania
    setTimeout(() => {
      filterInspections();
    }, 500);
  };
  
  // Obsługa podglądu szczegółów kontroli
  const handleViewDetails = (inspectionId) => {
    const inspection = data.find(i => i.id === inspectionId);
    if (inspection) {
      if (onViewDetails) {
        onViewDetails(inspection);
      } else {
        // Jeśli callback do widoku szczegółów nie został przekazany
        setSelectedInspection(inspection);
        console.log('Podgląd szczegółów kontroli:', inspection);
        alert(`Przejście do szczegółów kontroli ID: ${inspectionId}`);
      }
    }
  };
  
  // Obsługa protokołu
  const handleProtocol = (inspectionId) => {
    const inspection = data.find(i => i.id === inspectionId);
    if (inspection) {
      console.log('Generowanie protokołu dla kontroli:', inspection);
      
      // Symulacja generowania protokołu
      setTimeout(() => {
        alert(`Protokół dla kontroli ID: ${inspectionId} został wygenerowany.`);
      }, 1000);
    }
  };
  
  // Obsługa zgłaszania do CEEB
  const handleCEEBClick = (inspectionId) => {
    const inspection = data.find(i => i.id === inspectionId);
    if (inspection) {
      setSelectedInspection(inspection);
      setShowCEEBModal(true);
    }
  };
  
  // Potwierdzenie zgłoszenia do CEEB
  const handleCEEBSubmit = () => {
    if (selectedInspection) {
      console.log('Zgłaszanie do CEEB:', selectedInspection);
      
      // Symulacja zgłoszenia
      setTimeout(() => {
        alert(`Kontrola ID: ${selectedInspection.id} została zgłoszona do CEEB.`);
        setShowCEEBModal(false);
        setSelectedInspection(null);
        
        // Odświeżenie danych
        filterInspections();
      }, 1500);
    }
  };
  
  // Obsługa zaznaczania kontroli
  const handleInspectionSelect = (inspectionId) => {
    setSelectedInspections(prev => {
      if (prev.includes(inspectionId)) {
        return prev.filter(id => id !== inspectionId);
      } else {
        return [...prev, inspectionId];
      }
    });
  };
  
  // Obsługa zaznaczania wszystkich kontroli
  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedInspections(filteredInspections.map(inspection => inspection.id));
    } else {
      setSelectedInspections([]);
    }
  };
  
  // Eksport zaznaczonych kontroli
  const handleExport = () => {
    if (selectedInspections.length === 0) {
      alert('Wybierz przynajmniej jedną kontrolę do eksportu.');
      return;
    }
    
    setIsExporting(true);
    
    // Symulacja eksportu
    setTimeout(() => {
      console.log('Eksportowanie kontroli:', selectedInspections);
      
      // Generowanie przykładowego pliku CSV
      const selectedData = data.filter(inspection => selectedInspections.includes(inspection.id));
      const csvContent = 'data:text/csv;charset=utf-8,' 
        + 'ID,Typ,Adres,Miasto,Data,Wynik,Status CEEB\n'
        + selectedData.map(item => 
            `${item.id},"${item.type}","${item.address}","${item.city}","${item.date}","${item.result}","${item.ceebStatus}"`
          ).join('\n');
      
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', 'eksport_kontrole.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setIsExporting(false);
      alert(`Wyeksportowano ${selectedInspections.length} kontroli.`);
    }, 2000);
  };
  
  // Masowe zgłaszanie do CEEB
  const handleBulkCEEBSubmit = () => {
    if (selectedInspections.length === 0) {
      alert('Wybierz przynajmniej jedną kontrolę do zgłoszenia do CEEB.');
      return;
    }
    
    const selectedData = data.filter(inspection => selectedInspections.includes(inspection.id));
    console.log('Masowe zgłaszanie do CEEB:', selectedData);
    
    // Symulacja masowego zgłoszenia
    setTimeout(() => {
      alert(`Zgłoszono ${selectedInspections.length} kontroli do CEEB.`);
      
      // Odświeżenie danych
      filterInspections();
    }, 2000);
  };
  
  // Funkcje AI
  
  // Generowanie analiz AI
  const generateAIInsights = () => {
    setAILoading(true);
    setShowAIInsights(true);
    
    // Symulacja analizy AI
    setTimeout(() => {
      // Analiza typów kontroli
      const typeCount = {};
      data.forEach(inspection => {
        typeCount[inspection.type] = (typeCount[inspection.type] || 0) + 1;
      });
      
      // Analiza wyników
      const resultCount = {};
      data.forEach(inspection => {
        resultCount[inspection.result] = (resultCount[inspection.result] || 0) + 1;
      });
      
      // Wykrywanie anomalii
      const anomalies = [];
      
      // Anomalia: duża liczba negatywnych wyników dla określonego typu kontroli
      const negativeRateByType = {};
      const inspectionsByType = {};
      data.forEach(inspection => {
        if (!inspectionsByType[inspection.type]) inspectionsByType[inspection.type] = [];
        inspectionsByType[inspection.type].push(inspection);
        
        if (!negativeRateByType[inspection.type]) negativeRateByType[inspection.type] = { total: 0, negative: 0 };
        negativeRateByType[inspection.type].total++;
        if (inspection.result === 'Negatywny') negativeRateByType[inspection.type].negative++;
      });
      
      Object.entries(negativeRateByType).forEach(([type, counts]) => {
        const rate = counts.negative / counts.total;
        if (rate > 0.3 && counts.total > 10) {
          anomalies.push({
            type: 'warning',
            title: `Wysoki odsetek negatywnych wyników dla "${type}"`,
            description: `${Math.round(rate * 100)}% kontroli typu "${type}" ma wynik negatywny, co jest powyżej średniej.`,
            icon: <AlertTriangle size={16} className="text-red-500" />
          });
        }
      });
      
      // Rekomendacje oparte na analizie danych
      const recommendations = [];
      
      // Rekomendacja: Zgłoszenia do CEEB
      const pendingCEEB = data.filter(i => i.ceebStatus === 'Do zgłoszenia');
      if (pendingCEEB.length > 0) {
        recommendations.push({
          title: 'Niezgłoszone kontrole CEEB',
          description: `${pendingCEEB.length} kontroli wymaga zgłoszenia do CEEB.`,
          action: 'Zgłoś wszystkie',
          handler: handleBulkCEEBSubmit,
          icon: <AlertCircle size={16} className="text-yellow-500" />
        });
      }
      
      // Rekomendacja: Planowanie kontroli (w oparciu o przeszłe dane)
      const cityCounts = {};
      data.forEach(inspection => {
        cityCounts[inspection.city] = (cityCounts[inspection.city] || 0) + 1;
      });
      
      const topCity = Object.entries(cityCounts)
        .sort((a, b) => b[1] - a[1])
        .filter(([city, count]) => count > 5)[0];
      
      if (topCity) {
        recommendations.push({
          title: 'Optymalizacja harmonogramu',
          description: `Zaplanuj więcej kontroli w ${topCity[0]}, gdzie była przeprowadzona największa liczba kontroli.`,
          action: 'Zaplanuj',
          icon: <Calendar size={16} className="text-blue-500" />
        });
      }
      
      // Przewidywania
      const prediction = {
        nextMonthInspections: Math.round(data.length * (1 + (Math.random() * 0.3 - 0.1))),
        negativeRate: Math.round((resultCount['Negatywny'] || 0) / data.length * 100),
        mostCommonType: Object.entries(typeCount).sort((a, b) => b[1] - a[1])[0][0],
        ceebSubmissions: pendingCEEB.length
      };
      
      // Ustawienie stanu z wynikami analizy
      setAIInsights([
        {
          title: 'Statystyki kontroli',
          description: `Liczba kontroli: ${data.length}, Pozytywne: ${resultCount['Pozytywny'] || 0}, Negatywne: ${resultCount['Negatywny'] || 0}`,
          icon: <BarChart2 size={16} className="text-green-500" />
        },
        {
          title: 'Najpopularniejszy typ kontroli',
          description: `"${Object.entries(typeCount).sort((a, b) => b[1] - a[1])[0][0]}" stanowi ${Math.round(Object.entries(typeCount).sort((a, b) => b[1] - a[1])[0][1] / data.length * 100)}% wszystkich kontroli.`,
          icon: <Check size={16} className="text-blue-500" />
        }
      ]);
      
      setAnomalies(anomalies);
      setAIRecommendations(recommendations);
      setPredictionData(prediction);
      setAILoading(false);
    }, 2000);
  };
  
  // Konfiguracja kolumn tabeli na podstawie rozmiaru ekranu
  const getColumns = () => {
    const isMobile = window.innerWidth < 768;
    
    if (isMobile) {
      return [
        { 
          header: (
            <div className="flex items-center">
              <input 
                type="checkbox" 
                onChange={handleSelectAll}
                checked={selectedInspections.length === filteredInspections.length && filteredInspections.length > 0}
                className="mr-2"
              />
              <span>ID</span>
            </div>
          ),
          accessor: 'id',
          cell: (value, row) => (
            <div className="flex items-center">
              <input 
                type="checkbox" 
                checked={selectedInspections.includes(value)}
                onChange={() => handleInspectionSelect(value)}
                onClick={(e) => e.stopPropagation()}
                className="mr-2"
              />
              {value}
            </div>
          )
        },
        { header: 'Typ', accessor: 'type' },
        { 
          header: 'Wynik', 
          accessor: 'result',
          cell: (value) => (
            <StatusBadge 
              status={value} 
              color={
                value === 'Pozytywny' ? 'green' : 
                value === 'Negatywny' ? 'red' : 
                'yellow'
              } 
            />
          )
        },
        { 
          header: 'Akcje', 
          accessor: 'id',
          cell: (value, row) => (
            <div className="flex space-x-2">
              <Button 
                variant="link" 
                onClick={(e) => {
                  e.stopPropagation();
                  handleViewDetails(value);
                }}
              >
                Szczegóły
              </Button>
            </div>
          )
        },
      ];
    }
    
    return [
      { 
        header: (
          <div className="flex items-center">
            <input 
              type="checkbox" 
              onChange={handleSelectAll}
              checked={selectedInspections.length === filteredInspections.length && filteredInspections.length > 0}
              className="mr-2"
            />
            <span>ID</span>
          </div>
        ),
        accessor: 'id',
        cell: (value, row) => (
          <div className="flex items-center">
            <input 
              type="checkbox" 
              checked={selectedInspections.includes(value)}
              onChange={() => handleInspectionSelect(value)}
              onClick={(e) => e.stopPropagation()}
              className="mr-2"
            />
            {value}
          </div>
        )
      },
      { header: 'Typ', accessor: 'type' },
      { header: 'Adres', accessor: 'address' },
      { header: 'Miasto', accessor: 'city' },
      { header: 'Data', accessor: 'date' },
      { 
        header: 'Wynik', 
        accessor: 'result',
        cell: (value) => (
          <StatusBadge 
            status={value} 
            color={
              value === 'Pozytywny' ? 'green' : 
              value === 'Negatywny' ? 'red' : 
              'yellow'
            } 
          />
        )
      },
      { 
        header: 'Status CEEB', 
        accessor: 'ceebStatus',
        cell: (value) => (
          <StatusBadge 
            status={value} 
            color={value === 'Zgłoszony do CEEB' ? 'green' : 'yellow'} 
          />
        )
      },
      { 
        header: 'Akcje', 
        accessor: 'id',
        cell: (value, row) => (
          <div className="flex space-x-2">
            <Button 
              variant="link" 
              onClick={(e) => {
                e.stopPropagation();
                handleViewDetails(value);
              }}
            >
              Szczegóły
            </Button>
            <Button 
              variant="link" 
              onClick={(e) => {
                e.stopPropagation();
                handleProtocol(value);
              }} 
              className="text-green-600"
            >
              Protokół
            </Button>
            {row.ceebStatus === 'Do zgłoszenia' && (
              <Button 
                variant="link" 
                onClick={(e) => {
                  e.stopPropagation();
                  handleCEEBClick(value);
                }} 
                className="text-red-600"
              >
                CEEB
              </Button>
            )}
          </div>
        )
      },
    ];
  };

  // Renderowanie kart dla widoku mobilnego
  const renderMobileCard = (inspection) => (
    <div 
      key={inspection.id} 
      className={`p-4 rounded-lg shadow mb-4 ${
        darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
      }`}
      onClick={() => handleViewDetails(inspection.id)}
    >
      <div className="flex justify-between items-start">
        <div className="flex items-start">
          <input 
            type="checkbox" 
            checked={selectedInspections.includes(inspection.id)}
            onChange={() => handleInspectionSelect(inspection.id)}
            onClick={(e) => e.stopPropagation()}
            className="mr-2 mt-1"
          />
          <div>
            <span className="text-sm text-gray-500">ID: {inspection.id}</span>
            <h3 className="font-semibold">{inspection.type}</h3>
            <p className="text-sm">{inspection.address}, {inspection.city}</p>
            <p className="text-sm">{inspection.date}</p>
          </div>
        </div>
        <StatusBadge 
          status={inspection.result} 
          color={
            inspection.result === 'Pozytywny' ? 'green' : 
            inspection.result === 'Negatywny' ? 'red' : 
            'yellow'
          } 
        />
      </div>
      <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 flex justify-between">
        <Button 
          size="sm" 
          variant="link" 
          onClick={(e) => {
            e.stopPropagation();
            handleViewDetails(inspection.id);
          }}
        >
          Szczegóły
        </Button>
        {inspection.ceebStatus === 'Do zgłoszenia' && (
          <Button 
            size="sm" 
            variant="link" 
            className="text-red-600" 
            onClick={(e) => {
              e.stopPropagation();
              handleCEEBClick(inspection.id);
            }}
          >
            CEEB
          </Button>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6" ref={containerRef}>
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Kontrole</h2>
        <div className="flex space-x-2">
          <Button 
            onClick={() => setShowAddForm(true)} 
            className="flex items-center"
            color="red"
          >
            <Plus size={16} className="mr-2" />
            Dodaj kontrolę
          </Button>
          
          <Button
            variant="outline"
            className="flex items-center"
            color="red"
            onClick={handleExport}
            disabled={isExporting || selectedInspections.length === 0}
          >
            <Download size={16} className="mr-2" />
            {isExporting ? 'Eksportowanie...' : 'Eksportuj'}
          </Button>
          
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
        </div>
      </div>
      
      {/* Formularz dodawania kontroli */}
      {showAddForm && (
        <Card darkMode={darkMode}>
          <h3 className="font-semibold mb-4">Dodaj nową kontrolę</h3>
          <InspectionForm 
            onSubmit={handleAddInspection} 
            onCancel={() => setShowAddForm(false)}
            darkMode={darkMode}
          />
        </Card>
      )}
      
      {/* Panel analizy AI */}
      {showAIInsights && (
        <Card darkMode={darkMode} className="border-l-4 border-red-500">
          <div className="flex justify-between items-start">
            <div className="flex items-center">
              <BrainCircuit size={20} className="mr-2 text-red-500" />
              <h3 className="font-semibold">Analiza AI</h3>
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
              {/* Statystyki i obserwacje */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {aiInsights.map((insight, index) => (
                  <div 
                    key={index} 
                    className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} flex items-start`}
                  >
                    {insight.icon}
                    <div className="ml-2">
                      <h4 className="font-medium">{insight.title}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{insight.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Anomalie i ostrzeżenia */}
              {anomalies.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-medium mb-2">Wykryte anomalie</h4>
                  <div className="space-y-3">
                    {anomalies.map((anomaly, index) => (
                      <div 
                        key={index} 
                        className={`p-3 rounded-lg ${
                          anomaly.type === 'warning'
                            ? 'bg-red-50 dark:bg-red-900 dark:bg-opacity-30 border-l-4 border-red-500'
                            : 'bg-yellow-50 dark:bg-yellow-900 dark:bg-opacity-30 border-l-4 border-yellow-500'
                        }`}
                      >
                        <div className="flex items-center mb-1">
                          {anomaly.icon}
                          <h5 className="font-medium ml-2">{anomaly.title}</h5>
                        </div>
                        <p className="text-sm">{anomaly.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Rekomendacje AI */}
              {aiRecommendations.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-medium mb-2">Rekomendacje</h4>
                  <div className="space-y-3">
                    {aiRecommendations.map((recommendation, index) => (
                      <div 
                        key={index} 
                        className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} flex items-start justify-between`}
                      >
                        <div className="flex items-start">
                          {recommendation.icon}
                          <div className="ml-2">
                            <h5 className="font-medium">{recommendation.title}</h5>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{recommendation.description}</p>
                          </div>
                        </div>
                        {recommendation.action && (
                          <Button 
                            variant="outline"
                            size="sm"
                            onClick={recommendation.handler}
                            className="ml-2 whitespace-nowrap"
                          >
                            {recommendation.action}
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Predykcja */}
              {predictionData && (
                <div className="mt-4">
                  <h4 className="font-medium mb-2 flex items-center">
                    <Cpu size={16} className="mr-2 text-purple-500" />
                    Predykcja na najbliższy miesiąc
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className={`p-3 rounded-lg ${darkMode ? 'bg-blue-900 bg-opacity-20' : 'bg-blue-50'}`}>
                      <p className="text-xs text-gray-500">Przewidywana liczba kontroli</p>
                      <p className="text-xl font-bold">{predictionData.nextMonthInspections}</p>
                      <div className="flex items-center text-xs text-green-500 mt-1">
                        <ArrowUpRight size={12} className="mr-1" />
                        +{Math.round((predictionData.nextMonthInspections / data.length - 1) * 100)}% wzrostu
                      </div>
                    </div>
                    
                    <div className={`p-3 rounded-lg ${darkMode ? 'bg-red-900 bg-opacity-20' : 'bg-red-50'}`}>
                      <p className="text-xs text-gray-500">Przewidywany wskaźnik usterek</p>
                      <p className="text-xl font-bold">{predictionData.negativeRate}%</p>
                      <p className="text-xs text-gray-500 mt-1">
                        negatywnych wyników
                      </p>
                    </div>
                    
                    <div className={`p-3 rounded-lg ${darkMode ? 'bg-yellow-900 bg-opacity-20' : 'bg-yellow-50'}`}>
                      <p className="text-xs text-gray-500">Zgłoszenia CEEB</p>
                      <p className="text-xl font-bold">{predictionData.ceebSubmissions}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        kontroli czeka na zgłoszenie
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </Card>
      )}
      
      {/* Panel wyszukiwania i filtrowania */}
      <Card darkMode={darkMode}>
        <div className="mb-4 flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Szukaj kontroli..."
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
          
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className={`px-3 py-2 border rounded-lg ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
          >
            <option value="all">Wszystkie typy</option>
            <option value="Przewód dymowy">Przewód dymowy</option>
            <option value="Przewód spalinowy">Przewód spalinowy</option>
            <option value="Przewód wentylacyjny">Przewód wentylacyjny</option>
            <option value="Instalacja gazowa">Instalacja gazowa</option>
          </select>
          
          <select
            value={resultFilter}
            onChange={(e) => setResultFilter(e.target.value)}
            className={`px-3 py-2 border rounded-lg ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
          >
            <option value="all">Wszystkie wyniki</option>
            <option value="Pozytywny">Pozytywny</option>
            <option value="Negatywny">Negatywny</option>
            <option value="Warunkowy">Warunkowy</option>
          </select>
          
          <Button 
            variant={showAdvancedFilters ? "primary" : "outline"} 
            className="flex items-center"
            color="red"
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
          >
            <Filter size={16} className="mr-1" />
            <span>{showAdvancedFilters ? 'Ukryj filtry' : 'Filtry'}</span>
            <ChevronDown size={16} className="ml-1" />
          </Button>
        </div>
        
        {/* Panel zaawansowanych filtrów */}
        {showAdvancedFilters && (
          <div className="mb-4 p-4 border rounded-lg dark:border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-gray-500 mb-1">Status CEEB</label>
                <select
                  value={ceebFilter}
                  onChange={(e) => setCeebFilter(e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                >
                  <option value="all">Wszystkie statusy</option>
                  <option value="Zgłoszony do CEEB">Zgłoszone do CEEB</option>
                  <option value="Do zgłoszenia">Do zgłoszenia</option>
                </select>
              </div>
              
              <div>
                <label className="block text-gray-500 mb-1">Miasto</label>
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
              </div>
              
              <div>
                <label className="block text-gray-500 mb-1">Zakres dat</label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs text-gray-500">Od</label>
                    <input
                      type="date"
                      value={dateFilter.start}
                      onChange={(e) => setDateFilter({...dateFilter, start: e.target.value})}
                      className={`w-full px-3 py-2 border rounded-lg ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500">Do</label>
                    <input
                      type="date"
                      value={dateFilter.end}
                      onChange={(e) => setDateFilter({...dateFilter, end: e.target.value})}
                      className={`w-full px-3 py-2 border rounded-lg ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-4 flex justify-end space-x-2">
              <Button 
                variant="outline" 
                color="red"
                onClick={resetFilters}
              >
                Wyczyść filtry
              </Button>
              <Button 
                color="red"
                onClick={filterInspections}
              >
                Zastosuj filtry
              </Button>
            </div>
          </div>
        )}

        {/* Wskaźnik ładowania */}
        {isRefreshing && (
          <div className="flex justify-center items-center p-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-500"></div>
            <span className="ml-2 text-sm text-gray-500">Odświeżanie danych...</span>
          </div>
        )}

        {/* Aktualne filtry */}
        {(typeFilter !== 'all' || resultFilter !== 'all' || ceebFilter !== 'all' || cityFilter !== 'all' || dateFilter.start || dateFilter.end) && (
          <div className="mb-4 flex flex-wrap gap-2">
            {typeFilter !== 'all' && (
              <div className={`flex items-center px-2 py-1 rounded-full text-sm ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                <span>Typ: {typeFilter}</span>
                <button
                  onClick={() => setTypeFilter('all')}
                  className="ml-1 text-gray-500 hover:text-gray-700"
                >
                  <X size={14} />
                </button>
              </div>
            )}
            
            {resultFilter !== 'all' && (
              <div className={`flex items-center px-2 py-1 rounded-full text-sm ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                <span>Wynik: {resultFilter}</span>
                <button
                  onClick={() => setResultFilter('all')}
                  className="ml-1 text-gray-500 hover:text-gray-700"
                >
                  <X size={14} />
                </button>
              </div>
            )}
            
            {ceebFilter !== 'all' && (
              <div className={`flex items-center px-2 py-1 rounded-full text-sm ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                <span>CEEB: {ceebFilter}</span>
                <button
                  onClick={() => setCeebFilter('all')}
                  className="ml-1 text-gray-500 hover:text-gray-700"
                >
                  <X size={14} />
                </button>
              </div>
            )}
            
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
            
            {dateFilter.start && (
              <div className={`flex items-center px-2 py-1 rounded-full text-sm ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                <span>Od: {dateFilter.start}</span>
                <button
                  onClick={() => setDateFilter({...dateFilter, start: ''})}
                  className="ml-1 text-gray-500 hover:text-gray-700"
                >
                  <X size={14} />
                </button>
              </div>
            )}
            
            {dateFilter.end && (
              <div className={`flex items-center px-2 py-1 rounded-full text-sm ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                <span>Do: {dateFilter.end}</span>
                <button
                  onClick={() => setDateFilter({...dateFilter, end: ''})}
                  className="ml-1 text-gray-500 hover:text-gray-700"
                >
                  <X size={14} />
                </button>
              </div>
            )}
            
            <Button 
              variant="link" 
              size="sm"
              onClick={resetFilters}
              className="text-red-500"
            >
              Wyczyść wszystkie
            </Button>
          </div>
        )}

        {/* Licznik zaznaczonych elementów i akcje */}
        {selectedInspections.length > 0 && (
          <div className="mb-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800 dark:bg-yellow-900 dark:border-yellow-500 dark:text-yellow-100">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <AlertCircle size={18} className="mr-2" />
                <p>Wybrano {selectedInspections.length} {selectedInspections.length === 1 ? 'kontrolę' : selectedInspections.length < 5 ? 'kontrole' : 'kontroli'}</p>
              </div>
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleExport}
                  disabled={isExporting}
                >
                  <Download size={14} className="mr-1" />
                  Eksportuj
                </Button>
                
                <Button 
                  variant="outline" 
                  size="sm"
                  color="red"
                  onClick={handleBulkCEEBSubmit}
                >
                  <FileText size={14} className="mr-1" />
                  Zgłoś do CEEB
                </Button>
                
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setSelectedInspections([])}
                >
                  <X size={14} className="mr-1" />
                  Wyczyść zaznaczenie
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Responsywny widok tabel/kart */}
        <div className="hidden md:block">
          {/* Widok dla desktopów - tabela */}
          <DataTable
            columns={columns}
            data={filteredInspections}
            darkMode={darkMode}
            pagination={{
              startItem: 1,
              endItem: filteredInspections.length,
              totalItems: filteredInspections.length
            }}
            currentPage={1}
            totalPages={1}
            onPageChange={() => {}}
            onRowClick={(row) => handleViewDetails(row.id)}
          />
        </div>

        <div className="md:hidden">
          {/* Widok dla urządzeń mobilnych - karty */}
          {filteredInspections.length > 0 ? (
            <div className="space-y-4">
              {filteredInspections.map(renderMobileCard)}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              Nie znaleziono kontroli spełniających kryteria
            </div>
          )}
        </div>
        
        {/* Podsumowanie wyników */}
        <div className="mt-4 pt-4 border-t dark:border-gray-700">
          <div className="flex flex-col md:flex-row md:justify-between items-center space-y-2 md:space-y-0">
            <div className="text-sm text-gray-500">
              Wyświetlanie {filteredInspections.length} z {data.length} kontroli
            </div>
            <div className="flex space-x-2 text-sm">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-green-500 mr-1"></div>
                <span>Pozytywne: {data.filter(i => i.result === 'Pozytywny').length}</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-red-500 mr-1"></div>
                <span>Negatywne: {data.filter(i => i.result === 'Negatywny').length}</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-yellow-500 mr-1"></div>
                <span>Warunkowe: {data.filter(i => i.result === 'Warunkowy').length}</span>
              </div>
            </div>
          </div>
        </div>
      </Card>
      
      {/* Modal zgłaszania do CEEB */}
      {showCEEBModal && selectedInspection && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`max-w-md w-full p-6 rounded-lg shadow-xl ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="flex items-start mb-4">
              <div className="mr-3 text-red-500">
                <AlertCircle size={24} />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Zgłoś do CEEB</h3>
                <p className="text-gray-500 mt-1">
                  Zgłosić kontrolę #{selectedInspection.id} z dnia {selectedInspection.date} do CEEB?
                </p>
                
                <div className="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800 dark:bg-yellow-900 dark:border-yellow-500 dark:text-yellow-100">
                  <p className="text-sm">
                    Pamiętaj, że wszystkie kontrole muszą być zgłoszone do CEEB w ciągu 7 dni.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mt-4">
              <label className="block text-gray-500 mb-1">Uwagi (opcjonalnie)</label>
              <textarea 
                className={`w-full px-3 py-2 border rounded-lg ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                rows="3"
              ></textarea>
            </div>
            
            <div className="flex justify-end space-x-2 mt-4">
              <Button 
                variant="outline" 
                color="red"
                onClick={() => {
                  setShowCEEBModal(false);
                  setSelectedInspection(null);
                }}
              >
                Anuluj
              </Button>
              <Button 
                color="red"
                onClick={handleCEEBSubmit}
              >
                Zgłoś do CEEB
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InspectionsList;