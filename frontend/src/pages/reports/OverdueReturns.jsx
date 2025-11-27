import { useState, useEffect } from 'react';
import api from '../../utils/api';

const OverdueReturns = () => {
    const [issues, setIssues] = useState([]);

    useEffect(() => {
        const fetchIssues = async () => {
            try {
                const { data } = await api.get('/reports/overdue');
                setIssues(data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchIssues();
    }, []);

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Overdue Returns</h2>
            <div className="bg-white rounded shadow-md overflow-x-auto">
                <table className="min-w-full">
                    <thead className="bg-red-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Issue ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Book</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Member</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Days Overdue</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {issues.map((issue) => {
                            const daysOverdue = Math.ceil((new Date() - new Date(issue.returnDate)) / (1000 * 60 * 60 * 24));
                            return (
                                <tr key={issue._id}>
                                    <td className="px-6 py-4 whitespace-nowrap">{issue.issueId}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{issue.book?.title}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{issue.member?.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{new Date(issue.returnDate).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-red-600 font-bold">{daysOverdue} days</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default OverdueReturns;
