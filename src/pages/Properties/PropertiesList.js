import React, { useState, useEffect } from 'react';
import { 
  Search, Filter, Plus, AlertTriangle, ArrowUpRight, ArrowDownRight, 
  BrainCircuit, BarChart2, DollarSign, Home, Building, Calendar, MapPin,
  ChevronDown, X, Download, TrendingUp, CheckCircle, Clock, Zap
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import DataTable from '../../components/ui/DataTable';
import StatusBadge from '../../components/ui/StatusBadge';
import PropertyForm from './PropertyForm';

const EnhancedPropertiesList = ({ data = [], darkMode, onPropertySelect, isRefreshing }) => {
  // Basic state management
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priceFilter, setPriceFilter] = useState({ min: '', max: '' });
  const [sizeFilter, setSizeFilter] = useState({ min: '', max: '' });
  const [sortOrder, setSortOrder] = useState('default');
  const [showAddForm, setShowAddForm] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState(null);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [propertyToEdit, setPropertyToEdit] = useState(null);
  const [selectedProperties, setSelectedProperties] = useState([]);
  
  // AI features state
  const [showAIInsights, setShowAIInsights] = useState(false);
  const [aiLoading, setAILoading] = useState(false);
  const [aiInsights, setAIInsights] = useState([]);
  const [aiRecommendations, setAIRecommendations] = useState([]);
  const [propertyScores, setPropertyScores] = useState({});
  const [showAIRecommendations, setShowAIRecommendations] = useState(false);
  const [marketTrends, setMarketTrends] = useState(null);
  const [propertyPredictions, setPropertyPredictions] = useState({});
  
  // Initialize filtered properties
  useEffect(() => {
    filterProperties();
  }, [data, searchTerm, statusFilter, priceFilter, sizeFilter, sortOrder]);
  
  // Filter properties based on all criteria
  const filterProperties = () => {
    let filtered = [...data];
    
    // Filter by search term
    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(property => 
        property.name?.toLowerCase().includes(term) ||
        property.address?.toLowerCase().includes(term)
      );
    }
    
    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(property => property.status === statusFilter);
    }
    
    // Filter by price range
    if (priceFilter.min) {
      filtered = filtered.filter(property => property.price >= parseInt(priceFilter.min));
    }
    
    if (priceFilter.max) {
      filtered = filtered.filter(property => property.price <= parseInt(priceFilter.max));
    }
    
    // Filter by size range
    if (sizeFilter.min) {
      filtered = filtered.filter(property => property.size >= parseInt(sizeFilter.min));
    }
    
    if (sizeFilter.max) {
      filtered = filtered.filter(property => property.size <= parseInt(sizeFilter.max));
    }
    
    // Apply sorting
    switch (sortOrder) {
      case 'priceAsc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'priceDesc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'sizeAsc':
        filtered.sort((a, b) => a.size - b.size);
        break;
      case 'sizeDesc':
        filtered.sort((a, b) => b.size - a.size);
        break;
      case 'nameAsc':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'nameDesc':
        filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        // Default sorting by ID or name
        filtered.sort((a, b) => a.id - b.id);
    }
    
    setFilteredProperties(filtered);
  };
  
  // Reset all filters
  const resetFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setPriceFilter({ min: '', max: '' });
    setSizeFilter({ min: '', max: '' });
    setSortOrder('default');
  };

  // Handle property form submission
  const handlePropertySubmit = (propertyData) => {
    if (propertyToEdit) {
      // Update existing property
      const updatedData = data.map(p => 
        p.id === propertyToEdit.id ? {...propertyData, id: propertyToEdit.id} : p
      );
      
      // Here you would typically call an API to update the property
      console.log('Updated property:', propertyData);
      
      // Close form and reset edit state
      setPropertyToEdit(null);
      alert(`Property "${propertyData.name}" has been updated.`);
    } else {
      // Add new property with a generated ID
      const newProperty = {
        ...propertyData,
        id: Math.max(...data.map(p => p.id), 0) + 1
      };
      
      // Here you would typically call an API to save the new property
      console.log('New property:', newProperty);
      
      // Add to local data (simulating API response)
      // In a real app, you'd update state after the API call succeeds
      alert(`Property "${propertyData.name}" has been added.`);
    }
    
    setShowAddForm(false);
    
    // If AI insights are showing, refresh them
    if (showAIInsights) {
      generateAIInsights();
    }
  };

  // Handle property edit
  const handleEditProperty = (propertyId) => {
    const property = data.find(p => p.id === propertyId);
    if (property) {
      setPropertyToEdit(property);
      setShowAddForm(true);
    }
  };

  // Handle property delete confirmation
  const handleDeleteClick = (propertyId) => {
    const property = data.find(p => p.id === propertyId);
    if (property) {
      setPropertyToDelete(property);
      setShowConfirmDelete(true);
    }
  };

  // Handle confirmed delete
  const handleConfirmDelete = () => {
    if (propertyToDelete) {
      // Here you would typically call an API to delete the property
      console.log(`Deleting property: ${propertyToDelete.name}`);
      
      // Remove from selected properties if it was selected
      if (selectedProperties.includes(propertyToDelete.id)) {
        setSelectedProperties(selectedProperties.filter(id => id !== propertyToDelete.id));
      }
      
      alert(`Property "${propertyToDelete.name}" has been deleted.`);
      
      // If AI insights are showing, refresh them
      if (showAIInsights) {
        generateAIInsights();
      }
    }
    
    // Close confirmation and reset
    setShowConfirmDelete(false);
    setPropertyToDelete(null);
  };

  // Handle property selection
  const handlePropertySelect = (property) => {
    if (onPropertySelect) {
      onPropertySelect(property);
    } else {
      alert(`Viewing details for: ${property.name}`);
    }
  };

  // Handle property selection checkbox
  const handlePropertyCheck = (propertyId) => {
    setSelectedProperties(prev => {
      if (prev.includes(propertyId)) {
        return prev.filter(id => id !== propertyId);
      } else {
        return [...prev, propertyId];
      }
    });
  };

  // Handle select all properties
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedProperties(filteredProperties.map(p => p.id));
    } else {
      setSelectedProperties([]);
    }
  };

  // Export selected properties as CSV
  const handleExport = () => {
    if (selectedProperties.length === 0) {
      alert('Please select at least one property to export.');
      return;
    }

    // Create CSV content
    const selectedData = data.filter(property => selectedProperties.includes(property.id));
    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += 'ID,Name,Address,Status,Size,Price,Rooms\n';
    
    selectedData.forEach(property => {
      csvContent += `${property.id},"${property.name}","${property.address}","${property.status}",${property.size},${property.price},${property.rooms || ''}\n`;
    });
    
    // Download CSV
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'properties.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    alert(`Exported ${selectedProperties.length} properties.`);
  };

  // Generate AI insights
  const generateAIInsights = () => {
    setAILoading(true);
    setShowAIInsights(true);
    
    // Simulate AI processing time
    setTimeout(() => {
      // Calculate property scores (0-100) based on multiple factors
      const scores = {};
      data.forEach(property => {
        let score = 0;
        
        // Factor: Rental yield (if property is rented)
        if (property.status === 'Wynajęte' && property.price) {
          // Assuming higher rent = higher score
          score += Math.min(40, property.price / 100);
        }
        
        // Factor: Property size
        if (property.size) {
          score += Math.min(30, property.size / 3);
        }
        
        // Factor: Property features (rooms, balcony, etc.)
        if (property.rooms) {
          score += property.rooms * 5;
        }
        
        if (property.hasBalcony) {
          score += 5;
        }
        
        if (property.hasParkingSpace) {
          score += 5;
        }
        
        // Normalize score to 0-100 range
        score = Math.min(100, Math.max(0, score));
        scores[property.id] = Math.round(score);
      });
      
      setPropertyScores(scores);
      
      // Calculate average rent price per square meter
      const rentedProperties = data.filter(p => p.status === 'Wynajęte' && p.price && p.size);
      let avgPricePerSqm = 0;
      
      if (rentedProperties.length > 0) {
        avgPricePerSqm = rentedProperties.reduce((sum, p) => sum + (p.price / p.size), 0) / rentedProperties.length;
      }
      
      // Generate insights
      const insights = [
        {
          title: 'Portfolio Overview',
          description: `Your portfolio consists of ${data.length} properties with an occupancy rate of ${Math.round(data.filter(p => p.status === 'Wynajęte').length / data.length * 100)}%.`,
          icon: <Building size={16} className="text-blue-500" />
        },
        {
          title: 'Rental Performance',
          description: `Average rental yield is ${avgPricePerSqm.toFixed(2)} PLN per square meter. ${data.filter(p => p.status === 'Wynajęte').length} properties are currently rented.`,
          icon: <DollarSign size={16} className="text-green-500" />
        }
      ];
      
      // Add warning if there are properties available for too long
      const availableProperties = data.filter(p => p.status === 'Dostępne');
      if (availableProperties.length > 0) {
        insights.push({
          title: 'Vacancy Alert',
          description: `${availableProperties.length} properties are currently vacant. Consider adjusting pricing or marketing strategies.`,
          icon: <AlertTriangle size={16} className="text-yellow-500" />
        });
      }
      
      setAIInsights(insights);
      
      // Generate recommendations
      const recommendations = [];
      
      // Recommendation for vacant properties
      if (availableProperties.length > 0) {
        recommendations.push({
          title: 'Price Adjustment',
          description: 'Consider reducing prices for properties that have been vacant for more than 30 days to improve occupancy rate.',
          action: 'View Properties',
          properties: availableProperties,
          icon: <ArrowDownRight size={16} className="text-blue-500" />
        });
      }
      
      // Recommendation for low-performing properties
      const lowPerformingProperties = data.filter(p => {
        const score = scores[p.id] || 0;
        return score < 60 && p.status === 'Wynajęte';
      });
      
      if (lowPerformingProperties.length > 0) {
        recommendations.push({
          title: 'Improvement Opportunities',
          description: `${lowPerformingProperties.length} properties are underperforming. Consider renovations or amenity upgrades to increase rental value.`,
          action: 'See Properties',
          properties: lowPerformingProperties,
          icon: <ArrowUpRight size={16} className="text-purple-500" />
        });
      }
      
      // Recommendation for high-potential properties
      const highPotentialProperties = data.filter(p => {
        const score = scores[p.id] || 0;
        return score > 80 && p.status !== 'Wynajęte';
      });
      
      if (highPotentialProperties.length > 0) {
        recommendations.push({
          title: 'Priority Marketing',
          description: `${highPotentialProperties.length} high-value properties should be prioritized in your marketing efforts.`,
          action: 'Prioritize',
          properties: highPotentialProperties,
          icon: <Zap size={16} className="text-yellow-500" />
        });
      }
      
      setAIRecommendations(recommendations);
      
      // Generate market trends analysis
      setMarketTrends({
        rentalTrend: 3.2, // % increase in rental prices
        occupancyTrend: 1.5, // % increase in occupancy
        popularAmenities: ['Air Conditioning', 'High-speed Internet', 'Parking']
      });
      
      // Generate property predictions
      const predictions = {};
      data.forEach(property => {
        if (property.status === 'Dostępne') {
          // Predict days until rented and optimal price
          predictions[property.id] = {
            daysToRent: Math.floor(Math.random() * 45) + 5,
            optimalPrice: Math.round(property.price * (0.9 + Math.random() * 0.3))
          };
        } else if (property.status === 'Wynajęte' && property.leaseEnd) {
          // Predict renewal probability
          predictions[property.id] = {
            renewalProbability: Math.floor(Math.random() * 60) + 40
          };
        }
      });
      
      setPropertyPredictions(predictions);
      setAILoading(false);
    }, 2000);
  };

  // Get color for property score
  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };
  
  // Handle recommendation action
  const handleRecommendationAction = (recommendation) => {
    if (recommendation.properties && recommendation.properties.length > 0) {
      const propertyIds = recommendation.properties.map(p => p.id);
      setSelectedProperties(propertyIds);
      setStatusFilter('all'); // Reset filters to see all selected properties
      
      alert(`Selected ${propertyIds.length} properties based on AI recommendation.`);
    }
  };

  // Configure table columns
  const columns = [
    { 
      header: (
        <div className="flex items-center">
          <input 
            type="checkbox" 
            onChange={handleSelectAll}
            checked={selectedProperties.length === filteredProperties.length && filteredProperties.length > 0}
            className="mr-2"
          />
          <span>ID</span>
        </div>
      ),
      accessor: 'id',
      cell: (value, row) => (
        <div className="flex items-center">
          <input 
            type="checkbox" 
            checked={selectedProperties.includes(value)}
            onChange={() => handlePropertyCheck(value)}
            onClick={(e) => e.stopPropagation()}
            className="mr-2"
          />
          {value}
        </div>
      )
    },
    { 
      header: 'Name', 
      accessor: 'name',
      cell: (value, row) => (
        <div className="flex items-center">
          <div className="mr-2">
            <Home size={16} className="text-blue-500" />
          </div>
          <div>
            <p className="font-medium">{value}</p>
            {showAIInsights && propertyScores[row.id] && (
              <div className="flex items-center">
                <div className={`h-1.5 w-12 bg-gray-200 rounded-full mr-1`}>
                  <div 
                    className={`h-1.5 rounded-full bg-${propertyScores[row.id] >= 80 ? 'green' : propertyScores[row.id] >= 60 ? 'yellow' : 'red'}-500`}
                    style={{ width: `${propertyScores[row.id]}%` }}
                  ></div>
                </div>
                <span className={`text-xs ${getScoreColor(propertyScores[row.id])}`}>
                  {propertyScores[row.id]}
                </span>
              </div>
            )}
          </div>
        </div>
      )
    },
    { 
      header: 'Address', 
      accessor: 'address',
      cell: (value) => (
        <div className="flex items-center">
          <MapPin size={14} className="mr-1 text-gray-500" />
          {value}
        </div>
      )
    },
    { 
      header: 'Status', 
      accessor: 'status',
      cell: (value) => (
        <StatusBadge 
          status={value} 
          color={
            value === 'Wynajęte' ? 'green' : 
            value === 'Dostępne' ? 'blue' : 
            value === 'W remoncie' ? 'yellow' : 
            'purple'
          } 
        />
      )
    },
    { 
      header: 'Size', 
      accessor: 'size',
      cell: (value) => `${value} m²` 
    },
    { 
      header: 'Rent', 
      accessor: 'price',
      cell: (value, row) => (
        <div>
          <div className="font-medium">{value.toLocaleString()} PLN</div>
          {showAIInsights && row.status === 'Dostępne' && propertyPredictions[row.id] && (
            <div className={`text-xs ${propertyPredictions[row.id].optimalPrice > value ? 'text-green-500' : 'text-red-500'}`}>
              {propertyPredictions[row.id].optimalPrice > value ? '↑' : '↓'} {propertyPredictions[row.id].optimalPrice.toLocaleString()} PLN
            </div>
          )}
        </div>
      ),
      align: 'right'
    },
    ...(showAIInsights ? [
      {
        header: 'AI Insights',
        accessor: 'id',
        cell: (value, row) => {
          if (row.status === 'Dostępne' && propertyPredictions[value]) {
            return (
              <div className="flex items-center">
                <Clock size={14} className="mr-1 text-blue-500" />
                <span className="text-sm">~{propertyPredictions[value].daysToRent} days to rent</span>
              </div>
            );
          } else if (row.status === 'Wynajęte' && propertyPredictions[value]) {
            return (
              <div className="flex items-center">
                <CheckCircle size={14} className="mr-1 text-green-500" />
                <span className="text-sm">{propertyPredictions[value].renewalProbability}% renewal</span>
              </div>
            );
          }
          return null;
        }
      }
    ] : []),
    { 
      header: 'Actions', 
      accessor: 'id',
      cell: (value, row) => (
        <div className="flex space-x-2">
          <Button 
            variant="link" 
            onClick={(e) => {
              e.stopPropagation(); // Prevent row click
              handleEditProperty(value);
            }}
          >
            Edit
          </Button>
          <Button 
            variant="link" 
            onClick={(e) => {
              e.stopPropagation(); // Prevent row click
              handleDeleteClick(value);
            }} 
            className="text-red-600"
          >
            Delete
          </Button>
        </div>
      )
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Properties</h2>
        <div className="flex space-x-2">
          <Button 
            onClick={() => setShowAddForm(true)} 
            className="flex items-center"
          >
            <Plus size={16} className="mr-2" />
            Add Property
          </Button>
          
          <Button 
            variant={showAIInsights ? "outline" : "primary"}
            className="flex items-center"
            color="blue"
            onClick={() => {
              if (showAIInsights) {
                setShowAIInsights(false);
              } else {
                generateAIInsights();
              }
            }}
          >
            <BrainCircuit size={16} className="mr-2" />
            {showAIInsights ? 'Hide AI Insights' : 'AI Analysis'}
          </Button>
        </div>
      </div>
      
      {/* Property form */}
      {showAddForm && (
        <Card darkMode={darkMode}>
          <h3 className="font-semibold mb-4">{propertyToEdit ? 'Edit Property' : 'Add New Property'}</h3>
          <PropertyForm 
            property={propertyToEdit}
            onSubmit={handlePropertySubmit} 
            onCancel={() => {
              setShowAddForm(false);
              setPropertyToEdit(null);
            }}
            darkMode={darkMode}
          />
        </Card>
      )}
      
      {/* AI Insights Panel */}
      {showAIInsights && (
        <Card darkMode={darkMode} className="border-l-4 border-blue-500">
          <div className="flex justify-between items-start">
            <div className="flex items-center">
              <BrainCircuit size={20} className="mr-2 text-blue-500" />
              <h3 className="font-semibold">AI Property Insights</h3>
            </div>
            <Button 
              variant="link" 
              size="sm"
              onClick={() => setShowAIInsights(false)}
            >
              Hide
            </Button>
          </div>
          
          {aiLoading ? (
            <div className="flex items-center justify-center p-6">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <span className="ml-2">Analyzing property data...</span>
            </div>
          ) : (
            <div className="mt-4 space-y-4">
              {/* Insights cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {aiInsights.map((insight, index) => (
                  <div 
                    key={index} 
                    className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} flex items-start`}
                  >
                    {insight.icon}
                    <div className="ml-2">
                      <h4 className="font-medium">{insight.title}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{insight.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Market trends */}
              {marketTrends && (
                <div className="mt-6">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-medium flex items-center">
                      <BarChart2 size={16} className="mr-2 text-blue-500" />
                      Market Trends Analysis
                    </h4>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className={`p-3 rounded-lg ${darkMode ? 'bg-green-900 bg-opacity-20' : 'bg-green-50'}`}>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-500 text-sm">Rental Price Trend</span>
                        <span className="flex items-center text-green-500">
                          <TrendingUp size={14} className="mr-1" />
                          +{marketTrends.rentalTrend}%
                        </span>
                      </div>
                      <p className="mt-1 text-sm">Prices are rising in your area</p>
                    </div>
                    
                    <div className={`p-3 rounded-lg ${darkMode ? 'bg-blue-900 bg-opacity-20' : 'bg-blue-50'}`}>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-500 text-sm">Occupancy Trend</span>
                        <span className="flex items-center text-blue-500">
                          <TrendingUp size={14} className="mr-1" />
                          +{marketTrends.occupancyTrend}%
                        </span>
                      </div>
                      <p className="mt-1 text-sm">Demand is increasing</p>
                    </div>
                    
                    <div className={`p-3 rounded-lg ${darkMode ? 'bg-purple-900 bg-opacity-20' : 'bg-purple-50'}`}>
                      <span className="text-gray-500 text-sm">Most Requested Amenities</span>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {marketTrends.popularAmenities.map((amenity, i) => (
                          <span key={i} className="text-xs bg-white dark:bg-gray-800 px-2 py-0.5 rounded-full">
                            {amenity}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* AI Recommendations */}
              <div className="mt-4">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium flex items-center">
                    <Zap size={16} className="mr-2 text-yellow-500" />
                    AI Recommendations
                  </h4>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowAIRecommendations(!showAIRecommendations)}
                  >
                    {showAIRecommendations ? 'Hide Details' : 'Show Details'}
                  </Button>
                </div>
                
                {showAIRecommendations && (
                  <div className="space-y-3 mt-2">
                    {aiRecommendations.length > 0 ? (
                      aiRecommendations.map((recommendation, index) => (
                        <div 
                          key={index} 
                          className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} flex items-start justify-between`}
                        >
                          <div className="flex items-start">
                            {recommendation.icon}
                            <div className="ml-2">
                              <h5 className="font-medium">{recommendation.title}</h5>
                              <p className="text-sm text-gray-600 dark:text-gray-400">{recommendation.description}</p>
                            </div>
                          </div>
                          {recommendation.action && (
                            <Button 
                              variant="outline"
                              size="sm"
                              onClick={() => handleRecommendationAction(recommendation)}
                              className="ml-2 whitespace-nowrap"
                            >
                              {recommendation.action}
                            </Button>
                          )}
                        </div>
                      ))
                    ) : (
                      <p className="text-center p-4 text-gray-500">
                        No recommendations available at this time.
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </Card>
      )}
      
      <Card darkMode={darkMode}>
        <div className="mb-4 flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search properties..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`pl-9 pr-3 py-2 border rounded-lg w-full ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
            />
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                <X size={16} />
              </button>
            )}
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className={`px-3 py-2 border rounded-lg ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
          >
            <option value="all">All statuses</option>
            <option value="Wynajęte">Rented</option>
            <option value="Dostępne">Available</option>
            <option value="W remoncie">Under renovation</option>
            <option value="Rezerwacja">Reserved</option>
          </select>
          
          <Button 
            variant="outline" 
            className="flex items-center"
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
          >
            <Filter size={16} className="mr-2" />
            {showAdvancedFilters ? 'Hide filters' : 'More filters'}
          </Button>
        </div>

        {/* Advanced filters (collapsed by default) */}
        {showAdvancedFilters && (
          <div className="mb-4 p-4 border rounded-lg dark:border-gray-700">
            <h4 className="font-medium mb-3">Advanced Filters</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Price range */}
              <div>
                <label className="block text-gray-500 mb-1">Price range (PLN)</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={priceFilter.min}
                    onChange={(e) => setPriceFilter({...priceFilter, min: e.target.value})}
                    className={`px-3 py-2 border rounded-lg ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={priceFilter.max}
                    onChange={(e) => setPriceFilter({...priceFilter, max: e.target.value})}
                    className={`px-3 py-2 border rounded-lg ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                  />
                </div>
              </div>
              
              {/* Size range */}
              <div>
                <label className="block text-gray-500 mb-1">Size (m²)</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={sizeFilter.min}
                    onChange={(e) => setSizeFilter({...sizeFilter, min: e.target.value})}
                    className={`px-3 py-2 border rounded-lg ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={sizeFilter.max}
                    onChange={(e) => setSizeFilter({...sizeFilter, max: e.target.value})}
                    className={`px-3 py-2 border rounded-lg ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                  />
                </div>
              </div>
              
              {/* Sort options */}
              <div>
                <label className="block text-gray-500 mb-1">Sort by</label>
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                >
                  <option value="default">Default</option>
                  <option value="priceAsc">Price (Low to High)</option>
                  <option value="priceDesc">Price (High to Low)</option>
                  <option value="sizeAsc">Size (Small to Large)</option>
                  <option value="sizeDesc">Size (Large to Small)</option>
                  <option value="nameAsc">Name (A-Z)</option>
                  <option value="nameDesc">Name (Z-A)</option>
                </select>
              </div>
            </div>
            
            <div className="mt-4 flex justify-end space-x-2">
              <Button 
                variant="outline" 
                onClick={resetFilters}
              >
                Clear filters
              </Button>
              <Button>
                Apply filters
              </Button>
            </div>
          </div>
        )}

        {/* Selection actions bar */}
        {selectedProperties.length > 0 && (
          <div className="mb-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-blue-800 dark:bg-blue-900 dark:bg-opacity-30 dark:border-blue-700 dark:text-blue-200">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <CheckCircle size={18} className="mr-2" />
                <p>{selectedProperties.length} {selectedProperties.length === 1 ? 'property' : 'properties'} selected</p>
              </div>
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleExport}
                  className="flex items-center"
                >
                  <Download size={14} className="mr-1" />
                  Export
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setSelectedProperties([])}
                >
                  <X size={14} className="mr-1" />
                  Clear selection
                </Button>
              </div>
            </div>
          </div>
        )}

        <DataTable
          columns={columns}
          data={filteredProperties}
          darkMode={darkMode}
          onRowClick={(row) => handlePropertySelect(row)}
          pagination={{
            startItem: 1,
            endItem: filteredProperties.length,
            totalItems: filteredProperties.length
          }}
          currentPage={1}
          totalPages={1}
          onPageChange={() => {}}
        />
        
        {filteredProperties.length === 0 && !isRefreshing && (
          <div className="text-center py-8">
            <p className="text-gray-500">No properties found matching your criteria</p>
          </div>
        )}
        
        {isRefreshing && (
          <div className="absolute inset-0 bg-black bg-opacity-10 flex items-center justify-center rounded-lg">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        )}
      </Card>
      
      {/* Delete confirmation modal */}
      {showConfirmDelete && propertyToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`max-w-md w-full p-6 rounded-lg shadow-xl ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="flex items-start mb-4">
              <div className="mr-3 text-red-500">
                <AlertTriangle size={24} />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Confirm Delete</h3>
                <p className="text-gray-500 mt-1">
                  Are you sure you want to delete the property "{propertyToDelete.name}"? 
                  This action cannot be undone.
                </p>
              </div>
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button 
                variant="outline" 
                onClick={() => {
                  setShowConfirmDelete(false);
                  setPropertyToDelete(null);
                }}
              >
                Cancel
              </Button>
              <Button 
                color="red"
                onClick={handleConfirmDelete}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedPropertiesList;