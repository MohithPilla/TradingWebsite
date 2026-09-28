import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';

export default function LearningArticle() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const res = await api.get(`/learning/${id}`);
        setArticle(res.data.data);
      } catch (err) { console.error(err); }
    };
    fetchArticle();
  }, [id]);

  if (!article) return <div>Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
      <Link to="/learn" className="text-primary-600 hover:underline mb-6 inline-block font-medium">&larr; Back to Learning</Link>
      <div className="text-sm font-bold text-primary-600 mb-2 uppercase tracking-wider">{article.category}</div>
      <h1 className="text-4xl font-bold text-slate-800 mb-4">{article.title}</h1>
      <p className="text-xl text-slate-500 mb-8 leading-relaxed">{article.description}</p>
      <div className="prose prose-lg max-w-none text-slate-700 leading-loose">
        {article.content}
      </div>
    </div>
  );
}