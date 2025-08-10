import { Link } from "react-router-dom";
import logo from "../assets/merku-logo-mini.png";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 py-4">
  <div className="max-w-4xl mx-auto px-6 flex items-center">
    <Link to="/" className="flex items-center">
      <img src={logo} alt="Merku Logo" className="w-17 h-12 object-contain" />
    </Link>
  </div>
</header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="prose prose-gray max-w-none">
          <h1 className="text-3xl font-bold text-[#f7941d] mb-8">Privacy Policy</h1>
          
          <p className="text-gray-600 mb-6">
            Last updated: [Date]
          </p>

          <div className="space-y-8 text-gray-700 leading-relaxed">
            <section>
              <h2 className="text-xl font-semibold text-[#f7941d] mb-4">1. Information We Collect</h2>
              <p className="mb-4">
                We collect information you provide directly to us, such as when you create an account, 
                use our services, or contact us for support.
              </p>
              <ul className="list-disc list-inside space-y-2 mb-4">
                <li>Personal information (name, email address)</li>
                <li>Search queries and preferences</li>
                <li>Device and usage information</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[#f7941d] mb-4">2. How We Use Your Information</h2>
              <p className="mb-4">
                We use the information we collect to provide, maintain, and improve our services, 
                including to personalize your shopping experience.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[#f7941d] mb-4">3. Information Sharing</h2>
              <p className="mb-4">
                We do not sell, trade, or otherwise transfer your personal information to third parties 
                without your consent, except as described in this policy.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[#f7941d] mb-4">4. Data Security</h2>
              <p className="mb-4">
                We implement appropriate security measures to protect your personal information 
                against unauthorized access, alteration, disclosure, or destruction.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[#f7941d] mb-4">5. Contact Us</h2>
              <p className="mb-4">
                If you have any questions about this Privacy Policy, please contact us at privacy@merku.com.
              </p>
            </section>
          </div>
        </div>

        {/* Back to home */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <Link 
            to="/" 
            className="inline-flex items-center text-[#f7941d] hover:text-black transition-colors"
          >
            ← Back to Merku
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-16 pb-6 text-center">
        <div className="flex justify-center items-center gap-6 text-xs text-[#c2bfbf]">
          <Link 
            to="/privacy-policy" 
            className="hover:text-black transition-colors font-semibold"
          >
            Privacy Policy
          </Link>
          <Link 
            to="/terms-of-use" 
            className="hover:text-black transition-colors"
          >
            Terms of Use
          </Link>
          <Link 
            to="/cookies-policy" 
            className="hover:text-black transition-colors"
          >
            Cookies Policy
          </Link>
        </div>
      </footer>
    </div>
  );
}