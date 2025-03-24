import React, { useState, useEffect } from 'react';
import { Calendar, TrendingUp, AlertTriangle, BrainCircuit, BarChart2, Clock, Lightbulb } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

// Advanced AI predictor component for forecasting inspection trends and providing recommendations
const AIMapPredictor = ({ inspectionData, regionData, selectedRegion, darkMode }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [prediction, setPrediction] = useState(null);
  const [recommendation, setRecommendation] = useState(null);
  const [confidenceLevel, setConfidenceLevel] = useState(0);
  
  // Generate predictions when data or selected region changes
  useEffect(() => {
    if (!inspectionData || inspectionData.length === 0) return;
    
    setIsLoading(true);
    
    // Simulate AI processing time
    const timer = setTimeout(() => {
      generatePredictions();
      setIsLoading(false);
    }, 1200);
    
    return () => clearTimeout(timer);
  }, [inspectionData, selectedRegion]);
  
  // Generate AI predictions and recommendations based on inspection data
  const generatePredictions = () => {
    // In a real app, this would call a machine learning model or API
    // For this demo, we'll simulate predictions
    
    // Calculate total inspections per region
    const regionCounts = {};
    inspectionData.forEach(inspection => {
      const regionId = getRegionIdFromCity(inspection.city);
      if (!regionCounts[regionId]) regionCounts[regionId] = 0;
      regionCounts[regionId]++;
    });
    
    // Calculate inspection trends per month
    const monthlyTrends = {};
    inspectionData.forEach(inspection => {
      const month = inspection.date.split('.')[1]; // Extract month from date (format: DD.MM.YYYY)
      if (!monthlyTrends[month]) monthlyTrends[month] = 0;
      monthlyTrends[month]++;
    });
    
    // Calculate result percentages
    const totalInspections = inspectionData.length;
    const positiveResults = inspectionData.filter(i => i.result === 'Pozytywny').length;
    const negativeResults = inspectionData.filter(i => i.result === 'Negatywny').length;
    const conditionalResults = inspectionData.filter(i => i.result === 'Warunkowy').length;
    
    const positivePercentage = (positiveResults / totalInspections * 100).toFixed(1);
    const negativePercentage = (negativeResults / totalInspections * 100).toFixed(1);
    const conditionalPercentage = (conditionalResults / totalInspections * 100).toFixed(1);
    
    // Generate next month prediction
    const predictedInspections = Math.floor(totalInspections * (0.9 + Math.random() * 0.3));
    
    // Generate random confidence level between 75% and 95%
    const confidence = 75 + Math.floor(Math.random() * 20);
    setConfidenceLevel(confidence);
    
    // Create prediction object
    const newPrediction = {
      nextMonthTotal: predictedInspections,
      nextMonthPositive: Math.floor(predictedInspections * (positiveResults / totalInspections)),
      nextMonthNegative: Math.floor(predictedInspections * (negativeResults / totalInspections)),
      regionTrend: null,
      seasonalFactor: getSeasonalFactor(),
      inspectionTypeDistribution: {
        'Przewód dymowy': Math.floor(Math.random() * 40 + 20),
        'Przewód spalinowy': Math.floor(Math.random() * 30 + 15),
        'Przewód wentylacyjny': Math.floor(Math.random() * 30 + 15),
        'Instalacja gazowa': Math.floor(Math.random() * 20 + 10)
      }
    };
    
    // Add region-specific trend if a region is selected
    if (selectedRegion) {
      // Growth percentage (random between -15% and +30%)
      const growthPercentage = -15 + Math.floor(Math.random() * 45);
      newPrediction.regionTrend = {
        region: selectedRegion,
        growthPercentage: growthPercentage,
        isGrowing: growthPercentage > 0
      };
    }
    
    setPrediction(newPrediction);
    
    // Generate recommendations based on predictions
    const recommendations = [];
    
    // Add general recommendation based on negative results percentage
    if (negativePercentage > 25) {
      recommendations.push({
        type: 'warning',
        title: 'Wysoki odsetek negatywnych wyników',
        description: `Odsetek negatywnych wyników (${negativePercentage}%) jest niepokojąco wysoki. Zalecamy zwiększenie częstotliwości kontroli prewencyjnych.`,
        icon: <AlertTriangle size={18} className="text-red-500" />
      });
    }
    
    // Add season-based recommendation
    const seasonalRecommendation = getSeasonalRecommendation(newPrediction.seasonalFactor);
    recommendations.push(seasonalRecommendation);
    
    // Add region-specific recommendation if a region is selected
    if (selectedRegion && newPrediction.regionTrend) {
      const trend = newPrediction.regionTrend;
      if (trend.isGrowing && trend.growthPercentage > 15) {
        recommendations.push({
          type: 'action',
          title: `Rosnące zapotrzebowanie w ${selectedRegion}`,
          description: `Prognozowany wzrost liczby kontroli o ${trend.growthPercentage}% w tym regionie. Zalecamy zwiększenie liczby techników w tym obszarze.`,
          icon: <TrendingUp size={18} className="text-blue-500" />
        });
      }
    }
    
    // Add inspection type recommendation based on distribution
    const maxType = Object.entries(newPrediction.inspectionTypeDistribution)
      .reduce((a, b) => a[1] > b[1] ? a : b);
    
    recommendations.push({
      type: 'insight',
      title: 'Dominujący typ kontroli',
      description: `Przewidujemy, że ${maxType[0]} będzie dominującym typem kontroli (${maxType[1]}% wszystkich kontroli). Upewnij się, że zespół posiada odpowiednie kwalifikacje w tym zakresie.`,
      icon: <Lightbulb size={18} className="text-yellow-500" />
    });
    
    setRecommendation(recommendations);
  };
  
  // Helper function to determine seasonal factor based on current month
  const getSeasonalFactor = () => {
    const currentMonth = new Date().getMonth() + 1; // 1-12
    
    if (currentMonth >= 10 || currentMonth <= 2) {
      return 'winter'; // October to February
    } else if (currentMonth >= 3 && currentMonth <= 5) {
      return 'spring'; // March to May
    } else if (currentMonth >= 6 && currentMonth <= 9) {
      return 'summer'; // June to September
    }
    
    return 'unknown';
  };
  
  // Helper function to get region ID from city (simplified mapping function)
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
  
  // Get seasonal recommendation based on detected season
  const getSeasonalRecommendation = (season) => {
    switch (season) {
      case 'winter':
        return {
          type: 'season',
          title: 'Sezon zimowy - zwiększone ryzyko',
          description: 'W sezonie grzewczym wzrasta ryzyko zatruć tlenkiem węgla. Priorytetyzuj kontrole przewodów spalinowych i dymowych.',
          icon: <Calendar size={18} className="text-blue-500" />
        };
      case 'spring':
        return {
          type: 'season',
          title: 'Sezon wiosenny - czas na konserwację',
          description: 'Wiosna to idealny moment na kontrole po sezonie grzewczym. Skup się na konserwacji i naprawach.',
          icon: <Calendar size={18} className="text-green-500" />
        };
      case 'summer':
        return {
          type: 'season',
          title: 'Sezon letni - czas na modernizacje',
          description: 'Lato to dobry czas na kontrole pod kątem modernizacji. Zwróć uwagę na przewody wentylacyjne w budynkach wielorodzinnych.',
          icon: <Calendar size={18} className="text-yellow-500" />
        };
      default:
        return {
          type: 'general',
          title: 'Rekomendacja ogólna',
          description: 'Regularnie przeprowadzaj kontrole we wszystkich obszarach z uwzględnieniem specyfiki danego regionu.',
          icon: <Lightbulb size={18} className="text-gray-500" />
        };
    }
  };

  return (
    <Card darkMode={darkMode} className="bg-gradient-to-r from-red-50 to-indigo-50 dark:from-red-900 dark:to-indigo-900 dark:bg-opacity-20">
      <div className="flex items-start">
        <BrainCircuit size={24} className="mr-3 text-red-500 flex-shrink-0 mt-1" />
        <div className="flex-1">
          <h3 className="font-semibold flex items-center">
            <span>AI Predictor</span>
            <span className="ml-2 px-2 py-0.5 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 text-xs rounded-full">
              Beta
            </span>
          </h3>
          
          {isLoading ? (
            <div className="flex items-center justify-center p-6">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
              <span className="ml-2">Analizowanie danych i generowanie predykcji...</span>
            </div>
          ) : prediction ? (
            <div className="mt-4 space-y-4">
              {/* Prediction header */}
              <div className="flex items-center justify-between">
                <h4 className="font-medium flex items-center">
                  <Clock size={16} className="mr-1 text-blue-500" />
                  Prognoza na następny miesiąc
                </h4>
                <div className="text-sm px-2 py-1 bg-blue-100 dark:bg-blue-900 dark:bg-opacity-30 text-blue-800 dark:text-blue-200 rounded">
                  Pewność: {confidenceLevel}%
                </div>
              </div>
              
              {/* Prediction stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-2">
                <div className="p-3 rounded-lg bg-white dark:bg-gray-800 bg-opacity-60 dark:bg-opacity-30">
                  <div className="text-sm text-gray-500">Liczba kontroli</div>
                  <div className="text-xl font-bold">{prediction.nextMonthTotal}</div>
                </div>
                
                <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900 dark:bg-opacity-30">
                  <div className="text-sm text-gray-500">Przewidywane pozytywne</div>
                  <div className="text-xl font-bold text-green-600 dark:text-green-400">
                    {prediction.nextMonthPositive}
                  </div>
                </div>
                
                <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900 dark:bg-opacity-30">
                  <div className="text-sm text-gray-500">Przewidywane negatywne</div>
                  <div className="text-xl font-bold text-red-600 dark:text-red-400">
                    {prediction.nextMonthNegative}
                  </div>
                </div>
              </div>
              
              {/* Region trend if available */}
              {prediction.regionTrend && (
                <div className={`p-3 rounded-lg ${
                  prediction.regionTrend.isGrowing 
                    ? 'bg-blue-50 dark:bg-blue-900 dark:bg-opacity-30' 
                    : 'bg-amber-50 dark:bg-amber-900 dark:bg-opacity-30'
                }`}>
                  <h4 className="font-medium flex items-center">
                    <TrendingUp size={16} className={`mr-1 ${
                      prediction.regionTrend.isGrowing 
                        ? 'text-blue-500' 
                        : 'text-amber-500'
                    }`} />
                    Trend dla obszaru: {prediction.regionTrend.region}
                  </h4>
                  <p className="mt-1">
                    {prediction.regionTrend.isGrowing 
                      ? `Przewidywany wzrost o ${prediction.regionTrend.growthPercentage}% w liczbie kontroli.` 
                      : `Przewidywany spadek o ${Math.abs(prediction.regionTrend.growthPercentage)}% w liczbie kontroli.`
                    }
                  </p>
                </div>
              )}
              
              {/* Type distribution */}
              <div>
                <h4 className="font-medium mb-2 flex items-center">
                  <BarChart2 size={16} className="mr-1 text-purple-500" />
                  Prognozowany rozkład typów kontroli
                </h4>
                
                <div className="space-y-2">
                  {Object.entries(prediction.inspectionTypeDistribution).map(([type, percentage]) => (
                    <div key={type} className="flex items-center">
                      <div 
                        className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 mr-2"
                        style={{ maxWidth: '70%' }}
                      >
                        <div 
                          className="bg-purple-500 h-4 rounded-full"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between" style={{ width: '30%' }}>
                        <span>{type}</span>
                        <span className="font-medium">{percentage}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Recommendations */}
              <div className="mt-4">
                <h4 className="font-medium mb-2">Rekomendacje AI</h4>
                
                <div className="space-y-3">
                  {recommendation && recommendation.map((rec, index) => (
                    <div 
                      key={index} 
                      className={`p-3 rounded-lg ${
                        rec.type === 'warning' 
                          ? 'bg-red-50 dark:bg-red-900 dark:bg-opacity-30'
                          : rec.type === 'action'
                            ? 'bg-blue-50 dark:bg-blue-900 dark:bg-opacity-30'
                            : rec.type === 'season'
                              ? 'bg-amber-50 dark:bg-amber-900 dark:bg-opacity-30'
                              : 'bg-gray-50 dark:bg-gray-800 dark:bg-opacity-50'
                      }`}
                    >
                      <div className="flex items-center mb-1">
                        {rec.icon}
                        <h5 className="font-medium ml-1">{rec.title}</h5>
                      </div>
                      <p className="text-sm">{rec.description}</p>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="text-xs text-gray-500 mt-2">
                Wygenerowano na podstawie analizy {inspectionData.length} kontroli z wykorzystaniem sztucznej inteligencji.
              </div>
            </div>
          ) : (
            <p className="p-4 text-center text-gray-500">
              Nie można wygenerować predykcji. Sprawdź dane wejściowe.
            </p>
          )}
        </div>
      </div>
    </Card>
  );
};

export default AIMapPredictor;