import React, { useState, useEffect } from 'react';
import { Download, AlertTriangle, CheckCircle, Filter, ChevronDown, Search, X, Calendar } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import DataTable from '../../components/ui/DataTable';
import StatusBadge from '../../components/ui/StatusBadge';

const CeebReportsList = ({ data, darkMode }) => {
  const [activeSection, setActiveSection] = useState('pending');
  const [selectedInspections, setSelectedInspections] = useState([]);
  const [showExportModal, setShowExportModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [filteredInspections, setFilteredInspections] = useState([]);
  const [dateFilter, setDateFilter] = useState({ start: '', end: '' });
  const [showSubmissionModal, setShowSubmissionModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  
  // Filter inspections that need to be reported to CEEB
  const pendingInspections = data.inspections.filter(
    inspection => inspection.ceebStatus === 'Do zgłoszenia'
  );
  
  // Initialize filtered inspections based on pending inspections
  useEffect(() => {
    setFilteredInspections(pendingInspections);
  }, [data]);
  
  // Filter inspections based on search term and other filters
  const filterInspections = () => {
    let filtered = [...pendingInspections];
    
    // Filter by search term
    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(inspection => 
        (inspection.id && inspection.id.toString().includes(term)) ||
        (inspection.address && inspection.address.toLowerCase().includes(term)) ||
        (inspection.city && inspection.city.toLowerCase().includes(term)) ||
        (inspection.type && inspection.type.toLowerCase().includes(term))
      );
    }
    
    // Filter by date range
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
    
    setFilteredInspections(filtered);
  };
  
  // Run filter when search term or date filter changes
  useEffect(() => {
    filterInspections();
  }, [searchTerm, dateFilter, data]);
  
  // Reset filters
  const resetFilters = () => {
    setSearchTerm('');
    setDateFilter({ start: '', end: '' });
  };
  
  // Handle individual inspection selection
  const handleInspectionSelect = (inspectionId) => {
    setSelectedInspections(prev => {
      if (prev.includes(inspectionId)) {
        return prev.filter(id => id !== inspectionId);
      } else {
        return [...prev, inspectionId];
      }
    });
  };
  
  // Handle selection of all inspections
  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedInspections(filteredInspections.map(inspection => inspection.id));
    } else {
      setSelectedInspections([]);
    }
  };
  
  // Handle export button click
  const handleExport = () => {
    if (selectedInspections.length === 0) {
      alert('Please select at least one inspection to export.');
      return;
    }
    setShowExportModal(true);
  };
  
  // Handle report submission to CEEB
  const handleSubmitToCEEB = () => {
    if (selectedInspections.length === 0) {
      alert('Please select at least one inspection to submit to CEEB.');
      return;
    }
    
    // In a real app, you would submit the selected inspections to CEEB
    console.log('Submitting to CEEB:', selectedInspections);
    alert(`${selectedInspections.length} inspection(s) would be submitted to CEEB in a real app.`);
    setShowExportModal(false);
    
    // Reset selection after submission
    setSelectedInspections([]);
  };
  
  // Handle inspection details view
  const handleViewInspection = (inspectionId) => {
    const inspection = data.inspections.find(i => i.id === inspectionId);
    if (inspection) {
      console.log('Viewing inspection details:', inspection);
      alert(`Would navigate to inspection details for ID: ${inspectionId}`);
    }
  };
  
  // Handle single inspection report to CEEB
  const handleReportToCEEB = (inspectionId) => {
    setSelectedInspections([inspectionId]);
    setShowExportModal(true);
  };
  
  // Handle report details view
  const handleViewReport = (reportId) => {
    const report = data.ceebReports.find(r => r.id === reportId);
    if (report) {
      setSelectedReport(report);
      setShowSubmissionModal(true);
    }
  };
  
  // Handle report download
  const handleDownloadReport = (reportId) => {
    console.log('Downloading report:', reportId);
    alert(`Report ${reportId} would be downloaded in a real app.`);
  };
  
  // Columns for pending inspections table
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
  
  // Columns for reports history table
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Centralna Ewidencja Emisyjności Budynków</h2>
        <Button 
          onClick={handleExport} 
          className="flex items-center"
          color="red"
          disabled={selectedInspections.length === 0}
        >
          <Download size={16} className="mr-2" />
          Eksportuj do CEEB
        </Button>
      </div>
      
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
                {/* Search input */}
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
              
              {/* Advanced filters */}
              {showAdvancedFilters && (
                <div className="mb-4 p-4 border rounded-lg dark:border-gray-700">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              
              <h3 className="font-semibold mb-4">Kontrole do zgłoszenia</h3>
              
              <DataTable
                columns={pendingColumns}
                data={filteredInspections}
                darkMode={darkMode}
                onRowClick={(row) => handleViewInspection(row.id)}
              />
              
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
          <h3 className="font-semibold mb-4">Historia zgłoszeń CEEB</h3>
          
          <DataTable
            columns={historyColumns}
            data={data.ceebReports}
            darkMode={darkMode}
            onRowClick={(row) => handleViewReport(row.id)}
          />
        </Card>
      )}
      
      {/* Export modal */}
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
            
            <div className="p-3 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800 mb-6">
              <p className="text-sm">
                Po wygenerowaniu pliku XML, zaloguj się do systemu CEEB i prześlij wygenerowany plik.
                Po pomyślnym przesłaniu, oznacz kontrole jako zgłoszone w systemie.
              </p>
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
              >
                Generuj XML
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {/* Report details modal */}
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
              >
                <Download size={16} className="mr-2" />
                Pobierz XML
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CeebReportsList;