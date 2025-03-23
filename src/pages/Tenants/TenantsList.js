import React, { useState } from 'react';
import { Search, Filter, UserPlus, Mail, Phone, User, Calendar, DollarSign } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import DataTable from '../../components/ui/DataTable';
import AdvancedFilter from '../../components/ui/AdvancedFilter';
import StatusBadge from '../../components/ui/StatusBadge';

const TenantsList = ({ data, darkMode }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredTenants, setFilteredTenants] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  
  // Przekształcenie danych mieszkań na listę najemców
  const tenants = data
    .filter(apartment => apartment.status === 'Wynajęte' && apartment.tenantName)
    .map(apartment => ({
      id: apartment.id,
      name: apartment.tenantName,
      email: apartment.tenantEmail || `${apartment.tenantName.toLowerCase().replace(/\s/g, '.')}@example.com`,
      phone: apartment.tenantPhone,
      propertyName: apartment.name,
      propertyAddress: apartment.address,
      leaseStart: apartment.leaseStart || '01.01.2025',
      leaseEnd: apartment.leaseEnd || '31.12.2025',
      rent: apartment.price,
      lastPayment: apartment.lastPayment,
      status: apartment.lastPayment ? 'Opłacone' : 'Zaległe',
      notes: 'Brak dodatkowych notatek'
    }));
  
  // Funkcja filtrowania
  const handleFilter = (filters) => {
    let filtered = [...tenants];
    
    // Filtrowanie po wyszukiwaniu
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(tenant => 
        tenant.name.toLowerCase().includes(searchLower) ||
        tenant.email.toLowerCase().includes(searchLower) ||
        tenant.phone.includes(filters.searchTerm) ||
        tenant.propertyAddress.toLowerCase().includes(searchLower)
      );
    }
    
    // Filtrowanie po statusie płatności
    if (filters.paymentStatus && filters.paymentStatus !== 'all') {
      filtered = filtered.filter(tenant => tenant.status === filters.paymentStatus);
    }
    
    // Sortowanie
    if (filters.sortBy) {
      switch (filters.sortBy) {
        case 'nameAsc':
          filtered.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case 'nameDesc':
          filtered.sort((a, b) => b.name.localeCompare(a.name));
          break;
        case 'rentAsc':
          filtered.sort((a, b) => a.rent - b.rent);
          break;
        case 'rentDesc':
          filtered.sort((a, b) => b.rent - a.rent);
          break;
        default:
          break;
      }
    }
    
    setFilteredTenants(filtered);
  };
  
  // Ustawienie początkowej listy najemców
  useState(() => {
    setFilteredTenants(tenants);
  }, [data]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Najemcy</h2>
        <Button 
          color="blue" 
          className="flex items-center"
          onClick={() => setShowAddForm(true)}
        >
          <UserPlus size={16} className="mr-2" />
          Dodaj najemcę
        </Button>
      </div>
      
      <AdvancedFilter 
        onFilter={handleFilter} 
        darkMode={darkMode}
        type="property"
        initialFilters={{}}
        savedFilters={[
          { 
            id: 'overdue', 
            name: 'Zaległe opłaty', 
            filters: { paymentStatus: 'Zaległe', searchTerm: '' } 
          },
          { 
            id: 'ending', 
            name: 'Kończące się umowy', 
            filters: { leaseEnding: true, searchTerm: '' } 
          }
        ]}
      />
      
      <Card darkMode={darkMode}>
        <div className="overflow-x-auto">
          <table className="min-w-full data-table">
            <thead>
              <tr className={darkMode ? 'border-b border-gray-700' : 'border-b'}>
                <th className="py-2 text-left">Najemca</th>
                <th className="py-2 text-left">Kontakt</th>
                <th className="py-2 text-left">Mieszkanie</th>
                <th className="py-2 text-left">Okres najmu</th>
                <th className="py-2 text-right">Czynsz</th>
                <th className="py-2 text-left">Status płatności</th>
                <th className="py-2 text-left">Akcje</th>
              </tr>
            </thead>
            <tbody>
              {filteredTenants.map((tenant) => (
                <tr key={tenant.id} className={darkMode ? 'border-b border-gray-700' : 'border-b'}>
                  <td className="py-2">
                    <div className="flex items-center">
                      <div className="icon-wrapper mr-2">
                        <User size={16} />
                      </div>
                      <div>
                        <p className="font-medium">{tenant.name}</p>
                        <p className="text-xs text-gray-500">ID: {tenant.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-2">
                    <div>
                      <div className="flex items-center text-sm">
                        <Mail size={14} className="mr-1 text-gray-500" />
                        {tenant.email}
                      </div>
                      <div className="flex items-center text-sm">
                        <Phone size={14} className="mr-1 text-gray-500" />
                        {tenant.phone}
                      </div>
                    </div>
                  </td>
                  <td className="py-2">
                    <p className="font-medium">{tenant.propertyName}</p>
                    <p className="text-sm text-gray-500">{tenant.propertyAddress}</p>
                  </td>
                  <td className="py-2">
                    <div className="flex items-center text-sm">
                      <Calendar size={14} className="mr-1 text-gray-500" />
                      {tenant.leaseStart} - {tenant.leaseEnd}
                    </div>
                  </td>
                  <td className="py-2 text-right">
                    <div className="flex items-center justify-end">
                      <DollarSign size={14} className="mr-1 text-gray-500" />
                      {tenant.rent.toLocaleString()} PLN
                    </div>
                    <p className="text-xs text-gray-500 text-right">miesięcznie</p>
                  </td>
                  <td className="py-2">
                    <StatusBadge 
                      status={tenant.status} 
                      color={tenant.status === 'Opłacone' ? 'green' : 'yellow'} 
                    />
                  </td>
                  <td className="py-2">
                    <div className="flex space-x-2">
                      <Button variant="link">Edytuj</Button>
                      <Button variant="link">Szczegóły</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredTenants.length === 0 && (
          <div className="text-center py-8">
            <User size={48} className="mx-auto mb-4 text-gray-400" />
            <p className="text-gray-500">Nie znaleziono najemców spełniających kryteria</p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default TenantsList;