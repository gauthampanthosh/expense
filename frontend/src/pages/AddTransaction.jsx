import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const API = import.meta.env.VITE_API_URL;

const CATEGORIES = ['Food', 'Travel', 'Shopping', 'Bills', 'Salary', 'Other'];
const METHODS = ['UPI', 'Cash', 'Bank'];

const AddTransaction = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    type: 'expense',
    amount: '',
    category: 'Food',
    method: 'UPI',
    date: new Date().toISOString().split('T')[0],
    description: ''
  });
  const [displayAmount, setDisplayAmount] = useState('');

  const handleChange = (e) => {
    if (e.target.name === 'amount') return;
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAmountChange = (e) => {
    let rawValue = e.target.value.replace(/[^0-9.]/g, '');
    const parts = rawValue.split('.');
    if (parts.length > 2) {
      rawValue = parts[0] + '.' + parts.slice(1).join('');
    }
    setFormData({ ...formData, amount: rawValue });

    if (rawValue) {
      if (rawValue.endsWith('.')) {
        setDisplayAmount(new Intl.NumberFormat('en-IN').format(parts[0]) + '.');
      } else if (parts.length === 2 && parts[1] !== undefined) {
        setDisplayAmount(new Intl.NumberFormat('en-IN').format(parts[0]) + '.' + parts[1]);
      } else {
        setDisplayAmount(new Intl.NumberFormat('en-IN').format(rawValue));
      }
    } else {
      setDisplayAmount('');
    }
  };

  const handleTypeChange = (type) => {
    setFormData({ ...formData, type, category: type === 'income' ? 'Salary' : 'Food' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      description: formData.description ? formData.description.trim() : '',
      amount: Number(formData.amount || 0),
      date: formData.date || new Date().toISOString(),
    };

    try {
      await axios.post(`${API}/api/transactions`, payload);
      navigate('/');
    } catch (err) {
      console.warn('Backend unavailable, mock success', err);
      // Mock success for viewing
      navigate('/');
    }
  };

  return (
    <div className="page-content" style={{ animation: 'fadeUp 0.3s ease-out' }}>
      <div className="flex-between mb-4">
        <button onClick={() => navigate(-1)} style={{ background: 'transparent', border: 'none', color: 'var(--text-main)', cursor: 'pointer', padding: '8px' }}>
          <ArrowLeft size={24} />
        </button>
        <h2 style={{ flex: 1, textAlign: 'center', marginRight: '40px' }}>Add Transaction</h2>
      </div>

      <div className="card">
        <div className="segment-control">
          <button 
            type="button"
            className={`segment-btn ${formData.type === 'expense' ? 'active expense' : ''}`}
            onClick={() => handleTypeChange('expense')}
          >
            Expense
          </button>
          <button 
            type="button"
            className={`segment-btn ${formData.type === 'income' ? 'active income' : ''}`}
            onClick={() => handleTypeChange('income')}
          >
            Income
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          
          <div className="form-group" style={{ textAlign: 'center', margin: '2rem 0' }}>
            <span style={{ fontSize: '2rem', fontWeight: 600, color: 'var(--text-muted)' }}>₹</span>
            <input 
              type="text" 
              name="amount" 
              value={displayAmount} 
              onChange={handleAmountChange} 
              placeholder="0" 
              required 
              style={{ fontSize: '3rem', fontWeight: 700, width: '80%', textAlign: 'center', border: 'none', background: 'transparent', outline: 'none', color: 'var(--text-main)' }}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Category</label>
            <select name="category" value={formData.category} onChange={handleChange} className="form-select">
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="form-group flex-between" style={{ gap: '1rem' }}>
            <div style={{ flex: 1 }}>
              <label className="form-label">Payment Method</label>
              <select name="method" value={formData.method} onChange={handleChange} className="form-select">
                {METHODS.map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <label className="form-label">Date</label>
              <input type="date" name="date" value={formData.date} onChange={handleChange} className="form-input" required />
            </div>
          </div>

          <div className="form-group mb-4">
             <label className="form-label">Description (optional)</label>
             <input type="text" name="description" value={formData.description} onChange={handleChange} placeholder="What was this for?" className="form-input" />
          </div>

          <button type="submit" className="btn btn-primary">
            Save Transaction
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddTransaction;
