import React, { useState, useEffect } from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { 
  BarChart2, 
  CheckCircle, 
  Clipboard, 
  Calendar, 
  AlertTriangle, 
  FileText, 
  Cpu, 
  Zap, 
  MapPin, 
  Wrench, 
  Download, 
  RefreshCw, 
  Thermometer,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Clock,
  Filter
} from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import StatusBadge from '../components/ui/StatusBadge';
import DataTable from '../components/ui/DataTable';
import ActivityFeed from '../components/ui/ActivityFeed';
import InspectionCalendar from '../components/ui/InspectionCalendar';

const ChimneyDashboard = ({ data, darkMode }) => {
  // State variables
  const [refreshing, setRefreshing] = useState(false);
  const [aiInsightsVisible, setAiInsightsVisible] = useState(true);
  const [timeRangeFilter, setTimeRangeFilter] = useState('month');
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [showPredictiveModal, setShowPredictiveModal] = useState(false);
  
  // Calculating KPIs
  const totalInspections = data.inspections.length;
  const pendingCeebSubmissions = data.inspections.filter(i => i.ceebStatus === 'Do zgłoszenia').length;
  const positiveResults = data.inspections.filter(i => i.result === 'Pozytywny').length;
  const negativeResults = data.inspections.filter(i => i.result === 'Negatywny').length;
  const conditionalResults = data.inspections.filter(i => i.result === 'Warunkowy').length;
  const positivePercentage = Math.round(positiveResults / totalInspections * 100);
  const negativePercentage = Math.round(negativeResults / totalInspections * 100);

  // Simulate refreshing dashboard data
  const handleRefresh = () => {
    setRefreshing(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  };
  
  // Simulate AI analysis of the data
  useEffect(() => {
    // This would normally be an API call to an AI service
    const analysis = {
      insights: [
        {
          type: 'warning',
          title: 'Zbliżające się terminy CEEB',
          description: '5 kontroli wymaga zgłoszenia do CEEB w ciągu najbliższych 48 godzin.',
          action: 'Przejdź do zgłoszeń CEEB'
        },
        {
          type: 'insight',
          title: 'Wzrost problemów z przewodami spalinowymi',
          description: 'Wykryto 23% wzrost negatywnych wyników kontroli przewodów spalinowych w porównaniu do poprzedniego miesiąca.',
          action: 'Zobacz analizę'
        },
        {
          type: 'recommendation',
          title: 'Optymalizacja harmonogramu',
          description: 'AI sugeruje przegrupowanie kontroli w dzielnicy Mokotów, co może zaoszczędzić do 4 godzin czasu przejazdu w tym tygodniu.',
          action: 'Optymalizuj'
        }
      ],
      predictions: {
        nextMonthInspections: totalInspections + Math.floor(totalInspections * 0.12),
        expectedIssueRate: negativePercentage + 2,
        highRiskBuildings: [
          {id: 12, address: 'ul. Marszałkowska 32', risk: 'Przewód dymowy'},
          {id: 7, address: 'ul. Koszykowa 15', risk: 'Przewód spalinowy'},
          {id: 23, address: 'ul. Puławska 143', risk: 'Przewód wentylacyjny'}
        ],
        effectivenessScore: 82
      }
    };
    
    setAiAnalysis(analysis);
  }, [data, totalInspections, positivePercentage, negativePercentage]);

  // Chart color configuration
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
  const RESULT_COLORS = {
    'Pozytywny': '#4CAF50',
    'Negatywny': '#F44336',
    'Warunkowy': '#FFC107'
  };

  // Predictive Analytics Modal
  const PredictiveModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`max-w-3xl w-full ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-xl overflow-auto max-h-screen p-6`}>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold flex items-center">
            <Cpu size={24} className="mr-2 text-red-500" />
            Predykcyjna analiza AI
          </h3>
          <button 
            onClick={() => setShowPredictiveModal(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Card darkMode={darkMode}>
            <h4 className="font-semibold mb-3">Prognoza na najbliższy miesiąc</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Liczba kontroli:</span>
                <span className="text-xl font-bold flex items-center">
                  {aiAnalysis?.predictions.nextMonthInspections}
                  <TrendingUp size={16} className="ml-1 text-green-500" />
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Oczekiwany wskaźnik usterek:</span>
                <span className="text-xl font-bold flex items-center">
                  {aiAnalysis?.predictions.expectedIssueRate}%
                  <TrendingUp size={16} className="ml-1 text-red-500" />
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Skuteczność techników:</span>
                <span className="text-xl font-bold">{aiAnalysis?.predictions.effectivenessScore}%</span>
              </div>
            </div>
          </Card>
          
          <Card darkMode={darkMode}>
            <h4 className="font-semibold mb-3">Budynki wysokiego ryzyka</h4>
            <div className="space-y-2">
              {aiAnalysis?.predictions.highRiskBuildings.map((building, index) => (
                <div key={index} className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                  <div className="flex items-center">
                    <AlertTriangle size={16} className="mr-2 text-red-500" />
                    <span className="font-medium">{building.address}</span>
                  </div>
                  <div className="mt-1 flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Potencjalny problem:</span>
                    <span className="font-medium">{building.risk}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
        
        <Card darkMode={darkMode}>
          <h4 className="font-semibold mb-3">Rekomendowane działania</h4>
          <div className="space-y-3">
            <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} flex items-start`}>
              <Thermometer size={20} className="mr-3 mt-0.5 text-red-500 flex-shrink-0" />
              <div>
                <p className="font-medium">Przewody dymowe i spalinowe</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Zalecamy zwiększenie częstotliwości kontroli przewodów dymowych i spalinowych w budynkach wielorodzinnych o 20% w okresie grzewczym.
                </p>
              </div>
            </div>
            
            <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} flex items-start`}>
              <Wrench size={20} className="mr-3 mt-0.5 text-yellow-500 flex-shrink-0" />
              <div>
                <p className="font-medium">Kontrole prewencyjne</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Rozważ wprowadzenie dodatkowych kontroli prewencyjnych w 3 budynkach z największą liczbą problemów w ostatnim kwartale.
                </p>
              </div>
            </div>
            
            <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} flex items-start`}>
              <Clock size={20} className="mr-3 mt-0.5 text-blue-500 flex-shrink-0" />
              <div>
                <p className="font-medium">Harmonogram kontroli</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Algorytm AI sugeruje reorganizację harmonogramu kontroli według lokalizacji, co może zwiększyć efektywność o 15%.
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-4 flex space-x-3">
            <Button color="red" className="flex items-center">
              <Download size={16} className="mr-2" />
              Pobierz pełny raport
            </Button>
            
            <Button color="red" variant="outline" className="flex items-center">
              <Calendar size={16} className="mr-2" />
              Zaplanuj kontrole
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header with refresh button */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Przegląd</h2>
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1 mr-4">
            <span className="text-sm text-gray-500">Okres:</span>
            <select 
              value={timeRangeFilter}
              onChange={(e) => setTimeRangeFilter(e.target.value)}
              className={`text-sm py-1 px-2 rounded border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
            >
              <option value="week">Tydzień</option>
              <option value="month">Miesiąc</option>
              <option value="quarter">Kwartał</option>
              <option value="year">Rok</option>
            </select>
          </div>
          <Button 
            variant="outline" 
            color="red" 
            size="sm"
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center"
          >
            {refreshing ? (
              <>
                <RefreshCw size={16} className="mr-1 animate-spin" />
                Odświeżanie...
              </>
            ) : (
              <>
                <RefreshCw size={16} className="mr-1" />
                Odśwież
              </>
            )}
          </Button>
        </div>
      </div>
      
      {/* AI Insights Panel */}
      {aiInsightsVisible && aiAnalysis && (
        <Card darkMode={darkMode} className="border-l-4 border-red-500">
          <div className="flex justify-between items-start">
            <div className="flex items-center">
              <Cpu size={20} className="mr-2 text-red-500" />
              <h3 className="font-semibold">Analiza AI</h3>
            </div>
            <Button 
              variant="link" 
              size="sm"
              onClick={() => setAiInsightsVisible(false)}
            >
              Ukryj
            </Button>
          </div>
          
          <div className="mt-3 space-y-3">
            {aiAnalysis.insights.map((insight, index) => (
              <div 
                key={index} 
                className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} flex items-start`}
              >
                {insight.type === 'warning' && <AlertTriangle size={20} className="mr-3 mt-0.5 text-yellow-500 flex-shrink-0" />}
                {insight.type === 'insight' && <Zap size={20} className="mr-3 mt-0.5 text-blue-500 flex-shrink-0" />}
                {insight.type === 'recommendation' && <CheckCircle size={20} className="mr-3 mt-0.5 text-green-500 flex-shrink-0" />}
                
                <div className="flex-1">
                  <h4 className="font-medium">{insight.title}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{insight.description}</p>
                </div>
                
                <Button 
                  variant="link" 
                  size="sm"
                  className="ml-2 whitespace-nowrap"
                >
                  {insight.action}
                </Button>
              </div>
            ))}
          </div>
          
          <div className="mt-4 flex justify-between items-center">
            <Button 
              color="red" 
              variant="outline"
              className="flex items-center"
              onClick={() => setShowPredictiveModal(true)}
            >
              <BarChart2 size={16} className="mr-2" />
              Analiza predykcyjna
            </Button>
            
            <span className="text-sm text-gray-500">
              Ostatnia aktualizacja: dzisiaj, 14:35
            </span>
          </div>
        </Card>
      )}
      
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card darkMode={darkMode} className="relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-gray-500 font-medium">Kontrole w tym {timeRangeFilter === 'week' ? 'tygodniu' : timeRangeFilter === 'month' ? 'miesiącu' : timeRangeFilter === 'quarter' ? 'kwartale' : 'roku'}</h3>
              <p className="text-2xl font-bold mt-2">{totalInspections}</p>
              <p className="text-green-500 text-sm flex items-center">
                <TrendingUp size={14} className="mr-1" />
                +8% od poprzedniego okresu
              </p>
            </div>
            <Clipboard size={20} className="text-red-500" />
          </div>
          
          <div className={`absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-red-400 to-red-600`}></div>
        </Card>
        
        <Card darkMode={darkMode} className="relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-gray-500 font-medium">Do zgłoszenia w CEEB</h3>
              <p className="text-2xl font-bold mt-2">{pendingCeebSubmissions}</p>
              {pendingCeebSubmissions > 0 ? (
                <p className="text-yellow-500 text-sm flex items-center">
                  <AlertCircle size={14} className="mr-1" />
                  Wymaga uwagi
                </p>
              ) : (
                <p className="text-green-500 text-sm flex items-center">
                  <CheckCircle size={14} className="mr-1" />
                  Wszystko zgłoszone
                </p>
              )}
            </div>
            <FileText size={20} className="text-yellow-500" />
          </div>
          
          <div className={`absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-400 to-yellow-600`}></div>
        </Card>
        
        <Card darkMode={darkMode} className="relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-gray-500 font-medium">Wyniki pozytywne</h3>
              <p className="text-2xl font-bold mt-2">{positiveResults}</p>
              <p className="text-green-500 text-sm">{positivePercentage}% wszystkich kontroli</p>
            </div>
            <CheckCircle size={20} className="text-green-500" />
          </div>
          
          <div className={`absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 to-green-600`}></div>
        </Card>
        
        <Card darkMode={darkMode} className="relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-gray-500 font-medium">Wyniki negatywne</h3>
              <p className="text-2xl font-bold mt-2">{negativeResults}</p>
              <p className="text-red-500 text-sm">{negativePercentage}% wszystkich kontroli</p>
            </div>
            <AlertTriangle size={20} className="text-red-500" />
          </div>
          
          <div className={`absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-red-400 to-red-600`}></div>
        </Card>
      </div>
      
      {/* Main content - Charts, lists, etc. */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Charts - take up 2/3 of the width on large screens */}
        <div className="lg:col-span-2 space-y-6">
          {/* Inspections Chart */}
          <Card darkMode={darkMode}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold flex items-center">
                <BarChart2 size={16} className="mr-2" />
                Kontrole (ostatnie 3 miesiące)
              </h3>
              <div className="flex items-center">
                <Button variant="outline" size="sm" className="flex items-center">
                  <Filter size={14} className="mr-1" />
                  Filtruj
                </Button>
              </div>
            </div>
            
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={data.inspectionsByMonthData}
                  margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#444' : '#eee'} />
                  <XAxis dataKey="name" stroke={darkMode ? '#ccc' : '#666'} />
                  <YAxis stroke={darkMode ? '#ccc' : '#666'} />
                  <Tooltip contentStyle={{ background: darkMode ? '#333' : '#fff' }} />
                  <Bar dataKey="ilość" fill="#FF5252" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            <div className="mt-2 flex justify-end">
              <Button variant="link" size="sm" className="text-red-500">
                Zobacz szczegółową analizę
              </Button>
            </div>
          </Card>
          
          {/* Pie Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card darkMode={darkMode}>
              <h3 className="font-semibold mb-4">Rodzaje kontroli</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data.inspectionsByTypeData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {data.inspectionsByTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ background: darkMode ? '#333' : '#fff' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              <div className="mt-2 p-2 rounded-lg bg-gray-50 dark:bg-gray-700">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  <Zap size={12} className="inline mr-1" />
                  Insight: Przewody spalinowe stanowią największą część kontroli w tym okresie.
                </p>
              </div>
            </Card>
            
            <Card darkMode={darkMode}>
              <h3 className="font-semibold mb-4">Wyniki kontroli</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data.inspectionsByResultData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {data.inspectionsByResultData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={RESULT_COLORS[entry.name] || COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ background: darkMode ? '#333' : '#fff' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              <div className="mt-2 p-2 rounded-lg bg-gray-50 dark:bg-gray-700">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  <TrendingUp size={12} className="inline mr-1" />
                  Trend: Wzrost pozytywnych wyników o 5% w porównaniu do poprzedniego miesiąca.
                </p>
              </div>
            </Card>
          </div>
          
          {/* CEEB Status Chart */}
          <Card darkMode={darkMode}>
            <h3 className="font-semibold mb-4 flex items-center">
              <FileText size={16} className="mr-2" />
              Status CEEB
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.ceebStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {data.ceebStatusData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.name === 'Zgłoszone do CEEB' ? '#4CAF50' : '#F44336'} 
                      />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ background: darkMode ? '#333' : '#fff' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            {pendingCeebSubmissions > 0 && (
              <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/30 border-l-4 border-yellow-500 text-yellow-800 dark:text-yellow-100">
                <div className="flex items-start">
                  <AlertTriangle size={18} className="mr-2 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Zbliżający się termin zgłoszeń CEEB</p>
                    <p className="text-sm">
                      {pendingCeebSubmissions} {pendingCeebSubmissions === 1 ? 'kontrola wymaga' : 'kontrole wymagają'} zgłoszenia do CEEB. 
                      {pendingCeebSubmissions > 3 ? ' 3 z nich mają termin w ciągu najbliższych 24 godzin.' : ''}
                    </p>
                  </div>
                </div>
                <div className="mt-2 flex justify-end">
                  <Button color="yellow" size="sm" className="flex items-center">
                    <FileText size={14} className="mr-1" />
                    Przejdź do zgłoszeń
                  </Button>
                </div>
              </div>
            )}
          </Card>
          
          {/* Recent Inspections */}
          <Card darkMode={darkMode}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold">Ostatnie kontrole</h3>
              <Button 
                as="a"
                href="/inspections"
                variant="link"
                className="text-red-600"
              >
                Zobacz wszystkie
              </Button>
            </div>
            
            <DataTable
              darkMode={darkMode}
              columns={[
                { header: 'ID', accessor: 'id' },
                { header: 'Typ', accessor: 'type' },
                { header: 'Adres', accessor: 'address', 
                  cell: (value, row) => (
                    <div className="flex items-center">
                      <MapPin size={14} className="mr-1 text-gray-500" />
                      {`${value}, ${row.city}`}
                    </div>
                  ) 
                },
                { header: 'Data', accessor: 'date' },
                { 
                  header: 'Wynik', 
                  accessor: 'result',
                  cell: (value) => (
                    <StatusBadge 
                      status={value} 
                      color={value === 'Pozytywny' ? 'green' : value === 'Negatywny' ? 'red' : 'yellow'} 
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
                  cell: (value) => (
                    <div className="flex space-x-2">
                      <Button variant="link" size="sm">Szczegóły</Button>
                      <Button variant="link" size="sm">Protokół</Button>
                    </div>
                  )
                }
              ]}
              data={data.inspections.slice(0, 5)}
            />
          </Card>
        </div>
        
        {/* Sidebar - Activities, Calendar, etc. */}
        <div className="space-y-6">
          {/* Feed Activity */}
          <ActivityFeed 
            activities={data.activities} 
            darkMode={darkMode} 
          />
          
          {/* Inspection Calendar */}
          <InspectionCalendar 
            inspections={data.inspectionCalendar} 
            darkMode={darkMode} 
          />
          
          {/* Client Statistics */}
          <Card darkMode={darkMode}>
            <h3 className="font-semibold mb-4">Statystyki klientów</h3>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-500">Wszyscy klienci</span>
                <span className="font-medium">{data.clients.length}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-500">Wszystkie budynki</span>
                <span className="font-medium">{data.buildings.length}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-500">Średnia liczba budynków na klienta</span>
                <span className="font-medium">
                  {(data.buildings.length / data.clients.length).toFixed(1)}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-500">Klienci z kontrolami w tym miesiącu</span>
                <span className="font-medium">
                  {new Set(data.inspections.map(i => i.clientId)).size}
                </span>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="p-3 bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 text-red-700 dark:text-red-100 text-sm">
                <p className="font-medium">Analiza AI: Trendy klientów</p>
                <p className="mt-1">Trzech klientów odpowiada za 40% wszystkich kontroli w tym kwartale.</p>
              </div>
              <Button 
                as="a"
                href="/clients"
                variant="outline" 
                fullWidth
                className="mt-4"
              >
                Zarządzaj klientami
              </Button>
            </div>
          </Card>
          
          {/* CEEB Reports */}
          <Card darkMode={darkMode}>
            <h3 className="font-semibold mb-4">Ostatnie zgłoszenia CEEB</h3>
            <div className="space-y-4 mb-6">
              {data.ceebReports.slice(0, 3).map((report) => (
                <div 
                  key={report.id} 
                  className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}
                >
                  <div className="flex justify-between">
                    <span className="font-medium">{report.id}</span>
                    <StatusBadge 
                      status={report.status} 
                      color="green" 
                    />
                  </div>
                  <p className="text-sm text-gray-500">Data zgłoszenia: {report.date}</p>
                  <p className="text-sm text-gray-500">Kontrole: {report.inspectionsCount}</p>
                  
                  <div className="mt-2 flex justify-end">
                    <Button variant="link" size="sm">
                      Szczegóły
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            
            <a href="/ceeb">
              <Button 
                variant="outline" 
                fullWidth
              >
                Wszystkie zgłoszenia
              </Button>
            </a>
          </Card>
        </div>
      </div>
      
      {/* Predictive Analytics Modal */}
      {showPredictiveModal && <PredictiveModal />}
    </div>
  );
};

export default ChimneyDashboard;