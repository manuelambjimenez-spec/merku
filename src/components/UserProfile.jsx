import { useState, useEffect } from "react";
import {
  User,
  LogOut,
  Check,
  AlertTriangle,
  Eye,
  EyeOff,
  Trash2,
  Save,
  ArrowLeft,
  Settings
} from "lucide-react";

// Logo component
const MerkuLogo = ({ className }) => (
  <img 
    src="src/assets/merku-logo-mini.png" 
    alt="Merku Logo" 
    className={className}
  />
);

// User Profile Page Component
export function UserProfile({ 
  onBack, 
  onNavigate, 
  usuario, 
  setUsuario, 
  setLogueado, 
  setIsRegisteredUser, 
  userPreferences, 
  onSavePreferences, 
  setShowPreferencePanel 
}) {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    gender: '',
    customGender: '',
    pronouns: '',
    clothingSize: '',
    pantsSize: '',
    shoeSize: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  // Load user data on component mount
  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("usuario") || '{}');
    const savedEmail = localStorage.getItem("user_email") || '';
    
    const userData = {
      nombre: typeof savedUser === 'string' ? savedUser : savedUser.nombre || usuario || '',
      email: savedEmail,
      gender: localStorage.getItem("user_gender") || '',
      customGender: localStorage.getItem("user_custom_gender") || '',
      pronouns: localStorage.getItem("user_pronouns") || '',
      clothingSize: localStorage.getItem("user_clothing_size") || '',
      pantsSize: localStorage.getItem("user_pants_size") || '',
      shoeSize: localStorage.getItem("user_shoe_size") || '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    };

    try {
      const userSpecificPrefs = localStorage.getItem(`preferencias_${usuario}`);
      if (userSpecificPrefs) {
        const prefs = JSON.parse(userSpecificPrefs);
        userData.gender = prefs.gender || userData.gender;
        userData.customGender = prefs.customGender || userData.customGender;
        userData.pronouns = prefs.pronouns || userData.pronouns;
        userData.clothingSize = prefs.clothingSize || userData.clothingSize;
        userData.pantsSize = prefs.pantsSize || userData.pantsSize;
        userData.shoeSize = prefs.shoeSize || userData.shoeSize;
      }
    } catch (error) {
      console.log("Error loading user-specific preferences:", error);
    }
    
    setFormData(userData);
  }, [usuario]);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage('');
        setMessageType('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    if (field === 'gender' && value !== 'Personalizado') {
      setFormData(prev => ({
        ...prev,
        customGender: '',
        pronouns: ''
      }));
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleSaveChanges = () => {
    if (!formData.nombre.trim()) {
      setMessage('Name is required');
      setMessageType('error');
      return;
    }

    if (!formData.email.trim()) {
      setMessage('Email is required');
      setMessageType('error');
      return;
    }

    try {
      localStorage.setItem("usuario", formData.nombre);
      localStorage.setItem("user_email", formData.email);
      localStorage.setItem("user_gender", formData.gender);
      localStorage.setItem("user_custom_gender", formData.customGender);
      localStorage.setItem("user_pronouns", formData.pronouns);
      localStorage.setItem("user_clothing_size", formData.clothingSize);
      localStorage.setItem("user_pants_size", formData.pantsSize);
      localStorage.setItem("user_shoe_size", formData.shoeSize);

      const preferences = {
        gender: formData.gender,
        customGender: formData.customGender,
        pronouns: formData.pronouns,
        clothingSize: formData.clothingSize,
        pantsSize: formData.pantsSize,
        shoeSize: formData.shoeSize
      };
      localStorage.setItem(`preferencias_${formData.nombre}`, JSON.stringify(preferences));

      setUsuario(formData.nombre);
      if (onSavePreferences) {
        onSavePreferences(preferences);
      }

      setMessage('Changes saved successfully!');
      setMessageType('success');
      setIsEditing(false);
    } catch (error) {
      setMessage('Error saving changes. Please try again.');
      setMessageType('error');
    }
  };

  const handleChangePassword = () => {
    const savedPassword = localStorage.getItem("user_password");
    
    if (!formData.currentPassword) {
      setMessage('Current password is required');
      setMessageType('error');
      return;
    }

    if (savedPassword && formData.currentPassword !== savedPassword) {
      setMessage('Current password is incorrect');
      setMessageType('error');
      return;
    }

    if (!formData.newPassword) {
      setMessage('New password is required');
      setMessageType('error');
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setMessage('New passwords do not match');
      setMessageType('error');
      return;
    }

    if (formData.newPassword.length < 6) {
      setMessage('New password must be at least 6 characters');
      setMessageType('error');
      return;
    }

    try {
      localStorage.setItem("user_password", formData.newPassword);
      
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));

      setMessage('Password changed successfully!');
      setMessageType('success');
      setShowChangePassword(false);
    } catch (error) {
      setMessage('Error changing password. Please try again.');
      setMessageType('error');
    }
  };

  const handleLogout = () => {
    setLogueado(false);
    setIsRegisteredUser(false);
    localStorage.removeItem("usuario");
    localStorage.removeItem("user_email");
    localStorage.removeItem("user_password");
    setUsuario("");
    onBack();
  };

  const handleDeleteAccount = () => {
    if (deleteConfirmText.toLowerCase() !== 'delete my account') {
      setMessage('Please type "delete my account" to confirm');
      setMessageType('error');
      return;
    }

    try {
      const keysToRemove = [
        "usuario",
        "user_email", 
        "user_password",
        `productosGuardados_${usuario}`,
        `preferencias_${usuario}`,
        "user_gender",
        "user_clothing_size",
        "user_pants_size",
        "user_shoe_size",
        "user_custom_gender",
        "user_pronouns",
        "last_preference_reminder"
      ];

      keysToRemove.forEach(key => {
        localStorage.removeItem(key);
      });

      setLogueado(false);
      setIsRegisteredUser(false);
      setUsuario("");
      onBack();
    } catch (error) {
      setMessage('Error deleting account. Please try again.');
      setMessageType('error');
    }
  };

  const cancelEdit = () => {
    setIsEditing(false);
    const savedUser = localStorage.getItem("usuario") || '';
    const savedEmail = localStorage.getItem("user_email") || '';
    
    setFormData(prev => ({
      ...prev,
      nombre: savedUser,
      email: savedEmail,
      gender: localStorage.getItem("user_gender") || '',
      customGender: localStorage.getItem("user_custom_gender") || '',
      pronouns: localStorage.getItem("user_pronouns") || '',
      clothingSize: localStorage.getItem("user_clothing_size") || '',
      pantsSize: localStorage.getItem("user_pants_size") || '',
      shoeSize: localStorage.getItem("user_shoe_size") || '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }));
  };

  const cancelPasswordChange = () => {
    setShowChangePassword(false);
    setFormData(prev => ({
      ...prev,
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }));
  };

  const genderOptions = [
    { value: '', label: 'Select gender' },
    { value: 'Mujer', label: 'Mujer' },
    { value: 'Hombre', label: 'Hombre' },
    { value: 'Prefiero no decirlo', label: 'Prefiero no decirlo' },
    { value: 'Personalizado', label: 'Personalizado' }
  ];

  const pronounOptions = [
    { value: '', label: 'Select pronouns' },
    { value: 'Mujer', label: 'Mujer' },
    { value: 'Hombre', label: 'Hombre' },
    { value: 'Otro', label: 'Otro' }
  ];

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-2xl mx-auto">
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

        {message && (
          <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
            messageType === 'success' 
              ? 'bg-green-50 text-green-800 border border-green-200' 
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            {messageType === 'success' ? (
              <Check size={20} className="text-green-600" />
            ) : (
              <AlertTriangle size={20} className="text-red-600" />
            )}
            <span className="text-sm font-medium">{message}</span>
          </div>
        )}

        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <User size={20} className="text-gray-600" />
              <h2 className="text-lg font-semibold">Account Information</h2>
            </div>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="text-sm text-[#f7941d] hover:text-black transition-colors font-medium"
              >
                Edit
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={cancelEdit}
                  className="text-sm text-gray-600 hover:text-black transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveChanges}
                  className="flex items-center gap-1 text-sm bg-[#f7941d] text-white px-3 py-1 rounded-lg hover:bg-black transition-colors font-medium"
                >
                  <Save size={16} />
                  Save
                </button>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Name
              </label>
              <input
                type="text"
                value={formData.nombre}
                onChange={(e) => handleInputChange('nombre', e.target.value)}
                disabled={!isEditing}
                className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f7941d] focus:border-transparent ${
                  !isEditing ? 'bg-gray-100 text-gray-600' : ''
                }`}
                placeholder="Your full name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                disabled={!isEditing}
                className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f7941d] focus:border-transparent ${
                  !isEditing ? 'bg-gray-100 text-gray-600' : ''
                }`}
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Género
              </label>
              <select
                value={formData.gender}
                onChange={(e) => handleInputChange('gender', e.target.value)}
                disabled={!isEditing}
                className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f7941d] focus:border-transparent ${
                  !isEditing ? 'bg-gray-100 text-gray-600' : ''
                }`}
              >
                {genderOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {formData.gender === 'Personalizado' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ¿Cuál es tu género?
                  </label>
                  <input
                    type="text"
                    value={formData.customGender}
                    onChange={(e) => handleInputChange('customGender', e.target.value)}
                    disabled={!isEditing}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f7941d] focus:border-transparent ${
                      !isEditing ? 'bg-gray-100 text-gray-600' : ''
                    }`}
                    placeholder="Describe tu género"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prefiero que se me trate como
                  </label>
                  <select
                    value={formData.pronouns}
                    onChange={(e) => handleInputChange('pronouns', e.target.value)}
                    disabled={!isEditing}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f7941d] focus:border-transparent ${
                      !isEditing ? 'bg-gray-100 text-gray-600' : ''
                    }`}
                  >
                    {pronounOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Talla de ropa general
              </label>
              <input
                type="text"
                value={formData.clothingSize}
                onChange={(e) => handleInputChange('clothingSize', e.target.value)}
                disabled={!isEditing}
                className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f7941d] focus:border-transparent ${
                  !isEditing ? 'bg-gray-100 text-gray-600' : ''
                }`}
                placeholder="XS, S, M, L, XL, etc."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Talla de pantalón/falda
              </label>
              <input
                type="text"
                value={formData.pantsSize}
                onChange={(e) => handleInputChange('pantsSize', e.target.value)}
                disabled={!isEditing}
                className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f7941d] focus:border-transparent ${
                  !isEditing ? 'bg-gray-100 text-gray-600' : ''
                }`}
                placeholder="28, 30, 32, 34, etc."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Talla de calzado
              </label>
              <input
                type="text"
                value={formData.shoeSize}
                onChange={(e) => handleInputChange('shoeSize', e.target.value)}
                disabled={!isEditing}
                className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f7941d] focus:border-transparent ${
                  !isEditing ? 'bg-gray-100 text-gray-600' : ''
                }`}
                placeholder="35, 36, 37, 38, etc."
              />
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Settings size={20} className="text-gray-600" />
              <h2 className="text-lg font-semibold">Password</h2>
            </div>
            {!showChangePassword ? (
              <button
                onClick={() => setShowChangePassword(true)}
                className="text-sm bg-[#f7941d] text-white px-3 py-1 rounded-lg hover:bg-black transition-colors font-medium"
              >
                Change Password
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={cancelPasswordChange}
                  className="text-sm text-gray-600 hover:text-black transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleChangePassword}
                  className="text-sm bg-[#f7941d] text-white px-3 py-1 rounded-lg hover:bg-black transition-colors font-medium"
                >
                  Save Password
                </button>
              </div>
            )}
          </div>

          {showChangePassword && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.current ? "text" : "password"}
                    value={formData.currentPassword}
                    onChange={(e) => handleInputChange('currentPassword', e.target.value)}
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f7941d] focus:border-transparent"
                    placeholder="Enter current password"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('current')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPasswords.current ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.new ? "text" : "password"}
                    value={formData.newPassword}
                    onChange={(e) => handleInputChange('newPassword', e.target.value)}
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f7941d] focus:border-transparent"
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('new')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPasswords.new ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.confirm ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f7941d] focus:border-transparent"
                    placeholder="Confirm new password"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('confirm')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPasswords.confirm ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="bg-gray-50 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-6">
            <User size={20} className="text-gray-600" />
            <h2 className="text-lg font-semibold">Account Actions</h2>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-3 bg-[#f7941d] text-white py-3 px-4 rounded-lg hover:bg-black transition-colors font-medium mb-6"
          >
            <LogOut size={20} />
            Logout
          </button>

          <div className="border-t pt-6">
            <div className="text-center">
              <h3 className="text-sm font-medium text-red-600 mb-4">Danger Zone</h3>
              <p className="text-sm text-gray-500 mb-4">
                Need to delete your account? This action cannot be undone.
              </p>
              {!showDeleteConfirm ? (
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="text-sm bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors font-medium"
                >
                  Delete Account
                </button>
              ) : (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <AlertTriangle size={16} className="text-red-600" />
                    <span className="text-sm font-medium text-red-800">
                      Are you sure you want to delete your account?
                    </span>
                  </div>
                  <p className="text-xs text-red-700 mb-4">
                    This will permanently delete all your data, including saved products and preferences. 
                    Type "delete my account" below to confirm.
                  </p>
                  <input
                    type="text"
                    value={deleteConfirmText}
                    onChange={(e) => setDeleteConfirmText(e.target.value)}
                    className="w-full px-3 py-2 border border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm mb-4"
                    placeholder="Type: delete my account"
                  />
                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        setShowDeleteConfirm(false);
                        setDeleteConfirmText('');
                      }}
                      className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleDeleteAccount}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                    >
                      <Trash2 size={16} />
                      Delete Account
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default UserProfile;