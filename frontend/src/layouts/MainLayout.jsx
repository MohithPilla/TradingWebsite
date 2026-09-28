// MainLayout.jsx changes
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { LogOut, Home, TrendingUp, BookOpen, Briefcase, Star, List, Bell, Users, Settings, Search, Menu, X, CreditCard, ChevronDown } from 'lucide-react';
import api from '../services/api';

export default function MainLayout({ isAdmin = false }) {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifs = async () => {
      try {
        const res = await api.get('/notifications');
        setNotifications(res.data.data.slice(0, 5));
      } catch (err) {}
    };
    if (user) fetchNotifs();
  }, [user]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = isAdmin ? [
    { name: 'Dashboard', path: '/admin/dashboard', icon: Home },
    { name: 'User Management', path: '/admin/users', icon: Users },
    { name: 'User Records', path: '/admin/user-records', icon: List },
    { name: 'Stock Management', path: '/admin/companies', icon: Briefcase },
    { name: 'Transaction Records', path: '/admin/transactions', icon: CreditCard },
    { name: 'Notifications', path: '/admin/notifications', icon: Bell },
    { name: 'Settings', path: '/admin/settings', icon: Settings },
  ] : [
    { name: 'Dashboard', path: '/dashboard', icon: Home },
    { name: 'Market', path: '/market', icon: TrendingUp },
    { name: 'Portfolio', path: '/portfolio', icon: Briefcase },
    { name: 'Watchlist', path: '/watchlist', icon: Star },
    { name: 'Transactions', path: '/transactions', icon: List },
    { name: 'Learn', path: '/learn', icon: BookOpen },
  ];

  return (
    <div className="h-screen bg-[#f8f9fa] flex flex-col md:flex-row overflow-hidden font-sans">
      
      {/* Mobile Header */}
      <div className="md:hidden bg-white p-4 flex justify-between items-center border-b border-gray-200">
        <div className="flex items-center gap-2 font-bold text-xl text-gray-900">
          <TrendingUp className="text-gold-500 w-6 h-6" />
          <span>Smart Trade</span>
        </div>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-gray-600">
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`w-full md:w-64 bg-white border-r border-gray-200 flex flex-col transition-all duration-300 absolute md:static z-20 h-full ${mobileMenuOpen ? 'left-0' : '-left-full md:left-0'}`}>
        <div className="p-6 hidden md:flex items-center gap-3 font-bold text-2xl text-gray-900 border-b border-gray-100">
          <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center">
            <TrendingUp className="text-gold-500 w-6 h-6" />
          </div>
          <span>Smart Trade</span>
        </div>
        
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto mt-4 md:mt-0">
          {navItems.map(item => {
            const isActive = location.pathname.startsWith(item.path);
            return (
              <Link 
                key={item.name} 
                to={item.path} 
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
                  isActive 
                    ? 'bg-gray-900 text-gold-500 shadow-md shadow-gray-200' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <item.icon size={20} className={isActive ? 'text-gold-500' : 'text-gray-400'} />
                <span>{item.name}</span>
              </Link>
            )
          })}
        </nav>
        
        <div className="p-4 border-t border-gray-100">
          <button 
            onClick={handleLogout} 
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors w-full font-medium"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Navbar */}
        <header className="bg-white h-20 px-8 border-b border-gray-200 flex justify-between items-center shrink-0">
          <h1 className="text-2xl font-bold text-gray-900 capitalize hidden sm:block">
            {location.pathname.split('/').pop().replace('-', ' ') || 'Dashboard'}
          </h1>
          
          <div className="flex items-center gap-6 ml-auto sm:ml-0 w-full sm:w-auto justify-end">
            <div className="relative hidden md:block group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400 group-focus-within:text-gold-500 transition-colors" />
              </div>
              <input 
                type="text" 
                placeholder="Search anything..." 
                className="bg-gray-50 pl-10 pr-4 py-2.5 rounded-full text-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:bg-white w-64 transition-all" 
              />
            </div>
            
            <div className="relative">
              <button onClick={() => setNotifDropdownOpen(!notifDropdownOpen)} className="relative text-gray-400 hover:text-gray-900 transition-colors focus:outline-none p-1">
                <Bell size={24} />
                {unreadCount > 0 && <span className="absolute top-0 right-0 bg-red-500 border-2 border-white w-3 h-3 rounded-full"></span>}
              </button>
              
              {notifDropdownOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg shadow-gray-200/50 border border-gray-100 py-2 z-50">
                  <div className="px-4 py-2 border-b border-gray-100 font-bold text-gray-900">Notifications</div>
                  <div className="max-h-64 overflow-y-auto">
                    {notifications.length > 0 ? notifications.map(n => (
                      <div key={n._id} className="px-4 py-3 border-b border-gray-50 hover:bg-gray-50">
                        <div className="text-sm text-gray-800">{n.message}</div>
                        <div className="text-xs text-gray-400 mt-1">{new Date(n.createdAt).toLocaleDateString()}</div>
                      </div>
                    )) : (
                      <div className="px-4 py-3 text-sm text-gray-500">No new notifications</div>
                    )}
                  </div>
                </div>
              )}
            </div>
            
            <div className="h-8 w-px bg-gray-200 hidden sm:block"></div>
            
            <div className="relative">
              <button 
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-3 hover:bg-gray-50 p-1.5 rounded-full pr-4 transition-colors focus:outline-none"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-gold-400 to-gold-600 flex items-center justify-center text-white font-bold shadow-sm">
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div className="hidden sm:block text-left">
                  <div className="text-sm font-semibold text-gray-900 leading-tight">{user?.name}</div>
                  <div className="text-xs text-gray-500">{isAdmin ? 'Administrator' : 'Trader'}</div>
                </div>
                <ChevronDown size={16} className="text-gray-400 hidden sm:block" />
              </button>
              
              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg shadow-gray-200/50 border border-gray-100 py-2 z-50">
                  <div className="px-4 py-2 border-b border-gray-100 sm:hidden">
                    <div className="text-sm font-semibold text-gray-900">{user?.name}</div>
                    <div className="text-xs text-gray-500">{user?.email}</div>
                  </div>
                  <Link to={isAdmin ? "/admin/settings" : "/profile"} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Profile Settings</Link>
                  <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">Logout</button>
                </div>
              )}
            </div>
          </div>
        </header>
        
        <div className="flex-1 overflow-auto p-6 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}