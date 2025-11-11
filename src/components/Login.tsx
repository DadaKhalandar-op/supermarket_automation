import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { ShoppingCart, Loader2, AlertCircle } from 'lucide-react';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const { login, sessionExpired, clearSessionExpired } = useAuth();

  useEffect(() => {
    if (sessionExpired) { 
      setError('Your session has expired. Please login again.');
      clearSessionExpired();
    }
  }, [sessionExpired, clearSessionExpired]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    setLoadingMessage('Connecting to server...');

    // Show different messages during cold start
    const messageTimer = setTimeout(() => {
      setLoadingMessage('Server is waking up (this may take up to 60 seconds)...');
    }, 5000);

    const messageTimer2 = setTimeout(() => {
      setLoadingMessage('Almost there, please wait...');
    }, 15000);

    try {
      await login(username, password);
    } catch (err) {
      const error = err as Error;
      if (error.message.includes('timeout')) {
        setError('Server is taking longer than expected. Please try again in a moment.');
      } else {
        setError(error.message || 'Invalid username or password');
      }
    } finally {
      clearTimeout(messageTimer);
      clearTimeout(messageTimer2);
      setIsLoading(false);
      setLoadingMessage('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-8 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full mb-4">
              <ShoppingCart className="w-10 h-10 text-emerald-600" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Supermarket SAS</h1>
            <p className="text-emerald-100 text-sm">Automation Software System</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                disabled={isLoading}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                placeholder="Enter your username"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                placeholder="Enter your password"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-start space-x-2">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {isLoading && loadingMessage && (
              <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg text-sm flex items-start space-x-2">
                <Loader2 className="w-5 h-5 flex-shrink-0 mt-0.5 animate-spin" />
                <span>{loadingMessage}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-3 rounded-lg font-semibold hover:from-emerald-700 hover:to-teal-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <span>Sign In</span>
              )}
            </button>
          </form>

          <div className="bg-gray-50 px-8 py-4 border-t border-gray-200">
            <div className="text-xs text-gray-600 text-center">
              <p className="mb-2">Default Login Credentials:</p>
              <p><strong>Manager:</strong> manager / manager123</p>
              <p><strong>Clerk:</strong> clerk1 / clerk123</p>
            </div>
          </div>
        </div>

        {/* Cold Start Notice */}
        <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start space-x-2">
            <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-yellow-800">
              <p className="font-semibold mb-1">First Login May Take Longer</p>
              <p>The server may take up to 60 seconds to wake up if it hasn't been used recently (free tier limitation).</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
