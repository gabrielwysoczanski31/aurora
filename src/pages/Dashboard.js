import React, { useState, useEffect } from 'react';
import { LineChart, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Line } from 'recharts';
import { 
  DollarSign, TrendingUp, TrendingDown, User, Clock, 
  Calendar, Home, FileText, Cpu, Users, AlertTriangle,
  Zap, BrainCircuit, BarChart2, Download, RefreshCw
} from 'lucide-react';
import Card from '../components/ui/Card';
import StatusBadge from '../components/ui/StatusBadge';
import Button from '../components/ui/Button';
import DataTable from '../components/ui/DataTable';
import ActivityFeed from '../components/ui/ActivityFeed';
import PaymentCalendar from '../components/ui/PaymentCalendar';

const Dashboard = ({ data = {}, darkMode, setActiveTab, isRefreshing }) => {
  const invoices = Array.isArray(data.invoices) ? data.invoices : [];
  const apartments = Array.isArray(data.apartments) ? data.apartments : [];
  const rentalStatusData = Array.isArray(data.rentalStatusData) ? data.rentalStatusData : [];
  const activities = Array.isArray(data.activities) ? data.activities : [];
  const paymentCalendar = Array.isArray(data.paymentCalendar) ? data.paymentCalendar : [];
  const monthlyIncomeData = Array.isArray(data.monthlyIncomeData) ? data.monthlyIncomeData : [];
  const costBreakdownData = Array.isArray(data.costBreakdownData) ? data.costBreakdownData : [];
  
  // State for AI features
  const [aiInsightsVisible, setAiInsightsVisible] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiInsights, setAiInsights] = useState([]);
  const [showForecastModal, setShowForecastModal] = useState(false);
  const [forecastData, setForecastData] = useState(null);
  const [timeRangeFilter, setTimeRangeFilter] = useState('month');
  
  // Calculate KPIs
  const totalIncome = Array.isArray(apartments)
    ? apartments
        .filter(apt => apt.status === 'Wynajęte')
        .reduce((sum, apt) => sum + apt.price, 0)
    : 0;
  
  const totalExpenses = Array.isArray(invoices)
    ? invoices.reduce((sum, inv) => sum + (inv.amount || 0), 0)
    : 0;
  
  const occupancyRate = Array.isArray(apartments) && apartments.length > 0
    ? (apartments.filter(apt => apt.status === 'Wynajęte').length / apartments.length * 100).toFixed(1)
    : 0;
  
  const unpaidInvoices = invoices.filter(inv => inv.status === 'Do zapłaty').length;
  
  // Calculate net profit and ROI
  const netProfit = totalIncome - totalExpenses;
  const roi = totalIncome > 0 ? ((netProfit / totalIncome) * 100).toFixed(1) : 0;

  // Generate AI insights
  const generateAiInsights = () => {
    setAiLoading(true);
    
    // Simulate API call to AI service
    setTimeout(() => {
      const insights = [
        {
          type: 'alert',
          title: 'Zaległe płatności',
          description: 'Wykryto 2 mieszkania z zaległymi płatnościami przekraczającymi 7 dni.',
          icon: <AlertTriangle size={16} className="text-yellow-500" />,
          action: 'Zobacz szczegóły',
          handler: () => setActiveTab('invoices')
        },
        {
          type: 'insight',
          title: 'Optymalizacja cenowa',
          description: `AI wykryło potencjał do zwiększenia czynszu dla 3 mieszkań w centrum. Możliwy wzrost przychodu: ${(totalIncome * 0.08).toLocaleString()} PLN miesięcznie.`,
          icon: <Zap size={16} className="text-blue-500" />,
          action: 'Analizuj',
          handler: () => generatePricingAnalysis()
        },
        {
          type: 'opportunity',
          title: 'Kończące się umowy',
          description: '3 umowy najmu kończą się w przeciągu 30 dni. Zalecamy jak najszybszy kontakt z najemcami.',
          icon: <Calendar size={16} className="text-purple-500" />,
          action: 'Zobacz umowy',
          handler: () => setActiveTab('tenants')
        },
        {
          type: 'prediction',
          title: 'Prognoza cash flow',
          description: `Przewidywany cash flow na przyszły miesiąc: ${(netProfit * 1.05).toLocaleString()} PLN (wzrost o 5%).`,
          icon: <TrendingUp size={16} className="text-green-500" />,
          action: 'Szczegółowa prognoza',
          handler: () => setShowForecastModal(true)
        },
      ];
      
      setAiInsights(insights);
      generateForecastData();
      setAiLoading(false);
    }, 1500);
  };

  // Generate forecast data for modal
  const generateForecastData = () => {
    const forecast = {
      nextQuarter: {
        income: Math.round(totalIncome * 3 * 1.08),
        expenses: Math.round(totalExpenses * 3 * 1.05),
        occupancyRate: Math.min(100, parseFloat(occupancyRate) + 3.5).toFixed(1)
      },
      cashFlowForecast: [
        { month: 'Kwiecień', income: Math.round(totalIncome * 1.02), expenses: Math.round(totalExpenses * 1.01), profit: Math.round(totalIncome * 1.02 - totalExpenses * 1.01) },
        { month: 'Maj', income: Math.round(totalIncome * 1.05), expenses: Math.round(totalExpenses * 1.03), profit: Math.round(totalIncome * 1.05 - totalExpenses * 1.03) },
        { month: 'Czerwiec', income: Math.round(totalIncome * 1.08), expenses: Math.round(totalExpenses * 1.05), profit: Math.round(totalIncome * 1.08 - totalExpenses * 1.05) }
      ],
      recommendations: [
        { title: 'Podwyżka czynszu', description: 'Rozważ 5% podwyżkę dla mieszkań z kończącymi się umowami, zgodnie z trendami rynkowymi.' },
        { title: 'Optymalizacja kosztów', description: 'Potencjał oszczędności 8% na kosztach administracyjnych poprzez zmianę dostawcy usług.' },
        { title: 'Marketing', description: 'Zwiększ budżet marketingowy o 200 PLN, aby skrócić czas wynajmu wolnych mieszkań.' }
      ]
    };
    
    setForecastData(forecast);
  };
  
  // Handle refresh dashboard
  const handleRefresh = () => {
    setRefreshing(true);
    
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false);
      // Would normally refresh data here
    }, 1500);
  };

  // Handle property card clicks for navigation
  const handleNavigateToInvoices = () => {
    if (setActiveTab) {
      setActiveTab('invoices');
    }
  };

  const handlePropertyCardClick = (status) => {
    if (setActiveTab) {
      setActiveTab('properties');
    }
  };

  // Handle invoice action buttons
  const handleInvoiceAction = (invoiceId, action) => {
    console.log(`Invoice ${invoiceId} action: ${action}`);
  };
  
  // Generate pricing analysis
  const generatePricingAnalysis = () => {
    alert('Funkcja AI analizy cen będzie dostępna wkrótce.');
  };
  
  // Initialize AI insights
  useEffect(() => {
    if (aiInsightsVisible) {
      generateAiInsights();
    }
  }, [aiInsightsVisible]);

  // Render AI forecast modal
  const renderForecastModal = () => {
    if (!forecastData) return null;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className={`max-w-4xl w-full ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-xl overflow-auto max-h-screen p-6`}>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold flex items-center">
              <BrainCircuit size={24} className="mr-2 text-blue-500" />
              Prognoza finansowa AI
            </h3>
            <button 
              onClick={() => setShowForecastModal(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card darkMode={darkMode}>
              <h4 className="font-semibold mb-3">Przewidywany przychód</h4>
              <div className="text-3xl font-bold text-green-600">{forecastData.nextQuarter.income.toLocaleString()} PLN</div>
              <p className="text-gray-500">Następny kwartał</p>
              <div className="mt-2 flex items-center text-green-500">
                <TrendingUp size={16} className="mr-1" />
                <span>+8% od bieżącego</span>
              </div>
            </Card>
            
            <Card darkMode={darkMode}>
              <h4 className="font-semibold mb-3">Przewidywane koszty</h4>
              <div className="text-3xl font-bold text-red-600">{forecastData.nextQuarter.expenses.toLocaleString()} PLN</div>
              <p className="text-gray-500">Następny kwartał</p>
              <div className="mt-2 flex items-center text-red-500">
                <TrendingUp size={16} className="mr-1" />
                <span>+5% od bieżącego</span>
              </div>
            </Card>
            
            <Card darkMode={darkMode}>
              <h4 className="font-semibold mb-3">Poziom wynajmu</h4>
              <div className="text-3xl font-bold text-blue-600">{forecastData.nextQuarter.occupancyRate}%</div>
              <p className="text-gray-500">Prognoza na koniec kwartału</p>
              <div className="mt-2 flex items-center text-green-500">
                <TrendingUp size={16} className="mr-1" />
                <span>+{(forecastData.nextQuarter.occupancyRate - occupancyRate).toFixed(1)}% od bieżącego</span>
              </div>
            </Card>
          </div>
          
          <Card darkMode={darkMode} className="mb-6">
            <h4 className="font-semibold mb-4">Szczegółowa prognoza cash flow</h4>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className={darkMode ? 'border-b border-gray-700' : 'border-b'}>
                    <th className="py-2 text-left">Miesiąc</th>
                    <th className="py-2 text-right">Przychód</th>
                    <th className="py-2 text-right">Koszty</th>
                    <th className="py-2 text-right">Zysk netto</th>
                  </tr>
                </thead>
                <tbody>
                  {forecastData.cashFlowForecast.map((month, index) => (
                    <tr key={index} className={darkMode ? 'border-b border-gray-700' : 'border-b'}>
                      <td className="py-2">{month.month}</td>
                      <td className="py-2 text-right text-green-600">{month.income.toLocaleString()} PLN</td>
                      <td className="py-2 text-right text-red-600">{month.expenses.toLocaleString()} PLN</td>
                      <td className="py-2 text-right font-medium text-blue-600">{month.profit.toLocaleString()} PLN</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
          
          <Card darkMode={darkMode}>
            <h4 className="font-semibold mb-4">Rekomendacje AI</h4>
            <div className="space-y-4">
              {forecastData.recommendations.map((rec, index) => (
                <div key={index} className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} flex items-start`}>
                  <Zap size={20} className="mr-3 mt-0.5 text-blue-500 flex-shrink-0" />
                  <div>
                    <p className="font-medium">{rec.title}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{rec.description}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 flex justify-between">
              <Button variant="outline" onClick={() => setShowForecastModal(false)}>
                Zamknij
              </Button>
              <Button color="blue" className="flex items-center">
                <Download size={16} className="mr-2" />
                Eksportuj raport
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header with title and actions */}
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
            variant={aiInsightsVisible ? "outline" : "primary"}
            color="blue" 
            className="flex items-center"
            onClick={() => setAiInsightsVisible(!aiInsightsVisible)}
          >
            <BrainCircuit size={16} className="mr-2" />
            {aiInsightsVisible ? 'Ukryj AI' : 'Analiza AI'}
          </Button>
          
          <Button 
            variant="outline" 
            className="flex items-center"
            onClick={handleRefresh}
            disabled={refreshing}
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
      {aiInsightsVisible && (
        <Card darkMode={darkMode} className="border-l-4 border-blue-500">
          <div className="flex justify-between items-start">
            <div className="flex items-center">
              <BrainCircuit size={20} className="mr-2 text-blue-500" />
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
          
          {aiLoading ? (
            <div className="flex items-center justify-center p-6">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <span className="ml-2">Analizowanie danych...</span>
            </div>
          ) : (
            <div className="mt-3 space-y-3">
              {aiInsights.map((insight, index) => (
                <div 
                  key={index} 
                  className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} flex items-start`}
                >
                  {insight.icon}
                  <div className="flex-1 ml-3">
                    <h4 className="font-medium">{insight.title}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{insight.description}</p>
                  </div>
                  
                  <Button 
                    variant="link" 
                    size="sm"
                    className="ml-2 whitespace-nowrap"
                    onClick={insight.handler}
                  >
                    {insight.action}
                  </Button>
                </div>
              ))}
            </div>
          )}
          
          <div className="mt-4 flex justify-between items-center">
            <Button 
              color="blue" 
              variant="outline"
              className="flex items-center"
              onClick={() => setShowForecastModal(true)}
            >
              <BarChart2 size={16} className="mr-2" />
              Pełna analiza
            </Button>
            
            <span className="text-sm text-gray-500">
              Ostatnia aktualizacja: dzisiaj, 14:35
            </span>
          </div>
        </Card>
      )}
      
      {/* Enhanced KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card darkMode={darkMode} className="cursor-pointer hover:shadow-lg transition-all duration-200 relative overflow-hidden" 
              onClick={() => handlePropertyCardClick('all')}>
          <div className="absolute -right-2 -top-2 h-16 w-16 rounded-full bg-blue-500 bg-opacity-10"></div>
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-gray-500 font-medium">Przychód miesięczny</h3>
              <p className="text-2xl font-bold mt-2">{totalIncome.toLocaleString()} PLN</p>
              <p className="text-green-500 text-sm flex items-center">
                <TrendingUp size={14} className="mr-1" />
                +5% od ost. miesiąca
              </p>
            </div>
            <DollarSign size={24} className="text-blue-500" />
          </div>
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-blue-600"></div>
        </Card>
        
        <Card darkMode={darkMode} className="cursor-pointer hover:shadow-lg transition-all duration-200 relative overflow-hidden" 
              onClick={() => handleNavigateToInvoices()}>
          <div className="absolute -right-2 -top-2 h-16 w-16 rounded-full bg-red-500 bg-opacity-10"></div>
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-gray-500 font-medium">Koszty miesięczne</h3>
              <p className="text-2xl font-bold mt-2">{totalExpenses.toLocaleString()} PLN</p>
              <p className="text-red-500 text-sm flex items-center">
                <TrendingUp size={14} className="mr-1" />
                +2% od ost. miesiąca
              </p>
            </div>
            <FileText size={24} className="text-red-500" />
          </div>
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-red-400 to-red-600"></div>
        </Card>
        
        <Card darkMode={darkMode} className="cursor-pointer hover:shadow-lg transition-all duration-200 relative overflow-hidden" 
              onClick={() => handlePropertyCardClick('Wynajęte')}>
          <div className="absolute -right-2 -top-2 h-16 w-16 rounded-full bg-green-500 bg-opacity-10"></div>
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-gray-500 font-medium">Poziom wynajmu</h3>
              <p className="text-2xl font-bold mt-2">{occupancyRate}%</p>
              <p className="text-green-500 text-sm flex items-center">
                <TrendingUp size={14} className="mr-1" />
                +3% od ost. miesiąca
              </p>
            </div>
            <Users size={24} className="text-green-500" />
          </div>
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 to-green-600"></div>
        </Card>
        
        <Card darkMode={darkMode} className="cursor-pointer hover:shadow-lg transition-all duration-200 relative overflow-hidden" 
              onClick={() => handleNavigateToInvoices()}>
          <div className="absolute -right-2 -top-2 h-16 w-16 rounded-full bg-yellow-500 bg-opacity-10"></div>
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-gray-500 font-medium">ROI</h3>
              <p className="text-2xl font-bold mt-2">{roi}%</p>
              <p className="text-yellow-500 text-sm flex items-center">
                <TrendingDown size={14} className="mr-1" />
                -1.2% od ost. miesiąca
              </p>
            </div>
            <Zap size={24} className="text-yellow-500" />
          </div>
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-400 to-yellow-600"></div>
        </Card>
      </div>
      
      {/* Main section - charts and tables */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Charts - take up 2/3 of the width on large screens */}
        <div className="lg:col-span-2 space-y-6">
          {/* Revenue and cost chart */}
          <Card darkMode={darkMode}>
            <h3 className="font-semibold mb-4">Przychody i koszty (3 miesiące)</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={monthlyIncomeData}
                  margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#444' : '#eee'} />
                  <XAxis dataKey="name" stroke={darkMode ? '#ccc' : '#666'} />
                  <YAxis stroke={darkMode ? '#ccc' : '#666'} />
                  <Tooltip contentStyle={{ background: darkMode ? '#333' : '#fff' }} />
                  <Legend />
                  <Line type="monotone" dataKey="przychód" stroke="#4caf50" strokeWidth={2} activeDot={{ r: 8 }} />
                  <Line type="monotone" dataKey="koszty" stroke="#f44336" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
          
          {/* Cost breakdown chart */}
          <Card darkMode={darkMode}>
            <h3 className="font-semibold mb-4">Struktura kosztów (bieżący miesiąc)</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={costBreakdownData}
                  margin={{ top: 5, right: 20, bottom: 30, left: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#444' : '#eee'} />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" stroke={darkMode ? '#ccc' : '#666'} />
                  <YAxis stroke={darkMode ? '#ccc' : '#666'} />
                  <Tooltip contentStyle={{ background: darkMode ? '#333' : '#fff' }} />
                  <Bar dataKey="wartość" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
          
          {/* Property status */}
          <Card darkMode={darkMode}>
            <h3 className="font-semibold mb-4">Status mieszkań</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {rentalStatusData.map((status, index) => (
                <div 
                  key={index} 
                  className={`p-3 rounded-lg ${index === 0 ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' : index === 1 ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100' : index === 2 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100' : 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100'} cursor-pointer hover:shadow-md transition-all duration-200`}
                  onClick={() => handlePropertyCardClick(status.name)}
                >
                  <h4 className="font-medium">{status.name}</h4>
                  <p className="text-2xl font-bold mt-1">{status.value}</p>
                </div>
              ))}
            </div>
          </Card>
          
          {/* Latest invoices */}
          <Card darkMode={darkMode}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold">Najnowsze faktury</h3>
              <Button 
                onClick={handleNavigateToInvoices} 
                variant="link"
              >
                Zobacz wszystkie
              </Button>
            </div>
            
            <DataTable
              darkMode={darkMode}
              columns={[
                { header: 'Nr faktury', accessor: 'number' },
                { header: 'Kategoria', accessor: 'category' },
                { header: 'Data', accessor: 'date' },
                { 
                  header: 'Kwota', 
                  accessor: 'amount',
                  cell: (value) => `${value.toLocaleString()} PLN`,
                  align: 'right'
                },
                { 
                  header: 'Status', 
                  accessor: 'status',
                  cell: (value) => (
                    <StatusBadge 
                      status={value} 
                      color={value === 'Opłacona' ? 'green' : 'yellow'} 
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
                        size="sm"
                        onClick={() => handleInvoiceAction(value, 'view')}
                      >
                        Podgląd
                      </Button>
                      {invoices.find(inv => inv.id === value)?.status === 'Do zapłaty' && (
                        <Button 
                          variant="link" 
                          size="sm"
                          onClick={() => handleInvoiceAction(value, 'pay')}
                          className="text-green-600"
                        >
                          Opłać
                        </Button>
                      )}
                    </div>
                  )
                }
              ]}
              data={invoices.slice(0, 5)}
              onRowClick={(row) => handleInvoiceAction(row.id, 'details')}
            />
          </Card>
        </div>
        
        {/* Side section - activities and payment calendar */}
        <div className="space-y-6">
          {/* Enhanced Activity feed with AI notifications */}
          <Card darkMode={darkMode}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold flex items-center">
                <Clock size={16} className="mr-2" />
                Aktywność
              </h3>
              <Button variant="link" size="sm">
                Zobacz wszystkie
              </Button>
            </div>
            
            <div className="space-y-4">
              {/* AI-Generated Activity */}
              <div className={`p-3 rounded-lg ${darkMode ? 'bg-blue-900 bg-opacity-20' : 'bg-blue-50'}`}>
                <div className="flex">
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center ${darkMode ? 'bg-blue-600' : 'bg-blue-500'} text-white flex-shrink-0`}>
                    <BrainCircuit size={16} />
                  </div>
                  <div className="ml-3">
                    <div className="flex items-center">
                      <p className="font-medium">Analiza AI</p>
                      <span className="text-xs text-gray-500 ml-2">dzisiaj, 14:35</span>
                    </div>
                    <p className="text-sm mt-1">
                      Wykryto potencjał wzrostu przychodu o 8% poprzez optymalizację czynszów.
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Regular Activities */}
              <ActivityFeed 
                activities={activities} 
                darkMode={darkMode} 
              />
            </div>
          </Card>
          
          {/* Payment calendar with AI predictions */}
          <Card darkMode={darkMode}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold flex items-center">
                <Calendar size={16} className="mr-2" />
                Kalendarz płatności
              </h3>
              <Button variant="link" size="sm">
                Zobacz wszystkie
              </Button>
            </div>
            
            {/* AI Payment Prediction */}
            <div className={`p-3 rounded-lg ${darkMode ? 'bg-green-900 bg-opacity-20' : 'bg-green-50'} mb-4`}>
              <div className="flex">
                <div className={`h-8 w-8 rounded-full flex items-center justify-center ${darkMode ? 'bg-green-600' : 'bg-green-500'} text-white flex-shrink-0`}>
                  <Zap size={16} />
                </div>
                <div className="ml-3">
                  <p className="font-medium">Prognoza AI</p>
                  <p className="text-sm mt-1">
                    Przewidywane wpływy w tym tygodniu: {(totalIncome * 0.25).toLocaleString()} PLN
                  </p>
                </div>
              </div>
            </div>
            
            <PaymentCalendar 
              payments={paymentCalendar} 
              darkMode={darkMode} 
            />
          </Card>
          
          {/* AI Property Health */}
          <Card darkMode={darkMode}>
            <h3 className="font-semibold mb-4 flex items-center">
              <Home size={16} className="mr-2" />
              Stan mieszkań
            </h3>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span>Stan ogólny</span>
                <div className="w-2/3 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 rounded-full" style={{ width: '85%' }}></div>
                </div>
                <span className="font-medium">85%</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span>Czas wynajmu</span>
                <div className="w-2/3 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: '92%' }}></div>
                </div>
                <span className="font-medium">92%</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span>Opłacalność</span>
                <div className="w-2/3 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full bg-yellow-500 rounded-full" style={{ width: '78%' }}></div>
                </div>
                <span className="font-medium">78%</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span>Zadowolenie najemców</span>
                <div className="w-2/3 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-500 rounded-full" style={{ width: '89%' }}></div>
                </div>
                <span className="font-medium">89%</span>
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900 dark:bg-opacity-20 rounded-lg">
              <p className="text-sm">
                <Zap size={14} className="inline-block mr-1 text-blue-500" />
                <strong>AI Insight:</strong> 2 mieszkania wymagają przeglądu instalacji w ciągu 30 dni.
              </p>
            </div>
          </Card>
        </div>
      </div>
      
      {/* Forecast modal */}
      {showForecastModal && renderForecastModal()}
    </div>
  );
};

export default Dashboard;