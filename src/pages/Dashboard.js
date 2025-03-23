import React from 'react';
import { LineChart, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Line } from 'recharts';
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

  // Handle button clicks for navigation
  const handleNavigateToInvoices = () => {
    if (setActiveTab) {
      setActiveTab('invoices');
    }
  };

  // Handle property card clicks
  const handlePropertyCardClick = (status) => {
    if (setActiveTab) {
      setActiveTab('properties');
      // You could also potentially set a filter state here
      console.log(`Filtering by status: ${status}`);
    }
  };

  // Handle invoice action buttons
  const handleInvoiceAction = (invoiceId, action) => {
    console.log(`Invoice ${invoiceId} action: ${action}`);
    // Implement actual actions like view, pay, download, etc.
    alert(`Action "${action}" for invoice #${invoiceId} will be implemented.`);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Przegląd</h2>
      
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card darkMode={darkMode} className="cursor-pointer hover:shadow-lg transition-all duration-200" 
              onClick={() => handlePropertyCardClick('all')}>
          <h3 className="text-gray-500 font-medium">Przychód miesięczny</h3>
          <p className="text-2xl font-bold mt-2">{totalIncome.toLocaleString()} PLN</p>
          <p className="text-green-500 text-sm">+5% od ost. miesiąca</p>
        </Card>
        
        <Card darkMode={darkMode} className="cursor-pointer hover:shadow-lg transition-all duration-200" 
              onClick={() => handleNavigateToInvoices()}>
          <h3 className="text-gray-500 font-medium">Koszty miesięczne</h3>
          <p className="text-2xl font-bold mt-2">{totalExpenses.toLocaleString()} PLN</p>
          <p className="text-red-500 text-sm">+2% od ost. miesiąca</p>
        </Card>
        
        <Card darkMode={darkMode} className="cursor-pointer hover:shadow-lg transition-all duration-200" 
              onClick={() => handlePropertyCardClick('Wynajęte')}>
          <h3 className="text-gray-500 font-medium">Poziom wynajmu</h3>
          <p className="text-2xl font-bold mt-2">{occupancyRate}%</p>
          <p className="text-green-500 text-sm">+3% od ost. miesiąca</p>
        </Card>
        
        <Card darkMode={darkMode} className="cursor-pointer hover:shadow-lg transition-all duration-200" 
              onClick={() => handleNavigateToInvoices()}>
          <h3 className="text-gray-500 font-medium">Niezapłacone faktury</h3>
          <p className="text-2xl font-bold mt-2">{unpaidInvoices}</p>
          <p className="text-yellow-500 text-sm">2 wymagają uwagi</p>
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
          {/* Activity feed */}
          <ActivityFeed 
            activities={activities} 
            darkMode={darkMode} 
          />
          
          {/* Payment calendar */}
          <PaymentCalendar 
            payments={paymentCalendar} 
            darkMode={darkMode} 
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;