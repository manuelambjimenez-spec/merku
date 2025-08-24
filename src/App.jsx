import { useState, useEffect } from 'react';
import { Shopping } from './components/Shopping';
import { UserProfile } from './components/UserProfile';
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsOfUse from './components/TermsOfUse';
import CookiesPolicy from './components/CookiesPolicy';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('shopping');
  const [usuario, setUsuario] = useState('');
  const [logueado, setLogueado] = useState(false);
  const [isRegisteredUser, setIsRegisteredUser] = useState(false);
  const [userPreferences, setUserPreferences] = useState({
    gender: '',
    customGender: '',
    pronouns: '',
    clothingSize: '',
    pantsSize: '',
    shoeSize: ''
  });
  const [modoRegistro, setModoRegistro] = useState(false);
  const [datosRegistro, setDatosRegistro] = useState({
    nombre: '',
    email: '',
    password: ''
  });

  // New states for preferences
  const [showPreferencePanel, setShowPreferencePanel] = useState(false);
  const [showPreferenceReminder, setShowPreferenceReminder] = useState(false);

  // Load user data from localStorage on component mount
  useEffect(() => {
    const savedUser = localStorage.getItem('usuario');
    const savedPassword = localStorage.getItem('user_password');
    const savedEmail = localStorage.getItem('user_email');
    
    if (savedUser && savedPassword) {
      setUsuario(savedUser);
      setLogueado(true);
      setIsRegisteredUser(true);
      
      // Load user preferences
      try {
        const prefs = localStorage.getItem(`preferencias_${savedUser}`);
        if (prefs) {
          setUserPreferences(JSON.parse(prefs));
        }
      } catch (error) {
        console.error('Error loading preferences:', error);
      }
    }

    // Check if we should show preference reminder
    const lastReminder = localStorage.getItem('last_preference_reminder');
    const shouldShowReminder = !lastReminder || 
      (Date.now() - parseInt(lastReminder)) > 7 * 24 * 60 * 60 * 1000; // 7 days
    
    if (savedUser && shouldShowReminder) {
      const hasPreferences = Object.values(userPreferences).some(val => val && val !== '');
      if (!hasPreferences) {
        setShowPreferenceReminder(true);
      }
    }
  }, []);

  const handleNavigate = (page) => {
    setCurrentPage(page);
  };

  const handleBack = () => {
    setCurrentPage('shopping');
  };

  const handleInputRegistro = (field, value) => {
    setDatosRegistro(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleRegistroLogin = (e) => {
    e.preventDefault();
    
    if (modoRegistro) {
      // Register logic
      if (!datosRegistro.nombre || !datosRegistro.email || !datosRegistro.password) {
        alert('Please fill all fields');
        return;
      }
      
      if (datosRegistro.password.length < 6) {
        alert('Password must be at least 6 characters');
        return;
      }

      localStorage.setItem('usuario', datosRegistro.nombre);
      localStorage.setItem('user_email', datosRegistro.email);
      localStorage.setItem('user_password', datosRegistro.password);
      
      setUsuario(datosRegistro.nombre);
      setLogueado(true);
      setIsRegisteredUser(true);
      setShowPreferencePanel(true);
      
      // Reset form
      setDatosRegistro({
        nombre: '',
        email: '',
        password: ''
      });
      
    } else {
      // Login logic
      const savedPassword = localStorage.getItem('user_password');
      const savedUser = localStorage.getItem('usuario');
      
      if (datosRegistro.email === localStorage.getItem('user_email') && 
          datosRegistro.password === savedPassword) {
        setUsuario(savedUser || datosRegistro.email);
        setLogueado(true);
        setIsRegisteredUser(true);
        
        // Reset form
        setDatosRegistro({
          nombre: '',
          email: '',
          password: ''
        });
      } else {
        alert('Invalid email or password');
      }
    }
  };

  const handleSavePreferences = (preferences) => {
    setUserPreferences(preferences);
    localStorage.setItem(`preferencias_${usuario}`, JSON.stringify(preferences));
    localStorage.setItem('last_preference_reminder', Date.now().toString());
    setShowPreferenceReminder(false);
  };

  const handleClosePreferenceReminder = () => {
    setShowPreferenceReminder(false);
    localStorage.setItem('last_preference_reminder', Date.now().toString());
  };

  // Render login/register form if not logged in
  if (!logueado) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="flex justify-center">
            <img 
              src="/merku-logo-mini.png" 
              alt="Merku Logo" 
              className="w-16 h-16"
            />
          </div>
          <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
            {modoRegistro ? 'Create your account' : 'Welcome back'}
          </h2>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            {showPreferenceReminder && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-blue-800">
                      Complete your preferences
                    </h3>
                    <div className="mt-2 text-sm text-blue-700">
                      <p>
                        For a better shopping experience, please set your size preferences in your profile.
                      </p>
                    </div>
                    <div className="mt-4">
                      <button
                        type="button"
                        onClick={() => setShowPreferencePanel(true)}
                        className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                      >
                        Set Preferences
                      </button>
                      <button
                        type="button"
                        onClick={handleClosePreferenceReminder}
                        className="ml-2 text-sm text-blue-600 hover:text-blue-800"
                      >
                        Maybe later
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleRegistroLogin}>
              <div className="space-y-4">
                {modoRegistro && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={datosRegistro.nombre}
                      onChange={(e) => handleInputRegistro('nombre', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f7941d] focus:border-transparent"
                      placeholder="Your full name"
                      required
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={datosRegistro.email}
                    onChange={(e) => handleInputRegistro('email', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f7941d] focus:border-transparent"
                    placeholder="your@email.com"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password *
                  </label>
                  <input
                    type="password"
                    value={datosRegistro.password}
                    onChange={(e) => handleInputRegistro('password', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f7941d] focus:border-transparent"
                    placeholder="Your password"
                    required
                  />
                  {modoRegistro && (
                    <p className="mt-1 text-xs text-gray-500">
                      Password must be at least 6 characters long
                    </p>
                  )}
                </div>
              </div>

              <div className="flex gap-4 mt-6">
                <button
                  type="submit"
                  className="flex-1 bg-[#f7941d] text-white py-3 px-4 rounded-lg hover:bg-black transition-colors font-medium"
                >
                  {modoRegistro ? 'Create Account' : 'Login'}
                </button>
              </div>

              <p className="text-center text-sm text-gray-600 mt-4">
                {modoRegistro ? 'Already have an account?' : "Don't have an account?"}
                <button
                  type="button"
                  onClick={() => setModoRegistro(!modoRegistro)}
                  className="ml-2 text-[#f7941d] hover:text-black font-medium"
                >
                  {modoRegistro ? 'Login' : 'Sign up'}
                </button>
              </p>
            </form>

            <div className="mt-6 border-t border-gray-200 pt-6">
              <div className="text-center">
                <p className="text-xs text-gray-500">
                  By continuing, you agree to our{' '}
                  <button
                    onClick={() => handleNavigate('terms')}
                    className="text-[#f7941d] hover:text-black"
                  >
                    Terms of Service
                  </button>
                  ,{' '}
                  <button
                    onClick={() => handleNavigate('privacy')}
                    className="text-[#f7941d] hover:text-black"
                  >
                    Privacy Policy
                  </button>
                  {' '}and{' '}
                  <button
                    onClick={() => handleNavigate('cookies')}
                    className="text-[#f7941d] hover:text-black"
                  >
                    Cookie Policy
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>

        {showPreferencePanel && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
            <div className="relative bg-white rounded-lg max-w-md mx-auto p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Set Your Preferences
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gender
                  </label>
                  <select
                    value={userPreferences.gender}
                    onChange={(e) => setUserPreferences(prev => ({ ...prev, gender: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f7941d] focus:border-transparent"
                  >
                    <option value="">Select gender</option>
                    <option value="Mujer">Mujer</option>
                    <option value="Hombre">Hombre</option>
                    <option value="Prefiero no decirlo">Prefiero no decirlo</option>
                    <option value="Personalizado">Personalizado</option>
                  </select>
                </div>

                {userPreferences.gender === 'Personalizado' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Custom Gender
                    </label>
                    <input
                      type="text"
                      value={userPreferences.customGender}
                      onChange={(e) => setUserPreferences(prev => ({ ...prev, customGender: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f7941d] focus:border-transparent"
                      placeholder="Describe your gender"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Clothing Size
                  </label>
                  <input
                    type="text"
                    value={userPreferences.clothingSize}
                    onChange={(e) => setUserPreferences(prev => ({ ...prev, clothingSize: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f7941d] focus:border-transparent"
                    placeholder="XS, S, M, L, XL, etc."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pants Size
                  </label>
                  <input
                    type="text"
                    value={userPreferences.pantsSize}
                    onChange={(e) => setUserPreferences(prev => ({ ...prev, pantsSize: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f7941d] focus:border-transparent"
                    placeholder="28, 30, 32, 34, etc."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Shoe Size
                  </label>
                  <input
                    type="text"
                    value={userPreferences.shoeSize}
                    onChange={(e) => setUserPreferences(prev => ({ ...prev, shoeSize: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f7941d] focus:border-transparent"
                    placeholder="35, 36, 37, 38, etc."
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowPreferencePanel(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Skip
                </button>
                <button
                  onClick={() => {
                    handleSavePreferences(userPreferences);
                    setShowPreferencePanel(false);
                  }}
                  className="flex-1 bg-[#f7941d] text-white px-4 py-2 rounded-lg hover:bg-black transition-colors font-medium"
                >
                  Save Preferences
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  switch (currentPage) {
    case 'profile':
      return (
        <UserProfile 
          onBack={handleBack}
          usuario={usuario}
          setUsuario={setUsuario}
          setLogueado={setLogueado}
          setIsRegisteredUser={setIsRegisteredUser}
          userPreferences={userPreferences}
          onSavePreferences={handleSavePreferences}
          setShowPreferencePanel={setShowPreferencePanel}
        />
      ); 
    case 'privacy':
      return <PrivacyPolicy onBack={handleBack} />;
    case 'terms':
      return <TermsOfUse onBack={handleBack} />;
    case 'cookies':
      return <CookiesPolicy onBack={handleBack} />;
    default:
      return (
        <Shopping 
          onNavigate={handleNavigate} 
          usuario={usuario} 
          setUsuario={setUsuario} 
          logueado={logueado} 
          setLogueado={setLogueado} 
          userPreferences={userPreferences} 
          setUserPreferences={setUserPreferences} 
          isRegisteredUser={isRegisteredUser} 
          setIsRegisteredUser={setIsRegisteredUser} 
        />
      );
  }
}

export default App;