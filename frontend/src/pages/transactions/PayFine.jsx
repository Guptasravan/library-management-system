import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../../utils/api';

const PayFine = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [returnData, setReturnData] = useState(null);
    const [finePaid, setFinePaid] = useState(false);
    const [remarks, setRemarks] = useState('');
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        if (location.state && location.state.returnData) {
            setReturnData(location.state.returnData);
        }
    }, [location]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });

        if (returnData.fineAmount > 0 && !finePaid) {
            setMessage({ type: 'error', text: 'Please collect the fine and check "Fine Paid".' });
            return;
        }

        try {
            await api.post('/transactions/pay-fine', {
                issueId: returnData.issueId,
                fineAmount: returnData.fineAmount,
                finePaid: finePaid,
                remarks: remarks,
                actualReturnDate: returnData.actualReturnDate
            });

            setMessage({ type: 'success', text: 'Transaction completed successfully!' });
            setTimeout(() => navigate('/'), 2000);
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Payment failed' });
        }
    };

    if (!returnData) {
        return <div className="p-8">No return transaction pending. Please go to Return Book page first.</div>;
    }

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Fine Payment</h2>

            {message.text && (
                <div className={`p-3 rounded mb-4 ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md max-w-2xl">
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="block text-sm font-bold mb-1">Issue ID</label>
                        <input type="text" value={returnData.issueId} readOnly className="w-full p-2 border rounded bg-gray-100" />
                    </div>
                    <div>
                        <label className="block text-sm font-bold mb-1">Days Overdue</label>
                        <input type="text" value={returnData.daysOverdue} readOnly className="w-full p-2 border rounded bg-gray-100" />
                    </div>
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-bold mb-1">Fine Amount (Rs.)</label>
                    <input type="text" value={returnData.fineAmount} readOnly className="w-full p-2 border rounded bg-gray-100 text-red-600 font-bold" />
                </div>

                <div className="mb-4">
                    <label className="flex items-center">
                        <input
                            type="checkbox"
                            checked={finePaid}
                            onChange={(e) => setFinePaid(e.target.checked)}
                            className="mr-2 h-5 w-5"
                            disabled={returnData.fineAmount === 0}
                        />
                        <span className="font-bold">Fine Paid</span>
                    </label>
                    {returnData.fineAmount === 0 && <p className="text-sm text-gray-500 ml-7">No fine applicable.</p>}
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-bold mb-1">Remarks</label>
                    <textarea
                        value={remarks}
                        onChange={(e) => setRemarks(e.target.value)}
                        className="w-full p-2 border rounded"
                        rows="3"
                    />
                </div>

                <button type="submit" className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700">
                    Confirm & Complete Return
                </button>
            </form>
        </div>
    );
};

export default PayFine;
