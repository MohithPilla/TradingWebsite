import { useEffect, useState } from 'react';
import api from '../../services/api';
import { Search, Filter, ChevronLeft, ChevronRight, ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { format } from 'date-fns';

export default function AdminTransactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  useEffect(() => {
    fetchTransactions();
  }, [page]);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/admin/trading-activity?page=${page}&limit=15`);
      setTransactions(res.data.data);
      setTotalPages(res.data.pages);
      setTotalRecords(res.data.total);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-1">Transaction Records</h2>
          <p className="text-gray-500">Monitor all trading activity across the platform.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 text-sm font-medium uppercase tracking-wider">
                <th className="px-6 py-4">Transaction ID</th>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Stock</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4 text-right">Quantity</th>
                <th className="px-6 py-4 text-right">Price</th>
                <th className="px-6 py-4">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                    <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-gold-500 mb-2"></div>
                    <p>Loading transactions...</p>
                  </td>
                </tr>
              ) : transactions.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                    No transactions found.
                  </td>
                </tr>
              ) : (
                transactions.map(t => (
                  <tr key={t._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs text-gray-500">
                      {t._id}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{t.userId?.name || 'Unknown'}</div>
                      <div className="text-xs text-gray-500">{t.userId?.email || ''}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{t.companyId?.symbol}</div>
                      <div className="text-xs text-gray-500">{t.companyId?.name}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold ${
                        t.type === 'BUY' ? 'bg-blue-50 text-blue-700' : 'bg-red-50 text-red-700'
                      }`}>
                        {t.type === 'BUY' ? <ArrowDownRight size={14} className="mr-1"/> : <ArrowUpRight size={14} className="mr-1"/>}
                        {t.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-medium text-gray-900">
                      {t.quantity}
                    </td>
                    <td className="px-6 py-4 text-right font-medium text-gray-900">
                      ${t.price.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {format(new Date(t.executedAt || t.createdAt), 'MMM d, yyyy HH:mm')}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="bg-white px-6 py-4 border-t border-gray-100 flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Showing <span className="font-medium text-gray-900">{transactions.length > 0 ? (page - 1) * 15 + 1 : 0}</span> to <span className="font-medium text-gray-900">{Math.min(page * 15, totalRecords)}</span> of <span className="font-medium text-gray-900">{totalRecords}</span> records
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-50 transition-colors"
            >
              <ChevronLeft size={18} />
            </button>
            <button 
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages || totalPages === 0}
              className="p-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-50 transition-colors"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
