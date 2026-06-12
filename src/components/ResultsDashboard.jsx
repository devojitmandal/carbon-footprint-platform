import React, { useEffect, useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import ShareCard from './ShareCard';

export default function ResultsDashboard({ results }) {
  const [animate, setAnimate] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const shareCardRef = useRef(null); // Reference for the hidden card

  useEffect(() => {
    const timer = setTimeout(() => setAnimate(true), 50);
    return () => clearTimeout(timer);
  }, []);

  // The Download Engine
  const handleDownloadCard = async () => {
    if (!shareCardRef.current) return;
    
    try {
      setIsGenerating(true);
      // Capture the off-screen element
      const canvas = await html2canvas(shareCardRef.current, {
        scale: 2, // High resolution for LinkedIn
        backgroundColor: '#111827', // Matches the gray-900 background
        logging: false
      });
      
      // Convert to image and trigger download
      const image = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = image;
      link.download = `FootprintAware-${results.rating}.png`;
      link.click();
    } catch (err) {
      console.error("Failed to generate card:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  const { total, breakdown, vsGlobalAvg, vsIndiaAvg, vs2030Target, vs2050Target, rating } = results;

  // Rating Badge Logic
  const getBadgeColor = (rtg) => {
    switch (rtg) {
      case 'Excellent': return 'bg-green-500';
      case 'Good': return 'bg-emerald-500';
      case 'Average': return 'bg-yellow-500';
      case 'High': return 'bg-orange-500';
      case 'Very High': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  // Helper for comparison pills
  const renderPill = (value, context) => {
    const isBelow = value < 0;
    const color = isBelow ? 'bg-green-900/50 text-green-400 border-green-700' : 'bg-red-900/50 text-red-400 border-red-700';
    const text = `${Math.abs(value).toFixed(1)}% ${isBelow ? 'below' : 'above'} ${context}`;
    return (
      <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${color}`}>
        {text}
      </span>
    );
  };

  // Breakdown logic
  const categories = [
    { id: 'transport', label: 'Transport', icon: '🚗', color: 'bg-blue-500', value: breakdown.transport },
    { id: 'energy', label: 'Energy', icon: '⚡', color: 'bg-amber-500', value: breakdown.energy },
    { id: 'diet', label: 'Diet', icon: '🥗', color: 'bg-green-500', value: breakdown.diet },
    { id: 'shopping', label: 'Shopping', icon: '🛒', color: 'bg-purple-500', value: breakdown.shopping }
  ];

  // Equivalents logic
  const trees = Math.round(total / 21.7);
  const carKm = Math.round(total / 0.192);
  const phones = Math.round(total / 0.008);
  const flights = Math.round(total / (1200 * 0.255));

  return (
    <div className="space-y-8 animate-fade-in relative">
      
      {/* Section A: Hero Score */}
      <div className="text-center space-y-4">
        <div className="text-5xl font-black text-white tracking-tight">
          {Math.round(total).toLocaleString()} <span className="text-2xl text-gray-400 font-medium">kg CO₂/yr</span>
        </div>
        <div className="flex justify-center items-center gap-2 flex-wrap">
          <span className={`px-4 py-1.5 rounded-full text-white font-bold text-sm shadow-sm ${getBadgeColor(rating)}`}>
            {rating} Impact
          </span>
          {renderPill(vsGlobalAvg, 'global avg')}
          {renderPill(vsIndiaAvg, 'India avg')}
        </div>

        {/* The Download Button */}
        <div className="pt-4">
          <button 
            onClick={handleDownloadCard}
            disabled={isGenerating}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white font-bold py-2 px-6 rounded-lg text-sm transition-colors shadow-lg flex items-center gap-2 mx-auto"
          >
            {isGenerating ? '📸 Generating...' : '📸 Download LinkedIn Share Card'}
          </button>
        </div>
      </div>

      {/* Section B: Breakdown Bars */}
      <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Category Breakdown</h3>
        <div className="space-y-4">
          {categories.map((cat) => {
            const pct = total > 0 ? ((cat.value / total) * 100).toFixed(1) : 0;
            return (
              <div key={cat.id}>
                <div className="flex justify-between text-sm mb-1 text-gray-200">
                  <span>{cat.icon} {cat.label}</span>
                  <span className="font-mono text-gray-400">{Math.round(cat.value)} kg ({pct}%)</span>
                </div>
                <div className="w-full bg-gray-700 h-2.5 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-1000 ease-out ${cat.color}`}
                    style={{ width: animate ? `${pct}%` : '0%' }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Section C: Benchmarks */}
      <div className="bg-gray-800 rounded-xl p-5 border border-gray-700 space-y-3 text-sm">
        <h3 className="font-bold text-gray-400 uppercase tracking-wider mb-2">Benchmarks & Science Targets</h3>
        
        {/* Averages */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="flex flex-col p-3 bg-gray-900/50 rounded-lg">
             <span className="text-gray-400 text-xs mb-1">vs Global (4,000 kg)</span>
             <span className="font-medium text-white">
               {vsGlobalAvg < 0 ? `🎉 ${Math.abs(vsGlobalAvg).toFixed(1)}% better` : vsGlobalAvg === 0 ? 'Exactly average' : `${vsGlobalAvg.toFixed(1)}% above`}
             </span>
          </div>
          <div className="flex flex-col p-3 bg-gray-900/50 rounded-lg">
             <span className="text-gray-400 text-xs mb-1">vs India (1,900 kg)</span>
             <span className="font-medium text-white">
               {vsIndiaAvg < 0 ? `🎉 ${Math.abs(vsIndiaAvg).toFixed(1)}% better` : vsIndiaAvg === 0 ? 'Exactly average' : `${vsIndiaAvg.toFixed(1)}% above`}
             </span>
          </div>
        </div>

        {/* 1.5°C Climate Targets */}
        <div className="space-y-2">
          <div className="flex items-center justify-between p-3 bg-blue-900/20 border border-blue-800/30 rounded-lg">
             <span className="text-blue-400 font-bold flex items-center gap-2">🎯 2030 Target <span className="text-blue-200/50 font-normal text-xs">(2,500 kg)</span></span>
             <span className="font-medium text-white">
               {vs2030Target <= 0 ? <span className="text-green-400">✅ Goal Met</span> : `${vs2030Target.toFixed(1)}% over`}
             </span>
          </div>
          <div className="flex items-center justify-between p-3 bg-purple-900/20 border border-purple-800/30 rounded-lg">
             <span className="text-purple-400 font-bold flex items-center gap-2">🌍 2050 Target <span className="text-purple-200/50 font-normal text-xs">(700 kg)</span></span>
             <span className="font-medium text-white">
               {vs2050Target <= 0 ? <span className="text-green-400">✅ Goal Met</span> : `${vs2050Target.toFixed(1)}% over`}
             </span>
          </div>
        </div>
      </div>

      {/* Section D: Equivalent Impacts */}
      <div>
        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Real-World Equivalents</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gray-800 p-4 rounded-xl border border-gray-700 text-center">
          <div className="text-2xl mb-1" aria-hidden="true">🌳</div>
             <div className="font-bold text-white text-lg">{trees.toLocaleString()}</div>
             <div className="text-xs text-gray-400">Trees to offset</div>
          </div>
          <div className="bg-gray-800 p-4 rounded-xl border border-gray-700 text-center">
          <div className="text-2xl mb-1" aria-hidden="true">🚗</div>
             <div className="font-bold text-white text-lg">{carKm.toLocaleString()} km</div>
             <div className="text-xs text-gray-400">Driving equivalent</div>
          </div>
          <div className="bg-gray-800 p-4 rounded-xl border border-gray-700 text-center">
          <div className="text-2xl mb-1" aria-hidden="true">📱</div>
             <div className="font-bold text-white text-lg">{phones.toLocaleString()}</div>
             <div className="text-xs text-gray-400">Phone charges</div>
          </div>
          <div className="bg-gray-800 p-4 rounded-xl border border-gray-700 text-center">
          <div className="text-2xl mb-1" aria-hidden="true">✈️</div>
             <div className="font-bold text-white text-lg">{flights.toLocaleString()}</div>
             <div className="text-xs text-gray-400">Flights to Delhi</div>
          </div>
        </div>
      </div>

      {/* The Hidden Share Card for html2canvas to capture */}
      <ShareCard ref={shareCardRef} results={results} />

    </div>
  );
}