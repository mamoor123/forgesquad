'use client';

import { motion } from 'framer-motion';
import clsx from 'clsx';

interface BadgeProps {
  label: string;
  color: string;
  pulse?: boolean;
  size?: 'sm' | 'md';
}

export default function Badge({ label, color, pulse = false, size = 'sm' }: BadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 rounded-full font-medium tracking-wide',
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm',
        pulse && 'agent-active'
      )}
      style={{
        backgroundColor: `${color}20`,
        color: color,
        border: `1px solid ${color}40`,
      }}
    >
      <span
        className="inline-block rounded-full"
        style={{
          width: size === 'sm' ? 6 : 8,
          height: size === 'sm' ? 6 : 8,
          backgroundColor: color,
          boxShadow: pulse ? `0 0 8px ${color}` : 'none',
        }}
      />
      {label}
    </span>
  );
}
