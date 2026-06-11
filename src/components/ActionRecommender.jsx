import React, { useState } from 'react';

export default function ActionRecommender({ recommendations, totalFootprint, commitments, onCommit }) {

  const [expandedEvidence, setExpandedEvidence] = useState(null);

  if (!recommendations || recommendations.length === 0) return null;

  const totalSavings = recommendations.reduce((sum, item) => sum + item.savingsKg, 0);

  const icons = { transport: '🚗', energy: '⚡', diet: '🥗', shopping: '🛒' };
  
  const difficultyColors = {
    easy: 'bg-green-500/20 text-green-400 border-green-500/30',
    medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    hard: 'bg-red-500/20 text-red-400 border-red-500/30'
  };

  return (
    <div className="mt-8 pt-8 border-t border-gray-700 animate-fade-in" style={{ animationDelay: '400ms' }}>
      
      <div className="bg-green-900/30 border border-green-500/50 rounded-xl p-4 mb-6 text-center">
        <h3 className="text-sm font-bold text-green-400 uppercase tracking-wider mb-1">
          Your Action Plan
        </h3>
        <p className="text-gray-300">
          Implementing these changes could save <span className="font-bold text-white text-lg">{Math.round(totalSavings).toLocaleString()} kg CO₂</span> per year.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {recommendations.map((rec) => {
          const percentSaved = Math.min(((rec.savingsKg / totalFootprint) * 100), 100).toFixed(1);
          const isCommitted = commitments.some(c => c.id === rec.id);
          
          
          const isExpanded = expandedEvidence === rec.id; 
          
          return (
            <div key={rec.id} className="bg-gray-800 p-4 rounded-xl border border-gray-700 flex flex-col h-full">
              
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{icons[rec.category]}</span>
                  <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${difficultyColors[rec.difficulty]}`}>
                    {rec.difficulty}
                  </span>
                </div>
                <span className="text-sm font-bold text-green-400">
                  -{Math.round(rec.savingsKg).toLocaleString()} kg/yr
                </span>
              </div>

              <div className="flex-grow">
                <h4 className="font-bold text-white mb-1">{rec.title}</h4>
                <p className="text-xs text-gray-400 leading-relaxed mb-3">
                  {rec.description}
                </p>

                
                {rec.evidence && (
                  <div className="mb-4">
                    <button 
                      onClick={() => setExpandedEvidence(isExpanded ? null : rec.id)}
                      className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 font-medium mb-2 transition-colors"
                    >
                      <span className="text-base">🔬</span> 
                      {isExpanded ? "Hide Science" : "View Scientific Backing"}
                    </button>

                    {isExpanded && (
                      <div className="bg-blue-900/20 border border-blue-800/40 p-3 rounded-lg text-xs animate-fade-in">
                        <span className="font-bold text-blue-300 block mb-1">Source: {rec.evidence.source}</span>
                        <p className="text-gray-300 mb-2 italic">"{rec.evidence.summary}"</p>
                        <a 
                          href={rec.evidence.link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300 underline underline-offset-2 flex items-center gap-1"
                        >
                          Read Full Report <span>↗</span>
                        </a>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="mt-auto space-y-4">
                <div>
                  <div className="flex justify-between text-[10px] text-gray-500 mb-1">
                    <span>Footprint Impact</span>
                    <span>{percentSaved}%</span>
                  </div>
                  <div className="w-full bg-gray-700 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-green-500 h-full rounded-full" style={{ width: `${percentSaved}%` }}></div>
                  </div>
                </div>

                {isCommitted ? (
                  <button disabled className="w-full py-2 px-4 rounded-lg text-sm font-bold bg-green-900/50 text-green-400 border border-green-700 cursor-default flex justify-center items-center gap-2">
                    ✓ Committed
                  </button>
                ) : (
                  <button 
                    onClick={() => onCommit(rec)}
                    className="w-full py-2 px-4 rounded-lg text-sm font-bold bg-transparent hover:bg-green-900/30 text-green-400 border border-green-500 hover:border-green-400 transition-colors"
                  >
                    I'll do this
                  </button>
                )}
              </div>
              
            </div>
          );
        })}
      </div>
    </div>
  );
}