import React from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import StatusBadge from '../components/ui/StatusBadge';
import DataTable from '../components/ui/DataTable';
import ActivityFeed from '../components/ui/ActivityFeed';
import InspectionCalendar from '../components/ui/InspectionCalendar';

const ChimneyDashboard = ({ data, darkMode, setActiveTab = () => {} }) => {
  // Obliczanie KPI
  const totalInspections = data.inspections.length;
  const pendingCeebSubmissions = data.inspections.filter(i => i.ceebStatus === 'Do zgłoszenia').length;
  const positiveResults = data.inspections.filter(i => i.result === 'Pozytywny').length;
  const negativeResults = data.inspections.filter(i => i.result === 'Negatywny').length;

  // Kolorystyka wykresów
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
  const RESULT_COLORS = {
    'Pozytywny': '#4CAF50',
    'Negatywny': '#F44336',
    'Warunkowy': '#FFC107'
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Przegląd</h2>
      
      {/* Karty KPI */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card darkMode={darkMode}>
          <h3 className="text-gray-500 font-medium">Kontrole w tym miesiącu</h3>
          <p className="text-2xl font-bold mt-2">{totalInspections}</p>
          <p className="text-green-500 text-sm">+8% od ost. miesiąca</p>
        </Card>
        
        <Card darkMode={darkMode}>
          <h3 className="text-gray-500 font-medium">Do zgłoszenia w CEEB</h3>
          <p className="text-2xl font-bold mt-2">{pendingCeebSubmissions}</p>
          <p className="text-yellow-500 text-sm">Wymaga uwagi</p>
        </Card>
        
        <Card darkMode={darkMode}>
          <h3 className="text-gray-500 font-medium">Wyniki pozytywne</h3>
          <p className="text-2xl font-bold mt-2">{positiveResults}</p>
          <p className="text-green-500 text-sm">{Math.round(positiveResults / totalInspections * 100)}% wszystkich kontroli</p>
        </Card>
        
        <Card darkMode={darkMode}>
          <h3 className="text-gray-500 font-medium">Wyniki negatywne</h3>
          <p className="text-2xl font-bold mt-2">{negativeResults}</p>
          <p className="text-red-500 text-sm">{Math.round(negativeResults / totalInspections * 100)}% wszystkich kontroli</p>
        </Card>
      </div>
      
      {/* Sekcja główna - wykresy i tabele */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Wykresy - zajmują 2/3 szerokości na dużych ekranach */}
        <div className="lg:col-span-2 space-y-6">
          {/* Wykres kontroli */}
          <Card darkMode={darkMode}>
            <h3 className="font-semibold mb-4">Kontrole (ostatnie 3 miesiące)</h3>
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
          </Card>
          
          {/* Wykresy kołowe */}
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
            </Card>
          </div>
          
          {/* Status CEEB */}
          <Card darkMode={darkMode}>
            <h3 className="font-semibold mb-4">Status CEEB</h3>
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
          </Card>
          
          {/* Ostatnie kontrole */}
          <Card darkMode={darkMode}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold">Ostatnie kontrole</h3>
              <Button 
                onClick={() => setActiveTab('inspections')} 
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
                  cell: (value, row) => `${value}, ${row.city}` },
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
                }
              ]}
              data={data.inspections.slice(0, 5)}
            />
          </Card>
        </div>
        
        {/* Sekcja poboczna - aktywności i kalendarz */}
        <div className="space-y-6">
          {/* Feed aktywności */}
          <ActivityFeed 
            activities={data.activities} 
            darkMode={darkMode} 
          />
          
          {/* Kalendarz kontroli */}
          <InspectionCalendar 
            inspections={data.inspectionCalendar} 
            darkMode={darkMode} 
          />
          
          {/* Statystyki klientów */}
          <Card darkMode={darkMode}>
            <h3 className="font-semibold mb-4">Statystyki klientów</h3>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-500">Wszyscy klienci</span>
                <span className="font-medium">{data.clients.length}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-500">Wszyscy budynki</span>
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
              <Button 
                onClick={() => setActiveTab('clients')} 
                variant="outline" 
                fullWidth
              >
                Zarządzaj klientami
              </Button>
            </div>
          </Card>
          
          {/* Zgłoszenia CEEB */}
          <Card darkMode={darkMode}>
            <h3 className="font-semibold mb-4">Ostatnie zgłoszenia CEEB</h3>
            <div className="space-y-4">
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
                </div>
              ))}
            </div>
            
            <div className="mt-4">
              <Button 
                onClick={() => setActiveTab('ceeb')} 
                variant="outline" 
                fullWidth
              >
                Wszystkie zgłoszenia
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ChimneyDashboard;