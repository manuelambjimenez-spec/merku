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
  Eye,
  EyeOff,
  ArrowUp 
} from "lucide-react";

// Import separated components
import { PreferencePanel, PreferenceReminder } from "./components/PreferenceComponents";
import { UserProfile } from "./components/UserProfile";
import { PrivacyPolicy, TermsOfUse, CookiesPolicy } from "./components/LegalPages";
import ProductCard from "./ProductCard";

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
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("All");
  const [mostrarGuardados, setMostrarGuardados] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const [mensajeIA, setMensajeIA] = useState("");
  const [buscando, setBuscando] = useState(false);
  const [ocultarInstrucciones, setOcultarInstrucciones] = useState(false);
  const [historial, setHistorial] = useState([]);
  const [recomendaciones, setRecomendaciones] = useState([]);
  const [haBuscado, setHaBuscado] = useState(false);
  const [mostrarRegistro, setMostrarRegistro] = useState(false);
  const [showPreferencePanel, setShowPreferencePanel] = useState(false);
  
  // Updated datosRegistro state with all new fields
  const [datosRegistro, setDatosRegistro] = useState({
    nombre: "",
    email: "",
    password: "",
    gender: "",
    customGender: "",
    pronouns: "",
    clothingSize: "",
    pantsSize: "",
    shoeSize: ""
  });
  
  // New states for preferences
  const [showPreferencePanel, setShowPreferencePanel] = useState(false);
  const [showPreferenceReminder, setShowPreferenceReminder] = useState(false);

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

  // Updated handleRegistro function
  const handleRegistro = (e) => {
    e.preventDefault();
    if (datosRegistro.nombre && datosRegistro.email && datosRegistro.password) {
      // Save all user data to localStorage
      localStorage.setItem("usuario", datosRegistro.nombre);
      localStorage.setItem("user_email", datosRegistro.email);
      localStorage.setItem("user_password", datosRegistro.password);
      localStorage.setItem("user_gender", datosRegistro.gender || '');
      localStorage.setItem("user_custom_gender", datosRegistro.customGender || '');
      localStorage.setItem("user_pronouns", datosRegistro.pronouns || '');
      localStorage.setItem("user_clothing_size", datosRegistro.clothingSize || '');
      localStorage.setItem("user_pants_size", datosRegistro.pantsSize || '');
      localStorage.setItem("user_shoe_size", datosRegistro.shoeSize || '');
      
      // Update states
      setUsuario(datosRegistro.nombre);
      setIsRegisteredUser(true);
      setLogueado(true);
      
      // Update user preferences
      const newPreferences = {
        gender: datosRegistro.gender,
        customGender: datosRegistro.customGender,
        pronouns: datosRegistro.pronouns,
        clothingSize: datosRegistro.clothingSize,
        pantsSize: datosRegistro.pantsSize,
        shoeSize: datosRegistro.shoeSize
      };
      setUserPreferences(newPreferences);
      
      // Close modal and reset form
      setMostrarRegistro(false);
      setDatosRegistro({
        nombre: "",
        email: "",
        password: "",
        gender: "",
        customGender: "",
        pronouns: "",
        clothingSize: "",
        pantsSize: "",
        shoeSize: ""
      });
    }
  };

  const handleInputRegistro = (campo, valor) => {
    setDatosRegistro(prev => ({
      ...prev,
      [campo]: valor
    }));
  };

  // Updated handleSavePreferences function
  const handleSavePreferences = (preferences) => {
    localStorage.setItem("user_gender", preferences.gender || '');
    localStorage.setItem("user_custom_gender", preferences.customGender || '');
    localStorage.setItem("user_pronouns", preferences.pronouns || '');
    localStorage.setItem("user_clothing_size", preferences.clothingSize || '');
    localStorage.setItem("user_pants_size", preferences.pantsSize || '');
    localStorage.setItem("user_shoe_size", preferences.shoeSize || '');
    
    if (usuario) {
      localStorage.setItem(`preferencias_${usuario}`, JSON.stringify(preferences));
    }
    
    setUserPreferences(preferences);
  };

  // Helper function to determine target gender for results
  const getTargetGender = (userPreferences) => {
    const { gender, customGender, pronouns } = userPreferences;
    
    if (gender === 'man') return 'man';
    if (gender === 'woman') return 'woman';
    if (gender === 'prefer-not-to-say') return 'both';
    if (gender === 'custom') {
      if (pronouns === 'man') return 'man';
      if (pronouns === 'woman') return 'woman';
      return 'both'; // For 'other' or no pronouns specified
    }
    
    return 'both'; // Default fallback
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
    setCategoriaSeleccionada("All");
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

  // FILTRADO DE PRODUCTOS RESTAURADO
  const categorias = ["All", ...new Set(products.map((p) => p.category))];
  const fuenteProductos = mostrarGuardados ? productosGuardados : products;
  const productosFiltrados = haBuscado
    ? fuenteProductos
        .filter((p) =>
          categoriaSeleccionada === "All" ? true : p.category === categoriaSeleccionada
        )
        .filter((p) =>
          (p.name ?? "").toLowerCase().includes(busqueda.toLowerCase()) ||
          (p.category ?? "").toLowerCase().includes(busqueda.toLowerCase()) ||
          (p.store ?? "").toLowerCase().includes(busqueda.toLowerCase())
        )
    : [];

  return (
    <div className="min-h-screen bg-white flex">
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
        
        {/* INSTRUCCIONES RESTAURADAS */}
        {!ocultarInstrucciones && (
          <div className="text-center text-xs text-[#c2bfbf] mt-8 max-w-md">
            <p className="mb-2">
              <span className="text-[#f7941d] font-semibold">Merku</span> is your intelligent IA based shopping assistant, helping you find the right product instantly based on your needs.
            </p>
            <p className="mt-4 font-semibold text-[#f7941d]">How it works:</p>
            <ol className="list-decimal list-inside text-[#c2bfbf]">
              <li>
                <span className="text-[#f7941d]">1.</span> Type what you're looking for (e.g. wireless earbuds under $100, office chair with lumbar support)
              </li>
              <li>
                <span className="text-[#f7941d]">2.</span> <span className="text-[#f7941d]">Merku</span> filters and shows smart results in your favourite sites
              </li>
              <li>
                <span className="text-[#f7941d]">3.</span> You choose what fits you best — simple!
              </li>
            </ol>
          </div>
        )}

        {/* BARRA DE BÚSQUEDA RESTAURADA */}
        <div className="bg-[#f3f4f6] rounded-xl px-4 py-2 flex items-center w-full max-w-xl mb-4 mt-6">
          <input
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

        {/* CATEGORÍAS RESTAURADAS */}
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {categorias.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoriaSeleccionada(cat)}
              className={`text-xs px-3 py-1 rounded-full border ${
                categoriaSeleccionada === cat
                  ? "bg-[#f7941d] text-white border-[#f7941d]"
                  : "text-[#c2bfbf] border-[#c2bfbf] hover:border-black hover:text-black"
              } transition`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* MENSAJE IA RESTAURADO */}
        <p className="text-sm text-center text-[#c2bfbf] mb-4 min-h-[1.5rem]">
          {buscando ? <span className="animate-pulse">Searching...</span> : mensajeIA}
        </p>

        {/* GRID DE PRODUCTOS RESTAURADO */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-10">
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

        {/* Registration Modal - VERSIÓN COMPLETA */}
        {mostrarRegistro && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-11/12 max-w-lg relative max-h-[90vh] overflow-y-auto">
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
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    value={datosRegistro.nombre}
                    onChange={(e) => handleInputRegistro('nombre', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f7941d] focus:border-transparent"
                    placeholder="your@email.com"
                    required
                  />
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password *
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      value={datosRegistro.password}
                      onChange={(e) => handleInputRegistro('password', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f7941d] focus:border-transparent"
                      placeholder="Create a password"
                      required
                    />
                  </div>
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gender
                  </label>
                  <select
                    value={datosRegistro.gender || ''}
                    onChange={(e) => {
                      const gender = e.target.value;
                      handleInputRegistro('gender', gender);
                      if (gender !== 'custom') {
                        handleInputRegistro('customGender', '');
                        handleInputRegistro('pronouns', '');
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f7941d] focus:border-transparent"
                  >
                    <option value="" disabled></option>
                    <option value="woman">Mujer</option>
                    <option value="man">Hombre</option>
                    <option value="prefer-not-to-say">Prefiero no decirlo</option>
                    <option value="custom">Personalizado</option>
                  </select>
                </div>

                {/* Custom Gender Fields */}
                {datosRegistro.gender === 'custom' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        ¿Cuál es tu género?
                      </label>
                      <input
                        type="text"
                        value={datosRegistro.customGender || ''}
                        onChange={(e) => handleInputRegistro('customGender', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f7941d] focus:border-transparent"
                        placeholder="Enter your gender"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Prefiero que se me trate como:
                      </label>
                      <div className="space-y-2">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="pronouns"
                            value="woman"
                            checked={datosRegistro.pronouns === 'woman'}
                            onChange={(e) => handleInputRegistro('pronouns', e.target.value)}
                            className="mr-2 text-[#f7941d] focus:ring-[#f7941d]"
                          />
                          <span className="text-sm">Mujer</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="pronouns"
                            value="man"
                            checked={datosRegistro.pronouns === 'man'}
                            onChange={(e) => handleInputRegistro('pronouns', e.target.value)}
                            className="mr-2 text-[#f7941d] focus:ring-[#f7941d]"
                          />
                          <span className="text-sm">Hombre</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="pronouns"
                            value="other"
                            checked={datosRegistro.pronouns === 'other'}
                            onChange={(e) => handleInputRegistro('pronouns', e.target.value)}
                            className="mr-2 text-[#f7941d] focus:ring-[#f7941d]"
                          />
                          <span className="text-sm">Otro</span>
                        </label>
                      </div>
                    </div>
                  </>
                )}

                {/* Clothing Size */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Talla de ropa general
                  </label>
                  <select
                    value={datosRegistro.clothingSize || ''}
                    onChange={(e) => handleInputRegistro('clothingSize', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f7941d] focus:border-transparent"
                  >
                    <option value="">Select size</option>
                    <option value="XS">XS</option>
                    <option value="S">S</option>
                    <option value="M">M</option>
                    <option value="L">L</option>
                    <option value="XL">XL</option>
                    <option value="XXL">XXL</option>
                    <option value="3XL">3XL</option>
                  </select>
                </div>

                {/* Pants/Skirt Size */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Talla de pantalón/falda
                  </label>
                  <input
                    type="text"
                    value={datosRegistro.pantsSize || ''}
                    onChange={(e) => handleInputRegistro('pantsSize', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f7941d] focus:border-transparent"
                    placeholder="e.g. 32, M, 28W"
                  />
                </div>

                {/* Shoe Size */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Talla de calzado
                  </label>
                  <input
                    type="text"
                    value={datosRegistro.shoeSize || ''}
                    onChange={(e) => handleInputRegistro('shoeSize', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f7941d] focus:border-transparent"
                    placeholder="e.g. 9, 38, 7.5"
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

  const handleNavigate = (page) => {
    setCurrentPage(page);
  };

  const handleBack = () => {
    setCurrentPage('home');
  };

  const handleSavePreferences = (preferences) => {
    // Save to localStorage with individual keys (backward compatibility)
    localStorage.setItem("user_gender", preferences.gender || '');
    localStorage.setItem("user_custom_gender", preferences.customGender || '');
    localStorage.setItem("user_pronouns", preferences.pronouns || '');
    localStorage.setItem("user_clothing_size", preferences.clothingSize || '');
    localStorage.setItem("user_pants_size", preferences.pantsSize || '');
    localStorage.setItem("user_shoe_size", preferences.shoeSize || '');
    
    // Also save as a single object with user-specific key for filtering
    if (usuario) {
      localStorage.setItem(`preferencias_${usuario}`, JSON.stringify(preferences));
    }
    
    // Update state
    setUserPreferences(preferences);
  };

  switch (currentPage) {
    case 'profile':
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
"border-transparent"
                    placeholder="Your full name"
                    required
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={datosRegistro.email}
                    onChange={(e) => handleInputRegistro('email', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f7941d] focus: