import React from 'react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { DollarSign, TrendingUp, TrendingDown, Activity } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import AdvancedCharts from '../../components/ui/AdvancedCharts';

const FinanceOverview = ({ data, darkMode }) => {
  // Kolorystyka wykresów
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
  
  // Obliczanie KPI
  const totalIncome = data.apartments
    .filter(apt => apt.status === 'Wynajęte')
    .reduce((sum, apt) => sum + apt.price, 0);
  
  const totalExpenses = data.invoices
    .reduce((sum, inv) => sum + inv.amount, 0);
  
  const profit = totalIncome - totalExpenses;
  const profitMargin = totalIncome > 0 ? ((profit / totalIncome) * 100).toFixed(1) : 0;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Finanse</h2>
      
      {/* Karty KPI */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card darkMode={darkMode} className="stats-card">
          <h3 className="font-semibold mb-4 text-gray-500">Przychody (bieżący rok)</h3>
          <div className="flex items-center">
            <DollarSign size={24} className="mr-2 text-green-600" />
            <span className="text-3xl font-bold text-green-600">242 000 PLN</span>
          </div>
          <div className="flex items-center mt-2 text-sm">
            <TrendingUp size={16} className="mr-1 text-green-500" />
            <span className="text-green-500">+8% rok do roku</span>
          </div>
        </Card>
        
        <Card darkMode={darkMode} className="stats-card">
          <h3 className="font-semibold mb-4 text-gray-500">Koszty (bieżący rok)</h3>
          <div className="flex items-center">
            <DollarSign size={24} className="mr-2 text-red-600" />
            <span className="text-3xl font-bold text-red-600">83 000 PLN</span>
          </div>
          <div className="flex items-center mt-2 text-sm">
            <TrendingDown size={16} className="mr-1 text-green-500" />
            <span className="text-green-500">-3% rok do roku</span>
          </div>
        </Card>
        
        <Card darkMode={darkMode} className="stats-card">
          <h3 className="font-semibold mb-4 text-gray-500">Zysk (bieżący rok)</h3>
          <div className="flex items-center">
            <DollarSign size={24} className="mr-2 text-blue-600" />
            <span className="text-3xl font-bold text-blue-600">159 000 PLN</span>
          </div>
          <div className="flex items-center mt-2 text-sm">
            <Activity size={16} className="mr-1 text-green-500" />
            <span className="text-green-500">Marża: 65.7%</span>
          </div>
        </Card>
      </div>
      
      {/* Zaawansowane wykresy */}
      <AdvancedCharts data={data} darkMode={darkMode} type="property" />
      
      {/* Analiza przychodów i kosztów */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card darkMode={darkMode}>
          <h3 className="font-semibold mb-4">Struktura przychodów</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: 'Czynsz', value: 75 },
                    { name: 'Opłaty dodatkowe', value: 15 },
                    { name: 'Kaucje', value: 10 }
                  ]}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {[0, 1, 2].map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: darkMode ? '#333' : '#fff' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
        
        <Card darkMode={darkMode}>
          <h3 className="font-semibold mb-4">Struktura kosztów</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data.costBreakdownData}
                margin={{ top: 5, right: 20, bottom: 30, left: 0 }}
                layout="vertical"
              >
                <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#444' : '#eee'} />
                <XAxis type="number" stroke={darkMode ? '#ccc' : '#666'} />
                <YAxis dataKey="name" type="category" stroke={darkMode ? '#ccc' : '#666'} />
                <Tooltip contentStyle={{ background: darkMode ? '#333' : '#fff' }} />
                <Bar dataKey="wartość" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
      
      {/* Prognoza finansowa */}
      <Card darkMode={darkMode}>
        <h3 className="font-semibold mb-4">Prognoza finansowa (najbliższe 6 miesięcy)</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={[
                { name: 'Kwiecień', przychód: 85000, koszt: 30000, prognoza: true },
                { name: 'Maj', przychód: 87000, koszt: 31000, prognoza: true },
                { name: 'Czerwiec', przychód: 90000, koszt: 32000, prognoza: true },
                { name: 'Lipiec', przychód: 92000, koszt: 33000, prognoza: true },
                { name: 'Sierpień', przychód: 95000, koszt: 34000, prognoza: true },
                { name: 'Wrzesień', przychód: 97000, koszt: 35000, prognoza: true }
              ]}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorPrzychód" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#82ca9d" stopOpacity={0.2}/>
                </linearGradient>
                <linearGradient id="colorKoszt" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f87171" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#f87171" stopOpacity={0.2}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#444' : '#eee'} />
              <XAxis dataKey="name" stroke={darkMode ? '#ccc' : '#666'} />
              <YAxis stroke={darkMode ? '#ccc' : '#666'} />
              <Tooltip contentStyle={{ background: darkMode ? '#333' : '#fff' }} />
              <Legend />
              <Area type="monotone" dataKey="przychód" stroke="#82ca9d" fillOpacity={1} fill="url(#colorPrzychód)" />
              <Area type="monotone" dataKey="koszt" stroke="#f87171" fillOpacity={1} fill="url(#colorKoszt)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <p className="mt-4 text-sm text-gray-500">* Prognoza oparta o historyczne dane i aktualne trendy rynkowe</p>
      </Card>
      
      {/* Przyciski eksportu raportów */}
      <div className="flex justify-end space-x-3">
        <Button variant="outline" className="flex items-center">
          <DollarSign size={16} className="mr-2" />
          Raport przychodów
        </Button>
        <Button variant="outline" className="flex items-center">
          <Activity size={16} className="mr-2" />
          Analiza rentowności
        </Button>
        <Button variant="outline" className="flex items-center">
          <TrendingUp size={16} className="mr-2" />
          Pełny raport finansowy
        </Button>
      </div>
    </div>
  );
};

export default FinanceOverview;