import { useState } from 'react';
import axios from 'axios';

const SearchBlock = () => {
    const [query, setQuery] = useState('');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!query.trim()) return;

        setLoading(true);
        setError('');
        setResult(null);

        try {
            const res = await axios.get(`http://localhost:5000/api/blocks/search?q=${encodeURIComponent(query)}`);
            setResult(res.data);
        } catch (err) {
            setError(err.response?.data?.error || 'Search failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <form onSubmit={handleSearch} className="flex gap-2">
                <input
                    type="text"
                    className="focus:ring-indigo-500 focus:border-indigo-500 block w-full rounded-md sm:text-sm border-gray-300 px-3 py-2 border"
                    placeholder="Search block..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none disabled:opacity-50"
                >
                    Search
                </button>
            </form>

            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

            {result && (
                <div className="mt-4 p-4 rounded-md bg-gray-50 border border-gray-200">
                    <p className="text-sm font-medium text-gray-900">Block: {result.block_number}</p>
                    <p className={`mt-1 text-sm font-bold ${result.status === 'Completed' ? 'text-green-600' :
                            result.status === 'Current' ? 'text-blue-600' :
                                'text-red-600'
                        }`}>
                        Status: {result.status}
                    </p>
                </div>
            )}
        </div>
    );
};

export default SearchBlock;
