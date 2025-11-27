import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';

const ReturnBook = () => {
    const [formData, setFormData] = useState({
        bookId: '', // We will search by serial no, but backend needs ID or serial. Let's assume we search first.
        serialNo: '',
        memberId: '',
        returnDate: new Date().toISOString().split('T')[0]
    });
    const [bookDetails, setBookDetails] = useState(null);
    const [message, setMessage] = useState({ type: '', text: '' });
    const navigate = useNavigate();

    // Helper to find book by serial no
    const handleSerialBlur = async () => {
        if (!formData.serialNo) return;
        try {
            // We need an endpoint to find book by serial no, or just use availability? 
            // Availability only shows available books. We need all books.
            // Let's assume we can use the maintenance endpoint if admin, or a specific lookup.
            // For simplicity, let's just assume the user enters valid data or we fail on submit.
            // Better: Add a lookup.
            // Let's try to fetch book details by serial number.
            // Since we don't have a specific public endpoint for this, we might need to rely on the backend validation
            // OR we can fetch all books and filter (inefficient but works for small app).
            const { data } = await api.get('/reports/books'); // Reusing report endpoint which returns all books
            const book = data.find(b => b.serialNo === formData.serialNo);
            if (book) {
                setBookDetails(book);
                setFormData(prev => ({ ...prev, bookId: book._id }));
            } else {
                setBookDetails(null);
                setMessage({ type: 'error', text: 'Book not found with this Serial No.' });
            }
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

        if (!bookDetails) {
            setMessage({ type: 'error', text: 'Please enter a valid Serial Number first.' });
            return;
        }

        try {
            const { data } = await api.post('/transactions/return', {
                bookId: bookDetails._id,
                memberId: formData.memberId,
                returnDate: formData.returnDate
            });

            // Redirect to Fine Payment with data
            navigate('/transactions/pay-fine', { state: { returnData: data } });

        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Return failed' });
        }
    };

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Return Book</h2>

            {message.text && (
                <div className={`p-3 rounded mb-4 ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md max-w-2xl">
                <div className="mb-4">
                    <label className="block text-sm font-bold mb-1">Book Serial Number</label>
                    <input
                        type="text"
                        name="serialNo"
                        value={formData.serialNo}
                        onChange={handleChange}
                        onBlur={handleSerialBlur}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-bold mb-1">Book Name</label>
                    <input
                        type="text"
                        value={bookDetails?.title || ''}
                        readOnly
                        className="w-full p-2 border rounded bg-gray-100 text-gray-600"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-bold mb-1">Author Name</label>
                    <input
                        type="text"
                        value={bookDetails?.author || ''}
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
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>

                <div className="mb-4">
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

                <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
                    Confirm Return Details
                </button>
            </form>
        </div>
    );
};

export default ReturnBook;
