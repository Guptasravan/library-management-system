import { useState, useEffect } from 'react';
import api from '../../utils/api';

const MasterBooks = () => {
    const [books, setBooks] = useState([]);

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const { data } = await api.get('/reports/books');
                setBooks(data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchBooks();
    }, []);

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Master List of Books/Movies</h2>
            <div className="bg-white rounded shadow-md overflow-x-auto">
                <table className="min-w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Serial No</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {books.map((b) => (
                            <tr key={b._id}>
                                <td className="px-6 py-4 whitespace-nowrap">{b.serialNo}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{b.title}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{b.author}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{b.category}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{b.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default MasterBooks;
