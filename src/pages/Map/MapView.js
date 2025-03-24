import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Search, Calendar, Filter, AlertTriangle, BarChart2, BrainCircuit, Download, Share2 } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import StatusBadge from '../../components/ui/StatusBadge';
import AIAnalysis from './AIAnalysis';
import MapTooltip from './MapTooltip';
import MapSearch from './MapSearch';
import MapLegend from './MapLegend';
import AIMapPredictor from './AIMapPredictor';

// Poland map coordinates - simplified version for SVG display
const POLAND_REGIONS = [
  { id: 'mazowieckie', name: 'Mazowieckie', path: 'M250,150 L270,130 L300,140 L320,160 L310,190 L280,200 L250,190 L230,170 Z', center: [275, 160] },
  { id: 'malopolskie', name: 'Małopolskie', path: 'M240,240 L270,230 L290,250 L280,270 L250,280 L230,260 Z', center: [260, 255] },
  { id: 'wielkopolskie', name: 'Wielkopolskie', path: 'M170,160 L200,150 L230,170 L220,200 L190,210 L160,190 Z', center: [195, 180] },
  { id: 'dolnoslaskie', name: 'Dolnośląskie', path: 'M130,200 L160,190 L190,210 L180,240 L150,250 L120,230 Z', center: [155, 220] },
  { id: 'pomorskie', name: 'Pomorskie', path: 'M190,80 L220,70 L250,90 L240,120 L210,130 L180,110 Z', center: [215, 100] },
  { id: 'slaskie', name: 'Śląskie', path: 'M220,220 L250,210 L270,230 L260,260 L230,270 L210,250 Z', center: [240, 240] }
];

// AI generated insights
const AI_INSIGHTS = [
  "Obszary z największą liczbą kontroli to Mazowieckie i Śląskie.",
  "Zaobserwowano wzrost negatywnych wyników w regionie Małopolskim o 15% w porównaniu do poprzedniego kwartału.",
  "W województwie Pomorskim 90% budynków ma ogrzewanie gazowe, co wyjaśnia wysoki wskaźnik kontroli przewodów spalinowych.",
  "Najczęstsze usterki w regionie Wielkopolskim to niedrożne przewody wentylacyjne.",
  "Na podstawie danych historycznych, prognozujemy zwiększone zapotrzebowanie na kontrole w Dolnośląskim w nadchodzącym miesiącu."
];

