import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Layout from './components/Layout';

// Maintenance
import MembershipMaintenance from './pages/maintenance/MembershipMaintenance';
import BookMaintenance from './pages/maintenance/BookMaintenance';
import UserMaintenance from './pages/maintenance/UserMaintenance';

// Transactions
import CheckAvailability from './pages/transactions/CheckAvailability';
import IssueBook from './pages/transactions/IssueBook';
import ReturnBook from './pages/transactions/ReturnBook';
import PayFine from './pages/transactions/PayFine';

// Reports
import ActiveIssues from './pages/reports/ActiveIssues';
import OverdueReturns from './pages/reports/OverdueReturns';
import MasterMembers from './pages/reports/MasterMembers';
import MasterBooks from './pages/reports/MasterBooks';

const PrivateRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (adminOnly && user.role !== 'admin') {
    return <Navigate to="/" />;
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
            <Route index element={<Dashboard />} />

            {/* Maintenance - Admin Only */}
            <Route path="maintenance/memberships" element={<PrivateRoute adminOnly><MembershipMaintenance /></PrivateRoute>} />
            <Route path="maintenance/books" element={<PrivateRoute adminOnly><BookMaintenance /></PrivateRoute>} />
            <Route path="maintenance/users" element={<PrivateRoute adminOnly><UserMaintenance /></PrivateRoute>} />

            {/* Transactions */}
            <Route path="transactions/availability" element={<CheckAvailability />} />
            <Route path="transactions/issue" element={<IssueBook />} />
            <Route path="transactions/return" element={<ReturnBook />} />
            <Route path="transactions/pay-fine" element={<PayFine />} />

            {/* Reports */}
            <Route path="reports/active-issues" element={<ActiveIssues />} />
            <Route path="reports/overdue" element={<OverdueReturns />} />
            <Route path="reports/members" element={<MasterMembers />} />
            <Route path="reports/books" element={<MasterBooks />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
