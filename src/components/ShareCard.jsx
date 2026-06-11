import React, { forwardRef } from 'react';

const ShareCard = forwardRef(({ results }, ref) => {
  if (!results) return null;

  const { total, rating, vsGlobalAvg } = results;

  const getBadgeStyle = (rtg) => {
    switch (rtg) {
      case 'Excellent': return { color: '#4ade80', backgroundColor: 'rgba(21, 128, 61, 0.3)', borderColor: 'rgba(34, 197, 94, 0.5)' };
      case 'Good': return { color: '#34d399', backgroundColor: 'rgba(4, 120, 87, 0.3)', borderColor: 'rgba(16, 185, 129, 0.5)' };
      case 'Average': return { color: '#facc15', backgroundColor: 'rgba(161, 98, 7, 0.3)', borderColor: 'rgba(234, 179, 8, 0.5)' };
      case 'High': return { color: '#fb923c', backgroundColor: 'rgba(154, 52, 18, 0.3)', borderColor: 'rgba(249, 115, 22, 0.5)' };
      case 'Very High': return { color: '#f87171', backgroundColor: 'rgba(153, 27, 27, 0.3)', borderColor: 'rgba(239, 68, 68, 0.5)' };
      default: return { color: '#9ca3af', backgroundColor: 'rgba(55, 65, 81, 0.3)', borderColor: 'rgba(107, 114, 128, 0.5)' };
    }
  };

  return (
    <div className="absolute top-0 left-0 w-0 h-0 overflow-hidden pointer-events-none">
      <div 
        ref={ref} 
        className="w-[600px] h-[315px] border-2 rounded-2xl p-8 flex flex-col justify-between font-sans overflow-hidden"
        style={{ backgroundColor: '#111827', borderColor: '#374151', position: 'relative' }}
      >
        {/* Decorative Background Blob */}
        <div 
          className="absolute -top-24 -right-24 w-80 h-80 rounded-full" 
          style={{ backgroundColor: '#22c55e', opacity: 0.15, zIndex: 0 }}
        ></div>

        {/* Header */}
        <div className="flex justify-between items-center" style={{ position: 'relative', zIndex: 10 }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#16a34a' }}>
              <span className="font-bold text-2xl" style={{ color: '#ffffff' }}>C</span>
            </div>
            <span className="font-bold text-2xl tracking-tight" style={{ color: '#ffffff' }}>
              FootprintAware
            </span>
          </div>
          <div className="font-medium text-sm" style={{ color: '#9ca3af' }}>
            Hack2Skill Challenge
          </div>
        </div>

        {/* Main Stats */}
        <div className="flex justify-between items-end mb-2" style={{ position: 'relative', zIndex: 10 }}>
          <div>
            <div className="font-bold uppercase tracking-widest text-xs mb-2" style={{ color: '#9ca3af' }}>
              My Annual Footprint
            </div>
            <div className="text-6xl font-black tracking-tighter flex items-baseline gap-2" style={{ color: '#ffffff' }}>
              {Math.round(total).toLocaleString()} 
              <span className="text-3xl font-medium tracking-normal" style={{ color: '#6b7280' }}>kg CO₂</span>
            </div>
          </div>
          
          <div className="text-right flex flex-col items-end">
            <div 
              className="px-4 py-2 border-2 rounded-xl font-bold text-lg mb-2 shadow-lg text-center"
              style={getBadgeStyle(rating)}
            >
              {rating} Impact
            </div>
            <div className="text-sm font-medium" style={{ color: '#d1d5db' }}>
              {Math.abs(vsGlobalAvg).toFixed(1)}% {vsGlobalAvg < 0 ? 'better than' : 'above'} global avg
            </div>
          </div>
        </div>

        {/* Footer  */}
        <div className="border-t pt-4 flex justify-between items-center" style={{ borderColor: '#374151', position: 'relative', zIndex: 10 }}>
          <div className="font-bold text-sm" style={{ color: '#4ade80' }}>
            I've committed to a greener future. 🌱
          </div>
          <div className="text-xs font-mono" style={{ color: '#6b7280' }}>
            Calculate yours today.
          </div>
        </div>
      </div>
    </div>
  );
});

export default ShareCard;