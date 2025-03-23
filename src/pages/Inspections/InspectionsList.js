import React, { useState, useEffect } from 'react'; // Added useEffect import
import { Search, Filter, Plus } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import DataTable from '../../components/ui/DataTable';
import StatusBadge from '../../components/ui/StatusBadge';
import InspectionForm from './InspectionForm';

const InspectionsList = ({ data, darkMode, isRefreshing }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [resultFilter, setResultFilter] = useState('all');
  const [ceebFilter, setCeebFilter] = useState('all');
  const [showAddForm, setShowAddForm] = useState(false);
  
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
              <Button variant="link" onClick={() => console.log(`Details ${value}`)}>
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
            <Button variant="link" onClick={() => console.log(`Details ${value}`)}>
              Details
            </Button>
            <Button variant="link" onClick={() => console.log(`Protocol ${value}`)} className="text-green-600">
              Protocol
            </Button>
            {row.ceebStatus === 'Do zgłoszenia' && (
              <Button variant="link" onClick={() => console.log(`CEEB ${value}`)} className="text-red-600">
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
  
  // Filtering logic
  const filteredInspections = data.filter(inspection => {
    // Filtering logic remains the same
    // ...
  });

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
        <Button size="sm" variant="link" onClick={() => console.log(`Details ${inspection.id}`)}>
          Details
        </Button>
        {inspection.ceebStatus === 'Do zgłoszenia' && (
          <Button size="sm" variant="link" className="text-red-600" onClick={() => console.log(`CEEB ${inspection.id}`)}>
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
        <Button 
          onClick={() => setShowAddForm(true)} 
          className="flex items-center"
          color="red"
        >
          <Plus size={16} className="mr-2" />
          Add Inspection
        </Button>
      </div>
      
      {showAddForm && (
        <Card darkMode={darkMode}>
          <h3 className="font-semibold mb-4">Add New Inspection</h3>
          <InspectionForm 
            onSubmit={(data) => {
              console.log('New inspection:', data);
              setShowAddForm(false);
            }} 
            onCancel={() => setShowAddForm(false)}
            darkMode={darkMode}
            buildings={[]} // Pass actual data in production
            clients={[]} // Pass actual data in production
          />
        </Card>
      )}
      
      <Card darkMode={darkMode}>
        <div className="mb-4 flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
          {/* Search and filters stay the same */}
          {/* ... */}
        </div>

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
            aria-label="Inspections table"
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
    </div>
  );
};

export default InspectionsList;