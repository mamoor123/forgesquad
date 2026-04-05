'use client';

import { motion } from 'framer-motion';

export function Monitor({ color, active }: { color: string; active: boolean }) {
  return (
    <div className="relative">
      {/* Screen */}
      <motion.div
        className="w-12 h-8 rounded-sm border-2 flex items-center justify-center overflow-hidden"
        style={{
          borderColor: `${color}60`,
          backgroundColor: active ? `${color}15` : '#060912',
        }}
        animate={active ? { borderColor: [`${color}40`, `${color}80`, `${color}40`] } : {}}
        transition={{ duration: 2, repeat: Infinity }}
      >
        {/* Scan lines */}
        <div className="absolute inset-0 opacity-20">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="w-full h-px bg-gray-700" style={{ marginTop: i * 4 }} />
          ))}
        </div>
        {active && (
          <motion.div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: color }}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
        )}
      </motion.div>
      {/* Stand */}
      <div className="w-4 h-2 mx-auto bg-[#2a3655]" />
      <div className="w-6 h-1 mx-auto bg-[#2a3655] rounded" />
    </div>
  );
}

export function ConnectionLine({
  color,
  active,
}: {
  color: string;
  active: boolean;
}) {
  return (
    <motion.div
      className="h-0.5 rounded-full"
      style={{
        backgroundColor: active ? color : '#1e2740',
        minWidth: 40,
      }}
      animate={
        active
          ? {
              boxShadow: [
                `0 0 2px ${color}40`,
                `0 0 8px ${color}60`,
                `0 0 2px ${color}40`,
              ],
            }
          : {}
      }
      transition={{ duration: 1.5, repeat: Infinity }}
    />
  );
}

export function ServerRack({ active }: { active: boolean }) {
  return (
    <div className="flex flex-col gap-0.5">
      {[...Array(4)].map((_, i) => (
        <motion.div
          key={i}
          className="w-8 h-2 rounded-sm bg-[#1e2740] border border-[#2a3655]"
          animate={
            active
              ? { backgroundColor: ['#1e2740', '#2a3655', '#1e2740'] }
              : {}
          }
          transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
        >
          <motion.div
            className="w-1 h-1 rounded-full mt-0.5 ml-1"
            style={{ backgroundColor: active ? '#10b981' : '#3d4f6f' }}
            animate={active ? { opacity: [0.5, 1, 0.5] } : {}}
            transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.2 }}
          />
        </motion.div>
      ))}
    </div>
  );
}
