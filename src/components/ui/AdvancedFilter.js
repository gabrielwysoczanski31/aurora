import React, { useState, useEffect } from 'react';
import { Search, Filter, X, ChevronDown, Save, ArrowDownToLine, ArrowUpToLine, Check } from 'lucide-react';
import Card from './Card';
import Button from './Button';

const AdvancedFilter = ({ 
  onFilter, 
  darkMode, 
  type = 'property', 
  initialFilters = {},
  savedFilters = []
}) => {
  // Stany dla filtrowania
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchTerm, setSearchTerm] = useState(initialFilters.searchTerm || '');
  const [activeFilters, setActiveFilters] = useState(initialFilters);
  const [availableFilters, setAvailableFilters] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState({});
  const [savedFiltersList, setSavedFiltersList] = useState(savedFilters);
  const [showSaveFilterModal, setShowSaveFilterModal] = useState(false);
  const [newFilterName, setNewFilterName] = useState('');
  
  // Ustawienie dostępnych filtrów w zależności od typu dashboardu
  useEffect(() => {
    if (type === 'property') {
      // Filtry dla dashboardu deweloperskiego
      setAvailableFilters([
        { 
          id: 'status', 
          label: 'Status', 
          type: 'select',
          options: [
            { value: 'all', label: 'Wszystkie statusy' },
            { value: 'Wynajęte', label: 'Wynajęte' },
            { value: 'Dostępne', label: 'Dostępne' },
            { value: 'W remoncie', label: 'W remoncie' },
            { value: 'Rezerwacja', label: 'Rezerwacja' }
          ]
        },
        { 
          id: 'price', 
          label: 'Czynsz', 
          type: 'range', 
          min: 1000, 
          max: 10000, 
          step: 100 
        },
        { 
          id: 'size', 
          label: 'Powierzchnia', 
          type: 'range', 
          min: 20, 
          max: 200, 
          step: 5 
        },
        { 
          id: 'rooms', 
          label: 'Liczba pokoi', 
          type: 'select',
          options: [
            { value: 'all', label: 'Wszystkie' },
            { value: '1', label: '1' },
            { value: '2', label: '2' },
            { value: '3', label: '3' },
            { value: '4', label: '4+' }
          ]
        },
        { 
          id: 'features', 
          label: 'Cechy', 
          type: 'multiselect',
          options: [
            { value: 'balcony', label: 'Balkon' },
            { value: 'parking', label: 'Miejsce parkingowe' },
            { value: 'elevator', label: 'Winda' },
            { value: 'furnished', label: 'Umeblowane' },
            { value: 'pets', label: 'Zwierzęta dozwolone' }
          ]
        },
        { 
          id: 'sortBy', 
          label: 'Sortuj według', 
          type: 'select',
          options: [
            { value: 'newest', label: 'Od najnowszych' },
            { value: 'oldest', label: 'Od najstarszych' },
            { value: 'priceAsc', label: 'Cena: rosnąco' },
            { value: 'priceDesc', label: 'Cena: malejąco' },
            { value: 'sizeAsc', label: 'Powierzchnia: rosnąco' },
            { value: 'sizeDesc', label: 'Powierzchnia: malejąco' }
          ]
        }
      ]);
    } else {
      // Filtry dla dashboardu kominiarskiego
      setAvailableFilters([
        { 
          id: 'type', 
          label: 'Typ kontroli', 
          type: 'select',
          options: [
            { value: 'all', label: 'Wszystkie typy' },
            { value: 'Przewód dymowy', label: 'Przewód dymowy' },
            { value: 'Przewód spalinowy', label: 'Przewód spalinowy' },
            { value: 'Przewód wentylacyjny', label: 'Przewód wentylacyjny' },
            { value: 'Instalacja gazowa', label: 'Instalacja gazowa' }
          ]
        },
        { 
          id: 'result', 
          label: 'Wynik', 
          type: 'select',
          options: [
            { value: 'all', label: 'Wszystkie wyniki' },
            { value: 'Pozytywny', label: 'Pozytywny' },
            { value: 'Negatywny', label: 'Negatywny' },
            { value: 'Warunkowy', label: 'Warunkowy' }
          ]
        },
        { 
          id: 'ceebStatus', 
          label: 'Status CEEB', 
          type: 'select',
          options: [
            { value: 'all', label: 'Wszystkie statusy' },
            { value: 'Zgłoszony do CEEB', label: 'Zgłoszony do CEEB' },
            { value: 'Do zgłoszenia', label: 'Do zgłoszenia' }
          ]
        },
        { 
          id: 'dateRange', 
          label: 'Zakres dat', 
          type: 'dateRange',
          startDate: null,
          endDate: null
        },
        { 
          id: 'city', 
          label: 'Miasto', 
          type: 'select',
          options: [
            { value: 'all', label: 'Wszystkie miasta' },
            { value: 'Warszawa', label: 'Warszawa' },
            { value: 'Kraków', label: 'Kraków' },
            { value: 'Poznań', label: 'Poznań' },
            { value: 'Wrocław', label: 'Wrocław' },
            { value: 'Gdańsk', label: 'Gdańsk' }
          ]
        },
        { 
          id: 'sortBy', 
          label: 'Sortuj według', 
          type: 'select',
          options: [
            { value: 'newest', label: 'Od najnowszych' },
            { value: 'oldest', label: 'Od najstarszych' },
            { value: 'alphabetical', label: 'Alfabetycznie' }
          ]
        }
      ]);
    }
  }, [type]);

  // Inicjalizacja wybranych filtrów na podstawie initialFilters
  useEffect(() => {
    if (Object.keys(initialFilters).length > 0) {
      const initialSelected = {};
      
      availableFilters.forEach(filter => {
        if (initialFilters[filter.id] !== undefined) {
          initialSelected[filter.id] = initialFilters[filter.id];
        }
      });
      
      setSelectedFilters(initialSelected);
    }
  }, [initialFilters, availableFilters]);

  // Gdy zmienia się wyszukiwanie, aktualizuj aktywne filtry
  useEffect(() => {
    const newActiveFilters = { ...activeFilters, searchTerm };
    setActiveFilters(newActiveFilters);
    onFilter && onFilter(newActiveFilters);
  }, [searchTerm]);

  // Funkcja do resetowania filtrów
  const resetFilters = () => {
    setSearchTerm('');
    setSelectedFilters({});
    setActiveFilters({searchTerm: ''});
    onFilter && onFilter({searchTerm: ''});
  };

  // Funkcja do zapisywania nowego filtra
  const saveFilter = () => {
    if (!newFilterName.trim()) return;
    
    const newFilter = {
      id: Date.now().toString(),
      name: newFilterName,
      filters: { ...activeFilters }
    };
    
    const updatedFilters = [...savedFiltersList, newFilter];
    setSavedFiltersList(updatedFilters);
    setShowSaveFilterModal(false);
    setNewFilterName('');
    
    // Tu można by było dodać kod do zapisania filtrów w localStorage lub API
  };

  // Funkcja do zastosowania zapisanego filtra
  const applySavedFilter = (filter) => {
    setSearchTerm(filter.filters.searchTerm || '');
    setSelectedFilters(
      Object.fromEntries(
        Object.entries(filter.filters).filter(([key]) => key !== 'searchTerm')
      )
    );
    setActiveFilters(filter.filters);
    onFilter && onFilter(filter.filters);
  };

  // Funkcja do usuwania zapisanego filtra
  const deleteSavedFilter = (filterId) => {
    const updatedFilters = savedFiltersList.filter(filter => filter.id !== filterId);
    setSavedFiltersList(updatedFilters);
    
    // Tu można by było dodać kod do usunięcia filtra z localStorage lub API
  };

  // Funkcja do zastosowania wszystkich filtrów
  const applyFilters = () => {
    const newActiveFilters = { ...selectedFilters, searchTerm };
    setActiveFilters(newActiveFilters);
    onFilter && onFilter(newActiveFilters);
  };

  // Funkcja do obsługi zmiany wartości filtra
  const handleFilterChange = (filterId, value) => {
    setSelectedFilters(prevState => ({
      ...prevState,
      [filterId]: value
    }));
  };

  // Funkcja renderująca konkretny filtr
  const renderFilter = (filter) => {
    switch (filter.type) {
      case 'select':
        return (
          <select
            value={selectedFilters[filter.id] || 'all'}
            onChange={(e) => handleFilterChange(filter.id, e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg ${
              darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
            }`}
          >
            {filter.options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
        
      case 'range':
        return (
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-500">
              <span>{filter.min}</span>
              <span>{filter.max}</span>
            </div>
            <input
              type="range"
              min={filter.min}
              max={filter.max}
              step={filter.step}
              value={selectedFilters[filter.id] || filter.min}
              onChange={(e) => handleFilterChange(filter.id, e.target.value)}
              className="w-full"
            />
            <div className="flex justify-between">
              <div className={`border rounded px-2 py-1 ${
                darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
              }`}>
                {selectedFilters[filter.id] || filter.min}
              </div>
              {filter.id === 'price' && <span>PLN</span>}
              {filter.id === 'size' && <span>m²</span>}
            </div>
          </div>
        );
        
      case 'multiselect':
        return (
          <div className="space-y-2">
            {filter.options.map((option) => (
              <div key={option.value} className="flex items-center">
                <input
                  type="checkbox"
                  id={`${filter.id}-${option.value}`}
                  checked={selectedFilters[filter.id]?.includes(option.value) || false}
                  onChange={(e) => {
                    const currentValues = selectedFilters[filter.id] || [];
                    if (e.target.checked) {
                      handleFilterChange(filter.id, [...currentValues, option.value]);
                    } else {
                      handleFilterChange(
                        filter.id,
                        currentValues.filter(v => v !== option.value)
                      );
                    }
                  }}
                  className="mr-2"
                />
                <label htmlFor={`${filter.id}-${option.value}`}>
                  {option.label}
                </label>
              </div>
            ))}
          </div>
        );
        
      case 'dateRange':
        return (
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-gray-500 text-sm mb-1">Od</label>
              <input
                type="date"
                value={selectedFilters[filter.id]?.startDate || ''}
                onChange={(e) => {
                  const currentRange = selectedFilters[filter.id] || {};
                  handleFilterChange(filter.id, {
                    ...currentRange,
                    startDate: e.target.value
                  });
                }}
                className={`w-full px-3 py-2 border rounded-lg ${
                  darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                }`}
              />
            </div>
            <div>
              <label className="block text-gray-500 text-sm mb-1">Do</label>
              <input
                type="date"
                value={selectedFilters[filter.id]?.endDate || ''}
                onChange={(e) => {
                  const currentRange = selectedFilters[filter.id] || {};
                  handleFilterChange(filter.id, {
                    ...currentRange,
                    endDate: e.target.value
                  });
                }}
                className={`w-full px-3 py-2 border rounded-lg ${
                  darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                }`}
              />
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  // Liczba aktywnych filtrów (bez wyszukiwania)
  const activeFiltersCount = Object.keys(activeFilters).filter(key => key !== 'searchTerm' && activeFilters[key] !== 'all').length;

  return (
    <Card darkMode={darkMode} className="mb-6">
      <div className="flex flex-col md:flex-row md:space-x-2 space-y-2 md:space-y-0">
        {/* Pole wyszukiwania */}
        <div className="relative flex-1">
          <input
            type="text"
            placeholder={`Szukaj ${type === 'property' ? 'mieszkania' : 'kontroli'}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`pl-9 pr-3 py-2 border rounded-lg w-full ${
              darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
            }`}
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
        
        {/* Przyciski filtrów */}
        <div className="flex space-x-2">
          <Button 
            variant={isExpanded ? 'primary' : 'outline'} 
            className="flex items-center"
            onClick={() => setIsExpanded(!isExpanded)}
            color={type === 'property' ? 'blue' : 'red'}
          >
            <Filter size={16} className="mr-1" />
            <span>Filtry</span>
            {activeFiltersCount > 0 && (
              <span className="ml-1 px-1.5 py-0.5 text-xs rounded-full bg-white text-blue-600">
                {activeFiltersCount}
              </span>
            )}
          </Button>
          
          <div className="relative">
            <Button 
              variant="outline" 
              className="flex items-center"
            >
              <ArrowDownToLine size={16} className="mr-1" />
              <span className="hidden lg:inline">Zapisane</span>
              <ChevronDown size={16} className="ml-1" />
            </Button>
            
            {/* Dropdown z zapisanymi filtrami */}
            {savedFiltersList.length > 0 && (
              <div className={`absolute right-0 mt-1 w-48 ${
                darkMode ? 'bg-gray-800' : 'bg-white'
              } rounded-lg shadow-lg border ${
                darkMode ? 'border-gray-700' : 'border-gray-200'
              } z-10 p-1`}>
                {savedFiltersList.map((filter) => (
                  <div 
                    key={filter.id}
                    className={`flex justify-between items-center p-2 rounded-md cursor-pointer ${
                      darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                    }`}
                  >
                    <button 
                      onClick={() => applySavedFilter(filter)}
                      className="flex-1 text-left"
                    >
                      {filter.name}
                    </button>
                    <button 
                      onClick={() => deleteSavedFilter(filter.id)}
                      className="text-gray-500 hover:text-red-500"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {Object.keys(activeFilters).length > 1 || (searchTerm && searchTerm.length > 0) ? (
            <Button 
              variant="outline" 
              className="flex items-center"
              onClick={resetFilters}
            >
              <X size={16} className="mr-1" />
              <span className="hidden lg:inline">Wyczyść</span>
            </Button>
          ) : null}
        </div>
      </div>
      
      {/* Rozszerzone filtry */}
      {isExpanded && (
        <div className="mt-4 pt-4 border-t dark:border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {availableFilters.map((filter) => (
              <div key={filter.id}>
                <label className="block text-gray-500 mb-1">{filter.label}</label>
                {renderFilter(filter)}
              </div>
            ))}
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
                onClick={resetFilters}
              >
                Wyczyść filtry
              </Button>
              
              <Button 
                size="sm"
                onClick={applyFilters}
                color={type === 'property' ? 'blue' : 'red'}
              >
                Zastosuj
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {/* Aktywne filtry */}
      {activeFiltersCount > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {Object.entries(activeFilters)
            .filter(([key, value]) => key !== 'searchTerm' && value !== 'all')
            .map(([key, value]) => {
              const filter = availableFilters.find(f => f.id === key);
              let label = filter?.label || key;
              
              // Formatowanie wartości dla wyświetlenia
              let displayValue = value;
              if (filter?.type === 'select') {
                displayValue = filter.options.find(opt => opt.value === value)?.label || value;
              } else if (filter?.type === 'multiselect' && Array.isArray(value)) {
                displayValue = value.map(v => 
                  filter.options.find(opt => opt.value === v)?.label || v
                ).join(', ');
              } else if (filter?.type === 'dateRange') {
                displayValue = `${value.startDate || 'Od początku'} - ${value.endDate || 'Do teraz'}`;
              } else if (filter?.id === 'price') {
                displayValue = `${value} PLN`;
              } else if (filter?.id === 'size') {
                displayValue = `${value} m²`;
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
                      const newFilters = { ...activeFilters };
                      delete newFilters[key];
                      setActiveFilters(newFilters);
                      setSelectedFilters(prevState => {
                        const newState = { ...prevState };
                        delete newState[key];
                        return newState;
                      });
                      onFilter && onFilter(newFilters);
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
      
      {/* Modal zapisywania filtra */}
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
                placeholder="np. Mieszkania 2-pokojowe"
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
                onClick={saveFilter}
                disabled={!newFilterName.trim()}
                color={type === 'property' ? 'blue' : 'red'}
              >
                Zapisz
              </Button>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

export default AdvancedFilter;