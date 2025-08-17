import { useState, useEffect } from "react";
import {
  User,
  LogOut,
  Check,
  AlertTriangle,
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

        <div className="bg-gray-50 rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Test Profile</h2>
          <p>Usuario: {usuario}</p>
          <p>Esta versión básica debería funcionar</p>
          
          <button
            onClick={() => {
              setLogueado(false);
              setIsRegisteredUser(false);
              localStorage.removeItem("usuario");
              setUsuario("");
              onBack();
            }}
            className="mt-4 bg-[#f7941d] text-white py-2 px-4 rounded-lg hover:bg-black transition-colors"
          >
            Logout (Test)
          </button>
        </div>
      </div>
    </div>
  );
}