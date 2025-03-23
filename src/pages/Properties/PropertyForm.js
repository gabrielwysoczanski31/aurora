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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success', 'error', or null
  const [submitMessage, setSubmitMessage] = useState('');
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Remove error for this field if present
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
    
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.address) newErrors.address = 'Address is required';
    if (!formData.size) {
      newErrors.size = 'Size is required';
    } else if (isNaN(formData.size) || Number(formData.size) <= 0) {
      newErrors.size = 'Size must be a positive number';
    }
    
    if (!formData.price) {
      newErrors.price = 'Rent is required';
    } else if (isNaN(formData.price) || Number(formData.price) <= 0) {
      newErrors.price = 'Rent must be a positive number';
    }
    
    if (formData.rooms && (isNaN(formData.rooms) || Number(formData.rooms) <= 0)) {
      newErrors.rooms = 'Rooms must be a positive number';
    }
    
    if (formData.floor && isNaN(formData.floor)) {
      newErrors.floor = 'Floor must be a number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus(null);
    
    if (validate()) {
      setIsSubmitting(true);
      
      try {
        // Prepare data with correct number types
        const processedData = {
          ...formData,
          // Convert numeric fields
          size: Number(formData.size),
          price: Number(formData.price),
          rooms: formData.rooms ? Number(formData.rooms) : null,
          floor: formData.floor ? Number(formData.floor) : null
        };
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Call the parent's onSubmit handler
        onSubmit(processedData);
        
        // Show success message
        setSubmitStatus('success');
        setSubmitMessage(property ? 'Property updated successfully!' : 'Property created successfully!');
        
        // Close the form after a delay if successful
        setTimeout(() => {
          if (property) {
            // For updates, just show success but don't close
            setSubmitStatus(null);
          } else {
            // For new properties, close the form
            onCancel();
          }
        }, 2000);
      } catch (error) {
        console.error("Error submitting form:", error);
        setSubmitStatus('error');
        setSubmitMessage('An error occurred. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    }
  };
  
  const inputClass = (fieldName) => `
    w-full px-3 py-2 border rounded-lg 
    ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} 
    ${errors[fieldName] ? 'border-red-500' : ''}
  `;
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Show form status messages */}
      {submitStatus === 'success' && (
        <div className="p-3 bg-green-100 border-l-4 border-green-500 text-green-700 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          {submitMessage}
        </div>
      )}
      
      {submitStatus === 'error' && (
        <div className="p-3 bg-red-100 border-l-4 border-red-500 text-red-700 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {submitMessage}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-500 mb-1">Name*</label>
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
            <option value="Dostępne">Available</option>
            <option value="Wynajęte">Rented</option>
            <option value="W remoncie">Under Renovation</option>
            <option value="Rezerwacja">Reserved</option>
          </select>
        </div>
        
        {/* Rest of the form fields remain the same */}
        {/* ... */}
      </div>
      
      <div className="flex justify-end space-x-2 pt-4">
        <Button 
          type="button" 
          variant="secondary"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button 
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <div className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving...
            </div>
          ) : (
            property ? 'Save Changes' : 'Add Property'
          )}
        </Button>
      </div>
    </form>
  );
};

export default PropertyForm;