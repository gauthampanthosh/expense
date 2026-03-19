import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Home, PieChart, Plus, List, Search } from 'lucide-react';
import Dashboard from './pages/Dashboard';
import AddTransaction from './pages/AddTransaction';
import Transactions from './pages/TransactionHistory';

// Internal BottomNav Component
const BottomNav = () => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <div className="bottom-nav">
      <Link to="/" className={`bottom-nav-item ${isActive('/')}`}>
        <Home size={24} />
        <span>Home</span>
      </Link>
      <Link to="/history" className={`bottom-nav-item ${isActive('/history')}`}>
        <List size={24} />
        <span>Transactions</span>
      </Link>
      <Link to="/" className={`bottom-nav-item`}>
        <PieChart size={24} />
        <span>Insights</span>
      </Link>
    </div>
  );
};

// Internal FAB Component
const FloatingActionButton = () => {
  const location = useLocation();
  // Don't show FAB on the Add page
  if (location.pathname === '/add') return null;
  
  return (
    <Link to="/add" className="fab">
      <Plus size={28} />
    </Link>
  );
};

function App() {
  return (
    <Router>
      <div className="app-container">
        <main>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/add" element={<AddTransaction />} />
            <Route path="/history" element={<Transactions />} />
          </Routes>
        </main>
        
        <FloatingActionButton />
        <BottomNav />
      </div>
    </Router>
  );
}

export default App;
