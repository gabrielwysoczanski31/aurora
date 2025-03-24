import React from 'react';
import { Info, Map, ChevronRight, ChevronDown } from 'lucide-react';

// Legend component for the map view explaining colors and icons
const MapLegend = ({ darkMode, expanded = false, onToggle }) => {
  return (
    <div className={`border rounded-lg ${
      darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
    }`}>
      <div 
        className="p-3 flex justify-between items-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        onClick={onToggle}
      >
        <div className="flex items-center">
          <Info size={16} className="mr-2 text-red-500" />
          <h3 className="font-medium">Legenda mapy</h3>
        </div>
        {expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
      </div>
      
      {expanded && (
        <div className="p-3 pt-0 border-t dark:border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium mb-2">Intensywność kolorów</h4>
              <div className="space-y-1.5">
                <div className="flex items-center">
                  <div className="w-4 h-4 mr-2 rounded bg-red-500 opacity-80"></div>
                  <span className="text-xs">Wysoka liczba kontroli</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 mr-2 rounded bg-red-500 opacity-40"></div>
                  <span className="text-xs">Średnia liczba kontroli</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 mr-2 rounded bg-red-500 opacity-20"></div>
                  <span className="text-xs">Niska liczba kontroli</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 mr-2 rounded bg-gray-300 dark:bg-gray-600"></div>
                  <span className="text-xs">Brak danych</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium mb-2">Punkty kontroli</h4>
              <div className="space-y-1.5">
                <div className="flex items-center">
                  <div className="w-4 h-4 mr-2 rounded-full bg-green-500 border-2 border-white dark:border-gray-800"></div>
                  <span className="text-xs">Wynik pozytywny</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 mr-2 rounded-full bg-red-500 border-2 border-white dark:border-gray-800"></div>
                  <span className="text-xs">Wynik negatywny</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 mr-2 rounded-full bg-yellow-500 border-2 border-white dark:border-gray-800"></div>
                  <span className="text-xs">Wynik warunkowy</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-3 pt-3 border-t dark:border-gray-700">
            <h4 className="text-sm font-medium mb-2">Jak korzystać z mapy</h4>
            <ul className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
              <li className="flex items-start">
                <span className="mr-1">•</span>
                <span>Kliknij na województwo, aby wyświetlić szczegółowe statystyki</span>
              </li>
              <li className="flex items-start">
                <span className="mr-1">•</span>
                <span>Najedź kursorem na region, aby zobaczyć podstawowe informacje</span>
              </li>
              <li className="flex items-start">
                <span className="mr-1">•</span>
                <span>Użyj wyszukiwarki, aby znaleźć konkretny adres lub budynek</span>
              </li>
              <li className="flex items-start">
                <span className="mr-1">•</span>
                <span>Filtruj dane według miasta, typu kontroli lub wyniku</span>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapLegend;