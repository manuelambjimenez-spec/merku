import { Link } from "react-router-dom";
import logo from "../assets/merku-logo-mini.png";

export default function TermsOfUse() {
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
          <h1 className="text-3xl font-bold text-[#f7941d] mb-8">Terms of Use</h1>
          
          <p className="text-gray-600 mb-6">
            Last updated: [Date]
          </p>

          <div className="space-y-8 text-gray-700 leading-relaxed">
            <section>
              <h2 className="text-xl font-semibold text-[#f7941d] mb-4">1. Acceptance of Terms</h2>
              <p className="mb-4">
                By accessing and using Merku's services, you accept and agree to be bound by the 
                terms and provision of this agreement.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[#f7941d] mb-4">2. Use License</h2>
              <p className="mb-4">
                Permission is granted to temporarily use Merku's services for personal, 
                non-commercial transitory viewing only.
              </p>
              <ul className="list-disc list-inside space-y-2 mb-4">
                <li>This is the grant of a license, not a transfer of title</li>
                <li>You may not modify or copy the materials</li>
                <li>You may not use the materials for commercial purposes</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[#f7941d] mb-4">3. Disclaimer</h2>
              <p className="mb-4">
                The materials on Merku's services are provided on an 'as is' basis. 
                Merku makes no warranties, expressed or implied.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[#f7941d] mb-4">4. Limitations</h2>
              <p className="mb-4">
                In no event shall Merku or its suppliers be liable for any damages 
                arising out of the use or inability to use the services.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[#f7941d] mb-4">5. Accuracy of Materials</h2>
              <p className="mb-4">
                The materials appearing on Merku's services could include technical, 
                typographical, or photographic errors.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[#f7941d] mb-4">6. Contact Information</h2>
              <p className="mb-4">
                If you have any questions about these Terms of Use, please contact us at legal@merku.com.
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
            className="hover:text-black transition-colors"
          >
            Privacy Policy
          </Link>
          <Link 
            to="/terms-of-use" 
            className="hover:text-black transition-colors font-semibold"
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