import React, { useState, useEffect } from 'react';
import { LogOut, Moon, Sun, Save, AlertCircle, CheckCircle, Settings, Cpu, FileText, Mail, Calendar, BarChart2, MessageSquare, Wrench, Sliders } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

const ChimneySettings = ({ darkMode, setDarkMode, user, onLogout }) => {
  // State for form data and UI
  const [accountData, setAccountData] = useState({
    companyName: 'Usługi Kominiarskie Sp. z o.o.',
    email: 'biuro@kominiarz.pl',
    nip: '987-654-32-10',
    ceebLogin: 'kominiarz_ceeb',
    ceebPassword: '********',
    apiKey: 'ceeb_api_key_12345',
    aiFeatures: {
      inspectionAnalysis: true,
      autoReportGeneration: true,
      predictiveMaintenance: true,
      emailTemplates: true,
      scheduleOptimization: false
    },
    aiSensitivity: 75,
    reportTemplates: ['Standardowy', 'Rozszerzony', 'CEEB'],
    smartNotifications: true,
    dataBackup: true
  });
  
  // State for form submission
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState(null); // 'success', 'error', or null
  const [submittingSection, setSubmittingSection] = useState(null);
  
  // Active section management
  const [activeSection, setActiveSection] = useState('account');
  
  // State for AI analysis demo
  const [analysisInProgress, setAnalysisInProgress] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  
  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setAccountData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };
  
  // Handle checkbox changes for AI features
  const handleAIFeatureChange = (feature) => {
    setAccountData(prevData => ({
      ...prevData,
      aiFeatures: {
        ...prevData.aiFeatures,
        [feature]: !prevData.aiFeatures[feature]
      }
    }));
  };
  
  // Handle other checkbox settings
  const handleCheckboxChange = (setting) => {
    setAccountData(prevData => ({
      ...prevData,
      [setting]: !prevData[setting]
    }));
  };
  
  // Handle form submissions
  const handleSubmit = (section) => {
    setIsSubmitting(true);
    setSubmittingSection(section);
    
    // Simulate API call with timeout
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitResult('success');
      
      // Reset success message after a delay
      setTimeout(() => {
        setSubmitResult(null);
        setSubmittingSection(null);
      }, 3000);
    }, 1500);
  };
  
  // Run AI analysis demo
  const runAIAnalysis = () => {
    setAnalysisInProgress(true);
    
    // Simulate analysis completion after delay
    setTimeout(() => {
      setAnalysisInProgress(false);
      setAnalysisComplete(true);
      
      // Reset after 5 seconds
      setTimeout(() => {
        setAnalysisComplete(false);
      }, 5000);
    }, 3000);
  };
  
  // Render Account Settings section
  const renderAccountSettings = () => (
    <Card darkMode={darkMode}>
      <h3 className="font-semibold mb-4">Dane firmy</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-gray-500 mb-1">Nazwa firmy</label>
          <input
            type="text"
            name="companyName"
            value={accountData.companyName}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
          />
        </div>
        
        <div>
          <label className="block text-gray-500 mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={accountData.email}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
          />
        </div>
        
        <div>
          <label className="block text-gray-500 mb-1">NIP</label>
          <input
            type="text"
            name="nip"
            value={accountData.nip}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
          />
        </div>
      </div>
      
      <div className="mt-4 flex justify-end">
        <Button 
          onClick={() => handleSubmit('account')}
          color="red"
          disabled={isSubmitting && submittingSection === 'account'}
          className="flex items-center"
        >
          {isSubmitting && submittingSection === 'account' ? (
            <>
              <div className="mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Zapisywanie...
            </>
          ) : (
            <>
              <Save size={16} className="mr-2" />
              Zapisz zmiany
            </>
          )}
        </Button>
      </div>
      
      {submitResult === 'success' && submittingSection === 'account' && (
        <div className="mt-4 p-3 bg-green-100 border-l-4 border-green-500 text-green-700 dark:bg-green-900 dark:border-green-500 dark:text-green-100 flex items-center">
          <CheckCircle size={20} className="mr-2 flex-shrink-0" />
          <span>Zmiany zostały zapisane pomyślnie!</span>
        </div>
      )}
    </Card>
  );
  
  // Render CEEB Settings section
  const renderCEEBSettings = () => (
    <Card darkMode={darkMode}>
      <h3 className="font-semibold mb-4">Dane CEEB</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-gray-500 mb-1">Login CEEB</label>
          <input
            type="text"
            name="ceebLogin"
            value={accountData.ceebLogin}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
          />
        </div>
        
        <div>
          <label className="block text-gray-500 mb-1">Hasło CEEB</label>
          <div className="flex">
            <input
              type="password"
              name="ceebPassword"
              value={accountData.ceebPassword}
              onChange={handleChange}
              className={`flex-1 px-3 py-2 border rounded-lg ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
            />
            <Button
              variant="outline"
              color="red"
              className="ml-2"
            >
              Zmień hasło
            </Button>
          </div>
        </div>
        
        <div>
          <label className="block text-gray-500 mb-1">API Key</label>
          <input
            type="text"
            name="apiKey"
            value={accountData.apiKey}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
          />
          <p className="text-sm text-gray-500 mt-1">
            Klucz API jest używany do automatycznego zgłaszania kontroli do systemu CEEB.
          </p>
        </div>
        
        <div className="mt-2 p-3 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800 dark:bg-yellow-900 dark:border-yellow-500 dark:text-yellow-100 flex items-start">
          <AlertCircle size={20} className="mr-2 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium">Ważne przypomnienie</p>
            <p className="text-sm">Twoje zgłoszenia do CEEB muszą być dokonywane w terminie 7 dni od przeprowadzenia kontroli. System będzie automatycznie przygotowywał zgłoszenia dla kontroli zbliżających się do tego terminu.</p>
          </div>
        </div>
      </div>
      
      <div className="mt-4 flex justify-end">
        <Button 
          onClick={() => handleSubmit('ceeb')}
          color="red"
          disabled={isSubmitting && submittingSection === 'ceeb'}
          className="flex items-center"
        >
          {isSubmitting && submittingSection === 'ceeb' ? (
            <>
              <div className="mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Zapisywanie...
            </>
          ) : (
            <>
              <Save size={16} className="mr-2" />
              Zapisz zmiany
            </>
          )}
        </Button>
      </div>
      
      {submitResult === 'success' && submittingSection === 'ceeb' && (
        <div className="mt-4 p-3 bg-green-100 border-l-4 border-green-500 text-green-700 dark:bg-green-900 dark:border-green-500 dark:text-green-100 flex items-center">
          <CheckCircle size={20} className="mr-2 flex-shrink-0" />
          <span>Dane CEEB zostały zapisane pomyślnie!</span>
        </div>
      )}
    </Card>
  );
  
  // Render AI Features section
  const renderAIFeatures = () => (
    <Card darkMode={darkMode}>
      <h3 className="font-semibold mb-4 flex items-center">
        <Cpu size={20} className="mr-2" />
        Funkcje AI
      </h3>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between p-3 rounded-lg border dark:border-gray-700">
          <div className="flex-1">
            <p className="font-medium">Analiza inspekcji</p>
            <p className="text-sm text-gray-500">
              AI analizuje zdjęcia i dane z kontroli, aby wykryć potencjalne problemy i zasugerować rozwiązania.
            </p>
          </div>
          <div className="ml-4">
            <button 
              className={`relative w-12 h-6 rounded-full transition-colors ${
                accountData.aiFeatures.inspectionAnalysis ? 'bg-red-500' : darkMode ? 'bg-gray-600' : 'bg-gray-300'
              }`}
              onClick={() => handleAIFeatureChange('inspectionAnalysis')}
            >
              <span 
                className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform transform ${
                  accountData.aiFeatures.inspectionAnalysis ? 'translate-x-6' : ''
                }`} 
              />
            </button>
          </div>
        </div>
        
        <div className="flex items-center justify-between p-3 rounded-lg border dark:border-gray-700">
          <div className="flex-1">
            <p className="font-medium">Automatyczne generowanie raportów</p>
            <p className="text-sm text-gray-500">
              AI generuje szczegółowe raporty na podstawie danych z kontroli, oszczędzając czas technikom.
            </p>
          </div>
          <div className="ml-4">
            <button 
              className={`relative w-12 h-6 rounded-full transition-colors ${
                accountData.aiFeatures.autoReportGeneration ? 'bg-red-500' : darkMode ? 'bg-gray-600' : 'bg-gray-300'
              }`}
              onClick={() => handleAIFeatureChange('autoReportGeneration')}
            >
              <span 
                className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform transform ${
                  accountData.aiFeatures.autoReportGeneration ? 'translate-x-6' : ''
                }`} 
              />
            </button>
          </div>
        </div>
        
        <div className="flex items-center justify-between p-3 rounded-lg border dark:border-gray-700">
          <div className="flex-1">
            <p className="font-medium">Predykcyjna konserwacja</p>
            <p className="text-sm text-gray-500">
              AI przewiduje potencjalne problemy na podstawie historycznych danych i sugeruje harmonogram konserwacji.
            </p>
          </div>
          <div className="ml-4">
            <button 
              className={`relative w-12 h-6 rounded-full transition-colors ${
                accountData.aiFeatures.predictiveMaintenance ? 'bg-red-500' : darkMode ? 'bg-gray-600' : 'bg-gray-300'
              }`}
              onClick={() => handleAIFeatureChange('predictiveMaintenance')}
            >
              <span 
                className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform transform ${
                  accountData.aiFeatures.predictiveMaintenance ? 'translate-x-6' : ''
                }`} 
              />
            </button>
          </div>
        </div>
        
        <div className="flex items-center justify-between p-3 rounded-lg border dark:border-gray-700">
          <div className="flex-1">
            <p className="font-medium">Szablony emaili</p>
            <p className="text-sm text-gray-500">
              AI generuje profesjonalne szablony emaili do komunikacji z klientami.
            </p>
          </div>
          <div className="ml-4">
            <button 
              className={`relative w-12 h-6 rounded-full transition-colors ${
                accountData.aiFeatures.emailTemplates ? 'bg-red-500' : darkMode ? 'bg-gray-600' : 'bg-gray-300'
              }`}
              onClick={() => handleAIFeatureChange('emailTemplates')}
            >
              <span 
                className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform transform ${
                  accountData.aiFeatures.emailTemplates ? 'translate-x-6' : ''
                }`} 
              />
            </button>
          </div>
        </div>
        
        <div className="flex items-center justify-between p-3 rounded-lg border dark:border-gray-700">
          <div className="flex-1">
            <p className="font-medium">Optymalizacja harmonogramu</p>
            <p className="text-sm text-gray-500">
              AI optymalizuje rozkład kontroli, aby zminimalizować czas i koszty dojazdu.
            </p>
          </div>
          <div className="ml-4">
            <button 
              className={`relative w-12 h-6 rounded-full transition-colors ${
                accountData.aiFeatures.scheduleOptimization ? 'bg-red-500' : darkMode ? 'bg-gray-600' : 'bg-gray-300'
              }`}
              onClick={() => handleAIFeatureChange('scheduleOptimization')}
            >
              <span 
                className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform transform ${
                  accountData.aiFeatures.scheduleOptimization ? 'translate-x-6' : ''
                }`} 
              />
            </button>
          </div>
        </div>
        
        <div className="mt-6">
          <label className="block text-gray-500 mb-1">Czułość AI</label>
          <div className="flex items-center space-x-2">
            <span className="text-sm">Niska</span>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={accountData.aiSensitivity}
              onChange={(e) => handleChange({target: {name: 'aiSensitivity', value: e.target.value}})}
              className="flex-1"
            />
            <span className="text-sm">Wysoka</span>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Wyższa czułość może wykrywać więcej problemów, ale może też generować więcej fałszywych alarmów.
          </p>
        </div>
        
        <div className="mt-6">
          <Button
            color="red"
            variant="outline"
            className="flex items-center"
            onClick={runAIAnalysis}
            disabled={analysisInProgress}
          >
            {analysisInProgress ? (
              <>
                <div className="mr-2 h-4 w-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                Analizowanie danych...
              </>
            ) : (
              <>
                <BarChart2 size={16} className="mr-2" />
                Testuj analizę AI
              </>
            )}
          </Button>
          
          {analysisComplete && (
            <div className="mt-4 p-3 bg-green-100 border-l-4 border-green-500 text-green-700 dark:bg-green-900 dark:border-green-500 dark:text-green-100">
              <p className="font-medium">Analiza zakończona</p>
              <p className="text-sm">AI przeanalizowała dane z 83 kontroli i zidentyfikowała 12 potencjalnych problemów wymagających uwagi.</p>
            </div>
          )}
        </div>
      </div>
      
      <div className="mt-4 flex justify-end">
        <Button 
          onClick={() => handleSubmit('ai')}
          color="red"
          disabled={isSubmitting && submittingSection === 'ai'}
          className="flex items-center"
        >
          {isSubmitting && submittingSection === 'ai' ? (
            <>
              <div className="mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Zapisywanie...
            </>
          ) : (
            <>
              <Save size={16} className="mr-2" />
              Zapisz ustawienia AI
            </>
          )}
        </Button>
      </div>
      
      {submitResult === 'success' && submittingSection === 'ai' && (
        <div className="mt-4 p-3 bg-green-100 border-l-4 border-green-500 text-green-700 dark:bg-green-900 dark:border-green-500 dark:text-green-100 flex items-center">
          <CheckCircle size={20} className="mr-2 flex-shrink-0" />
          <span>Ustawienia AI zostały zapisane pomyślnie!</span>
        </div>
      )}
    </Card>
  );
  
  // Render Templates section
  const renderTemplates = () => (
    <Card darkMode={darkMode}>
      <h3 className="font-semibold mb-4 flex items-center">
        <FileText size={20} className="mr-2" />
        Szablony
      </h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-gray-500 mb-1">Szablony raportów</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {accountData.reportTemplates.map((template, index) => (
              <div 
                key={index}
                className={`p-3 rounded-lg border ${darkMode ? 'border-gray-700' : 'border-gray-300'} flex justify-between items-center`}
              >
                <span>{template}</span>
                <Button
                  variant="link"
                  size="sm"
                >
                  Edytuj
                </Button>
              </div>
            ))}
            
            <Button
              variant="outline"
              color="red"
              className="flex items-center justify-center h-full min-h-[60px]"
            >
              + Dodaj szablon
            </Button>
          </div>
        </div>
        
        <div>
          <label className="block text-gray-500 mb-1">Szablony emaili</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div 
              className={`p-3 rounded-lg border ${darkMode ? 'border-gray-700' : 'border-gray-300'} flex justify-between items-center`}
            >
              <span>Przypomnienie o kontroli</span>
              <Button
                variant="link"
                size="sm"
              >
                Edytuj
              </Button>
            </div>
            
            <div 
              className={`p-3 rounded-lg border ${darkMode ? 'border-gray-700' : 'border-gray-300'} flex justify-between items-center`}
            >
              <span>Potwierdzenie kontroli</span>
              <Button
                variant="link"
                size="sm"
              >
                Edytuj
              </Button>
            </div>
            
            <div 
              className={`p-3 rounded-lg border ${darkMode ? 'border-gray-700' : 'border-gray-300'} flex justify-between items-center`}
            >
              <span>Raport po kontroli</span>
              <Button
                variant="link"
                size="sm"
              >
                Edytuj
              </Button>
            </div>
            
            <Button
              variant="outline"
              color="red"
              className="flex items-center justify-center h-full min-h-[60px]"
            >
              + Dodaj szablon emaila
            </Button>
          </div>
        </div>
        
        <div className="flex items-center mt-6">
          <div className="flex-1">
            <p className="font-medium">Asystent AI dla szablonów</p>
            <p className="text-sm text-gray-500">
              Włącz, aby AI pomagała w tworzeniu i ulepszaniu szablonów raportów i komunikacji.
            </p>
          </div>
          <div className="ml-4">
            <button 
              className={`relative w-12 h-6 rounded-full transition-colors ${
                true ? 'bg-red-500' : darkMode ? 'bg-gray-600' : 'bg-gray-300'
              }`}
            >
              <span 
                className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform transform translate-x-6`} 
              />
            </button>
          </div>
        </div>
      </div>
      
      <div className="mt-4 flex justify-end">
        <Button 
          onClick={() => handleSubmit('templates')}
          color="red"
          disabled={isSubmitting && submittingSection === 'templates'}
          className="flex items-center"
        >
          {isSubmitting && submittingSection === 'templates' ? (
            <>
              <div className="mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Zapisywanie...
            </>
          ) : (
            <>
              <Save size={16} className="mr-2" />
              Zapisz szablony
            </>
          )}
        </Button>
      </div>
      
      {submitResult === 'success' && submittingSection === 'templates' && (
        <div className="mt-4 p-3 bg-green-100 border-l-4 border-green-500 text-green-700 dark:bg-green-900 dark:border-green-500 dark:text-green-100 flex items-center">
          <CheckCircle size={20} className="mr-2 flex-shrink-0" />
          <span>Szablony zostały zapisane pomyślnie!</span>
        </div>
      )}
    </Card>
  );
  
  // Render Notifications section
  const renderNotifications = () => (
    <Card darkMode={darkMode}>
      <h3 className="font-semibold mb-4 flex items-center">
        <MessageSquare size={20} className="mr-2" />
        Powiadomienia
      </h3>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between p-3 rounded-lg border dark:border-gray-700">
          <div className="flex-1">
            <p className="font-medium">Powiadomienia email</p>
            <p className="text-sm text-gray-500">
              Otrzymuj powiadomienia email o nowych kontrolach, raportach i zgłoszeniach CEEB.
            </p>
          </div>
          <div className="ml-4">
            <button 
              className={`relative w-12 h-6 rounded-full transition-colors bg-red-500`}
            >
              <span 
                className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform transform translate-x-6`} 
              />
            </button>
          </div>
        </div>
        
        <div className="flex items-center justify-between p-3 rounded-lg border dark:border-gray-700">
          <div className="flex-1">
            <p className="font-medium">Powiadomienia w aplikacji</p>
            <p className="text-sm text-gray-500">
              Otrzymuj powiadomienia w aplikacji o ważnych wydarzeniach i zadaniach.
            </p>
          </div>
          <div className="ml-4">
            <button 
              className={`relative w-12 h-6 rounded-full transition-colors bg-red-500`}
            >
              <span 
                className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform transform translate-x-6`} 
              />
            </button>
          </div>
        </div>
        
        <div className="flex items-center justify-between p-3 rounded-lg border dark:border-gray-700">
          <div className="flex-1">
            <p className="font-medium">Inteligentne powiadomienia</p>
            <p className="text-sm text-gray-500">
              AI filtruje powiadomienia, aby pokazywać tylko najważniejsze informacje.
            </p>
          </div>
          <div className="ml-4">
            <button 
              className={`relative w-12 h-6 rounded-full transition-colors ${
                accountData.smartNotifications ? 'bg-red-500' : darkMode ? 'bg-gray-600' : 'bg-gray-300'
              }`}
              onClick={() => handleCheckboxChange('smartNotifications')}
            >
              <span 
                className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform transform ${
                  accountData.smartNotifications ? 'translate-x-6' : ''
                }`} 
              />
            </button>
          </div>
        </div>
        
        <div className="flex items-center justify-between p-3 rounded-lg border dark:border-gray-700">
          <div className="flex-1">
            <p className="font-medium">Terminy CEEB</p>
            <p className="text-sm text-gray-500">
              Otrzymuj powiadomienia o zbliżających się terminach zgłoszeń CEEB.
            </p>
          </div>
          <div className="ml-4">
            <button 
              className={`relative w-12 h-6 rounded-full transition-colors bg-red-500`}
            >
              <span 
                className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform transform translate-x-6`} 
              />
            </button>
          </div>
        </div>
        
        <div className="mt-6">
          <label className="block text-gray-500 mb-1">Częstotliwość powiadomień</label>
          <select
            className={`w-full px-3 py-2 border rounded-lg ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
            defaultValue="daily"
          >
            <option value="realtime">W czasie rzeczywistym</option>
            <option value="hourly">Co godzinę</option>
            <option value="daily">Raz dziennie</option>
            <option value="weekly">Raz w tygodniu</option>
          </select>
        </div>
      </div>
      
      <div className="mt-4 flex justify-end">
        <Button 
          onClick={() => handleSubmit('notifications')}
          color="red"
          disabled={isSubmitting && submittingSection === 'notifications'}
          className="flex items-center"
        >
          {isSubmitting && submittingSection === 'notifications' ? (
            <>
              <div className="mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Zapisywanie...
            </>
          ) : (
            <>
              <Save size={16} className="mr-2" />
              Zapisz ustawienia
            </>
          )}
        </Button>
      </div>
      
      {submitResult === 'success' && submittingSection === 'notifications' && (
        <div className="mt-4 p-3 bg-green-100 border-l-4 border-green-500 text-green-700 dark:bg-green-900 dark:border-green-500 dark:text-green-100 flex items-center">
          <CheckCircle size={20} className="mr-2 flex-shrink-0" />
          <span>Ustawienia powiadomień zostały zapisane pomyślnie!</span>
        </div>
      )}
    </Card>
  );
  
  // Render System section
  const renderSystem = () => (
    <>
      <Card darkMode={darkMode}>
        <h3 className="font-semibold mb-4">Wygląd</h3>
        
        <div className="flex items-center space-x-4">
          <Button 
            onClick={() => setDarkMode(false)}
            variant={!darkMode ? 'primary' : 'outline'}
            color="red"
          >
            <Sun size={16} className="mr-2" />
            Jasny motyw
          </Button>
          
          <Button 
            onClick={() => setDarkMode(true)}
            variant={darkMode ? 'primary' : 'outline'}
            color="red"
          >
            <Moon size={16} className="mr-2" />
            Ciemny motyw
          </Button>
        </div>
      </Card>
      
      <Card darkMode={darkMode} className="mt-6">
        <h3 className="font-semibold mb-4 flex items-center">
          <Wrench size={20} className="mr-2" />
          Ustawienia systemowe
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-lg border dark:border-gray-700">
            <div className="flex-1">
              <p className="font-medium">Automatyczna kopia zapasowa danych</p>
              <p className="text-sm text-gray-500">
                Regularne tworzenie kopii zapasowych danych w chmurze.
              </p>
            </div>
            <div className="ml-4">
              <button 
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  accountData.dataBackup ? 'bg-red-500' : darkMode ? 'bg-gray-600' : 'bg-gray-300'
                }`}
                onClick={() => handleCheckboxChange('dataBackup')}
              >
                <span 
                  className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform transform ${
                    accountData.dataBackup ? 'translate-x-6' : ''
                  }`} 
                />
              </button>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-3 rounded-lg border dark:border-gray-700">
            <div className="flex-1">
              <p className="font-medium">Synchronizacja z urządzeniami mobilnymi</p>
              <p className="text-sm text-gray-500">
                Synchronizuj dane kontroli z aplikacją mobilną dla techników.
              </p>
            </div>
            <div className="ml-4">
              <button 
                className={`relative w-12 h-6 rounded-full transition-colors bg-red-500`}
              >
                <span 
                  className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform transform translate-x-6`} 
                />
              </button>
            </div>
          </div>
          
          <div className="mt-6">
            <Button
              color="red"
              variant="outline"
              className="w-full flex items-center justify-center"
            >
              <Sliders size={16} className="mr-2" />
              Zaawansowane ustawienia systemowe
            </Button>
          </div>
        </div>
      </Card>
      
      <Card darkMode={darkMode} className="mt-6">
        <h3 className="font-semibold mb-4">Konto użytkownika</h3>
        <p className="text-gray-500 mb-4">Zalogowany jako: <span className="font-medium">{user?.username || 'Użytkownik'}</span></p>
        
        {onLogout && (
          <Button 
            color="red"
            variant="outline"
            onClick={onLogout}
            className="flex items-center"
          >
            <LogOut size={16} className="mr-2" />
            Wyloguj się
          </Button>
        )}
      </Card>
    </>
  );
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Ustawienia</h2>
      
      {/* Navigation Tabs */}
      <div className="flex flex-wrap border-b dark:border-gray-700 pb-2 overflow-x-auto">
        <button
          className={`pb-2 mr-6 font-medium whitespace-nowrap ${
            activeSection === 'account' 
              ? 'border-b-2 border-red-500 text-red-600'
              : 'text-gray-500'
          }`}
          onClick={() => setActiveSection('account')}
        >
          Konto
        </button>
        <button
          className={`pb-2 mr-6 font-medium whitespace-nowrap ${
            activeSection === 'ceeb' 
              ? 'border-b-2 border-red-500 text-red-600'
              : 'text-gray-500'
          }`}
          onClick={() => setActiveSection('ceeb')}
        >
          CEEB
        </button>
        <button
          className={`pb-2 mr-6 font-medium whitespace-nowrap ${
            activeSection === 'ai' 
              ? 'border-b-2 border-red-500 text-red-600'
              : 'text-gray-500'
          }`}
          onClick={() => setActiveSection('ai')}
        >
          Funkcje AI
        </button>
        <button
          className={`pb-2 mr-6 font-medium whitespace-nowrap ${
            activeSection === 'templates' 
              ? 'border-b-2 border-red-500 text-red-600'
              : 'text-gray-500'
          }`}
          onClick={() => setActiveSection('templates')}
        >
          Szablony
        </button>
        <button
          className={`pb-2 mr-6 font-medium whitespace-nowrap ${
            activeSection === 'notifications' 
              ? 'border-b-2 border-red-500 text-red-600'
              : 'text-gray-500'
          }`}
          onClick={() => setActiveSection('notifications')}
        >
          Powiadomienia
        </button>
        <button
          className={`pb-2 mr-6 font-medium whitespace-nowrap ${
            activeSection === 'system' 
              ? 'border-b-2 border-red-500 text-red-600'
              : 'text-gray-500'
          }`}
          onClick={() => setActiveSection('system')}
        >
          System
        </button>
      </div>
      
      {/* Section Content */}
      {activeSection === 'account' && renderAccountSettings()}
      {activeSection === 'ceeb' && renderCEEBSettings()}
      {activeSection === 'ai' && renderAIFeatures()}
      {activeSection === 'templates' && renderTemplates()}
      {activeSection === 'notifications' && renderNotifications()}
      {activeSection === 'system' && renderSystem()}
    </div>
  );
};

export default ChimneySettings;