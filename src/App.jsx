import React, { useState } from 'react';
import Layout from './components/Layout';
import CarbonForm from './components/CarbonForm';
import ResultsDashboard from './components/ResultsDashboard';
import ActionRecommender from './components/ActionRecommender';
import ProgressTracker from './components/ProgressTracker';
import { getRecommendations } from './calculator/recommendations';
import { loadCommitments, addCommitment, removeCommitment } from './utils/storage';

function App() {
  const [results, setResults] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  
  // Hydrate from localStorage on mount
  const [commitments, setCommitments] = useState(() => loadCommitments());

  const handleCommit = (recommendation) => {
    const updated = addCommitment(recommendation);
    setCommitments(updated);
  };

  const handleRemove = (id) => {
    const updated = removeCommitment(id);
    setCommitments(updated);
  };

  const handleRecalculate = () => {
    setResults(null);
    setRecommendations([]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // Note: We deliberately do NOT clear commitments here
  };

  return (
    <Layout>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Form */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-2xl font-bold mb-2 text-gray-800">Calculate Your Impact</h2>
          <p className="text-gray-500 mb-6">Fill out the parameters below to generate your personalized carbon footprint analysis.</p>
          
          <CarbonForm onCalculate={(data, rawInputs) => {
            setResults(data);
            setRecommendations(getRecommendations(sanitizedInputs));
          }} />
        </div>

        {/* Right Column: Results & Actions */}
        <div className="lg:col-span-5">
          <div className="bg-gray-900 rounded-2xl shadow-xl p-6 text-white sticky top-24">
            <div className="flex justify-between items-center mb-6 border-b border-gray-700 pb-4">
              <h2 className="text-xl font-bold">Analysis Dashboard</h2>
              {results && (
                <button 
                  onClick={handleRecalculate}
                  className="text-xs font-semibold text-green-400 hover:text-green-300 transition-colors"
                >
                  Reset Form
                </button>
              )}
            </div>
            
            {!results ? (
              <div className="text-center py-12">
                <div className="text-4xl mb-4 opacity-50">📊</div>
                <p className="text-gray-400 text-sm">Awaiting your data.<br/>Fill out the form and click calculate!</p>
              </div>
            ) : (
              <>
                <ResultsDashboard results={results} />
                <ActionRecommender 
                  recommendations={recommendations} 
                  totalFootprint={results.total}
                  commitments={commitments}
                  onCommit={handleCommit}
                />
                <ProgressTracker 
                  results={results}
                  commitments={commitments}
                  onRemove={handleRemove}
                />
              </>
            )}
          </div>
        </div>

      </div>
    </Layout>
  );
}

export default App;