import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-6">Gist Storage App</h1>
        <p className="text-lg mb-8">
          A simple React application that uses GitHub Gists as a storage
          backend. Protected with client-side authentication.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/gist-storage"
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-lg"
          >
            Try Gist Storage
          </Link>

          <Link
            to="/settings"
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-6 rounded-lg"
          >
            Settings
          </Link>
        </div>
      </div>
    </div>
  );
}
