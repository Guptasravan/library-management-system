import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, BookOpen, Users, FileText, Activity, CreditCard, Search } from 'lucide-react';

const Layout = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (!user) return null;

    const isActive = (path) => location.pathname === path ? 'bg-blue-700' : '';

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <div className="w-64 bg-blue-800 text-white flex flex-col">
                <div className="p-4 text-2xl font-bold border-b border-blue-700">
                    LMS {user.role === 'admin' ? 'Admin' : 'User'}
                </div>

                <nav className="flex-1 overflow-y-auto py-4">
                    <div className="px-4 mb-2 text-xs text-blue-300 uppercase">Main</div>
                    <Link to="/" className={`block px-4 py-2 hover:bg-blue-700 ${isActive('/')}`}>Dashboard</Link>

                    {user.role === 'admin' && (
                        <>
                            <div className="px-4 mt-6 mb-2 text-xs text-blue-300 uppercase">Maintenance</div>
                            <Link to="/maintenance/memberships" className={`flex items-center px-4 py-2 hover:bg-blue-700 ${isActive('/maintenance/memberships')}`}>
                                <Users size={18} className="mr-2" /> Memberships
                            </Link>
                            <Link to="/maintenance/books" className={`flex items-center px-4 py-2 hover:bg-blue-700 ${isActive('/maintenance/books')}`}>
                                <BookOpen size={18} className="mr-2" /> Books/Movies
                            </Link>
                            <Link to="/maintenance/users" className={`flex items-center px-4 py-2 hover:bg-blue-700 ${isActive('/maintenance/users')}`}>
                                <Users size={18} className="mr-2" /> Users
                            </Link>
                        </>
                    )}

                    <div className="px-4 mt-6 mb-2 text-xs text-blue-300 uppercase">Transactions</div>
                    <Link to="/transactions/availability" className={`flex items-center px-4 py-2 hover:bg-blue-700 ${isActive('/transactions/availability')}`}>
                        <Search size={18} className="mr-2" /> Check Availability
                    </Link>
                    <Link to="/transactions/issue" className={`flex items-center px-4 py-2 hover:bg-blue-700 ${isActive('/transactions/issue')}`}>
                        <BookOpen size={18} className="mr-2" /> Issue Book
                    </Link>
                    <Link to="/transactions/return" className={`flex items-center px-4 py-2 hover:bg-blue-700 ${isActive('/transactions/return')}`}>
                        <Activity size={18} className="mr-2" /> Return Book
                    </Link>
                    <Link to="/transactions/pay-fine" className={`flex items-center px-4 py-2 hover:bg-blue-700 ${isActive('/transactions/pay-fine')}`}>
                        <CreditCard size={18} className="mr-2" /> Fine Payment
                    </Link>

                    <div className="px-4 mt-6 mb-2 text-xs text-blue-300 uppercase">Reports</div>
                    <Link to="/reports/active-issues" className={`flex items-center px-4 py-2 hover:bg-blue-700 ${isActive('/reports/active-issues')}`}>
                        <FileText size={18} className="mr-2" /> Active Issues
                    </Link>
                    <Link to="/reports/overdue" className={`flex items-center px-4 py-2 hover:bg-blue-700 ${isActive('/reports/overdue')}`}>
                        <FileText size={18} className="mr-2" /> Overdue Returns
                    </Link>
                    <Link to="/reports/members" className={`flex items-center px-4 py-2 hover:bg-blue-700 ${isActive('/reports/members')}`}>
                        <FileText size={18} className="mr-2" /> Master Members
                    </Link>
                    <Link to="/reports/books" className={`flex items-center px-4 py-2 hover:bg-blue-700 ${isActive('/reports/books')}`}>
                        <FileText size={18} className="mr-2" /> Master Books
                    </Link>
                </nav>

                <div className="p-4 border-t border-blue-700">
                    <button onClick={handleLogout} className="flex items-center text-red-300 hover:text-white">
                        <LogOut size={18} className="mr-2" /> Logout
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-y-auto p-8">
                <Outlet />
            </div>
        </div>
    );
};

export default Layout;
