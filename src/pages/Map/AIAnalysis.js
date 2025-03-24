import React, { useState, useEffect } from 'react';
import { BrainCircuit, BarChart2, TrendingUp, AlertTriangle, CheckCircle, Zap, Calendar, MapPin, Filter } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

// AI Analysis component for providing intelligent insights on inspection data
const AIAnalysis = ({ data, darkMode, selectedRegion, regionData }) => {
  const [analysisType, setAnalysisType] = useState('patterns');
  const [isLoading, setIsLoading] = useState(true);
  const [insights, setInsights] = useState([]);
  
  // Generate AI insights when data changes or selected region changes
  useEffect(() => {
    // Simulate loading time for AI analysis
    setIsLoading(true);
    
    const timer = setTimeout(() => {
      generateInsights();
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [data, selectedRegion, analysisType]);
  
  // Generate AI insights based on the data and selected analysis type
  const generateInsights = () => {
    // In a real app, this would be a call to a ML model or API
    // For this demo, we'll generate simulated insights
    
    const newInsights = [];
    
    if (analysisType === 'patterns') {
      // Pattern recognition insights
      newInsights.push({
        title: 'Sezonowość kontroli',
        description: 'Wykryto wzorzec sezonowy: liczba kontroli wzrasta o 34% w okresie jesienno-zimowym w porównaniu do wiosenno-letniego.',
        severity: 'info',
        icon: <Calendar size={16} className="text-blue-500" />
      });
      
      if (selectedRegion) {
        const regionInfo = regionData[selectedRegion];
        if (regionInfo && regionInfo.negative > regionInfo.positive * 0.3) {
          newInsights.push({
            title: 'Hotspot problemów',
            description: `Województwo ${selectedRegion} ma nieproporcjonalnie wysoki odsetek wyników negatywnych (${Math.round(regionInfo.negative / regionInfo.count * 100)}%).`,
            severity: 'warning',
            icon: <AlertTriangle size={16} className="text-red-500" />
          });
        }
      }
      
      newInsights.push({
        title: 'Korelacja typu kontroli',
        description: 'Kontrole instalacji gazowych wykazują 2.3x wyższą częstotliwość wyników negatywnych niż kontrole przewodów wentylacyjnych.',
        severity: 'info',
        icon: <BarChart2 size={16} className="text-purple-500" />
      });
    }
    else if (analysisType === 'predictions') {
      // Predictive insights
      const nextMonthPrediction = Math.floor(Math.random() * 40) + 60;
      
      newInsights.push({
        title: 'Predykcja obciążenia',
        description: `Z prawdopodobieństwem 82%, w przyszłym miesiącu będzie potrzeba przeprowadzić ${nextMonthPrediction} kontroli.`,
        severity: 'info',
        icon: <TrendingUp size={16} className="text-green-500" />
      });
      
      if (selectedRegion) {
        newInsights.push({
          title: 'Prognoza geograficzna',
          description: `Przewidywany 28% wzrost zapotrzebowania na kontrole w woj. ${selectedRegion} w ciągu następnych 30 dni.`,
          severity: 'info',
          icon: <MapPin size={16} className="text-indigo-500" />
        });
      }
      
      newInsights.push({
        title: 'Sugestia alokacji zasobów',
        description: 'Na podstawie historycznych danych, zalecamy zwiększenie liczby techników w miastach: Kraków, Warszawa, Gdańsk.',
        severity: 'recommendation',
        icon: <Zap size={16} className="text-amber-500" />
      });
    } 
    else if (analysisType === 'anomalies') {
      // Anomaly detection
      newInsights.push({
        title: 'Nietypowy wzrost negatywnych wyników',
        description: 'Wykryto 43% wzrost negatywnych wyników kontroli przewodów spalinowych w ostatnim kwartale.',
        severity: 'warning',
        icon: <AlertTriangle size={16} className="text-red-500" />
      });
      
      newInsights.push({
        title: 'Odchylenie od trendu',
        description: 'Liczba kontroli w marcu była o 28% niższa niż prognozowano na podstawie trendów historycznych.',
        severity: 'info',
        icon: <TrendingUp size={16} className="text-blue-500" />
      });
      
      if (selectedRegion) {
        const randomFlag = Math.random() > 0.5;
        if (randomFlag) {
          newInsights.push({
            title: 'Anomalia geograficzna',
            description: `Województwo ${selectedRegion} wykazuje 31% więcej kontroli typu "warunkowy" niż średnia krajowa.`,
            severity: 'warning',
            icon: <MapPin size={16} className="text-orange-500" />
          });
        }
      }
    }
    
    // Add general insights if array is empty (fallback)
    if (newInsights.length === 0) {
      newInsights.push({
        title: 'Analiza ogólna',
        description: 'Większość kontroli kończy się wynikiem pozytywnym, co sugeruje dobry stan techniczny instalacji w kraju.',
        severity: 'info',
        icon: <CheckCircle size={16} className="text-green-500" />
      });
    }
    
    setInsights(newInsights);
  };
  
  // Get severity badge styling
  const getSeverityStyle = (severity) => {
    switch(severity) {
      case 'warning':
        return darkMode 
          ? 'bg-red-900 bg-opacity-30 border-red-800 text-red-200' 
          : 'bg-red-50 border-red-200 text-red-800';
      case 'recommendation':
        return darkMode 
          ? 'bg-amber-900 bg-opacity-30 border-amber-800 text-amber-200' 
          : 'bg-amber-50 border-amber-200 text-amber-800';
      case 'success':
        return darkMode 
          ? 'bg-green-900 bg-opacity-30 border-green-800 text-green-200' 
          : 'bg-green-50 border-green-200 text-green-800';
      case 'info':
      default:
        return darkMode 
          ? 'bg-blue-900 bg-opacity-30 border-blue-800 text-blue-200' 
          : 'bg-blue-50 border-blue-200 text-blue-800';
    }
  };

  return (
    <Card darkMode={darkMode} className="bg-gradient-to-r from-red-50 to-indigo-50 dark:from-red-900 dark:to-indigo-900 dark:bg-opacity-20">
      <div className="flex items-start">
        <BrainCircuit size={24} className="mr-3 text-red-500 flex-shrink-0 mt-1" />
        <div className="flex-1">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold">Analityka AI</h3>
            <div className="flex space-x-2">
              <Button 
                size="sm" 
                variant={analysisType === 'patterns' ? 'primary' : 'outline'} 
                color="red"
                onClick={() => setAnalysisType('patterns')}
              >
                Wzorce
              </Button>
              <Button 
                size="sm" 
                variant={analysisType === 'predictions' ? 'primary' : 'outline'} 
                color="red"
                onClick={() => setAnalysisType('predictions')}
              >
                Predykcje
              </Button>
              <Button 
                size="sm" 
                variant={analysisType === 'anomalies' ? 'primary' : 'outline'} 
                color="red"
                onClick={() => setAnalysisType('anomalies')}
              >
                Anomalie
              </Button>
            </div>
          </div>
          
          <div className="mt-4">
            {isLoading ? (
              <div className="flex items-center justify-center p-6">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
                <span className="ml-2">Analizowanie danych...</span>
              </div>
            ) : (
              <>
                <div className="space-y-3">
                  {insights.map((insight, index) => (
                    <div 
                      key={index} 
                      className={`p-3 border rounded-lg ${getSeverityStyle(insight.severity)}`}
                    >
                      <div className="flex items-center mb-1">
                        {insight.icon}
                        <h4 className="font-medium ml-2">{insight.title}</h4>
                      </div>
                      <p>{insight.description}</p>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4 p-3 bg-white bg-opacity-50 dark:bg-gray-800 dark:bg-opacity-50 rounded-lg">
                  <h4 className="font-medium mb-2 flex items-center">
                    <Filter size={16} className="mr-1 text-red-500" />
                    {analysisType === 'patterns' && 'Wykryte wzorce zachowań w danych'}
                    {analysisType === 'predictions' && 'Prognoza oparta na ML i danych historycznych'}
                    {analysisType === 'anomalies' && 'Wykrywanie nietypowych zdarzeń i odchyleń'}
                  </h4>
                  
                  <p className="text-sm">
                    {analysisType === 'patterns' && 
                      'Analiza wzorców wykorzystuje algorytmy ML do identyfikacji powtarzających się schematów w historycznych danych kontroli, takich jak sezonowość, korelacje geograficzne oraz zależności między typami kontroli a ich wynikami.'}
                    {analysisType === 'predictions' && 
                      'Prognozy oparte są na modelach ML trenowanych na danych historycznych z uwzględnieniem czynników sezonowych, trendów i cykli gospodarczych. Dokładność predykcji: 87%.'}
                    {analysisType === 'anomalies' && 
                      'System wykrywania anomalii identyfikuje odchylenia od normalnych wzorców w danych, flagując zdarzenia wymagające szczególnej uwagi lub interwencji.'}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default AIAnalysis;