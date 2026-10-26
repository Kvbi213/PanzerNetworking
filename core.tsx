import React, { useState, useEffect, useCallback } from 'react';
import { createRoot } from 'react-dom/client';
import { motion, AnimatePresence } from 'framer-motion';
import './assets/styles/index.css';

import { panzerCore } from './core';
import { SimulationParams, SimulationMetrics, PersonaMode } from './modules/types/simulation';
import { HeaderStatus } from './modules/components/HeaderStatus';
import { FloatingNav, TabId } from './modules/components/FloatingNav';
import { RouteInspector } from './modules/components/RouteInspector';
import { PhysicsSimulator } from './modules/components/PhysicsSimulator';
import { MatrioszkaCascade } from './modules/components/MatrioszkaCascade';
import { AttackMatrix } from './modules/components/AttackMatrix';
import { AuditDefense } from './modules/components/AuditDefense';

const SPRING_TRANSITION = {
  type: 'spring',
  damping: 1.0,
  stiffness: 120,
} as const;

interface TabSectionProps {
  children: React.ReactNode;
}

const TabSection: React.FC<TabSectionProps> = ({ children }) => (
  <motion.section
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={SPRING_TRANSITION}
  >
    {children}
  </motion.section>
);

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabId>('route');
  const [params, setParams] = useState<SimulationParams>(panzerCore.params);
  const [metrics, setMetrics] = useState<SimulationMetrics>(panzerCore.metrics);

  useEffect(() => {
    const unsubscribe = panzerCore.subscribe((newParams, newMetrics) => {
      setParams(newParams);
      setMetrics(newMetrics);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  const handleSetPersona = useCallback((mode: PersonaMode) => {
    if (!mode) return;
    try {
      panzerCore.setPersona(mode);
    } catch (err) {
      console.error('[!] ALERT :: Error setting persona:', err);
    }
  }, []);

  const handleUpdateParams = useCallback((partial: Partial<SimulationParams>) => {
    if (!partial || typeof partial !== 'object') {
      console.warn('[!] ALERT :: Partial params must be an object.');
      return;
    }
    try {
      panzerCore.updateParams(partial);
    } catch (err) {
      console.error('[!] ALERT :: Error updating parameters:', err);
    }
  }, []);

  const handleTogglePause = useCallback(() => {
    try {
      panzerCore.updateParams((prev) => ({
        ...prev,
        isPaused: !prev.isPaused,
      }));
    } catch (err) {
      console.error('[!] ALERT :: Error toggling pause:', err);
    }
  }, []);

  const handleTriggerChaffBurst = useCallback(() => {
    try {
      panzerCore.triggerChaffBurst(25);
    } catch (err) {
      console.error('[!] ALERT :: Error triggering chaff burst:', err);
    }
  }, []);

  const handleTriggerDpiProbe = useCallback(() => {
    try {
      panzerCore.triggerDpiProbe();
    } catch (err) {
      console.error('[!] ALERT :: Error triggering DPI probe:', err);
    }
  }, []);

  const handleSelectTab = useCallback((tab: TabId) => {
    setActiveTab(tab);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-panzer-darkest text-slate-100 selection:bg-panzer-cyan/30 selection:text-panzer-cyan pb-28">
      {/* Top Telemetry & Status Bar */}
      <HeaderStatus
        params={params}
        metrics={metrics}
        onSetPersona={handleSetPersona}
        onTogglePause={handleTogglePause}
      />

      {/* Main Tab Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        <AnimatePresence mode="wait">
          {activeTab === 'route' && (
            <TabSection key="tab-route">
              <RouteInspector />
            </TabSection>
          )}

          {activeTab === 'sim' && (
            <TabSection key="tab-sim">
              <PhysicsSimulator
                params={params}
                onUpdateParams={handleUpdateParams}
                onTriggerChaffBurst={handleTriggerChaffBurst}
                onTriggerDpiProbe={handleTriggerDpiProbe}
              />
            </TabSection>
          )}

          {activeTab === 'matrioszka' && (
            <TabSection key="tab-matrioszka">
              <MatrioszkaCascade />
            </TabSection>
          )}

          {activeTab === 'matrix' && (
            <TabSection key="tab-matrix">
              <AttackMatrix />
            </TabSection>
          )}

          {activeTab === 'defense' && (
            <TabSection key="tab-defense">
              <AuditDefense />
            </TabSection>
          )}
        </AnimatePresence>
      </main>

      {/* Floating Apple-Style Segmented Dock */}
      <FloatingNav activeTab={activeTab} onSelectTab={handleSelectTab} />
    </div>
  );
};

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else {
  console.error('[!] ALERT :: Element #root not found in document DOM.');
}
