import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, Filter, Plus, User, Building, Phone, Mail, MapPin, ChevronDown, 
  Save, ArrowDownToLine, X, AlertTriangle, BrainCircuit, BarChart2, 
  TrendingUp, TrendingDown, Calendar, Star, AlertCircle, Zap, 
  UserPlus, ArrowRight, RefreshCw
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import DataTable from '../../components/ui/DataTable';
import AdvancedFilter from '../../components/ui/AdvancedFilter';
import ClientForm from './ClientForm';

const ClientsList = ({ data = [], darkMode, type = 'chimney' }) => {
  // Stan aplikacji
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredClients, setFilteredClients] = useState([]);
  const [clients, setClients] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [showSavedFiltersDropdown, setShowSavedFiltersDropdown] = useState(false);
  const [showSaveFilterModal, setShowSaveFilterModal] = useState(false);
  const [newFilterName, setNewFilterName] = useState('');
  const [currentFilters, setCurrentFilters] = useState({});
  const [savedFilters, setSavedFilters] = useState([
    { 
      id: 'new-clients', 
      name: 'Nowi klienci', 
      filters: { sortBy: 'newest', searchTerm: '' } 
    },
    { 
      id: 'warsaw-clients', 
      name: 'Klienci z Warszawy', 
      filters: { city: 'Warszawa', searchTerm: '' } 
    }
  ]);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [clientToDelete, setClientToDelete] = useState(null);
  const [clientToEdit, setClientToEdit] = useState(null);
  const [selectedClients, setSelectedClients] = useState([]);
  
  // Stany dla funkcji AI
  const [showAIInsights, setShowAIInsights] = useState(false);
  const [aiLoading, setAILoading] = useState(false);
  const [aiInsights, setAIInsights] = useState([]);
  const [clientSegments, setClientSegments] = useState({});
  const [clientScores, setClientScores] = useState({});
  const [showAIRecommendations, setShowAIRecommendations] = useState(false);
  const [aiRecommendations, setAIRecommendations] = useState([]);
  const [aiClientPredictions, setAIClientPredictions] = useState({});
  
  // Referencje dla komponentów
  const filterDropdownRef = useRef(null);
  
  // Inicjalizacja danych klientów
  useEffect(() => {
    setClients(data || []);
    setFilteredClients(data || []);
  }, [data]);
  
  // Obsługa kliknięcia poza menu filtrów
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterDropdownRef.current && !filterDropdownRef.current.contains(event.target)) {
        setShowSavedFiltersDropdown(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  // Funkcja filtrowania
  const handleFilter = (filters) => {
    let filtered = [...clients];
    
    // Filtrowanie po wyszukiwaniu
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(client => 
        client.name.toLowerCase().includes(searchLower) ||
        (client.email && client.email.toLowerCase().includes(searchLower)) ||
        (client.city && client.city.toLowerCase().includes(searchLower)) ||
        (client.address && client.address.toLowerCase().includes(searchLower))
      );
    }
    
    // Filtrowanie po mieście (jeśli dostępne)
    if (filters.city && filters.city !== 'all' && type === 'chimney') {
      filtered = filtered.filter(client => client.city === filters.city);
    }
    
    // Filtrowanie po liczbie budynków (dla typu chimney)
    if (filters.buildingsCount && filters.buildingsCount !== 'all' && type === 'chimney') {
      if (filters.buildingsCount === '1') {
        filtered = filtered.filter(client => client.buildingsCount === 1);
      } else if (filters.buildingsCount === '2-5') {
        filtered = filtered.filter(client => client.buildingsCount >= 2 && client.buildingsCount <= 5);
      } else if (filters.buildingsCount === '6+') {
        filtered = filtered.filter(client => client.buildingsCount >= 6);
      }
    }
    
    // Filtrowanie po statusie płatności (dla typu property)
    if (filters.paymentStatus && filters.paymentStatus !== 'all' && type === 'property') {
      filtered = filtered.filter(client => 
        (filters.paymentStatus === 'Opłacone' && client.lastPayment) ||
        (filters.paymentStatus === 'Zaległe' && !client.lastPayment)
      );
    }
    
    // Filtrowanie po statusie umowy (dla typu property)
    if (filters.leaseStatus && filters.leaseStatus !== 'all' && type === 'property') {
      if (filters.leaseStatus === 'ending') {
        // Logika dla kończących się umów - załóżmy, że to umowy, które kończą się w ciągu miesiąca
        const oneMonthFromNow = new Date();
        oneMonthFromNow.setMonth(oneMonthFromNow.getMonth() + 1);
        
        filtered = filtered.filter(client => {
          if (!client.leaseEnd) return false;
          
          const parts = client.leaseEnd.split('.');
          const leaseEndDate = new Date(parts[2], parts[1] - 1, parts[0]);
          return leaseEndDate <= oneMonthFromNow && leaseEndDate >= new Date();
        });
      } else if (filters.leaseStatus === 'active') {
        // Wszystkie aktywne umowy
        filtered = filtered.filter(client => !!client.leaseEnd);
      }
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
        case 'newest':
          filtered.sort((a, b) => {
            if (a.lastInspection && b.lastInspection) {
              return new Date(b.lastInspection.split('.').reverse().join('-')) - 
                     new Date(a.lastInspection.split('.').reverse().join('-'));
            }
            return 0;
          });
          break;
        case 'rentAsc':
          if (type === 'property') {
            filtered.sort((a, b) => a.rent - b.rent);
          }
          break;
        case 'rentDesc':
          if (type === 'property') {
            filtered.sort((a, b) => b.rent - a.rent);
          }
          break;
        default:
          break;
      }
    }
    
    setFilteredClients(filtered);
    setCurrentFilters(filters);
    
    // Aktualizuj zaznaczenia, aby usunąć klientów, którzy nie są już widoczni
    setSelectedClients(prev => prev.filter(id => 
      filtered.some(client => client.id === id)
    ));
  };
  
  // Resetowanie filtrów
  const resetFilters = () => {
    setSearchTerm('');
    
    // Domyślne filtry zależne od typu
    const defaultFilters = {
      searchTerm: '',
      sortBy: 'nameAsc'
    };
    
    if (type === 'chimney') {
      defaultFilters.city = 'all';
      defaultFilters.buildingsCount = 'all';
    } else {
      defaultFilters.paymentStatus = 'all';
      defaultFilters.leaseStatus = 'all';
    }
    
    setCurrentFilters(defaultFilters);
    setFilteredClients(clients);
  };
  
  // Obsługa dodawania nowego klienta
  const handleAddClient = (newClient) => {
    // W realnej aplikacji, dodalibyśmy klienta do bazy danych
    console.log('Dodawanie nowego klienta:', newClient);
    
    // Dla demo, dodajemy do lokalnego stanu
    const updatedClients = [...clients, newClient];
    setClients(updatedClients);
    setFilteredClients(updatedClients);
    setShowAddForm(false);
    
    // Pokaz komunikat sukcesu
    alert(`Klient "${newClient.name}" został dodany pomyślnie!`);
    
    // Generowanie nowych analiz AI
    if (showAIInsights) {
      generateAIInsights(updatedClients);
    }
  };
  
  // Obsługa edycji klienta
  const handleEditClient = (clientId) => {
    const client = clients.find(c => c.id === clientId);
    if (client) {
      setClientToEdit(client);
      setShowAddForm(true);
    }
  };
  
  // Obsługa zapisu zmian w edycji klienta
  const handleEditSubmit = (updatedClient) => {
    // W realnej aplikacji, aktualizowalibyśmy klienta w bazie danych
    console.log('Aktualizacja klienta:', updatedClient);
    
    // Dla demo, aktualizujemy lokalny stan
    const updatedClients = clients.map(client => 
      client.id === updatedClient.id ? updatedClient : client
    );
    
    setClients(updatedClients);
    setFilteredClients(updatedClients);
    setClientToEdit(null);
    setShowAddForm(false);
    
    // Pokaz komunikat sukcesu
    alert(`Klient "${updatedClient.name}" został zaktualizowany pomyślnie!`);
    
    // Generowanie nowych analiz AI
    if (showAIInsights) {
      generateAIInsights(updatedClients);
    }
  };
  
  // Obsługa kliknięcia usunięcia - pokaż potwierdzenie
  const handleDeleteClick = (clientId) => {
    const client = clients.find(c => c.id === clientId);
    if (client) {
      setClientToDelete(client);
      setShowConfirmDelete(true);
    }
  };
  
  // Obsługa potwierdzonego usunięcia
  const handleConfirmDelete = () => {
    if (clientToDelete) {
      // W realnej aplikacji, usunęlibyśmy klienta z bazy danych
      console.log('Usuwanie klienta:', clientToDelete);
      
      // Dla demo, usuwamy z lokalnego stanu
      const updatedClients = clients.filter(client => client.id !== clientToDelete.id);
      setClients(updatedClients);
      setFilteredClients(updatedClients);
      
      // Czyścimy stan i zamykamy modal
      setClientToDelete(null);
      setShowConfirmDelete(false);
      
      // Pokaz komunikat sukcesu
      alert(`Klient "${clientToDelete.name}" został usunięty pomyślnie!`);
      
      // Generowanie nowych analiz AI jeśli są widoczne
      if (showAIInsights) {
        generateAIInsights(updatedClients);
      }
    }
  };
  
  // Obsługa zapisu filtra
  const handleSaveFilter = () => {
    if (!newFilterName.trim()) return;
    
    const newFilter = {
      id: Date.now().toString(),
      name: newFilterName,
      filters: { ...currentFilters }
    };
    
    const updatedFilters = [...savedFilters, newFilter];
    setSavedFilters(updatedFilters);
    setShowSaveFilterModal(false);
    setNewFilterName('');
    
    // Pokaz komunikat sukcesu
    alert(`Filtr "${newFilterName}" został zapisany pomyślnie!`);
  };
  
  // Obsługa usunięcia zapisanego filtra
  const handleDeleteFilter = (filterId) => {
    const updatedFilters = savedFilters.filter(filter => filter.id !== filterId);
    setSavedFilters(updatedFilters);
  };
  
  // Obsługa zastosowania zapisanego filtra
  const handleApplySavedFilter = (filter) => {
    handleFilter(filter.filters);
    setCurrentFilters(filter.filters);
    setShowSavedFiltersDropdown(false);
  };
  
  // Obsługa podglądu szczegółów klienta
  const handleViewClientDetails = (clientId) => {
    const client = clients.find(c => c.id === clientId);
    if (client) {
      console.log('Podgląd szczegółów klienta:', client);
      // W realnej aplikacji, przeszlibyśmy do strony szczegółów klienta
      alert(`Przejście do szczegółów klienta: ${client.name}`);
    }
  };
  
  // Obsługa podglądu budynków klienta (tylko dla interfejsu kominiarskiego)
  const handleViewBuildings = (clientId) => {
    const client = clients.find(c => c.id === clientId);
    if (client && type === 'chimney') {
      console.log('Podgląd budynków klienta:', client);
      // W realnej aplikacji, przeszlibyśmy do strony budynków z filtrowaniem po kliencie
      alert(`Przejście do budynków klienta: ${client.name}`);
    }
  };
  
  // Obsługa zaznaczania klienta
  const handleClientSelect = (clientId) => {
    setSelectedClients(prev => {
      if (prev.includes(clientId)) {
        return prev.filter(id => id !== clientId);
      } else {
        return [...prev, clientId];
      }
    });
  };
  
  // Obsługa zaznaczania wszystkich widocznych klientów
  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedClients(filteredClients.map(client => client.id));
    } else {
      setSelectedClients([]);
    }
  };
  
  // Generowanie analiz AI
  const generateAIInsights = (clientsData = clients) => {
    setAILoading(true);
    setShowAIInsights(true);
    
    // Symulacja analizy AI - w rzeczywistej aplikacji byłoby to zapytanie do API
    setTimeout(() => {
      // Analiza segmentów klientów
      const segments = {
        high_value: [],      // Klienci o wysokiej wartości
        regular: [],         // Standardowi klienci
        inactive: [],        // Nieaktywni klienci
        new: []              // Nowi klienci
      };
      
      // Przypisanie klientów do segmentów (logika przykładowa)
      clientsData.forEach(client => {
        // Przykładowa logika segmentacji
        if (type === 'chimney') {
          if (client.buildingsCount >= 5) {
            segments.high_value.push(client.id);
          } else if (!client.lastInspection) {
            segments.new.push(client.id);
          } else {
            // Sprawdź datę ostatniej inspekcji
            const lastInspDate = client.lastInspection ? 
              new Date(client.lastInspection.split('.').reverse().join('-')) : null;
            
            const sixMonthsAgo = new Date();
            sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
            
            if (lastInspDate && lastInspDate < sixMonthsAgo) {
              segments.inactive.push(client.id);
            } else {
              segments.regular.push(client.id);
            }
          }
        } else {
          // Logika dla typu 'property'
          if (client.rent && client.rent >= 3000) {
            segments.high_value.push(client.id);
          } else if (!client.lastPayment) {
            segments.inactive.push(client.id);
          } else if (!client.leaseStart || 
                     new Date(client.leaseStart.split('.').reverse().join('-')) > 
                     new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)) {
            segments.new.push(client.id);
          } else {
            segments.regular.push(client.id);
          }
        }
      });
      
      setClientSegments(segments);
      
      // Generowanie ocen klientów
      const scores = {};
      clientsData.forEach(client => {
        // Przykładowa logika punktacji
        let score = 0;
        
        // Dodaj punkty za różne czynniki
        if (type === 'chimney') {
          // Punkty za liczbę budynków
          score += (client.buildingsCount || 0) * 5;
          
          // Punkty za ostatnią inspekcję
          if (client.lastInspection) {
            const lastInspDate = new Date(client.lastInspection.split('.').reverse().join('-'));
            const daysSinceInsp = Math.floor((new Date() - lastInspDate) / (1000 * 60 * 60 * 24));
            
            if (daysSinceInsp < 180) {
              score += 20; // Aktywny w ciągu ostatnich 6 miesięcy
            } else if (daysSinceInsp < 365) {
              score += 10; // Aktywny w ciągu ostatniego roku
            }
          }
        } else {
          // Punkty za czynsz
          score += (client.rent || 0) / 100;
          
          // Punkty za terminowe płatności
          if (client.lastPayment) {
            score += 15;
          }
          
          // Punkty za długość umowy
          if (client.leaseStart && client.leaseEnd) {
            const start = new Date(client.leaseStart.split('.').reverse().join('-'));
            const end = new Date(client.leaseEnd.split('.').reverse().join('-'));
            const monthsDuration = (end - start) / (1000 * 60 * 60 * 24 * 30);
            
            score += monthsDuration * 2;
          }
        }
        
        // Normalizacja wyniku do zakresu 0-100
        scores[client.id] = Math.min(100, Math.max(0, score));
      });
      
      setClientScores(scores);
      
      // Generowanie rekomendacji AI
      const recommendations = [];
      
      // Rekomendacja dla nieaktywnych klientów
      if (segments.inactive.length > 0) {
        recommendations.push({
          title: 'Kampania reaktywacyjna',
          description: `Zidentyfikowano ${segments.inactive.length} nieaktywnych klientów. Rozważ wysłanie spersonalizowanej oferty, aby ich reaktywować.`,
          action: 'Utwórz kampanię',
          actionHandler: () => {
            alert('W rzeczywistej aplikacji, otworzyłoby to kreator kampanii reaktywacyjnej.');
            setSelectedClients(segments.inactive);
          },
          icon: <RefreshCw size={16} className="text-blue-500" />
        });
      }
      
      // Rekomendacja dla klientów o wysokiej wartości
      if (segments.high_value.length > 0) {
        recommendations.push({
          title: 'Program lojalnościowy',
          description: `${segments.high_value.length} klientów kwalifikuje się do programu lojalnościowego dla najważniejszych klientów.`,
          action: 'Zaproś do programu',
          actionHandler: () => {
            alert('W rzeczywistej aplikacji, otworzyłoby to narzędzie do zarządzania programem lojalnościowym.');
            setSelectedClients(segments.high_value);
          },
          icon: <Star size={16} className="text-yellow-500" />
        });
      }
      
      // Rekomendacja dla klientów typu 'chimney'
      if (type === 'chimney') {
        // Identyfikuj klientów, którzy mogą potrzebować przeglądu
        const clientsDueForInspection = clientsData.filter(client => {
          if (!client.lastInspection) return false;
          
          const lastInspDate = new Date(client.lastInspection.split('.').reverse().join('-'));
          const daysSinceInsp = Math.floor((new Date() - lastInspDate) / (1000 * 60 * 60 * 24));
          
          return daysSinceInsp > 330; // Prawie rok od ostatniej inspekcji
        });
        
        if (clientsDueForInspection.length > 0) {
          recommendations.push({
            title: 'Harmonogram przeglądów',
            description: `${clientsDueForInspection.length} klientów będzie potrzebowało przeglądu w ciągu następnych 35 dni.`,
            action: 'Zaplanuj przeglądy',
            actionHandler: () => {
              alert('W rzeczywistej aplikacji, otworzyłoby to narzędzie do planowania przeglądów.');
              setSelectedClients(clientsDueForInspection.map(c => c.id));
            },
            icon: <Calendar size={16} className="text-green-500" />
          });
        }
      } else {
        // Rekomendacja dla klientów typu 'property'
        const leasesEnding = clientsData.filter(client => {
          if (!client.leaseEnd) return false;
          
          const leaseEndDate = new Date(client.leaseEnd.split('.').reverse().join('-'));
          const daysToEnd = Math.floor((leaseEndDate - new Date()) / (1000 * 60 * 60 * 24));
          
          return daysToEnd > 0 && daysToEnd < 60; // Umowa kończy się w ciągu 60 dni
        });
        
        if (leasesEnding.length > 0) {
          recommendations.push({
            title: 'Odnowienie umów',
            description: `${leasesEnding.length} umów najmu kończy się w ciągu najbliższych 60 dni.`,
            action: 'Zaplanuj odnowienia',
            actionHandler: () => {
              alert('W rzeczywistej aplikacji, otworzyłoby to narzędzie do zarządzania umowami.');
              setSelectedClients(leasesEnding.map(c => c.id));
            },
            icon: <Calendar size={16} className="text-purple-500" />
          });
        }
      }
      
      setAIRecommendations(recommendations);
      
      // Generowanie wglądów AI
      const insights = [];
      
      // Wgląd w rozkład klientów
      insights.push({
        title: 'Segmentacja klientów',
        description: `Najważniejsi klienci: ${segments.high_value.length}, Standardowi: ${segments.regular.length}, Nieaktywni: ${segments.inactive.length}, Nowi: ${segments.new.length}`,
        icon: <BarChart2 size={16} className="text-blue-500" />
      });
      
      // Wgląd w trendy klientów
      if (type === 'chimney') {
        const clientsByCity = {};
        clientsData.forEach(client => {
          if (client.city) {
            clientsByCity[client.city] = (clientsByCity[client.city] || 0) + 1;
          }
        });
        
        // Znajdź miasto z największą liczbą klientów
        let topCity = '';
        let topCount = 0;
        
        Object.entries(clientsByCity).forEach(([city, count]) => {
          if (count > topCount) {
            topCity = city;
            topCount = count;
          }
        });
        
        if (topCity) {
          insights.push({
            title: 'Koncentracja geograficzna',
            description: `${topCity} to miasto z największą liczbą klientów (${topCount}), co stanowi ${Math.round(topCount/clientsData.length*100)}% wszystkich klientów.`,
            icon: <MapPin size={16} className="text-red-500" />
          });
        }
      } else {
        // Analiza płatności dla typu 'property'
        const paidCount = clientsData.filter(c => c.lastPayment).length;
        const unpaidCount = clientsData.length - paidCount;
        
        insights.push({
          title: 'Status płatności',
          description: `${paidCount} najemców z opłaconym czynszem (${Math.round(paidCount/clientsData.length*100)}%), ${unpaidCount} z zaległościami.`,
          icon: type === 'property' ? <TrendingUp size={16} className="text-green-500" /> : null
        });
      }
      
      setAIInsights(insights);
      
      // Generowanie predykcji dla klientów
      const predictions = {};
      
      // Przewidywanie wartości klienta życiowej (LTV) i ryzyka utraty
      clientsData.forEach(client => {
        const id = client.id;
        const retentionScore = Math.random() * 100; // W rzeczywistej aplikacji byłby to wynik modelu ML
        
        let ltv = 0;
        if (type === 'chimney') {
          // Szacowanie wartości dla typu 'chimney'
          const inspectionsPerYear = 1.5; // Średnia liczba inspekcji rocznie
          const avgInspectionValue = 200; // Średnia wartość inspekcji
          const expectedYears = 5; // Oczekiwana długość relacji z klientem
          
          ltv = inspectionsPerYear * avgInspectionValue * expectedYears * (client.buildingsCount || 1);
        } else {
          // Szacowanie wartości dla typu 'property'
          const monthlyRent = client.rent || 2000;
          const expectedMonths = 24; // Oczekiwana długość najmu
          
          ltv = monthlyRent * expectedMonths;
        }
        
        predictions[id] = {
          retentionRisk: retentionScore > 70 ? 'Niskie' : retentionScore > 40 ? 'Średnie' : 'Wysokie',
          ltv: Math.round(ltv),
          growthPotential: client.id in scores && scores[client.id] > 70 ? 'Wysokie' : 'Standardowe'
        };
      });
      
      setAIClientPredictions(predictions);
      setAILoading(false);
    }, 1500);
  };
  
  // Komponent segmentu klienta dla widoku AI
  const ClientSegmentBadge = ({ clientId }) => {
    // Określ segment klienta
    let segment = '';
    let color = '';
    
    if (clientSegments.high_value?.includes(clientId)) {
      segment = 'Kluczowy klient';
      color = 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100';
    } else if (clientSegments.new?.includes(clientId)) {
      segment = 'Nowy klient';
      color = 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100';
    } else if (clientSegments.inactive?.includes(clientId)) {
      segment = 'Nieaktywny';
      color = 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100';
    } else if (clientSegments.regular?.includes(clientId)) {
      segment = 'Regularny';
      color = 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
    } else {
      return null;
    }
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs ${color}`}>
        {segment}
      </span>
    );
  };
  
  // Komponent krtki oceny klienta
  const ClientScoreIndicator = ({ clientId }) => {
    if (!(clientId in clientScores)) return null;
    
    const score = clientScores[clientId];
    
    // Określ kolor na podstawie wyniku
    let color = '';
    if (score >= 75) {
      color = 'text-green-600';
    } else if (score >= 50) {
      color = 'text-blue-600';
    } else if (score >= 25) {
      color = 'text-yellow-600';
    } else {
      color = 'text-red-600';
    }
    
    return (
      <div className="flex items-center">
        <div className="w-16 h-1.5 bg-gray-200 rounded-full mr-2">
          <div 
            className={`h-1.5 rounded-full bg-${color.replace('text-', '')}`}
            style={{ width: `${score}%` }}
          ></div>
        </div>
        <span className={`text-xs font-medium ${color}`}>{score}</span>
      </div>
    );
  };
  
  // Przygotuj kolumny tabeli zależnie od typu klienta
  const getColumns = () => {
    // Kolumna zaznaczania (wspólna)
    const selectionColumn = { 
      header: (
        <div className="flex items-center">
          <input 
            type="checkbox" 
            onChange={handleSelectAll}
            checked={selectedClients.length === filteredClients.length && filteredClients.length > 0}
            className="mr-2"
          />
          <span>ID</span>
        </div>
      ),
      accessor: 'id',
      cell: (value, row) => (
        <div className="flex items-center">
          <input 
            type="checkbox" 
            checked={selectedClients.includes(value)}
            onChange={() => handleClientSelect(value)}
            onClick={(e) => e.stopPropagation()}
            className="mr-2"
          />
          {value}
        </div>
      )
    };
    
    // Kolumna AI (jeśli AI jest włączone)
    const aiColumn = showAIInsights ? {
      header: 'AI Insights',
      accessor: 'id',
      cell: (value, row) => (
        <div className="flex flex-col space-y-1">
          <ClientSegmentBadge clientId={value} />
          {value in aiClientPredictions && (
            <div className="text-xs text-gray-500">
              Ryzyko: {aiClientPredictions[value].retentionRisk}
            </div>
          )}
        </div>
      )
    } : null;
    
    // Kolumna oceny (jeśli AI jest włączone)
    const scoreColumn = showAIInsights ? {
      header: 'Ocena',
      accessor: 'id',
      cell: (value) => <ClientScoreIndicator clientId={value} />
    } : null;
    
    // Bazowe kolumny dla typu 'chimney'
    if (type === 'chimney') {
      let columns = [
        selectionColumn,
        { 
          header: 'Nazwa klienta', 
          accessor: 'name',
          cell: (value, row) => (
            <div className="flex items-center">
              <div className="icon-wrapper mr-2 chimney">
                <User size={16} />
              </div>
              <div>
                <p className="font-medium">{value}</p>
                <p className="text-xs text-gray-500">ID: {row.id}</p>
              </div>
            </div>
          )
        },
        { 
          header: 'Kontakt', 
          accessor: 'phone',
          cell: (value, row) => (
            <div>
              <div className="flex items-center text-sm">
                <Phone size={14} className="mr-1 text-gray-500" />
                {value}
              </div>
              <div className="flex items-center text-sm">
                <Mail size={14} className="mr-1 text-gray-500" />
                {row.email}
              </div>
            </div>
          )
        },
        { 
          header: 'Lokalizacja', 
          accessor: 'city',
          cell: (value, row) => (
            <div className="flex items-center">
              <MapPin size={14} className="mr-1 text-gray-500" />
              <div>
                <p>{value}</p>
                <p className="text-sm text-gray-500">{row.address}</p>
              </div>
            </div>
          )
        },
        { 
          header: 'Liczba budynków', 
          accessor: 'buildingsCount',
          cell: (value) => (
            <div className="flex items-center">
              <Building size={14} className="mr-1 text-gray-500" />
              {value}
            </div>
          )
        },
        { header: 'Ostatnia kontrola', accessor: 'lastInspection' },
      ];
      
      // Dodaj kolumny AI jeśli są włączone
      if (aiColumn) columns.splice(1, 0, aiColumn);
      if (scoreColumn) columns.push(scoreColumn);
      
      // Kolumna akcji zawsze na końcu
      columns.push({ 
        header: 'Akcje', 
        accessor: 'id',
        cell: (value, row) => (
          <div className="flex space-x-2">
            <Button 
              variant="link" 
              onClick={(e) => {
                e.stopPropagation();
                handleEditClient(value);
              }}
            >
              Edytuj
            </Button>
            <Button 
              variant="link" 
              onClick={(e) => {
                e.stopPropagation();
                handleViewClientDetails(value);
              }}
            >
              Szczegóły
            </Button>
            <Button 
              variant="link" 
              onClick={(e) => {
                e.stopPropagation();
                handleViewBuildings(value);
              }}
            >
              Budynki
            </Button>
            <Button 
              variant="link" 
              className="text-red-600"
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteClick(value);
              }}
            >
              Usuń
            </Button>
          </div>
        )
      });
      
      return columns;
    } 
    // Kolumny dla typu 'property'
    else {
      let columns = [
        selectionColumn,
        { 
          header: 'Najemca', 
          accessor: 'name',
          cell: (value, row) => (
            <div className="flex items-center">
              <div className="icon-wrapper mr-2">
                <User size={16} />
              </div>
              <p className="font-medium">{value}</p>
            </div>
          )
        },
        { 
          header: 'Kontakt', 
          accessor: 'email',
          cell: (value, row) => (
            <div>
              <div className="flex items-center text-sm">
                <Mail size={14} className="mr-1 text-gray-500" />
                {value}
              </div>
              <div className="flex items-center text-sm">
                <Phone size={14} className="mr-1 text-gray-500" />
                {row.phone}
              </div>
            </div>
          )
        },
        { 
          header: 'Mieszkanie', 
          accessor: 'propertyName',
          cell: (value, row) => (
            <div className="flex items-center">
              <Building size={14} className="mr-1 text-gray-500" />
              <div>
                <p className="font-medium">{value}</p>
                <p className="text-sm text-gray-500">{row.propertyAddress}</p>
              </div>
            </div>
          )
        },
        { 
          header: 'Okres najmu', 
          accessor: 'leaseStart',
          cell: (value, row) => (
            <div className="flex items-center text-sm">
              <Calendar size={14} className="mr-1 text-gray-500" />
              {value} - {row.leaseEnd}
            </div>
          )
        },
      ];
      
      // Dodaj kolumny AI jeśli są włączone
      if (aiColumn) columns.splice(1, 0, aiColumn);
      if (scoreColumn) columns.push(scoreColumn);
      
      // Kolumny specyficzne dla typu 'property'
      columns.push(
        { 
          header: 'Status płatności', 
          accessor: 'lastPayment',
          cell: (value) => (
            <span className={`px-2 py-1 rounded-full text-xs ${
              value 
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' 
                : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100'
            }`}>
              {value ? 'Opłacone' : 'Zaległe'}
            </span>
          )
        },
        { 
          header: 'Akcje', 
          accessor: 'id',
          cell: (value, row) => (
            <div className="flex space-x-2">
              <Button 
                variant="link"
                onClick={(e) => {
                  e.stopPropagation();
                  handleEditClient(value);
                }}
              >
                Edytuj
              </Button>
              <Button 
                variant="link"
                onClick={(e) => {
                  e.stopPropagation();
                  handleViewClientDetails(value);
                }}
              >
                Szczegóły
              </Button>
              <Button 
                variant="link" 
                className="text-red-600"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteClick(value);
                }}
              >
                Usuń
              </Button>
            </div>
          )
        }
      );
      
      return columns;
    }
  };
  
  // Renderowanie karty klienta dla widoku mobilnego
  const renderMobileClientCard = (client) => (
    <div 
      key={client.id} 
      className={`p-4 rounded-lg shadow mb-4 ${
        darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
      }`}
      onClick={() => handleViewClientDetails(client.id)}
    >
      <div className="flex justify-between items-start">
        <div className="flex items-start">
          <input 
            type="checkbox" 
            checked={selectedClients.includes(client.id)}
            onChange={() => handleClientSelect(client.id)}
            onClick={(e) => e.stopPropagation()}
            className="mr-2 mt-1"
          />
          <div>
            <h3 className="font-semibold">{client.name}</h3>
            <p className="text-sm">{client.email || 'Brak emaila'}</p>
            <p className="text-sm">{client.phone || 'Brak telefonu'}</p>
            
            {type === 'chimney' ? (
              <div className="mt-1">
                <p className="text-xs text-gray-500">{client.city}, {client.address}</p>
                <div className="flex items-center mt-1">
                  <Building size={14} className="mr-1 text-gray-500" />
                  <span className="text-sm">{client.buildingsCount || 0} budynków</span>
                </div>
              </div>
            ) : (
              <div className="mt-1">
                <p className="text-xs text-gray-500">{client.propertyAddress}</p>
                <p className="text-xs text-gray-500">Umowa: {client.leaseStart} - {client.leaseEnd}</p>
              </div>
            )}
          </div>
        </div>
        
        {showAIInsights && (
          <ClientSegmentBadge clientId={client.id} />
        )}
      </div>
      
      <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 flex justify-between">
        <Button 
          size="sm" 
          variant="link" 
          onClick={(e) => {
            e.stopPropagation();
            handleEditClient(client.id);
          }}
        >
          Edytuj
        </Button>
        
        {type === 'chimney' ? (
          <Button 
            size="sm" 
            variant="link" 
            onClick={(e) => {
              e.stopPropagation();
              handleViewBuildings(client.id);
            }}
          >
            Budynki
          </Button>
        ) : (
          <Button 
            size="sm" 
            variant="link" 
            className={client.lastPayment ? "text-green-600" : "text-yellow-600"}
          >
            {client.lastPayment ? "Opłacone" : "Zaległe"}
          </Button>
        )}
        
        <Button 
          size="sm" 
          variant="link" 
          className="text-red-600"
          onClick={(e) => {
            e.stopPropagation();
            handleDeleteClick(client.id);
          }}
        >
          Usuń
        </Button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">
          {type === 'chimney' ? 'Klienci' : 'Najemcy'}
        </h2>
        <div className="flex space-x-2">
          <Button 
            onClick={() => {
              setClientToEdit(null);
              setShowAddForm(true);
            }}
            className="flex items-center"
            color={type === 'chimney' ? 'red' : 'blue'}
          >
            <Plus size={16} className="mr-2" />
            Dodaj {type === 'chimney' ? 'klienta' : 'najemcę'}
          </Button>
          
          <Button
            variant={showAIInsights ? "outline" : "primary"}
            className="flex items-center"
            color={type === 'chimney' ? 'red' : 'blue'}
            onClick={() => {
              if (showAIInsights) {
                setShowAIInsights(false);
              } else {
                generateAIInsights();
              }
            }}
          >
            <BrainCircuit size={16} className="mr-2" />
            {showAIInsights ? 'Ukryj AI' : 'Analiza AI'}
          </Button>
        </div>
      </div>
      
      {/* Formularz dodawania/edycji klienta */}
      {showAddForm && (
        <Card darkMode={darkMode}>
          <h3 className="font-semibold mb-4">
            {clientToEdit ? 
              `Edytuj ${type === 'chimney' ? 'klienta' : 'najemcę'}` : 
              `Dodaj nowego ${type === 'chimney' ? 'klienta' : 'najemcę'}`}
          </h3>
          <ClientForm 
            client={clientToEdit}
            onSubmit={clientToEdit ? handleEditSubmit : handleAddClient} 
            onCancel={() => {
              setShowAddForm(false);
              setClientToEdit(null);
            }}
            darkMode={darkMode}
            type={type}
          />
        </Card>
      )}
      
      {/* Panel analizy AI */}
      {showAIInsights && (
        <Card darkMode={darkMode} className={`border-l-4 ${type === 'chimney' ? 'border-red-500' : 'border-blue-500'}`}>
          <div className="flex justify-between items-start">
            <div className="flex items-center">
              <BrainCircuit size={20} className={`mr-2 ${type === 'chimney' ? 'text-red-500' : 'text-blue-500'}`} />
              <h3 className="font-semibold">Analiza AI Klientów</h3>
            </div>
            <Button 
              variant="link" 
              size="sm"
              onClick={() => setShowAIInsights(false)}
            >
              Ukryj
            </Button>
          </div>
          
          {aiLoading ? (
            <div className="flex items-center justify-center p-6">
              <div className={`animate-spin rounded-full h-8 w-8 border-b-2 ${type === 'chimney' ? 'border-red-500' : 'border-blue-500'}`}></div>
              <span className="ml-2">Analizowanie danych klientów...</span>
            </div>
          ) : (
            <div className="mt-4 space-y-4">
              {/* Wskaźniki i wglądy */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                  <h4 className="font-medium mb-2">Segmentacja klientów</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Kluczowi klienci:</span>
                      <span className="font-medium">{clientSegments.high_value?.length || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Standardowi klienci:</span>
                      <span className="font-medium">{clientSegments.regular?.length || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Nowi klienci:</span>
                      <span className="font-medium">{clientSegments.new?.length || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Nieaktywni klienci:</span>
                      <span className="font-medium">{clientSegments.inactive?.length || 0}</span>
                    </div>
                  </div>
                </div>
                
                {aiInsights.map((insight, index) => (
                  <div key={index} className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} flex items-start`}>
                    {insight.icon}
                    <div className="ml-2">
                      <h4 className="font-medium">{insight.title}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{insight.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Rekomendacje */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium flex items-center">
                    <Zap size={16} className="mr-2 text-yellow-500" />
                    Rekomendacje AI
                  </h4>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowAIRecommendations(!showAIRecommendations)}
                  >
                    {showAIRecommendations ? 'Ukryj szczegóły' : 'Pokaż szczegóły'}
                  </Button>
                </div>
                
                {showAIRecommendations && (
                  <div className="space-y-3 mt-2">
                    {aiRecommendations.length > 0 ? (
                      aiRecommendations.map((recommendation, index) => (
                        <div 
                          key={index} 
                          className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} flex items-start justify-between`}
                        >
                          <div className="flex items-start">
                            {recommendation.icon}
                            <div className="ml-2">
                              <h5 className="font-medium">{recommendation.title}</h5>
                              <p className="text-sm text-gray-600 dark:text-gray-400">{recommendation.description}</p>
                            </div>
                          </div>
                          {recommendation.action && (
                            <Button 
                              variant="outline"
                              size="sm"
                              onClick={recommendation.actionHandler}
                              className="ml-2 whitespace-nowrap"
                              color={type === 'chimney' ? 'red' : 'blue'}
                            >
                              {recommendation.action}
                            </Button>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="text-center p-4 text-gray-500">
                        Brak rekomendacji w tym momencie. Dodaj więcej klientów, aby otrzymać spersonalizowane rekomendacje.
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              {/* Kluczowe wnioski */}
              <div className={`p-3 rounded-lg ${
                type === 'chimney' 
                  ? 'bg-red-50 dark:bg-red-900 dark:bg-opacity-30' 
                  : 'bg-blue-50 dark:bg-blue-900 dark:bg-opacity-30'
              }`}>
                <div className="flex items-center mb-1">
                  <AlertCircle size={16} className={`mr-2 ${type === 'chimney' ? 'text-red-600' : 'text-blue-600'}`} />
                  <h4 className="font-medium">Kluczowy wniosek AI</h4>
                </div>
                <p className="text-sm">
                  {type === 'chimney' 
                    ? `${clientSegments.high_value?.length || 0} kluczowych klientów generuje około ${Math.round(((clientSegments.high_value?.length || 0) / clients.length) * 100)}% wszystkich przychodów. Skupienie się na utrzymaniu tych klientów może przynieść najlepsze rezultaty biznesowe.`
                    : `${clientSegments.inactive?.length || 0} najemców ma zaległości w płatnościach. Wczesny kontakt i proaktywne rozwiązywanie problemów płatności może zmniejszyć ryzyko długoterminowych zaległości.`
                  }
                </p>
              </div>
            </div>
          )}
        </Card>
      )}
      
      {/* Wyszukiwanie i filtry */}
      <Card darkMode={darkMode} className="mb-6">
        <div className="flex flex-col md:flex-row md:space-x-2 space-y-2 md:space-y-0">
          {/* Pole wyszukiwania */}
          <div className="relative flex-1">
            <input
              type="text"
              placeholder={`Szukaj ${type === 'chimney' ? 'klienta' : 'najemcy'}...`}
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                handleFilter({ ...currentFilters, searchTerm: e.target.value });
              }}
              className={`pl-9 pr-3 py-2 border rounded-lg w-full ${
                darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
              }`}
            />
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            {searchTerm && (
              <button 
                onClick={() => {
                  setSearchTerm('');
                  handleFilter({ ...currentFilters, searchTerm: '' });
                }}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                <X size={16} />
              </button>
            )}
          </div>
          
          {/* Przyciski filtrów */}
          <div className="flex space-x-2">
            <Button 
              variant={showAdvancedFilters ? 'primary' : 'outline'} 
              className="flex items-center"
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              color={type === 'chimney' ? 'red' : 'blue'}
            >
              <Filter size={16} className="mr-1" />
              <span>Filtry</span>
            </Button>
            
            <div className="relative" ref={filterDropdownRef}>
              <Button 
                variant="outline" 
                className="flex items-center"
                onClick={() => setShowSavedFiltersDropdown(!showSavedFiltersDropdown)}
              >
                <ArrowDownToLine size={16} className="mr-1" />
                <span className="hidden lg:inline">Zapisane</span>
                <ChevronDown size={16} className="ml-1" />
              </Button>
              
              {/* Dropdown zapisanych filtrów */}
              {showSavedFiltersDropdown && (
                <div className={`absolute right-0 mt-1 w-48 ${
                  darkMode ? 'bg-gray-800' : 'bg-white'
                } rounded-lg shadow-lg border ${
                  darkMode ? 'border-gray-700' : 'border-gray-200'
                } z-10 p-1`}>
                  {savedFilters.map((filter) => (
                    <div 
                      key={filter.id}
                      className={`flex justify-between items-center p-2 rounded-md cursor-pointer ${
                        darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                      }`}
                    >
                      <button 
                        onClick={() => handleApplySavedFilter(filter)}
                        className="flex-1 text-left"
                      >
                        {filter.name}
                      </button>
                      <button 
                        onClick={() => handleDeleteFilter(filter.id)}
                        className="text-gray-500 hover:text-red-500"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                  <div className="border-t dark:border-gray-700 mt-1 pt-1">
                    <button 
                      className="w-full text-left p-2 rounded-md text-blue-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => {
                        setShowSavedFiltersDropdown(false);
                        setShowSaveFilterModal(true);
                      }}
                    >
                      <span className="flex items-center">
                        <Save size={16} className="mr-1" />
                        Zapisz aktualny filtr
                      </span>
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            {Object.keys(currentFilters).length > 1 || (searchTerm && searchTerm.length > 0) ? (
              <Button 
                variant="outline" 
                className="flex items-center"
                onClick={() => {
                  setSearchTerm('');
                  resetFilters();
                }}
              >
                <X size={16} className="mr-1" />
                <span className="hidden lg:inline">Wyczyść</span>
              </Button>
            ) : null}
          </div>
        </div>
        
        {/* Zaawansowane filtry */}
        {showAdvancedFilters && (
          <div className="mt-4 pt-4 border-t dark:border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {type === 'chimney' ? (
                <>
                  <div>
                    <label className="block text-gray-500 mb-1">Miasto</label>
                    <select
                      value={currentFilters.city || 'all'}
                      onChange={(e) => handleFilter({...currentFilters, city: e.target.value})}
                      className={`w-full px-3 py-2 border rounded-lg ${
                        darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                      }`}
                    >
                      <option value="all">Wszystkie miasta</option>
                      <option value="Warszawa">Warszawa</option>
                      <option value="Kraków">Kraków</option>
                      <option value="Poznań">Poznań</option>
                      <option value="Wrocław">Wrocław</option>
                      <option value="Gdańsk">Gdańsk</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-gray-500 mb-1">Sortowanie</label>
                    <select
                      value={currentFilters.sortBy || 'nameAsc'}
                      onChange={(e) => handleFilter({...currentFilters, sortBy: e.target.value})}
                      className={`w-full px-3 py-2 border rounded-lg ${
                        darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                      }`}
                    >
                      <option value="nameAsc">Nazwa (A-Z)</option>
                      <option value="nameDesc">Nazwa (Z-A)</option>
                      <option value="newest">Od najnowszych</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-gray-500 mb-1">Budynki</label>
                    <select
                      value={currentFilters.buildingsCount || 'all'}
                      onChange={(e) => handleFilter({...currentFilters, buildingsCount: e.target.value})}
                      className={`w-full px-3 py-2 border rounded-lg ${
                        darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                      }`}
                    >
                      <option value="all">Wszystkie</option>
                      <option value="1">1 budynek</option>
                      <option value="2-5">2-5 budynków</option>
                      <option value="6+">6 i więcej budynków</option>
                    </select>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-gray-500 mb-1">Status płatności</label>
                    <select
                      value={currentFilters.paymentStatus || 'all'}
                      onChange={(e) => handleFilter({...currentFilters, paymentStatus: e.target.value})}
                      className={`w-full px-3 py-2 border rounded-lg ${
                        darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                      }`}
                    >
                      <option value="all">Wszystkie statusy</option>
                      <option value="Opłacone">Opłacone</option>
                      <option value="Zaległe">Zaległe</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-gray-500 mb-1">Sortowanie</label>
                    <select
                      value={currentFilters.sortBy || 'nameAsc'}
                      onChange={(e) => handleFilter({...currentFilters, sortBy: e.target.value})}
                      className={`w-full px-3 py-2 border rounded-lg ${
                        darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                      }`}
                    >
                      <option value="nameAsc">Nazwa (A-Z)</option>
                      <option value="nameDesc">Nazwa (Z-A)</option>
                      <option value="newest">Od najnowszych</option>
                      <option value="rentAsc">Czynsz (rosnąco)</option>
                      <option value="rentDesc">Czynsz (malejąco)</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-gray-500 mb-1">Umowa</label>
                    <select
                      value={currentFilters.leaseStatus || 'all'}
                      onChange={(e) => handleFilter({...currentFilters, leaseStatus: e.target.value})}
                      className={`w-full px-3 py-2 border rounded-lg ${
                        darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                      }`}
                    >
                      <option value="all">Wszystkie</option>
                      <option value="active">Aktywna</option>
                      <option value="ending">Kończy się wkrótce</option>
                    </select>
                  </div>
                </>
              )}
              
              {showAIInsights && (
                <div>
                  <label className="block text-gray-500 mb-1">Segment AI</label>
                  <select
                    value={currentFilters.aiSegment || 'all'}
                    onChange={(e) => handleFilter({...currentFilters, aiSegment: e.target.value})}
                    className={`w-full px-3 py-2 border rounded-lg ${
                      darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                    }`}
                  >
                    <option value="all">Wszystkie segmenty</option>
                    <option value="high_value">Kluczowi klienci</option>
                    <option value="regular">Regularni klienci</option>
                    <option value="inactive">Nieaktywni klienci</option>
                    <option value="new">Nowi klienci</option>
                  </select>
                </div>
              )}
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
                  onClick={() => handleFilter(currentFilters)}
                  color={type === 'chimney' ? 'red' : 'blue'}
                >
                  Zastosuj
                </Button>
              </div>
            </div>
          </div>
        )}
        
        {/* Aktywne filtry */}
        {Object.keys(currentFilters).filter(key => key !== 'searchTerm' && currentFilters[key] !== 'all' && currentFilters[key]).length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {Object.entries(currentFilters)
              .filter(([key, value]) => key !== 'searchTerm' && value !== 'all' && value)
              .map(([key, value]) => {
                let label = key;
                let displayValue = value;
                
                // Formatuj etykiety
                if (key === 'city') label = 'Miasto';
                else if (key === 'sortBy') {
                  label = 'Sortowanie';
                  if (value === 'nameAsc') displayValue = 'Nazwa (A-Z)';
                  else if (value === 'nameDesc') displayValue = 'Nazwa (Z-A)';
                  else if (value === 'newest') displayValue = 'Od najnowszych';
                  else if (value === 'rentAsc') displayValue = 'Czynsz (rosnąco)';
                  else if (value === 'rentDesc') displayValue = 'Czynsz (malejąco)';
                }
                else if (key === 'buildingsCount') label = 'Budynki';
                else if (key === 'paymentStatus') label = 'Status płatności';
                else if (key === 'leaseStatus') {
                  label = 'Umowa';
                  if (value === 'active') displayValue = 'Aktywna';
                  else if (value === 'ending') displayValue = 'Kończy się wkrótce';
                }
                else if (key === 'aiSegment') {
                  label = 'Segment AI';
                  if (value === 'high_value') displayValue = 'Kluczowi klienci';
                  else if (value === 'regular') displayValue = 'Regularni klienci';
                  else if (value === 'inactive') displayValue = 'Nieaktywni klienci';
                  else if (value === 'new') displayValue = 'Nowi klienci';
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
                        const newFilters = { ...currentFilters };
                        delete newFilters[key];
                        handleFilter(newFilters);
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
      </Card>
      
      {/* Licznik zaznaczonych elementów i akcje */}
      {selectedClients.length > 0 && (
        <div className="mb-4 p-3 border-l-4 border-yellow-400 bg-yellow-50 text-yellow-800 dark:bg-yellow-900 dark:border-yellow-500 dark:text-yellow-100">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <AlertCircle size={18} className="mr-2" />
              <p>Wybrano {selectedClients.length} {selectedClients.length === 1 ? 'klienta' : selectedClients.length < 5 ? 'klientów' : 'klientów'}</p>
            </div>
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                size="sm"
                color={type === 'chimney' ? 'red' : 'blue'}
                onClick={() => {
                  // Akcja dla zaznaczonych klientów - tutaj przykład
                  alert(`Wykonywanie akcji dla ${selectedClients.length} klientów`);
                }}
              >
                {type === 'chimney' ? 'Zaplanuj kontrole' : 'Wyślij przypomnienie'}
              </Button>
              
              <Button 
                variant="outline" 
                size="sm"
                color={type === 'chimney' ? 'red' : 'blue'}
                onClick={() => {
                  // Eksport zaznaczonych klientów
                  alert(`Eksportowanie ${selectedClients.length} klientów`);
                }}
              >
                <ArrowDownToLine size={14} className="mr-1" />
                Eksportuj
              </Button>
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setSelectedClients([])}
              >
                <X size={14} className="mr-1" />
                Wyczyść zaznaczenie
              </Button>
            </div>
          </div>
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
                placeholder="np. Klienci z Warszawy"
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
                onClick={handleSaveFilter}
                disabled={!newFilterName.trim()}
                color={type === 'chimney' ? 'red' : 'blue'}
              >
                Zapisz
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {/* Lista klientów - responsywny widok */}
      <Card darkMode={darkMode}>
        <div className="hidden md:block">
          {/* Widok desktopowy - tabela */}
          <DataTable
            columns={getColumns()}
            data={filteredClients}
            darkMode={darkMode}
            onRowClick={(row) => handleViewClientDetails(row.id)}
          />
        </div>
        
        <div className="md:hidden">
          {/* Widok mobilny - karty */}
          {filteredClients.length > 0 ? (
            <div className="space-y-4">
              {filteredClients.map(renderMobileClientCard)}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              Nie znaleziono {type === 'chimney' ? 'klientów' : 'najemców'} spełniających kryteria
            </div>
          )}
        </div>
        
        {/* Podsumowanie wyników */}
        {filteredClients.length > 0 && (
          <div className="mt-4 pt-4 border-t dark:border-gray-700 text-sm text-gray-500">
            Wyświetlanie {filteredClients.length} z {clients.length} {type === 'chimney' ? 'klientów' : 'najemców'}
          </div>
        )}
      </Card>
      
      {/* Modal potwierdzenia usunięcia */}
      {showConfirmDelete && clientToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`max-w-md w-full p-6 rounded-lg shadow-xl ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="flex items-start mb-4">
              <div className="mr-3 text-red-500">
                <AlertTriangle size={24} />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Potwierdź usunięcie</h3>
                <p className="text-gray-500 mt-1">
                  Czy na pewno chcesz usunąć {type === 'chimney' ? 'klienta' : 'najemcę'} "{clientToDelete.name}"? 
                  Ta operacja jest nieodwracalna.
                </p>
              </div>
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button 
                variant="outline" 
                onClick={() => {
                  setShowConfirmDelete(false);
                  setClientToDelete(null);
                }}
              >
                Anuluj
              </Button>
              <Button 
                color="red"
                onClick={handleConfirmDelete}
              >
                Usuń
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientsList;