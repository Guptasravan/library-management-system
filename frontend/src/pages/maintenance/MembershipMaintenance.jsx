import { useState, useEffect } from 'react';
import api from '../../utils/api';

const MembershipMaintenance = () => {
    const [memberships, setMemberships] = useState([]);
    const [formData, setFormData] = useState({
        memberId: '',
        name: '',
        email: '',
        contact: '',
        address: '',
        aadhaarCard: '',
        startDate: '',
        endDate: '',
        planType: '6 months',
        status: 'active'
    });
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        fetchMemberships();
    }, []);

    const fetchMemberships = async () => {
        try {
            const { data } = await api.get('/maintenance/memberships');
            setMemberships(data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });

        try {
            if (isEditing) {
                await api.put(`/maintenance/memberships/${editId}`, formData);
                setMessage({ type: 'success', text: 'Membership updated successfully' });
            } else {
                await api.post('/maintenance/memberships', formData);
                setMessage({ type: 'success', text: 'Membership added successfully' });
            }
            fetchMemberships();
            resetForm();
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Operation failed' });
        }
    };

    const handleEdit = (membership) => {
        setFormData({
            memberId: membership.memberId,
            name: membership.name,
            email: membership.email,
            contact: membership.contact,
            address: membership.address,
            aadhaarCard: membership.aadhaarCard,
            startDate: membership.startDate.split('T')[0],
            endDate: membership.endDate.split('T')[0],
            planType: membership.planType,
            status: membership.status
        });
        setIsEditing(true);
        setEditId(membership._id);
    };

    const resetForm = () => {
        setFormData({
            memberId: '',
            name: '',
            email: '',
            contact: '',
            address: '',
            aadhaarCard: '',
            startDate: '',
            endDate: '',
            planType: '6 months',
            status: 'active'
        });
        setIsEditing(false);
        setEditId(null);
    };

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Membership Maintenance</h2>

            {message.text && (
                <div className={`p-3 rounded mb-4 ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-bold mb-1">Member ID</label>
                    <input type="text" name="memberId" value={formData.memberId} onChange={handleChange} className="w-full p-2 border rounded" required />
                </div>
                <div>
                    <label className="block text-sm font-bold mb-1">Name</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full p-2 border rounded" required />
                </div>
                <div>
                    <label className="block text-sm font-bold mb-1">Email</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full p-2 border rounded" required />
                </div>
                <div>
                    <label className="block text-sm font-bold mb-1">Contact</label>
                    <input type="text" name="contact" value={formData.contact} onChange={handleChange} className="w-full p-2 border rounded" required />
                </div>
                <div className="md:col-span-2">
                    <label className="block text-sm font-bold mb-1">Address</label>
                    <input type="text" name="address" value={formData.address} onChange={handleChange} className="w-full p-2 border rounded" required />
                </div>
                <div>
                    <label className="block text-sm font-bold mb-1">Aadhaar Card</label>
                    <input type="text" name="aadhaarCard" value={formData.aadhaarCard} onChange={handleChange} className="w-full p-2 border rounded" required />
                </div>
                <div>
                    <label className="block text-sm font-bold mb-1">Plan Type</label>
                    <select name="planType" value={formData.planType} onChange={handleChange} className="w-full p-2 border rounded">
                        <option value="6 months">6 months</option>
                        <option value="1 year">1 year</option>
                        <option value="2 years">2 years</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-bold mb-1">Start Date</label>
                    <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} className="w-full p-2 border rounded" required />
                </div>
                <div>
                    <label className="block text-sm font-bold mb-1">End Date</label>
                    <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} className="w-full p-2 border rounded" required />
                </div>
                <div>
                    <label className="block text-sm font-bold mb-1">Status</label>
                    <select name="status" value={formData.status} onChange={handleChange} className="w-full p-2 border rounded">
                        <option value="active">Active</option>
                        <option value="expired">Expired</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </div>

                <div className="md:col-span-2 flex justify-end gap-2 mt-4">
                    {isEditing && (
                        <button type="button" onClick={resetForm} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
                            Cancel
                        </button>
                    )}
                    <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                        {isEditing ? 'Update Membership' : 'Add Membership'}
                    </button>
                </div>
            </form>

            <div className="bg-white rounded shadow-md overflow-x-auto">
                <table className="min-w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plan</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {memberships.map((m) => (
                            <tr key={m._id}>
                                <td className="px-6 py-4 whitespace-nowrap">{m.memberId}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{m.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{m.planType}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${m.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                        {m.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <button onClick={() => handleEdit(m)} className="text-indigo-600 hover:text-indigo-900">Edit</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default MembershipMaintenance;
