import React, { useState } from 'react';
import Button from '../../components/ui/Button';

const PropertyForm = ({ property, onSubmit, onCancel, darkMode }) => {
  const [formData, setFormData] = useState(property || {
    name: '',
    address: '',
    status: 'Dostępne',
    size: '',
    price: '',
    description: '',
    rooms: '',
    floor: '',
    hasBalcony: false,
    hasParkingSpace: false
  });
  
  const [errors, setErrors] = useState({});
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
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
    
    if (!formData.name) newErrors.name = 'Nazwa jest wymagana';
    if (!formData.address) newErrors.address = 'Adres jest wymagany';
    if (!formData.size) {
      newErrors.size = 'Powierzchnia jest wymagana';
    } else if (isNaN(formData.size) || Number(formData.size) <= 0) {
      newErrors.size = 'Powierzchnia musi być liczbą większą od 0';
    }
    
    if (!formData.price) {
      newErrors.price = 'Czynsz jest wymagany';
    } else if (isNaN(formData.price) || Number(formData.price) <= 0) {
      newErrors.price = 'Czynsz musi być liczbą większą od 0';
    }
    
    if (formData.rooms && (isNaN(formData.rooms) || Number(formData.rooms) <= 0)) {
      newErrors.rooms = 'Liczba pokoi musi być liczbą większą od 0';
    }
    
    if (formData.floor && isNaN(formData.floor)) {
      newErrors.floor = 'Piętro musi być liczbą';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit({
        ...formData,
        // Konwertujemy pola numeryczne
        size: Number(formData.size),
        price: Number(formData.price),
        rooms: formData.rooms ? Number(formData.rooms) : null,
        floor: formData.floor ? Number(formData.floor) : null
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
        <div>
          <label className="block text-gray-500 mb-1">Nazwa*</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={inputClass('name')}
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
        </div>
        
        <div>
          <label className="block text-gray-500 mb-1">Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className={inputClass('status')}
          >
            <option value="Dostępne">Dostępne</option>
            <option value="Wynajęte">Wynajęte</option>
            <option value="W remoncie">W remoncie</option>
            <option value="Rezerwacja">Rezerwacja</option>
          </select>
        </div>
        
        <div className="md:col-span-2">
          <label className="block text-gray-500 mb-1">Adres*</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className={inputClass('address')}
          />
          {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
        </div>
        
        <div>
          <label className="block text-gray-500 mb-1">Powierzchnia (m²)*</label>
          <input
            type="number"
            name="size"
            value={formData.size}
            onChange={handleChange}
            className={inputClass('size')}
            min="1"
            step="0.1"
          />
          {errors.size && <p className="text-red-500 text-sm mt-1">{errors.size}</p>}
        </div>
        
        <div>
          <label className="block text-gray-500 mb-1">Czynsz (PLN)*</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className={inputClass('price')}
            min="1"
            step="1"
          />
          {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
        </div>
        
        <div>
          <label className="block text-gray-500 mb-1">Liczba pokoi</label>
          <input
            type="number"
            name="rooms"
            value={formData.rooms}
            onChange={handleChange}
            className={inputClass('rooms')}
            min="1"
            step="1"
          />
          {errors.rooms && <p className="text-red-500 text-sm mt-1">{errors.rooms}</p>}
        </div>
        
        <div>
          <label className="block text-gray-500 mb-1">Piętro</label>
          <input
            type="number"
            name="floor"
            value={formData.floor}
            onChange={handleChange}
            className={inputClass('floor')}
            step="1"
          />
          {errors.floor && <p className="text-red-500 text-sm mt-1">{errors.floor}</p>}
        </div>
        
        <div className="md:col-span-2">
          <label className="block text-gray-500 mb-1">Opis</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className={`${inputClass('description')} min-h-20`}
            rows="3"
          />
        </div>
        
        <div className="flex items-center">
          <input
            type="checkbox"
            id="hasBalcony"
            name="hasBalcony"
            checked={formData.hasBalcony}
            onChange={handleChange}
            className="mr-2"
          />
          <label htmlFor="hasBalcony">Posiada balkon</label>
        </div>
        
        <div className="flex items-center">
          <input
            type="checkbox"
            id="hasParkingSpace"
            name="hasParkingSpace"
            checked={formData.hasParkingSpace}
            onChange={handleChange}
            className="mr-2"
          />
          <label htmlFor="hasParkingSpace">Posiada miejsce parkingowe</label>
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
        <Button type="submit">
          {property ? 'Zapisz zmiany' : 'Dodaj mieszkanie'}
        </Button>
      </div>
    </form>
  );
};

export default PropertyForm;