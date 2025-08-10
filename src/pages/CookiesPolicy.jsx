import { Link } from "react-router-dom";
import logo from "../assets/merku-logo-mini.png";

export default function CookiesPolicy() {
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
          <h1 className="text-3xl font-bold text-[#f7941d] mb-8">Cookies Policy</h1>
          
          <p className="text-gray-600 mb-6">
            Last updated: [Date]
          </p>

          <div className="space-y-8 text-gray-700 leading-relaxed">
            <section>
              <h2 className="text-xl font-semibold text-[#f7941d] mb-4">1. What Are Cookies</h2>
              <p className="mb-4">
                Cookies are small text files that are placed on your computer or mobile device 
                when you visit our website. They help us provide you with a better experience.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[#f7941d] mb-4">2. How We Use Cookies</h2>
              <p className="mb-4">We use cookies for several purposes:</p>
              <ul className="list-disc list-inside space-y-2 mb-4">
                <li>To remember your preferences and settings</li>
                <li>To analyze how our services are used</li>
                <li>To provide personalized content and recommendations</li>
                <li>To improve our services and user experience</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[#f7941d] mb-4">3. Types of Cookies We Use</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Essential Cookies</h3>
                  <p>These cookies are necessary for the website to function properly.</p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Analytics Cookies</h3>
                  <p>These help us understand how visitors interact with our website.</p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Preference Cookies</h3>
                  <p>These remember your choices and preferences to personalize your experience.</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[#f7941d] mb-4">4. Managing Cookies</h2>
              <p className="mb-4">
                You can control and manage cookies in various ways. Most browsers allow you to:
              </p>
              <ul className="list-disc list-inside space-y-2 mb-4">
                <li>View what cookies you have and delete them individually</li>
                <li>Block third-party cookies</li>
                <li>Block cookies from particular sites</li>
                <li>Block all cookies from being set</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[#f7941d] mb-4">5. Changes to This Policy</h2>
              <p className="mb-4">
                We may update this Cookies Policy from time to time. Any changes will be 
                posted on this page with an updated revision date.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[#f7941d] mb-4">6. Contact Us</h2>
              <p className="mb-4">
                If you have any questions about our use of cookies, please contact us at cookies@merku.com.
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
            className="hover:text-black transition-colors"
          >
            Terms of Use
          </Link>
          <Link 
            to="/cookies-policy" 
            className="hover:text-black transition-colors font-semibold"
          >
            Cookies Policy
          </Link>
        </div>
      </footer>
    </div>
  );
}