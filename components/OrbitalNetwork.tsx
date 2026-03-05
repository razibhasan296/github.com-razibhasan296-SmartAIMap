import React, { useMemo } from 'react';
import { motion } from 'motion/react';

interface Satellite {
  id: number;
  orbit: number;
  speed: number;
  initialAngle: number;
  size: number;
}

const OrbitalNetwork: React.FC = () => {
  const orbitalShells = useMemo(() => [
    { radius: 80, label: 'LEO_PRIMARY', style: 'border-solid', color: 'border-cyan-500/20', altitude: '400km' },
    { radius: 110, label: 'LEO_SECONDARY', style: 'border-dashed', color: 'border-cyan-500/10', altitude: '1,200km' },
    { radius: 140, label: 'MEO_ALPHA', style: 'border-solid', color: 'border-emerald-500/20', altitude: '10,000km' },
    { radius: 180, label: 'MEO_BETA', style: 'border-dashed', color: 'border-emerald-500/10', altitude: '20,000km' },
    { radius: 220, label: 'GEO_SYNC', style: 'border-solid', color: 'border-amber-500/20', altitude: '35,786km' },
    { radius: 260, label: 'DEEP_SPACE_ARRAY', style: 'border-dotted', color: 'border-slate-500/20', altitude: '50,000km' },
  ], []);

  const satellites = useMemo(() => {
    return Array.from({ length: 32 }).map((_, i) => {
      const shell = orbitalShells[i % orbitalShells.length];
      return {
        id: i,
        orbit: shell.radius,
        speed: 15 + Math.random() * 30,
        initialAngle: Math.random() * 360,
        size: 1.5 + Math.random() * 2,
        color: shell.color.replace('border-', 'bg-').replace('/20', '/80').replace('/10', '/80'),
      };
    });
  }, [orbitalShells]);

  return (
    <div className="relative w-full h-full flex items-center justify-center bg-slate-950/20 blueprint-subgrid overflow-hidden">
      {/* Central Globe Representation */}
      <div className="relative w-48 h-48 rounded-full border border-cyan-500/30 flex items-center justify-center">
        <div className="absolute inset-0 rounded-full bg-cyan-500/5 animate-pulse"></div>
        <div className="absolute inset-4 rounded-full border border-cyan-500/20 blueprint-grid opacity-20"></div>
        
        {/* Globe Labels */}
        <div className="absolute -top-6 text-[8px] font-mono text-cyan-500/50 uppercase tracking-widest">Earth_Core_Reference</div>
        <div className="absolute -bottom-6 text-[8px] font-mono text-cyan-500/50 uppercase tracking-widest">RAI_Sync_Active</div>
        
        {/* Crosshair */}
        <div className="absolute w-full h-[1px] bg-cyan-500/20"></div>
        <div className="absolute h-full w-[1px] bg-cyan-500/20"></div>
      </div>

      {/* Enhanced Orbital Shells */}
      {orbitalShells.map((shell, idx) => (
        <div 
          key={idx}
          className={`absolute rounded-full border ${shell.style} ${shell.color} transition-all duration-1000`}
          style={{ width: shell.radius * 2, height: shell.radius * 2 }}
        >
          {/* Shell Label */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex flex-col items-center gap-0.5 opacity-40 hover:opacity-100 transition-opacity">
            <span className="text-[5px] font-mono text-white/50 uppercase tracking-tighter">{shell.label}</span>
            <span className="text-[6px] font-mono text-cyan-400/80">{shell.altitude}</span>
          </div>
          
          {/* Radial Markers */}
          <div className="absolute inset-0 rounded-full opacity-10">
            {[0, 90, 180, 270].map(deg => (
              <div 
                key={deg}
                className="absolute top-1/2 left-1/2 w-1 h-[1px] bg-white"
                style={{ transform: `rotate(${deg}deg) translateX(${shell.radius}px)` }}
              />
            ))}
          </div>
        </div>
      ))}

      {/* Satellites */}
      {satellites.map((sat) => (
        <motion.div
          key={sat.id}
          className="absolute"
          initial={{ rotate: sat.initialAngle }}
          animate={{ rotate: sat.initialAngle + 360 }}
          transition={{
            duration: sat.speed,
            repeat: Infinity,
            ease: "linear"
          }}
          style={{ width: sat.orbit * 2, height: sat.orbit * 2 }}
        >
          <div 
            className="absolute top-0 left-1/2 -translate-x-1/2 flex flex-col items-center"
            style={{ transform: 'translateY(-50%)' }}
          >
            <div 
              className={`rounded-full shadow-[0_0_8px_rgba(34,211,238,0.4)] ${sat.color}`}
              style={{ width: sat.size, height: sat.size }}
            />
            {sat.id % 6 === 0 && (
              <div className="mt-1 text-[4px] font-mono text-white/30 whitespace-nowrap uppercase">
                NODE_{sat.id.toString().padStart(3, '0')}
              </div>
            )}
          </div>
        </motion.div>
      ))}

      {/* Blueprint Labels */}
      <div className="absolute top-4 left-4 flex flex-col gap-1">
        <div className="text-[10px] font-orbitron text-cyan-400 font-bold uppercase tracking-widest">Starlink_Mesh_Uplink</div>
        <div className="text-[7px] font-mono text-slate-500 uppercase tracking-tighter">Active_Nodes: 4,281</div>
        <div className="text-[7px] font-mono text-slate-500 uppercase tracking-tighter">Latency: 18ms</div>
      </div>

      <div className="absolute bottom-4 right-4 text-[7px] font-mono text-slate-500 uppercase text-right">
        Project_Valt // Orbital_Security_Protocol_v4.2
      </div>
    </div>
  );
};

export default OrbitalNetwork;
