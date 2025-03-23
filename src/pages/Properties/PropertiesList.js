import React, { useState, useEffect } from 'react';
import { Search, Filter, Plus, AlertTriangle } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import DataTable from '../../components/ui/DataTable';
import StatusBadge from '../../components/ui/StatusBadge';
import PropertyForm from './PropertyForm';

const PropertiesList = ({ data = [], darkMode, onPropertySelect, isRefreshing }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState(null);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  
  // Initialize filtered properties
  useEffect(() => {
    filterProperties();
  }, [data, searchTerm, statusFilter]);
  
  // Filter properties based on search term and status
  const filterProperties = () => {
    let filtered = [...data];
    
    // Filter by search term
    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(property => 
        property.name.toLowerCase().includes(term) ||
        property.address.toLowerCase().includes(term)
      );
    }
    
    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(property => property.status === statusFilter);
    }
    
    setFilteredProperties(filtered);
  };

  // Handle property form submission
  const handlePropertySubmit = (propertyData) => {
    console.log('New property data:', propertyData);
    // In a real app, you would add this to your state/database
    // For demo, we'll just close the form and show an alert
    setShowAddForm(false);
    alert(`Property "${propertyData.name}" would be saved in a real app.`);
  };

  // Handle property edit
  const handleEditProperty = (propertyId) => {
    const property = data.find(p => p.id === propertyId);
    if (property) {
      // In a real app, you would navigate to edit page or show edit form
      // For now, we'll just show an alert
      alert(`Editing property: ${property.name}`);
    }
  };

  // Handle property delete confirmation
  const handleDeleteClick = (propertyId) => {
    const property = data.find(p => p.id === propertyId);
    if (property) {
      setPropertyToDelete(property);
      setShowConfirmDelete(true);
    }
  };

  // Handle confirmed delete
  const handleConfirmDelete = () => {
    if (propertyToDelete) {
      // In a real app, you would delete from your state/database
      console.log(`Deleting property: ${propertyToDelete.name}`);
      alert(`Property "${propertyToDelete.name}" would be deleted in a real app.`);
    }
    // Close confirmation and reset
    setShowConfirmDelete(false);
    setPropertyToDelete(null);
  };

  // Handle property selection (for details view)
  const handleSelectProperty = (property) => {
    if (onPropertySelect) {
      onPropertySelect(property);
    } else {
      // If no selection handler passed, show alert
      alert(`Would navigate to details for: ${property.name}`);
    }
  };

  const columns = [
    { header: 'ID', accessor: 'id' },
    { header: 'Nazwa', accessor: 'name' },
    { header: 'Adres', accessor: 'address' },
    { 
      header: 'Status', 
      accessor: 'status',
      cell: (value) => (
        <StatusBadge 
          status={value} 
          color={
            value === 'Wynajęte' ? 'green' : 
            value === 'Dostępne' ? 'blue' : 
            value === 'W remoncie' ? 'yellow' : 
            'purple'
          } 
        />
      )
    },
    { 
      header: 'Powierzchnia', 
      accessor: 'size',
      cell: (value) => `${value} m²` 
    },
    { 
      header: 'Czynsz', 
      accessor: 'price',
      cell: (value) => `${value.toLocaleString()} PLN`,
      align: 'right'
    },
    { 
      header: 'Akcje', 
      accessor: 'id',
      cell: (value, row) => (
        <div className="flex space-x-2">
          <Button 
            variant="link" 
            onClick={(e) => {
              e.stopPropagation(); // Prevent row click
              handleEditProperty(value);
            }}
          >
            Edytuj
          </Button>
          <Button 
            variant="link" 
            onClick={(e) => {
              e.stopPropagation(); // Prevent row click
              handleDeleteClick(value);
            }} 
            className="text-red-600"
          >
            Usuń
          </Button>
        </div>
      )
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Mieszkania</h2>
        <Button 
          onClick={() => setShowAddForm(true)} 
          className="flex items-center"
        >
          <Plus size={16} className="mr-2" />
          Dodaj mieszkanie
        </Button>
      </div>
      
      {showAddForm && (
        <Card darkMode={darkMode}>
          <h3 className="font-semibold mb-4">Dodaj nowe mieszkanie</h3>
          <PropertyForm 
            onSubmit={handlePropertySubmit} 
            onCancel={() => setShowAddForm(false)}
            darkMode={darkMode}
          />
        </Card>
      )}
      
      <Card darkMode={darkMode}>
        <div className="mb-4 flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Szukaj mieszkania..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`pl-9 pr-3 py-2 border rounded-lg w-full ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
            />
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className={`px-3 py-2 border rounded-lg ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
          >
            <option value="all">Wszystkie statusy</option>
            <option value="Wynajęte">Wynajęte</option>
            <option value="Dostępne">Dostępne</option>
            <option value="W remoncie">W remoncie</option>
            <option value="Rezerwacja">Rezerwacja</option>
          </select>
          
          <Button 
            variant="outline" 
            className="flex items-center"
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
          >
            <Filter size={16} className="mr-2" />
            {showAdvancedFilters ? 'Ukryj filtry' : 'Więcej filtrów'}
          </Button>
        </div>

        {/* Advanced filters (collapsed by default) */}
        {showAdvancedFilters && (
          <div className="mb-4 p-4 border rounded-lg dark:border-gray-700">
            <h4 className="font-medium mb-3">Zaawansowane filtry</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Price range */}
              <div>
                <label className="block text-gray-500 mb-1">Przedział cenowy</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    placeholder="Od"
                    className={`px-3 py-2 border rounded-lg ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                  />
                  <input
                    type="number"
                    placeholder="Do"
                    className={`px-3 py-2 border rounded-lg ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                  />
                </div>
              </div>
              
              {/* Size range */}
              <div>
                <label className="block text-gray-500 mb-1">Powierzchnia (m²)</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    placeholder="Od"
                    className={`px-3 py-2 border rounded-lg ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                  />
                  <input
                    type="number"
                    placeholder="Do"
                    className={`px-3 py-2 border rounded-lg ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                  />
                </div>
              </div>
              
              {/* Number of rooms */}
              <div>
                <label className="block text-gray-500 mb-1">Liczba pokoi</label>
                <select
                  className={`w-full px-3 py-2 border rounded-lg ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                >
                  <option value="">Wszystkie</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4+">4+</option>
                </select>
              </div>
            </div>
            
            <div className="mt-4 flex justify-end space-x-2">
              <Button variant="outline" onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
              }}>
                Wyczyść filtry
              </Button>
              <Button>
                Zastosuj filtry
              </Button>
            </div>
          </div>
        )}

        <DataTable
          columns={columns}
          data={filteredProperties}
          darkMode={darkMode}
          onRowClick={(row) => handleSelectProperty(row)}
          pagination={{
            startItem: 1,
            endItem: filteredProperties.length,
            totalItems: filteredProperties.length
          }}
          currentPage={1}
          totalPages={1}
          onPageChange={() => {}}
        />
        
        {filteredProperties.length === 0 && !isRefreshing && (
          <div className="text-center py-8">
            <p className="text-gray-500">Nie znaleziono mieszkań spełniających kryteria</p>
          </div>
        )}
        
        {isRefreshing && (
          <div className="absolute inset-0 bg-black bg-opacity-10 flex items-center justify-center rounded-lg">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        )}
      </Card>
      
      {/* Delete confirmation modal */}
      {showConfirmDelete && propertyToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`max-w-md w-full p-6 rounded-lg shadow-xl ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="flex items-start mb-4">
              <div className="mr-3 text-red-500">
                <AlertTriangle size={24} />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Potwierdź usunięcie</h3>
                <p className="text-gray-500 mt-1">
                  Czy na pewno chcesz usunąć mieszkanie "{propertyToDelete.name}"? 
                  Ta operacja jest nieodwracalna.
                </p>
              </div>
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button 
                variant="outline" 
                onClick={() => {
                  setShowConfirmDelete(false);
                  setPropertyToDelete(null);
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

export default PropertiesList;