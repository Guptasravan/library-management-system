import { useState, useEffect } from 'react';
import api from '../../utils/api';

const IssueBook = () => {
    const [books, setBooks] = useState([]);
    const [members, setMembers] = useState([]);
    const [formData, setFormData] = useState({
        bookId: '',
        memberId: '', // This will be the string ID like MEM001
        issueDate: new Date().toISOString().split('T')[0],
        returnDate: '',
        remarks: ''
    });
    const [selectedBookDetails, setSelectedBookDetails] = useState(null);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        // Fetch available books for dropdown
        const fetchBooks = async () => {
            try {
                const { data } = await api.get('/transactions/availability'); // Get all available
                setBooks(data);
            } catch (error) {
                console.error("Failed to fetch books");
            }
        };
        fetchBooks();

        // Set default return date (15 days from today)
        const today = new Date();
        const returnDate = new Date(today);
        returnDate.setDate(today.getDate() + 15);
        setFormData(prev => ({ ...prev, returnDate: returnDate.toISOString().split('T')[0] }));
    }, []);

    const handleBookChange = (e) => {
        const bookId = e.target.value;
        const book = books.find(b => b._id === bookId);
        setSelectedBookDetails(book);
        setFormData({ ...formData, bookId });
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });

        // Validation
        const issueDate = new Date(formData.issueDate);
        const returnDate = new Date(formData.returnDate);
        const maxDate = new Date(issueDate);
        maxDate.setDate(maxDate.getDate() + 15);

        if (returnDate > maxDate) {
            setMessage({ type: 'error', text: 'Return date cannot be more than 15 days from issue date.' });
            return;
        }
        if (issueDate > returnDate) {
            setMessage({ type: 'error', text: 'Return date cannot be before issue date.' });
            return;
        }

        try {
            await api.post('/transactions/issue', formData);
            setMessage({ type: 'success', text: 'Book issued successfully!' });
            // Reset form
            setFormData({
                bookId: '',
                memberId: '',
                issueDate: new Date().toISOString().split('T')[0],
                returnDate: new Date(new Date().setDate(new Date().getDate() + 15)).toISOString().split('T')[0],
                remarks: ''
            });
            setSelectedBookDetails(null);
            // Refresh books list
            const { data } = await api.get('/transactions/availability');
            setBooks(data);
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Issue failed' });
        }
    };

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Issue Book</h2>

            {message.text && (
                <div className={`p-3 rounded mb-4 ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md max-w-2xl">
                <div className="mb-4">
                    <label className="block text-sm font-bold mb-1">Book Name</label>
                    <select name="bookId" value={formData.bookId} onChange={handleBookChange} className="w-full p-2 border rounded" required>
                        <option value="">Select Book</option>
                        {books.map(b => (
                            <option key={b._id} value={b._id}>{b.title} ({b.serialNo})</option>
                        ))}
                    </select>
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-bold mb-1">Author Name</label>
                    <input
                        type="text"
                        value={selectedBookDetails?.author || ''}
                        readOnly
                        className="w-full p-2 border rounded bg-gray-100 text-gray-600"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-bold mb-1">Member ID</label>
                    <input
                        type="text"
                        name="memberId"
                        value={formData.memberId}
                        onChange={handleChange}
                        placeholder="Enter Member ID (e.g., MEM001)"
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="block text-sm font-bold mb-1">Issue Date</label>
                        <input
                            type="date"
                            name="issueDate"
                            value={formData.issueDate}
                            onChange={handleChange}
                            min={new Date().toISOString().split('T')[0]}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold mb-1">Return Date</label>
                        <input
                            type="date"
                            name="returnDate"
                            value={formData.returnDate}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-bold mb-1">Remarks (Optional)</label>
                    <textarea
                        name="remarks"
                        value={formData.remarks}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        rows="3"
                    />
                </div>

                <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
                    Issue Book
                </button>
            </form>
        </div>
    );
};

export default IssueBook;
