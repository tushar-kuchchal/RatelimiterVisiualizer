import { Activity } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gray-800 border-t border-gray-700 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center space-x-3 mb-3">
              <div className="p-2 bg-green-400/10 rounded-lg">
                <Activity className="w-5 h-5 text-green-400" />
              </div>
              <span className="text-white font-semibold">Rate Limiter Visualizer</span>
            </div>
            <p className="text-sm text-gray-400">
              An interactive, open educational tool for learning how rate limiting algorithms
              work in real-world distributed systems.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3">Learn</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <a href="/" className="hover:text-green-400 transition">Home</a>
              </li>
              <li>
                <a href="/about" className="hover:text-green-400 transition">About Rate Limiting</a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3">Legal</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <a href="/privacy" className="hover:text-green-400 transition">Privacy Policy</a>
              </li>
              <li>
                <a href="/contact" className="hover:text-green-400 transition">Contact</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-gray-700 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} Rate Limiter Visualizer. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
