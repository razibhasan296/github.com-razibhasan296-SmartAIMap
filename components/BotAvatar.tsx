import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BotLockStatus } from '../types';

interface BotAvatarProps {
  status: BotLockStatus;
}

const BotAvatar: React.FC<BotAvatarProps> = ({ status }) => {
  const getColors = () => {
    switch (status) {
      case BotLockStatus.LOCKED:
        return { primary: '#22d3ee', secondary: '#0891b2', glow: 'rgba(34, 211, 238, 0.6)', eye: '#22d3ee' };
      case BotLockStatus.SCANNING:
        return { primary: '#fbbf24', secondary: '#d97706', glow: 'rgba(251, 191, 36, 0.6)', eye: '#fbbf24' };
      case BotLockStatus.OVERRIDE:
        return { primary: '#ef4444', secondary: '#b91c1c', glow: 'rgba(239, 68, 68, 0.6)', eye: '#ef4444' };
      case BotLockStatus.UNLOCKED:
        return { primary: '#10b981', secondary: '#059669', glow: 'rgba(16, 185, 129, 0.6)', eye: '#10b981' };
      default:
        return { primary: '#94a3b8', secondary: '#475569', glow: 'transparent', eye: '#94a3b8' };
    }
  };

  const colors = getColors();

  return (
    <div className="relative w-20 h-20 flex items-center justify-center group">
      {/* Orbital Rings */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 border border-dashed border-white/10 rounded-full"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
          className="absolute inset-2 border border-dotted border-white/5 rounded-full"
        />
        {status === BotLockStatus.SCANNING && (
          <motion.div
            animate={{ rotate: 360, scale: [1, 1.1, 1] }}
            transition={{ rotate: { duration: 2, repeat: Infinity, ease: "linear" }, scale: { duration: 1, repeat: Infinity } }}
            className="absolute inset-0 border-2 border-t-transparent border-l-transparent rounded-full"
            style={{ borderColor: colors.primary }}
          />
        )}
      </div>

      {/* Bot Head Container */}
      <motion.div
        layout
        initial={false}
        animate={{
          scale: status === BotLockStatus.OVERRIDE ? [1, 1.05, 0.95, 1] : 1,
          rotate: status === BotLockStatus.OVERRIDE ? [0, -2, 2, 0] : 0,
          y: [0, -2, 0]
        }}
        transition={{
          scale: { duration: 0.2, repeat: status === BotLockStatus.OVERRIDE ? Infinity : 0 },
          rotate: { duration: 0.1, repeat: status === BotLockStatus.OVERRIDE ? Infinity : 0 },
          y: { duration: 3, repeat: Infinity, ease: "easeInOut" }
        }}
        className="relative w-14 h-14 bg-slate-900 rounded-2xl border-2 flex flex-col items-center justify-center shadow-2xl overflow-hidden"
        style={{ 
          borderColor: colors.primary,
          boxShadow: `0 0 20px ${colors.glow}, inset 0 0 10px ${colors.glow}`
        }}
      >
        {/* Glass Reflection */}
        <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
        
        {/* Face / Eyes */}
        <div className="flex flex-col items-center gap-2 z-10">
          <div className="flex gap-3">
            {/* Left Eye */}
            <motion.div
              animate={{
                height: status === BotLockStatus.SCANNING ? [6, 2, 6] : 6,
                scaleY: status === BotLockStatus.OVERRIDE ? [1, 0.2, 1] : 1
              }}
              transition={{
                height: { duration: 0.5, repeat: Infinity },
                scaleY: { duration: 0.1, repeat: Infinity }
              }}
              className="w-2 rounded-full"
              style={{ backgroundColor: colors.eye, boxShadow: `0 0 8px ${colors.eye}` }}
            />
            {/* Right Eye */}
            <motion.div
              animate={{
                height: status === BotLockStatus.SCANNING ? [6, 2, 6] : 6,
                scaleY: status === BotLockStatus.OVERRIDE ? [1, 0.2, 1] : 1
              }}
              transition={{
                height: { duration: 0.5, repeat: Infinity, delay: 0.1 },
                scaleY: { duration: 0.1, repeat: Infinity, delay: 0.05 }
              }}
              className="w-2 rounded-full"
              style={{ backgroundColor: colors.eye, boxShadow: `0 0 8px ${colors.eye}` }}
            />
          </div>

          {/* Mouth / Status Line */}
          <motion.div
            animate={{
              width: status === BotLockStatus.LOCKED ? 16 : 8,
              opacity: status === BotLockStatus.SCANNING ? [0.3, 1, 0.3] : 1
            }}
            className="h-0.5 rounded-full"
            style={{ backgroundColor: colors.primary }}
          />
        </div>

        {/* Scanning Beam */}
        <AnimatePresence>
          {status === BotLockStatus.SCANNING && (
            <motion.div
              initial={{ top: "-10%" }}
              animate={{ top: "110%" }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent blur-[1px] z-20"
            />
          )}
        </AnimatePresence>

        {/* Glitch Overlay for Override */}
        {status === BotLockStatus.OVERRIDE && (
          <motion.div
            animate={{ opacity: [0, 0.2, 0, 0.4, 0] }}
            transition={{ duration: 0.2, repeat: Infinity }}
            className="absolute inset-0 bg-red-500 mix-blend-overlay"
          />
        )}
      </motion.div>

      {/* Connection Nodes */}
      <div className="absolute -bottom-2 flex gap-1">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            animate={{
              scale: status === BotLockStatus.LOCKED ? [1, 1.2, 1] : 1,
              opacity: status === BotLockStatus.LOCKED ? 1 : 0.3
            }}
            transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
            className="w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: colors.primary }}
          />
        ))}
      </div>
    </div>
  );
};

export default BotAvatar;
