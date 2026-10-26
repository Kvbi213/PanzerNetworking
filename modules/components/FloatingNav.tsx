import React from 'react';
import { motion } from 'framer-motion';
import { Route, PlayCircle, Layers, Crosshair, BookOpen } from 'lucide-react';

export type TabId = 'route' | 'sim' | 'matrioszka' | 'matrix' | 'defense';

interface NavItem {
  id: TabId;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  shortLabel: string;
}

const NAV_ITEMS: readonly NavItem[] = [
  { id: 'route', label: '1. Trasa & Wireshark', shortLabel: 'Trasa', icon: Route },
  { id: 'sim', label: '2. Symulator 60 FPS', shortLabel: 'Fizyka', icon: PlayCircle },
  { id: 'matrioszka', label: '3. Kaskada Matrioszki', shortLabel: 'Szyfry', icon: Layers },
  { id: 'matrix', label: '4. Wektory Ataku', shortLabel: 'Ataki', icon: Crosshair },
  { id: 'defense', label: '5. Obrona & Audyt', shortLabel: 'Audyt', icon: BookOpen },
];

interface FloatingNavProps {
  activeTab: TabId;
  onSelectTab: (tab: TabId) => void;
}

export const FloatingNav: React.FC<FloatingNavProps> = ({ activeTab, onSelectTab }) => {
  return (
    <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-2 py-1.5 rounded-2xl glass-panel bg-black/60 border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.6)] backdrop-blur-2xl max-w-[95vw] sm:max-w-none">
      <div className="flex items-center gap-1 sm:gap-2">
        {NAV_ITEMS.map((item) => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;

          return (
            <motion.button
              key={item.id}
              whileTap={{ scale: 0.96 }}
              onClick={() => onSelectTab(item.id)}
              className={`relative px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl flex items-center gap-2 text-xs font-mono font-medium transition-colors select-none ${
                isActive
                  ? 'text-white'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeTabPill"
                  transition={{ type: 'spring', damping: 1.0, stiffness: 120 }}
                  className="absolute inset-0 rounded-xl bg-panzer-cyan/15 border border-panzer-cyan/35 shadow-[0_0_20px_rgba(0,240,255,0.2)]"
                />
              )}
              <Icon className={`relative z-10 w-4 h-4 transition-colors ${isActive ? 'text-panzer-cyan' : 'text-slate-400'}`} />
              <span className="relative z-10 hidden sm:inline">{item.label}</span>
              <span className="relative z-10 sm:hidden">{item.shortLabel}</span>
            </motion.button>
          );
        })}
      </div>
    </nav>
  );
};
