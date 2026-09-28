import { useEffect, useState, useContext } from 'react';
import api from '../../services/api';
import { AuthContext } from '../../context/AuthContext';
import { Search, Filter, ChevronLeft, ChevronRight, MoreVertical, Check, X, Eye, Edit } from 'lucide-react';
import { format } from 'date-fns';

export default function UserManagement() {
  const { user: currentUser } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [verifiedFilter, setVerifiedFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, [page, search, statusFilter, verifiedFilter]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 10 });
      if (search) params.append('search', search);
      if (statusFilter) params.append('status', statusFilter);
      if (verifiedFilter) params.append('verified', verifiedFilter);
      
      const res = await api.get(`/admin/users?${params.toString()}`);
      setUsers(res.data.data);
      setTotalPages(res.data.pages);
      setTotalUsers(res.data.total);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (userId, newStatus) => {
    if(!window.confirm(`Are you sure you want to ${newStatus === 'ACTIVE' ? 'activate' : 'deactivate'} this user?`)) return;
    try {
      await api.put(`/admin/users/${userId}/status`, { status: newStatus });
      fetchUsers();
      if(selectedUser && selectedUser._id === userId) {
        setSelectedUser({...selectedUser, status: newStatus});
      }
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    if(userId === currentUser._id) {
      return alert("You cannot change your own role.");
    }
    if(!window.confirm(`Change role to ${newRole}?`)) return;
    try {
      await api.put(`/admin/users/${userId}/role`, { role: newRole });
      fetchUsers();
      if(selectedUser && selectedUser._id === userId) {
        setSelectedUser({...selectedUser, role: newRole});
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update role');
    }
  };

  const viewDetails = async (user) => {
    try {
      const res = await api.get(`/admin/users/${user._id}`);
      setSelectedUser(res.data.data);
      setIsModalOpen(true);
    } catch (err) {
      alert('Failed to load user details');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-1">User Management</h2>
          <p className="text-gray-500">Manage all registered users on the platform.</p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input 
            type="text" 
            placeholder="Search by name or email..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-gold-500 outline-none transition-all"
          />
        </div>
        
        <div className="flex gap-4">
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-gold-500 outline-none"
          >
            <option value="">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </select>

          <select 
            value={verifiedFilter}
            onChange={(e) => setVerifiedFilter(e.target.value)}
            className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-gold-500 outline-none"
          >
            <option value="">All Verification</option>
            <option value="true">Verified</option>
            <option value="false">Unverified</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 text-sm font-medium uppercase tracking-wider">
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Verified</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Registered</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                    <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-gold-500 mb-2"></div>
                    <p>Loading users...</p>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                    No users found matching your criteria.
                  </td>
                </tr>
              ) : (
                users.map(u => (
                  <tr key={u._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{u.name}</div>
                      <div className="text-sm text-gray-500">{u.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${u.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {u.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {u.emailVerified ? (
                        <span className="inline-flex items-center text-green-600"><Check size={16} className="mr-1"/> Yes</span>
                      ) : (
                        <span className="inline-flex items-center text-amber-500"><X size={16} className="mr-1"/> No</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${u.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {format(new Date(u.createdAt), 'MMM d, yyyy')}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <button onClick={() => viewDetails(u)} className="text-gray-400 hover:text-gold-600 transition-colors" title="View Details">
                          <Eye size={18} />
                        </button>
                        {u.status === 'ACTIVE' ? (
                          <button onClick={() => handleStatusChange(u._id, 'INACTIVE')} className="text-gray-400 hover:text-red-600 transition-colors" title="Deactivate">
                            <X size={18} />
                          </button>
                        ) : (
                          <button onClick={() => handleStatusChange(u._id, 'ACTIVE')} className="text-gray-400 hover:text-green-600 transition-colors" title="Activate">
                            <Check size={18} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="bg-white px-6 py-4 border-t border-gray-100 flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Showing <span className="font-medium text-gray-900">{users.length > 0 ? (page - 1) * 10 + 1 : 0}</span> to <span className="font-medium text-gray-900">{Math.min(page * 10, totalUsers)}</span> of <span className="font-medium text-gray-900">{totalUsers}</span> users
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-50 transition-colors"
            >
              <ChevronLeft size={18} />
            </button>
            <button 
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages || totalPages === 0}
              className="p-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-50 transition-colors"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* User Details Modal */}
      {isModalOpen && selectedUser && (
        <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="text-xl font-bold text-gray-900">User Profile</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6">
              <div className="flex items-center gap-6 mb-8 pb-8 border-b border-gray-100">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                  {selectedUser.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h4 className="text-2xl font-bold text-gray-900">{selectedUser.name}</h4>
                  <p className="text-gray-500">{selectedUser.email}</p>
                  <div className="flex gap-2 mt-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${selectedUser.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {selectedUser.status}
                    </span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${selectedUser.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
                      {selectedUser.role}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-8">
                <div>
                  <div className="text-sm text-gray-500 mb-1">User ID</div>
                  <div className="font-medium text-gray-900 font-mono text-sm bg-gray-50 p-2 rounded-lg break-all">{selectedUser._id}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-1">Registration Date</div>
                  <div className="font-medium text-gray-900">{format(new Date(selectedUser.createdAt), 'PPP')}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-1">Email Verification</div>
                  <div className="font-medium text-gray-900 flex items-center">
                    {selectedUser.emailVerified ? (
                      <span className="text-green-600 flex items-center"><Check size={16} className="mr-1"/> Verified</span>
                    ) : (
                      <span className="text-amber-500 flex items-center"><X size={16} className="mr-1"/> Unverified</span>
                    )}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-1">Total Trades</div>
                  <div className="font-medium text-gray-900">{selectedUser.totalTrades || 0}</div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                <h5 className="font-bold text-gray-900 mb-4">Administrative Actions</h5>
                <div className="flex flex-wrap gap-3">
                  {selectedUser.status === 'ACTIVE' ? (
                    <button onClick={() => handleStatusChange(selectedUser._id, 'INACTIVE')} className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-red-600 font-medium hover:bg-red-50 transition-colors">
                      Deactivate Account
                    </button>
                  ) : (
                    <button onClick={() => handleStatusChange(selectedUser._id, 'ACTIVE')} className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-green-600 font-medium hover:bg-green-50 transition-colors">
                      Activate Account
                    </button>
                  )}
                  
                  {selectedUser.role === 'TRADER' ? (
                    <button onClick={() => handleRoleChange(selectedUser._id, 'ADMIN')} className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-purple-600 font-medium hover:bg-purple-50 transition-colors">
                      Promote to Admin
                    </button>
                  ) : (
                    <button onClick={() => handleRoleChange(selectedUser._id, 'TRADER')} className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-blue-600 font-medium hover:bg-blue-50 transition-colors">
                      Demote to Trader
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
