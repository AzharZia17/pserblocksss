const ExcelExport = () => {
    const handleDownload = () => {
        window.open('http://localhost:5000/api/export', '_blank');
    };

    return (
        <button
            onClick={handleDownload}
            type="button"
            className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
            Download Excel Sheet
        </button>
    );
};

export default ExcelExport;
