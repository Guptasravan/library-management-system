import { useState, useEffect } from 'react';
import api from '../../utils/api';

const BookMaintenance = () => {
    const [books, setBooks] = useState([]);
    const [formData, setFormData] = useState({
        title: '',
        author: '',
        category: 'Book',
        serialNo: '',
        status: 'available'
    });
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        fetchBooks();
    }, []);

    const fetchBooks = async () => {
        try {
            const { data } = await api.get('/maintenance/books');
            setBooks(data);
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
                await api.put(`/maintenance/books/${editId}`, formData);
                setMessage({ type: 'success', text: 'Item updated successfully' });
            } else {
                await api.post('/maintenance/books', formData);
                setMessage({ type: 'success', text: 'Item added successfully' });
            }
            fetchBooks();
            resetForm();
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Operation failed' });
        }
    };

    const handleEdit = (book) => {
        setFormData({
            title: book.title,
            author: book.author,
            category: book.category,
            serialNo: book.serialNo,
            status: book.status
        });
        setIsEditing(true);
        setEditId(book._id);
    };

    const resetForm = () => {
        setFormData({
            title: '',
            author: '',
            category: 'Book',
            serialNo: '',
            status: 'available'
        });
        setIsEditing(false);
        setEditId(null);
    };

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Book/Movie Maintenance</h2>

            {message.text && (
                <div className={`p-3 rounded mb-4 ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                    <label className="block text-sm font-bold mb-2">Category</label>
                    <div className="flex gap-4">
                        <label className="flex items-center">
                            <input type="radio" name="category" value="Book" checked={formData.category === 'Book'} onChange={handleChange} className="mr-2" />
                            Book
                        </label>
                        <label className="flex items-center">
                            <input type="radio" name="category" value="Movie" checked={formData.category === 'Movie'} onChange={handleChange} className="mr-2" />
                            Movie
                        </label>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-bold mb-1">Title</label>
                    <input type="text" name="title" value={formData.title} onChange={handleChange} className="w-full p-2 border rounded" required />
                </div>
                <div>
                    <label className="block text-sm font-bold mb-1">Author/Director</label>
                    <input type="text" name="author" value={formData.author} onChange={handleChange} className="w-full p-2 border rounded" required />
                </div>
                <div>
                    <label className="block text-sm font-bold mb-1">Serial No</label>
                    <input type="text" name="serialNo" value={formData.serialNo} onChange={handleChange} className="w-full p-2 border rounded" required />
                </div>
                <div>
                    <label className="block text-sm font-bold mb-1">Status</label>
                    <select name="status" value={formData.status} onChange={handleChange} className="w-full p-2 border rounded">
                        <option value="available">Available</option>
                        <option value="issued">Issued</option>
                    </select>
                </div>

                <div className="md:col-span-2 flex justify-end gap-2 mt-4">
                    {isEditing && (
                        <button type="button" onClick={resetForm} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
                            Cancel
                        </button>
                    )}
                    <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                        {isEditing ? 'Update Item' : 'Add Item'}
                    </button>
                </div>
            </form>

            <div className="bg-white rounded shadow-md overflow-x-auto">
                <table className="min-w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Serial No</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {books.map((b) => (
                            <tr key={b._id}>
                                <td className="px-6 py-4 whitespace-nowrap">{b.serialNo}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{b.title}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{b.category}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${b.status === 'available' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                        {b.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <button onClick={() => handleEdit(b)} className="text-indigo-600 hover:text-indigo-900">Edit</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default BookMaintenance;
