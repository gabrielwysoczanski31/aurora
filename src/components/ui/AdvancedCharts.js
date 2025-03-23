import React, { useState } from 'react';
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar, 
  ComposedChart, PieChart, Pie, ScatterChart, Scatter,
  RadarChart, Radar, RadialBarChart, RadialBar, PolarGrid, 
  PolarAngleAxis, PolarRadiusAxis, ReferenceLine, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, Cell 
} from 'recharts';
import Card from './Card';
import Button from './Button';

const AdvancedCharts = ({ data, darkMode, type = 'property' }) => {
  const [chartType, setChartType] = useState('area');
  const [timeRange, setTimeRange] = useState('month');
  
  // Kolory dla wykresów
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#FF6B6B', '#6FCF97', '#A259FF'];
  const gradientColors = {
    income: darkMode ? ['#0E5CAD', '#2C83EB'] : ['#2C83EB', '#88BAFF'],
    expenses: darkMode ? ['#A92535', '#E05162'] : ['#E05162', '#FFACB6'],
    occupancy: darkMode ? ['#0C7C59', '#10B380'] : ['#10B380', '#6FCF97']
  };
  
  // Dane specyficzne dla typu dashboardu
  const getChartData = () => {
    if (type === 'property') {
      // Dane dla dashboardu deweloperskiego
      switch (timeRange) {
        case 'week':
          return {
            income: [
              { name: 'Pon', value: 5200 },
              { name: 'Wt', value: 4800 },
              { name: 'Śr', value: 6100 },
              { name: 'Czw', value: 5900 },
              { name: 'Pt', value: 7200 },
              { name: 'Sob', value: 6300 },
              { name: 'Nd', value: 5700 }
            ],
            expenses: [
              { name: 'Pon', value: 1800 },
              { name: 'Wt', value: 2100 },
              { name: 'Śr', value: 1900 },
              { name: 'Czw', value: 2400 },
              { name: 'Pt', value: 2000 },
              { name: 'Sob', value: 1600 },
              { name: 'Nd', value: 1500 }
            ],
            combined: [
              { name: 'Pon', przychód: 5200, koszt: 1800, zysk: 3400 },
              { name: 'Wt', przychód: 4800, koszt: 2100, zysk: 2700 },
              { name: 'Śr', przychód: 6100, koszt: 1900, zysk: 4200 },
              { name: 'Czw', przychód: 5900, koszt: 2400, zysk: 3500 },
              { name: 'Pt', przychód: 7200, koszt: 2000, zysk: 5200 },
              { name: 'Sob', przychód: 6300, koszt: 1600, zysk: 4700 },
              { name: 'Nd', przychód: 5700, koszt: 1500, zysk: 4200 }
            ]
          };
        case 'month':
          return {
            income: [
              { name: '01', value: 35200 },
              { name: '05', value: 34800 },
              { name: '10', value: 36100 },
              { name: '15', value: 40900 },
              { name: '20', value: 47200 },
              { name: '25', value: 46300 },
              { name: '30', value: 45700 }
            ],
            expenses: [
              { name: '01', value: 11800 },
              { name: '05', value: 12100 },
              { name: '10', value: 11900 },
              { name: '15', value: 12400 },
              { name: '20', value: 12000 },
              { name: '25', value: 11600 },
              { name: '30', value: 11500 }
            ],
            combined: [
              { name: '01', przychód: 35200, koszt: 11800, zysk: 23400 },
              { name: '05', przychód: 34800, koszt: 12100, zysk: 22700 },
              { name: '10', przychód: 36100, koszt: 11900, zysk: 24200 },
              { name: '15', przychód: 40900, koszt: 12400, zysk: 28500 },
              { name: '20', przychód: 47200, koszt: 12000, zysk: 35200 },
              { name: '25', przychód: 46300, koszt: 11600, zysk: 34700 },
              { name: '30', przychód: 45700, koszt: 11500, zysk: 34200 }
            ]
          };
        case 'year':
          return {
            income: [
              { name: 'Sty', value: 138200 },
              { name: 'Lut', value: 145800 },
              { name: 'Mar', value: 156100 },
              { name: 'Kwi', value: 150900 },
              { name: 'Maj', value: 177200 },
              { name: 'Cze', value: 176300 },
              { name: 'Lip', value: 195700 },
              { name: 'Sie', value: 198200 },
              { name: 'Wrz', value: 185800 },
              { name: 'Paź', value: 176100 },
              { name: 'Lis', value: 170900 },
              { name: 'Gru', value: 187200 }
            ],
            expenses: [
              { name: 'Sty', value: 51800 },
              { name: 'Lut', value: 52100 },
              { name: 'Mar', value: 51900 },
              { name: 'Kwi', value: 52400 },
              { name: 'Maj', value: 52000 },
              { name: 'Cze', value: 51600 },
              { name: 'Lip', value: 58500 },
              { name: 'Sie', value: 61800 },
              { name: 'Wrz', value: 57100 },
              { name: 'Paź', value: 55900 },
              { name: 'Lis', value: 54400 },
              { name: 'Gru', value: 57000 }
            ],
            combined: [
              { name: 'Sty', przychód: 138200, koszt: 51800, zysk: 86400 },
              { name: 'Lut', przychód: 145800, koszt: 52100, zysk: 93700 },
              { name: 'Mar', przychód: 156100, koszt: 51900, zysk: 104200 },
              { name: 'Kwi', przychód: 150900, koszt: 52400, zysk: 98500 },
              { name: 'Maj', przychód: 177200, koszt: 52000, zysk: 125200 },
              { name: 'Cze', przychód: 176300, koszt: 51600, zysk: 124700 },
              { name: 'Lip', przychód: 195700, koszt: 58500, zysk: 137200 },
              { name: 'Sie', przychód: 198200, koszt: 61800, zysk: 136400 },
              { name: 'Wrz', przychód: 185800, koszt: 57100, zysk: 128700 },
              { name: 'Paź', przychód: 176100, koszt: 55900, zysk: 120200 },
              { name: 'Lis', przychód: 170900, koszt: 54400, zysk: 116500 },
              { name: 'Gru', przychód: 187200, koszt: 57000, zysk: 130200 }
            ]
          };
        default:
          return { income: [], expenses: [], combined: [] };
      }
    } else {
      // Dane dla dashboardu kominiarskiego
      switch (timeRange) {
        case 'week':
          return {
            income: [
              { name: 'Pon', value: 3200 },
              { name: 'Wt', value: 4100 },
              { name: 'Śr', value: 3600 },
              { name: 'Czw', value: 4500 },
              { name: 'Pt', value: 5200 },
              { name: 'Sob', value: 3800 },
              { name: 'Nd', value: 1700 }
            ],
            inspections: [
              { name: 'Pon', value: 8 },
              { name: 'Wt', value: 12 },
              { name: 'Śr', value: 10 },
              { name: 'Czw', value: 14 },
              { name: 'Pt', value: 16 },
              { name: 'Sob', value: 11 },
              { name: 'Nd', value: 4 }
            ],
            combined: [
              { name: 'Pon', kontrole: 8, przychód: 3200, śrKoszt: 400 },
              { name: 'Wt', kontrole: 12, przychód: 4100, śrKoszt: 342 },
              { name: 'Śr', kontrole: 10, przychód: 3600, śrKoszt: 360 },
              { name: 'Czw', kontrole: 14, przychód: 4500, śrKoszt: 321 },
              { name: 'Pt', kontrole: 16, przychód: 5200, śrKoszt: 325 },
              { name: 'Sob', kontrole: 11, przychód: 3800, śrKoszt: 345 },
              { name: 'Nd', kontrole: 4, przychód: 1700, śrKoszt: 425 }
            ]
          };
        case 'month':
          return {
            income: [
              { name: '01', value: 15200 },
              { name: '05', value: 16800 },
              { name: '10', value: 16100 },
              { name: '15', value: 17900 },
              { name: '20', value: 18200 },
              { name: '25', value: 19300 },
              { name: '30', value: 15700 }
            ],
            inspections: [
              { name: '01', value: 40 },
              { name: '05', value: 48 },
              { name: '10', value: 45 },
              { name: '15', value: 52 },
              { name: '20', value: 57 },
              { name: '25', value: 63 },
              { name: '30', value: 42 }
            ],
            combined: [
              { name: '01', kontrole: 40, przychód: 15200, śrKoszt: 380 },
              { name: '05', kontrole: 48, przychód: 16800, śrKoszt: 350 },
              { name: '10', kontrole: 45, przychód: 16100, śrKoszt: 358 },
              { name: '15', kontrole: 52, przychód: 17900, śrKoszt: 344 },
              { name: '20', kontrole: 57, przychód: 18200, śrKoszt: 319 },
              { name: '25', kontrole: 63, przychód: 19300, śrKoszt: 306 },
              { name: '30', kontrole: 42, przychód: 15700, śrKoszt: 374 }
            ]
          };
        case 'year':
          return {
            income: [
              { name: 'Sty', value: 68200 },
              { name: 'Lut', value: 65800 },
              { name: 'Mar', value: 76100 },
              { name: 'Kwi', value: 80900 },
              { name: 'Maj', value: 87200 },
              { name: 'Cze', value: 96300 },
              { name: 'Lip', value: 95700 },
              { name: 'Sie', value: 88200 },
              { name: 'Wrz', value: 85800 },
              { name: 'Paź', value: 76100 },
              { name: 'Lis', value: 70900 },
              { name: 'Gru', value: 67200 }
            ],
            inspections: [
              { name: 'Sty', value: 210 },
              { name: 'Lut', value: 195 },
              { name: 'Mar', value: 230 },
              { name: 'Kwi', value: 242 },
              { name: 'Maj', value: 265 },
              { name: 'Cze', value: 290 },
              { name: 'Lip', value: 285 },
              { name: 'Sie', value: 260 },
              { name: 'Wrz', value: 252 },
              { name: 'Paź', value: 225 },
              { name: 'Lis', value: 210 },
              { name: 'Gru', value: 195 }
            ],
            combined: [
              { name: 'Sty', kontrole: 210, przychód: 68200, śrKoszt: 325 },
              { name: 'Lut', kontrole: 195, przychód: 65800, śrKoszt: 337 },
              { name: 'Mar', kontrole: 230, przychód: 76100, śrKoszt: 331 },
              { name: 'Kwi', kontrole: 242, przychód: 80900, śrKoszt: 334 },
              { name: 'Maj', kontrole: 265, przychód: 87200, śrKoszt: 329 },
              { name: 'Cze', kontrole: 290, przychód: 96300, śrKoszt: 332 },
              { name: 'Lip', kontrole: 285, przychód: 95700, śrKoszt: 336 },
              { name: 'Sie', kontrole: 260, przychód: 88200, śrKoszt: 339 },
              { name: 'Wrz', kontrole: 252, przychód: 85800, śrKoszt: 340 },
              { name: 'Paź', kontrole: 225, przychód: 76100, śrKoszt: 338 },
              { name: 'Lis', kontrole: 210, przychód: 70900, śrKoszt: 337 },
              { name: 'Gru', kontrole: 195, przychód: 67200, śrKoszt: 345 }
            ]
          };
        default:
          return { income: [], inspections: [], combined: [] };
      }
    }
  };
  
  const chartData = getChartData();
  
  // Funkcja renderująca wybrany typ wykresu
  const renderChart = () => {
    switch (chartType) {
      case 'area':
        return (
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={type === 'property' ? chartData.combined : chartData.combined}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorPrzychód" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={gradientColors.income[0]} stopOpacity={0.8}/>
                    <stop offset="95%" stopColor={gradientColors.income[1]} stopOpacity={0.2}/>
                  </linearGradient>
                  <linearGradient id="colorKoszt" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={gradientColors.expenses[0]} stopOpacity={0.8}/>
                    <stop offset="95%" stopColor={gradientColors.expenses[1]} stopOpacity={0.2}/>
                  </linearGradient>
                  {type === 'property' ? (
                    <linearGradient id="colorZysk" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={gradientColors.occupancy[0]} stopOpacity={0.8}/>
                      <stop offset="95%" stopColor={gradientColors.occupancy[1]} stopOpacity={0.2}/>
                    </linearGradient>
                  ) : (
                    <linearGradient id="colorŚrKoszt" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#FF6B6B" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#FFACB6" stopOpacity={0.2}/>
                    </linearGradient>
                  )}
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#444' : '#eee'} />
                <XAxis dataKey="name" stroke={darkMode ? '#ccc' : '#666'} />
                <YAxis stroke={darkMode ? '#ccc' : '#666'} />
                <Tooltip contentStyle={{ background: darkMode ? '#333' : '#fff' }} />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="przychód" 
                  stroke={gradientColors.income[0]} 
                  fillOpacity={1} 
                  fill="url(#colorPrzychód)" 
                />
                <Area 
                  type="monotone" 
                  dataKey={type === 'property' ? "koszt" : "kontrole"} 
                  stroke={gradientColors.expenses[0]} 
                  fillOpacity={1} 
                  fill="url(#colorKoszt)" 
                />
                <Area 
                  type="monotone" 
                  dataKey={type === 'property' ? "zysk" : "śrKoszt"} 
                  stroke={type === 'property' ? gradientColors.occupancy[0] : "#FF6B6B"} 
                  fillOpacity={1} 
                  fill={type === 'property' ? "url(#colorZysk)" : "url(#colorŚrKoszt)"} 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        );
        
      case 'line':
        return (
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={type === 'property' ? chartData.combined : chartData.combined}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#444' : '#eee'} />
                <XAxis dataKey="name" stroke={darkMode ? '#ccc' : '#666'} />
                <YAxis stroke={darkMode ? '#ccc' : '#666'} />
                <Tooltip contentStyle={{ background: darkMode ? '#333' : '#fff' }} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="przychód" 
                  stroke={COLORS[0]} 
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6, strokeWidth: 2 }}
                />
                <Line 
                  type="monotone" 
                  dataKey={type === 'property' ? "koszt" : "kontrole"} 
                  stroke={COLORS[1]} 
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6, strokeWidth: 2 }}
                />
                <Line 
                  type="monotone" 
                  dataKey={type === 'property' ? "zysk" : "śrKoszt"} 
                  stroke={COLORS[2]} 
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6, strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        );
        
      case 'bar':
        return (
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={type === 'property' ? chartData.combined : chartData.combined}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#444' : '#eee'} />
                <XAxis dataKey="name" stroke={darkMode ? '#ccc' : '#666'} />
                <YAxis stroke={darkMode ? '#ccc' : '#666'} />
                <Tooltip contentStyle={{ background: darkMode ? '#333' : '#fff' }} />
                <Legend />
                <Bar 
                  dataKey="przychód" 
                  fill={COLORS[0]} 
                  radius={[4, 4, 0, 0]}
                />
                <Bar 
                  dataKey={type === 'property' ? "koszt" : "kontrole"} 
                  fill={COLORS[1]} 
                  radius={[4, 4, 0, 0]}
                />
                <Bar 
                  dataKey={type === 'property' ? "zysk" : "śrKoszt"} 
                  fill={COLORS[2]} 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        );
        
      case 'composed':
        return (
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={type === 'property' ? chartData.combined : chartData.combined}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#444' : '#eee'} />
                <XAxis dataKey="name" stroke={darkMode ? '#ccc' : '#666'} />
                <YAxis stroke={darkMode ? '#ccc' : '#666'} />
                <Tooltip contentStyle={{ background: darkMode ? '#333' : '#fff' }} />
                <Legend />
                <Bar 
                  dataKey={type === 'property' ? "przychód" : "kontrole"} 
                  fill={COLORS[0]} 
                  radius={[4, 4, 0, 0]}
                />
                <Line 
                  type="monotone" 
                  dataKey={type === 'property' ? "koszt" : "przychód"} 
                  stroke={COLORS[1]} 
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey={type === 'property' ? "zysk" : "śrKoszt"}
                  fill={COLORS[2]}
                  stroke={COLORS[2]}
                  fillOpacity={0.3}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        );
        
      case 'radar':
        const radarData = type === 'property' 
          ? [
              { subject: 'Przychód', A: 120, B: 110, fullMark: 150 },
              { subject: 'Koszty', A: 98, B: 90, fullMark: 150 },
              { subject: 'Zysk', A: 86, B: 75, fullMark: 150 },
              { subject: 'Wynajęte', A: 99, B: 82, fullMark: 150 },
              { subject: 'Dostępne', A: 85, B: 95, fullMark: 150 },
              { subject: 'W remoncie', A: 65, B: 85, fullMark: 150 },
            ]
          : [
              { subject: 'Przychód', A: 120, B: 110, fullMark: 150 },
              { subject: 'Kontrole', A: 98, B: 90, fullMark: 150 },
              { subject: 'Zgłoszenia CEEB', A: 86, B: 75, fullMark: 150 },
              { subject: 'Wyniki poz.', A: 99, B: 82, fullMark: 150 },
              { subject: 'Wyniki neg.', A: 85, B: 95, fullMark: 150 },
              { subject: 'Śr. koszt', A: 65, B: 85, fullMark: 150 },
            ];
          
        return (
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart outerRadius={120} data={radarData}>
                <PolarGrid stroke={darkMode ? '#444' : '#eee'} />
                <PolarAngleAxis dataKey="subject" stroke={darkMode ? '#ccc' : '#666'} />
                <PolarRadiusAxis angle={30} domain={[0, 150]} stroke={darkMode ? '#ccc' : '#666'} />
                <Radar name="Bieżący okres" dataKey="A" stroke={COLORS[0]} fill={COLORS[0]} fillOpacity={0.6} />
                <Radar name="Poprzedni okres" dataKey="B" stroke={COLORS[1]} fill={COLORS[1]} fillOpacity={0.6} />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        );
        
      case 'distribution':
        const distributionData = type === 'property'
          ? [
              { name: 'Przychód z wynajmu', value: 75 },
              { name: 'Przychód z usług', value: 15 },
              { name: 'Przychód z opłat', value: 10 },
            ]
          : [
              { name: 'Przychód z kontroli', value: 65 },
              { name: 'Przychód z napraw', value: 20 },
              { name: 'Przychód z certyfikacji', value: 15 },
            ];
        
        return (
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={distributionData}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {distributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: darkMode ? '#333' : '#fff' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        );
        
      default:
        return <div>Nieznany typ wykresu</div>;
    }
  };

  return (
    <Card darkMode={darkMode} className="overflow-hidden">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-semibold">Zaawansowana analiza danych</h3>
        <div className="flex space-x-1">
          <Button 
            size="sm"
            variant={timeRange === 'week' ? 'primary' : 'outline'} 
            onClick={() => setTimeRange('week')}
          >
            Tydzień
          </Button>
          <Button 
            size="sm"
            variant={timeRange === 'month' ? 'primary' : 'outline'} 
            onClick={() => setTimeRange('month')}
          >
            Miesiąc
          </Button>
          <Button 
            size="sm"
            variant={timeRange === 'year' ? 'primary' : 'outline'} 
            onClick={() => setTimeRange('year')}
          >
            Rok
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-3 md:grid-cols-6 gap-2 mb-6">
        <Button 
          size="sm"
          variant={chartType === 'area' ? 'primary' : 'outline'} 
          onClick={() => setChartType('area')}
          fullWidth
        >
          Obszar
        </Button>
        <Button 
          size="sm"
          variant={chartType === 'line' ? 'primary' : 'outline'} 
          onClick={() => setChartType('line')}
          fullWidth
        >
          Linie
        </Button>
        <Button 
          size="sm"
          variant={chartType === 'bar' ? 'primary' : 'outline'} 
          onClick={() => setChartType('bar')}
          fullWidth
        >
          Słupki
        </Button>
        <Button 
          size="sm"
          variant={chartType === 'composed' ? 'primary' : 'outline'} 
          onClick={() => setChartType('composed')}
          fullWidth
        >
          Mix
        </Button>
        <Button 
          size="sm"
          variant={chartType === 'radar' ? 'primary' : 'outline'} 
          onClick={() => setChartType('radar')}
          fullWidth
        >
          Radar
        </Button>
        <Button 
          size="sm"
          variant={chartType === 'distribution' ? 'primary' : 'outline'} 
          onClick={() => setChartType('distribution')}
          fullWidth
        >
          Dystrybucja
        </Button>
      </div>
      
      {renderChart()}
      
      <div className="mt-6 text-gray-500 text-sm">
        {type === 'property' 
          ? 'Analiza pokazuje trendy przychodów, kosztów i zysków w wybranym okresie czasu.'
          : 'Analiza pokazuje relacje między liczbą kontroli, przychodami i średnimi kosztami w wybranym okresie.'
        }
      </div>
    </Card>
  );
};

export default AdvancedCharts;