import React from 'react';
import { MapPin } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

const MapView = ({ data, darkMode }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Mapa kontroli</h2>
      
      <Card darkMode={darkMode} className="h-96 flex items-center justify-center">
        <div className="text-center">
          <MapPin size={48} className="mx-auto mb-4 text-red-500" />
          <p className="mb-2">Mapa z lokalizacjami przeprowadzonych kontroli</p>
          <p className="text-gray-500 text-sm">Wybierz filtry, aby wyświetlić kontrole na mapie</p>
        </div>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card darkMode={darkMode}>
          <h3 className="font-semibold mb-4">Filtry mapy</h3>
          
          <div className="space-y-3">
            <div>
              <label className="block text-gray-500 mb-1">Miasto</label>
              <select className={`w-full px-3 py-2 border rounded-lg ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}>
                <option>Wszystkie miasta</option>
                <option>Warszawa</option>
                <option>Kraków</option>
                <option>Poznań</option>
                <option>Wrocław</option>
                <option>Gdańsk</option>
              </select>
            </div>
            
            <div>
              <label className="block text-gray-500 mb-1">Typ kontroli</label>
              <select className={`w-full px-3 py-2 border rounded-lg ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}>
                <option>Wszystkie typy</option>
                <option>Przewód dymowy</option>
                <option>Przewód spalinowy</option>
                <option>Przewód wentylacyjny</option>
                <option>Instalacja gazowa</option>
              </select>
            </div>
            
            <Button 
              color="red" 
              fullWidth
              className="mt-4"
            >
              Zastosuj filtry
            </Button>
          </div>
        </Card>
        
        <Card darkMode={darkMode} className="md:col-span-2">
          <h3 className="font-semibold mb-4">Statystyki dla wybranego obszaru</h3>
          
          <p className="text-gray-500">Wybierz region na mapie, aby zobaczyć szczegółowe statystyki.</p>
        </Card>
      </div>
    </div>
  );
};

export default MapView;