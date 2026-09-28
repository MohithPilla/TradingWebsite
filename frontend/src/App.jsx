import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { useContext } from 'react';

// Layouts
import MainLayout from './layouts/MainLayout';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Market from './pages/Market';
import CompanyDetails from './pages/CompanyDetails';
import Portfolio from './pages/Portfolio';
import Watchlist from './pages/Watchlist';
import Transactions from './pages/Transactions';
import Learning from './pages/Learning';
import LearningArticle from './pages/LearningArticle';
import Profile from './pages/Profile';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageCompanies from './pages/admin/ManageCompanies';
import UserManagement from './pages/admin/UserManagement';
import AdminTransactions from './pages/admin/AdminTransactions';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div className="h-screen flex items-center justify-center">Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (requireAdmin && user.role !== 'ADMIN') return <Navigate to="/dashboard" />;

  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* User Routes */}
          <Route path="/" element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
            <Route index element={<Navigate to="/dashboard" />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="market" element={<Market />} />
            <Route path="companies/:id" element={<CompanyDetails />} />
            <Route path="portfolio" element={<Portfolio />} />
            <Route path="watchlist" element={<Watchlist />} />
            <Route path="transactions" element={<Transactions />} />
            <Route path="learn" element={<Learning />} />
            <Route path="learn/:id" element={<LearningArticle />} />
            <Route path="profile" element={<Profile />} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin" element={<ProtectedRoute requireAdmin={true}><MainLayout isAdmin={true} /></ProtectedRoute>}>
            <Route index element={<Navigate to="/admin/dashboard" />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="user-records" element={<UserManagement />} />
            <Route path="companies" element={<ManageCompanies />} />
            <Route path="transactions" element={<AdminTransactions />} />
            <Route path="settings" element={<Profile />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
