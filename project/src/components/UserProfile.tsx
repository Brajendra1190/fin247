import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Save, AlertCircle } from 'lucide-react';

export default function UserProfile() {
  const { userProfile, updateProfile } = useAuth();
  const [displayName, setDisplayName] = useState(userProfile?.displayName || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setError('');
      setSuccess('');
      setLoading(true);
      
      await updateProfile({
        displayName,
      });
      
      setSuccess('Profile updated successfully!');
    } catch (err) {
      setError('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center">
          <User className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Profile Settings</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">{userProfile?.email}</p>
        </div>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 dark:bg-red-900/50 p-4 rounded-md flex items-center gap-2 text-red-700 dark:text-red-300">
          <AlertCircle className="h-5 w-5" />
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 bg-green-50 dark:bg-green-900/50 p-4 rounded-md flex items-center gap-2 text-green-700 dark:text-green-300">
          <Save className="h-5 w-5" />
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="displayName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Display Name
          </label>
          <div className="mt-1 relative">
            <input
              type="text"
              id="displayName"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="input-field"
              placeholder="Enter your display name"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Email
          </label>
          <div className="mt-1 relative">
            <div className="flex items-center">
              <Mail className="h-5 w-5 text-gray-400 absolute left-3" />
              <input
                type="email"
                value={userProfile?.email || ''}
                disabled
                className="input-field pl-10 bg-gray-50 dark:bg-gray-700 cursor-not-allowed"
              />
            </div>
          </div>
          <p className="mt-1 text-sm text-gray-500">Email cannot be changed</p>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-auto"
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}