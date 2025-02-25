// import { useState } from 'react';
// import { ProtectedRoute } from '../components/auth/ProtectedRoute';
// import { resetAuth, logout } from '../services/authService';
// import { useNavigate } from 'react-router-dom';

// export default function SettingsPage() {
//   const [confirmReset, setConfirmReset] = useState(false);
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     logout();
//     navigate('/');
//   };

//   const handleResetAuth = () => {
//     if (confirmReset) {
//       resetAuth();
//       navigate('/');
//     } else {
//       setConfirmReset(true);
//     }
//   };

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <ProtectedRoute>
//         <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
//           <h1 className="text-2xl font-bold mb-6">Settings</h1>

//           <div className="space-y-6">
//             <div>
//               <h2 className="text-lg font-semibold mb-2">Account</h2>
//               <p className="text-gray-600 mb-4">
//                 Manage your account settings and preferences.
//               </p>

//               <button
//                 onClick={handleLogout}
//                 className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
//               >
//                 Log Out
//               </button>
//             </div>

//             <hr />

//             <div>
//               <h2 className="text-lg font-semibold mb-2 text-red-600">
//                 Danger Zone
//               </h2>
//               <p className="text-gray-600 mb-4">
//                 These actions cannot be undone. Be careful!
//               </p>

//               <button
//                 onClick={handleResetAuth}
//                 className={`w-full ${
//                   confirmReset
//                     ? 'bg-red-600 hover:bg-red-700'
//                     : 'bg-red-500 hover:bg-red-600'
//                 } text-white py-2 px-4 rounded`}
//               >
//                 {confirmReset
//                   ? 'Are you sure? Click again to confirm'
//                   : 'Reset Authentication'}
//               </button>

//               {confirmReset && (
//                 <p className="text-sm text-red-600 mt-2">
//                   This will remove your credentials and require you to set up
//                   again.
//                 </p>
//               )}
//             </div>
//           </div>
//         </div>
//       </ProtectedRoute>
//     </div>
//   );
// }
import { useState } from 'react';
import { ProtectedRoute } from '../components/auth/ProtectedRoute';
import { resetAuth, logout } from '../services/authService';
import { useNavigate } from 'react-router-dom';

export default function SettingsPage() {
  const [confirmReset, setConfirmReset] = useState(false);
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    navigate('/');
  };
  
  const handleResetAuth = () => {
    if (confirmReset) {
      resetAuth();
      navigate('/');
    } else {
      setConfirmReset(true);
    }
  };
  
  const exportSettings = () => {
    // Collect all relevant settings from localStorage
    const settings = {
      gistId: localStorage.getItem('gistId') || '',
      // Add any other necessary settings, but NOT auth credentials for security
    };
    
    // Create a downloadable JSON file
    const dataStr = JSON.stringify(settings, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    // Trigger download
    const exportLink = document.createElement('a');
    exportLink.setAttribute('href', dataUri);
    exportLink.setAttribute('download', 'gist-settings.json');
    document.body.appendChild(exportLink); // Required for Firefox
    exportLink.click();
    document.body.removeChild(exportLink);
  };
  
  const handleImportSettings = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const settings = JSON.parse(e.target.result);
        
        // Apply imported settings
        if (settings.gistId) {
          localStorage.setItem('gistId', settings.gistId);
        }
        
        // Add handling for other settings as needed
        
        alert('Settings imported successfully');
      } catch (error) {
        console.error('Error importing settings:', error);
        alert('Failed to import settings. Invalid file format.');
      }
    };
    reader.readAsText(file);
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <ProtectedRoute>
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold mb-6">Settings</h1>
          
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold mb-2">Account</h2>
              <p className="text-gray-600 mb-4">
                Manage your account settings and preferences.
              </p>
              
              <button
                onClick={handleLogout}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
              >
                Log Out
              </button>
            </div>
            
            <hr />
            
            <div>
              <h2 className="text-lg font-semibold mb-2">Data Portability</h2>
              <p className="text-gray-600 mb-4">
                Export or import your app settings to use across different devices.
              </p>
              
              <div className="space-y-3">
                <button
                  onClick={exportSettings}
                  className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded"
                >
                  Export Settings
                </button>
                
                <div className="mt-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Import Settings
                  </label>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImportSettings}
                    className="block w-full text-sm text-gray-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded file:border-0
                      file:text-sm file:font-semibold
                      file:bg-blue-50 file:text-blue-700
                      hover:file:bg-blue-100"
                  />
                </div>
              </div>
            </div>
            
            <hr />
            
            <div>
              <h2 className="text-lg font-semibold mb-2 text-red-600">Danger Zone</h2>
              <p className="text-gray-600 mb-4">
                These actions cannot be undone. Be careful!
              </p>
              
              <button
                onClick={handleResetAuth}
                className={`w-full ${
                  confirmReset
                    ? 'bg-red-600 hover:bg-red-700'
                    : 'bg-red-500 hover:bg-red-600'
                } text-white py-2 px-4 rounded`}
              >
                {confirmReset
                  ? 'Are you sure? Click again to confirm'
                  : 'Reset Authentication'}
              </button>
              
              {confirmReset && (
                <p className="text-sm text-red-600 mt-2">
                  This will remove your credentials and require you to set up again.
                </p>
              )}
            </div>
          </div>
        </div>
      </ProtectedRoute>
    </div>
  );
}