import React, { useState } from 'react';
import { 
  Clipboard, Home, Calendar, User, ChevronLeft, FileText, 
  Download, Printer, MapPin, Tool, Edit, AlertTriangle, 
  CheckCircle, AlertCircle, MessageCircle, Camera, Share2
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import StatusBadge from '../../components/ui/StatusBadge';
import AdvancedCharts from '../../components/ui/AdvancedCharts';

const InspectionDetails = ({ inspection, darkMode, onBack }) => {
  const [activeTab, setActiveTab] = useState('details');

  // Przykładowe dane dla widoku szczegółowego
  const inspectionData = inspection || {
    id: 1,
    buildingId: 12,
    type: 'Przewód dymowy',
    result: 'Pozytywny',
    address: 'ul. Kościuszki 12',
    city: 'Warszawa',
    postalCode: '00-001',
    clientId: 3,
    clientName: 'Klient1',
    date: '15.03.2025',
    ceebStatus: 'Zgłoszony do CEEB',
    technicianName: 'Jan Kowalski',
    protocolNumber: 'P/123/2025',
    notes: 'Standardowa kontrola okresowa',
    defects: '',
    recommendations: '',
    buildingInfo: {
      type: 'Wielorodzinny',
      yearBuilt: 1995,
      floors: 5,
      heatingType: 'Gazowe',
      otherProperties: [
        { name: 'Materiał budynku', value: 'Cegła' },
        { name: 'Dach', value: 'Dwuspadowy' },
        { name: 'Stan techniczny', value: 'Dobry' }
      ]
    },
    inspectionDetails: {
      startTime: '09:30',
      endTime: '11:45',
      temperature: '18°C',
      weatherConditions: 'Pochmurno',
      lastInspection: '12.09.2024',
      nextInspectionDue: '15.03.2026'
    },
    inspectedItems: [
      { name: 'Przewód na parterze', status: 'OK', notes: 'Brak uwag' },
      { name: 'Przewód na I piętrze', status: 'OK', notes: 'Brak uwag' },
      { name: 'Przewód na II piętrze', status: 'OK', notes: 'Brak uwag' },
      { name: 'Przewód na III piętrze', status: 'OK', notes: 'Brak uwag' },
      { name: 'Przewód na IV piętrze', status: 'OK', notes: 'Brak uwag' }
    ],
    signatures: [
      { name: 'Technik', signed: true, date: '15.03.2025 11:45' },
      { name: 'Przedstawiciel klienta', signed: true, date: '15.03.2025 11:47' }
    ],
    history: [
      { date: '15.03.2025 09:30', action: 'Rozpoczęcie kontroli', user: 'Jan Kowalski' },
      { date: '15.03.2025 11:45', action: 'Zakończenie kontroli', user: 'Jan Kowalski' },
      { date: '15.03.2025 13:20', action: 'Wygenerowanie protokołu', user: 'Jan Kowalski' },
      { date: '15.03.2025 14:10', action: 'Zgłoszenie do CEEB', user: 'Adam Nowak' }
    ],
    relatedDocuments: [
      { name: 'Protokół kontroli', type: 'PDF', date: '15.03.2025' },
      { name: 'Zgłoszenie CEEB', type: 'XML', date: '15.03.2025' },
      { name: 'Faktura za usługę', type: 'PDF', date: '15.03.2025' }
    ]
  };

  // Funkcja renderująca zakładkę szczegółów
  const renderDetails = () => (
    <div className="space-y-6">
      {/* Główne informacje */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card darkMode={darkMode}>
          <h3 className="font-semibold mb-4 flex items-center">
            <Clipboard size={20} className="mr-2" />
            Szczegóły kontroli
          </h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-500 text-sm">Typ kontroli</p>
              <p className="font-medium">{inspectionData.type}</p>
            </div>
            
            <div>
              <p className="text-gray-500 text-sm">Wynik</p>
              <StatusBadge 
                status={inspectionData.result} 
                color={
                  inspectionData.result === 'Pozytywny' ? 'green' : 
                  inspectionData.result === 'Negatywny' ? 'red' : 
                  'yellow'
                } 
              />
            </div>
            
            <div>
              <p className="text-gray-500 text-sm">Data kontroli</p>
              <p className="font-medium">{inspectionData.date}</p>
            </div>
            
            <div>
              <p className="text-gray-500 text-sm">Status CEEB</p>
              <StatusBadge 
                status={inspectionData.ceebStatus} 
                color={inspectionData.ceebStatus === 'Zgłoszony do CEEB' ? 'green' : 'yellow'} 
              />
            </div>
            
            <div>
              <p className="text-gray-500 text-sm">Numer protokołu</p>
              <p className="font-medium">{inspectionData.protocolNumber}</p>
            </div>
            
            <div>
              <p className="text-gray-500 text-sm">Technik</p>
              <p className="font-medium">{inspectionData.technicianName}</p>
            </div>
          </div>
          
          <div className="mt-4">
            <p className="text-gray-500 text-sm">Uwagi</p>
            <p className="mt-1">{inspectionData.notes || 'Brak uwag'}</p>
          </div>
          
          {inspectionData.defects && (
            <div className="mt-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 dark:bg-red-900 dark:border-red-500 dark:text-red-100">
              <p className="font-medium">Stwierdzone usterki:</p>
              <p>{inspectionData.defects}</p>
            </div>
          )}
          
          {inspectionData.recommendations && (
            <div className="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-500 text-yellow-700 dark:bg-yellow-900 dark:border-yellow-500 dark:text-yellow-100">
              <p className="font-medium">Zalecenia:</p>
              <p>{inspectionData.recommendations}</p>
            </div>
          )}
          
          <div className="mt-6 flex flex-wrap gap-2">
            <Button 
              size="sm"
              className="flex items-center"
              variant="outline"
            >
              <FileText size={16} className="mr-1" />
              Protokół
            </Button>
            <Button 
              size="sm"
              className="flex items-center"
              variant="outline"
            >
              <Printer size={16} className="mr-1" />
              Drukuj
            </Button>
            <Button 
              size="sm"
              className="flex items-center"
              variant="outline"
            >
              <Download size={16} className="mr-1" />
              Pobierz
            </Button>
            <Button 
              size="sm"
              className="flex items-center"
              variant="outline"
            >
              <Share2 size={16} className="mr-1" />
              Udostępnij
            </Button>
          </div>
        </Card>
        
        <Card darkMode={darkMode}>
          <h3 className="font-semibold mb-4 flex items-center">
            <MapPin size={20} className="mr-2" />
            Informacje o budynku
          </h3>
          
          <div>
            <p className="font-medium">{inspectionData.address}</p>
            <p className="text-gray-500">{inspectionData.postalCode} {inspectionData.city}</p>
          </div>
          
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-500 text-sm">Klient</p>
              <p className="font-medium">{inspectionData.clientName}</p>
            </div>
            
            <div>
              <p className="text-gray-500 text-sm">Typ budynku</p>
              <p className="font-medium">{inspectionData.buildingInfo.type}</p>
            </div>
            
            <div>
              <p className="text-gray-500 text-sm">Rok budowy</p>
              <p className="font-medium">{inspectionData.buildingInfo.yearBuilt}</p>
            </div>
            
            <div>
              <p className="text-gray-500 text-sm">Liczba pięter</p>
              <p className="font-medium">{inspectionData.buildingInfo.floors}</p>
            </div>
            
            <div>
              <p className="text-gray-500 text-sm">Ogrzewanie</p>
              <p className="font-medium">{inspectionData.buildingInfo.heatingType}</p>
            </div>
          </div>
          
          <div className="mt-6">
            <h4 className="font-medium mb-2">Cechy budynku</h4>
            <div className="grid grid-cols-2 gap-4">
              {inspectionData.buildingInfo.otherProperties.map((prop, index) => (
                <div key={index}>
                  <p className="text-gray-500 text-sm">{prop.name}</p>
                  <p className="font-medium">{prop.value}</p>
                </div>
              ))}
            </div>
          </div>
          
          <div className="mt-6">
            <h4 className="font-medium mb-2">Szczegóły kontroli</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-500 text-sm">Czas rozpoczęcia</p>
                <p className="font-medium">{inspectionData.inspectionDetails.startTime}</p>
              </div>
              
              <div>
                <p className="text-gray-500 text-sm">Czas zakończenia</p>
                <p className="font-medium">{inspectionData.inspectionDetails.endTime}</p>
              </div>
              
              <div>
                <p className="text-gray-500 text-sm">Ostatnia kontrola</p>
                <p className="font-medium">{inspectionData.inspectionDetails.lastInspection}</p>
              </div>
              
              <div>
                <p className="text-gray-500 text-sm">Następna kontrola</p>
                <p className="font-medium">{inspectionData.inspectionDetails.nextInspectionDue}</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
      
      {/* Skontrolowane elementy */}
      <Card darkMode={darkMode}>
        <h3 className="font-semibold mb-4 flex items-center">
          <Tool size={20} className="mr-2" />
          Skontrolowane elementy
        </h3>
        
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className={darkMode ? 'border-b border-gray-700' : 'border-b'}>
                <th className="py-2 text-left">Element</th>
                <th className="py-2 text-left">Status</th>
                <th className="py-2 text-left">Uwagi</th>
              </tr>
            </thead>
            <tbody>
              {inspectionData.inspectedItems.map((item, index) => (
                <tr key={index} className={darkMode ? 'border-b border-gray-700' : 'border-b'}>
                  <td className="py-2">{item.name}</td>
                  <td className="py-2">
                    {item.status === 'OK' ? (
                      <span className="flex items-center text-green-600">
                        <CheckCircle size={16} className="mr-1" />
                        OK
                      </span>
                    ) : item.status === 'Usterka' ? (
                      <span className="flex items-center text-red-600">
                        <AlertTriangle size={16} className="mr-1" />
                        Usterka
                      </span>
                    ) : (
                      <span className="flex items-center text-yellow-600">
                        <AlertCircle size={16} className="mr-1" />
                        Uwagi
                      </span>
                    )}
                  </td>
                  <td className="py-2">{item.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      
      {/* Podpisy */}
      <Card darkMode={darkMode}>
        <h3 className="font-semibold mb-4">Podpisy</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {inspectionData.signatures.map((signature, index) => (
            <div 
              key={index} 
              className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}
            >
              <p className="text-gray-500 text-sm">{signature.name}</p>
              <div className="mt-2 flex justify-between items-center">
                <div>
                  {signature.signed ? (
                    <span className="flex items-center text-green-600">
                      <CheckCircle size={16} className="mr-1" />
                      Podpisano
                    </span>
                  ) : (
                    <span className="flex items-center text-red-600">
                      <AlertCircle size={16} className="mr-1" />
                      Brak podpisu
                    </span>
                  )}
                  <p className="text-xs text-gray-500 mt-1">{signature.date || '-'}</p>
                </div>
                
                <div className={`h-12 w-20 ${signature.signed ? 'border-green-500' : 'border-red-500'} border-2 rounded flex items-center justify-center`}>
                  {signature.signed ? (
                    <p className="text-xs italic text-gray-500">Podpisano elektronicznie</p>
                  ) : (
                    <p className="text-xs italic text-gray-500">Brak podpisu</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
      
      {/* Zdjęcia (zaślepka) */}
      <Card darkMode={darkMode}>
        <h3 className="font-semibold mb-4 flex items-center">
          <Camera size={20} className="mr-2" />
          Dokumentacja fotograficzna
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div 
              key={i}
              className={`aspect-video rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} flex items-center justify-center`}
            >
              <Camera size={32} className="text-gray-400" />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );

  // Funkcja renderująca zakładkę historii
  const renderHistory = () => (
    <div className="space-y-6">
      <Card darkMode={darkMode}>
        <h3 className="font-semibold mb-4">Historia kontroli</h3>
        
        <div className="relative">
          {/* Linia czasu */}
          <div 
            className={`absolute left-3 top-4 bottom-0 w-0.5 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}
          ></div>
          
          <div className="space-y-6">
            {inspectionData.history.map((event, index) => (
              <div key={index} className="flex">
                <div className={`h-6 w-6 rounded-full ${darkMode ? 'bg-red-600' : 'bg-red-500'} flex-shrink-0 z-10 mt-1`}></div>
                <div className="ml-4">
                  <p className="text-gray-500 text-sm">{event.date}</p>
                  <p className="font-medium">{event.action}</p>
                  <p className="text-gray-700 dark:text-gray-300">Wykonał: {event.user}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
      
      <Card darkMode={darkMode}>
        <h3 className="font-semibold mb-4">Dokumenty powiązane</h3>
        
        <div className="space-y-4">
          {inspectionData.relatedDocuments.map((doc, index) => (
            <div 
              key={index}
              className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} flex justify-between items-center`}
            >
              <div className="flex items-center">
                <FileText size={20} className="mr-3 text-gray-500" />
                <div>
                  <p className="font-medium">{doc.name}</p>
                  <p className="text-gray-500 text-sm">{doc.type} • {doc.date}</p>
                </div>
              </div>
              
              <Button
                size="sm"
                variant="outline"
                className="flex items-center"
              >
                <Download size={16} className="mr-1" />
                Pobierz
              </Button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );

  // Funkcja renderująca zakładkę komentarzy
  const renderComments = () => (
    <div className="space-y-6">
      <Card darkMode={darkMode}>
        <h3 className="font-semibold mb-4">Komentarze i notatki</h3>
        
        <div className="space-y-4 mb-6">
          <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
            <div className="flex items-start">
              <div className="h-8 w-8 rounded-full bg-blue-500 flex-shrink-0 mr-3 flex items-center justify-center text-white font-medium">
                JK
              </div>
              <div>
                <div className="flex items-center">
                  <p className="font-medium">Jan Kowalski</p>
                  <p className="text-gray-500 text-xs ml-2">15.03.2025, 14:30</p>
                </div>
                <p className="mt-1">Kontrola przebiegła bez problemów. Przewody są w dobrym stanie technicznym.</p>
              </div>
            </div>
          </div>
          
          <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
            <div className="flex items-start">
              <div className="h-8 w-8 rounded-full bg-green-500 flex-shrink-0 mr-3 flex items-center justify-center text-white font-medium">
                AN
              </div>
              <div>
                <div className="flex items-center">
                  <p className="font-medium">Adam Nowak</p>
                  <p className="text-gray-500 text-xs ml-2">15.03.2025, 15:45</p>
                </div>
                <p className="mt-1">Pomyślnie zgłoszono wyniki kontroli do CEEB.</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className={`p-4 rounded-lg border ${darkMode ? 'border-gray-700' : 'border-gray-300'}`}>
          <h4 className="font-medium mb-2">Dodaj komentarz</h4>
          <textarea 
            className={`w-full p-2 border rounded-lg ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
            rows="3"
            placeholder="Wpisz swój komentarz..."
          ></textarea>
          <div className="mt-2 flex justify-end">
            <Button 
              className="flex items-center"
              size="sm"
            >
              <MessageCircle size={16} className="mr-1" />
              Dodaj komentarz
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );

  // Funkcja renderująca zakładkę analizy
  const renderAnalysis = () => (
    <div className="space-y-6">
      <AdvancedCharts data={null} darkMode={darkMode} type="chimney" />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card darkMode={darkMode}>
          <h3 className="font-semibold mb-4">Statystyki kontroli</h3>
          
          <div className="space-y-4">
            <div>
              <p className="text-gray-500 text-sm">Średni czas trwania kontroli</p>
              <p className="font-medium text-xl">2 godz. 15 min.</p>
            </div>
            
            <div>
              <p className="text-gray-500 text-sm">Liczba kontroli budynku w ciągu roku</p>
              <p className="font-medium text-xl">4</p>
            </div>
            
            <div>
              <p className="text-gray-500 text-sm">% kontroli z wynikiem pozytywnym</p>
              <p className="font-medium text-xl">75%</p>
            </div>
            
            <div>
              <p className="text-gray-500 text-sm">Średni czas od kontroli do zgłoszenia CEEB</p>
              <p className="font-medium text-xl">2.5 godz.</p>
            </div>
          </div>
        </Card>
        
        <Card darkMode={darkMode}>
          <h3 className="font-semibold mb-4">Historia budynku</h3>
          
          <div className="space-y-2">
            <div className={`p-2 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} flex justify-between`}>
              <div>
                <p className="font-medium">Kontrola przewodu dymowego</p>
                <p className="text-gray-500 text-xs">15.09.2024</p>
              </div>
              <StatusBadge status="Pozytywny" color="green" />
            </div>
            
            <div className={`p-2 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} flex justify-between`}>
              <div>
                <p className="font-medium">Kontrola przewodu spalinowego</p>
                <p className="text-gray-500 text-xs">15.06.2024</p>
              </div>
              <StatusBadge status="Pozytywny" color="green" />
            </div>
            
            <div className={`p-2 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} flex justify-between`}>
              <div>
                <p className="font-medium">Kontrola przewodu wentylacyjnego</p>
                <p className="text-gray-500 text-xs">20.03.2024</p>
              </div>
              <StatusBadge status="Warunkowy" color="yellow" />
            </div>
            
            <div className={`p-2 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} flex justify-between`}>
              <div>
                <p className="font-medium">Kontrola przewodu dymowego</p>
                <p className="text-gray-500 text-xs">15.12.2023</p>
              </div>
              <StatusBadge status="Pozytywny" color="green" />
            </div>
          </div>
          
          <Button 
            variant="outline" 
            className="mt-4 w-full"
          >
            Zobacz pełną historię
          </Button>
        </Card>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <button 
            onClick={onBack}
            className={`mr-2 p-1 rounded-full ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
          >
            <ChevronLeft size={24} />
          </button>
          <h2 className="text-2xl font-semibold">Kontrola #{inspectionData.id}</h2>
        </div>
        
        <Button 
          className="flex items-center"
          color="red"
        >
          <Edit size={16} className="mr-2" />
          Edytuj
        </Button>
      </div>
      
      <Card darkMode={darkMode} className="p-0 overflow-hidden">
        <div className="px-4 py-2 border-b dark:border-gray-700">
          <p className="font-medium">Protokół: {inspectionData.protocolNumber} | Data: {inspectionData.date}</p>
        </div>
      </Card>
      
      {/* Nawigacja zakładek */}
      <div className="flex border-b dark:border-gray-700 pb-2 overflow-x-auto">
        <button
          className={`pb-2 mr-6 font-medium whitespace-nowrap ${
            activeTab === 'details' 
              ? 'border-b-2 border-red-500 text-red-600'
              : 'text-gray-500'
          }`}
          onClick={() => setActiveTab('details')}
        >
          Szczegóły
        </button>
        <button
          className={`pb-2 mr-6 font-medium whitespace-nowrap ${
            activeTab === 'history' 
              ? 'border-b-2 border-red-500 text-red-600'
              : 'text-gray-500'
          }`}
          onClick={() => setActiveTab('history')}
        >
          Historia
        </button>
        <button
          className={`pb-2 mr-6 font-medium whitespace-nowrap ${
            activeTab === 'comments' 
              ? 'border-b-2 border-red-500 text-red-600'
              : 'text-gray-500'
          }`}
          onClick={() => setActiveTab('comments')}
        >
          Komentarze
        </button>
        <button
          className={`pb-2 mr-6 font-medium whitespace-nowrap ${
            activeTab === 'analysis' 
              ? 'border-b-2 border-red-500 text-red-600'
              : 'text-gray-500'
          }`}
          onClick={() => setActiveTab('analysis')}
        >
          Analiza
        </button>
      </div>
      
      {/* Treść zakładki */}
      {activeTab === 'details' && renderDetails()}
      {activeTab === 'history' && renderHistory()}
      {activeTab === 'comments' && renderComments()}
      {activeTab === 'analysis' && renderAnalysis()}
    </div>
  );
};

export default InspectionDetails;