import React, { useState, useEffect } from 'react';
import { Search, Filter, Plus, Building, MapPin, Home, X, AlertTriangle, FileText, Thermometer } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import DataTable from '../../components/ui/DataTable';
import BuildingForm from './BuildingForm';

const BuildingsList = ({ data, darkMode, clients = [] }) => {
  // State management for search, filters, and displayed data
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredBuildings, setFilteredBuildings] = useState(data || []);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [cityFilter, setCityFilter] = useState('all');
  const [heatingTypeFilter, setHeatingTypeFilter] = useState('all');
  const [lastInspectionFilter, setLastInspectionFilter] = useState('all');
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [buildingToEdit, setBuildingToEdit] = useState(null);
  
  // Initialize filtered buildings whenever data changes
  useEffect(() => {
    setFilteredBuildings(data || []);
  }, [data]);
  
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
    
    // Filter by city
    if (cityFilter !== 'all') {
      filtered = filtered.filter(building => building.city === cityFilter);
    }
    
    // Filter by heating type
    if (heatingTypeFilter !== 'all') {
      filtered = filtered.filter(building => building.heatingType === heatingTypeFilter);
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
  };
  
  // Run filtering whenever any filter changes
  useEffect(() => {
    handleFilter();
  }, [searchTerm, cityFilter, heatingTypeFilter, lastInspectionFilter, data]);
  
  // Reset all filters
  const resetFilters = () => {
    setSearchTerm('');
    setCityFilter('all');
    setHeatingTypeFilter('all');
    setLastInspectionFilter('all');
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
    // In a real app, this would call an API to add/update the building
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
      setSelectedBuilding(building);
      setShowDeleteModal(true);
    }
  };
  
  // Confirm building delete
  const handleConfirmDelete = () => {
    if (selectedBuilding) {
      // In a real app, this would call an API to delete the building
      console.log(`Usuwanie budynku: ${selectedBuilding.address}`);
      alert(`Budynek ${selectedBuilding.address} został usunięty.`);
      setShowDeleteModal(false);
      setSelectedBuilding(null);
    }
  };
  
  // Handle building details view
  const handleViewDetails = (buildingId) => {
    const building = data.find(b => b.id === buildingId);
    if (building) {
      // In a real app, this would navigate to a building details page
      console.log('Szczegóły budynku:', building);
      alert(`Przejście do szczegółów budynku: ${building.address}`);
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
  
  // Available cities for filtering
  const cities = ['Warszawa', 'Kraków', 'Poznań', 'Wrocław', 'Gdańsk', 'Katowice', 'Łódź', 'Lublin'];
  
  // Available heating types for filtering
  const heatingTypes = ['Gazowe', 'Elektryczne', 'Węglowe', 'Olejowe', 'Kominkowe'];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Budynki</h2>
        <Button 
          color="red" 
          className="flex items-center"
          onClick={handleAddBuilding}
        >
          <Plus size={16} className="mr-2" />
          Dodaj budynek
        </Button>
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
            </Button>
            
            {Object.keys({
              searchTerm,
              cityFilter: cityFilter !== 'all' ? cityFilter : null,
              heatingTypeFilter: heatingTypeFilter !== 'all' ? heatingTypeFilter : null,
              lastInspectionFilter: lastInspectionFilter !== 'all' ? lastInspectionFilter : null
            }).filter(key => key === 'searchTerm' ? !!searchTerm : !!key).length > 0 && (
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
                    {cities.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
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
                    {heatingTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
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
        {(cityFilter !== 'all' || heatingTypeFilter !== 'all' || lastInspectionFilter !== 'all') && (
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
          </div>
        )}
      </Card>
      
      <Card darkMode={darkMode}>
        <div className="overflow-x-auto">
          <table className="min-w-full data-table chimney">
            <thead>
              <tr className={darkMode ? 'border-b border-gray-700' : 'border-b'}>
                <th className="py-2 text-left">ID</th>
                <th className="py-2 text-left">Adres</th>
                <th className="py-2 text-left">Miasto</th>
                <th className="py-2 text-left">Kod pocztowy</th>
                <th className="py-2 text-left">Klient</th>
                <th className="py-2 text-left">Rodzaj ogrzewania</th>
                <th className="py-2 text-left">Ostatnia kontrola</th>
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
                  <td className="py-2">{building.id}</td>
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
      
      {/* Delete confirmation modal */}
      {showDeleteModal && selectedBuilding && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`max-w-md w-full p-6 rounded-lg shadow-xl ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="flex items-start mb-4">
              <div className="mr-3 text-red-500">
                <AlertTriangle size={24} />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Potwierdź usunięcie</h3>
                <p className="text-gray-500 mt-1">
                  Czy na pewno chcesz usunąć budynek pod adresem "{selectedBuilding.address}"? 
                  Ta operacja jest nieodwracalna.
                </p>
              </div>
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button 
                variant="outline" 
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedBuilding(null);
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