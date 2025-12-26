import { useState } from 'react';
import axios from 'axios';

const BlockInput = ({ onBlockAdded }) => {
    const [blockNumber, setBlockNumber] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!blockNumber.trim()) return;

        setLoading(true);
        setError('');

        try {
            await axios.post('http://localhost:5000/api/blocks', { block_number: blockNumber });
            setBlockNumber('');
            if (onBlockAdded) onBlockAdded();
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.error || 'Failed to add block. Check console/server logs.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="blockNumber" className="block text-sm font-medium text-gray-700">
                    Block Number
                </label>
                <div className="mt-1 flex rounded-md shadow-sm">
                    <input
                        type="text"
                        name="blockNumber"
                        id="blockNumber"
                        className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-md sm:text-sm border-gray-300 px-4 py-2 border"
                        placeholder="Enter block number"
                        value={blockNumber}
                        onChange={(e) => setBlockNumber(e.target.value)}
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                    >
                        {loading ? 'Adding...' : 'Add Block'}
                    </button>
                </div>
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
        </form>
    );
};

export default BlockInput;
