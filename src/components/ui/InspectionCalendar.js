import React, { useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Clipboard } from 'lucide-react';
import Card from './Card';

const InspectionCalendar = ({ inspections, darkMode }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  
  const monthNames = ['Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec', 
                     'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień'];
  
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  
  // Dostosowanie dla niedzieli jako pierwszego dnia tygodnia
  const adjustedFirstDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
  
  const getDaysArray = () => {
    const days = Array(adjustedFirstDay).fill(null); // Puste dni na początku
    
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    
    // Dodajemy puste dni na końcu, aby wypełnić cały grid
    const totalCells = Math.ceil(days.length / 7) * 7;
    while (days.length < totalCells) {
      days.push(null);
    }
    
    return days;
  };
  
  const navigateMonth = (direction) => {
    let newMonth = currentMonth;
    let newYear = currentYear;
    
    if (direction === 'prev') {
      if (currentMonth === 0) {
        newMonth = 11;
        newYear = currentYear - 1;
      } else {
        newMonth = currentMonth - 1;
      }
    } else {
      if (currentMonth === 11) {
        newMonth = 0;
        newYear = currentYear + 1;
      } else {
        newMonth = currentMonth + 1;
      }
    }
    
    setCurrentMonth(newMonth);
    setCurrentYear(newYear);
  };
  
  const getInspectionForDay = (day) => {
    if (!day) return null;
    
    return inspections.find(p => {
      const [dayPart, monthPart, yearPart] = p.date.split('.');
      return parseInt(dayPart) === day && 
             parseInt(monthPart) - 1 === currentMonth && 
             parseInt(yearPart) === currentYear;
    });
  };
  
  const days = getDaysArray();
  const weekdays = ['Pon', 'Wt', 'Śr', 'Czw', 'Pt', 'Sob', 'Nd'];

  // Liczba kontroli w tym miesiącu
  const monthlyInspectionsCount = inspections.filter(insp => {
    const [dayPart, monthPart, yearPart] = insp.date.split('.');
    return parseInt(monthPart) - 1 === currentMonth && 
           parseInt(yearPart) === currentYear;
  }).reduce((sum, insp) => sum + insp.count, 0);

  return (
    <Card darkMode={darkMode}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold flex items-center">
          <Clipboard size={16} className="mr-2" />
          Kalendarz kontroli
        </h3>
        
        <div className="flex items-center space-x-2">
          <button onClick={() => navigateMonth('prev')} className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700">
            <ChevronLeft size={16} />
          </button>
          
          <span>{monthNames[currentMonth]} {currentYear}</span>
          
          <button onClick={() => navigateMonth('next')} className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-7 gap-1">
        {/* Nazwy dni tygodnia */}
        {weekdays.map((day, index) => (
          <div 
            key={index} 
            className="text-center text-xs font-medium text-gray-500 py-1"
          >
            {day}
          </div>
        ))}
        
        {/* Dni */}
        {days.map((day, index) => {
          const inspection = getInspectionForDay(day);
          return (
            <div 
              key={index} 
              className={`
                relative p-1 aspect-square flex flex-col justify-center items-center text-sm
                ${!day ? 'opacity-0' : ''}
                ${inspection ? (darkMode ? 'bg-red-800 text-white' : 'bg-red-100 text-red-800') : ''}
                rounded-md
              `}
            >
              {day}
              {inspection && (
                <span className="text-xs mt-1 font-bold">{inspection.count}</span>
              )}
              {inspection && (
                <div className={`absolute -top-1 -right-1 h-2 w-2 rounded-full ${darkMode ? 'bg-yellow-500' : 'bg-yellow-500'}`}></div>
              )}
            </div>
          );
        })}
      </div>
      
      <div className="mt-4">
        <div className="flex justify-between text-sm">
          <div className="text-gray-500">Kontrole w tym miesiącu</div>
          <div className="font-medium">{monthlyInspectionsCount}</div>
        </div>
        
        <div className="flex justify-between text-sm mt-1">
          <div className="text-gray-500">Dni z kontrolami</div>
          <div className="font-medium">{inspections.length}</div>
        </div>
        
        <div className="flex justify-between text-sm mt-1">
          <div className="text-gray-500">Planowane kontrole</div>
          <div className="font-medium">{Math.floor(monthlyInspectionsCount * 0.4)}</div>
        </div>
      </div>
    </Card>
  );
};

export default InspectionCalendar;