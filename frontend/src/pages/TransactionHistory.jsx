import { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import { Trash2 } from 'lucide-react';
import { getCategoryIcon, getCategoryColorClass, getMethodIcon } from './Dashboard';
import { formatINR } from '../utils/formatters';

const API = import.meta.env.VITE_API_URL;

const MOCK_DATA = [
  { _id: '1', amount: 5000, category: 'Salary', date: new Date().toISOString(), description: 'Monthly Salary', type: 'income', method: 'Bank' },
  { _id: '2', amount: 1500, category: 'Food', date: new Date(Date.now() - 86400000).toISOString(), description: 'Groceries', type: 'expense', method: 'UPI' },
  { _id: '3', amount: 300, category: 'Bills', date: new Date(Date.now() - 86400000 * 2).toISOString(), description: 'Electric Bill', type: 'expense', method: 'Bank' },
];

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await axios.get(`${API}/api/transactions`);
        setTransactions(res.data);
      } catch (err) {
        setTransactions(MOCK_DATA);
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API}/api/transactions/${id}`);
      setTransactions(transactions.filter(t => t._id !== id));
    } catch (err) {
      setTransactions(transactions.filter(t => t._id !== id));
    }
  };

  const filteredTransactions = transactions.filter(t => {
    if (filterType === 'all') return true;
    return t.type === filterType;
  });

  if (loading) return <div className="page-content">Loading...</div>;

  return (
    <div className="page-content">
      <h2 className="mb-4">Transactions</h2>

      <div className="segment-control">
        <button 
          className={`segment-btn ${filterType === 'all' ? 'active' : ''}`}
          onClick={() => setFilterType('all')}
        >
          All
        </button>
        <button 
          className={`segment-btn ${filterType === 'expense' ? 'active' : ''}`}
          onClick={() => setFilterType('expense')}
        >
          Expenses
        </button>
        <button 
          className={`segment-btn ${filterType === 'income' ? 'active' : ''}`}
          onClick={() => setFilterType('income')}
        >
          Income
        </button>
      </div>

      <div className="card" style={{padding: '0.5rem 1rem'}}>
        {filteredTransactions.map((t) => (
          <div className="transaction-item" key={t._id} style={{ position: 'relative' }}>
            <div className={`transaction-icon ${getCategoryColorClass(t.category)}`}>
              {getCategoryIcon(t.category)}
            </div>
            <div className="transaction-details">
              <div className="transaction-title">{t.category}</div>
              <div className="transaction-meta">
                {format(new Date(t.date), 'MMM dd')} • {t.description}
              </div>
              <div className="transaction-method" style={{display: 'inline-flex', alignItems: 'center', gap: '4px', marginTop: '4px'}}>
                 {getMethodIcon(t.method)} {t.method}
              </div>
            </div>
            <div style={{textAlign: 'right', display: 'flex', alignItems: 'center', gap: '1rem'}}>
              <div className={`transaction-amount ${t.type === 'income' ? 'text-success' : 'text-danger'}`}>
                {t.type === 'income' ? '+' : '-'}{formatINR(t.amount)}
              </div>
              <button 
                onClick={() => handleDelete(t._id)} 
                style={{ background: 'transparent', border: 'none', color: 'var(--danger)', cursor: 'pointer', opacity: 0.6 }}
                title="Delete"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
        {filteredTransactions.length === 0 && (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            No transactions found.
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionHistory;
