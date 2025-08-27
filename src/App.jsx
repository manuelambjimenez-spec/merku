import { useState, useEffect, useRef } from "react";
import {
  ChevronsLeft,
  ChevronsRight,
  PenLine,
  Settings,
  User,
  LogOut,
  ChevronDown,
  Heart,
  Share2,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  X,
  Check,
  AlertTriangle,
  ArrowUp 
} from "lucide-react";

// Import separated components
import { PreferencePanel, PreferenceReminder } from "./components/PreferenceComponents";
import { UserProfile } from "./components/UserProfile";
import { PrivacyPolicy, TermsOfUse, CookiesPolicy } from "./components/LegalPages";
import ProductCard from "./ProductCard";
import StoreFilter from "./components/StoreFilter";
import ProductTour from "./components/ProductTour";

// Logo component
const MerkuLogo = ({ className }) => (
  <img 
    src="/merku-logo-mini.png" 
    alt="Merku Logo" 
    className={className}
  />
);

const products = [
  { id: 1, name: "Wireless Headphones", price: "$89.99", category: "tech", store: "Amazon", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop" },
  { id: 2, name: "Summer Dress", price: "$45.00", category: "fashion", store: "Temu", image: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=200&h=200&fit=crop" },
  { id: 3, name: "Running Shoes", price: "$120.00", category: "fashion", store: "AliExpress", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&h=200&fit=crop" },
  { id: 4, name: "Gaming Mouse", price: "$65.99", category: "tech", store: "eBay", image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=200&h=200&fit=crop" },
  { id: 5, name: "Smart Watch", price: "$299.99", category: "tech", store: "Amazon", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&h=200&fit=crop" },
  { id: 6, name: "Casual Sneakers", price: "$75.00", category: "fashion", store: "Temu", image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=200&h=200&fit=crop" },
  { id: 7, name: "Bluetooth Speaker", price: "$55.99", category: "tech", store: "AliExpress", image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=200&h=200&fit=crop" },
  { id: 8, name: "Winter Jacket", price: "$89.99", category: "fashion", store: "eBay", image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=200&h=200&fit=crop" },
  { id: 9, name: "Laptop Stand", price: "$35.00", category: "tech", store: "Amazon", image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=200&h=200&fit=crop" },
  { id: 10, name: "Designer Jeans", price: "$99.99", category: "fashion", store: "Temu", image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=200&h=200&fit=crop" }
];

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
  const [datosRegistro, setDatosRegistro] = useState({
    nombre: "",
    email: "",
    password: ""
  });
  const [selectedStores, setSelectedStores] = useState(["Amazon", "Temu", "AliExpress", "eBay"]);
  
  // New states for preferences
  const [showPreferencePanel, setShowPreferencePanel] = useState(false);
  const [showPreferenceReminder, setShowPreferenceReminder] = useState(false);
  
  // Tour state
  const [showTour, setShowTour] = useState(false);

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

      // Load user preferences
      let savedPreferences = null;
      try {
        const userSpecificPrefs = localStorage.getItem(`preferencias_${savedUser}`);
        if (userSpecificPrefs) {
          savedPreferences = JSON.parse(userSpecificPrefs);
        }
      } catch (error) {
        console.log("Error loading user-specific preferences:", error);
      }

      if (!savedPreferences) {
        savedPreferences = {
          gender: localStorage.getItem("user_gender") || '',
          customGender: localStorage.getItem("user_custom_gender") || '',
          pronouns: localStorage.getItem("user_pronouns") || '',
          clothingSize: localStorage.getItem("user_clothing_size") || '',
          pantsSize: localStorage.getItem("user_pants_size") || '',
          shoeSize: localStorage.getItem("user_shoe_size") || ''
        };
      }

      setUserPreferences(savedPreferences);
    }
  }, []);

  // Check if tour should be shown on app load
  useEffect(() => {
    const tourCompleted = localStorage.getItem('merkuTourCompleted');
    if (!tourCompleted) {
      // Small delay to ensure components are rendered
      const timer = setTimeout(() => {
        setShowTour(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, []);

  // Check for preference reminder
  useEffect(() => {
    if (!isRegisteredUser || !usuario) return;

    const hasPreferences = Object.values(userPreferences).some(value => value !== '');
    if (hasPreferences) return;

    const lastReminderDate = localStorage.getItem("last_preference_reminder");
    const today = new Date().toDateString();
    
    if (!lastReminderDate) {
      const timer = setTimeout(() => {
        setShowPreferenceReminder(true);
      }, 2000);
      return () => clearTimeout(timer);
    } else {
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
    localStorage.setItem("user_gender", preferences.gender);
    localStorage.setItem("user_custom_gender", preferences.customGender || '');
    localStorage.setItem("user_pronouns", preferences.pronouns || '');
    localStorage.setItem("user_clothing_size", preferences.clothingSize);
    localStorage.setItem("user_pants_size", preferences.pantsSize);
    localStorage.setItem("user_shoe_size", preferences.shoeSize);
    
    if (usuario) {
      localStorage.setItem(`preferencias_${usuario}`, JSON.stringify(preferences));
    }
    
    setUserPreferences(preferences);
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

  const handleGuardar = (producto) => {
    if (!productosGuardados.some((p) => p.id === producto.id)) {
      setProductosGuardados([...productosGuardados, producto]);
    }
  };

  const cerrarDetalle = () => setProductoSeleccionado(null);

  const handleMostrarGuardados = () => {
    setMostrarGuardados((prev) => !prev);
  };

  // FUNCIONALIDAD DE BÚSQUEDA RESTAURADA
  const handleBuscar = (termino = busqueda) => {
    if (!termino.trim()) return;
    setBuscando(true);
    setMensajeIA(`Searching for: "${termino}"...`);
    setBusqueda(termino);
    setOcultarInstrucciones(true);
    setHaBuscado(true);

    setHistorial((prev) => {
      const newHist = [termino, ...prev.filter((item) => item !== termino)];
      return newHist.slice(0, 5);
    });

    setTimeout(() => {
      const b = termino.toLowerCase();
      if (b.includes("headphones")) {
        setMensajeIA("Great choice! These headphones might be what you're looking for.");
        setRecomendaciones(products.filter((p) => p.category === "tech" && !p.name.toLowerCase().includes("headphones")));
      } else if (b.includes("dress")) {
        setMensajeIA("Light and fresh — here are some dresses perfect for summer.");
        setRecomendaciones(products.filter((p) => p.category === "fashion" && !p.name.toLowerCase().includes("dress")));
      } else if (b.includes("shoes") || b.includes("sneakers")) {
        setMensajeIA("Let's find you the perfect pair of shoes.");
        setRecomendaciones(products.filter((p) => p.category === "fashion" && !p.name.toLowerCase().includes("shoes") && !p.name.toLowerCase().includes("sneakers")));
      } else if (b.includes("watch")) {
        setMensajeIA("Here are some stylish watches you might love.");
        setRecomendaciones(products.filter((p) => p.category === "tech" && !p.name.toLowerCase().includes("watch")));
      } else {
        setMensajeIA(`These results match your search: "${termino}"`);
        setRecomendaciones([]);
      }
      setBuscando(false);
    }, 1500);
  };

  const handleInputChange = (e) => {
    setBusqueda(e.target.value);
    if (!ocultarInstrucciones) setOcultarInstrucciones(true);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleBuscar();
    }
  };

  // FILTRADO DE PRODUCTOS ACTUALIZADO (sin categorías, solo tiendas)
  const fuenteProductos = mostrarGuardados ? productosGuardados : products;
  const productosFiltrados = haBuscado
    ? fuenteProductos
        .filter((p) =>
          (p.name ?? "").toLowerCase().includes(busqueda.toLowerCase()) ||
          (p.category ?? "").toLowerCase().includes(busqueda.toLowerCase()) ||
          (p.store ?? "").toLowerCase().includes(busqueda.toLowerCase())
        )
        .filter((p) => 
          selectedStores.length === 0 ? true : selectedStores.includes(p.store)
        )
    : [];

  return (
    <div className="min-h-screen bg-white flex">
      {/* Product Tour */}
      <ProductTour 
        isOpen={showTour} 
        onClose={() => setShowTour(false)} 
      />

      {/* Sidebar */}
      {logueado && (
        <aside 
          className={`${menuAbierto ? "w-56" : "w-12"} transition-all duration-300 bg-[#f3f4f6] p-4 flex flex-col h-screen fixed left-0 top-0 z-40`}
        >
          <button className="self-end mb-2" onClick={() => setMenuAbierto(!menuAbierto)}>
            {menuAbierto ? <ChevronsLeft size={16} /> : <ChevronsRight size={16} />}
          </button>
          {menuAbierto ? (
            <MerkuLogo className="w-12 self-start" />
          ) : (
            <div className="w-8 h-8 rounded-full bg-[#f7941d] self-center" />
          )}
          {menuAbierto && (
            <div className="flex flex-col gap-4 flex-1 mt-6">
              <button className="text-left text-xs flex items-center gap-2 text-black hover:font-semibold">
                <PenLine size={16} /> New chat
              </button>
              {historial.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => handleBuscar(item)}
                  className="text-left text-xs ml-6 text-gray-500 hover:text-black truncate leading-none -my-2 py-0.5"
                >
                  {item}
                </button>
              ))}
              <button
                onClick={handleMostrarGuardados}
                className={`text-left text-xs flex items-center gap-2 ${
                  mostrarGuardados ? "text-[#f7941d] font-semibold" : "text-black"
                } hover:font-semibold`}
              >
                <Heart size={16} /> Saved
              </button>
              <button 
                onClick={() => console.log('Preferences clicked')}
                className="text-left text-xs flex items-center gap-2 text-black hover:font-semibold"
              >
                <Settings size={16} /> Preferences
              </button>
              <button 
                onClick={() => onNavigate('profile')}
                className="text-left text-xs flex items-center gap-2 text-black hover:font-semibold"
                id="user-profile"
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
        {/* Botones de Login/Register cuando no está logueado */}
        <div className={`absolute top-4 right-4 space-x-2 ${logueado ? "z-30" : ""}`}>
          {!logueado && (
            <>
              <button onClick={handleLogin} className="text-sm text-black hover:underline">Login</button>
              <button onClick={() => setMostrarRegistro(true)} className="text-sm text-black hover:underline">Register</button>
            </>
          )}
        </div>

        {/* INTERFAZ PRINCIPAL RESTAURADA */}
        <MerkuLogo className="w-20 sm:w-24 mt-6 sm:mt-10 mb-4" />
        <h1 className="text-2xl font-bold text-center">Hi, I'm Merku</h1>
        
        {/* BARRA DE BÚSQUEDA RESTAURADA */}
        <div className="bg-[#f3f4f6] rounded-xl px-4 py-2 flex items-center w-full max-w-xl mb-4 mt-6">
          <input
            id="search-input"
            type="text"
            placeholder="e.g. running shoes size 38"
            value={busqueda}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent border-none focus:outline-none placeholder-[#d3d4d7]"
          />
          <button
            onClick={() => handleBuscar()}
            className="bg-[#f7941d] rounded-full p-2 hover:bg-black transition-colors"
          >
            <ArrowUp className="w-4 h-4 text-black hover:text-white transition-colors" />
          </button>
        </div>

        {/* FILTRO DE TIENDAS - Solo mostrar si hay búsqueda */}
        {busqueda.trim() && (
          <div id="store-filter" className="w-full max-w-xl mb-6">
            <div className="flex justify-center">
              <StoreFilter 
                onChange={setSelectedStores}
                className="justify-center"
              />
            </div>
          </div>
        )}

        {/* MENSAJE IA RESTAURADO */}
        <p className="text-sm text-center text-[#c2bfbf] mb-4 min-h-[1.5rem]">
          {buscando ? <span className="animate-pulse">Searching...</span> : mensajeIA}
        </p>

        {/* GRID DE PRODUCTOS RESTAURADO */}
        <div id="results-section" className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-10">
          {productosFiltrados.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onClick={() => setProductoSeleccionado(product)}
            />
          ))}
        </div>

        {/* RECOMENDACIONES RESTAURADAS */}
        {recomendaciones.length > 0 && (
          <div className="w-full max-w-6xl mt-4">
            <h2 className="text-sm font-semibold mb-2 text-gray-600 px-1">
              También te puede interesar:
            </h2>
            <div className="flex gap-4 overflow-x-auto pb-4 px-1">
              {recomendaciones.map((product) => (
                <div key={product.id} className="min-w-[160px] max-w-[180px]">
                  <ProductCard
                    product={product}
                    onClick={() => setProductoSeleccionado(product)}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MODAL DE PRODUCTO RESTAURADO */}
        {productoSeleccionado && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-11/12 max-w-md relative">
              <button
                className="absolute top-2 right-2 text-black hover:text-gray-600 text-xl font-bold"
                onClick={cerrarDetalle}
              >
                ×
              </button>
              <img
                src={productoSeleccionado.image}
                alt={productoSeleccionado.name}
                className="w-full h-48 object-cover rounded mb-4"
              />
              <h2 className="text-lg font-semibold mb-1">
                {productoSeleccionado.name}
              </h2>
              <p className="text-sm text-gray-500 mb-2">
                {productoSeleccionado.store}
              </p>
              <p className="text-black font-semibold mb-2">
                {productoSeleccionado.price}
              </p>
              <div className="flex gap-4">
                <button onClick={() => handleGuardar(productoSeleccionado)}>
                  <Bookmark className="text-[#f7941d] w-5 h-5 hover:text-black" />
                </button>
                <button>
                  <Share2 className="text-[#f7941d] w-5 h-5 hover:text-black" />
                </button>
              </div>
            </div>
          </div>
        )}

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

        {/* Debug button to restart tour (remove in production) */}
        {!showTour && (
          <button
            onClick={() => {
              localStorage.removeItem('merkuTourCompleted');
              setShowTour(true);
            }}
            className="fixed bottom-4 right-4 bg-gray-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-700 transition-colors z-30"
          >
            Restart Tour
          </button>
        )}
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
          usuario={usuario}
          setUsuario={setUsuario}
          setLogueado={setLogueado}
          setIsRegisteredUser={setIsRegisteredUser}
          userPreferences={userPreferences}
          onSavePreferences={handleSavePreferences}
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