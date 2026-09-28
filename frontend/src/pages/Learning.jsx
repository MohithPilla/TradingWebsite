import { useEffect, useState } from 'react';
import api from '../services/api';
import { Link } from 'react-router-dom';

export default function Learning() {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await api.get('/learning');
        setArticles(res.data.data);
      } catch (err) { console.error(err); }
    };
    fetchArticles();
  }, []);

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-800 mb-2">LEARN SMART</h2>
        <p className="text-slate-500 text-lg">Understand the market. Learn companies. Trade with confidence.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map(article => (
          <div key={article._id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col h-full">
            <div className="text-xs font-bold text-primary-600 mb-2 uppercase tracking-wider">{article.category}</div>
            <h3 className="text-xl font-bold text-slate-800 mb-3">{article.title}</h3>
            <p className="text-slate-600 mb-6 flex-1">{article.description}</p>
            <Link to={`/learn/${article._id}`} className="w-full text-center bg-slate-50 hover:bg-slate-100 text-primary-700 font-medium py-3 rounded-xl transition">
              Start Learning
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}