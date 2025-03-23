import React, { useState } from 'react';
import { Search, Filter, Plus, Building, MapPin } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import DataTable from '../../components/ui/DataTable';
import AdvancedFilter from '../../components/ui/AdvancedFilter';

const BuildingsList = ({ data, darkMode }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredBuildings, setFilteredBuildings] = useState(data || []);
  
  // Funkcja filtrowania
  const handleFilter = (filters) => {
    let filtered = [...data];
    
    // Filtrowanie po wyszukiwaniu
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(building => 
        building.address.toLowerCase().includes(searchLower) ||
        building.city.toLowerCase().includes(searchLower) ||
        building.clientName.toLowerCase().includes(searchLower)
      );
    }
    
    // Filtrowanie po mieście
    if (filters.city && filters.city !== 'all') {
      filtered = filtered.filter(building => building.city === filters.city);
    }
    
    // Filtrowanie po typu ogrzewania
    if (filters.heatingType && filters.heatingType !== 'all') {
      filtered = filtered.filter(building => building.heatingType === filters.heatingType);
    }
    
    setFilteredBuildings(filtered);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Budynki</h2>
        <Button 
          color="red" 
          className="flex items-center"
        >
          <Plus size={16} className="mr-2" />
          Dodaj budynek
        </Button>
      </div>
      
      <AdvancedFilter 
        onFilter={handleFilter} 
        darkMode={darkMode}
        type="chimney"
      />
      
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
                <tr key={building.id} className={darkMode ? 'border-b border-gray-700' : 'border-b'}>
                  <td className="py-2">{building.id}</td>
                  <td className="py-2">{building.address}</td>
                  <td className="py-2">{building.city}</td>
                  <td className="py-2">{building.postalCode}</td>
                  <td className="py-2">{building.clientName}</td>
                  <td className="py-2">{building.heatingType}</td>
                  <td className="py-2">{building.lastInspection}</td>
                  <td className="py-2">
                    <div className="flex space-x-2">
                      <Button variant="link">Edytuj</Button>
                      <Button variant="link">Historia</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default BuildingsList;
