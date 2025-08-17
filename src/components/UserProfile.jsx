import { useState, useEffect } from "react";
import {
  User,
  LogOut,
  ArrowLeft,
  Settings
} from "lucide-react";

// Logo component
const MerkuLogo = ({ className }) => (
  <img 
    src="/merku-logo-mini.png" 
    alt="Merku Logo" 
    className={className}
  />
);

export function UserProfile({ 
  onBack, 
  usuario, 
  setUsuario, 
  setLogueado, 
  setIsRegisteredUser, 
  userPreferences = {}, 
  onSavePreferences = () => {}
}) {
  
  const handleLogout = () => {
    setLogueado(false);
    setIsRegisteredUser(false);
    localStorage.removeItem("usuario");
    localStorage.removeItem("user_email");
    localStorage.removeItem("user_password");
    setUsuario("");
    onBack();
  };

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button 
            onClick={onBack}
            className="mr-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <div className="flex items-center">
            <MerkuLogo className="w-12 mr-3" />
            <div>
              <h1 className="text-2xl font-bold">User Profile</h1>
              <p className="text-sm text-gray-600">Manage your account settings</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <User size={20} className="text-gray-600" />
            <h2 className="text-lg font-semibold">Account Information</h2>
          </div>
          
          <p className="text-sm text-gray-600 mb-4">
            Usuario: <strong>{usuario}</strong>
          </p>
          
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 bg-[#f7941d] text-white py-3 px-4 rounded-lg hover:bg-black transition-colors font-medium"
          >
            <LogOut size={20} />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}