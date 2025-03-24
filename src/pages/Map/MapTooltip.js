import React from 'react';

// Simple tooltip component for the interactive map
const MapTooltip = ({ region, regionData, visible, position, darkMode }) => {
  if (!visible || !region) return null;
  
  const data = regionData[region.id] || { count: 0, positive: 0, negative: 0, warunkowy: 0 };
  
  return (
    <div 
      className={`absolute z-10 p-2 rounded-lg shadow-lg text-sm pointer-events-none transition-opacity duration-200 ${
        visible ? 'opacity-100' : 'opacity-0'
      } ${
        darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
      }`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        minWidth: '150px'
      }}
    >
      <h3 className="font-bold">{region.name}</h3>
      <div className="grid grid-cols-2 gap-x-2 gap-y-1 mt-1">
        <span className="text-gray-500">Kontrole:</span>
        <span className="font-medium">{data.count}</span>
        
        <span className="text-gray-500">Pozytywne:</span>
        <span className="font-medium text-green-500">{data.positive}</span>
        
        <span className="text-gray-500">Negatywne:</span>
        <span className="font-medium text-red-500">{data.negative}</span>
        
        <span className="text-gray-500">Warunkowe:</span>
        <span className="font-medium text-yellow-500">{data.warunkowy}</span>
      </div>
      <div className="text-xs text-gray-500 mt-1">Kliknij, aby zobaczyć szczegóły</div>
    </div>
  );
};

export default MapTooltip;