import React, { useState } from 'react';
import Button from '../../components/ui/Button';

const ClientForm = ({ client, onSubmit, onCancel, darkMode, type = 'chimney' }) => {
  const [formData, setFormData] = useState(client || {
    name: '',
    email: '',
    phone: '',
    city: '',
    address: '',
    buildingsCount: type === 'chimney' ? 1 : 0,
    notes: ''
  });
  
  const [errors, setErrors] = useState({});
  
  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? (value ? parseInt(value) : '') : value
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
    
    if (!formData.name) newErrors.name = 'Nazwa klienta jest wymagana';
    if (!formData.email) newErrors.email = 'Email jest wymagany';
    if (!formData.phone) newErrors.phone = 'Telefon jest wymagany';
    
    if (type === 'chimney') {
      if (!formData.city) newErrors.city = 'Miasto jest wymagane';
      if (!formData.address) newErrors.address = 'Adres jest wymagany';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit({
        ...formData,
        id: client ? client.id : Date.now(),
        lastInspection: client?.lastInspection || new Date().toLocaleDateString('pl-PL')
      });
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
        <div className="md:col-span-2">
          <label className="block text-gray-500 mb-1">Nazwa klienta*</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={inputClass('name')}
            placeholder={type === 'chimney' ? "Wspólnota Mieszkaniowa / Spółdzielnia" : "Imię i nazwisko"}
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
        </div>
        
        <div>
          <label className="block text-gray-500 mb-1">Email*</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={inputClass('email')}
            placeholder="przykład@domena.pl"
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>
        
        <div>
          <label className="block text-gray-500 mb-1">Telefon*</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className={inputClass('phone')}
            placeholder="+48 123 456 789"
          />
          {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
        </div>
        
        {type === 'chimney' && (
          <>
            <div>
              <label className="block text-gray-500 mb-1">Miasto*</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className={inputClass('city')}
                placeholder="Warszawa"
              />
              {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
            </div>
            
            <div>
              <label className="block text-gray-500 mb-1">Adres*</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className={inputClass('address')}
                placeholder="ul. Przykładowa 12"
              />
              {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
            </div>
            
            <div>
              <label className="block text-gray-500 mb-1">Liczba budynków</label>
              <input
                type="number"
                name="buildingsCount"
                value={formData.buildingsCount}
                onChange={handleChange}
                className={inputClass('buildingsCount')}
                min="1"
              />
            </div>
          </>
        )}
        
        <div className="md:col-span-2">
          <label className="block text-gray-500 mb-1">Notatki</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            className={`${inputClass('notes')} min-h-20`}
            rows="3"
            placeholder="Dodatkowe informacje o kliencie..."
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
          color={type === 'chimney' ? 'red' : 'blue'}
        >
          {client ? 'Zapisz zmiany' : 'Dodaj klienta'}
        </Button>
      </div>
    </form>
  );
};

export default ClientForm;