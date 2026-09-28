import { useEffect, useState } from 'react';
import api from '../services/api';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';

export default function Market() {
  const [companies, setCompanies] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCompanies, setFilteredCompanies] = useState([]);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const res = await api.get('/companies');
      setCompanies(res.data.data);
      setFilteredCompanies(res.data.data);
    } catch (err) { console.error(err); }
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      if (!searchQuery) {
        setFilteredCompanies(companies);
      } else {
        const query = searchQuery.toLowerCase();
        setFilteredCompanies(companies.filter(c => 
          c.name.toLowerCase().includes(query) || 
          c.symbol.toLowerCase().includes(query) || 
          c.sector.toLowerCase().includes(query)
        ));
      }
    }
  };

  return (
    <div>
      <div className="mb-6 relative w-full max-w-2xl">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-6 w-6 text-slate-400" />
        </div>
        <input 
          type="text" 
          placeholder="Search companies, symbols or sectors (Press Enter)..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleSearch}
          className="w-full pl-12 pr-6 py-4 rounded-xl border border-slate-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 text-lg" 
        />
      </div>
      
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 text-sm">
              <th className="p-4 font-medium">Company</th>
              <th className="p-4 font-medium">Sector</th>
              <th className="p-4 font-medium text-right">Price</th>
              <th className="p-4 font-medium text-right">Change</th>
              <th className="p-4 font-medium text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredCompanies.map(c => (
              <tr key={c._id} className="border-b border-slate-100 hover:bg-slate-50 transition">
                <td className="p-4">
                  <div className="font-bold text-slate-800">{c.symbol}</div>
                  <div className="text-sm text-slate-500">{c.name}</div>
                </td>
                <td className="p-4 text-slate-600">{c.sector}</td>
                <td className="p-4 text-right font-medium text-slate-800">₹{c.price.toLocaleString()}</td>
                <td className={`p-4 text-right font-medium ${c.change >= 0 ? 'text-positive' : 'text-negative'}`}>
                  {c.change >= 0 ? '+' : ''}{c.change} ({c.changePercent}%)
                </td>
                <td className="p-4 text-center">
                  <Link to={`/companies/${c._id}`} className="px-4 py-2 bg-primary-50 text-primary-700 hover:bg-primary-100 rounded-lg text-sm font-medium transition">
                    View
                  </Link>
                </td>
              </tr>
            ))}
            {filteredCompanies.length === 0 && (
              <tr>
                <td colSpan="5" className="p-8 text-center text-slate-500">
                  No companies found matching your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}