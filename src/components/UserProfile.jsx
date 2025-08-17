import { useState, useEffect } from "react";
import {
  User,
  LogOut,
  ArrowLeft,
  Settings,
  Eye,
  EyeOff,
  Save,
  Trash2,
  AlertTriangle,
  Check
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
  const [formData, setFormData] = useState({
    name: '',
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
  
  const [isEditing, setIsEditing] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'

  // Load user data on component mount
  useEffect(() => {
    const savedUser = localStorage.getItem("usuario") || '';
    const savedEmail = localStorage.getItem("user_email") || '';
    
    setFormData(prev => ({
      ...prev,
      name: savedUser,
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

  const handleSaveBasicInfo = () => {
    if (!formData.name.trim()) {
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
      localStorage.setItem("usuario", formData.name);
      localStorage.setItem("user_email", formData.email);
      setUsuario(formData.name);
      
      setMessage('Profile updated successfully!');
      setMessageType('success');
      setIsEditing(false);
    } catch (error) {
      setMessage('Error updating profile. Please try again.');
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
      
      // Clear password fields
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

  const getAccountCreated = () => {
    // Simple mock - in real app this would come from backend
    return "January 2025";
  };

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header - Solo flecha y logo */}
        <div className="flex items-center mb-6">
          <button 
            onClick={onBack}
            className="mr-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <MerkuLogo className="w-12" />
        </div>

        {/* Title and subtitle - Ahora debajo */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold">User Profile</h1>
          <p className="text-sm text-gray-600">Manage your account settings</p>
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
                      name: savedUser,
                      email: savedEmail
                    }));
                  }}
                  className="text-sm text-gray-600 hover:text-black transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveBasicInfo}
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
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
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

            {/* User (read-only display) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                User
              </label>
              <div className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-600">
                {usuario}
              </div>
            </div>

            {/* Account Created (read-only) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Account Created
              </label>
              <div className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-600">
                {getAccountCreated()}
              </div>
            </div>
          </div>
        </div>

        {/* Change Password Section */}
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Settings size={20} className="text-gray-600" />
              <h2 className="text-lg font-semibold">Change Password</h2>
            </div>
            <button
              onClick={() => setShowChangePassword(!showChangePassword)}
              className="text-sm text-[#f7941d] hover:text-black transition-colors font-medium"
            >
              {showChangePassword ? 'Cancel' : 'Change Password'}
            </button>
          </div>

          {showChangePassword && (
            <div className="space-y-4">
              {/* Current Password */}
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

              {/* New Password */}
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

              <button
                onClick={handleChangePassword}
                className="w-full bg-[#f7941d] text-white py-2 px-4 rounded-lg hover:bg-black transition-colors font-medium"
              >
                Update Password
              </button>
            </div>
          )}
        </div>

        {/* Logout Button */}
        <div className="mb-6">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-3 bg-gray-200 text-gray-800 py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors font-medium"
          >
            <LogOut size={20} />
            Sign Out
          </button>
        </div>

        {/* Delete Account Section - En rojo al final */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <AlertTriangle size={20} className="text-red-600" />
              <h2 className="text-lg font-semibold text-red-800">Danger Zone</h2>
            </div>
            
            <p className="text-sm text-red-700 mb-4">
              Permanently delete your account and all associated data. This action cannot be undone.
            </p>
            
            {!showDeleteConfirm ? (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                Delete Account
              </button>
            ) : (
              <div>
                <p className="text-xs text-red-700 mb-4 font-medium">
                  Type "delete my account" below to confirm this action:
                </p>
                <input
                  type="text"
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value)}
                  className="w-full px-3 py-2 border border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm mb-4"
                  placeholder="delete my account"
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
                    Delete Forever
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );