import { useState, useEffect } from 'react';
import api from '../../utils/api';

const UserMaintenance = () => {
    const [users, setUsers] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'user',
        status: 'active'
    });
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const { data } = await api.get('/maintenance/users');
            setUsers(data);
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
                // Remove password if empty during edit to avoid overwriting with empty string
                const dataToSend = { ...formData };
                if (!dataToSend.password) delete dataToSend.password;

                await api.put(`/maintenance/users/${editId}`, dataToSend);
                setMessage({ type: 'success', text: 'User updated successfully' });
            } else {
                await api.post('/maintenance/users', formData);
                setMessage({ type: 'success', text: 'User added successfully' });
            }
            fetchUsers();
            resetForm();
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Operation failed' });
        }
    };

    const handleEdit = (user) => {
        setFormData({
            name: user.name,
            email: user.email,
            password: '', // Don't show password
            role: user.role,
            status: user.status
        });
        setIsEditing(true);
        setEditId(user._id);
    };

    const resetForm = () => {
        setFormData({
            name: '',
            email: '',
            password: '',
            role: 'user',
            status: 'active'
        });
        setIsEditing(false);
        setEditId(null);
    };

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">User Maintenance</h2>

            {message.text && (
                <div className={`p-3 rounded mb-4 ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-bold mb-1">Name</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full p-2 border rounded" required />
                </div>
                <div>
                    <label className="block text-sm font-bold mb-1">Email</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full p-2 border rounded" required />
                </div>
                <div>
                    <label className="block text-sm font-bold mb-1">Password {isEditing && '(Leave blank to keep current)'}</label>
                    <input type="password" name="password" value={formData.password} onChange={handleChange} className="w-full p-2 border rounded" required={!isEditing} />
                </div>
                <div>
                    <label className="block text-sm font-bold mb-1">Role</label>
                    <select name="role" value={formData.role} onChange={handleChange} className="w-full p-2 border rounded">
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-bold mb-1">Status</label>
                    <select name="status" value={formData.status} onChange={handleChange} className="w-full p-2 border rounded">
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                </div>

                <div className="md:col-span-2 flex justify-end gap-2 mt-4">
                    {isEditing && (
                        <button type="button" onClick={resetForm} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
                            Cancel
                        </button>
                    )}
                    <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                        {isEditing ? 'Update User' : 'Add User'}
                    </button>
                </div>
            </form>

            <div className="bg-white rounded shadow-md overflow-x-auto">
                <table className="min-w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {users.map((u) => (
                            <tr key={u._id}>
                                <td className="px-6 py-4 whitespace-nowrap">{u.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{u.email}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{u.role}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${u.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                        {u.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <button onClick={() => handleEdit(u)} className="text-indigo-600 hover:text-indigo-900">Edit</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserMaintenance;