const MapView = ({ data = [], darkMode }) => {
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [filterCity, setFilterCity] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [filterResult, setFilterResult] = useState('all');
  const [filterDateRange, setFilterDateRange] = useState({ start: '', end: '' });
  const [filteredInspections, setFilteredInspections] = useState([]);
  const [showAIInsights, setShowAIInsights] = useState(false);
  const [mapData, setMapData] = useState({});
  const [hoveredRegion, setHoveredRegion] = useState(null);
  const [isExporting, setIsExporting] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [selectedInspection, setSelectedInspection] = useState(null);
  const [legendExpanded, setLegendExpanded] = useState(false);
  const [showPredictions, setShowPredictions] = useState(false);
  const svgRef = useRef(null);

  // Process data to group by regions for the map
  useEffect(() => {
    if (data && data.length > 0) {
      const regionMap = {};
      
      // Initialize all regions
      POLAND_REGIONS.forEach(region => {
        regionMap[region.id] = {
          count: 0,
          positive: 0,
          negative: 0,
          warunkowy: 0,
          types: {},
          inspections: []
        };
      });

      // Assign inspections to regions
      data.forEach(inspection => {
        // In a real app, you would map city/coordinates to region
        // For demo, we'll use a simple mapping
        const regionId = getRegionIdFromCity(inspection.city);
        if (regionId && regionMap[regionId]) {
          regionMap[regionId].count += 1;
          regionMap[regionId].inspections.push(inspection);
          
          // Track result statistics
          if (inspection.result === 'Pozytywny') regionMap[regionId].positive += 1;
          else if (inspection.result === 'Negatywny') regionMap[regionId].negative += 1;
          else if (inspection.result === 'Warunkowy') regionMap[regionId].warunkowy += 1;
          
          // Track inspection types
          if (!regionMap[regionId].types[inspection.type]) {
            regionMap[regionId].types[inspection.type] = 0;
          }
          regionMap[regionId].types[inspection.type] += 1;
        }
      });
      
      setMapData(regionMap);
    }
  }, [data]);

  // Simple mapping function - in a real app, you'd use more sophisticated geolocation
  const getRegionIdFromCity = (city) => {
    const cityToRegionMap = {
      'Warszawa': 'mazowieckie',
      'Kraków': 'malopolskie',
      'Poznań': 'wielkopolskie',
      'Wrocław': 'dolnoslaskie',
      'Gdańsk': 'pomorskie',
      'Katowice': 'slaskie',
      'Łódź': 'mazowieckie'
    };
    return cityToRegionMap[city] || 'mazowieckie'; // Default for demo
  };

  // Apply filters to inspections
  useEffect(() => {
    let filtered = [...data];
    
    // Filter by city
    if (filterCity !== 'all') {
      filtered = filtered.filter(i => i.city === filterCity);
    }
    
    // Filter by inspection type
    if (filterType !== 'all') {
      filtered = filtered.filter(i => i.type === filterType);
    }
    
    // Filter by result
    if (filterResult !== 'all') {
      filtered = filtered.filter(i => i.result === filterResult);
    }
    
    // Filter by date range
    if (filterDateRange.start) {
      const startDate = new Date(filterDateRange.start);
      filtered = filtered.filter(i => {
        const inspDate = new Date(i.date.split('.').reverse().join('-'));
        return inspDate >= startDate;
      });
    }
    
    if (filterDateRange.end) {
      const endDate = new Date(filterDateRange.end);
      filtered = filtered.filter(i => {
        const inspDate = new Date(i.date.split('.').reverse().join('-'));
        return inspDate <= endDate;
      });
    }
    
    setFilteredInspections(filtered);
  }, [data, filterCity, filterType, filterResult, filterDateRange]);

  // Calculate region heat based on inspection count
  const getRegionHeatColor = (regionId) => {
    if (!mapData[regionId]) return 'rgba(229, 231, 235, 0.6)'; // Default light gray
    
    const count = mapData[regionId].count;
    const maxCount = Math.max(...Object.values(mapData).map(r => r.count));
    const minCount = Math.min(...Object.values(mapData).map(r => r.count > 0 ? r.count : Infinity));
    
    if (count === 0) return 'rgba(229, 231, 235, 0.6)';
    
    // Calculate intensity
    const intensity = (count - minCount) / (maxCount - minCount || 1);
    
    // Selected region gets a different color
    if (selectedRegion === regionId) {
      return `rgba(220, 38, 38, ${0.4 + intensity * 0.5})`; // Brighter red
    }
    
    // Hovered region gets a slightly highlighted color
    if (hoveredRegion === regionId) {
      return `rgba(239, 68, 68, ${0.3 + intensity * 0.6})`; // Slightly brighter
    }
    
    return `rgba(239, 68, 68, ${0.2 + intensity * 0.6})`; // Red with opacity based on intensity
  };

  // Reset filters
  const resetFilters = () => {
    setFilterCity('all');
    setFilterType('all');
    setFilterResult('all');
    setFilterDateRange({ start: '', end: '' });
  };

  // Handle region selection
  const handleRegionClick = (regionId) => {
    setSelectedRegion(regionId === selectedRegion ? null : regionId);
  };
  
  // Handle region hover
  const handleRegionHover = (regionId, e) => {
    setHoveredRegion(regionId);
    
    if (e && svgRef.current) {
      // Calculate tooltip position relative to SVG
      const svgRect = svgRef.current.getBoundingClientRect();
      const x = e.clientX - svgRect.left + 10; // add 10px offset
      const y = e.clientY - svgRect.top + 10;
      
      setTooltipPosition({ x, y });
    }
  };
  
  // Handle inspection selection
  const handleInspectionSelect = (inspection) => {
    setSelectedInspection(inspection);
    
    // Find the region for this inspection and select it
    const regionId = getRegionIdFromCity(inspection.city);
    if (regionId) {
      setSelectedRegion(regionId);
    }
    
    // Scroll to the map if needed
    svgRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };
  
  // Handle export map data
  const handleExportData = () => {
    setIsExporting(true);
    
    // Simulate export process
    setTimeout(() => {
      // In a real app, this would generate a CSV/PDF file
      console.log('Exporting map data to CSV/PDF...');
      console.log('Data:', mapData);
      
      const fakeDownloadUrl = '#';
      const link = document.createElement('a');
      link.href = fakeDownloadUrl;
      link.setAttribute('download', 'mapa-kontroli.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setIsExporting(false);
      
      // Show success message
      alert('Dane zostały wyeksportowane do pliku CSV.');
    }, 1500)
  };

  // Calculate point coordinates for each inspection
  const getInspectionPoints = () => {
    if (!selectedRegion) return [];
    
    const region = POLAND_REGIONS.find(r => r.id === selectedRegion);
    if (!region) return [];
    
    // Get inspections for this region
    const inspections = mapData[selectedRegion]?.inspections || [];
    
    // Distribute points around the region center with some randomness
    return inspections.map((inspection, index) => {
      const angle = (index / inspections.length) * Math.PI * 2;
      const radius = 15 + Math.random() * 10;
      const x = region.center[0] + Math.cos(angle) * radius;
      const y = region.center[1] + Math.sin(angle) * radius;
      
      return {
        ...inspection,
        x,
        y
      };
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Mapa kontroli</h2>
        <div className="flex space-x-2">
          <Button 
            color="red" 
            variant="outline"
            className="flex items-center"
            onClick={handleExportData}
            disabled={isExporting}
          >
            <Download size={16} className="mr-2" />
            {isExporting ? 'Eksportowanie...' : 'Eksportuj dane'}
          </Button>
          
          <Button 
            color="red" 
            variant={showPredictions ? "outline" : "primary"}
            className="flex items-center"
            onClick={() => {
              setShowAIInsights(false);
              setShowPredictions(!showPredictions);
            }}
          >
            <BarChart2 size={16} className="mr-2" />
            {showPredictions ? 'Ukryj predykcje' : 'Pokaż predykcje'}
          </Button>
          
          <Button 
            color="red" 
            variant={showAIInsights ? "outline" : "primary"}
            className="flex items-center"
            onClick={() => {
              setShowPredictions(false);
              setShowAIInsights(!showAIInsights);
            }}
          >
            <BrainCircuit size={16} className="mr-2" />
            {showAIInsights ? 'Ukryj analitykę' : 'Analityka AI'}
          </Button>
        </div>
      </div>
      
      {showAIInsights && (
        <AIAnalysis 
          data={data} 
          darkMode={darkMode} 
          selectedRegion={selectedRegion}
          regionData={mapData}
        />
      )}
      
      {showPredictions && (
        <AIMapPredictor 
          inspectionData={data}
          regionData={mapData}
          selectedRegion={selectedRegion}
          darkMode={darkMode}
        />
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters card */}
        <Card darkMode={darkMode}>
          <div className="mb-4">
            <MapSearch 
              data={data} 
              onSelect={handleInspectionSelect} 
              darkMode={darkMode} 
            />
          </div>
          
          <h3 className="font-semibold mb-4 flex items-center">
            <Filter size={20} className="mr-2" />
            Filtry mapy
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-gray-500 mb-1">Miasto</label>
              <select 
                value={filterCity} 
                onChange={(e) => setFilterCity(e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
              >
                <option value="all">Wszystkie miasta</option>
                <option value="Warszawa">Warszawa</option>
                <option value="Kraków">Kraków</option>
                <option value="Poznań">Poznań</option>
                <option value="Wrocław">Wrocław</option>
                <option value="Gdańsk">Gdańsk</option>
                <option value="Katowice">Katowice</option>
                <option value="Łódź">Łódź</option>
              </select>
            </div>
            
            <div>
              <label className="block text-gray-500 mb-1">Typ kontroli</label>
              <select 
                value={filterType} 
                onChange={(e) => setFilterType(e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
              >
                <option value="all">Wszystkie typy</option>
                <option value="Przewód dymowy">Przewód dymowy</option>
                <option value="Przewód spalinowy">Przewód spalinowy</option>
                <option value="Przewód wentylacyjny">Przewód wentylacyjny</option>
                <option value="Instalacja gazowa">Instalacja gazowa</option>
              </select>
            </div>
            
            <div>
              <label className="block text-gray-500 mb-1">Wynik kontroli</label>
              <select 
                value={filterResult} 
                onChange={(e) => setFilterResult(e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
              >
                <option value="all">Wszystkie wyniki</option>
                <option value="Pozytywny">Pozytywny</option>
                <option value="Negatywny">Negatywny</option>
                <option value="Warunkowy">Warunkowy</option>
              </select>
            </div>
            
            <div>
              <label className="block text-gray-500 mb-1">Zakres dat</label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs text-gray-500">Od</label>
                  <input 
                    type="date" 
                    value={filterDateRange.start}
                    onChange={(e) => setFilterDateRange({...filterDateRange, start: e.target.value})}
                    className={`w-full px-3 py-2 border rounded-lg ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500">Do</label>
                  <input 
                    type="date" 
                    value={filterDateRange.end}
                    onChange={(e) => setFilterDateRange({...filterDateRange, end: e.target.value})}
                    className={`w-full px-3 py-2 border rounded-lg ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                  />
                </div>
              </div>
            </div>
            
            <div className="flex space-x-2 pt-2">
              <Button 
                variant="outline" 
                color="red"
                onClick={resetFilters}
                className="flex-1"
              >
                Resetuj
              </Button>
              <Button 
                color="red" 
                className="flex-1"
                onClick={() => {/* Apply filters - already handled by useEffect */}}
              >
                Filtruj
              </Button>
            </div>
          </div>
          
          <div className="mt-6">
            <h4 className="font-medium mb-2">Statystyki mapa</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-500">Wszystkie kontrole:</span>
                <span className="font-medium">{data.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Wyświetlane kontrole:</span>
                <span className="font-medium">{filteredInspections.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Wybrane województwo:</span>
                <span className="font-medium">{selectedRegion ? POLAND_REGIONS.find(r => r.id === selectedRegion)?.name : 'Brak'}</span>
              </div>
            </div>
          </div>
        </Card>
        
        {/* Map and statistics */}
        <div className="lg:col-span-3 space-y-6">
          <Card darkMode={darkMode} className="h-96 relative overflow-hidden">
            {/* Interactive map */}
            <svg 
              ref={svgRef}
              viewBox="0 0 400 300" 
              className="w-full h-full"
              style={{ background: darkMode ? '#1F2937' : '#f8fafc' }}
            >
              {/* Background */}
              <rect x="0" y="0" width="400" height="300" fill={darkMode ? '#1F2937' : '#f8fafc'} />
              
              {/* Render regions */}
              {POLAND_REGIONS.map(region => (
                <path
                  key={region.id}
                  d={region.path}
                  fill={getRegionHeatColor(region.id)}
                  stroke={darkMode ? '#4B5563' : '#D1D5DB'}
                  strokeWidth="1"
                  onClick={() => handleRegionClick(region.id)}
                  onMouseEnter={(e) => handleRegionHover(region.id, e)}
                  onMouseLeave={() => handleRegionHover(null)}
                  className="cursor-pointer hover:opacity-80 transition-all duration-200"
                  data-tooltip={`${region.name}: ${mapData[region.id]?.count || 0} kontroli`}
                />
              ))}
              
              {/* Render region labels */}
              {POLAND_REGIONS.map(region => (
                <text
                  key={`label-${region.id}`}
                  x={region.center[0]}
                  y={region.center[1]}
                  textAnchor="middle"
                  fontSize={selectedRegion === region.id || hoveredRegion === region.id ? "10" : "8"}
                  fontWeight={selectedRegion === region.id ? "bold" : "normal"}
                  fill={darkMode ? '#E5E7EB' : '#4B5563'}
                  pointerEvents="none"
                  className="transition-all duration-200"
                >
                  {region.name}
                  {(selectedRegion === region.id || hoveredRegion === region.id) && 
                    mapData[region.id] && (
                    <tspan x={region.center[0]} y={region.center[1] + 12} fontSize="7">
                      {mapData[region.id].count} kontroli
                    </tspan>
                  )}
                </text>
              ))}
              
              {/* Render inspection points for selected region */}
              {getInspectionPoints().map((point, i) => (
                <circle
                  key={`point-${i}`}
                  cx={point.x}
                  cy={point.y}
                  r="3"
                  fill={
                    point.result === 'Pozytywny' ? '#10B981' : 
                    point.result === 'Negatywny' ? '#EF4444' : 
                    '#F59E0B'
                  }
                  stroke="#FFF"
                  strokeWidth="1"
                  className="cursor-pointer hover:r-4 transition-all"
                  title={`${point.type} - ${point.address}`}
                />
              ))}
              
              {/* Map legend */}
              <g transform="translate(10, 260)">
                <rect x="0" y="0" width="12" height="12" fill="rgba(239, 68, 68, 0.8)" />
                <text x="16" y="10" fontSize="10" fill={darkMode ? '#E5E7EB' : '#4B5563'}>Wysoka liczba kontroli</text>
                
                <rect x="0" y="18" width="12" height="12" fill="rgba(239, 68, 68, 0.2)" />
                <text x="16" y="28" fontSize="10" fill={darkMode ? '#E5E7EB' : '#4B5563'}>Niska liczba kontroli</text>
              </g>
              
              {/* Inspection points legend */}
              <g transform="translate(150, 260)">
                <circle cx="6" cy="6" r="4" fill="#10B981" />
                <text x="16" y="10" fontSize="10" fill={darkMode ? '#E5E7EB' : '#4B5563'}>Pozytywny</text>
                
                <circle cx="86" cy="6" r="4" fill="#EF4444" />
                <text x="96" y="10" fontSize="10" fill={darkMode ? '#E5E7EB' : '#4B5563'}>Negatywny</text>
                
                <circle cx="166" cy="6" r="4" fill="#F59E0B" />
                <text x="176" y="10" fontSize="10" fill={darkMode ? '#E5E7EB' : '#4B5563'}>Warunkowy</text>
              </g>
            </svg>
            
            {/* Map tooltip for hovering over regions */}
            {hoveredRegion && (
              <MapTooltip 
                region={POLAND_REGIONS.find(r => r.id === hoveredRegion)}
                regionData={mapData}
                visible={!!hoveredRegion}
                position={tooltipPosition}
                darkMode={darkMode}
              />
            )}
            
            {/* Map overlay instructions */}
            {!selectedRegion && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="bg-white dark:bg-gray-800 bg-opacity-70 dark:bg-opacity-70 rounded-lg p-4 shadow">
                  <p className="text-center">Wybierz województwo, aby zobaczyć szczegółowe dane</p>
                </div>
              </div>
            )}
            
            {/* Loader overlay */}
            {data.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center bg-white dark:bg-gray-800 bg-opacity-80 dark:bg-opacity-80">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-red-500 mx-auto"></div>
                  <p className="mt-2">Ładowanie danych mapy...</p>
                </div>
              </div>
            )}
          </Card>
          
          {/* Selected region details */}
          <Card darkMode={darkMode}>
            <h3 className="font-semibold mb-4">
              {selectedRegion 
                ? `Statystyki dla województwa: ${POLAND_REGIONS.find(r => r.id === selectedRegion)?.name}` 
                : 'Statystyki dla wybranego obszaru'}
            </h3>
            
            {selectedRegion ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-lg bg-gray-100 dark:bg-gray-700">
                    <h4 className="text-sm text-gray-500">Liczba kontroli</h4>
                    <p className="text-2xl font-bold">{mapData[selectedRegion]?.count || 0}</p>
                  </div>
                  
                  <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900 dark:bg-opacity-30">
                    <h4 className="text-sm text-gray-500">Wyniki pozytywne</h4>
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {mapData[selectedRegion]?.positive || 0}
                      <span className="text-sm font-normal ml-1">
                        ({Math.round((mapData[selectedRegion]?.positive || 0) / (mapData[selectedRegion]?.count || 1) * 100)}%)
                      </span>
                    </p>
                  </div>
                  
                  <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900 dark:bg-opacity-30">
                    <h4 className="text-sm text-gray-500">Wyniki negatywne</h4>
                    <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                      {mapData[selectedRegion]?.negative || 0}
                      <span className="text-sm font-normal ml-1">
                        ({Math.round((mapData[selectedRegion]?.negative || 0) / (mapData[selectedRegion]?.count || 1) * 100)}%)
                      </span>
                    </p>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Podział kontroli wg typu</h4>
                  {mapData[selectedRegion]?.types && Object.keys(mapData[selectedRegion].types).length > 0 ? (
                    <div className="space-y-2">
                      {Object.entries(mapData[selectedRegion].types).map(([type, count]) => (
                        <div key={type} className="flex items-center">
                          <div 
                            className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 mr-2"
                            style={{ maxWidth: '70%' }}
                          >
                            <div 
                              className="bg-red-500 h-4 rounded-full"
                              style={{ width: `${Math.round(count / mapData[selectedRegion].count * 100)}%` }}
                            ></div>
                          </div>
                          <div className="flex justify-between" style={{ width: '30%' }}>
                            <span>{type}</span>
                            <span className="font-medium">{count}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">Brak danych o typach kontroli</p>
                  )}
                </div>
                
                {/* Recent inspections in this region */}
                <div>
                  <h4 className="font-medium mb-2">Ostatnie kontrole w tym regionie</h4>
                  {mapData[selectedRegion]?.inspections?.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="min-w-full">
                        <thead>
                          <tr className={darkMode ? 'border-b border-gray-700' : 'border-b'}>
                            <th className="text-left py-2">Adres</th>
                            <th className="text-left py-2">Typ</th>
                            <th className="text-left py-2">Data</th>
                            <th className="text-left py-2">Wynik</th>
                          </tr>
                        </thead>
                        <tbody>
                          {mapData[selectedRegion].inspections.slice(0, 5).map((inspection, idx) => (
                            <tr key={idx} className={darkMode ? 'border-b border-gray-700' : 'border-b'}>
                              <td className="py-2">{inspection.address}</td>
                              <td className="py-2">{inspection.type}</td>
                              <td className="py-2">{inspection.date}</td>
                              <td className="py-2">
                                <StatusBadge 
                                  status={inspection.result} 
                                  color={
                                    inspection.result === 'Pozytywny' ? 'green' : 
                                    inspection.result === 'Negatywny' ? 'red' : 'yellow'
                                  } 
                                />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-gray-500">Brak danych o kontrolach</p>
                  )}
                </div>
                
                {/* AI recommendation */}
                <div className="p-4 border border-red-200 dark:border-red-800 rounded-lg bg-red-50 dark:bg-red-900 dark:bg-opacity-20">
                  <div className="flex items-center">
                    <BrainCircuit size={20} className="mr-2 text-red-500" />
                    <h4 className="font-medium">Rekomendacja AI</h4>
                  </div>
                  <p className="mt-2">
                    {mapData[selectedRegion]?.negative > (mapData[selectedRegion]?.positive || 0) / 3 ? (
                      <span className="flex items-start">
                        <AlertTriangle size={16} className="mr-2 text-red-500 flex-shrink-0 mt-1" />
                        <span>Wysoki odsetek negatywnych wyników sugeruje potrzebę zwiększenia częstotliwości kontroli w tym województwie.</span>
                      </span>
                    ) : (
                      <span>Analiza trendów wskazuje na dobry stan techniczny przewodów w tym województwie. Zalecamy utrzymanie standardowego harmonogramu kontroli.</span>
                    )}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-gray-500">Wybierz region na mapie, aby zobaczyć szczegółowe statystyki.</p>
            )}
          </Card>
          <div className="mt-4 flex items-center justify-center">
            <Button 
              size="sm"
              variant="outline" 
              color="red"
              onClick={() => handleExportData()}
              disabled={isExporting}
              className="flex items-center mr-2"
            >
              <Share2 size={16} className="mr-2" />
              {isExporting ? 'Eksportowanie...' : 'Udostępnij mapę'}
            </Button>
            <span className="mx-2 text-gray-500">|</span>
            <a 
              href="#" 
              onClick={(e) => {
                e.preventDefault();
                setLegendExpanded(!legendExpanded);
              }}
              className="text-red-500 hover:text-red-600 text-sm underline"
            >
              {legendExpanded ? 'Ukryj legendę' : 'Pokaż legendę'}
            </a>
          </div>
          
          {legendExpanded && (
            <div className="mt-4">
              <MapLegend 
                darkMode={darkMode} 
                expanded={true} 
                onToggle={() => setLegendExpanded(!legendExpanded)} 
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MapView;