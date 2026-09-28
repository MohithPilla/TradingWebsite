import { useEffect, useState, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler, Legend);

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const [summary, setSummary] = useState(null);
  const [learningArticles, setLearningArticles] = useState([]);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await api.get('/portfolio/summary');
        setSummary(res.data.data);
      } catch (err) { console.error(err); }
    };
    const fetchLearning = async () => {
      try {
        const res = await api.get('/learning');
        setLearningArticles(res.data.data.slice(0, 3));
      } catch (err) { console.error(err); }
    };
    fetchSummary();
    fetchLearning();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-800 mb-2">Good Morning, {user?.name} 👋</h2>
      <p className="text-slate-500 mb-8">Track your market, learn companies and manage your virtual portfolio.</p>
      
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="text-slate-500 text-sm mb-1">Available Balance</div>
            <div className="text-2xl font-bold text-slate-800">₹{summary.availableBalance.toLocaleString()}</div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="text-slate-500 text-sm mb-1">Portfolio Value</div>
            <div className="text-2xl font-bold text-slate-800">₹{summary.portfolioValue.toLocaleString()}</div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="text-slate-500 text-sm mb-1">Invested Amount</div>
            <div className="text-2xl font-bold text-slate-800">₹{summary.investedAmount.toLocaleString()}</div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="text-slate-500 text-sm mb-1">Total P&L</div>
            <div className={`text-2xl font-bold ${summary.totalProfitLoss >= 0 ? 'text-positive' : 'text-negative'}`}>
              {summary.totalProfitLoss >= 0 ? '+' : '-'}₹{Math.abs(summary.totalProfitLoss).toLocaleString()}
              <span className="text-sm font-normal ml-2">
                ({summary.investedAmount > 0 ? ((summary.totalProfitLoss / summary.investedAmount) * 100).toFixed(2) : 0}%)
              </span>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100 min-h-[300px]">
          <h3 className="font-bold text-slate-800 mb-4">Portfolio Performance</h3>
          <div className="h-64">
            <Line 
              data={{
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{
                  label: 'Portfolio Value',
                  data: summary ? [
                    summary.portfolioValue * 0.9,
                    summary.portfolioValue * 0.95,
                    summary.portfolioValue * 0.98,
                    summary.portfolioValue * 0.97,
                    summary.portfolioValue * 1.02,
                    summary.portfolioValue * 1.05,
                    summary.portfolioValue
                  ] : [0, 0, 0, 0, 0, 0, 0],
                  borderColor: '#4f46e5',
                  tension: 0.4,
                  fill: true,
                  backgroundColor: 'rgba(79, 70, 229, 0.1)',
                }]
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: { y: { display: true }, x: { display: true } }
              }}
            />
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="font-bold text-slate-800 mb-4">Learning For You</h3>
          <div className="space-y-4">
            {learningArticles.map((article) => (
              <div key={article._id} className="p-4 bg-primary-50 rounded-xl hover:bg-primary-100 transition cursor-pointer" onClick={() => window.location.href=`/learn/${article._id}`}>
                <div className="font-medium text-primary-900">{article.title}</div>
                <div className="text-sm text-primary-700 mt-1">{article.category}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}