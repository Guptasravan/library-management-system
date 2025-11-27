import { useState, useEffect } from 'react';
import api from '../../utils/api';

const ActiveIssues = () => {
    const [issues, setIssues] = useState([]);

    useEffect(() => {
        const fetchIssues = async () => {
            try {
                const { data } = await api.get('/reports/active-issues');
                setIssues(data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchIssues();
    }, []);

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Active Issues</h2>
            <div className="bg-white rounded shadow-md overflow-x-auto">
                <table className="min-w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Issue ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Book</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Member</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Issue Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Return Date</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {issues.map((issue) => (
                            <tr key={issue._id}>
                                <td className="px-6 py-4 whitespace-nowrap">{issue.issueId}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{issue.book?.title}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{issue.member?.name} ({issue.member?.memberId})</td>
                                <td className="px-6 py-4 whitespace-nowrap">{new Date(issue.issueDate).toLocaleDateString()}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{new Date(issue.returnDate).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ActiveIssues;
