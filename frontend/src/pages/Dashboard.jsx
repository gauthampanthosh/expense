import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import { ArrowUpRight, ArrowDownRight, Smartphone, Banknote, Building, Coffee, ShoppingBag, Plane, FileText, Zap } from 'lucide-react';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { formatINR } from '../utils/formatters';

const MOCK_DATA = [
  { _id: '1', amount: 5000, category: 'Salary', date: new Date().toISOString(), description: 'Monthly Salary', type: 'income', method: 'Bank' },
  { _id: '2', amount: 1500, category: 'Food', date: new Date(Date.now() - 86400000).toISOString(), description: 'Groceries', type: 'expense', method: 'UPI' },
  { _id: '3', amount: 300, category: 'Bills', date: new Date(Date.now() - 86400000 * 2).toISOString(), description: 'Electric Bill', type: 'expense', method: 'Bank' },
  { _id: '4', amount: 100, category: 'Travel', date: new Date(Date.now() - 86400000 * 3).toISOString(), description: 'Uber', type: 'expense', method: 'UPI' },
];

// Helper to map category to icon
export const getCategoryIcon = (category) => {
  switch (category) {
    case 'Food': return <Coffee size={24} />;
    case 'Shopping': return <ShoppingBag size={24} />;
    case 'Travel': return <Plane size={24} />;
    case 'Bills': return <Zap size={24} />;
    case 'Salary': return <Building size={24} />;
    default: return <FileText size={24} />;
  }
};

export const getCategoryColorClass = (category) => {
  switch (category) {
    case 'Food': return 'bg-orange';
    case 'Shopping': return 'bg-purple';
    case 'Travel': return 'bg-blue';
    case 'Bills': return 'bg-gray';
    case 'Salary': return 'bg-green';
    default: return 'bg-gray';
  }
};

export const getMethodIcon = (method) => {
  switch (method) {
    case 'UPI': return <Smartphone size={14} className="text-muted" />;
    case 'Cash': return <Banknote size={14} className="text-muted" />;
    case 'Bank': return <Building size={14} className="text-muted" />;
    default: return null;
  }
};

const Dashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/transactions');
        setTransactions(res.data);
      } catch (err) {
        console.warn('Backend unavailable. Using mock data.');
        setTransactions(MOCK_DATA);
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((acc, curr) => acc + curr.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((acc, curr) => acc + curr.amount, 0);
  const balance = totalIncome - totalExpense;

  const chartData = useMemo(() => {
    return [
      { name: 'Income', amount: totalIncome, fill: '#10b981' },
      { name: 'Expense', amount: totalExpense, fill: '#ef4444' }
    ];
  }, [totalIncome, totalExpense]);

  if (loading) return <div className="page-content">Loading...</div>;

  return (
    <div className="page-content">
      <div className="flex-between mb-4">
        <div>
          <p className="form-label" style={{marginBottom: 0}}>Hello,</p>
          <h2>Gauth</h2>
        </div>
        <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--border)', overflow: 'hidden' }}>
           <img src="https://api.dicebear.com/7.x/notionists/svg?seed=Gauth" alt="Avatar" width="100%" />
        </div>
      </div>

      {/* Main Balance Card */}
      <div className="card gradient-card mb-4">
        <p style={{ opacity: 0.8, fontSize: '0.9rem', marginBottom: '4px' }}>Total Balance</p>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>
          {formatINR(balance)}
        </h1>
        <div className="flex-between">
           <div>
             <div className="flex-between" style={{gap: '4px', opacity: 0.8, fontSize:'0.8rem'}}>
               <ArrowUpRight size={16} /> Income
             </div>
             <p style={{fontWeight: 600}}>{formatINR(totalIncome)}</p>
           </div>
           <div>
             <div className="flex-between" style={{gap: '4px', opacity: 0.8, fontSize:'0.8rem'}}>
               <ArrowDownRight size={16} /> Expense
             </div>
             <p style={{fontWeight: 600}}>{formatINR(totalExpense)}</p>
           </div>
        </div>
      </div>

      {/* Chart Section */}
      <h3 className="mb-2">Monthly Overview</h3>
      <div className="card mb-4" style={{ height: 200 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <XAxis dataKey="name" axisLine={false} tickLine={false} tickFormatter={() => ''} height={0} />
            <Tooltip cursor={{fill: 'transparent'}} formatter={(value) => formatINR(value)} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: 'var(--shadow-md)'}}/>
            <Bar dataKey="amount" radius={[4, 4, 4, 4]} barSize={40} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Recent Transactions */}
      <div className="flex-between mb-2">
        <h3>Recent Transactions</h3>
        <p className="form-label" style={{marginBottom: 0, color: 'var(--primary)', cursor: 'pointer'}}>See all</p>
      </div>
      <div className="card" style={{padding: '0.5rem 1rem'}}>
        {transactions.slice(0, 4).map((t) => (
          <div className="transaction-item" key={t._id}>
            <div className={`transaction-icon ${getCategoryColorClass(t.category)}`}>
              {getCategoryIcon(t.category)}
            </div>
            <div className="transaction-details">
              <div className="transaction-title">{t.category}</div>
              <div className="transaction-meta">
                {format(new Date(t.date), 'MMM dd')} • {t.description}
              </div>
            </div>
            <div style={{textAlign: 'right'}}>
              <div className={`transaction-amount ${t.type === 'income' ? 'text-success' : 'text-danger'}`}>
                {t.type === 'income' ? '+' : '-'}{formatINR(t.amount)}
              </div>
              <div className="transaction-method" style={{display: 'inline-flex', alignItems: 'center', gap: '4px', marginTop: '4px'}}>
                 {getMethodIcon(t.method)} {t.method}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
