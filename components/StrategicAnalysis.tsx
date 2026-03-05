import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { generateStrategicAnalysis } from '../services/geminiService';

interface StrategicAnalysisProps {
  locationName: string;
  onClose: () => void;
}

interface AnalysisResult {
  summary: string;
  tacticalRecommendations: string[];
  riskAssessment: string;
  projectedOutcome: string;
  groundingSources?: { title: string; uri: string }[];
}

const StrategicAnalysis: React.FC<StrategicAnalysisProps> = ({ locationName, onClose }) => {
  const [objective, setObjective] = useState('Territorial Surveillance');
  const [threatFocus, setThreatFocus] = useState('Asymmetric Warfare');
  const [resourceAllocation, setResourceAllocation] = useState('Balanced Deployment');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleRunAnalysis = async () => {
    setIsAnalyzing(true);
    setError(null);
    try {
      const data = await generateStrategicAnalysis(locationName, {
        objective,
        threatFocus,
        resourceAllocation
      });
      setResult(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Strategic uplink failed. Please retry.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-10 pointer-events-none"
    >
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md pointer-events-auto" onClick={onClose}></div>
      
      <div className="relative w-full max-w-4xl bg-slate-900 border border-cyan-500/30 rounded-2xl shadow-[0_0_50px_rgba(34,211,238,0.15)] overflow-hidden flex flex-col pointer-events-auto blueprint-border">
        <div className="blueprint-corner-tl"></div>
        <div className="blueprint-corner-tr"></div>
        <div className="blueprint-corner-bl"></div>
        <div className="blueprint-corner-br"></div>

        {/* Header */}
        <div className="p-6 border-b border-cyan-500/20 flex items-center justify-between bg-cyan-500/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
              <span className="text-xl">🛡️</span>
            </div>
            <div>
              <h2 className="font-orbitron font-bold text-cyan-400 uppercase tracking-widest text-lg">Deep_Strategic_Analysis</h2>
              <p className="text-[10px] font-mono text-slate-500 uppercase">Target: {locationName}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors text-slate-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 flex flex-col md:flex-row gap-8">
          {/* Parameters Panel */}
          <div className="w-full md:w-1/3 space-y-6">
            <div className="space-y-4">
              <div className="text-[10px] font-mono text-cyan-500/60 uppercase tracking-widest border-b border-cyan-500/10 pb-1">Input_Parameters</div>
              
              <div className="space-y-2">
                <label className="text-[9px] font-mono text-slate-500 uppercase">Primary_Objective</label>
                <select 
                  value={objective}
                  onChange={(e) => setObjective(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-xs font-mono text-slate-300 focus:outline-none focus:border-cyan-500 transition-colors"
                >
                  <option>Territorial Surveillance</option>
                  <option>Resource Extraction</option>
                  <option>Diplomatic Stabilization</option>
                  <option>Counter-Insurgency</option>
                  <option>Infrastructure Development</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-mono text-slate-500 uppercase">Threat_Focus</label>
                <select 
                  value={threatFocus}
                  onChange={(e) => setThreatFocus(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-xs font-mono text-slate-300 focus:outline-none focus:border-cyan-500 transition-colors"
                >
                  <option>Asymmetric Warfare</option>
                  <option>Cyber Espionage</option>
                  <option>Environmental Collapse</option>
                  <option>Political Instability</option>
                  <option>Economic Sanctions</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-mono text-slate-500 uppercase">Resource_Allocation</label>
                <select 
                  value={resourceAllocation}
                  onChange={(e) => setResourceAllocation(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-xs font-mono text-slate-300 focus:outline-none focus:border-cyan-500 transition-colors"
                >
                  <option>Minimal Footprint</option>
                  <option>Balanced Deployment</option>
                  <option>Maximum Force</option>
                  <option>Logistical Heavy</option>
                  <option>Intelligence Focused</option>
                </select>
              </div>
            </div>

            <button 
              onClick={handleRunAnalysis}
              disabled={isAnalyzing}
              className={`w-full py-4 rounded-xl font-orbitron font-bold text-xs tracking-[0.2em] transition-all border shadow-lg flex items-center justify-center gap-3 ${
                isAnalyzing 
                  ? 'bg-slate-800 border-slate-700 text-slate-600 cursor-not-allowed' 
                  : 'bg-cyan-500 hover:bg-cyan-400 text-black border-white/20 active:scale-95'
              }`}
            >
              {isAnalyzing ? (
                <>
                  <div className="w-4 h-4 border-2 border-slate-600 border-t-slate-400 rounded-full animate-spin"></div>
                  ANALYZING...
                </>
              ) : (
                <>
                  <span>⚡</span>
                  RUN_STRATEGIC_UPLINK
                </>
              )}
            </button>

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded text-[10px] font-mono text-red-400 animate-pulse">
                ERROR: {error}
              </div>
            )}
          </div>

          {/* Results Panel */}
          <div className="flex-1 bg-slate-950/50 rounded-xl border border-slate-800 p-6 relative overflow-hidden">
            <div className="absolute inset-0 blueprint-grid opacity-5 pointer-events-none"></div>
            
            <AnimatePresence mode="wait">
              {!result && !isAnalyzing ? (
                <motion.div 
                  key="idle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-40"
                >
                  <div className="text-4xl">📡</div>
                  <div className="font-orbitron text-xs tracking-widest uppercase">Awaiting Strategic Parameters</div>
                  <p className="text-[10px] font-mono max-w-xs">Configure the mission parameters on the left to initiate the RAI Strategic Core analysis.</p>
                </motion.div>
              ) : isAnalyzing ? (
                <motion.div 
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full flex flex-col items-center justify-center space-y-6"
                >
                  <div className="relative">
                    <div className="w-16 h-16 border-2 border-cyan-500/20 rounded-full animate-ping"></div>
                    <div className="absolute inset-0 w-16 h-16 border-t-2 border-cyan-500 rounded-full animate-spin"></div>
                  </div>
                  <div className="text-center space-y-2">
                    <div className="font-orbitron text-cyan-400 text-xs tracking-widest animate-pulse">RAI_CORE_THINKING</div>
                    <div className="text-[8px] font-mono text-slate-500 uppercase">Processing Global Intelligence Data...</div>
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  key="result"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <div className="space-y-2">
                    <div className="text-[10px] font-mono text-cyan-500/60 uppercase tracking-widest">Strategic_Summary</div>
                    <p className="text-sm text-slate-300 leading-relaxed font-sans">{result.summary}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div className="text-[10px] font-mono text-emerald-500/60 uppercase tracking-widest">Tactical_Recommendations</div>
                      <ul className="space-y-2">
                        {result.tacticalRecommendations.map((rec, i) => (
                          <li key={i} className="text-[11px] text-slate-400 flex gap-2">
                            <span className="text-emerald-500">▹</span>
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="space-y-3">
                      <div className="text-[10px] font-mono text-amber-500/60 uppercase tracking-widest">Risk_Assessment</div>
                      <p className="text-[11px] text-slate-400 leading-relaxed italic">{result.riskAssessment}</p>
                    </div>
                  </div>

                  <div className="p-4 bg-cyan-500/5 border border-cyan-500/20 rounded-lg">
                    <div className="text-[10px] font-mono text-cyan-500/60 uppercase tracking-widest mb-2">Projected_Outcome</div>
                    <p className="text-xs text-cyan-100 font-medium">{result.projectedOutcome}</p>
                  </div>

                  {result.groundingSources && result.groundingSources.length > 0 && (
                    <div className="pt-4 border-t border-slate-800">
                      <div className="text-[9px] font-mono text-slate-500 uppercase mb-2">Intelligence_Sources</div>
                      <div className="flex flex-wrap gap-2">
                        {result.groundingSources.map((source, i) => (
                          <a 
                            key={i} 
                            href={source.uri} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-[9px] bg-slate-800 hover:bg-slate-700 text-cyan-400/80 px-2 py-1 rounded transition-colors"
                          >
                            {source.title} ↗
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950/80 border-t border-slate-800 flex justify-between items-center">
          <div className="text-[8px] font-mono text-slate-600 uppercase tracking-widest flex items-center gap-4">
            <span>Protocol: PROJECT_VALT_STRAT_v1.0</span>
            <span className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse"></span>
            <span>Uplink_Status: SECURE</span>
          </div>
          <div className="text-[8px] font-mono text-slate-600 uppercase">© RAI_CORE_INTELLIGENCE_SYSTEM</div>
        </div>
      </div>
    </motion.div>
  );
};

export default StrategicAnalysis;
