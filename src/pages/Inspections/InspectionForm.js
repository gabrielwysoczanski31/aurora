import React, { useState } from 'react';
import Button from '../../components/ui/Button';

const InspectionForm = ({ inspection, onSubmit, onCancel, darkMode, buildings, clients }) => {
  const [formData, setFormData] = useState(inspection || {
    type: 'Przewód dymowy',
    buildingId: '',
    clientId: '',
    date: new Date().toISOString().split('T')[0],
    notes: '',
    technicianName: 'Jan Kowalski'
  });
  
  const [errors, setErrors] = useState({});
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Usuwamy błąd dla tego pola jeśli był
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  const validate = () => {
    const newErrors = {};
    
    if (!formData.type) newErrors.type = 'Typ kontroli jest wymagany';
    if (!formData.buildingId) newErrors.buildingId = 'Budynek jest wymagany';
    if (!formData.date) newErrors.date = 'Data kontroli jest wymagana';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };
  
  const inputClass = (fieldName) => `
    w-full px-3 py-2 border rounded-lg 
    ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} 
    ${errors[fieldName] ? 'border-red-500' : ''}
  `;
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-500 mb-1">Typ kontroli*</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className={inputClass('type')}
          >
            <option value="Przewód dymowy">Przewód dymowy</option>
            <option value="Przewód spalinowy">Przewód spalinowy</option>
            <option value="Przewód wentylacyjny">Przewód wentylacyjny</option>
            <option value="Instalacja gazowa">Instalacja gazowa</option>
          </select>
          {errors.type && <p className="text-red-500 text-sm mt-1">{errors.type}</p>}
        </div>
        
        <div>
          <label className="block text-gray-500 mb-1">Budynek*</label>
          <select
            name="buildingId"
            value={formData.buildingId}
            onChange={handleChange}
            className={inputClass('buildingId')}
          >
            <option value="">Wybierz budynek</option>
            {/* Tutaj normalnie byłaby lista budynków */}
            <option value="1">ul. Marszałkowska 12, Warszawa</option>
            <option value="2">ul. Mickiewicza 5, Kraków</option>
            <option value="3">ul. Kościuszki 8, Poznań</option>
          </select>
          {errors.buildingId && <p className="text-red-500 text-sm mt-1">{errors.buildingId}</p>}
        </div>
        
        <div>
          <label className="block text-gray-500 mb-1">Klient</label>
          <select
            name="clientId"
            value={formData.clientId}
            onChange={handleChange}
            className={inputClass('clientId')}
          >
            <option value="">Wybierz klienta</option>
            {/* Tutaj normalnie byłaby lista klientów */}
            <option value="1">Klient1</option>
            <option value="2">Klient2</option>
          </select>
        </div>
        
        <div>
          <label className="block text-gray-500 mb-1">Data kontroli*</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className={inputClass('date')}
          />
          {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date}</p>}
        </div>
        
        <div>
          <label className="block text-gray-500 mb-1">Technik</label>
          <select
            name="technicianName"
            value={formData.technicianName}
            onChange={handleChange}
            className={inputClass('technicianName')}
          >
            <option value="Jan Kowalski">Jan Kowalski</option>
            <option value="Adam Nowak">Adam Nowak</option>
            <option value="Piotr Wiśniewski">Piotr Wiśniewski</option>
          </select>
        </div>
        
        <div className="md:col-span-2">
          <label className="block text-gray-500 mb-1">Uwagi</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            className={`${inputClass('notes')} min-h-20`}
            rows="3"
          />
        </div>
      </div>
      
      <div className="flex justify-end space-x-2 pt-4">
        <Button 
          type="button" 
          variant="secondary"
          onClick={onCancel}
        >
          Anuluj
        </Button>
        <Button 
          type="submit"
          color="red"
        >
          {inspection ? 'Zapisz zmiany' : 'Dodaj kontrolę'}
        </Button>
      </div>
    </form>
  );
};

export default InspectionForm;