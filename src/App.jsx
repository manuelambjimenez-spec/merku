import { useState, useEffect, useRef } from "react";
import {
  ChevronsLeft,
  ChevronsRight,
  PenLine,
  Settings,
  User,
  LogOut,
  ArrowDown,
  Heart,
  Share2,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  X,
  Check,
  AlertTriangle
} from "lucide-react";

// Import separated components
import { PreferencePanel, PreferenceReminder } from "./components/PreferenceComponents";
import { UserProfile } from "./components/UserProfile";
import { PrivacyPolicy, TermsOfUse, CookiesPolicy } from "./components/LegalPages";

// Logo component
const MerkuLogo = ({ className }) => (
  <img 
    src="src/assets/merku-logo-mini.png" 
    alt="Merku Logo" 
    className={className}
  />
);

// Mock products data
const products = [
  { id: 1, name: "Wireless Headphones", price: "$89.99", category: "tech", store: "Amazon", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop" },
  { id: 2, name: "Summer Dress", price: "$45.00", category: "fashion", store: "Zara", image: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=200&h=200&fit=crop" },
  { id: 3, name: "Running Shoes", price: "$120.00", category: "fashion", store: "Nike", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&h=200&fit=crop" },
  { id: 4, name: "Gaming Mouse", price: "$65.99", category: "tech", store: "Best Buy", image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=200&h=200&fit=crop" },
  { id: 5, name: "Smart Watch", price: "$299.99", category: "tech", store: "Apple", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&h=200&fit=crop" },
  { id: 6, name: "Casual Sneakers", price: "$75.00", category: "fashion", store: "Adidas", image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=200&h=200&fit=crop" },
  { id: 7, name: "Bluetooth Speaker", price: "$55.99", category: "tech", store: "Amazon", image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=200&h=200&fit=crop" },
  { id: 8, name: "Winter Jacket", price: "$89.99", category: "fashion", store: "H&M", image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=200&h=200&fit=crop" },
  { id: 9, name: "Laptop Stand", price: "$35.00", category: "tech", store: "Amazon", image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=200&h=200&fit=crop" },
  { id: 10, name: "Designer Jeans", price: "$99.99", category: "fashion", store: "Levi's", image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=200&h=200&fit=crop" }
];

// ProductCard component
function ProductCard({ product, onClick }) {
  return (
    <div 
      className="bg-white rounded-lg p-3 cursor-pointer hover:shadow-lg transition-shadow border border-gray-100"
      onClick={onClick}
    >
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-32 object-cover rounded mb-2"
      />
      <h3 className="font-medium text-sm mb-1 line-clamp-2">{product.name}</h3>
      <p className="text-xs text-gray-500 mb-1">{product.store}</p>
      <p className="font-semibold text-sm">{product.price}</p>
    </div>
  );
}

// Footer component
function Footer({ onNavigate }) {
  return (
    <footer className="mt-16 pb-6 text-center">
      <div className="flex justify-center items-center gap-6 text-xs text-[#c2bfbf]">
        <button 
          onClick={() => onNavigate('privacy')}
          className="hover:text-black transition-colors"
        >
          Privacy Policy
        </button>
        <button 
          onClick={() => onNavigate('terms')}
          className="hover:text-black transition-colors"
        >
          Terms of Use
        </button>
        <button 
          onClick={() => onNavigate('cookies')}
          className="hover:text-black transition-colors"
        >
          Cookies Policy
        </button>
      </div>
    </footer>
  );
}

// Main shopping component
function Shopping({ onNavigate, usuario, setUsuario, logueado, setLogueado, userPreferences, setUserPreferences, isRegisteredUser, setIsRegisteredUser }) {
  const [menuAbierto, setMenuAbierto] = useState(true);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [productosGuardados, setProductosGuardados] = useState([]);
  const [mostrarGuardados, setMostrarGuardados] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const [mensajeIA, setMensajeIA] = useState("");
  const [buscando, setBuscando] = useState(false);
  const [ocultarInstrucciones, setOcultarInstrucciones] = useState(false);
  const [historial, setHistorial] = useState([]);
  const [recomendaciones, setRecomendaciones] = useState([]);
  const [haBuscado, setHaBuscado] = useState(false);
  const [mostrarRegistro, setMostrarRegistro] = useState(false);
  const [paginaActual, setPaginaActual] = useState(1);
  const [datosRegistro, setDatosRegistro] = useState({
    nombre: "",
    email: "",
    password: ""
  });
  const [filtros, setFiltros] = useState({
    categoria: "All",
    precio: "All",
    tienda: "All"
  });
  
  // New states for preferences
  const [showPreferencePanel, setShowPreferencePanel] = useState(false);
  const [showPreferenceReminder, setShowPreferenceReminder] = useState(false);

  const carouselRef = useRef(null);
  const productosPorPagina = 8;

  // Load user data and preferences on component mount
  useEffect(() => {
    const savedUser = localStorage.getItem("usuario");
    const savedEmail = localStorage.getItem("user_email");
    const savedPassword = localStorage.getItem("user_password");
    
    if (savedUser) {
      setUsuario(savedUser);
      setLogueado(true);
      
      // Check if user is registered (has email and password)
      if (savedEmail && savedPassword) {
        setIsRegisteredUser(true);
      }
      
      // Load saved products
      const guardados = localStorage.getItem(`productosGuardados_${savedUser}`);
      if (guardados) {
        setProductosGuardados(JSON.parse(guardados));
      }

      // Load user preferences - first try user-specific key, then fallback to individual keys
      let savedPreferences = null;
      try {
        const userSpecificPrefs = localStorage.getItem(`preferencias_${savedUser}`);
        if (userSpecificPrefs) {
          savedPreferences = JSON.parse(userSpecificPrefs);
          console.log("Loaded user-specific preferences:", savedPreferences);
        }
      } catch (error) {
        console.log("Error loading user-specific preferences:", error);
      }

      // Fallback to individual keys if no user-specific preferences found
      if (!savedPreferences) {
        savedPreferences = {
          gender: localStorage.getItem("user_gender") || '',
          customGender: localStorage.getItem("user_custom_gender") || '',
          pronouns: localStorage.getItem("user_pronouns") || '',
          clothingSize: localStorage.getItem("user_clothing_size") || '',
          pantsSize: localStorage.getItem("user_pants_size") || '',
          shoeSize: localStorage.getItem("user_shoe_size") || ''
        };
        console.log("Loaded individual preferences:", savedPreferences);
      }

      setUserPreferences(savedPreferences);
    } else {
      // Load user preferences for non-logged users (fallback)
      const savedPreferences = {
        gender: localStorage.getItem("user_gender") || '',
        customGender: localStorage.getItem("user_custom_gender") || '',
        pronouns: localStorage.getItem("user_pronouns") || '',
        clothingSize: localStorage.getItem("user_clothing_size") || '',
        pantsSize: localStorage.getItem("user_pants_size") || '',
        shoeSize: localStorage.getItem("user_shoe_size") || ''
      };
      setUserPreferences(savedPreferences);
    }
  }, []);

  // Check for preference reminder
  useEffect(() => {
    if (!isRegisteredUser || !usuario) return;

    // Check if user has any preferences filled
    const hasPreferences = Object.values(userPreferences).some(value => value !== '');
    
    if (hasPreferences) return; // Don't show reminder if user has preferences

    const lastReminderDate = localStorage.getItem("last_preference_reminder");
    const today = new Date().toDateString();
    
    if (!lastReminderDate) {
      // First time - show reminder after 2 seconds
      const timer = setTimeout(() => {
        setShowPreferenceReminder(true);
      }, 2000);
      return () => clearTimeout(timer);
    } else {
      // Check if 3 days have passed
      const lastDate = new Date(lastReminderDate);
      const todayDate = new Date(today);
      const diffTime = Math.abs(todayDate - lastDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays >= 3) {
        const timer = setTimeout(() => {
          setShowPreferenceReminder(true);
        }, 2000);
        return () => clearTimeout(timer);
      }
    }
  }, [isRegisteredUser, usuario, userPreferences]);

  useEffect(() => {
    if (usuario) {
      localStorage.setItem(`productosGuardados_${usuario}`, JSON.stringify(productosGuardados));
    }
  }, [productosGuardados, usuario]);

  // Efecto para cerrar modal con tecla Esc
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        if (productoSeleccionado) {
          setProductoSeleccionado(null);
        }
        if (mostrarRegistro) {
          setMostrarRegistro(false);
        }
        if (showPreferencePanel) {
          setShowPreferencePanel(false);
        }
        if (showPreferenceReminder) {
          setShowPreferenceReminder(false);
        }
      }
    };

    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [productoSeleccionado, mostrarRegistro, showPreferencePanel, showPreferenceReminder]);

  // Efecto para navegación del carrusel con teclado
  useEffect(() => {
    const handleCarouselKeyboard = (e) => {
      if (carouselRef.current && document.activeElement === carouselRef.current) {
        if (e.key === "ArrowLeft") {
          e.preventDefault();
          scrollCarousel('left');
        } else if (e.key === "ArrowRight") {
          e.preventDefault();
          scrollCarousel('right');
        }
      }
    };

    document.addEventListener("keydown", handleCarouselKeyboard);
    return () => document.removeEventListener("keydown", handleCarouselKeyboard);
  }, []);

  const handleLogin = () => {
    const nombre = prompt("Enter your name");
    if (nombre) {
      setUsuario(nombre);
      localStorage.setItem("usuario", nombre);
      setLogueado(true);
    }
  };

  const handleLogout = () => {
    setLogueado(false);
    setIsRegisteredUser(false);
    localStorage.removeItem("usuario");
    localStorage.removeItem("user_email");
    localStorage.removeItem("user_password");
    setUsuario("");
    setProductosGuardados([]);
  };

  const handleRegistro = (e) => {
    e.preventDefault();
    if (datosRegistro.nombre && datosRegistro.email && datosRegistro.password) {
      setUsuario(datosRegistro.nombre);
      setIsRegisteredUser(true);
      localStorage.setItem("usuario", datosRegistro.nombre);
      localStorage.setItem("user_email", datosRegistro.email);
      localStorage.setItem("user_password", datosRegistro.password);
      setLogueado(true);
      setMostrarRegistro(false);
      setDatosRegistro({ nombre: "", email: "", password: "" });
    }
  };

  const handleInputRegistro = (campo, valor) => {
    setDatosRegistro(prev => ({
      ...prev,
      [campo]: valor
    }));
  };

  const handleSavePreferences = (preferences) => {
    // Save to localStorage with individual keys (backward compatibility)
    localStorage.setItem("user_gender", preferences.gender);
    localStorage.setItem("user_custom_gender", preferences.customGender || '');
    localStorage.setItem("user_pronouns", preferences.pronouns || '');
    localStorage.setItem("user_clothing_size", preferences.clothingSize);
    localStorage.setItem("user_pants_size", preferences.pantsSize);
    localStorage.setItem("user_shoe_size", preferences.shoeSize);
    
    // Also save as a single object with user-specific key for filtering
    if (usuario) {
      localStorage.setItem(`preferencias_${usuario}`, JSON.stringify(preferences));
    }
    
    // Update state
    setUserPreferences(preferences);
    
    // Log for testing (as requested)
    console.log("Saved user preferences:", preferences);
    console.log("Saved to key:", `preferencias_${usuario}`);
  };

  const handlePreferenceReminderClose = () => {
    setShowPreferenceReminder(false);
    localStorage.setItem("last_preference_reminder", new Date().toDateString());
  };

  const handlePreferenceReminderAccept = () => {
    setShowPreferenceReminder(false);
    setShowPreferencePanel(true);
    localStorage.setItem("last_preference_reminder", new Date().toDateString());
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* Sidebar */}
      {logueado && (
        <aside 
          id="sidebar"
          className={`${menuAbierto ? "w-56" : "w-12"} transition-all duration-300 bg-[#f3f4f6] p-4 flex flex-col h-screen fixed left-0 top-0 z-40`}
        >
          <button className="self-end mb-2" onClick={() => setMenuAbierto(!menuAbierto)}>
            {menuAbierto ? <ChevronsLeft size={16} /> : <ChevronsRight size={16} />}
          </button>
          {menuAbierto ? (
            <MerkuLogo className="w-12 self-start" />
          ) : (
            <MerkuLogo className="w-8 self-center" />
          )}
          {menuAbierto && (
            <div className="flex flex-col gap-4 flex-1 mt-6">
              <button className="text-left text-xs flex items-center gap-2 text-black hover:font-semibold">
                <PenLine size={16} /> New chat
              </button>
              <button className="text-left text-xs flex items-center gap-2 text-black hover:font-semibold">
                <Heart size={16} /> Saved
              </button>
              <button 
                onClick={() => setShowPreferencePanel(true)}
                className="text-left text-xs flex items-center gap-2 text-black hover:font-semibold"
              >
                <Settings size={16} /> Preferences
              </button>
              <button 
                onClick={() => onNavigate('profile')}
                className="text-left text-xs flex items-center gap-2 text-black hover:font-semibold"
              >
                <User size={16} /> Profile
              </button>
              <div className="mt-auto">
                <button
                  onClick={handleLogout}
                  className="text-left text-xs flex items-center gap-2 text-black hover:font-semibold"
                >
                  <LogOut size={16} /> Logout
                </button>
              </div>
            </div>
          )}
        </aside>
      )}

      <main className={`flex-1 flex flex-col items-center px-4 py-6 sm:py-10 min-h-screen ${logueado ? (menuAbierto ? "ml-56" : "ml-12") : ""} transition-all duration-300`}>
        {/* Main content would go here */}
        <div className="text-center mt-20">
          <MerkuLogo className="w-20 mb-4 mx-auto" />
          <h1 className="text-2xl font-bold">Merku Shopping Assistant</h1>
          <p className="text-gray-600 mt-2">This is a simplified version for the profile demo</p>
          
          {/* Demo buttons for testing */}
          {!logueado && (
            <div className="mt-8 space-y-4">
              <button
                onClick={handleLogin}
                className="px-6 py-2 bg-[#f7941d] text-white rounded-lg hover:bg-black transition-colors"
              >
                Quick Login (Demo)
              </button>
              <button
                onClick={() => setMostrarRegistro(true)}
                className="block mx-auto px-6 py-2 border border-[#f7941d] text-[#f7941d] rounded-lg hover:bg-[#f7941d] hover:text-white transition-colors"
              >
                Register (Demo)
              </button>
            </div>
          )}
        </div>

        {/* Registration Modal */}
        {mostrarRegistro && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-11/12 max-w-md relative">
              <button
                className="absolute top-2 right-2 text-black hover:text-gray-600"
                onClick={() => setMostrarRegistro(false)}
              >
                <X size={20} />
              </button>
              
              <div className="flex items-center justify-center mb-6">
                <MerkuLogo className="w-12 mr-2" />
                <h2 className="text-xl font-bold">Create Account</h2>
              </div>

              <form onSubmit={handleRegistro} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name
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

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
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
                    Password
                  </label>
                  <input
                    type="password"
                    value={datosRegistro.password}
                    onChange={(e) => handleInputRegistro('password', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f7941d] focus:border-transparent"
                    placeholder="Create a password"
                    required
                  />
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setMostrarRegistro(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-[#f7941d] text-white rounded-lg hover:bg-black transition-colors font-medium"
                  >
                    Create Account
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Preference Panel */}
        <PreferencePanel
          isOpen={showPreferencePanel}
          onClose={() => setShowPreferencePanel(false)}
          userPreferences={userPreferences}
          onSavePreferences={handleSavePreferences}
        />

        {/* Preference Reminder */}
        <PreferenceReminder
          isOpen={showPreferenceReminder}
          onClose={handlePreferenceReminderClose}
          onOpenPreferences={handlePreferenceReminderAccept}
        />

        <Footer onNavigate={onNavigate} />
      </main>
    </div>
  );
}

// Main App component
export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [usuario, setUsuario] = useState("");
  const [logueado, setLogueado] = useState(false);
  const [userPreferences, setUserPreferences] = useState({
    gender: '',
    customGender: '',
    pronouns: '',
    clothingSize: '',
    pantsSize: '',
    shoeSize: ''
  });
  const [isRegisteredUser, setIsRegisteredUser] = useState(false);
  const [showPreferencePanel, setShowPreferencePanel] = useState(false);

  const handleNavigate = (page) => {
    setCurrentPage(page);
  };

  const handleBack = () => {
    setCurrentPage('home');
  };

  const handleSavePreferences = (preferences) => {
    // Save to localStorage with individual keys (backward compatibility)
    localStorage.setItem("user_gender", preferences.gender);
    localStorage.setItem("user_custom_gender", preferences.customGender || '');
    localStorage.setItem("user_pronouns", preferences.pronouns || '');
    localStorage.setItem("user_clothing_size", preferences.clothingSize);
    localStorage.setItem("user_pants_size", preferences.pantsSize);
    localStorage.setItem("user_shoe_size", preferences.shoeSize);
    
    // Also save as a single object with user-specific key for filtering
    if (usuario) {
      localStorage.setItem(`preferencias_${usuario}`, JSON.stringify(preferences));
    }
    
    // Update state
    setUserPreferences(preferences);
  };

  switch (currentPage) {
    case 'profile':
      return (
        <UserProfile 
          onBack={handleBack}
          onNavigate={handleNavigate}
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
        <div>
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
          <PreferencePanel
            isOpen={showPreferencePanel}
            onClose={() => setShowPreferencePanel(false)}
            userPreferences={userPreferences}
            onSavePreferences={handleSavePreferences}
          />
        </div>
      );
  }
}