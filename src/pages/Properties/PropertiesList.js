import React, { useState } from 'react';
import { Search, Filter, Plus } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import DataTable from '../../components/ui/DataTable';
import StatusBadge from '../../components/ui/StatusBadge';
import PropertyForm from './PropertyForm';

const PropertiesList = ({ data, darkMode }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAddForm, setShowAddForm] = useState(false);
  
  // Filtrowanie mieszkań
  const filteredProperties = data.filter(property => {
    // Filtrowanie wg wyszukiwania
    const matchesSearch = 
      property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.address.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filtrowanie wg statusu
    const matchesStatus = statusFilter === 'all' || property.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

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
      cell: (value) => (
        <div className="flex space-x-2">
          <Button variant="link" onClick={() => console.log(`Edytuj ${value}`)}>
            Edytuj
          </Button>
          <Button variant="link" onClick={() => console.log(`Usuń ${value}`)} className="text-red-600">
            Usuń
          </Button>
        </div>
      )
    },
  ];

  const handlePropertySubmit = (propertyData) => {
    console.log('Nowe mieszkanie:', propertyData);
    setShowAddForm(false);
    // Tu normalnie byłoby dodawanie do bazy danych
  };

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
          >
            <Filter size={16} className="mr-2" />
            Więcej filtrów
          </Button>
        </div>

        <DataTable
          columns={columns}
          data={filteredProperties}
          darkMode={darkMode}
          pagination={{
            startItem: 1,
            endItem: filteredProperties.length,
            totalItems: filteredProperties.length
          }}
          currentPage={1}
          totalPages={1}
          onPageChange={() => {}}
        />
      </Card>
    </div>
  );
};

export default PropertiesList;