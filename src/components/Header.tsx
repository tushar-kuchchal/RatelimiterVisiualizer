import { Activity } from 'lucide-react';

export function Header() {
  const isActive = (path: string) =>
    typeof window !== 'undefined' && window.location.pathname === path;

  const linkClass = (path: string) =>
    `text-sm font-medium transition ${
      isActive(path) ? 'text-green-400' : 'text-gray-300 hover:text-green-400'
    }`;

  return (
    <header className="bg-gray-800 border-b border-gray-700 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <a href="/" className="flex items-center space-x-3">
            <div className="p-2 bg-green-400/10 rounded-lg">
              <Activity className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">Rate Limiter Visualizer</h1>
              <p className="text-xs text-gray-400 hidden sm:block">
                Real-time monitoring and simulation
              </p>
            </div>
          </a>

          <nav className="flex items-center space-x-6">
            <a href="/" className={linkClass('/')}>Home</a>
            <a href="/about" className={linkClass('/about')}>About</a>
            <a href="/privacy" className={linkClass('/privacy')}>Privacy</a>
            <a href="/contact" className={linkClass('/contact')}>Contact</a>
          </nav>
        </div>
      </div>
    </header>
  );
}
