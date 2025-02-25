import { Link, Outlet, useLocation } from 'react-router-dom';
import { isLoggedIn, logout } from '../services/authService';
import { useState } from 'react';

export default function Layout() {
  const [refreshKey, setRefreshKey] = useState(0);
  const location = useLocation();

  const handleLogout = () => {
    logout();
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-gray-800 text-white">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link to="/" className="text-xl font-bold">
              Gist Storage App
            </Link>

            <nav className="flex items-center space-x-6">
              <Link
                to="/"
                className={`hover:text-blue-300 ${
                  location.pathname === '/' ? 'text-blue-300' : ''
                }`}
              >
                Home
              </Link>

              <Link
                to="/gist-storage"
                className={`hover:text-blue-300 ${
                  location.pathname === '/gist-storage' ? 'text-blue-300' : ''
                }`}
              >
                Gist Storage
              </Link>

              <Link
                to="/settings"
                className={`hover:text-blue-300 ${
                  location.pathname === '/settings' ? 'text-blue-300' : ''
                }`}
              >
                Settings
              </Link>

              {isLoggedIn() && (
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                >
                  Logout
                </button>
              )}
            </nav>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        <Outlet key={refreshKey} />
      </main>

      <footer className="bg-gray-100 py-4 mt-8">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>
            © {new Date().getFullYear()} Gist Storage App - GitHub Pages Demo
          </p>
          <p className="text-sm mt-1">
            Using GitHub Gists as a backend with client-side authentication
          </p>
        </div>
      </footer>
    </div>
  );
}
