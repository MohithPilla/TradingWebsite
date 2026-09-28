import { useEffect, useState } from 'react';
import api from '../services/api';
import { Link } from 'react-router-dom';
import { Trash2 } from 'lucide-react';

export default function Watchlist() {
  const [watchlist, setWatchlist] = useState([]);

  const fetchWatchlist = async () => {
    try {
      const res = await api.get('/watchlist');
      setWatchlist(res.data.data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    fetchWatchlist();
  }, []);

  const handleRemove = async (id) => {
    try {
      await api.delete(`/watchlist/${id}`);
      fetchWatchlist();
    } catch (err) { alert('Failed to remove'); }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 text-sm">
            <th className="p-4 font-medium">Company</th>
            <th className="p-4 font-medium text-right">Price</th>
            <th className="p-4 font-medium text-right">Change</th>
            <th className="p-4 font-medium text-center">Action</th>
          </tr>
        </thead>
        <tbody>
          {watchlist.map(c => (
            <tr key={c._id} className="border-b border-slate-100 hover:bg-slate-50 transition">
              <td className="p-4">
                <div className="font-bold text-slate-800">{c.symbol}</div>
                <div className="text-sm text-slate-500">{c.name}</div>
              </td>
              <td className="p-4 text-right font-medium text-slate-800">₹{c.price.toLocaleString()}</td>
              <td className={`p-4 text-right font-medium ${c.change >= 0 ? 'text-positive' : 'text-negative'}`}>
                {c.change >= 0 ? '+' : ''}{c.change} ({c.changePercent}%)
              </td>
              <td className="p-4 flex items-center justify-center gap-2">
                <Link to={`/companies/${c._id}`} className="px-4 py-2 bg-primary-50 text-primary-700 hover:bg-primary-100 rounded-lg text-sm font-medium transition">
                  View
                </Link>
                <button onClick={() => handleRemove(c._id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition">
                  <Trash2 size={18} />
                </button>
              </td>
            </tr>
          ))}
          {watchlist.length === 0 && <tr><td colSpan="4" className="p-8 text-center text-slate-500">Your watchlist is empty.</td></tr>}
        </tbody>
      </table>
    </div>
  );
}