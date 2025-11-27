import { useState, useEffect } from 'react';
import api from '../../utils/api';

const MasterMembers = () => {
    const [members, setMembers] = useState([]);

    useEffect(() => {
        const fetchMembers = async () => {
            try {
                const { data } = await api.get('/reports/members');
                setMembers(data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchMembers();
    }, []);

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Master List of Memberships</h2>
            <div className="bg-white rounded shadow-md overflow-x-auto">
                <table className="min-w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Member ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plan</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {members.map((m) => (
                            <tr key={m._id}>
                                <td className="px-6 py-4 whitespace-nowrap">{m.memberId}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{m.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{m.contact}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{m.planType}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{m.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default MasterMembers;
