import { ArrowLeft } from "lucide-react";

// Logo component
const MerkuLogo = ({ className }) => (
  <img 
    src="src/assets/merku-logo-mini.png" 
    alt="Merku Logo" 
    className={className}
  />
);

// Privacy Policy Page
export function PrivacyPolicy({ onBack }) {
  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-4xl mx-auto">
        <button 
          onClick={onBack}
          className="mb-6 flex items-center gap-2 text-[#f7941d] hover:text-black transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Merku
        </button>
        <div className="flex items-center mb-6">
          <MerkuLogo className="w-12 mr-3" />
          <h1 className="text-3xl font-bold">Privacy Policy</h1>
        </div>
        <div className="prose max-w-none">
          <p className="mb-4">This is a placeholder for the Privacy Policy content.</p>
          <p className="mb-4">The actual content would be loaded from the full privacy policy document.</p>
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
          className="mb-6 flex items-center gap-2 text-[#f7941d] hover:text-black transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Merku
        </button>
        <div className="flex items-center mb-6">
          <MerkuLogo className="w-12 mr-3" />
          <h1 className="text-3xl font-bold">Terms of Use</h1>
        </div>
        <div className="prose max-w-none">
          <p className="mb-4">This is a placeholder for the Terms of Use content.</p>
          <p className="mb-4">The actual content would be loaded from the full terms document.</p>
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
          className="mb-6 flex items-center gap-2 text-[#f7941d] hover:text-black transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Merku
        </button>
        <div className="flex items-center mb-6">
          <MerkuLogo className="w-12 mr-3" />
          <h1 className="text-3xl font-bold">Cookies Policy</h1>
        </div>
        <div className="prose max-w-none">
          <p className="mb-4">This is a placeholder for the Cookies Policy content.</p>
          <p className="mb-4">The actual content would be loaded from the full cookies policy document.</p>
        </div>
      </div>
    </div>
  );
}