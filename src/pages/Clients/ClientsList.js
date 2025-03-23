import React, { useState, useEffect } from 'react';
import { Search, Filter, Plus, User, Building, Phone, Mail, MapPin, ChevronDown, Save, ArrowDownToLine, X, AlertTriangle } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import DataTable from '../../components/ui/DataTable';
import AdvancedFilter from '../../components/ui/AdvancedFilter';
import ClientForm from './ClientForm';

const ClientsList = ({ data = [], darkMode, type = 'property' }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredClients, setFilteredClients] = useState([]);
  const [clients, setClients] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [showSavedFiltersDropdown, setShowSavedFiltersDropdown] = useState(false);
  const [showSaveFilterModal, setShowSaveFilterModal] = useState(false);
  const [newFilterName, setNewFilterName] = useState('');
  const [currentFilters, setCurrentFilters] = useState({});
  const [savedFilters, setSavedFilters] = useState([
    { 
      id: 'new-clients', 
      name: 'Nowi klienci', 
      filters: { sortBy: 'newest', searchTerm: '' } 
    },
    { 
      id: 'warsaw-clients', 
      name: 'Klienci z Warszawy', 
      filters: { city: 'Warszawa', searchTerm: '' } 
    }
  ]);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [clientToDelete, setClientToDelete] = useState(null);
  const [clientToEdit, setClientToEdit] = useState(null);
  
  // Initialize client data
  useEffect(() => {
    setClients(data || []);
    setFilteredClients(data || []);
  }, [data]);
  
  // Filtering function
  const handleFilter = (filters) => {
    let filtered = [...clients];
    
    // Filter by search term
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(client => 
        client.name.toLowerCase().includes(searchLower) ||
        (client.email && client.email.toLowerCase().includes(searchLower)) ||
        (client.city && client.city.toLowerCase().includes(searchLower)) ||
        (client.address && client.address.toLowerCase().includes(searchLower))
      );
    }
    
    // Filter by city (if available)
    if (filters.city && filters.city !== 'all' && type === 'chimney') {
      filtered = filtered.filter(client => client.city === filters.city);
    }
    
    // Sorting
    if (filters.sortBy) {
      switch (filters.sortBy) {
        case 'nameAsc':
          filtered.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case 'nameDesc':
          filtered.sort((a, b) => b.name.localeCompare(a.name));
          break;
        case 'newest':
          filtered.sort((a, b) => {
            if (a.lastInspection && b.lastInspection) {
              return new Date(b.lastInspection.split('.').reverse().join('-')) - 
                     new Date(a.lastInspection.split('.').reverse().join('-'));
            }
            return 0;
          });
          break;
        default:
          break;
      }
    }
    
    setFilteredClients(filtered);
    setCurrentFilters(filters);
  };
  
  // Handle adding a new client
  const handleAddClient = (newClient) => {
    // In a real app, you would add this client to your database
    console.log('Adding new client:', newClient);
    
    // For demo purposes, add to local state
    const updatedClients = [...clients, newClient];
    setClients(updatedClients);
    setFilteredClients(updatedClients);
    setShowAddForm(false);
    
    // Show success message
    alert(`Client "${newClient.name}" added successfully!`);
  };
  
  // Handle editing a client
  const handleEditClient = (clientId) => {
    const client = clients.find(c => c.id === clientId);
    if (client) {
      setClientToEdit(client);
      setShowAddForm(true);
    }
  };
  
  // Handle client edit submission
  const handleEditSubmit = (updatedClient) => {
    // In a real app, you would update this client in your database
    console.log('Updating client:', updatedClient);
    
    // For demo purposes, update local state
    const updatedClients = clients.map(client => 
      client.id === updatedClient.id ? updatedClient : client
    );
    
    setClients(updatedClients);
    setFilteredClients(updatedClients);
    setClientToEdit(null);
    setShowAddForm(false);
    
    // Show success message
    alert(`Client "${updatedClient.name}" updated successfully!`);
  };
  
  // Handle client deletion confirmation
  const handleDeleteClick = (clientId) => {
    const client = clients.find(c => c.id === clientId);
    if (client) {
      setClientToDelete(client);
      setShowConfirmDelete(true);
    }
  };
  
  // Handle confirmed client deletion
  const handleConfirmDelete = () => {
    if (clientToDelete) {
      // In a real app, you would delete this client from your database
      console.log('Deleting client:', clientToDelete);
      
      // For demo purposes, remove from local state
      const updatedClients = clients.filter(client => client.id !== clientToDelete.id);
      setClients(updatedClients);
      setFilteredClients(updatedClients);
      
      // Clear state and close modal
      setClientToDelete(null);
      setShowConfirmDelete(false);
      
      // Show success message
      alert(`Client "${clientToDelete.name}" deleted successfully!`);
    }
  };
  
  // Handle saving a filter
  const handleSaveFilter = () => {
    if (!newFilterName.trim()) return;
    
    const newFilter = {
      id: Date.now().toString(),
      name: newFilterName,
      filters: { ...currentFilters }
    };
    
    const updatedFilters = [...savedFilters, newFilter];
    setSavedFilters(updatedFilters);
    setShowSaveFilterModal(false);
    setNewFilterName('');
    
    // Show success message
    alert(`Filter "${newFilterName}" saved successfully!`);
  };
  
  // Handle deleting a saved filter
  const handleDeleteFilter = (filterId) => {
    const updatedFilters = savedFilters.filter(filter => filter.id !== filterId);
    setSavedFilters(updatedFilters);
  };
  
  // Handle applying a saved filter
  const handleApplySavedFilter = (filter) => {
    handleFilter(filter.filters);
    setCurrentFilters(filter.filters);
    setShowSavedFiltersDropdown(false);
  };
  
  // View client details
  const handleViewClientDetails = (clientId) => {
    const client = clients.find(c => c.id === clientId);
    if (client) {
      console.log('Viewing client details:', client);
      // In a real app, you would navigate to client details page
      alert(`Would navigate to client details for: ${client.name}`);
    }
  };
  
  // View client buildings (chimney interface only)
  const handleViewBuildings = (clientId) => {
    const client = clients.find(c => c.id === clientId);
    if (client && type === 'chimney') {
      console.log('Viewing buildings for client:', client);
      // In a real app, you would navigate to buildings page with filter
      alert(`Would navigate to buildings for client: ${client.name}`);
    }
  };

  // Render different versions of the component depending on type
  if (type === 'chimney') {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Klienci</h2>
          <Button 
            color="red" 
            className="flex items-center"
            onClick={() => {
              setClientToEdit(null);
              setShowAddForm(true);
            }}
          >
            <Plus size={16} className="mr-2" />
            Dodaj klienta
          </Button>
        </div>
        
        {/* Client form */}
        {showAddForm && (
          <Card darkMode={darkMode}>
            <h3 className="font-semibold mb-4">
              {clientToEdit ? 'Edytuj klienta' : 'Dodaj nowego klienta'}
            </h3>
            <ClientForm 
              client={clientToEdit}
              onSubmit={clientToEdit ? handleEditSubmit : handleAddClient} 
              onCancel={() => {
                setShowAddForm(false);
                setClientToEdit(null);
              }}
              darkMode={darkMode}
              type="chimney"
            />
          </Card>
        )}
        
        {/* Search and filters */}
        <Card darkMode={darkMode} className="mb-6">
          <div className="flex flex-col md:flex-row md:space-x-2 space-y-2 md:space-y-0">
            {/* Search input */}
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Szukaj klienta..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  handleFilter({ ...currentFilters, searchTerm: e.target.value });
                }}
                className={`pl-9 pr-3 py-2 border rounded-lg w-full ${
                  darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                }`}
              />
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
              {searchTerm && (
                <button 
                  onClick={() => {
                    setSearchTerm('');
                    handleFilter({ ...currentFilters, searchTerm: '' });
                  }}
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
              
              <div className="relative">
                <Button 
                  variant="outline" 
                  className="flex items-center"
                  onClick={() => setShowSavedFiltersDropdown(!showSavedFiltersDropdown)}
                >
                  <ArrowDownToLine size={16} className="mr-1" />
                  <span className="hidden lg:inline">Zapisane</span>
                  <ChevronDown size={16} className="ml-1" />
                </Button>
                
                {/* Saved filters dropdown */}
                {showSavedFiltersDropdown && (
                  <div className={`absolute right-0 mt-1 w-48 ${
                    darkMode ? 'bg-gray-800' : 'bg-white'
                  } rounded-lg shadow-lg border ${
                    darkMode ? 'border-gray-700' : 'border-gray-200'
                  } z-10 p-1`}>
                    {savedFilters.map((filter) => (
                      <div 
                        key={filter.id}
                        className={`flex justify-between items-center p-2 rounded-md cursor-pointer ${
                          darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                        }`}
                      >
                        <button 
                          onClick={() => handleApplySavedFilter(filter)}
                          className="flex-1 text-left"
                        >
                          {filter.name}
                        </button>
                        <button 
                          onClick={() => handleDeleteFilter(filter.id)}
                          className="text-gray-500 hover:text-red-500"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                    <div className="border-t dark:border-gray-700 mt-1 pt-1">
                      <button 
                        className="w-full text-left p-2 rounded-md text-blue-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={() => {
                          setShowSavedFiltersDropdown(false);
                          setShowSaveFilterModal(true);
                        }}
                      >
                        <span className="flex items-center">
                          <Save size={16} className="mr-1" />
                          Zapisz aktualny filtr
                        </span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
              
              {Object.keys(currentFilters).length > 1 || (searchTerm && searchTerm.length > 0) ? (
                <Button 
                  variant="outline" 
                  className="flex items-center"
                  onClick={() => {
                    setSearchTerm('');
                    setCurrentFilters({});
                    setFilteredClients(clients);
                  }}
                >
                  <X size={16} className="mr-1" />
                  <span className="hidden lg:inline">Wyczyść</span>
                </Button>
              ) : null}
            </div>
          </div>
          
          {/* Advanced filters */}
          {showAdvancedFilters && (
            <div className="mt-4 pt-4 border-t dark:border-gray-700">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-gray-500 mb-1">Miasto</label>
                  <select
                    value={currentFilters.city || 'all'}
                    onChange={(e) => handleFilter({...currentFilters, city: e.target.value})}
                    className={`w-full px-3 py-2 border rounded-lg ${
                      darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                    }`}
                  >
                    <option value="all">Wszystkie miasta</option>
                    <option value="Warszawa">Warszawa</option>
                    <option value="Kraków">Kraków</option>
                    <option value="Poznań">Poznań</option>
                    <option value="Wrocław">Wrocław</option>
                    <option value="Gdańsk">Gdańsk</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-gray-500 mb-1">Sortowanie</label>
                  <select
                    value={currentFilters.sortBy || 'nameAsc'}
                    onChange={(e) => handleFilter({...currentFilters, sortBy: e.target.value})}
                    className={`w-full px-3 py-2 border rounded-lg ${
                      darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                    }`}
                  >
                    <option value="nameAsc">Nazwa (A-Z)</option>
                    <option value="nameDesc">Nazwa (Z-A)</option>
                    <option value="newest">Od najnowszych</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-gray-500 mb-1">Budynki</label>
                  <select
                    value={currentFilters.buildingsCount || 'all'}
                    onChange={(e) => handleFilter({...currentFilters, buildingsCount: e.target.value})}
                    className={`w-full px-3 py-2 border rounded-lg ${
                      darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                    }`}
                  >
                    <option value="all">Wszystkie</option>
                    <option value="1">1 budynek</option>
                    <option value="2-5">2-5 budynków</option>
                    <option value="6+">6 i więcej budynków</option>
                  </select>
                </div>
              </div>
              
              <div className="mt-4 flex justify-between">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="flex items-center"
                  onClick={() => setShowSaveFilterModal(true)}
                >
                  <Save size={16} className="mr-1" />
                  Zapisz filtr
                </Button>
                
                <div className="flex space-x-2">
                  <Button 
                    variant="secondary" 
                    size="sm"
                    onClick={() => {
                      setSearchTerm('');
                      setCurrentFilters({});
                      setFilteredClients(clients);
                    }}
                  >
                    Wyczyść filtry
                  </Button>
                  
                  <Button 
                    size="sm"
                    onClick={() => handleFilter(currentFilters)}
                    color="red"
                  >
                    Zastosuj
                  </Button>
                </div>
              </div>
            </div>
          )}
          
          {/* Active filters */}
          {Object.keys(currentFilters).filter(key => key !== 'searchTerm' && currentFilters[key] !== 'all' && currentFilters[key]).length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {Object.entries(currentFilters)
                .filter(([key, value]) => key !== 'searchTerm' && value !== 'all' && value)
                .map(([key, value]) => {
                  let label = key;
                  let displayValue = value;
                  
                  // Format labels
                  if (key === 'city') label = 'Miasto';
                  else if (key === 'sortBy') {
                    label = 'Sortowanie';
                    if (value === 'nameAsc') displayValue = 'Nazwa (A-Z)';
                    else if (value === 'nameDesc') displayValue = 'Nazwa (Z-A)';
                    else if (value === 'newest') displayValue = 'Od najnowszych';
                  }
                  else if (key === 'buildingsCount') label = 'Budynki';
                  
                  return (
                    <div 
                      key={key}
                      className={`flex items-center px-2 py-1 rounded-full text-sm ${
                        darkMode ? 'bg-gray-700' : 'bg-gray-200'
                      }`}
                    >
                      <span>{label}: {displayValue}</span>
                      <button
                        onClick={() => {
                          const newFilters = { ...currentFilters };
                          delete newFilters[key];
                          handleFilter(newFilters);
                        }}
                        className="ml-1 text-gray-500 hover:text-gray-700"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  );
                })
              }
            </div>
          )}
        </Card>
        
        {/* Save filter modal */}
        {showSaveFilterModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
            <div className={`max-w-md w-full ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-xl p-6`}>
              <h3 className="text-lg font-semibold mb-4">Zapisz filtr</h3>
              
              <div className="mb-4">
                <label className="block text-gray-500 mb-1">Nazwa filtra</label>
                <input
                  type="text"
                  value={newFilterName}
                  onChange={(e) => setNewFilterName(e.target.value)}
                  placeholder="np. Klienci z Warszawy"
                  className={`w-full px-3 py-2 border rounded-lg ${
                    darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                  }`}
                />
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button 
                  variant="secondary"
                  onClick={() => setShowSaveFilterModal(false)}
                >
                  Anuluj
                </Button>
                
                <Button 
                  onClick={handleSaveFilter}
                  disabled={!newFilterName.trim()}
                  color="red"
                >
                  Zapisz
                </Button>
              </div>
            </div>
          </div>
        )}
        
        {/* Clients list */}
        <Card darkMode={darkMode}>
          <div className="overflow-x-auto">
            <table className="min-w-full data-table chimney">
              <thead>
                <tr className={darkMode ? 'border-b border-gray-700' : 'border-b'}>
                  <th className="py-2 text-left">Nazwa klienta</th>
                  <th className="py-2 text-left">Kontakt</th>
                  <th className="py-2 text-left">Lokalizacja</th>
                  <th className="py-2 text-left">Liczba budynków</th>
                  <th className="py-2 text-left">Ostatnia kontrola</th>
                  <th className="py-2 text-left">Akcje</th>
                </tr>
              </thead>
              <tbody>
                {filteredClients.map((client) => (
                  <tr 
                    key={client.id} 
                    className={`${darkMode ? 'border-b border-gray-700' : 'border-b'} cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700`}
                    onClick={() => handleViewClientDetails(client.id)}
                  >
                    <td className="py-2">
                      <div className="flex items-center">
                        <div className="icon-wrapper mr-2 chimney">
                          <User size={16} />
                        </div>
                        <div>
                          <p className="font-medium">{client.name}</p>
                          <p className="text-xs text-gray-500">ID: {client.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-2">
                      <div>
                        <div className="flex items-center text-sm">
                          <Phone size={14} className="mr-1 text-gray-500" />
                          {client.phone}
                        </div>
                        <div className="flex items-center text-sm">
                          <Mail size={14} className="mr-1 text-gray-500" />
                          {client.email}
                        </div>
                      </div>
                    </td>
                    <td className="py-2">
                      <div className="flex items-center">
                        <MapPin size={14} className="mr-1 text-gray-500" />
                        <div>
                          <p>{client.city}</p>
                          <p className="text-sm text-gray-500">{client.address}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-2">
                      <div className="flex items-center">
                        <Building size={14} className="mr-1 text-gray-500" />
                        {client.buildingsCount}
                      </div>
                    </td>
                    <td className="py-2">{client.lastInspection}</td>
                    <td className="py-2">
                      <div className="flex space-x-2">
                        <Button 
                          variant="link" 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditClient(client.id);
                          }}
                        >
                          Edytuj
                        </Button>
                        <Button 
                          variant="link" 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewClientDetails(client.id);
                          }}
                        >
                          Szczegóły
                        </Button>
                        <Button 
                          variant="link" 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewBuildings(client.id);
                          }}
                        >
                          Budynki
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredClients.length === 0 && (
            <div className="text-center py-8">
              <User size={48} className="mx-auto mb-4 text-gray-400" />
              <p className="text-gray-500">Nie znaleziono klientów spełniających kryteria</p>
            </div>
          )}
        </Card>
        
        {/* Delete confirmation modal */}
        {showConfirmDelete && clientToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
            <div className={`max-w-md w-full ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-xl p-6`}>
              <div className="flex items-start mb-4">
                <div className="mr-3 text-red-500">
                  <AlertTriangle size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Potwierdź usunięcie</h3>
                  <p className="text-gray-500 mt-1">
                    Czy na pewno chcesz usunąć klienta "{clientToDelete.name}"? 
                    Ta operacja jest nieodwracalna.
                  </p>
                </div>
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setShowConfirmDelete(false);
                    setClientToDelete(null);
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
  } else {
    // Property (developer) version of the component
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Klienci (Najemcy)</h2>
          <Button 
            color="blue" 
            className="flex items-center"
            onClick={() => {
              setClientToEdit(null);
              setShowAddForm(true);
            }}
          >
            <Plus size={16} className="mr-2" />
            Dodaj klienta
          </Button>
        </div>
        
        {/* Client form */}
        {showAddForm && (
          <Card darkMode={darkMode}>
            <h3 className="font-semibold mb-4">
              {clientToEdit ? 'Edytuj klienta (najemcę)' : 'Dodaj nowego klienta (najemcę)'}
            </h3>
            <ClientForm 
              client={clientToEdit}
              onSubmit={clientToEdit ? handleEditSubmit : handleAddClient} 
              onCancel={() => {
                setShowAddForm(false);
                setClientToEdit(null);
              }}
              darkMode={darkMode}
              type="property"
            />
          </Card>
        )}
        
        {/* Search and filters */}
        <Card darkMode={darkMode} className="mb-6">
          <div className="flex flex-col md:flex-row md:space-x-2 space-y-2 md:space-y-0">
            {/* Search input */}
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Szukaj najemcy..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  handleFilter({ ...currentFilters, searchTerm: e.target.value });
                }}
                className={`pl-9 pr-3 py-2 border rounded-lg w-full ${
                  darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                }`}
              />
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
              {searchTerm && (
                <button 
                  onClick={() => {
                    setSearchTerm('');
                    handleFilter({ ...currentFilters, searchTerm: '' });
                  }}
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
                color="blue"
              >
                <Filter size={16} className="mr-1" />
                <span>Filtry</span>
              </Button>
              
              <div className="relative">
                <Button 
                  variant="outline" 
                  className="flex items-center"
                  onClick={() => setShowSavedFiltersDropdown(!showSavedFiltersDropdown)}
                >
                  <ArrowDownToLine size={16} className="mr-1" />
                  <span className="hidden lg:inline">Zapisane</span>
                  <ChevronDown size={16} className="ml-1" />
                </Button>
                
                {/* Saved filters dropdown */}
                {showSavedFiltersDropdown && (
                  <div className={`absolute right-0 mt-1 w-48 ${
                    darkMode ? 'bg-gray-800' : 'bg-white'
                  } rounded-lg shadow-lg border ${
                    darkMode ? 'border-gray-700' : 'border-gray-200'
                  } z-10 p-1`}>
                    {savedFilters.map((filter) => (
                      <div 
                        key={filter.id}
                        className={`flex justify-between items-center p-2 rounded-md cursor-pointer ${
                          darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                        }`}
                      >
                        <button 
                          onClick={() => handleApplySavedFilter(filter)}
                          className="flex-1 text-left"
                        >
                          {filter.name}
                        </button>
                        <button 
                          onClick={() => handleDeleteFilter(filter.id)}
                          className="text-gray-500 hover:text-red-500"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                    <div className="border-t dark:border-gray-700 mt-1 pt-1">
                      <button 
                        className="w-full text-left p-2 rounded-md text-blue-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={() => {
                          setShowSavedFiltersDropdown(false);
                          setShowSaveFilterModal(true);
                        }}
                      >
                        <span className="flex items-center">
                          <Save size={16} className="mr-1" />
                          Zapisz aktualny filtr
                        </span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
              
              {Object.keys(currentFilters).length > 1 || (searchTerm && searchTerm.length > 0) ? (
                <Button 
                  variant="outline" 
                  className="flex items-center"
                  onClick={() => {
                    setSearchTerm('');
                    setCurrentFilters({});
                    setFilteredClients(clients);
                  }}
                >
                  <X size={16} className="mr-1" />
                  <span className="hidden lg:inline">Wyczyść</span>
                </Button>
              ) : null}
            </div>
          </div>
          
          {/* Advanced filters */}
          {showAdvancedFilters && (
            <div className="mt-4 pt-4 border-t dark:border-gray-700">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-gray-500 mb-1">Status płatności</label>
                  <select
                    value={currentFilters.paymentStatus || 'all'}
                    onChange={(e) => handleFilter({...currentFilters, paymentStatus: e.target.value})}
                    className={`w-full px-3 py-2 border rounded-lg ${
                      darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                    }`}
                  >
                    <option value="all">Wszystkie statusy</option>
                    <option value="Opłacone">Opłacone</option>
                    <option value="Zaległe">Zaległe</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-gray-500 mb-1">Sortowanie</label>
                  <select
                    value={currentFilters.sortBy || 'nameAsc'}
                    onChange={(e) => handleFilter({...currentFilters, sortBy: e.target.value})}
                    className={`w-full px-3 py-2 border rounded-lg ${
                      darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                    }`}
                  >
                    <option value="nameAsc">Nazwa (A-Z)</option>
                    <option value="nameDesc">Nazwa (Z-A)</option>
                    <option value="newest">Od najnowszych</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-gray-500 mb-1">Umowa</label>
                  <select
                    value={currentFilters.leaseStatus || 'all'}
                    onChange={(e) => handleFilter({...currentFilters, leaseStatus: e.target.value})}
                    className={`w-full px-3 py-2 border rounded-lg ${
                      darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                    }`}
                  >
                    <option value="all">Wszystkie</option>
                    <option value="active">Aktywna</option>
                    <option value="ending">Kończy się wkrótce</option>
                  </select>
                </div>
              </div>
              
              <div className="mt-4 flex justify-between">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="flex items-center"
                  onClick={() => setShowSaveFilterModal(true)}
                >
                  <Save size={16} className="mr-1" />
                  Zapisz filtr
                </Button>
                
                <div className="flex space-x-2">
                  <Button 
                    variant="secondary" 
                    size="sm"
                    onClick={() => {
                      setSearchTerm('');
                      setCurrentFilters({});
                      setFilteredClients(clients);
                    }}
                  >
                    Wyczyść filtry
                  </Button>
                  
                  <Button 
                    size="sm"
                    onClick={() => handleFilter(currentFilters)}
                    color="blue"
                  >
                    Zastosuj
                  </Button>
                </div>
              </div>
            </div>
          )}
          
          {/* Active filters */}
          {Object.keys(currentFilters).filter(key => key !== 'searchTerm' && currentFilters[key] !== 'all' && currentFilters[key]).length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {Object.entries(currentFilters)
                .filter(([key, value]) => key !== 'searchTerm' && value !== 'all' && value)
                .map(([key, value]) => {
                  let label = key;
                  let displayValue = value;
                  
                  // Format labels
                  if (key === 'paymentStatus') label = 'Status płatności';
                  else if (key === 'sortBy') {
                    label = 'Sortowanie';
                    if (value === 'nameAsc') displayValue = 'Nazwa (A-Z)';
                    else if (value === 'nameDesc') displayValue = 'Nazwa (Z-A)';
                    else if (value === 'newest') displayValue = 'Od najnowszych';
                  }
                  else if (key === 'leaseStatus') {
                    label = 'Umowa';
                    if (value === 'active') displayValue = 'Aktywna';
                    else if (value === 'ending') displayValue = 'Kończy się wkrótce';
                  }
                  
                  return (
                    <div 
                      key={key}
                      className={`flex items-center px-2 py-1 rounded-full text-sm ${
                        darkMode ? 'bg-gray-700' : 'bg-gray-200'
                      }`}
                    >
                      <span>{label}: {displayValue}</span>
                      <button
                        onClick={() => {
                          const newFilters = { ...currentFilters };
                          delete newFilters[key];
                          handleFilter(newFilters);
                        }}
                        className="ml-1 text-gray-500 hover:text-gray-700"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  );
                })
              }
            </div>
          )}
        </Card>
        
        {/* Save filter modal */}
        {showSaveFilterModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
            <div className={`max-w-md w-full ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-xl p-6`}>
              <h3 className="text-lg font-semibold mb-4">Zapisz filtr</h3>
              
              <div className="mb-4">
                <label className="block text-gray-500 mb-1">Nazwa filtra</label>
                <input
                  type="text"
                  value={newFilterName}
                  onChange={(e) => setNewFilterName(e.target.value)}
                  placeholder="np. Zaległe płatności"
                  className={`w-full px-3 py-2 border rounded-lg ${
                    darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                  }`}
                />
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button 
                  variant="secondary"
                  onClick={() => setShowSaveFilterModal(false)}
                >
                  Anuluj
                </Button>
                
                <Button 
                  onClick={handleSaveFilter}
                  disabled={!newFilterName.trim()}
                  color="blue"
                >
                  Zapisz
                </Button>
              </div>
            </div>
          </div>
        )}
        
        {/* Clients list */}
        <Card darkMode={darkMode}>
          <div className="overflow-x-auto">
            <table className="min-w-full data-table">
              <thead>
                <tr className={darkMode ? 'border-b border-gray-700' : 'border-b'}>
                  <th className="py-2 text-left">Najemca</th>
                  <th className="py-2 text-left">Kontakt</th>
                  <th className="py-2 text-left">Mieszkanie</th>
                  <th className="py-2 text-left">Okres najmu</th>
                  <th className="py-2 text-left">Status</th>
                  <th className="py-2 text-left">Akcje</th>
                </tr>
              </thead>
              <tbody>
                {filteredClients.map((client) => (
                  <tr 
                    key={client.id} 
                    className={`${darkMode ? 'border-b border-gray-700' : 'border-b'} cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700`}
                    onClick={() => handleViewClientDetails(client.id)}
                  >
                    <td className="py-2">
                      <div className="flex items-center">
                        <div className="icon-wrapper mr-2">
                          <User size={16} />
                        </div>
                        <p className="font-medium">{client.name}</p>
                      </div>
                    </td>
                    <td className="py-2">
                      <div>
                        <div className="flex items-center text-sm">
                          <Phone size={14} className="mr-1 text-gray-500" />
                          {client.phone}
                        </div>
                        <div className="flex items-center text-sm">
                          <Mail size={14} className="mr-1 text-gray-500" />
                          {client.email}
                        </div>
                      </div>
                    </td>
                    <td className="py-2">
                      <div className="flex items-center">
                        <Building size={14} className="mr-1 text-gray-500" />
                        <div>
                          <p className="font-medium">{client.propertyAddress}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-2">
                      {client.leaseStart} - {client.leaseEnd}
                    </td>
                    <td className="py-2">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        client.lastPayment 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' 
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100'
                      }`}>
                        {client.lastPayment ? 'Opłacone' : 'Zaległe'}
                      </span>
                    </td>
                    <td className="py-2">
                      <div className="flex space-x-2">
                        <Button 
                          variant="link"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditClient(client.id);
                          }}
                        >
                          Edytuj
                        </Button>
                        <Button 
                          variant="link"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewClientDetails(client.id);
                          }}
                        >
                          Szczegóły
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredClients.length === 0 && (
            <div className="text-center py-8">
              <User size={48} className="mx-auto mb-4 text-gray-400" />
              <p className="text-gray-500">Nie znaleziono klientów (najemców) spełniających kryteria</p>
            </div>
          )}
        </Card>
        
        {/* Delete confirmation modal */}
        {showConfirmDelete && clientToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
            <div className={`max-w-md w-full ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-xl p-6`}>
              <div className="flex items-start mb-4">
                <div className="mr-3 text-red-500">
                  <AlertTriangle size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Potwierdź usunięcie</h3>
                  <p className="text-gray-500 mt-1">
                    Czy na pewno chcesz usunąć klienta "{clientToDelete.name}"? 
                    Ta operacja jest nieodwracalna.
                  </p>
                </div>
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setShowConfirmDelete(false);
                    setClientToDelete(null);
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
  }
};

export default ClientsList;