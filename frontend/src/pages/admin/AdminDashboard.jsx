import { useEffect, useState } from 'react';
import api from '../../services/api';
import { Users, UserCheck, ShieldAlert, ShieldCheck, CreditCard, UserPlus } from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function AdminDashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/admin/dashboard');
        setData(res.data.data);
      } catch (err) { console.error(err); }
    };
    fetchStats();
  }, []);

  if (!data) return (
    <div className="flex items-center justify-center h-full">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-500"></div>
    </div>
  );

  const { stats, analytics } = data;

  const registrationChartData = {
    labels: analytics?.registrationTrends?.map(item => item._id) || [],
    datasets: [
      {
        label: 'New Registrations',
        data: analytics?.registrationTrends?.map(item => item.count) || [],
        borderColor: '#D4AF37',
        backgroundColor: 'rgba(212, 175, 55, 0.1)',
        fill: true,
        tension: 0.4
      }
    ]
  };

  const verificationChartData = {
    labels: ['Verified', 'Unverified'],
    datasets: [
      {
        data: [stats.verifiedUsers, stats.unverifiedUsers],
        backgroundColor: ['#22c55e', '#f59e0b'],
        borderWidth: 0,
      }
    ]
  };

  const transactionChartData = {
    labels: ['Buy', 'Sell'],
    datasets: [
      {
        label: 'Transactions',
        data: [analytics?.transactions?.buy || 0, analytics?.transactions?.sell || 0],
        backgroundColor: ['#3b82f6', '#ef4444'],
        borderRadius: 4,
      }
    ]
  };

  const activityChartData = {
    labels: ['Active', 'Inactive'],
    datasets: [
      {
        data: [analytics?.userActivity?.active || 0, analytics?.userActivity?.inactive || 0],
        backgroundColor: ['#0ea5e9', '#94a3b8'],
        borderWidth: 0,
      }
    ]
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-1">Overview Dashboard</h2>
          <p className="text-gray-500">Monitor your platform's activity and growth.</p>
        </div>
      </div>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div className="text-gray-500 text-sm font-medium">Total Users</div>
            <div className="p-2 bg-gray-50 text-gray-700 rounded-lg"><Users size={18} /></div>
          </div>
          <div className="text-3xl font-bold text-gray-900">{stats.totalUsers}</div>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div className="text-gray-500 text-sm font-medium">Active Users</div>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><UserCheck size={18} /></div>
          </div>
          <div className="text-3xl font-bold text-gray-900">{stats.activeUsers}</div>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div className="text-gray-500 text-sm font-medium">Verified Users</div>
            <div className="p-2 bg-green-50 text-green-600 rounded-lg"><ShieldCheck size={18} /></div>
          </div>
          <div className="text-3xl font-bold text-gray-900">{stats.verifiedUsers}</div>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div className="text-gray-500 text-sm font-medium">Unverified</div>
            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg"><ShieldAlert size={18} /></div>
          </div>
          <div className="text-3xl font-bold text-gray-900">{stats.unverifiedUsers}</div>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div className="text-gray-500 text-sm font-medium">Total Transactions</div>
            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg"><CreditCard size={18} /></div>
          </div>
          <div className="text-3xl font-bold text-gray-900">{stats.totalTrades}</div>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div className="text-gray-500 text-sm font-medium">New Users (Month)</div>
            <div className="p-2 bg-gold-50 text-gold-600 rounded-lg"><UserPlus size={18} /></div>
          </div>
          <div className="text-3xl font-bold text-gray-900">{stats.newUsersThisMonth}</div>
        </div>
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Registration Trends */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-4">User Registration Trends</h3>
          <div className="h-64">
            <Line 
              data={registrationChartData} 
              options={{ 
                responsive: true, 
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: { y: { beginAtZero: true, grid: { borderDash: [2, 4] } }, x: { grid: { display: false } } }
              }} 
            />
          </div>
        </div>

        {/* Transaction Stats */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Transaction Statistics</h3>
          <div className="h-64">
            <Bar 
              data={transactionChartData} 
              options={{ 
                responsive: true, 
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: { y: { beginAtZero: true, grid: { borderDash: [2, 4] } }, x: { grid: { display: false } } }
              }} 
            />
          </div>
        </div>

        {/* Verification Stats */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-4">User Verification</h3>
          <div className="h-64 flex justify-center">
            <Doughnut 
              data={verificationChartData} 
              options={{ 
                responsive: true, 
                maintainAspectRatio: false,
                cutout: '70%',
                plugins: { legend: { position: 'bottom' } }
              }} 
            />
          </div>
        </div>

        {/* Activity Stats */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-4">User Activity</h3>
          <div className="h-64 flex justify-center">
            <Doughnut 
              data={activityChartData} 
              options={{ 
                responsive: true, 
                maintainAspectRatio: false,
                cutout: '70%',
                plugins: { legend: { position: 'bottom' } }
              }} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}