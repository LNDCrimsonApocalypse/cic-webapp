'use client'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12 mb-12">
          {/* Brand Column */}
          <div className="md:col-span-1">
            <h3 className="text-2xl font-marcellus text-umak-blue mb-4">
              CIC
            </h3>
            <p className="text-sm text-gray-600 font-metropolis leading-relaxed">
              The Center for Integrated Communications is the University of Makati's primary media and publications arm.
            </p>
            <p className="text-xs text-gray-500 font-metropolis mt-6">
              University of Makati {currentYear}
            </p>
          </div>

          {/* Contact Column */}
          <div>
            <h4 className="text-sm font-bold font-metropolis text-umak-blue uppercase tracking-wider mb-4">
              Contact
            </h4>
            <div className="space-y-3 text-sm font-metropolis text-gray-600">
              <p>Center for Integrated Communications</p>
              <p>University of Makati</p>
              <p>J.P. Rizal Extension, West Rembo</p>
              <p>Taguig City, Metro Manila</p>
              <p className="pt-2">
                <a href="mailto:cic@umak.edu.ph" className="hover:text-umak-blue transition-colors">
                  cic@umak.edu.ph
                </a>
              </p>
              <p>
                <a href="mailto:info@umak.edu.ph" className="hover:text-umak-blue transition-colors">
                  info@umak.edu.ph
                </a>
              </p>
            </div>
          </div>

          {/* Quick Links Column */}
          <div>
            <h4 className="text-sm font-bold font-metropolis text-umak-blue uppercase tracking-wider mb-4">
              Quick Links
            </h4>
            <ul className="space-y-3 text-sm font-metropolis">
              <li>
                <a href="#services" className="text-gray-600 hover:text-umak-blue transition-colors">
                  Our Services
                </a>
              </li>
              <li>
                <a href="#about" className="text-gray-600 hover:text-umak-blue transition-colors">
                  About CIC
                </a>
              </li>
              <li>
                <a href="#request" className="text-gray-600 hover:text-umak-blue transition-colors">
                  Submit Request
                </a>
              </li>
              <li>
                <a href="#guidelines" className="text-gray-600 hover:text-umak-blue transition-colors">
                  Guidelines
                </a>
              </li>
            </ul>
          </div>

          {/* Resources Column */}
          <div>
            <h4 className="text-sm font-bold font-metropolis text-umak-blue uppercase tracking-wider mb-4">
              Resources
            </h4>
            <ul className="space-y-3 text-sm font-metropolis">
              <li>
                <a href="https://bit.ly/UMakBrandKit" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-umak-blue transition-colors">
                  UMak Brand Kit
                </a>
              </li>
              <li>
                <a href="/dashboard" className="text-gray-600 hover:text-umak-blue transition-colors">
                  Dashboard
                </a>
              </li>
              <li>
                <a href="https://umak.edu.ph" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-umak-blue transition-colors">
                  UMak Website
                </a>
              </li>
              <li>
                <a href="#services" className="text-gray-600 hover:text-umak-blue transition-colors">
                  Our Services
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-gray-500 font-metropolis text-center md:text-left">
              All rights reserved 1972 - {currentYear} by University of Makati. Created by Center for Integrated Communications.
            </p>
            <div className="flex gap-6 text-xs font-metropolis">
              <a href="https://umak.edu.ph" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-umak-blue transition-colors">
                UMak Website
              </a>
              <a href="https://makati.gov.ph" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-umak-blue transition-colors">
                Makati City
              </a>
              <a href="#privacy" className="text-gray-500 hover:text-umak-blue transition-colors">
                Privacy Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
