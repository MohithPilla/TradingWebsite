import { useEffect, useState } from 'react';
import api from '../services/api';

export default function Portfolio() {
  const [portfolio, setPortfolio] = useState([]);
  
  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const res = await api.get('/portfolio');
        setPortfolio(res.data.data);
      } catch (err) { console.error(err); }
    };
    fetchPortfolio();
  }, []);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 text-sm">
            <th className="p-4 font-medium">Company</th>
            <th className="p-4 font-medium text-right">Quantity</th>
            <th className="p-4 font-medium text-right">Avg Price</th>
            <th className="p-4 font-medium text-right">Current Price</th>
            <th className="p-4 font-medium text-right">Current Value</th>
            <th className="p-4 font-medium text-right">P&L</th>
          </tr>
        </thead>
        <tbody>
          {portfolio.map(p => (
            <tr key={p._id} className="border-b border-slate-100 hover:bg-slate-50 transition">
              <td className="p-4">
                <div className="font-bold text-slate-800">{p.company?.symbol}</div>
              </td>
              <td className="p-4 text-right text-slate-600">{p.quantity}</td>
              <td className="p-4 text-right text-slate-600">₹{p.averagePrice.toFixed(2)}</td>
              <td className="p-4 text-right text-slate-600">₹{p.currentPrice.toLocaleString()}</td>
              <td className="p-4 text-right font-medium text-slate-800">₹{p.currentValue.toLocaleString()}</td>
              <td className={`p-4 text-right font-medium ${p.profitLoss >= 0 ? 'text-positive' : 'text-negative'}`}>
                {p.profitLoss >= 0 ? '+' : ''}₹{p.profitLoss.toLocaleString()} ({p.profitLossPercent.toFixed(2)}%)
              </td>
            </tr>
          ))}
          {portfolio.length === 0 && <tr><td colSpan="6" className="p-8 text-center text-slate-500">Your portfolio is empty. Start trading!</td></tr>}
        </tbody>
      </table>
    </div>
  );
}