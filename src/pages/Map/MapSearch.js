import React, { useState, useEffect, useRef } from 'react';
import { Search, X, MapPin } from 'lucide-react';

// Search component for finding addresses and buildings on the map
const MapSearch = ({ data, onSelect, darkMode }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef(null);
  
  // Handle search term change
  useEffect(() => {
    if (searchTerm.length < 2) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }
    
    setIsSearching(true);
    
    // In a real app, this would be debounced
    const timer = setTimeout(() => {
      // Search through inspections for matching addresses or buildings
      const results = data
        .filter(inspection => 
          inspection.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
          inspection.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (inspection.clientName && inspection.clientName.toLowerCase().includes(searchTerm.toLowerCase()))
        )
        .slice(0, 5); // Limit to 5 results
      
      setSearchResults(results);
      setShowResults(true);
      setIsSearching(false);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [searchTerm, data]);
  
  // Close results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  // Handle selection of a search result
  const handleSelectResult = (result) => {
    if (onSelect) onSelect(result);
    setSearchTerm(result.address);
    setShowResults(false);
  };

  return (
    <div className="relative" ref={searchRef}>
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Szukaj adresu lub budynku..."
          className={`w-full pl-10 pr-10 py-2 border rounded-lg ${
            darkMode 
              ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
              : 'bg-white border-gray-300 text-gray-800 placeholder-gray-500'
          }`}
        />
        <Search 
          size={18} 
          className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
            darkMode ? 'text-gray-400' : 'text-gray-500'
          }`} 
        />
        
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${
              darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <X size={18} />
          </button>
        )}
      </div>
      
      {/* Search results dropdown */}
      {showResults && (
        <div 
          className={`absolute z-10 w-full mt-1 rounded-lg shadow-lg border ${
            darkMode 
              ? 'bg-gray-800 border-gray-700' 
              : 'bg-white border-gray-200'
          }`}
        >
          {isSearching ? (
            <div className="p-3 text-center">
              <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-red-500 mr-2"></div>
              <span className="text-gray-500">Wyszukiwanie...</span>
            </div>
          ) : searchResults.length === 0 ? (
            <div className="p-3 text-center text-gray-500">
              Nie znaleziono wyników
            </div>
          ) : (
            <ul>
              {searchResults.map((result, index) => (
                <li 
                  key={index}
                  onClick={() => handleSelectResult(result)}
                  className={`p-3 cursor-pointer flex items-start ${
                    darkMode 
                      ? 'hover:bg-gray-700 border-gray-700' 
                      : 'hover:bg-gray-100 border-gray-200'
                  } ${index !== 0 ? 'border-t' : ''}`}
                >
                  <MapPin size={18} className="text-red-500 mt-0.5 mr-2 flex-shrink-0" />
                  <div>
                    <p className="font-medium">{result.address}</p>
                    <p className="text-sm text-gray-500">{result.city}</p>
                    {result.clientName && (
                      <p className="text-xs text-gray-500">{result.clientName}</p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default MapSearch;