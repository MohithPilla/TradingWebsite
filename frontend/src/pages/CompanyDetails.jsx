import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler, Legend);

export default function CompanyDetails() {
  const { id } = useParams();
  const [company, setCompany] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const fetchCompany = async () => {
    try {
      const res = await api.get(`/companies/${id}`);
      setCompany(res.data.data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    fetchCompany();
  }, [id]);

  const handleTrade = async (type) => {
    try {
      const res = await api.post(`/orders/${type.toLowerCase()}`, { companyId: id, quantity: Number(quantity) });
      alert(res.data.message);
    } catch (err) {
      alert(err.response?.data?.message || 'Trade failed');
    }
  };

  const handleWatchlist = async () => {
    try {
      await api.post(`/watchlist/${id}`);
      alert('Added to watchlist');
    } catch(e) { alert('Failed to add'); }
  };

  if (!company) return <div>Loading...</div>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold text-slate-800">{company.name}</h1>
              <div className="text-lg text-slate-500 mt-1">{company.symbol} • {company.sector}</div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-slate-800">₹{company.price.toLocaleString()}</div>
              <div className={`text-lg font-medium mt-1 ${company.change >= 0 ? 'text-positive' : 'text-negative'}`}>
                {company.change >= 0 ? '+' : ''}{company.change} ({company.changePercent}%)
              </div>
            </div>
          </div>
          <div className="flex gap-4 mb-6">
             <button onClick={handleWatchlist} className="px-4 py-2 border border-primary-600 text-primary-600 font-medium rounded-lg hover:bg-primary-50 transition">+ Add to Watchlist</button>
          </div>
          <div className="h-64 bg-white rounded-xl border border-slate-100 p-4">
            <Line 
              data={{
                labels: ['9:30 AM', '10:30 AM', '11:30 AM', '12:30 PM', '1:30 PM', '2:30 PM', '3:30 PM'],
                datasets: [{
                  label: 'Price',
                  data: [
                    company.price * 0.98, 
                    company.price * 0.99, 
                    company.price * 1.01, 
                    company.price * 0.99, 
                    company.price * 1.02, 
                    company.price * 0.995, 
                    company.price
                  ],
                  borderColor: company.change >= 0 ? '#22c55e' : '#ef4444',
                  tension: 0.4,
                  fill: true,
                  backgroundColor: company.change >= 0 ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
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
          <h3 className="text-xl font-bold text-slate-800 mb-4">About Company</h3>
          <p className="text-slate-600 leading-relaxed">{company.description}</p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Trade {company.symbol}</h3>
          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-700 mb-1">Quantity</label>
            <input type="number" min="1" value={quantity} onChange={e => setQuantity(e.target.value)} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none" />
          </div>
          <div className="flex justify-between items-center mb-6 text-slate-600">
            <span>Estimated Value:</span>
            <span className="font-bold text-slate-800">₹{(company.price * quantity).toLocaleString()}</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <button onClick={() => handleTrade('BUY')} className="bg-positive text-white py-3 rounded-xl font-bold hover:bg-green-600 transition">BUY</button>
            <button onClick={() => handleTrade('SELL')} className="bg-negative text-white py-3 rounded-xl font-bold hover:bg-red-600 transition">SELL</button>
          </div>
        </div>
      </div>
    </div>
  );
}