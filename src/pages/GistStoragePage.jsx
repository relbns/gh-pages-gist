import { ProtectedRoute } from '../components/auth/ProtectedRoute';
import GistStorageExample from '../components/GistStorageExample';

export default function GistStoragePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <ProtectedRoute>
        <GistStorageExample />
      </ProtectedRoute>
    </div>
  );
}
