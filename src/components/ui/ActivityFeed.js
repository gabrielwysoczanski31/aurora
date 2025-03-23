import React from 'react';
import { Clock, Home, User, FileText, DollarSign, Wrench } from 'lucide-react';
import Card from './Card';
import StatusBadge from './StatusBadge';

const ActivityFeed = ({ activities, darkMode }) => {
  const getActivityIcon = (type) => {
    switch (type) {
      case 'Nowy najemca':
        return <User size={16} className="text-blue-500" />;
      case 'Zakończenie najmu':
        return <Home size={16} className="text-purple-500" />;
      case 'Faktura':
        return <FileText size={16} className="text-yellow-500" />;
      case 'Płatność':
        return <DollarSign size={16} className="text-green-500" />;
      case 'Zgłoszenie usterki':
        return <Wrench size={16} className="text-red-500" />;
      default:
        return <Clock size={16} className="text-gray-500" />;
    }
  };

  return (
    <Card darkMode={darkMode}>
      <h3 className="font-semibold mb-4">Ostatnie aktywności</h3>
      
      <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
        {activities.slice(0, 10).map((activity) => (
          <div 
            key={activity.id}
            className={`flex items-start space-x-3 pb-3 ${
              darkMode ? 'border-b border-gray-700' : 'border-b'
            }`}
          >
            <div className="flex-shrink-0 p-1">
              {getActivityIcon(activity.type)}
            </div>
            
            <div className="flex-grow">
              <div className="flex justify-between items-start">
                <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {activity.type}
                </p>
                <StatusBadge 
                  status={activity.status} 
                  color={activity.status === 'Zamknięte' ? 'green' : 'blue'} 
                />
              </div>
              
              <p className="text-sm text-gray-500 mb-1">{activity.description}</p>
              
              <p className="text-xs text-gray-400">{activity.date}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default ActivityFeed;