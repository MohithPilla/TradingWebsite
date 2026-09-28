import { useState, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { User, Lock, Save, CheckCircle } from 'lucide-react';

export default function Profile() {
  const { user, setUser } = useContext(AuthContext);
  
  const [name, setName] = useState(user?.name || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (newPassword && newPassword !== confirmPassword) {
      return setError('New passwords do not match');
    }

    setLoading(true);
    try {
      const res = await api.put('/auth/profile', {
        name,
        currentPassword: currentPassword || undefined,
        newPassword: newPassword || undefined,
      });
      setUser(res.data.data);
      setSuccess('Profile updated successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800 mb-1">Profile Settings</h2>
        <p className="text-slate-500">Manage your personal information and security.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8">
        {success && (
          <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-xl flex items-center">
            <CheckCircle className="w-5 h-5 mr-2" /> {success}
          </div>
        )}
        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleUpdateProfile} className="space-y-8">
          
          {/* Personal Info */}
          <div>
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
              <User className="w-5 h-5 mr-2 text-primary-500" /> Personal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
                <input 
                  type="email" 
                  value={user?.email}
                  disabled
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 cursor-not-allowed" 
                />
              </div>
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Security */}
          <div>
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
              <Lock className="w-5 h-5 mr-2 text-primary-500" /> Change Password
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Current Password</label>
                <input 
                  type="password" 
                  value={currentPassword}
                  onChange={e => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password if changing"
                  className="w-full max-w-md px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500" 
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">New Password</label>
                  <input 
                    type="password" 
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    placeholder="New password"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Confirm New Password</label>
                  <input 
                    type="password" 
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500" 
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button 
              type="submit" 
              disabled={loading}
              className="flex items-center px-6 py-3 bg-primary-600 text-white font-medium rounded-xl hover:bg-primary-700 transition disabled:opacity-50"
            >
              {loading ? 'Saving...' : <><Save className="w-5 h-5 mr-2" /> Save Changes</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
