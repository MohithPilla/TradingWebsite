import { useEffect, useState } from 'react';
import api from '../services/api';
import { format } from 'date-fns';

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await api.get('/transactions');
        setTransactions(res.data.data);
      } catch (err) { console.error(err); }
    };
    fetchTransactions();
  }, []);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 text-sm">
            <th className="p-4 font-medium">Date</th>
            <th className="p-4 font-medium">Type</th>
            <th className="p-4 font-medium">Description</th>
            <th className="p-4 font-medium text-right">Amount</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map(t => (
            <tr key={t._id} className="border-b border-slate-100 hover:bg-slate-50 transition">
              <td className="p-4 text-slate-600">{format(new Date(t.createdAt), 'MMM dd, yyyy HH:mm')}</td>
              <td className="p-4">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${t.type === 'BUY' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                  {t.type}
                </span>
              </td>
              <td className="p-4 text-slate-800">{t.description}</td>
              <td className="p-4 text-right font-medium text-slate-800">₹{t.amount.toLocaleString()}</td>
            </tr>
          ))}
          {transactions.length === 0 && <tr><td colSpan="4" className="p-8 text-center text-slate-500">No transactions found.</td></tr>}
        </tbody>
      </table>
    </div>
  );
}