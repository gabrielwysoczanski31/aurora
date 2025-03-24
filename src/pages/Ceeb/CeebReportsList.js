import React, { useState, useEffect, useRef } from 'react';
import { 
  Download, AlertTriangle, CheckCircle, Filter, ChevronDown, Search, X, 
  Calendar, MapPin, FileText, BarChart2, BrainCircuit, Cpu, AlertCircle,
  Clock, TrendingUp, Zap, Send, RefreshCw, Upload
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import DataTable from '../../components/ui/DataTable';
import StatusBadge from '../../components/ui/StatusBadge';

const CeebReportsList = ({ data, darkMode }) => {
  // Podstawowe stany
  const [activeSection, setActiveSection] = useState('pending');
  const [selectedInspections, setSelectedInspections] = useState([]);
  const [showExportModal, setShowExportModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredInspections, setFilteredInspections] = useState([]);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [dateFilter, setDateFilter] = useState({ start: '', end: '' });
  const [resultFilter, setResultFilter] = useState('all');
  const [cityFilter, setCityFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [showSubmissionModal, setShowSubmissionModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  
  // Stany dla funkcjonalności AI
  const [showAIInsights, setShowAIInsights] = useState(false);
  const [aiLoading, setAILoading] = useState(false);
  const [aiInsights, setAIInsights] = useState([]);
  const [aiRecommendations, setAIRecommendations] = useState([]);
  const [ceebRiskInspections, setCeebRiskInspections] = useState([]);
  const [showRiskPredictions, setShowRiskPredictions] = useState(false);
  
  // Stany dla operacji przetwarzania
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isGeneratingXML, setIsGeneratingXML] = useState(false);
  const [xmlPreview, setXMLPreview] = useState('');
  
  // Referencje do elementów
  const submissionFormRef = useRef(null);
  const notesRef = useRef(null);
  
  // Filtrowanie inspekcji oczekujących na zgłoszenie do CEEB
  const pendingInspections = data.inspections.filter(
    inspection => inspection.ceebStatus === 'Do zgłoszenia'
  );
  
  // Inicjalizacja przefiltrowanych inspekcji
  useEffect(() => {
    setFilteredInspections(pendingInspections);
  }, [data]);
  
  // Filtrowanie inspekcji
  const filterInspections = () => {
    let filtered = [...pendingInspections];
    
    // Filtrowanie po wyszukiwanym tekście
    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(inspection => 
        (inspection.id && inspection.id.toString().includes(term)) ||
        (inspection.address && inspection.address.toLowerCase().includes(term)) ||
        (inspection.city && inspection.city.toLowerCase().includes(term)) ||
        (inspection.type && inspection.type.toLowerCase().includes(term))
      );
    }
    
    // Filtrowanie po dacie
    if (dateFilter.start) {
      const startDate = new Date(dateFilter.start);
      filtered = filtered.filter(inspection => {
        const parts = inspection.date.split('.');
        const inspectionDate = new Date(parts[2], parts[1] - 1, parts[0]);
        return inspectionDate >= startDate;
      });
    }
    
    if (dateFilter.end) {
      const endDate = new Date(dateFilter.end);
      filtered = filtered.filter(inspection => {
        const parts = inspection.date.split('.');
        const inspectionDate = new Date(parts[2], parts[1] - 1, parts[0]);
        return inspectionDate <= endDate;
      });
    }
    
    // Filtrowanie po wyniku
    if (resultFilter !== 'all') {
      filtered = filtered.filter(inspection => inspection.result === resultFilter);
    }
    
    // Filtrowanie po mieście
    if (cityFilter !== 'all') {
      filtered = filtered.filter(inspection => inspection.city === cityFilter);
    }
    
    // Filtrowanie po typie
    if (typeFilter !== 'all') {
      filtered = filtered.filter(inspection => inspection.type === typeFilter);
    }
    
    setFilteredInspections(filtered);
    
    // Aktualizuj zaznaczenia, aby usunąć te, które nie są już widoczne
    setSelectedInspections(prev => prev.filter(id => 
      filtered.some(inspection => inspection.id === id)
    ));
  };
  
  // Aktualizacja filtrów
  useEffect(() => {
    filterInspections();
  }, [searchTerm, dateFilter, resultFilter, cityFilter, typeFilter, data]);
  
  // Resetowanie filtrów
  const resetFilters = () => {
    setSearchTerm('');
    setDateFilter({ start: '', end: '' });
    setResultFilter('all');
    setCityFilter('all');
    setTypeFilter('all');
  };
  
  // Obsługa zaznaczania pojedynczej inspekcji
  const handleInspectionSelect = (inspectionId) => {
    setSelectedInspections(prev => {
      if (prev.includes(inspectionId)) {
        return prev.filter(id => id !== inspectionId);
      } else {
        return [...prev, inspectionId];
      }
    });
  };
  
  // Obsługa zaznaczania wszystkich inspekcji
  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedInspections(filteredInspections.map(inspection => inspection.id));
    } else {
      setSelectedInspections([]);
    }
  };
  
  // Obsługa przycisku eksportu
  const handleExport = () => {
    if (selectedInspections.length === 0) {
      alert('Wybierz przynajmniej jedną kontrolę do eksportu.');
      return;
    }
    setShowExportModal(true);
    
    // Generowanie podglądu XML
    setIsGeneratingXML(true);
    setTimeout(() => {
      generateXMLPreview();
      setIsGeneratingXML(false);
    }, 1000);
  };
  
  // Generowanie podglądu pliku XML dla eksportu
  const generateXMLPreview = () => {
    const selectedData = data.inspections.filter(
      inspection => selectedInspections.includes(inspection.id)
    );
    
    // Tworzymy prosty podgląd XML (w rzeczywistej aplikacji byłby to bardziej złożony kod)
    let xmlContent = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xmlContent += '<ceeb:ZgloszenieCEEB xmlns:ceeb="https://ceeb.gov.pl">\n';
    xmlContent += '  <ceeb:Zglaszajacy>\n';
    xmlContent += '    <ceeb:Nazwa>Usługi Kominiarskie Sp. z o.o.</ceeb:Nazwa>\n';
    xmlContent += '    <ceeb:NIP>987-654-32-10</ceeb:NIP>\n';
    xmlContent += '  </ceeb:Zglaszajacy>\n';
    xmlContent += '  <ceeb:Kontrole>\n';
    
    selectedData.forEach(inspection => {
      xmlContent += `    <ceeb:Kontrola id="${inspection.id}">\n`;
      xmlContent += `      <ceeb:TypKontroli>${inspection.type}</ceeb:TypKontroli>\n`;
      xmlContent += `      <ceeb:Adres>${inspection.address}, ${inspection.city}, ${inspection.postalCode}</ceeb:Adres>\n`;
      xmlContent += `      <ceeb:DataKontroli>${inspection.date}</ceeb:DataKontroli>\n`;
      xmlContent += `      <ceeb:Wynik>${inspection.result}</ceeb:Wynik>\n`;
      xmlContent += `    </ceeb:Kontrola>\n`;
    });
    
    xmlContent += '  </ceeb:Kontrole>\n';
    xmlContent += '</ceeb:ZgloszenieCEEB>';
    
    setXMLPreview(xmlContent);
  };
  
  // Obsługa zgłaszania do CEEB
  const handleSubmitToCEEB = () => {
    if (selectedInspections.length === 0) {
      alert('Wybierz przynajmniej jedną kontrolę do zgłoszenia do CEEB.');
      return;
    }
    
    setIsSubmitting(true);
    
    // Symulacja wysyłania danych do CEEB
    setTimeout(() => {
      console.log('Zgłoszono do CEEB:', selectedInspections);
      setShowExportModal(false);
      
      // Aktualizacja statusu kontroli (w rzeczywistej aplikacji byłoby to zaktualizowane w bazie danych)
      alert(`${selectedInspections.length} kontroli zostało zgłoszonych do CEEB.`);
      
      // Resetowanie zaznaczenia po wysłaniu
      setSelectedInspections([]);
      setIsSubmitting(false);
      
      // Dodanie nowego zgłoszenia do historii (symulacja)
      const now = new Date();
      const formattedDate = `${now.getDate().toString().padStart(2, '0')}.${(now.getMonth() + 1).toString().padStart(2, '0')}.${now.getFullYear()}`;
      
      const newReport = {
        id: `REP${Math.floor(Math.random() * 10000)}`,
        date: formattedDate,
        inspectionsCount: selectedInspections.length,
        status: 'Oczekujące',
        submittedBy: 'Użytkownik systemu',
        buildings: selectedInspections.map(id => {
          const inspection = data.inspections.find(i => i.id === id);
          return {
            address: inspection.address,
            city: inspection.city
          };
        })
      };
      
      console.log('Nowe zgłoszenie dodane do historii:', newReport);
    }, 2000);
  };
  
  // Obsługa podglądu inspekcji
  const handleViewInspection = (inspectionId) => {
    const inspection = data.inspections.find(i => i.id === inspectionId);
    if (inspection) {
      console.log('Podgląd szczegółów inspekcji:', inspection);
      alert(`Przejście do szczegółów inspekcji ID: ${inspectionId}`);
    }
  };
  
  // Obsługa pojedynczego zgłoszenia do CEEB
  const handleReportToCEEB = (inspectionId) => {
    setSelectedInspections([inspectionId]);
    handleExport();
  };
  
  // Obsługa podglądu zgłoszenia
  const handleViewReport = (reportId) => {
    const report = data.ceebReports.find(r => r.id === reportId);
    if (report) {
      setSelectedReport(report);
      setShowSubmissionModal(true);
    }
  };
  
  // Obsługa pobierania raportu
  const handleDownloadReport = (reportId) => {
    const report = data.ceebReports.find(r => r.id === reportId);
    if (report) {
      console.log('Pobieranie raportu:', reportId);
      
      setIsExporting(true);
      
      // Symulacja generowania i pobierania pliku
      setTimeout(() => {
        // Generowanie przykładowego pliku XML dla tego raportu
        let xmlContent = '<?xml version="1.0" encoding="UTF-8"?>\n';
        xmlContent += '<ceeb:ZgloszenieCEEB xmlns:ceeb="https://ceeb.gov.pl">\n';
        xmlContent += `  <ceeb:NumerZgloszenia>${report.id}</ceeb:NumerZgloszenia>\n`;
        xmlContent += `  <ceeb:DataZgloszenia>${report.date}</ceeb:DataZgloszenia>\n`;
        xmlContent += `  <ceeb:LiczbaKontroli>${report.inspectionsCount}</ceeb:LiczbaKontroli>\n`;
        xmlContent += '  <ceeb:Budynki>\n';
        
        report.buildings.forEach((building, index) => {
          xmlContent += `    <ceeb:Budynek id="${index+1}">\n`;
          xmlContent += `      <ceeb:Adres>${building.address}</ceeb:Adres>\n`;
          xmlContent += `      <ceeb:Miasto>${building.city}</ceeb:Miasto>\n`;
          xmlContent += '    </ceeb:Budynek>\n';
        });
        
        xmlContent += '  </ceeb:Budynki>\n';
        xmlContent += '</ceeb:ZgloszenieCEEB>';
        
        // Tworzenie i pobieranie pliku
        const blob = new Blob([xmlContent], { type: 'application/xml' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `CEEB_${report.id}.xml`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        setIsExporting(false);
        alert(`Raport ${report.id} został pobrany.`);
      }, 1500);
    }
  };
  
  // Funkcje AI
  
  // Generowanie analiz AI
  const generateAIInsights = () => {
    setAILoading(true);
    setShowAIInsights(true);
    
    // Symulacja analizy AI
    setTimeout(() => {
      // Analiza terminów CEEB
      const ceebDeadlineInspections = [];
      
      pendingInspections.forEach(inspection => {
        // Obliczanie dni od kontroli
        const parts = inspection.date.split('.');
        const inspectionDate = new Date(parts[2], parts[1] - 1, parts[0]);
        const today = new Date();
        const daysFromInspection = Math.floor((today - inspectionDate) / (1000 * 60 * 60 * 24));
        
        // Termin zgłoszenia do CEEB to 7 dni
        const daysToDeadline = 7 - daysFromInspection;
        
        if (daysToDeadline <= 3 && daysToDeadline > 0) {
          ceebDeadlineInspections.push({
            ...inspection,
            daysToDeadline
          });
        }
      });
      
      // Sortowanie po pilności
      ceebDeadlineInspections.sort((a, b) => a.daysToDeadline - b.daysToDeadline);
      setCeebRiskInspections(ceebDeadlineInspections);
      
      // Generowanie wglądów AI
      setAIInsights([
        {
          title: 'Zbliżające się terminy CEEB',
          description: `${ceebDeadlineInspections.length} kontroli wymaga zgłoszenia do CEEB w ciągu najbliższych 3 dni.`,
          icon: <Clock size={16} className="text-red-500" />,
          severity: 'warning'
        },
        {
          title: 'Rozkład typów kontroli',
          description: generateInspectionTypeDistribution(),
          icon: <BarChart2 size={16} className="text-blue-500" />,
          severity: 'info'
        }
      ]);
      
      // Generowanie rekomendacji AI
      setAIRecommendations([
        {
          title: 'Zgłoszenie zbiorcze',
          description: `Zalecamy zgłoszenie wszystkich ${pendingInspections.length} kontroli CEEB w jednym zgłoszeniu zbiorczym.`,
          action: 'Zgłoś wszystkie',
          handler: () => {
            setSelectedInspections(pendingInspections.map(i => i.id));
            handleExport();
          },
          icon: <Send size={16} className="text-green-500" />
        },
        {
          title: 'Kontrole priorytetowe',
          description: 'Zgłoś najpierw kontrole z kończącym się terminem, aby uniknąć kar za opóźnienie.',
          action: 'Priorytetowe zgłoszenie',
          handler: () => {
            setSelectedInspections(ceebDeadlineInspections.map(i => i.id));
            handleExport();
          },
          icon: <AlertCircle size={16} className="text-yellow-500" />
        }
      ]);
      
      setAILoading(false);
    }, 1500);
  };
  
  // Generowanie rozkładu typów kontroli
  const generateInspectionTypeDistribution = () => {
    const typeCount = {};
    pendingInspections.forEach(inspection => {
      typeCount[inspection.type] = (typeCount[inspection.type] || 0) + 1;
    });
    
    // Znajdowanie najczęstszego typu
    let maxType = '';
    let maxCount = 0;
    
    Object.entries(typeCount).forEach(([type, count]) => {
      if (count > maxCount) {
        maxType = type;
        maxCount = count;
      }
    });
    
    if (maxType) {
      const percentage = Math.round((maxCount / pendingInspections.length) * 100);
      return `Najczęstszy typ kontroli to "${maxType}" (${percentage}% wszystkich kontroli).`;
    }
    
    return 'Brak danych o typach kontroli.';
  };
  
  // Generowanie predykcji ryzyka dla kontroli
  const generateRiskPredictions = () => {
    setShowRiskPredictions(!showRiskPredictions);
  };
  
  // Kolumny dla tabeli oczekujących inspekcji
  const pendingColumns = [
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
    { header: 'Kod pocztowy', accessor: 'postalCode' },
    { header: 'Data kontroli', accessor: 'date' },
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
    ...(showRiskPredictions ? [
      {
        header: 'Ryzyko CEEB',
        accessor: 'id',
        cell: (value, row) => {
          const riskItem = ceebRiskInspections.find(item => item.id === value);
          
          if (riskItem) {
            const daysLeft = riskItem.daysToDeadline;
            const riskColor = daysLeft <= 1 ? 'red' : daysLeft <= 2 ? 'yellow' : 'blue';
            
            return (
              <div className={`px-2 py-1 rounded-lg text-xs bg-${riskColor}-100 text-${riskColor}-800 dark:bg-${riskColor}-900 dark:text-${riskColor}-100`}>
                {daysLeft} {daysLeft === 1 ? 'dzień' : 'dni'} do terminu
              </div>
            );
          }
          
          return (
            <div className="px-2 py-1 rounded-lg text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
              W terminie
            </div>
          );
        }
      }
    ] : []),
    { 
      header: 'Akcje', 
      accessor: 'id',
      cell: (value) => (
        <div className="flex space-x-2">
          <Button 
            variant="link" 
            onClick={(e) => {
              e.stopPropagation();
              handleReportToCEEB(value);
            }}
            className="text-red-600"
          >
            Zgłoś do CEEB
          </Button>
          <Button 
            variant="link" 
            onClick={(e) => {
              e.stopPropagation();
              handleViewInspection(value);
            }}
          >
            Szczegóły
          </Button>
        </div>
      )
    },
  ];
  
  // Kolumny dla tabeli historii zgłoszeń
  const historyColumns = [
    { header: 'ID zgłoszenia', accessor: 'id' },
    { header: 'Data zgłoszenia', accessor: 'date' },
    { header: 'Liczba kontroli', accessor: 'inspectionsCount' },
    { 
      header: 'Status', 
      accessor: 'status',
      cell: (value) => (
        <StatusBadge 
          status={value} 
          color={value === 'Zaakceptowane' ? 'green' : 'blue'} 
        />
      )
    },
    { 
      header: 'Akcje', 
      accessor: 'id',
      cell: (value) => (
        <div className="flex space-x-2">
          <Button 
            variant="link" 
            onClick={(e) => {
              e.stopPropagation();
              handleViewReport(value);
            }}
          >
            Szczegóły
          </Button>
          <Button 
            variant="link" 
            onClick={(e) => {
              e.stopPropagation();
              handleDownloadReport(value);
            }}
            className="text-green-600"
          >
            Pobierz
          </Button>
        </div>
      )
    },
  ];
  
  // Renderowanie karty dla widoku mobilnego
  const renderMobileCard = (inspection) => (
    <div 
      key={inspection.id} 
      className={`p-4 rounded-lg shadow mb-4 ${
        darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
      }`}
      onClick={() => handleViewInspection(inspection.id)}
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
      
      {showRiskPredictions && ceebRiskInspections.find(item => item.id === inspection.id) && (
        <div className="mt-2">
          <div className="px-2 py-1 rounded-lg text-xs bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100 inline-block">
            {ceebRiskInspections.find(item => item.id === inspection.id).daysToDeadline} dni do terminu CEEB
          </div>
        </div>
      )}
      
      <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 flex justify-between">
        <Button 
          size="sm" 
          variant="link" 
          onClick={(e) => {
            e.stopPropagation();
            handleReportToCEEB(inspection.id);
          }}
          className="text-red-600"
        >
          Zgłoś do CEEB
        </Button>
        <Button 
          size="sm" 
          variant="link" 
          onClick={(e) => {
            e.stopPropagation();
            handleViewInspection(inspection.id);
          }}
        >
          Szczegóły
        </Button>
      </div>
    </div>
  );
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Centralna Ewidencja Emisyjności Budynków</h2>
        <div className="flex space-x-2">
          <Button 
            onClick={handleExport} 
            className="flex items-center"
            color="red"
            disabled={selectedInspections.length === 0}
          >
            <Download size={16} className="mr-2" />
            Eksportuj do CEEB
          </Button>
          
          {pendingInspections.length > 0 && (
            <Button
              variant={showAIInsights ? "outline" : "primary"}
              className="flex items-center"
              color="red"
              onClick={showAIInsights ? () => setShowAIInsights(false) : generateAIInsights}
            >
              <BrainCircuit size={16} className="mr-2" />
              {showAIInsights ? 'Ukryj AI' : 'Analizy AI'}
            </Button>
          )}
        </div>
      </div>
      
      {/* Panel analizy AI */}
      {showAIInsights && (
        <Card darkMode={darkMode} className="border-l-4 border-red-500">
          <div className="flex justify-between items-start">
            <div className="flex items-center">
              <BrainCircuit size={20} className="mr-2 text-red-500" />
              <h3 className="font-semibold">Analiza AI zgłoszeń CEEB</h3>
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
              <span className="ml-2">Analizowanie danych CEEB...</span>
            </div>
          ) : (
            <div className="mt-4 space-y-4">
              {/* Wglądy AI */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {aiInsights.map((insight, index) => (
                  <div 
                    key={index} 
                    className={`p-3 rounded-lg ${
                      insight.severity === 'warning' 
                        ? 'bg-red-50 dark:bg-red-900 dark:bg-opacity-30 border-l-4 border-red-500' 
                        : 'bg-blue-50 dark:bg-blue-900 dark:bg-opacity-30'
                    } flex items-start`}
                  >
                    {insight.icon}
                    <div className="ml-2">
                      <h4 className="font-medium">{insight.title}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{insight.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Kontrole z ryzykiem przekroczenia terminu */}
              {ceebRiskInspections.length > 0 && (
                <div className="mt-4">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium flex items-center">
                      <AlertTriangle size={16} className="mr-2 text-yellow-500" />
                      Kontrole wymagające pilnego zgłoszenia
                    </h4>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={generateRiskPredictions}
                      className="flex items-center"
                    >
                      {showRiskPredictions ? 'Ukryj wskaźniki ryzyka' : 'Pokaż wskaźniki ryzyka'}
                    </Button>
                  </div>
                  
                  <div className="space-y-2 mt-2">
                    {ceebRiskInspections.map((inspection) => (
                      <div 
                        key={inspection.id} 
                        className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} flex justify-between items-center`}
                      >
                        <div className="flex items-center">
                          <div className={`h-4 w-4 rounded-full ${
                            inspection.daysToDeadline <= 1 ? 'bg-red-500' : 
                            inspection.daysToDeadline <= 2 ? 'bg-yellow-500' : 
                            'bg-blue-500'
                          } mr-2`}></div>
                          <div>
                            <p>{inspection.address}, {inspection.city}</p>
                            <p className="text-xs text-gray-500">
                              Kontrola z dnia {inspection.date} - pozostało {inspection.daysToDeadline} {inspection.daysToDeadline === 1 ? 'dzień' : 'dni'}
                            </p>
                          </div>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleReportToCEEB(inspection.id)}
                        >
                          Zgłoś
                        </Button>
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
              
              {/* Wnioski i sugestie */}
              <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg mt-4">
                <p className="text-sm">
                  <Zap size={16} className="inline-block mr-1 text-yellow-500" />
                  <strong>AI Insight:</strong> Regularne, zbiorcze zgłaszanie kontroli do CEEB pomaga zachować zgodność z przepisami i uniknąć kar administracyjnych. 
                  Zalecamy ustalenie cotygodniowego harmonogramu zgłoszeń dla optymalnego zarządzania procesem.
                </p>
              </div>
            </div>
          )}
        </Card>
      )}
      
      <div className="flex space-x-4 border-b pb-2">
        <button
          className={`pb-2 font-medium ${
            activeSection === 'pending' 
              ? 'border-b-2 border-red-500 text-red-600'
              : 'text-gray-500'
          }`}
          onClick={() => setActiveSection('pending')}
        >
          Kontrole do zgłoszenia
          {pendingInspections.length > 0 && (
            <span className="ml-2 px-2 py-1 bg-red-100 text-red-600 rounded-full text-xs">
              {pendingInspections.length}
            </span>
          )}
        </button>
        
        <button
          className={`pb-2 font-medium ${
            activeSection === 'history' 
              ? 'border-b-2 border-red-500 text-red-600'
              : 'text-gray-500'
          }`}
          onClick={() => setActiveSection('history')}
        >
          Historia zgłoszeń
        </button>
      </div>
      
      {activeSection === 'pending' && (
        <div className="space-y-6">
          {pendingInspections.length > 0 ? (
            <Card darkMode={darkMode}>
              <div className="mb-4 flex flex-col md:flex-row md:space-x-2 space-y-2 md:space-y-0 items-center">
                {/* Wyszukiwarka */}
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
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      onClick={() => setSearchTerm('')}
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
                
                <Button
                  variant={showAdvancedFilters ? 'primary' : 'outline'}
                  color="red"
                  className="flex items-center"
                  onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                >
                  <Filter size={16} className="mr-1" />
                  <span>Filtry</span>
                  <ChevronDown size={16} className="ml-1" />
                </Button>
              </div>
              
              {/* Zaawansowane filtry */}
              {showAdvancedFilters && (
                <div className="mb-4 p-4 border rounded-lg dark:border-gray-700">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-gray-500 mb-1">Data od</label>
                      <div className="relative">
                        <input
                          type="date"
                          value={dateFilter.start}
                          onChange={(e) => setDateFilter(prev => ({ ...prev, start: e.target.value }))}
                          className={`px-3 py-2 border rounded-lg w-full ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                        />
                        <Calendar size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-gray-500 mb-1">Data do</label>
                      <div className="relative">
                        <input
                          type="date"
                          value={dateFilter.end}
                          onChange={(e) => setDateFilter(prev => ({ ...prev, end: e.target.value }))}
                          className={`px-3 py-2 border rounded-lg w-full ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                        />
                        <Calendar size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none" />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-gray-500 mb-1">Wynik</label>
                      <div className="relative">
                        <select
                          value={resultFilter}
                          onChange={(e) => setResultFilter(e.target.value)}
                          className={`px-3 py-2 border rounded-lg w-full ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                        >
                          <option value="all">Wszystkie wyniki</option>
                          <option value="Pozytywny">Pozytywny</option>
                          <option value="Warunkowy">Warunkowy</option>
                          <option value="Negatywny">Negatywny</option>
                        </select>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-gray-500 mb-1">Miasto</label>
                      <div className="relative">
                        <select
                          value={cityFilter}
                          onChange={(e) => setCityFilter(e.target.value)}
                          className={`px-3 py-2 border rounded-lg w-full ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                        >
                          <option value="all">Wszystkie miasta</option>
                          <option value="Katowice">Katowice</option>
                          <option value="Gdańsk">Gdańsk</option>
                          <option value="Lublin">Lublin</option>
                          <option value="Kraków">Kraków</option>
                          <option value="Poznań">Poznań</option>
                          <option value="Warszawa">Warszawa</option>
                          <option value="Wrocław">Wrocław</option>
                        </select>
                        <MapPin size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none" />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-gray-500 mb-1">Typ</label>
                      <div className="relative">
                        <select
                          value={typeFilter}
                          onChange={(e) => setTypeFilter(e.target.value)}
                          className={`px-3 py-2 border rounded-lg w-full ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                        >
                          <option value="all">Wszystkie typy</option>
                          <option value="Instalacja gazowa">Instalacja gazowa</option>
                          <option value="Przewód spalinowy">Przewód spalinowy</option>
                          <option value="Przewód wentylacyjny">Przewód wentylacyjny</option>
                          <option value="Przewód dymowy">Przewód dymowy</option>
                        </select>
                        <FileText size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex justify-end">
                    <Button
                      variant="outline"
                      onClick={resetFilters}
                      className="mr-2"
                    >
                      Wyczyść filtry
                    </Button>
                  </div>
                </div>
              )}
              
              {/* Licznik zaznaczonych elementów */}
              {selectedInspections.length > 0 && (
                <div className="mb-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800 dark:bg-yellow-900 dark:border-yellow-500 dark:text-yellow-100">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <AlertCircle size={18} className="mr-2" />
                      <div>
                        <p>Wybrano {selectedInspections.length} {selectedInspections.length === 1 ? 'kontrolę' : selectedInspections.length < 5 ? 'kontrole' : 'kontroli'}</p>
                      </div>
                    </div>
                    <Button 
                      color="yellow"
                      variant="outline"
                      onClick={handleExport}
                      className="flex items-center"
                    >
                      <Download size={16} className="mr-1" />
                      Eksportuj wybrane
                    </Button>
                  </div>
                </div>
              )}
              
              <h3 className="font-semibold mb-4">Kontrole do zgłoszenia</h3>
              
              {/* Responsywny widok tabel/kart */}
              <div className="hidden md:block">
                {/* Widok desktopowy */}
                <DataTable
                  columns={pendingColumns}
                  data={filteredInspections}
                  darkMode={darkMode}
                  onRowClick={(row) => handleViewInspection(row.id)}
                />
              </div>
              
              <div className="md:hidden">
                {/* Widok mobilny */}
                {filteredInspections.length > 0 ? (
                  <div className="space-y-4">
                    {filteredInspections.map(renderMobileCard)}
                  </div>
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    Nie znaleziono kontroli spełniających kryteria
                  </div>
                )}
              </div>
              
              {/* Podsumowanie filtrowania */}
              {filteredInspections.length !== pendingInspections.length && (
                <div className="mt-4 pt-4 border-t dark:border-gray-700 text-sm text-gray-500">
                  Wyświetlanie {filteredInspections.length} z {pendingInspections.length} kontroli do zgłoszenia
                </div>
              )}
              
              {selectedInspections.length > 0 && (
                <div className="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800 dark:bg-yellow-900 dark:border-yellow-500 dark:text-yellow-100 flex items-center">
                  <AlertTriangle size={20} className="mr-2 flex-shrink-0" />
                  <div>
                    <p>Wybrano {selectedInspections.length} kontroli do zgłoszenia</p>
                    <p className="text-sm">Kliknij "Eksportuj do CEEB" aby przygotować zgłoszenie</p>
                  </div>
                </div>
              )}
            </Card>
          ) : (
            <Card darkMode={darkMode} className="py-8">
              <div className="text-center">
                <CheckCircle size={48} className="mx-auto mb-4 text-green-500" />
                <h3 className="text-xl font-semibold mb-2">Wszystko w porządku!</h3>
                <p className="text-gray-500">
                  Nie masz żadnych kontroli oczekujących na zgłoszenie do CEEB
                </p>
              </div>
            </Card>
          )}
          
          <Card darkMode={darkMode}>
            <h3 className="font-semibold mb-4">Przewodnik po zgłoszeniach CEEB</h3>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="mt-1 mr-3 bg-blue-100 text-blue-800 rounded-full h-6 w-6 flex items-center justify-center">
                  1
                </div>
                <div>
                  <p className="font-medium">Wybierz kontrole do zgłoszenia</p>
                  <p className="text-gray-500 text-sm">
                    Zaznacz kontrole, które chcesz zgłosić do CEEB. Możesz zgłosić wiele kontroli jednocześnie.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="mt-1 mr-3 bg-blue-100 text-blue-800 rounded-full h-6 w-6 flex items-center justify-center">
                  2
                </div>
                <div>
                  <p className="font-medium">Wygeneruj plik XML</p>
                  <p className="text-gray-500 text-sm">
                    System wygeneruje plik XML zgodny z formatem wymaganym przez CEEB.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="mt-1 mr-3 bg-blue-100 text-blue-800 rounded-full h-6 w-6 flex items-center justify-center">
                  3
                </div>
                <div>
                  <p className="font-medium">Prześlij do CEEB</p>
                  <p className="text-gray-500 text-sm">
                    Zaloguj się do systemu CEEB i prześlij wygenerowany plik XML.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="mt-1 mr-3 bg-blue-100 text-blue-800 rounded-full h-6 w-6 flex items-center justify-center">
                  4
                </div>
                <div>
                  <p className="font-medium">Potwierdź przesłanie w systemie</p>
                  <p className="text-gray-500 text-sm">
                    Po pomyślnym przesłaniu pliku, oznacz kontrole jako zgłoszone w systemie.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800 flex items-start">
              <AlertTriangle size={20} className="mr-2 flex-shrink-0 mt-1" />
              <p className="text-sm">
                Pamiętaj, że wszystkie kontrole muszą być zgłoszone do CEEB w ciągu 7 dni od ich przeprowadzenia.
                Niezgłoszenie kontroli w terminie może skutkować karą finansową.
              </p>
            </div>
          </Card>
        </div>
      )}
      
      {activeSection === 'history' && (
        <Card darkMode={darkMode}>
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold">Historia zgłoszeń CEEB</h3>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                color="red"
                className="flex items-center"
                onClick={() => {
                  // Symulacja odświeżania danych historii
                  const btn = document.getElementById('refresh-history-btn');
                  if (btn) {
                    btn.disabled = true;
                    btn.innerHTML = '<span class="inline-block animate-spin mr-2">↻</span> Odświeżanie...';
                    
                    setTimeout(() => {
                      btn.disabled = false;
                      btn.innerHTML = '<span class="mr-2">↻</span> Odśwież';
                      alert('Historia zgłoszeń została zaktualizowana.');
                    }, 1000);
                  }
                }}
                id="refresh-history-btn"
              >
                <RefreshCw size={16} className="mr-2" />
                Odśwież
              </Button>
            </div>
          </div>
          
          <DataTable
            columns={historyColumns}
            data={data.ceebReports}
            darkMode={darkMode}
            onRowClick={(row) => handleViewReport(row.id)}
          />
          
          {data.ceebReports.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">Brak historii zgłoszeń CEEB</p>
            </div>
          )}
          
          <div className="mt-4 pt-4 border-t dark:border-gray-700">
            <div className="flex justify-between items-center text-sm text-gray-500">
              <div>
                Wszystkich zgłoszeń: {data.ceebReports.length}
              </div>
              <div className="flex space-x-4">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-green-500 mr-1"></div>
                  <span>Zaakceptowane: {data.ceebReports.filter(r => r.status === 'Zaakceptowane').length}</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-blue-500 mr-1"></div>
                  <span>Oczekujące: {data.ceebReports.filter(r => r.status !== 'Zaakceptowane').length}</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}
      
      {/* Modal eksportu CEEB */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`max-w-lg w-full ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-xl p-6`}>
            <h3 className="text-xl font-semibold mb-4">Eksport do CEEB</h3>
            
            <p className="mb-4">
              Wybrano <strong>{selectedInspections.length}</strong> kontroli do zgłoszenia do CEEB.
            </p>
            
            <div className="max-h-48 overflow-y-auto mb-4 border rounded p-3">
              <ul className="list-disc list-inside">
                {selectedInspections.map(id => {
                  const inspection = data.inspections.find(i => i.id === id);
                  return (
                    <li key={id}>
                      ID: {id} - {inspection?.type} ({inspection?.address}, {inspection?.city})
                    </li>
                  );
                })}
              </ul>
            </div>
            
            {isGeneratingXML ? (
              <div className="border rounded p-4 mb-4 flex justify-center items-center h-32">
                <div className="flex flex-col items-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500 mb-2"></div>
                  <p>Generowanie pliku XML...</p>
                </div>
              </div>
            ) : (
              <>
                {xmlPreview && (
                  <div className="border rounded p-3 mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium">Podgląd XML</h4>
                      <Button 
                        variant="link" 
                        size="sm"
                        onClick={() => {
                          // Symulacja kopiowania do schowka
                          navigator.clipboard.writeText(xmlPreview);
                          alert('Skopiowano do schowka!');
                        }}
                      >
                        Kopiuj
                      </Button>
                    </div>
                    <div className="bg-gray-100 dark:bg-gray-900 p-2 rounded overflow-x-auto max-h-32">
                      <pre className="text-xs">{xmlPreview}</pre>
                    </div>
                  </div>
                )}
              </>
            )}
            
            <div className="p-3 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800 mb-6 dark:bg-yellow-900 dark:border-yellow-500 dark:text-yellow-100">
              <p className="text-sm">
                Po wygenerowaniu pliku XML, zaloguj się do systemu CEEB i prześlij wygenerowany plik.
                Po pomyślnym przesłaniu, oznacz kontrole jako zgłoszone w systemie.
              </p>
            </div>
            
            <div ref={submissionFormRef} className="mb-4">
              <h4 className="font-medium mb-2">Informacje dodatkowe</h4>
              <label className="block text-gray-500 mb-1 text-sm">Uwagi do zgłoszenia (opcjonalne)</label>
              <textarea
                ref={notesRef}
                className={`w-full px-3 py-2 border rounded-lg ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                rows="3"
                placeholder="Np. informacje o specjalnych warunkach kontroli..."
              ></textarea>
            </div>
            
            <div className="flex justify-between">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="confirm-deadline"
                  className="mr-2"
                  defaultChecked={true}
                />
                <label htmlFor="confirm-deadline" className="text-sm">
                  Potwierdzam, że kontrole są zgłaszane w terminie 7 dni
                </label>
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setShowExportModal(false)}
                >
                  Anuluj
                </Button>
                <Button
                  color="red"
                  onClick={handleSubmitToCEEB}
                  disabled={isSubmitting}
                  className="flex items-center"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Zgłaszanie...
                    </>
                  ) : (
                    <>
                      <Upload size={16} className="mr-2" />
                      Zgłoś do CEEB
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Modal szczegółów zgłoszenia */}
      {showSubmissionModal && selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`max-w-lg w-full ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-xl p-6`}>
            <h3 className="text-xl font-semibold mb-4">Szczegóły zgłoszenia CEEB</h3>
            
            <div className="space-y-3 mb-4">
              <div className="flex justify-between">
                <span className="text-gray-500">ID zgłoszenia:</span>
                <span className="font-medium">{selectedReport.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Data zgłoszenia:</span>
                <span className="font-medium">{selectedReport.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Liczba kontroli:</span>
                <span className="font-medium">{selectedReport.inspectionsCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Status:</span>
                <StatusBadge
                  status={selectedReport.status}
                  color={selectedReport.status === 'Zaakceptowane' ? 'green' : 'blue'}
                />
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Zgłaszający:</span>
                <span className="font-medium">{selectedReport.submittedBy}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Data akceptacji:</span>
                <span className="font-medium">{selectedReport.acceptedDate || 'N/A'}</span>
              </div>
            </div>
            
            <div className="border-t pt-4 mt-4">
              <h4 className="font-medium mb-2">Zgłoszone budynki</h4>
              <div className="max-h-48 overflow-y-auto border rounded p-3">
                <ul className="list-disc list-inside">
                  {selectedReport.buildings.map((building, index) => (
                    <li key={index}>
                      {building.address}, {building.city}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            {/* Dodatkowe informacje AI */}
            <div className="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-blue-800 dark:bg-blue-900 dark:bg-opacity-30 dark:border-blue-500 dark:text-blue-100">
              <div className="flex items-center mb-1">
                <BrainCircuit size={16} className="mr-2 text-blue-600 dark:text-blue-400" />
                <p className="font-medium">Analiza AI</p>
              </div>
              <p className="text-sm">
                To zgłoszenie zostało przetworzone w ciągu 2 dni od jego złożenia, co jest szybciej niż średni czas przetwarzania (3.5 dnia). 
                Wszystkie kontrole w tym zgłoszeniu zostały przeprowadzone w terminie 7 dni od daty zgłoszenia.
              </p>
            </div>
            
            <div className="flex justify-end space-x-2 mt-6">
              <Button
                onClick={() => setShowSubmissionModal(false)}
              >
                Zamknij
              </Button>
              <Button
                variant="outline"
                onClick={() => handleDownloadReport(selectedReport.id)}
                className="flex items-center"
                disabled={isExporting}
              >
                {isExporting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 dark:border-gray-400 mr-2"></div>
                    Pobieranie...
                  </>
                ) : (
                  <>
                    <Download size={16} className="mr-2" />
                    Pobierz XML
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CeebReportsList;