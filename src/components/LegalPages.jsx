// Legal Pages Components

// Privacy Policy Page
export function PrivacyPolicy({ onBack }) {
  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-4xl mx-auto">
        <button 
          onClick={onBack}
          className="mb-6 text-[#f7941d] hover:text-black transition-colors"
        >
          ← Back to Merku
        </button>
        <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
        <div className="prose max-w-none">
          <p className="mb-4">This is a placeholder for the Privacy Policy content.</p>
          <p className="mb-4">The actual content would be loaded from src/pages/PrivacyPolicy.jsx</p>
        </div>
      </div>
    </div>
  );
}

// Terms of Use Page
export function TermsOfUse({ onBack }) {
  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-4xl mx-auto">
        <button 
          onClick={onBack}
          className="mb-6 text-[#f7941d] hover:text-black transition-colors"
        >
          ← Back to Merku
        </button>
        <h1 className="text-3xl font-bold mb-6">Terms of Use</h1>
        <div className="prose max-w-none">
          <p className="mb-4">This is a placeholder for the Terms of Use content.</p>
          <p className="mb-4">The actual content would be loaded from src/pages/TermsOfUse.jsx</p>
        </div>
      </div>
    </div>
  );
}

// Cookies Policy Page
export function CookiesPolicy({ onBack }) {
  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-4xl mx-auto">
        <button 
          onClick={onBack}
          className="mb-6 text-[#f7941d] hover:text-black transition-colors"
        >
          ← Back to Merku
        </button>
        <h1 className="text-3xl font-bold mb-6">Cookies Policy</h1>
        <div className="prose max-w-none">
          <p className="mb-4">This is a placeholder for the Cookies Policy content.</p>
          <p className="mb-4">The actual content would be loaded from src/pages/CookiesPolicy.jsx</p>
        </div>
      </div>
    </div>
  );
}