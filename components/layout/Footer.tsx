import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Allante String Quartet</h3>
            <p className="text-gray-300 text-sm">
              Bringing beautiful chamber music to San Diego and beyond.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-gray-300 hover:text-white transition-colors text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/concerts" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Concerts
                </Link>
              </li>
              <li>
                <Link href="/hire" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Hire Us
                </Link>
              </li>
              <li>
                <Link href="/donate" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Donate
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <p className="text-gray-300 text-sm mb-2">
              Email: info@allantequartet.com
            </p>
            <Link
              href="/contact"
              className="inline-block text-sm text-secondary hover:text-white transition-colors"
            >
              Contact Form →
            </Link>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-300">
          <p>&copy; {currentYear} Allante String Quartet. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
