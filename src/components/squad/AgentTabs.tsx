'use client';

import { Eye, Compass, Search, Terminal, CheckCircle } from 'lucide-react';
import clsx from 'clsx';

interface AgentTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const TABS = [
  { id: 'S', name: 'Supervisor', icon: Eye, color: '#00d4ff' },
  { id: 'A', name: 'Planner', icon: Compass, color: '#10b981' },
  { id: 'B', name: 'Reviewer', icon: Search, color: '#f59e0b' },
  { id: 'C', name: 'Coder', icon: Terminal, color: '#8b5cf6' },
  { id: 'D', name: 'Tester', icon: CheckCircle, color: '#f43f5e' },
];

export default function AgentTabs({ activeTab, onTabChange }: AgentTabsProps) {
  return (
    <div className="flex items-center gap-1 bg-[#060912] rounded-xl p-1 border border-[#1e2740]">
      {TABS.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={clsx(
              'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
              isActive
                ? 'text-white'
                : 'text-gray-500 hover:text-gray-300'
            )}
            style={
              isActive
                ? {
                    backgroundColor: `${tab.color}15`,
                    color: tab.color,
                    boxShadow: `0 0 10px ${tab.color}10`,
                  }
                : undefined
            }
          >
            <Icon className="w-4 h-4" />
            <span className="hidden sm:inline">{tab.name}</span>
          </button>
        );
      })}
    </div>
  );
}
