import { useEffect, useState } from 'react';
import api from '../../services/api';

export default function ManageCompanies() {
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await api.get('/companies/admin/all');
        setCompanies(res.data.data);
      } catch (err) { console.error(err); }
    };
    fetchCompanies();
  }, []);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="p-4 border-b border-slate-100 flex justify-between items-center">
        <h3 className="font-bold text-slate-800">Manage Companies</h3>
        <button className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700">Add Company</button>
      </div>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 text-sm">
            <th className="p-4 font-medium">Company</th>
            <th className="p-4 font-medium">Symbol</th>
            <th className="p-4 font-medium">Sector</th>
            <th className="p-4 font-medium text-right">Price</th>
            <th className="p-4 font-medium text-center">Status</th>
          </tr>
        </thead>
        <tbody>
          {companies.map(c => (
            <tr key={c._id} className="border-b border-slate-100 hover:bg-slate-50 transition">
              <td className="p-4 text-slate-800">{c.name}</td>
              <td className="p-4 font-bold text-slate-800">{c.symbol}</td>
              <td className="p-4 text-slate-600">{c.sector}</td>
              <td className="p-4 text-right font-medium text-slate-800">₹{c.price.toLocaleString()}</td>
              <td className="p-4 text-center">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${c.status === 'ACTIVE' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                  {c.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}