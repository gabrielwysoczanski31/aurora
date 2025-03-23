import React, { useState } from 'react';
import { Search, Filter, Plus } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import DataTable from '../../components/ui/DataTable';
import StatusBadge from '../../components/ui/StatusBadge';
import InspectionForm from './InspectionForm';

const InspectionsList = ({ data, darkMode }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [resultFilter, setResultFilter] = useState('all');
  const [ceebFilter, setCeebFilter] = useState('all');
  const [showAddForm, setShowAddForm] = useState(false);
  
  // Filtrowanie kontroli
  const filteredInspections = data.filter(inspection => {
    // Filtrowanie wg wyszukiwania
    const matchesSearch = 
      inspection.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inspection.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inspection.clientName.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filtrowanie wg typu
    const matchesType = typeFilter === 'all' || inspection.type === typeFilter;
    
    // Filtrowanie wg wyniku
    const matchesResult = resultFilter === 'all' || inspection.result === resultFilter;
    
    // Filtrowanie wg statusu CEEB
    const matchesCeeb = ceebFilter === 'all' || inspection.ceebStatus === ceebFilter;
    
    return matchesSearch && matchesType && matchesResult && matchesCeeb;
  });

  const columns = [
    { header: 'ID', accessor: 'id' },
    { header: 'Typ', accessor: 'type' },
    { header: 'Adres', accessor: 'address' },
    { header: 'Miasto', accessor: 'city' },
    { header: 'Data', accessor: 'date' },
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
      header: 'Status CEEB', 
      accessor: 'ceebStatus',
      cell: (value) => (
        <StatusBadge 
          status={value} 
          color={value === 'Zgłoszony do CEEB' ? 'green' : 'yellow'} 
        />
      )
    },
    { 
      header: 'Akcje', 
      accessor: 'id',
      cell: (value, row) => (
        <div className="flex space-x-2">
          <Button variant="link" onClick={() => console.log(`Szczegóły ${value}`)}>
            Szczegóły
          </Button>
          <Button variant="link" onClick={() => console.log(`Protokół ${value}`)} className="text-green-600">
            Protokół
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

  const handleInspectionSubmit = (inspectionData) => {
    console.log('Nowa kontrola:', inspectionData);
    setShowAddForm(false);
    // Tu normalnie byłoby dodawanie do bazy danych
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Kontrole</h2>
        <Button 
          onClick={() => setShowAddForm(true)} 
          className="flex items-center"
          color="red"
        >
          <Plus size={16} className="mr-2" />
          Dodaj kontrolę
        </Button>
      </div>
      
      {showAddForm && (
        <Card darkMode={darkMode}>
          <h3 className="font-semibold mb-4">Dodaj nową kontrolę</h3>
          <InspectionForm 
            onSubmit={handleInspectionSubmit} 
            onCancel={() => setShowAddForm(false)}
            darkMode={darkMode}
            buildings={[]} // Tu trzeba by było przekazać listę budynków
            clients={[]} // Tu trzeba by było przekazać listę klientów
          />
        </Card>
      )}
      
      <Card darkMode={darkMode}>
        <div className="mb-4 flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Szukaj kontroli..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`pl-9 pr-3 py-2 border rounded-lg w-full ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
            />
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          </div>
          
          <div className="flex space-x-2">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className={`px-3 py-2 border rounded-lg ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
            >
              <option value="all">Wszystkie typy</option>
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
              <option value="all">Wszystkie wyniki</option>
              <option value="Pozytywny">Pozytywny</option>
              <option value="Negatywny">Negatywny</option>
              <option value="Warunkowy">Warunkowy</option>
            </select>
            
            <select
              value={ceebFilter}
              onChange={(e) => setCeebFilter(e.target.value)}
              className={`px-3 py-2 border rounded-lg ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
            >
              <option value="all">Wszystkie statusy</option>
              <option value="Zgłoszony do CEEB">Zgłoszony do CEEB</option>
              <option value="Do zgłoszenia">Do zgłoszenia</option>
            </select>
            
            <Button 
              variant="outline" 
              className="flex items-center"
            >
              <Filter size={16} className="mr-2" />
              <span className="hidden lg:inline">Filtry</span>
            </Button>
          </div>
        </div>

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
        />
      </Card>
    </div>
  );
};

export default InspectionsList;