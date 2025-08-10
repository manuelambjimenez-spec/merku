import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { X } from "lucide-react";

export default function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check if user has already made a choice
    const cookieConsent = localStorage.getItem("merku-cookie-consent");
    if (!cookieConsent) {
      // Show banner after a small delay for better UX
      const timer = setTimeout(() => {
        setShowBanner(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem("merku-cookie-consent", "accepted");
    setShowBanner(false);
    // Here you would enable all cookies/analytics
    console.log("All cookies accepted");
  };

  const handleRejectAll = () => {
    localStorage.setItem("merku-cookie-consent", "rejected");
    setShowBanner(false);
    // Here you would disable non-essential cookies
    console.log("Only essential cookies accepted");
  };

  const handleClose = () => {
    // Treat close as reject (GDPR compliant)
    handleRejectAll();
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg">
      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          {/* Close button - mobile top right */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 sm:hidden text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close cookie banner"
          >
            <X size={20} />
          </button>

          {/* Content */}
          <div className="flex-1 pr-8 sm:pr-4">
            <p className="text-sm text-gray-700 leading-relaxed">
              We use cookies to enhance your browsing experience and analyze our traffic. 
              Essential cookies are required for basic functionality. By clicking "Accept All", 
              you consent to our use of cookies. You can manage your preferences in our{" "}
              <Link 
                to="/privacy-policy" 
                className="text-[#f7941d] hover:text-black underline font-medium"
              >
                Privacy Policy
              </Link>.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <button
              onClick={handleRejectAll}
              className="px-6 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors order-2 sm:order-1"
            >
              Reject All
            </button>
            <button
              onClick={handleAcceptAll}
              className="px-6 py-2 text-sm font-medium text-white bg-[#f7941d] hover:bg-black rounded-lg transition-colors order-1 sm:order-2"
            >
              Accept All
            </button>
          </div>

          {/* Close button - desktop */}
          <button
            onClick={handleClose}
            className="hidden sm:block ml-4 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close cookie banner"
          >
            <X size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}