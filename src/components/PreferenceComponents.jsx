import { useState } from "react";
import { X } from "lucide-react";

// Logo component
const MerkuLogo = ({ className }) => (
  <img 
    src="/merku-logo-mini.png" 
    alt="Merku Logo" 
    className={className}
  />
);

// PreferencePanel component with updated gender options
export function PreferencePanel({ isOpen, onClose, userPreferences, onSavePreferences }) {
  const [preferences, setPreferences] = useState({
    gender: userPreferences.gender || '',
    customGender: userPreferences.customGender || '',
    pronouns: userPreferences.pronouns || '',
    clothingSize: userPreferences.clothingSize || '',
    pantsSize: userPreferences.pantsSize || '',
    shoeSize: userPreferences.shoeSize || ''
  });

  const handleInputChange = (field, value) => {
    setPreferences(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    // Clean up custom gender and pronouns if not using "Custom" option
    const cleanedPreferences = { ...preferences };
    if (preferences.gender !== 'custom') {
      cleanedPreferences.customGender = '';
      cleanedPreferences.pronouns = '';
    }
    
    onSavePreferences(cleanedPreferences);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-11/12 max-w-md relative max-h-[90vh] overflow-y-auto">
        <button
          className="absolute top-2 right-2 text-black hover:text-gray-600 text-xl font-bold"
          onClick={onClose}
        >
          <X size={20} />
        </button>
        
        <div className="flex items-center justify-center mb-6">
          <MerkuLogo className="w-12 mr-2" />
          <h2 className="text-xl font-bold">Your Preferences</h2>
        </div>

        <p className="text-sm text-gray-600 mb-6 text-center">
          Help Merku personalize your shopping experience! All fields are optional.
        </p>

        <div className="space-y-4">
          {/* Gender */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Gender
            </label>
            <select
              value={preferences.gender}
              onChange={(e) => handleInputChange('gender', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f7941d] focus:border-transparent"
            >
              <option value="">Select gender</option>
              <option value="woman">Woman</option>
              <option value="man">Man</option>
              <option value="prefer-not-to-say">Prefer not to say</option>
              <option value="custom">Custom</option>
            </select>
          </div>

          {/* Custom Gender Fields - Only show if "Custom" is selected */}
          {preferences.gender === 'custom' && (
            <>
              {/* Custom Gender Text Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  What is your gender?
                </label>
                <input
                  type="text"
                  value={preferences.customGender}
                  onChange={(e) => handleInputChange('customGender', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f7941d] focus:border-transparent"
                  placeholder="Enter your gender"
                />
              </div>

              {/* Pronouns Radio Buttons */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  I prefer to be addressed as
                </label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="pronouns"
                      value="woman"
                      checked={preferences.pronouns === 'woman'}
                      onChange={(e) => handleInputChange('pronouns', e.target.value)}
                      className="mr-2 text-[#f7941d] focus:ring-[#f7941d]"
                    />
                    <span className="text-sm">Woman</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="pronouns"
                      value="man"
                      checked={preferences.pronouns === 'man'}
                      onChange={(e) => handleInputChange('pronouns', e.target.value)}
                      className="mr-2 text-[#f7941d] focus:ring-[#f7941d]"
                    />
                    <span className="text-sm">Man</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="pronouns"
                      value="other"
                      checked={preferences.pronouns === 'other'}
                      onChange={(e) => handleInputChange('pronouns', e.target.value)}
                      className="mr-2 text-[#f7941d] focus:ring-[#f7941d]"
                    />
                    <span className="text-sm">Other</span>
                  </label>
                </div>
              </div>
            </>
          )}

          {/* Clothing Size */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Clothing Size (General)
            </label>
            <select
              value={preferences.clothingSize}
              onChange={(e) => handleInputChange('clothingSize', e.target.value)}
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
              Pants/Skirt Size
            </label>
            <input
              type="text"
              value={preferences.pantsSize}
              onChange={(e) => handleInputChange('pantsSize', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f7941d] focus:border-transparent"
              placeholder="e.g. 32, M, 28W"
            />
          </div>

          {/* Shoe Size */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Shoe Size
            </label>
            <input
              type="text"
              value={preferences.shoeSize}
              onChange={(e) => handleInputChange('shoeSize', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f7941d] focus:border-transparent"
              placeholder="e.g. 9, 38, 7.5"
            />
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-4 py-2 bg-[#f7941d] text-white rounded-lg hover:bg-black transition-colors font-medium"
          >
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  );
}

// PreferenceReminder component
export function PreferenceReminder({ isOpen, onClose, onOpenPreferences }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-11/12 max-w-sm relative">
        <div className="text-center">
          <MerkuLogo className="w-16 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Hey there! 👋</h3>
          <p className="text-sm text-gray-600 mb-6">
            If you complete your preferences, Merku will tailor your shopping experience just for you 😄 Wanna do it now?
          </p>
          
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
            >
              Maybe later
            </button>
            <button
              onClick={onOpenPreferences}
              className="flex-1 px-4 py-2 bg-[#f7941d] text-white rounded-lg hover:bg-black transition-colors font-medium text-sm"
            >
              Sure, let's go!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}