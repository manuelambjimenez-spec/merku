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
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  // Load user data on component mount
  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("usuario") || '{}');
    const savedEmail = localStorage.getItem("user_email") || '';
    
    setFormData(prev => ({
      ...prev,
      nombre: typeof savedUser === 'string' ? savedUser : savedUser.nombre || usuario || '',
      email: savedEmail
    }));
  }, [usuario]);

  // Clear message after 3 seconds
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
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleSaveChanges = () => {
    // Validate required fields
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

    // If changing password, validate password fields
    if (formData.newPassword || formData.confirmPassword || formData.currentPassword) {
      const savedPassword = localStorage.getItem("user_password");
      
      if (!formData.currentPassword) {
        setMessage('Current password is required to change password');
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
    }

    // Save changes
    try {
      localStorage.setItem("usuario", formData.nombre);
      localStorage.setItem("user_email", formData.email);
      
      if (formData.newPassword) {
        localStorage.setItem("user_password", formData.newPassword);
      }

      // Update state
      setUsuario(formData.nombre);
      
      // Clear password fields
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));

      setMessage('Changes saved successfully!');
      setMessageType('success');
      setIsEditing(false);
    } catch (error) {
      setMessage('Error saving changes. Please try again.');
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
      // Remove all user data from localStorage
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

      // Reset state
      setLogueado(false);
      setIsRegisteredUser(false);
      setUsuario("");
      
      // Go back to main page
      onBack();
    } catch (error) {
      setMessage('Error deleting account. Please try again.');
      setMessageType('error');
    }
  };

  // Check if user has completed preferences
  const hasPreferences = () => {
    try {
      const savedPrefs = localStorage.getItem(`preferencias_${usuario}`);
      if (savedPrefs) {
        const prefs = JSON.parse(savedPrefs);
        return Object.values(prefs).some(value => value !== '');
      }
    } catch (error) {
      console.log("Error checking preferences:", error);
    }
    
    // Fallback to current userPreferences state
    return Object.values(userPreferences).some(value => value !== '');
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

        {/* Success/Error Message */}
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

        {/* Account Information */}
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
                  onClick={() => {
                    setIsEditing(false);
                    // Reset form data
                    const savedUser = localStorage.getItem("usuario") || '';
                    const savedEmail = localStorage.getItem("user_email") || '';
                    setFormData(prev => ({
                      ...prev,
                      nombre: savedUser,
                      email: savedEmail,
                      currentPassword: '',
                      newPassword: '',
                      confirmPassword: ''
                    }));
                  }}
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
            {/* Name */}
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

            {/* Email */}
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

            {/* Password Change Section - Only show when editing */}
            {isEditing && (
              <>
                <div className="border-t pt-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Change Password (Optional)</h3>
                  
                  {/* Current Password */}
                  <div className="mb-3">
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

                  {/* New Password */}
                  <div className="mb-3">
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

                  {/* Confirm New Password */}
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
              </>
            )}
          </div>
        </div>

        {/* Profile Status */}
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Settings size={20} className="text-gray-600" />
            <h2 className="text-lg font-semibold">Profile Status</h2>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {hasPreferences() ? (
                <>
                  <Check size={20} className="text-green-600" />
                  <span className="text-sm text-green-800 font-medium">
                    ✅ You've completed your preferences.
                  </span>
                </>
              ) : (
                <>
                  <AlertTriangle size={20} className="text-yellow-600" />
                  <span className="text-sm text-yellow-800 font-medium">
                    ⚠️ You haven't completed your preferences yet.
                  </span>
                </>
              )}
            </div>
            <button
              onClick={() => setShowPreferencePanel(true)}
              className="text-sm text-[#f7941d] hover:text-black transition-colors font-medium"
            >
              Preferences
            </button>
          </div>
        </div>

        {/* Account Actions */}
        <div className="bg-gray-50 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-6">
            <User size={20} className="text-gray-600" />
            <h2 className="text-lg font-semibold">Account</h2>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-3 bg-[#f7941d] text-white py-3 px-4 rounded-lg hover:bg-black transition-colors font-medium mb-6"
          >
            <LogOut size={20} />
            Sign Out
          </button>

          {/* Delete Account Section */}
          <div className="border-t pt-6">
            <div className="text-center">
              <p className="text-sm text-gray-500 mb-4">
                Need to delete your account? This action cannot be undone.
              </p>
              {!showDeleteConfirm ? (
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="text-sm text-gray-400 hover:text-red-600 transition-colors underline"
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