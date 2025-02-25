import { useState } from 'react';
import { setupCredentials } from '../../services/authService';

export function SetupForm({ onSetupComplete }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!username || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    const success = setupCredentials(username, password);
    if (success) {
      setUsername('');
      setPassword('');
      setConfirmPassword('');
      if (onSetupComplete) onSetupComplete();
    } else {
      setError('Failed to set up credentials');
    }
  };

  return (
    <div className="max-w-md mx-auto my-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-2 text-center">First-Time Setup</h2>
      <p className="text-gray-600 mb-6 text-center">
        Create credentials to protect your application
      </p>

      <form onSubmit={handleSubmit}>
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="setup-username">
            Username
          </label>
          <input
            id="setup-username"
            type="text"
            className="w-full p-2 border rounded"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="setup-password">
            Password
          </label>
          <input
            id="setup-password"
            type="password"
            className="w-full p-2 border rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <p className="text-xs text-gray-500 mt-1">
            Must be at least 8 characters
          </p>
        </div>

        <div className="mb-6">
          <label
            className="block text-gray-700 mb-2"
            htmlFor="confirm-password"
          >
            Confirm Password
          </label>
          <input
            id="confirm-password"
            type="password"
            className="w-full p-2 border rounded"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        <button
          type="submit"
          className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600"
        >
          Create Credentials
        </button>
      </form>
    </div>
  );
}
