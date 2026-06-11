import React from 'react';
import { calculateProjectedFootprint } from '../utils/storage';
import { getRating } from '../calculator/calculator';
import { downloadCalendarInvite } from '../utils/calendar';

export default function ProgressTracker({ results, commitments, onRemove }) {
  const projectedTotal = calculateProjectedFootprint(results.total, commitments);
  const reductionKg = results.total - projectedTotal;
  const reductionPct = results.total > 0 ? ((reductionKg / results.total) * 100).toFixed(1) : 0;
  
  const currentRating = results.rating;
  const projectedRating = getRating(projectedTotal);

  const getBadgeColor = (rtg) => {
    switch (rtg) {
      case 'Excellent': return 'bg-green-500 text-white';
      case 'Good': return 'bg-emerald-500 text-white';
      case 'Average': return 'bg-yellow-500 text-gray-900';
      case 'High': return 'bg-orange-500 text-white';
      case 'Very High': return 'bg-red-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  return (
    <div className="mt-8 pt-8 border-t border-gray-700 animate-fade-in" style={{ animationDelay: '500ms' }}>
      <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
        📈 Your Progress Tracker
      </h3>

      {/* Section A: Projected Footprint */}
      <div className="bg-gray-800 rounded-xl p-5 border border-gray-700 mb-4">
        <div className="flex items-center justify-between mb-2">
          <div className="text-center">
            <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">Current</div>
            <div className="text-xl font-bold text-white">{Math.round(results.total).toLocaleString()} <span className="text-sm font-normal text-gray-500">kg/yr</span></div>
          </div>
          <div className="text-gray-500 text-2xl">→</div>
          <div className="text-center">
            <div className="text-xs text-green-400 uppercase tracking-wider mb-1">Projected</div>
            <div className="text-2xl font-black text-green-400">{Math.round(projectedTotal).toLocaleString()} <span className="text-sm font-normal opacity-70">kg/yr</span></div>
          </div>
        </div>
        
        {commitments.length > 0 ? (
          <p className="text-sm text-center text-gray-300 mt-4 pt-4 border-t border-gray-700">
            You've committed to saving <span className="font-bold text-white">{Math.round(reductionKg).toLocaleString()} kg/yr</span> — a <span className="font-bold text-green-400">{reductionPct}%</span> reduction.
          </p>
        ) : (
          <p className="text-sm text-center text-gray-500 mt-4 pt-4 border-t border-gray-700">
            Commit to actions above to see your projected footprint.
          </p>
        )}
      </div>

      {/* Section C: Rating Impact (Only show if there are commitments) */}
      {commitments.length > 0 && (
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700 mb-4 flex justify-between items-center">
          <span className="text-sm text-gray-300">Projected Rating:</span>
          <div className="flex items-center gap-3">
            <span className={`px-3 py-1 text-xs font-bold rounded-full shadow-sm ${getBadgeColor(projectedRating)}`}>
              {projectedRating}
            </span>
            {currentRating !== projectedRating && (
              <span className="text-xs text-green-400 font-bold bg-green-900/30 px-2 py-1 rounded-md border border-green-700/50">
                ⬆ Improved from {currentRating}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Section B: Committed Actions List */}
      <div className="space-y-2">
        {commitments.length === 0 ? (
          <div className="text-center py-6 bg-gray-800/50 rounded-xl border border-gray-700 border-dashed">
            <p className="text-sm text-gray-500">No commitments yet. Click "I'll do this" on any action above.</p>
          </div>
        ) : (
          commitments.map(c => (
            <div key={c.id} className="flex justify-between items-center bg-gray-800 p-3 rounded-lg border border-gray-700">
              <div className="flex items-center gap-3">
                <span className="text-green-500">✓</span>
                <span className="text-sm text-white font-medium">{c.title}</span>
              </div>
              
              {/* FIXED: The new buttons container with the Calendar Sync feature */}
              <div className="flex items-center gap-3">
                <span className="text-xs text-green-400 font-bold hidden sm:inline">
                  -{Math.round(c.savingsKg)} kg/yr
                </span>
                
                {/* NEW: Calendar Sync Button */}
                <button 
                  onClick={() => downloadCalendarInvite(c.title, c.description)}
                  className="bg-blue-900/30 text-blue-400 hover:bg-blue-800/50 hover:text-blue-300 text-[10px] font-bold px-2 py-1.5 rounded flex items-center gap-1 transition-colors border border-blue-800/50"
                  title="Add weekly reminder to your Calendar"
                >
                  <span>📅</span> Sync
                </button>

                <button 
                  onClick={() => onRemove(c.id)}
                  className="text-gray-500 hover:text-red-400 transition-colors px-2 py-1 bg-gray-900/50 rounded"
                  aria-label="Remove commitment"
                >
                  ✕
                </button>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
}