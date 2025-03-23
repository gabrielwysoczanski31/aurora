import React, { useState } from 'react';
import { Search, Filter, Plus, FileText, Download, Clock } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import DataTable from '../../components/ui/DataTable';
import AdvancedFilter from '../../components/ui/AdvancedFilter';
import StatusBadge from '../../components/ui/StatusBadge';

const InvoicesList = ({ data, darkMode }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  
  // Funkcja filtrowania
  const handleFilter = (filters) => {
    let filtered = [...data];
    
    // Filtrowanie po wyszukiwaniu
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(invoice => 
        invoice.number.toLowerCase().includes(searchLower) ||
        invoice.category.toLowerCase().includes(searchLower) ||
        (invoice.vendor && invoice.vendor.toLowerCase().includes(searchLower))
      );
    }
    
    // Filtrowanie po kategorii
    if (filters.category && filters.category !== 'all') {
      filtered = filtered.filter(invoice => invoice.category === filters.category);
    }
    
    // Filtrowanie po statusie
    if (filters.status && filters.status !== 'all') {
      filtered = filtered.filter(invoice => invoice.status === filters.status);
    }
    
    // Filtrowanie po dacie
    if (filters.dateRange) {
      if (filters.dateRange.startDate) {
        const startDate = new Date(filters.dateRange.startDate);
        filtered = filtered.filter(invoice => {
          const invoiceDate = new Date(invoice.date.split('.').reverse().join('-'));
          return invoiceDate >= startDate;
        });
      }
      
      if (filters.dateRange.endDate) {
        const endDate = new Date(filters.dateRange.endDate);
        filtered = filtered.filter(invoice => {
          const invoiceDate = new Date(invoice.date.split('.').reverse().join('-'));
          return invoiceDate <= endDate;
        });
      }
    }
    
    // Sortowanie
    if (filters.sortBy) {
      switch (filters.sortBy) {
        case 'newest':
          filtered.sort((a, b) => new Date(b.date.split('.').reverse().join('-')) - new Date(a.date.split('.').reverse().join('-')));
          break;
        case 'oldest':
          filtered.sort((a, b) => new Date(a.date.split('.').reverse().join('-')) - new Date(b.date.split('.').reverse().join('-')));
          break;
        case 'amountAsc':
          filtered.sort((a, b) => a.amount - b.amount);
          break;
        case 'amountDesc':
          filtered.sort((a, b) => b.amount - a.amount);
          break;
        default:
          break;
      }
    }
    
    setFilteredInvoices(filtered);
  };
  
  // Ustawienie początkowej listy faktur
  useState(() => {
    setFilteredInvoices(data);
  }, [data]);

  const categories = ['Prąd', 'Gaz', 'Woda', 'Internet', 'Administracja', 'Remonty', 'Podatki'];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Faktury</h2>
        <div className="flex space-x-2">
          <Button 
            color="blue" 
            className="flex items-center"
          >
            <Plus size={16} className="mr-1" />
            Dodaj fakturę
          </Button>
          <Button 
            color="green"
            variant="outline"
            className="flex items-center"
          >
            <Download size={16} className="mr-1" />
            Eksportuj
          </Button>
        </div>
      </div>
      
      <AdvancedFilter 
        onFilter={handleFilter} 
        darkMode={darkMode}
        type="property"
        initialFilters={{}}
        savedFilters={[
          { 
            id: 'unpaid', 
            name: 'Niezapłacone faktury', 
            filters: { status: 'Do zapłaty', searchTerm: '' } 
          },
          { 
            id: 'lastMonth', 
            name: 'Faktury z ostatniego miesiąca', 
            filters: { 
              dateRange: { 
                startDate: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0],
                endDate: new Date().toISOString().split('T')[0]
              }, 
              searchTerm: '' 
            } 
          }
        ]}
      />
      
      <Card darkMode={darkMode}>
        <div className="mb-4 flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
          <input
            type="text"
            placeholder="Szukaj faktury..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              handleFilter({ searchTerm: e.target.value });
            }}
            className={`px-3 py-2 border rounded-lg flex-1 ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
          />
          
          <select 
            onChange={(e) => handleFilter({ category: e.target.value })}
            className={`px-3 py-2 border rounded-lg ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
          >
            <option value="all">Wszystkie kategorie</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          
          <select
            onChange={(e) => handleFilter({ status: e.target.value })}
            className={`px-3 py-2 border rounded-lg ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
          >
            <option value="all">Wszystkie statusy</option>
            <option value="Opłacona">Opłacona</option>
            <option value="Do zapłaty">Do zapłaty</option>
          </select>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full data-table">
            <thead>
              <tr className={darkMode ? 'border-b border-gray-700' : 'border-b'}>
                <th className="py-2 text-left">Nr faktury</th>
                <th className="py-2 text-left">Kategoria</th>
                <th className="py-2 text-left">Dostawca</th>
                <th className="py-2 text-left">Data</th>
                <th className="py-2 text-left">Termin płatności</th>
                <th className="py-2 text-right">Kwota</th>
                <th className="py-2 text-left">Status</th>
                <th className="py-2 text-left">Akcje</th>
              </tr>
            </thead>
            <tbody>
              {filteredInvoices.map((invoice) => (
                <tr key={invoice.id} className={darkMode ? 'border-b border-gray-700' : 'border-b'}>
                  <td className="py-2">
                    <div className="flex items-center">
                      <FileText size={16} className="mr-2 text-gray-500" />
                      {invoice.number}
                    </div>
                  </td>
                  <td className="py-2">{invoice.category}</td>
                  <td className="py-2">{invoice.vendor || '-'}</td>
                  <td className="py-2">{invoice.date}</td>
                  <td className="py-2">
                    <div className="flex items-center">
                      <Clock size={14} className="mr-1 text-gray-500" />
                      {invoice.dueDate || invoice.date}
                    </div>
                  </td>
                  <td className="py-2 text-right">{invoice.amount.toLocaleString()} PLN</td>
                  <td className="py-2">
                    <StatusBadge 
                      status={invoice.status} 
                      color={invoice.status === 'Opłacona' ? 'green' : 'yellow'} 
                    />
                  </td>
                  <td className="py-2">
                    <div className="flex space-x-2">
                      <Button variant="link">Szczegóły</Button>
                      <Button variant="link">Pobierz</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="mt-4 flex justify-between items-center">
          <p className="text-gray-500">Wyświetlanie 1-{filteredInvoices.length} z {filteredInvoices.length} wyników</p>
          <div className="flex space-x-1">
            <button className={`px-3 py-1 rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>1</button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default InvoicesList;