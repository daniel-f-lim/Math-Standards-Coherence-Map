
import React, { useState, useEffect, useMemo } from 'react';
import { Standard, ClusterInfo } from './types';
import { fetchStandards } from './services/dataService';
import CoherenceMap from './components/CoherenceMap';
import StandardDetails from './components/StandardDetails';

const App: React.FC = () => {
  const [standards, setStandards] = useState<Standard[]>([]);
  const [clusters, setClusters] = useState<ClusterInfo[]>([]);
  const [selectedStandard, setSelectedStandard] = useState<Standard | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('Kindergarten');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchStandards();
        setStandards(data.standards);
        setClusters(data.clusters);
      } catch (err) {
        console.error("Failed to load standards", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const gradeStandards = useMemo(() => {
    return standards.filter(s => selectedGrade === 'All' || s.Grade === selectedGrade);
  }, [standards, selectedGrade]);

  const filteredStandards = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (q.length < 1) return gradeStandards;
    return gradeStandards.filter(s => s.Code.toLowerCase().includes(q));
  }, [searchQuery, gradeStandards]);

  const handleSelectStandard = (s: Standard) => {
    setSelectedStandard(s);
  };

  const selectedCluster = useMemo(() => {
    if (!selectedStandard) return undefined;
    return clusters.find(c => c.Cluster === selectedStandard.Cluster && c.Grade === selectedStandard.Grade);
  }, [selectedStandard, clusters]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-slate-50 text-slate-600">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="font-bold tracking-tight text-lg">Initializing Standards Map...</p>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden font-sans">
      <style>{`
        .rich-text a {
          text-decoration: underline;
          color: #2563eb;
          transition: text-decoration 0.2s;
        }
        .rich-text a:hover {
          text-decoration: none;
        }
        .rich-text img {
          border-radius: 0.75rem;
          margin: 1.5rem 0;
          box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
          max-width: 100%;
          height: auto;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #cbd5e1;
        }
      `}</style>

      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 z-40 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-black text-xl shadow-lg shadow-blue-200">Σ</div>
          <div>
            <h1 className="text-xl font-black text-slate-900 leading-none">Math Standards Explorer</h1>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Hawaii DOE Framework</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
           <div className="relative">
             <input 
               type="text" 
               placeholder="Search by code (e.g. K.CC)..." 
               className="pl-10 pr-4 py-2 bg-slate-100 border-none rounded-full text-sm focus:ring-2 focus:ring-blue-500 w-72 transition-all font-medium"
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
             />
             <svg className="w-4 h-4 absolute left-4 top-3 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
             </svg>
           </div>
           
           <select 
             className="bg-slate-100 border-none rounded-full px-4 py-2 text-sm font-semibold text-slate-700 focus:ring-2 focus:ring-blue-500"
             value={selectedGrade}
             onChange={(e) => setSelectedGrade(e.target.value)}
           >
             <option value="Kindergarten">Kindergarten</option>
             <option value="Grade 1">Grade 1</option>
             <option value="Grade 2">Grade 2</option>
           </select>
        </div>
      </header>

      {/* Layout Content */}
      <main className="flex-1 flex overflow-hidden relative">
        {/* Left Side: Standards Browser Sidebar */}
        <aside className="w-80 bg-white border-r border-slate-200 flex flex-col z-30 shadow-sm">
          <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              {searchQuery ? `${filteredStandards.length} Matches` : `${filteredStandards.length} Standards`}
            </span>
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="text-slate-400 hover:text-slate-900 font-bold text-xs underline transition-colors">Clear Filter</button>
            )}
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {filteredStandards.map(match => (
              <button
                key={match.Code}
                onClick={() => handleSelectStandard(match)}
                className={`w-full text-left px-5 py-4 border-b border-slate-50 last:border-none transition-all hover:bg-slate-50 group ${selectedStandard?.Code === match.Code ? 'bg-blue-50 border-l-4 border-l-blue-600' : 'border-l-4 border-l-transparent'}`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className={`font-black text-sm tracking-tight ${selectedStandard?.Code === match.Code ? 'text-blue-600' : 'text-slate-900'}`}>{match.Code}</span>
                  <svg className={`w-3 h-3 transition-transform group-hover:translate-x-1 ${selectedStandard?.Code === match.Code ? 'text-blue-600' : 'text-slate-300'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" /></svg>
                </div>
                <div className="text-[10px] text-slate-500 font-medium line-clamp-2 leading-snug">{match.Description}</div>
              </button>
            ))}
            {filteredStandards.length === 0 && (
              <div className="p-8 text-center">
                <p className="text-slate-400 text-sm font-medium">No standards match your search.</p>
              </div>
            )}
          </div>
        </aside>

        {/* Center: Graph */}
        <div className={`flex-1 transition-all duration-700 ${selectedStandard ? 'mr-[400px]' : ''}`}>
          <CoherenceMap 
            standards={gradeStandards}
            onSelectStandard={handleSelectStandard}
            selectedStandard={selectedStandard}
            searchQuery={searchQuery}
          />
        </div>

        {/* Right Side: Standard Details Sidebar */}
        <aside 
          className={`fixed right-0 top-[88px] bottom-0 w-[400px] z-30 transform transition-transform duration-500 ease-in-out border-l border-slate-200 bg-white ${
            selectedStandard ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          {selectedStandard && (
            <StandardDetails 
              standard={selectedStandard} 
              cluster={selectedCluster}
              onClose={() => setSelectedStandard(null)} 
            />
          )}
        </aside>
      </main>

      {/* Footer / Legend */}
      <footer className="bg-slate-900 text-slate-400 px-6 py-2 text-[10px] uppercase font-bold tracking-widest flex flex-wrap justify-between items-center z-50 shadow-inner">
        <div className="flex items-center gap-4">
          <span>{gradeStandards.length} Standards In Grade</span>
          {searchQuery && <span className="text-amber-400 flex items-center gap-1.5"><div className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse"></div> Filter active</span>}
        </div>
        <div className="flex items-center gap-6">
          <span className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 bg-blue-600 rounded-full"></div> Active
          </span>
          <span className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 bg-sky-400 rounded-full border border-sky-600"></div> Prerequisite
          </span>
          <span className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 bg-violet-400 rounded-full border border-violet-600"></div> Dependent
          </span>
          <span className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 bg-amber-100 rounded-full border-2 border-amber-500 border-dashed"></div> Search Match
          </span>
        </div>
      </footer>
    </div>
  );
};

export default App;
