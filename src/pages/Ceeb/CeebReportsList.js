import React, { useState } from 'react';
import { Download, AlertTriangle, CheckCircle } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import DataTable from '../../components/ui/DataTable';
import StatusBadge from '../../components/ui/StatusBadge';

const CeebReportsList = ({ data, darkMode }) => {
  const [activeSection, setActiveSection] = useState('pending');
  
  // Filtrujemy inspekcje, które są do zgłoszenia do CEEB
  const pendingInspections = data.inspections.filter(
    inspection => inspection.ceebStatus === 'Do zgłoszenia'
  );
  
  // Kolumny dla tabeli inspekcji do zgłoszenia
  const pendingColumns = [
    { header: 'ID', accessor: 'id' },
    { header: 'Typ', accessor: 'type' },
    { header: 'Adres', accessor: 'address' },
    { header: 'Miasto', accessor: 'city' },
    { header: 'Kod pocztowy', accessor: 'postalCode' },
    { header: 'Data kontroli', accessor: 'date' },
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
      header: 'Akcje', 
      accessor: 'id',
      cell: (value) => (
        <div className="flex space-x-2">
          <Button 
            variant="link" 
            onClick={() => console.log(`Zgłoś do CEEB ${value}`)}
            className="text-red-600"
          >
            Zgłoś do CEEB
          </Button>
          <Button 
            variant="link" 
            onClick={() => console.log(`Szczegóły ${value}`)}
          >
            Szczegóły
          </Button>
        </div>
      )
    },
  ];
  
  // Kolumny dla tabeli historii zgłoszeń
  const historyColumns = [
    { header: 'ID zgłoszenia', accessor: 'id' },
    { header: 'Data zgłoszenia', accessor: 'date' },
    { header: 'Liczba kontroli', accessor: 'inspectionsCount' },
    { 
      header: 'Status', 
      accessor: 'status',
      cell: (value) => (
        <StatusBadge 
          status={value} 
          color={value === 'Zaakceptowane' ? 'green' : 'blue'} 
        />
      )
    },
    { 
      header: 'Akcje', 
      accessor: 'id',
      cell: (value) => (
        <div className="flex space-x-2">
          <Button 
            variant="link" 
            onClick={() => console.log(`Szczegóły raportu ${value}`)}
          >
            Szczegóły
          </Button>
          <Button 
            variant="link" 
            onClick={() => console.log(`Pobierz raport ${value}`)}
            className="text-green-600"
          >
            Pobierz
          </Button>
        </div>
      )
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Centralna Ewidencja Emisyjności Budynków</h2>
        <Button 
          onClick={() => console.log('Eksportuj wybrane kontrole do CEEB')} 
          className="flex items-center"
          color="red"
          disabled={pendingInspections.length === 0}
        >
          <Download size={16} className="mr-2" />
          Eksportuj do CEEB
        </Button>
      </div>
      
      <div className="flex space-x-4 border-b pb-2">
        <button
          className={`pb-2 font-medium ${
            activeSection === 'pending' 
              ? 'border-b-2 border-red-500 text-red-600'
              : 'text-gray-500'
          }`}
          onClick={() => setActiveSection('pending')}
        >
          Kontrole do zgłoszenia
          {pendingInspections.length > 0 && (
            <span className="ml-2 px-2 py-1 bg-red-100 text-red-600 rounded-full text-xs">
              {pendingInspections.length}
            </span>
          )}
        </button>
        
        <button
          className={`pb-2 font-medium ${
            activeSection === 'history' 
              ? 'border-b-2 border-red-500 text-red-600'
              : 'text-gray-500'
          }`}
          onClick={() => setActiveSection('history')}
        >
          Historia zgłoszeń
        </button>
      </div>
      
      {activeSection === 'pending' && (
        <div className="space-y-6">
          {pendingInspections.length > 0 ? (
            <Card darkMode={darkMode}>
              <h3 className="font-semibold mb-4">Kontrole do zgłoszenia</h3>
              
              <DataTable
                columns={pendingColumns}
                data={pendingInspections}
                darkMode={darkMode}
              />
            </Card>
          ) : (
            <Card darkMode={darkMode} className="py-8">
              <div className="text-center">
                <CheckCircle size={48} className="mx-auto mb-4 text-green-500" />
                <h3 className="text-xl font-semibold mb-2">Wszystko w porządku!</h3>
                <p className="text-gray-500">
                  Nie masz żadnych kontroli oczekujących na zgłoszenie do CEEB
                </p>
              </div>
            </Card>
          )}
          
          <Card darkMode={darkMode}>
            <h3 className="font-semibold mb-4">Przewodnik po zgłoszeniach CEEB</h3>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="mt-1 mr-3 bg-blue-100 text-blue-800 rounded-full h-6 w-6 flex items-center justify-center">
                  1
                </div>
                <div>
                  <p className="font-medium">Wybierz kontrole do zgłoszenia</p>
                  <p className="text-gray-500 text-sm">
                    Zaznacz kontrole, które chcesz zgłosić do CEEB. Możesz zgłosić wiele kontroli jednocześnie.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="mt-1 mr-3 bg-blue-100 text-blue-800 rounded-full h-6 w-6 flex items-center justify-center">
                  2
                </div>
                <div>
                  <p className="font-medium">Wygeneruj plik XML</p>
                  <p className="text-gray-500 text-sm">
                    System wygeneruje plik XML zgodny z formatem wymaganym przez CEEB.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="mt-1 mr-3 bg-blue-100 text-blue-800 rounded-full h-6 w-6 flex items-center justify-center">
                  3
                </div>
                <div>
                  <p className="font-medium">Prześlij do CEEB</p>
                  <p className="text-gray-500 text-sm">
                    Zaloguj się do systemu CEEB i prześlij wygenerowany plik XML.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="mt-1 mr-3 bg-blue-100 text-blue-800 rounded-full h-6 w-6 flex items-center justify-center">
                  4
                </div>
                <div>
                  <p className="font-medium">Potwierdź przesłanie w systemie</p>
                  <p className="text-gray-500 text-sm">
                    Po pomyślnym przesłaniu pliku, oznacz kontrole jako zgłoszone w systemie.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800 flex items-start">
              <AlertTriangle size={20} className="mr-2 flex-shrink-0 mt-1" />
              <p className="text-sm">
                Pamiętaj, że wszystkie kontrole muszą być zgłoszone do CEEB w ciągu 7 dni od ich przeprowadzenia.
                Niezgłoszenie kontroli w terminie może skutkować karą finansową.
              </p>
            </div>
          </Card>
        </div>
      )}
      
      {activeSection === 'history' && (
        <Card darkMode={darkMode}>
          <h3 className="font-semibold mb-4">Historia zgłoszeń CEEB</h3>
          
          <DataTable
            columns={historyColumns}
            data={data.ceebReports}
            darkMode={darkMode}
          />
        </Card>
      )}
    </div>
  );
};

export default CeebReportsList;