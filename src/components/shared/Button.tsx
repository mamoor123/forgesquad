'use client';

import { motion } from 'framer-motion';
import clsx from 'clsx';

interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  icon?: React.ReactNode;
  color?: string;
}

export default function Button({
  label,
  onClick,
  variant = 'secondary',
  size = 'md',
  disabled = false,
  icon,
  color,
}: ButtonProps) {
  const baseStyles =
    'inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-200 tracking-wide';

  const variantStyles: Record<string, string> = {
    primary: 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/20',
    secondary:
      'bg-[#1e2740] hover:bg-[#2a3655] text-gray-300 border border-[#2a3655] hover:border-[#3d4f6f]',
    danger: 'bg-rose-600/20 hover:bg-rose-600/40 text-rose-400 border border-rose-600/30',
    ghost: 'bg-transparent hover:bg-[#1e2740] text-gray-400 hover:text-gray-200',
  };

  const sizeStyles: Record<string, string> = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        baseStyles,
        variantStyles[variant],
        sizeStyles[size],
        disabled && 'opacity-40 cursor-not-allowed'
      )}
      style={
        color
          ? {
              borderColor: `${color}40`,
              color: color,
              backgroundColor: `${color}10`,
            }
          : undefined
      }
    >
      {icon}
      {label}
    </motion.button>
  );
}
