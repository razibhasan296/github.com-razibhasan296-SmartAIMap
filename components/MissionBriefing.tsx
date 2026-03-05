import React from 'react';
import { LocationInfo } from '../types';

interface MissionBriefingProps {
  location: LocationInfo | null;
  loading: boolean;
  onNarrate: () => void;
  isNarrating: boolean;
  style?: string;
}

const MissionBriefing: React.FC<MissionBriefingProps> = ({ location, loading, onNarrate, isNarrating, style }) => {
  if (!location && !loading) return null;

  const isCodex = style === 'Codex';

  return (
    <div className={`border rounded-lg p-4 relative overflow-hidden group blueprint-border ${isCodex ? 'border-amber-500/20 bg-stone-950/40' : 'border-cyan-500/20 bg-slate-900/40'}`}>
      <div className="blueprint-corner-tl"></div>
      <div className="blueprint-corner-tr"></div>
      
      <div className="absolute top-0 right-0 p-2 opacity-20 group-hover:opacity-100 transition-opacity flex items-center gap-2">
        <button 
          onClick={onNarrate}
          disabled={isNarrating || loading}
          className={`p-1.5 rounded border transition-all ${isNarrating ? (isCodex ? 'bg-amber-500/20 border-amber-400 text-amber-400' : 'bg-cyan-500/20 border-cyan-400 text-cyan-400') : 'bg-slate-800 border-slate-700 text-slate-500 hover:text-cyan-400 hover:border-cyan-500/50'}`}
          title="Narrate Briefing"
        >
          <span className={`text-[10px] block ${isNarrating ? 'animate-pulse' : ''}`}>🎙️</span>
        </button>
        <div className={`text-[8px] font-mono ${isCodex ? 'text-amber-500' : 'text-cyan-500'}`}>{isCodex ? 'CODEX_v2.1' : 'PROJECT_VALT_v1.0'}</div>
      </div>
      
      <h4 className={`text-[10px] font-orbitron uppercase mb-3 flex items-center gap-2 ${isCodex ? 'text-amber-500/70' : 'text-cyan-500/70'}`}>
        <span className={`w-2 h-2 animate-pulse rounded-full ${isCodex ? 'bg-amber-500 shadow-[0_0_8px_#f59e0b]' : 'bg-cyan-500 shadow-[0_0_8px_#22d3ee]'}`}></span>
        {isCodex ? 'Codex Archive Retrieval' : 'Active Mission Briefing'}
      </h4>

      {loading ? (
        <div className="space-y-3 animate-pulse">
          <div className="h-4 bg-slate-800 rounded w-1/2"></div>
          <div className="h-20 bg-slate-800 rounded"></div>
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <div className="text-[8px] text-slate-500 uppercase font-mono mb-1">Objective Location</div>
            <div className="text-sm font-bold text-white font-orbitron tracking-wide">{location?.name}</div>
          </div>

          <div>
            <div className="text-[8px] text-slate-500 uppercase font-mono mb-1">Strategic Context</div>
            <p className="text-[11px] text-slate-400 leading-relaxed italic">
              "{location?.strategicContext || "The RAI sensors are analyzing the sector. Initial scans suggest a nexus of strategic interest."}"
            </p>
          </div>

          {location?.groundingSources && location.groundingSources.length > 0 && (
            <div className="space-y-2">
              <div className="text-[8px] text-slate-500 uppercase font-mono mb-1">Intelligence Sources</div>
              <div className="flex flex-wrap gap-2">
                {location.groundingSources.slice(0, 3).map((source, idx) => (
                  <a 
                    key={idx} 
                    href={source.uri} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={`text-[8px] bg-slate-800 hover:bg-slate-700 border border-slate-700 px-2 py-1 rounded transition-all truncate max-w-[120px] ${isCodex ? 'text-amber-400 hover:border-amber-500/50' : 'text-cyan-400 hover:border-cyan-500/50'}`}
                    title={source.title}
                  >
                    {source.title}
                  </a>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800">
            <div>
              <div className="text-[7px] text-slate-600 uppercase font-mono">Priority</div>
              <div className={`text-[10px] font-bold ${isCodex ? 'text-amber-400' : 'text-cyan-400'}`}>ALPHA_ONE</div>
            </div>
            <div>
              <div className="text-[7px] text-slate-600 uppercase font-mono">Intel Source</div>
              <div className={`text-[10px] font-bold ${isCodex ? 'text-yellow-600' : 'text-purple-400'}`}>{isCodex ? 'CODEX_BOT' : 'VALT_UPLINK'}</div>
            </div>
          </div>
        </div>
      )}

      <div className="mt-4 pt-3 border-t border-slate-800/50">
        <button className={`w-full py-2 border rounded text-[9px] font-orbitron font-bold transition-all uppercase tracking-widest ${isCodex ? 'bg-amber-500/10 hover:bg-amber-500/20 border-amber-500/30 text-amber-400' : 'bg-cyan-500/10 hover:bg-cyan-500/20 border-cyan-500/30 text-cyan-400'}`}>
          {isCodex ? 'Decrypt Archive Packet' : 'Download Intel Packet'}
        </button>
      </div>
    </div>
  );
};

export default MissionBriefing;
