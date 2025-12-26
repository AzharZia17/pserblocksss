import { useState, useEffect } from 'react';
import axios from 'axios';
import BlockInput from './components/BlockInput';
import BlockList from './components/BlockList';
import SearchBlock from './components/SearchBlock';
import ExcelExport from './components/ExcelExport';
import Footer from './components/Footer';

function App() {
  const [blocks, setBlocks] = useState([]);

  const fetchBlocks = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/blocks');
      setBlocks(res.data);
    } catch (err) {
      console.error("Error fetching blocks:", err);
    }
  };

  useEffect(() => {
    fetchBlocks();
  }, []);

  const onBlockAdded = () => {
    fetchBlocks();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        <header className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
            PSER Blocks
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Track and manage block status efficiently.
          </p>
        </header>

        <section className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Add New Block</h2>
          <BlockInput onBlockAdded={onBlockAdded} />
        </section>

        {/* Removed "Current Block" section as requested */}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <section className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">All Blocks</h2>
            <BlockList blocks={blocks} />
          </section>

          <section className="space-y-6">
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Search Block</h2>
              <SearchBlock />
            </div>

            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Actions</h2>
              <ExcelExport />
            </div>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default App;
