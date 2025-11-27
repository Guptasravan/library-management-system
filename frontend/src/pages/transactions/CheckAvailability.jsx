import { useState } from 'react';
import api from '../../utils/api';

const CheckAvailability = () => {
    const [searchParams, setSearchParams] = useState({
        title: '',
        author: '',
        category: ''
    });
    const [results, setResults] = useState([]);
    const [error, setError] = useState('');
    const [selectedBook, setSelectedBook] = useState(null);

    const handleChange = (e) => {
        setSearchParams({ ...searchParams, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setResults([]);
        setSelectedBook(null);

        if (!searchParams.title && !searchParams.author && !searchParams.category) {
            setError('Please fill at least one field to search.');
            return;
        }

        try {
            const { data } = await api.get('/transactions/availability', { params: searchParams });
            setResults(data);
            if (data.length === 0) {
                setError('No available books found matching your criteria.');
            }
        } catch (error) {
            setError('Search failed. Please try again.');
        }
    };

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Check Book Availability</h2>

            <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label className="block text-sm font-bold mb-1">Title</label>
                    <input type="text" name="title" value={searchParams.title} onChange={handleChange} className="w-full p-2 border rounded" />
                </div>
                <div>
                    <label className="block text-sm font-bold mb-1">Author</label>
                    <input type="text" name="author" value={searchParams.author} onChange={handleChange} className="w-full p-2 border rounded" />
                </div>
                <div>
                    <label className="block text-sm font-bold mb-1">Category</label>
                    <select name="category" value={searchParams.category} onChange={handleChange} className="w-full p-2 border rounded">
                        <option value="">All</option>
                        <option value="Book">Book</option>
                        <option value="Movie">Movie</option>
                    </select>
                </div>
                <div className="md:col-span-3 flex justify-end">
                    <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
                        Search
                    </button>
                </div>
            </form>

            {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}

            {results.length > 0 && (
                <div className="bg-white rounded shadow-md overflow-x-auto">
                    <table className="min-w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Serial No</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Select</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {results.map((book) => (
                                <tr key={book._id} className={selectedBook?._id === book._id ? 'bg-blue-50' : ''}>
                                    <td className="px-6 py-4 whitespace-nowrap">{book.serialNo}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{book.title}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{book.author}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{book.category}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <input
                                            type="radio"
                                            name="selectedBook"
                                            onChange={() => setSelectedBook(book)}
                                            checked={selectedBook?._id === book._id}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {selectedBook && (
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded text-green-800">
                    Selected: <strong>{selectedBook.title}</strong> by {selectedBook.author}
                </div>
            )}
        </div>
    );
};

export default CheckAvailability;
