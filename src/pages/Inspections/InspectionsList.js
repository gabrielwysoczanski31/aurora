import React, { useState, useEffect } from 'react';
import { Search, Filter, Plus, Download, AlertCircle } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import DataTable from '../../components/ui/DataTable';
import StatusBadge from '../../components/ui/StatusBadge';
import InspectionForm from './InspectionForm';

const InspectionsList = ({ data = [], darkMode, isRefreshing }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [resultFilter, setResultFilter] = useState('all');
  const [ceebFilter, setCeebFilter] = useState('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [filteredInspections, setFilteredInspections] = useState([]);
  const [showCEEBModal, setShowCEEBModal] = useState(false);
  const [selectedInspection, setSelectedInspection] = useState(null);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  
  // Filter inspections when filters change
  useEffect(() => {
    filterInspections();
  }, [data, searchTerm, typeFilter, resultFilter, ceebFilter]);

  // Handle filtering
  const filterInspections = () => {
    let filtered = [...data];
    
    // Filter by search term
    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(inspection => 
        (inspection.id && inspection.id.toString().includes(term)) ||
        (inspection.address && inspection.address.toLowerCase().includes(term)) ||
        (inspection.city && inspection.city.toLowerCase().includes(term))
      );
    }
    
    // Filter by type
    if (typeFilter !== 'all') {
      filtered = filtered.filter(inspection => inspection.type === typeFilter);
    }
    
    // Filter by result
    if (resultFilter !== 'all') {
      filtered = filtered.filter(inspection => inspection.result === resultFilter);
    }
    
    // Filter by CEEB status
    if (ceebFilter !== 'all') {
      filtered = filtered.filter(inspection => inspection.ceebStatus === ceebFilter);
    }
    
    setFilteredInspections(filtered);
  };

  // Add new inspection
  const handleAddInspection = (inspectionData) => {
    console.log('New inspection:', inspectionData);
    // In a real app, you would add this to your state/database
    alert(`Inspection would be added in a real app. Type: ${inspectionData.type}`);
    setShowAddForm(false);
  };

  // View inspection details
  const handleViewDetails = (inspectionId) => {
    const inspection = data.find(i => i.id === inspectionId);
    if (inspection) {
      console.log('Viewing inspection details:', inspection);
      // In a real app, you would navigate to details page
      alert(`Would navigate to inspection details for ID: ${inspectionId}`);
    }
  };

  // Handle protocol action
  const handleProtocol = (inspectionId) => {
    console.log('Generating protocol for inspection:', inspectionId);
    // In a real app, you would generate/show the protocol
    alert(`Would generate/show protocol for inspection ID: ${inspectionId}`);
  };

  // Show CEEB reporting modal
  const handleCEEBClick = (inspectionId) => {
    const inspection = data.find(i => i.id === inspectionId);
    if (inspection) {
      setSelectedInspection(inspection);
      setShowCEEBModal(true);
    }
  };

  // Submit to CEEB
  const handleCEEBSubmit = () => {
    if (selectedInspection) {
      console.log('Submitting to CEEB:', selectedInspection);
      // In a real app, you would submit to CEEB
      alert(`Would submit inspection ID: ${selectedInspection.id} to CEEB`);
      setShowCEEBModal(false);
      setSelectedInspection(null);
    }
  };

  // Bulk export selected inspections
  const handleBulkExport = () => {
    alert('Would export selected inspections in a real app.');
  };
  
  // Responsive design column configuration
  const getColumns = () => {
    // On small screens, show fewer columns
    const isMobile = window.innerWidth < 768;
    
    if (isMobile) {
      return [
        { header: 'ID', accessor: 'id' },
        { header: 'Type', accessor: 'type' },
        { 
          header: 'Result', 
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
          header: 'Actions', 
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
                Details
              </Button>
            </div>
          )
        },
      ];
    }
    
    // Full columns for desktop view
    return [
      { header: 'ID', accessor: 'id' },
      { header: 'Type', accessor: 'type' },
      { header: 'Address', accessor: 'address' },
      { header: 'City', accessor: 'city' },
      { header: 'Date', accessor: 'date' },
      { 
        header: 'Result', 
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
        header: 'CEEB Status', 
        accessor: 'ceebStatus',
        cell: (value) => (
          <StatusBadge 
            status={value} 
            color={value === 'Zgłoszony do CEEB' ? 'green' : 'yellow'} 
          />
        )
      },
      { 
        header: 'Actions', 
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
              Details
            </Button>
            <Button 
              variant="link" 
              onClick={(e) => {
                e.stopPropagation();
                handleProtocol(value);
              }} 
              className="text-green-600"
            >
              Protocol
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
  
  // Memoize the columns to avoid constant recalculation
  const [columns, setColumns] = useState(getColumns());
  
  // Update columns on window resize
  useEffect(() => {
    const handleResize = () => {
      setColumns(getColumns());
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Card styles for mobile optimization
  const cardClasses = "p-4 rounded-lg shadow mb-4 " + 
    (darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800");

  // Mobile card renderer for each inspection
  const renderMobileCard = (inspection) => (
    <div key={inspection.id} className={cardClasses}>
      <div className="flex justify-between items-start">
        <div>
          <span className="text-sm text-gray-500">ID: {inspection.id}</span>
          <h3 className="font-semibold">{inspection.type}</h3>
          <p className="text-sm">{inspection.address}, {inspection.city}</p>
          <p className="text-sm">{inspection.date}</p>
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
          onClick={() => handleViewDetails(inspection.id)}
        >
          Details
        </Button>
        {inspection.ceebStatus === 'Do zgłoszenia' && (
          <Button 
            size="sm" 
            variant="link" 
            className="text-red-600" 
            onClick={() => handleCEEBClick(inspection.id)}
          >
            CEEB
          </Button>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Inspections</h2>
        <div className="flex space-x-2">
          <Button 
            onClick={() => setShowAddForm(true)} 
            className="flex items-center"
            color="red"
          >
            <Plus size={16} className="mr-2" />
            Add Inspection
          </Button>
          
          <Button
            variant="outline"
            className="flex items-center"
            color="red"
            onClick={handleBulkExport}
          >
            <Download size={16} className="mr-2" />
            Export
          </Button>
        </div>
      </div>
      
      {showAddForm && (
        <Card darkMode={darkMode}>
          <h3 className="font-semibold mb-4">Add New Inspection</h3>
          <InspectionForm 
            onSubmit={handleAddInspection} 
            onCancel={() => setShowAddForm(false)}
            darkMode={darkMode}
            buildings={[]} // Pass actual data in production
            clients={[]} // Pass actual data in production
          />
        </Card>
      )}
      
      <Card darkMode={darkMode}>
        <div className="mb-4 flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search inspections..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`pl-9 pr-3 py-2 border rounded-lg w-full ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
            />
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          </div>
          
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className={`px-3 py-2 border rounded-lg ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
          >
            <option value="all">All Types</option>
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
            <option value="all">All Results</option>
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
            <span>{showAdvancedFilters ? 'Hide Filters' : 'Filters'}</span>
          </Button>
        </div>
        
        {/* Advanced filters panel */}
        {showAdvancedFilters && (
          <div className="mb-4 p-4 border rounded-lg dark:border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-gray-500 mb-1">CEEB Status</label>
                <select
                  value={ceebFilter}
                  onChange={(e) => setCeebFilter(e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                >
                  <option value="all">All Statuses</option>
                  <option value="Zgłoszony do CEEB">Submitted to CEEB</option>
                  <option value="Do zgłoszenia">To be submitted</option>
                </select>
              </div>
              
              <div>
                <label className="block text-gray-500 mb-1">Date Range</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="date"
                    className={`px-3 py-2 border rounded-lg ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                  />
                  <input
                    type="date"
                    className={`px-3 py-2 border rounded-lg ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-gray-500 mb-1">City</label>
                <select
                  className={`w-full px-3 py-2 border rounded-lg ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                >
                  <option value="all">All Cities</option>
                  <option value="Warsaw">Warsaw</option>
                  <option value="Krakow">Krakow</option>
                  <option value="Poznan">Poznan</option>
                  <option value="Wroclaw">Wroclaw</option>
                </select>
              </div>
            </div>
            
            <div className="mt-4 flex justify-end space-x-2">
              <Button 
                variant="outline" 
                color="red"
                onClick={() => {
                  setSearchTerm('');
                  setTypeFilter('all');
                  setResultFilter('all');
                  setCeebFilter('all');
                }}
              >
                Clear Filters
              </Button>
              <Button color="red">
                Apply Filters
              </Button>
            </div>
          </div>
        )}

        {/* Loading indicator */}
        {isRefreshing && (
          <div className="flex justify-center items-center p-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-500"></div>
            <span className="ml-2 text-sm text-gray-500">Refreshing data...</span>
          </div>
        )}

        {/* Responsive display logic */}
        <div className="hidden md:block">
          {/* Desktop view - use DataTable component */}
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
          {/* Mobile view - card-based layout */}
          {filteredInspections.length > 0 ? (
            <div className="space-y-4">
              {filteredInspections.map(renderMobileCard)}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No inspections found matching your criteria
            </div>
          )}
        </div>
      </Card>
      
      {/* CEEB Submission Modal */}
      {showCEEBModal && selectedInspection && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`max-w-md w-full p-6 rounded-lg shadow-xl ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="flex items-start mb-4">
              <div className="mr-3 text-red-500">
                <AlertCircle size={24} />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Submit to CEEB</h3>
                <p className="text-gray-500 mt-1">
                  Submit inspection #{selectedInspection.id} from {selectedInspection.date} to CEEB?
                </p>
                
                <div className="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800 dark:bg-yellow-900 dark:border-yellow-500 dark:text-yellow-100">
                  <p className="text-sm">
                    Remember that all inspections must be submitted to CEEB within 7 days.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mt-4">
              <label className="block text-gray-500 mb-1">Notes (optional)</label>
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
                Cancel
              </Button>
              <Button 
                color="red"
                onClick={handleCEEBSubmit}
              >
                Submit to CEEB
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InspectionsList;