import { useState, useEffect } from "react";

const STORES = ["Amazon", "Temu", "AliExpress", "eBay"];

const StoreFilter = ({ onChange, className = "" }) => {
  const [selectedStores, setSelectedStores] = useState(STORES);
  const [allSelected, setAllSelected] = useState(true);

  // Notificar al componente padre cuando cambien las tiendas seleccionadas
  useEffect(() => {
    if (onChange) {
      onChange(selectedStores);
    }
  }, [selectedStores, onChange]);

  const handleAllToggle = () => {
    if (allSelected) {
      // Si All está activo, desactivar todas las tiendas
      setSelectedStores([]);
      setAllSelected(false);
    } else {
      // Si All está inactivo, activar todas las tiendas
      setSelectedStores(STORES);
      setAllSelected(true);
    }
  };

  const handleStoreToggle = (store) => {
    let newSelectedStores;
    
    if (selectedStores.includes(store)) {
      // Desactivar tienda
      newSelectedStores = selectedStores.filter(s => s !== store);
    } else {
      // Activar tienda
      newSelectedStores = [...selectedStores, store];
    }
    
    setSelectedStores(newSelectedStores);
    
    // Actualizar estado de All basado en si todas las tiendas están seleccionadas
    const allStoresSelected = newSelectedStores.length === STORES.length;
    setAllSelected(allStoresSelected);
  };

  const isStoreSelected = (store) => selectedStores.includes(store);

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {/* Chip All */}
      <button
        onClick={handleAllToggle}
        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
          allSelected
            ? "bg-[#f7941d] text-white"
            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
        }`}
      >
        All
      </button>
      
      {/* Chips de tiendas */}
      {STORES.map((store) => (
        <button
          key={store}
          onClick={() => handleStoreToggle(store)}
          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
            isStoreSelected(store)
              ? "bg-[#f7941d] text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          {store}
        </button>
      ))}
    </div>
  );
};

export default StoreFilter;