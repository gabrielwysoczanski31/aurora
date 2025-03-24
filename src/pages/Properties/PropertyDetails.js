import React, { useState, useEffect } from 'react';
import { 
  Home, Users, FileText, Calendar, ChevronLeft, 
  Thermometer, Droplets, Zap, Wifi, Edit, Star, 
  Phone, Mail, MessageSquare, ArrowUpRight, Clock, 
  DollarSign, BarChart2, Camera, BrainCircuit, TrendingUp,
  TrendingDown, Download, Printer, Share2, AlertTriangle,
  CheckCircle, ArrowRight, MapPin, PieChart
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import StatusBadge from '../../components/ui/StatusBadge';

const EnhancedPropertyDetails = ({ property, darkMode, onBack }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showEditForm, setShowEditForm] = useState(false);
  const [showAIAnalysis, setShowAIAnalysis] = useState(false);
  const [isAILoading, setIsAILoading] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [showContactTenant, setShowContactTenant] = useState(false);
  const [contactMessage, setContactMessage] = useState('');

  // Generate AI Analysis when requested
  const generateAIAnalysis = () => {
    setIsAILoading(true);
    setShowAIAnalysis(true);
    
    // Simulate AI processing delay
    setTimeout(() => {
      // Generate a property analysis based on the property data
      const analysis = {
        rentalYield: ((propertyData.price * 12) / (propertyData.estimatedValue || 500000) * 100).toFixed(2),
        marketComparison: Math.random() > 0.5 ? 'above' : 'below',
        marketComparisonPercent: (Math.random() * 10 + 1).toFixed(1),
        occupancyRate: Math.round(Math.random() * 20 + 80),
        paymentHistory: {
          onTime: Math.round(Math.random() * 5 + 7),
          late: Math.round(Math.random() * 2)
        },
        maintenanceCost: Math.round(Math.random() * 1000 + 500),
        maintenanceCostTrend: Math.random() > 0.5 ? 'up' : 'down',
        maintenanceCostTrendPercent: (Math.random() * 15).toFixed(1),
        rentalTrend: Math.random() > 0.3 ? 'up' : 'down',
        rentalTrendPercent: (Math.random() * 8).toFixed(1),
        renewalProbability: Math.round(Math.random() * 30 + 70),
        recommendations: [
          'Consider a 3% rent increase at next renewal based on market trends',
          'Schedule preventative maintenance to reduce future costs',
          'Update property listing photos to highlight recent renovations'
        ],
        similarProperties: [
          { id: 101, name: 'Apartment 8B', address: 'ul. Warszawska 10/8B', price: Math.round(propertyData.price * (0.9 + Math.random() * 0.2)) },
          { id: 102, name: 'Apartment 15', address: 'ul. Marszałkowska 22/15', price: Math.round(propertyData.price * (0.9 + Math.random() * 0.2)) }
        ],
        financialProjection: {
          year1: propertyData.price * 12,
          year3: propertyData.price * 12 * 3 * 1.05,
          year5: propertyData.price * 12 * 5 * 1.12
        }
      };
      
      setAiAnalysis(analysis);
      setIsAILoading(false);
    }, 2000);
  };

  // Prepare contact message for tenant
  const prepareContactMessage = () => {
    setContactMessage(`Dear ${propertyData.tenantName},\n\nI'm writing regarding your lease of ${propertyData.name} at ${propertyData.address}.\n\n[Your message here]\n\nBest regards,\nProperty Manager`);
    setShowContactTenant(true);
  };

  // Send message to tenant
  const sendMessage = () => {
    alert("Message sent to tenant!");
    setShowContactTenant(false);
    setContactMessage('');
  };

  // Simulated data for the property
  const propertyData = property || {
    id: 1,
    name: 'Apartment 1',
    address: 'ul. Marszałkowska 12/34',
    status: 'Wynajęte',
    size: 68,
    price: 3200,
    estimatedValue: 550000,
    tenantName: 'John Doe',
    tenantPhone: '+48 123 456 789',
    tenantEmail: 'johndoe@example.com',
    leaseStart: '01.01.2025',
    leaseEnd: '31.12.2025',
    lastPayment: '01.03.2025',
    rooms: 3,
    floor: 4,
    hasBalcony: true,
    hasParkingSpace: true,
    description: 'Modern apartment in the city center with a beautiful view. Fully equipped, close to public transportation and shops.',
    features: [
      { name: 'Heating', value: 'Gas' },
      { name: 'Water', value: 'City' },
      { name: 'Energy', value: 'Electric' },
      { name: 'Internet', value: 'Fiber' }
    ],
    amenities: ['Refrigerator', 'Dishwasher', 'Washing Machine', 'TV', 'Air Conditioning', 'Induction Cooktop'],
    history: [
      { date: '01.01.2025', action: 'Lease Agreement', details: 'Signed agreement with John Doe' },
      { date: '15.01.2025', action: 'Payment', details: 'First month rent and deposit received' },
      { date: '01.02.2025', action: 'Payment', details: 'February rent received' },
      { date: '01.03.2025', action: 'Payment', details: 'March rent received' }
    ],
    expenses: [
      { month: 'January', administration: 450, utilities: 320, repairs: 0, other: 50, total: 820 },
      { month: 'February', administration: 450, utilities: 350, repairs: 150, other: 50, total: 1000 },
      { month: 'March', administration: 450, utilities: 310, repairs: 0, other: 50, total: 810 }
    ],
    ratings: {
      condition: 4.5,
      location: 4.8,
      valueForMoney: 4.0,
      management: 4.7,
      overall: 4.5
    },
    notes: 'Tenant prefers phone contact. Last technical inspection done on 15.12.2024.'
  };

  // Function to render the overview tab
  const renderOverview = () => (
    <div className="space-y-6">
      {/* Main information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card darkMode={darkMode}>
          <h3 className="font-semibold mb-4 flex items-center">
            <Home size={20} className="mr-2" />
            Property Information
          </h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-500 text-sm">Status</p>
              <StatusBadge 
                status={propertyData.status} 
                color={
                  propertyData.status === 'Wynajęte' ? 'green' : 
                  propertyData.status === 'Dostępne' ? 'blue' : 
                  propertyData.status === 'W remoncie' ? 'yellow' : 
                  'purple'
                } 
              />
            </div>
            
            <div>
              <p className="text-gray-500 text-sm">Size</p>
              <p className="font-medium">{propertyData.size} m²</p>
            </div>
            
            <div>
              <p className="text-gray-500 text-sm">Rooms</p>
              <p className="font-medium">{propertyData.rooms}</p>
            </div>
            
            <div>
              <p className="text-gray-500 text-sm">Floor</p>
              <p className="font-medium">{propertyData.floor}</p>
            </div>
            
            <div>
              <p className="text-gray-500 text-sm">Balcony</p>
              <p className="font-medium">{propertyData.hasBalcony ? 'Yes' : 'No'}</p>
            </div>
            
            <div>
              <p className="text-gray-500 text-sm">Parking Space</p>
              <p className="font-medium">{propertyData.hasParkingSpace ? 'Yes' : 'No'}</p>
            </div>
          </div>
          
          <h4 className="font-medium mt-6 mb-2">Utilities and Amenities</h4>
          <div className="grid grid-cols-2 gap-4">
            {propertyData.features.map((feature, index) => (
              <div key={index} className="flex items-center">
                {feature.name === 'Heating' && <Thermometer size={16} className="mr-2 text-red-500" />}
                {feature.name === 'Water' && <Droplets size={16} className="mr-2 text-blue-500" />}
                {feature.name === 'Energy' && <Zap size={16} className="mr-2 text-yellow-500" />}
                {feature.name === 'Internet' && <Wifi size={16} className="mr-2 text-green-500" />}
                <div>
                  <p className="text-gray-500 text-sm">{feature.name}</p>
                  <p className="font-medium">{feature.value}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6">
            <p className="text-gray-500 text-sm mb-2">Additional Amenities</p>
            <div className="flex flex-wrap gap-2">
              {propertyData.amenities.map((amenity, index) => (
                <span 
                  key={index}
                  className={`px-2 py-1 rounded-full text-xs ${
                    darkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-800'
                  }`}
                >
                  {amenity}
                </span>
              ))}
            </div>
          </div>
          
          <div className="mt-4 flex space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center"
              onClick={() => window.print()}
            >
              <Printer size={14} className="mr-1" />
              Print
            </Button>
            
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center"
              onClick={() => alert('Sharing options would appear here')}
            >
              <Share2 size={14} className="mr-1" />
              Share
            </Button>
          </div>
        </Card>
        
        <Card darkMode={darkMode}>
          <h3 className="font-semibold mb-4 flex items-center">
            <Users size={20} className="mr-2" />
            Tenant Information
          </h3>
          
          {propertyData.status === 'Wynajęte' ? (
            <>
              <div className="flex items-center mb-4">
                <div className={`h-10 w-10 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} flex items-center justify-center text-xl font-semibold mr-3`}>
                  {propertyData.tenantName.charAt(0)}
                </div>
                <div>
                  <p className="font-medium">{propertyData.tenantName}</p>
                  <p className="text-gray-500 text-sm">Active tenant</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center">
                  <Phone size={16} className="mr-2 text-gray-500" />
                  <span>{propertyData.tenantPhone}</span>
                </div>
                <div className="flex items-center">
                  <Mail size={16} className="mr-2 text-gray-500" />
                  <span>{propertyData.tenantEmail}</span>
                </div>
                <div className="flex items-center">
                  <Calendar size={16} className="mr-2 text-gray-500" />
                  <div>
                    <p className="text-gray-500 text-sm">Lease Period</p>
                    <p>{propertyData.leaseStart} - {propertyData.leaseEnd}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <DollarSign size={16} className="mr-2 text-gray-500" />
                  <div>
                    <p className="text-gray-500 text-sm">Monthly Rent</p>
                    <p className="font-medium">{propertyData.price.toLocaleString()} PLN</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Clock size={16} className="mr-2 text-gray-500" />
                  <div>
                    <p className="text-gray-500 text-sm">Last Payment</p>
                    <p>{propertyData.lastPayment}</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex justify-between">
                <Button 
                  size="sm"
                  className="flex items-center"
                  variant="outline"
                  onClick={prepareContactMessage}
                >
                  <MessageSquare size={16} className="mr-1" />
                  Contact
                </Button>
                <Button 
                  size="sm"
                  className="flex items-center"
                  variant="outline"
                  onClick={() => alert("Lease document would open here")}
                >
                  <FileText size={16} className="mr-1" />
                  Lease
                </Button>
                <Button 
                  size="sm"
                  className="flex items-center"
                  variant="outline"
                  onClick={() => alert("Payment history would show here")}
                >
                  <ArrowUpRight size={16} className="mr-1" />
                  Payments
                </Button>
              </div>
              
              {/* Tenant insights from AI */}
              {aiAnalysis && (
                <div className="mt-4 p-3 rounded-lg bg-blue-50 dark:bg-blue-900 dark:bg-opacity-20 border-l-4 border-blue-500">
                  <h4 className="font-medium mb-2 flex items-center">
                    <BrainCircuit size={16} className="mr-2 text-blue-500" />
                    Tenant Insights
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Payment History:</span>
                      <span className="text-sm font-medium">
                        {aiAnalysis.paymentHistory.onTime} on-time, {aiAnalysis.paymentHistory.late} late
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Renewal Probability:</span>
                      <span className="text-sm font-medium text-green-600">{aiAnalysis.renewalProbability}%</span>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-10">
              <Users size={48} className="mx-auto mb-4 text-gray-400" />
              <p className="text-gray-500">No active tenant</p>
              <Button className="mt-4">Add Tenant</Button>
            </div>
          )}
        </Card>
      </div>
      
      {/* Property description */}
      <Card darkMode={darkMode}>
        <h3 className="font-semibold mb-4">Property Description</h3>
        <p className="text-gray-700 dark:text-gray-300">{propertyData.description}</p>
      </Card>
      
      {/* Location map placeholder */}
      <Card darkMode={darkMode}>
        <h3 className="font-semibold mb-4 flex items-center">
          <MapPin size={20} className="mr-2" />
          Location
        </h3>
        
        <div className="aspect-video rounded-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
          <div className="text-gray-500 dark:text-gray-400 text-center">
            <MapPin size={32} className="mb-2 mx-auto" />
            <p>Interactive map would appear here</p>
            <p className="text-sm mt-1">{propertyData.address}</p>
          </div>
        </div>
      </Card>
      
      {/* Notes */}
      <Card darkMode={darkMode}>
        <h3 className="font-semibold mb-4">Notes</h3>
        <p className="text-gray-700 dark:text-gray-300">{propertyData.notes}</p>
      </Card>
      
      {/* Photos placeholder */}
      <Card darkMode={darkMode}>
        <h3 className="font-semibold mb-4 flex items-center">
          <Camera size={20} className="mr-2" />
          Photos
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div 
              key={i}
              className="aspect-video rounded-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center"
            >
              <Camera size={32} className="text-gray-400" />
            </div>
          ))}
        </div>
        <div className="mt-3 text-center">
          <Button
            variant="outline"
            size="sm"
          >
            Add Photos
          </Button>
        </div>
      </Card>
    </div>
  );

  // Function to render the history tab
  const renderHistory = () => (
    <div className="space-y-6">
      <Card darkMode={darkMode}>
        <h3 className="font-semibold mb-4">Property History</h3>
        
        <div className="relative">
          {/* Timeline line */}
          <div 
            className={`absolute left-3 top-4 bottom-0 w-0.5 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}
          ></div>
          
          <div className="space-y-6">
            {propertyData.history.map((event, index) => (
              <div key={index} className="flex">
                <div className={`h-6 w-6 rounded-full ${darkMode ? 'bg-blue-600' : 'bg-blue-500'} flex-shrink-0 z-10 mt-1`}></div>
                <div className="ml-4">
                  <p className="text-gray-500 text-sm">{event.date}</p>
                  <p className="font-medium">{event.action}</p>
                  <p className="text-gray-700 dark:text-gray-300">{event.details}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
      
      {/* Additional document records */}
      <Card darkMode={darkMode}>
        <h3 className="font-semibold mb-4">Documents</h3>
        
        <div className="space-y-3">
          <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} flex justify-between items-center`}>
            <div className="flex items-center">
              <FileText size={18} className="mr-3 text-blue-500" />
              <div>
                <p className="font-medium">Lease Agreement</p>
                <p className="text-sm text-gray-500">01.01.2025 • PDF</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center"
              onClick={() => alert("Document would download here")}
            >
              <Download size={14} className="mr-1" />
              Download
            </Button>
          </div>
          
          <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} flex justify-between items-center`}>
            <div className="flex items-center">
              <FileText size={18} className="mr-3 text-green-500" />
              <div>
                <p className="font-medium">Property Inspection Report</p>
                <p className="text-sm text-gray-500">15.12.2024 • PDF</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center"
              onClick={() => alert("Document would download here")}
            >
              <Download size={14} className="mr-1" />
              Download
            </Button>
          </div>
          
          <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} flex justify-between items-center`}>
            <div className="flex items-center">
              <FileText size={18} className="mr-3 text-yellow-500" />
              <div>
                <p className="font-medium">Insurance Policy</p>
                <p className="text-sm text-gray-500">05.01.2025 • PDF</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center"
              onClick={() => alert("Document would download here")}
            >
              <Download size={14} className="mr-1" />
              Download
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );

  // Function to render the finances tab
  const renderFinances = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card darkMode={darkMode}>
          <h3 className="font-semibold mb-4">Monthly Rent</h3>
          <div className="text-3xl font-bold text-green-600">{propertyData.price.toLocaleString()} PLN</div>
          <p className="text-gray-500">per month</p>
          
          {aiAnalysis && (
            <div className="mt-2 flex items-center">
              {aiAnalysis.marketComparison === 'above' ? (
                <span className="text-green-500 flex items-center text-sm">
                  <TrendingUp size={14} className="mr-1" />
                  {aiAnalysis.marketComparisonPercent}% above market average
                </span>
              ) : (
                <span className="text-red-500 flex items-center text-sm">
                  <TrendingDown size={14} className="mr-1" />
                  {aiAnalysis.marketComparisonPercent}% below market average
                </span>
              )}
            </div>
          )}
        </Card>
        
        <Card darkMode={darkMode}>
          <h3 className="font-semibold mb-4">Average Expenses</h3>
          <div className="text-3xl font-bold text-red-600">
            {Math.round(propertyData.expenses.reduce((sum, expense) => sum + expense.total, 0) / propertyData.expenses.length).toLocaleString()} PLN
          </div>
          <p className="text-gray-500">per month</p>
          
          {aiAnalysis && (
            <div className="mt-2 flex items-center">
              {aiAnalysis.maintenanceCostTrend === 'down' ? (
                <span className="text-green-500 flex items-center text-sm">
                  <TrendingDown size={14} className="mr-1" />
                  {aiAnalysis.maintenanceCostTrendPercent}% decrease in maintenance costs
                </span>
              ) : (
                <span className="text-red-500 flex items-center text-sm">
                  <TrendingUp size={14} className="mr-1" />
                  {aiAnalysis.maintenanceCostTrendPercent}% increase in maintenance costs
                </span>
              )}
            </div>
          )}
        </Card>
        
        <Card darkMode={darkMode}>
          <h3 className="font-semibold mb-4">Profit</h3>
          <div className="text-3xl font-bold text-blue-600">
            {(propertyData.price - Math.round(propertyData.expenses.reduce((sum, expense) => sum + expense.total, 0) / propertyData.expenses.length)).toLocaleString()} PLN
          </div>
          <p className="text-gray-500">per month</p>
          
          {aiAnalysis && (
            <div className="mt-2 flex items-center">
              <span className="text-blue-500 flex items-center text-sm">
                <PieChart size={14} className="mr-1" />
                {aiAnalysis.rentalYield}% rental yield
              </span>
            </div>
          )}
        </Card>
      </div>
      
      <Card darkMode={darkMode}>
        <h3 className="font-semibold mb-4">Maintenance Costs</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className={darkMode ? 'border-b border-gray-700' : 'border-b'}>
                <th className="py-2 text-left">Month</th>
                <th className="py-2 text-right">Administration</th>
                <th className="py-2 text-right">Utilities</th>
                <th className="py-2 text-right">Repairs</th>
                <th className="py-2 text-right">Other</th>
                <th className="py-2 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {propertyData.expenses.map((expense, index) => (
                <tr key={index} className={darkMode ? 'border-b border-gray-700' : 'border-b'}>
                  <td className="py-2">{expense.month}</td>
                  <td className="py-2 text-right">{expense.administration} PLN</td>
                  <td className="py-2 text-right">{expense.utilities} PLN</td>
                  <td className="py-2 text-right">{expense.repairs} PLN</td>
                  <td className="py-2 text-right">{expense.other} PLN</td>
                  <td className="py-2 text-right font-medium">{expense.total} PLN</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      
      {/* Financial projections from AI */}
      {aiAnalysis && (
        <Card darkMode={darkMode}>
          <h3 className="font-semibold mb-4 flex items-center">
            <BrainCircuit size={20} className="mr-2 text-blue-500" />
            AI Financial Projections
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className={`p-4 rounded-lg ${darkMode ? 'bg-blue-900 bg-opacity-20' : 'bg-blue-50'}`}>
              <h4 className="text-sm text-gray-500">1 Year Revenue</h4>
              <p className="text-2xl font-bold">{aiAnalysis.financialProjection.year1.toLocaleString()} PLN</p>
            </div>
            
            <div className={`p-4 rounded-lg ${darkMode ? 'bg-blue-900 bg-opacity-20' : 'bg-blue-50'}`}>
              <h4 className="text-sm text-gray-500">3 Year Revenue</h4>
              <p className="text-2xl font-bold">{aiAnalysis.financialProjection.year3.toLocaleString()} PLN</p>
            </div>
            
            <div className={`p-4 rounded-lg ${darkMode ? 'bg-blue-900 bg-opacity-20' : 'bg-blue-50'}`}>
              <h4 className="text-sm text-gray-500">5 Year Revenue</h4>
              <p className="text-2xl font-bold">{aiAnalysis.financialProjection.year5.toLocaleString()} PLN</p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );

  // Function to render the AI Analysis tab
  const renderAIAnalysis = () => (
    <div className="space-y-6">
      {isAILoading ? (
        <Card darkMode={darkMode}>
          <div className="flex items-center justify-center p-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mr-3"></div>
            <p>AI is analyzing this property...</p>
          </div>
        </Card>
      ) : aiAnalysis ? (
        <>
          <Card darkMode={darkMode}>
            <h3 className="font-semibold mb-4 flex items-center">
              <BrainCircuit size={20} className="mr-2 text-blue-500" />
              AI Property Analysis
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-3">Financial Metrics</h4>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Rental Yield:</span>
                    <span className="font-medium text-green-600">{aiAnalysis.rentalYield}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Market Rate Comparison:</span>
                    <span className={`font-medium ${aiAnalysis.marketComparison === 'above' ? 'text-green-600' : 'text-red-600'}`}>
                      {aiAnalysis.marketComparison === 'above' ? '+' : '-'}{aiAnalysis.marketComparisonPercent}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Occupancy Rate:</span>
                    <span className="font-medium">{aiAnalysis.occupancyRate}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Average Maintenance Cost:</span>
                    <span className="font-medium">{aiAnalysis.maintenanceCost} PLN/month</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Rental Trend:</span>
                    <span className={`font-medium flex items-center ${aiAnalysis.rentalTrend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                      {aiAnalysis.rentalTrend === 'up' ? (
                        <><TrendingUp size={14} className="mr-1" />+{aiAnalysis.rentalTrendPercent}%</>
                      ) : (
                        <><TrendingDown size={14} className="mr-1" />-{aiAnalysis.rentalTrendPercent}%</>
                      )}
                    </span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-3">Performance Insights</h4>
                <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} mb-4`}>
                  <div className="flex justify-between items-center mb-2">
                    <span>Payment History</span>
                    <div>
                      <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-1"></span>
                      <span className="text-sm">{aiAnalysis.paymentHistory.onTime} on time</span>
                      <span className="mx-1">|</span>
                      <span className="inline-block w-3 h-3 bg-red-500 rounded-full mr-1"></span>
                      <span className="text-sm">{aiAnalysis.paymentHistory.late} late</span>
                    </div>
                  </div>
                  <div className="h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-green-500" 
                      style={{ width: `${(aiAnalysis.paymentHistory.onTime / (aiAnalysis.paymentHistory.onTime + aiAnalysis.paymentHistory.late)) * 100}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                  <div className="flex justify-between items-center mb-2">
                    <span>Renewal Probability</span>
                    <span className="text-sm">{aiAnalysis.renewalProbability}%</span>
                  </div>
                  <div className="h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${aiAnalysis.renewalProbability > 70 ? 'bg-green-500' : 'bg-yellow-500'}`}
                      style={{ width: `${aiAnalysis.renewalProbability}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <h4 className="font-medium mb-3">AI Recommendations</h4>
              <div className="space-y-3">
                {aiAnalysis.recommendations.map((recommendation, index) => (
                  <div 
                    key={index}
                    className={`p-3 rounded-lg border-l-4 border-blue-500 ${darkMode ? 'bg-blue-900 bg-opacity-20' : 'bg-blue-50'}`}
                  >
                    <div className="flex items-start">
                      <div className="rounded-full bg-blue-100 p-1 dark:bg-blue-800 mr-2">
                        {index === 0 ? (
                          <TrendingUp size={16} className="text-blue-600 dark:text-blue-400" />
                        ) : index === 1 ? (
                          <Wrench size={16} className="text-blue-600 dark:text-blue-400" />
                        ) : (
                          <Camera size={16} className="text-blue-600 dark:text-blue-400" />
                        )}
                      </div>
                      <p>{recommendation}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
          
          <Card darkMode={darkMode}>
            <h3 className="font-semibold mb-4">Similar Properties</h3>
            
            <div className="space-y-3">
              {aiAnalysis.similarProperties.map((property, index) => (
                <div 
                  key={index}
                  className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} flex justify-between items-center`}
                >
                  <div className="flex items-center">
                    <Home size={18} className="mr-3 text-blue-500" />
                    <div>
                      <p className="font-medium">{property.name}</p>
                      <p className="text-sm text-gray-500">{property.address}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{property.price.toLocaleString()} PLN</p>
                    <Button
                      variant="link"
                      size="sm"
                      className="flex items-center"
                      onClick={() => alert(`Would navigate to property ${property.id}`)}
                    >
                      <ArrowRight size={14} className="mr-1" />
                      View
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </>
      ) : (
        <Card darkMode={darkMode}>
          <div className="text-center py-12">
            <BrainCircuit size={48} className="mx-auto mb-4 text-blue-500" />
            <h3 className="text-xl font-semibold mb-2">AI Analysis</h3>
            <p className="text-gray-500 mb-6">Generate AI insights about this property based on market data and performance</p>
            <Button
              onClick={generateAIAnalysis}
              className="mx-auto"
            >
              Generate AI Analysis
            </Button>
          </div>
        </Card>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <button 
            onClick={onBack}
            className={`mr-2 p-1 rounded-full ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
          >
            <ChevronLeft size={24} />
          </button>
          <h2 className="text-2xl font-semibold">{propertyData.name}</h2>
        </div>
        
        <div className="flex space-x-2">
          <Button 
            variant={showAIAnalysis ? "outline" : "primary"}
            className="flex items-center"
            color="blue"
            onClick={() => {
              if (showAIAnalysis) {
                setShowAIAnalysis(false);
                setActiveTab('overview');
              } else {
                setShowAIAnalysis(true);
                setActiveTab('aiAnalysis');
                if (!aiAnalysis && !isAILoading) {
                  generateAIAnalysis();
                }
              }
            }}
          >
            <BrainCircuit size={16} className="mr-2" />
            {showAIAnalysis ? 'Hide AI Analysis' : 'AI Analysis'}
          </Button>
          
          <Button 
            onClick={() => alert("Edit form would appear here")}
            className="flex items-center"
          >
            <Edit size={16} className="mr-2" />
            Edit
          </Button>
        </div>
      </div>
      
      <Card darkMode={darkMode} className="p-0 overflow-hidden">
        <div className="px-4 py-2 border-b dark:border-gray-700">
          <p className="font-medium">Address: {propertyData.address}</p>
        </div>
      </Card>
      
      {/* Tab navigation */}
      <div className="flex border-b dark:border-gray-700 pb-2 overflow-x-auto">
        <button
          className={`pb-2 mr-6 font-medium whitespace-nowrap ${
            activeTab === 'overview' 
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-500'
          }`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button
          className={`pb-2 mr-6 font-medium whitespace-nowrap ${
            activeTab === 'history' 
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-500'
          }`}
          onClick={() => setActiveTab('history')}
        >
          History
        </button>
        <button
          className={`pb-2 mr-6 font-medium whitespace-nowrap ${
            activeTab === 'finances' 
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-500'
          }`}
          onClick={() => setActiveTab('finances')}
        >
          Finances
        </button>
        {showAIAnalysis && (
          <button
            className={`pb-2 mr-6 font-medium whitespace-nowrap ${
              activeTab === 'aiAnalysis' 
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500'
            }`}
            onClick={() => setActiveTab('aiAnalysis')}
          >
            AI Analysis
          </button>
        )}
      </div>
      
      {/* Tab content */}
      {activeTab === 'overview' && renderOverview()}
      {activeTab === 'history' && renderHistory()}
      {activeTab === 'finances' && renderFinances()}
      {activeTab === 'aiAnalysis' && renderAIAnalysis()}
      
      {/* Contact tenant modal */}
      {showContactTenant && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`max-w-2xl w-full p-6 rounded-lg shadow-xl ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <h3 className="text-xl font-semibold mb-4">Contact Tenant</h3>
            
            <div className="mb-4">
              <p className="text-gray-500 mb-1">To: {propertyData.tenantName} ({propertyData.tenantEmail})</p>
              <p className="text-gray-500">Subject: Regarding your lease at {propertyData.address}</p>
            </div>
            
            <textarea
              value={contactMessage}
              onChange={(e) => setContactMessage(e.target.value)}
              rows={8}
              className={`w-full px-3 py-2 border rounded-lg ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
            />
            
            <div className="mt-4 flex justify-end space-x-2">
              <Button 
                variant="outline" 
                onClick={() => setShowContactTenant(false)}
              >
                Cancel
              </Button>
              <Button 
                onClick={sendMessage}
              >
                Send Message
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedPropertyDetails;