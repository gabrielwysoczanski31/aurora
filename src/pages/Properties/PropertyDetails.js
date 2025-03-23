import React, { useState } from 'react';
import { 
  Home, Users, FileText, Calendar, ChevronLeft, 
  Thermometer, Droplets, Zap, Wifi, Edit, Star, 
  Phone, Mail, MessageSquare, ArrowUpRight, Clock, 
  DollarSign, BarChart2, Camera
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import StatusBadge from '../../components/ui/StatusBadge';
import PropertyForm from './PropertyForm';
import AdvancedCharts from '../../components/ui/AdvancedCharts';

const PropertyDetails = ({ property, darkMode, onBack }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showEditForm, setShowEditForm] = useState(false);

  // Przykładowe dane dla widoku szczegółowego
  const propertyData = property || {
    id: 1,
    name: 'Mieszkanie 1',
    address: 'ul. Marszałkowska 12/34',
    status: 'Wynajęte',
    size: 68,
    price: 3200,
    tenantName: 'Klient1',
    tenantPhone: '+48 123 456 789',
    tenantEmail: 'klient1@example.com',
    leaseStart: '01.01.2025',
    leaseEnd: '31.12.2025',
    lastPayment: '01.03.2025',
    rooms: 3,
    floor: 4,
    hasBalcony: true,
    hasParkingSpace: true,
    description: 'Nowoczesne mieszkanie w centrum miasta z pięknym widokiem. Pełne wyposażenie, blisko komunikacji miejskiej i sklepów.',
    features: [
      { name: 'Ogrzewanie', value: 'Gazowe' },
      { name: 'Woda', value: 'Miejska' },
      { name: 'Energia', value: 'Elektryczna' },
      { name: 'Internet', value: 'Światłowód' }
    ],
    amenities: ['Lodówka', 'Zmywarka', 'Pralka', 'Telewizor', 'Klimatyzacja', 'Kuchenka indukcyjna'],
    history: [
      { date: '01.01.2025', action: 'Umowa najmu', details: 'Podpisano umowę z Klient1' },
      { date: '15.01.2025', action: 'Opłaty', details: 'Uiszczono opłaty za pierwszy miesiąc i kaucję' },
      { date: '01.02.2025', action: 'Opłaty', details: 'Opłacono czynsz za luty' },
      { date: '01.03.2025', action: 'Opłaty', details: 'Opłacono czynsz za marzec' }
    ],
    expenses: [
      { month: 'Styczeń', administration: 450, utilities: 320, repairs: 0, other: 50, total: 820 },
      { month: 'Luty', administration: 450, utilities: 350, repairs: 150, other: 50, total: 1000 },
      { month: 'Marzec', administration: 450, utilities: 310, repairs: 0, other: 50, total: 810 }
    ],
    ratings: {
      condition: 4.5,
      location: 4.8,
      valueForMoney: 4.0,
      management: 4.7,
      overall: 4.5
    },
    notes: 'Najemca preferuje kontakt telefoniczny. Ostatni przegląd techniczny wykonano 15.12.2024.'
  };

  // Funkcja do obsługi edycji mieszkania
  const handleEditSubmit = (updatedData) => {
    console.log('Zaktualizowane dane mieszkania:', updatedData);
    setShowEditForm(false);
    // Tu byłby kod do zapisania danych
  };

  // Renderowanie zakładki przeglądu
  const renderOverview = () => (
    <div className="space-y-6">
      {/* Główne informacje */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card darkMode={darkMode}>
          <h3 className="font-semibold mb-4 flex items-center">
            <Home size={20} className="mr-2" />
            Informacje o mieszkaniu
          </h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-500 text-sm">Status</p>
              <StatusBadge 
                status={propertyData.status} 
                color={
                  propertyData.status === 'Wynajęte' ? 'green' : 
                  propertyData.status === 'Dostępne' ? 'blue' : 
                  propertyData.status === 'W remoncie' ? 'yellow' : 
                  'purple'
                } 
              />
            </div>
            
            <div>
              <p className="text-gray-500 text-sm">Powierzchnia</p>
              <p className="font-medium">{propertyData.size} m²</p>
            </div>
            
            <div>
              <p className="text-gray-500 text-sm">Pokoje</p>
              <p className="font-medium">{propertyData.rooms}</p>
            </div>
            
            <div>
              <p className="text-gray-500 text-sm">Piętro</p>
              <p className="font-medium">{propertyData.floor}</p>
            </div>
            
            <div>
              <p className="text-gray-500 text-sm">Balkon</p>
              <p className="font-medium">{propertyData.hasBalcony ? 'Tak' : 'Nie'}</p>
            </div>
            
            <div>
              <p className="text-gray-500 text-sm">Miejsce parkingowe</p>
              <p className="font-medium">{propertyData.hasParkingSpace ? 'Tak' : 'Nie'}</p>
            </div>
          </div>
          
          <h4 className="font-medium mt-6 mb-2">Wyposażenie i media</h4>
          <div className="grid grid-cols-2 gap-4">
            {propertyData.features.map((feature, index) => (
              <div key={index} className="flex items-center">
                {feature.name === 'Ogrzewanie' && <Thermometer size={16} className="mr-2 text-red-500" />}
                {feature.name === 'Woda' && <Droplets size={16} className="mr-2 text-blue-500" />}
                {feature.name === 'Energia' && <Zap size={16} className="mr-2 text-yellow-500" />}
                {feature.name === 'Internet' && <Wifi size={16} className="mr-2 text-green-500" />}
                <div>
                  <p className="text-gray-500 text-sm">{feature.name}</p>
                  <p className="font-medium">{feature.value}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6">
            <p className="text-gray-500 text-sm mb-2">Dodatkowe wyposażenie</p>
            <div className="flex flex-wrap gap-2">
              {propertyData.amenities.map((amenity, index) => (
                <span 
                  key={index}
                  className={`px-2 py-1 rounded-full text-xs ${
                    darkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-800'
                  }`}
                >
                  {amenity}
                </span>
              ))}
            </div>
          </div>
        </Card>
        
        <Card darkMode={darkMode}>
          <h3 className="font-semibold mb-4 flex items-center">
            <Users size={20} className="mr-2" />
            Informacje o najemcy
          </h3>
          
          {propertyData.status === 'Wynajęte' ? (
            <>
              <div className="flex items-center mb-4">
                <div className={`h-10 w-10 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} flex items-center justify-center text-xl font-semibold mr-3`}>
                  {propertyData.tenantName.charAt(0)}
                </div>
                <div>
                  <p className="font-medium">{propertyData.tenantName}</p>
                  <p className="text-gray-500 text-sm">Aktywny najemca</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center">
                  <Phone size={16} className="mr-2 text-gray-500" />
                  <span>{propertyData.tenantPhone}</span>
                </div>
                <div className="flex items-center">
                  <Mail size={16} className="mr-2 text-gray-500" />
                  <span>{propertyData.tenantEmail}</span>
                </div>
                <div className="flex items-center">
                  <Calendar size={16} className="mr-2 text-gray-500" />
                  <div>
                    <p className="text-gray-500 text-sm">Okres najmu</p>
                    <p>{propertyData.leaseStart} - {propertyData.leaseEnd}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <DollarSign size={16} className="mr-2 text-gray-500" />
                  <div>
                    <p className="text-gray-500 text-sm">Miesięczny czynsz</p>
                    <p className="font-medium">{propertyData.price.toLocaleString()} PLN</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Clock size={16} className="mr-2 text-gray-500" />
                  <div>
                    <p className="text-gray-500 text-sm">Ostatnia płatność</p>
                    <p>{propertyData.lastPayment}</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex justify-between">
                <Button 
                  size="sm"
                  className="flex items-center"
                  variant="outline"
                >
                  <MessageSquare size={16} className="mr-1" />
                  Kontakt
                </Button>
                <Button 
                  size="sm"
                  className="flex items-center"
                  variant="outline"
                >
                  <FileText size={16} className="mr-1" />
                  Umowa
                </Button>
                <Button 
                  size="sm"
                  className="flex items-center"
                  variant="outline"
                >
                  <ArrowUpRight size={16} className="mr-1" />
                  Płatności
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center py-10">
              <Users size={48} className="mx-auto mb-4 text-gray-400" />
              <p className="text-gray-500">Brak aktywnego najemcy</p>
              <Button className="mt-4">Dodaj najemcę</Button>
            </div>
          )}
        </Card>
      </div>
      
      {/* Opis */}
      <Card darkMode={darkMode}>
        <h3 className="font-semibold mb-4">Opis mieszkania</h3>
        <p className="text-gray-700 dark:text-gray-300">{propertyData.description}</p>
      </Card>
      
      {/* Notatki */}
      <Card darkMode={darkMode}>
        <h3 className="font-semibold mb-4">Notatki</h3>
        <p className="text-gray-700 dark:text-gray-300">{propertyData.notes}</p>
      </Card>
      
      {/* Zdjęcia (zaślepka) */}
      <Card darkMode={darkMode}>
        <h3 className="font-semibold mb-4 flex items-center">
          <Camera size={20} className="mr-2" />
          Zdjęcia
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

  // Renderowanie zakładki historii
  const renderHistory = () => (
    <div className="space-y-6">
      <Card darkMode={darkMode}>
        <h3 className="font-semibold mb-4">Historia mieszkania</h3>
        
        <div className="relative">
          {/* Linia czasu */}
          <div 
            className={`absolute left-3 top-4 bottom-0 w-0.5 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}
          ></div>
          
          <div className="space-y-6">
            {propertyData.history.map((event, index) => (
              <div key={index} className="flex">
                <div className={`h-6 w-6 rounded-full ${darkMode ? 'bg-blue-600' : 'bg-blue-500'} flex-shrink-0 z-10 mt-1`}></div>
                <div className="ml-4">
                  <p className="text-gray-500 text-sm">{event.date}</p>
                  <p className="font-medium">{event.action}</p>
                  <p className="text-gray-700 dark:text-gray-300">{event.details}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );

  // Renderowanie zakładki finansów
  const renderFinances = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card darkMode={darkMode}>
          <h3 className="font-semibold mb-4">Czynsz</h3>
          <div className="text-3xl font-bold text-green-600">{propertyData.price.toLocaleString()} PLN</div>
          <p className="text-gray-500">Miesięcznie</p>
        </Card>
        
        <Card darkMode={darkMode}>
          <h3 className="font-semibold mb-4">Średnie koszty</h3>
          <div className="text-3xl font-bold text-red-600">
            {Math.round(propertyData.expenses.reduce((sum, expense) => sum + expense.total, 0) / propertyData.expenses.length).toLocaleString()} PLN
          </div>
          <p className="text-gray-500">Miesięcznie</p>
        </Card>
        
        <Card darkMode={darkMode}>
          <h3 className="font-semibold mb-4">Zysk</h3>
          <div className="text-3xl font-bold text-blue-600">
            {(propertyData.price - Math.round(propertyData.expenses.reduce((sum, expense) => sum + expense.total, 0) / propertyData.expenses.length)).toLocaleString()} PLN
          </div>
          <p className="text-gray-500">Miesięcznie</p>
        </Card>
      </div>
      
      <Card darkMode={darkMode}>
        <h3 className="font-semibold mb-4">Koszty utrzymania</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className={darkMode ? 'border-b border-gray-700' : 'border-b'}>
                <th className="py-2 text-left">Miesiąc</th>
                <th className="py-2 text-right">Administracja</th>
                <th className="py-2 text-right">Media</th>
                <th className="py-2 text-right">Naprawy</th>
                <th className="py-2 text-right">Inne</th>
                <th className="py-2 text-right">Suma</th>
              </tr>
            </thead>
            <tbody>
              {propertyData.expenses.map((expense, index) => (
                <tr key={index} className={darkMode ? 'border-b border-gray-700' : 'border-b'}>
                  <td className="py-2">{expense.month}</td>
                  <td className="py-2 text-right">{expense.administration} PLN</td>
                  <td className="py-2 text-right">{expense.utilities} PLN</td>
                  <td className="py-2 text-right">{expense.repairs} PLN</td>
                  <td className="py-2 text-right">{expense.other} PLN</td>
                  <td className="py-2 text-right font-medium">{expense.total} PLN</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      
      <AdvancedCharts data={null} darkMode={darkMode} type="property" />
    </div>
  );

  // Renderowanie zakładki ocen
  const renderRatings = () => (
    <div className="space-y-6">
      <Card darkMode={darkMode}>
        <h3 className="font-semibold mb-4 flex items-center">
          <Star size={20} className="mr-2 text-yellow-500" />
          Oceny mieszkania
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="text-center mb-6">
              <p className="text-5xl font-bold text-yellow-500">{propertyData.ratings.overall}</p>
              <p className="text-gray-500">Ocena ogólna</p>
            </div>
            
            <div className="space-y-4">
              {Object.entries(propertyData.ratings)
                .filter(([key]) => key !== 'overall')
                .map(([key, value]) => (
                  <div key={key} className="flex justify-between items-center">
                    <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                    <div className="flex items-center">
                      <span className="mr-2 font-medium">{value}</span>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star 
                            key={star} 
                            size={16} 
                            className={star <= value ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'} 
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                ))
              }
            </div>
          </div>
          
          <div className={`rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} p-4`}>
            <p className="font-medium mb-2">Komentarze najemców:</p>
            <div className="space-y-4">
              <div>
                <div className="flex items-center">
                  <div className="h-6 w-6 rounded-full bg-blue-500 flex-shrink-0 mr-2 flex items-center justify-center text-white text-xs font-bold">K</div>
                  <p className="font-medium">Klient1</p>
                </div>
                <p className="mt-1 text-gray-700 dark:text-gray-300">
                  "Bardzo dobre mieszkanie, świetna lokalizacja i dobry kontakt z właścicielem. Polecam!"
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>
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
          <h2 className="text-2xl font-semibold">{propertyData.name}</h2>
        </div>
        
        <Button 
          onClick={() => setShowEditForm(true)}
          className="flex items-center"
        >
          <Edit size={16} className="mr-2" />
          Edytuj
        </Button>
      </div>
      
      <Card darkMode={darkMode} className="p-0 overflow-hidden">
        <div className="px-4 py-2 border-b dark:border-gray-700">
          <p className="font-medium">Adres: {propertyData.address}</p>
        </div>
      </Card>
      
      {/* Nawigacja zakładek */}
      <div className="flex border-b dark:border-gray-700 pb-2 overflow-x-auto">
        <button
          className={`pb-2 mr-6 font-medium whitespace-nowrap ${
            activeTab === 'overview' 
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-500'
          }`}
          onClick={() => setActiveTab('overview')}
        >
          Przegląd
        </button>
        <button
          className={`pb-2 mr-6 font-medium whitespace-nowrap ${
            activeTab === 'history' 
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-500'
          }`}
          onClick={() => setActiveTab('history')}
        >
          Historia
        </button>
        <button
          className={`pb-2 mr-6 font-medium whitespace-nowrap ${
            activeTab === 'finances' 
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-500'
          }`}
          onClick={() => setActiveTab('finances')}
        >
          Finanse i analizy
        </button>
        <button
          className={`pb-2 mr-6 font-medium whitespace-nowrap ${
            activeTab === 'ratings' 
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-500'
          }`}
          onClick={() => setActiveTab('ratings')}
        >
          Oceny
        </button>
      </div>
      
      {/* Treść zakładki */}
      {activeTab === 'overview' && renderOverview()}
      {activeTab === 'history' && renderHistory()}
      {activeTab === 'finances' && renderFinances()}
      {activeTab === 'ratings' && renderRatings()}
      
      {/* Modal edycji */}
      {showEditForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className={`max-w-3xl w-full ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-xl overflow-y-auto max-h-screen`}>
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold">Edytuj mieszkanie</h3>
                <button 
                  onClick={() => setShowEditForm(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={24} />
                </button>
              </div>
              
              <PropertyForm 
                property={propertyData} 
                onSubmit={handleEditSubmit} 
                onCancel={() => setShowEditForm(false)}
                darkMode={darkMode}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyDetails;