// src/components/ActionRecommender.jsx
import React from 'react';

export default function ActionRecommender({ recommendations, totalFootprint }) {
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
      
      {/* Top Banner */}
      <div className="bg-green-900/30 border border-green-500/50 rounded-xl p-4 mb-6 text-center">
        <h3 className="text-sm font-bold text-green-400 uppercase tracking-wider mb-1">
          Your Action Plan
        </h3>
        <p className="text-gray-300">
          Implementing these changes could save <span className="font-bold text-white text-lg">{Math.round(totalSavings).toLocaleString()} kg CO₂</span> per year.
        </p>
      </div>

      {/* Action Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {recommendations.map((rec) => {
          const percentSaved = Math.min(((rec.savingsKg / totalFootprint) * 100), 100).toFixed(1);
          
          return (
            <div key={rec.id} className="bg-gray-800 p-4 rounded-xl border border-gray-700 flex flex-col h-full">
              
              {/* Header: Icon, Category, Difficulty */}
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

              {/* Title & Desc */}
              <div className="flex-grow">
                <h4 className="font-bold text-white mb-1">{rec.title}</h4>
                <p className="text-xs text-gray-400 leading-relaxed mb-4">
                  {rec.description}
                </p>
              </div>

              {/* Progress Bar (Impact vs Total) */}
              <div className="mt-auto">
                <div className="flex justify-between text-[10px] text-gray-500 mb-1">
                  <span>Footprint Impact</span>
                  <span>{percentSaved}%</span>
                </div>
                <div className="w-full bg-gray-700 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-green-500 h-full rounded-full" style={{ width: `${percentSaved}%` }}></div>
                </div>
              </div>
              
            </div>
          );
        })}
      </div>
    </div>
  );
}