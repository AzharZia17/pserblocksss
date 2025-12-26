const BlockList = ({ blocks }) => {
    if (!blocks || blocks.length === 0) {
        return <p className="text-gray-500">No blocks yet.</p>;
    }

    return (
        <div className="overflow-hidden">
            <ul className="divide-y divide-gray-200 h-96 overflow-y-auto">
                {blocks.map((block) => (
                    <li key={block.id}>
                        <div className="py-4">
                            <div className="flex items-center justify-between">
                                <p className="text-sm font-medium text-indigo-600 truncate">
                                    {block.block_number}
                                </p>
                                <div className="ml-2 flex-shrink-0 flex">
                                    <p className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${block.status === 'Assigned'
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-gray-100 text-gray-800'
                                        }`}>
                                        {block.status}
                                    </p>
                                </div>
                            </div>
                            <div className="mt-2 sm:flex sm:justify-between">
                                <div className="sm:flex">
                                    <p className="flex items-center text-sm text-gray-500">
                                        Created: {new Date(block.created_at).toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default BlockList;
