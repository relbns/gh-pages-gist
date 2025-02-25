import { useState, useEffect } from 'react';
import { fetchFromGist, updateGist, createGist } from '../services/gistStorage';

export default function GistStorageExample() {
  const [data, setData] = useState(null);
  const [newItem, setNewItem] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [gistId, setGistId] = useState(localStorage.getItem('gistId') || '');
  const [filename, setFilename] = useState('data.json');

  // Fetch data from gist
  const fetchData = async () => {
    if (!gistId) return;

    setLoading(true);
    setError(null);

    try {
      const fetchedData = await fetchFromGist(gistId, filename);
      setData(fetchedData);
      localStorage.setItem('gistId', gistId);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Save data to gist
  const saveData = async () => {
    if (!gistId) return;

    setLoading(true);
    setError(null);

    try {
      await updateGist(gistId, filename, data);
      alert('Data saved successfully!');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Create a new gist with initial data
  const createNewGist = async () => {
    setLoading(true);
    setError(null);

    const initialData = { items: [] };

    try {
      const result = await createGist(
        'My App Data',
        filename,
        initialData,
        false
      );
      setGistId(result.id);
      setData(initialData);
      localStorage.setItem('gistId', result.id);
      alert(`New gist created with ID: ${result.id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Add new item to data
  const addItem = () => {
    if (!newItem.trim() || !data) return;

    const updatedData = {
      ...data,
      items: [...(data.items || []), { id: Date.now(), text: newItem }],
    };

    setData(updatedData);
    setNewItem('');
  };

  // Remove item from data
  const removeItem = (id) => {
    if (!data || !data.items) return;

    const updatedData = {
      ...data,
      items: data.items.filter((item) => item.id !== id),
    };

    setData(updatedData);
  };

  return (
    <div className="gist-storage-container p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">GitHub Gist Storage Example</h1>

      {/* Gist Configuration */}
      <div className="mb-6 p-4 bg-gray-100 rounded-lg">
        <div className="mb-4">
          <label className="block mb-1">Gist ID:</label>
          <div className="flex">
            <input
              type="text"
              value={gistId}
              onChange={(e) => setGistId(e.target.value)}
              className="flex-1 p-2 border rounded"
              placeholder="Enter your gist ID"
            />
            <button
              onClick={fetchData}
              disabled={!gistId || loading}
              className="ml-2 bg-blue-500 text-white px-4 py-2 rounded disabled:bg-blue-300"
            >
              Load
            </button>
          </div>
        </div>

        <div className="mb-4">
          <label className="block mb-1">Filename:</label>
          <input
            type="text"
            value={filename}
            onChange={(e) => setFilename(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="data.json"
          />
        </div>

        <button
          onClick={createNewGist}
          disabled={loading}
          className="bg-green-500 text-white px-4 py-2 rounded disabled:bg-green-300"
        >
          Create New Gist
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {/* Loading Indicator */}
      {loading && (
        <div className="mb-4 p-3 bg-blue-100 text-blue-700 rounded-lg">
          Loading...
        </div>
      )}

      {/* Data Display and Management */}
      {data && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Your Data</h2>

          {/* Add New Item */}
          <div className="mb-4 flex">
            <input
              type="text"
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              className="flex-1 p-2 border rounded"
              placeholder="Add new item"
            />
            <button
              onClick={addItem}
              className="ml-2 bg-purple-500 text-white px-4 py-2 rounded"
            >
              Add
            </button>
          </div>

          {/* Items List */}
          <div className="mb-4 border rounded-lg overflow-hidden">
            {data.items && data.items.length > 0 ? (
              <ul className="divide-y">
                {data.items.map((item) => (
                  <li
                    key={item.id}
                    className="p-3 flex justify-between items-center"
                  >
                    <span>{item.text}</span>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="p-4 text-gray-500">No items yet. Add some!</p>
            )}
          </div>

          {/* Save Button */}
          <button
            onClick={saveData}
            disabled={loading}
            className="w-full bg-blue-500 text-white px-4 py-2 rounded disabled:bg-blue-300"
          >
            Save to Gist
          </button>
        </div>
      )}

      {/* Raw Data Display */}
      {data && (
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Raw JSON:</h3>
          <pre className="bg-gray-800 text-green-400 p-4 rounded-lg overflow-x-auto">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
