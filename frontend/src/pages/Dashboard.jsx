import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
    const { user } = useAuth();

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h1>
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">Welcome, {user.name}!</h2>
                <p className="text-gray-600">
                    You are logged in as <span className="font-bold uppercase">{user.role}</span>.
                </p>
                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-blue-50 p-4 rounded border border-blue-100">
                        <h3 className="font-bold text-blue-800">Quick Actions</h3>
                        <ul className="mt-2 text-sm text-blue-600 space-y-1">
                            <li>Check Availability</li>
                            <li>Issue Book</li>
                            <li>Return Book</li>
                        </ul>
                    </div>
                    {/* Add more widgets as needed */}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
