"use client";

import { useState, useEffect, useMemo } from 'react';
import { Battery, Zap, Clock, ShieldCheck, AlertTriangle } from 'lucide-react';
import { BatteryModel, calculateRequiredBatteries, calculateActualReserveHours } from '@/lib/battery-calc';

export default function Home() {
  const [models, setModels] = useState<BatteryModel[]>([]);
  const [selectedModelId, setSelectedModelId] = useState<string>('');
  
  // Inputs
  const [loadW, setLoadW] = useState<number>(500);
  const [reserveHours, setReserveHours] = useState<number>(24);
  const [deratingFactor, setDeratingFactor] = useState<number>(0.8);
  const [installedBatteries, setInstalledBatteries] = useState<number>(1);
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBatteries() {
      try {
        const res = await fetch('/api/batteries');
        if (!res.ok) {
          console.error('API error:', res.status, await res.text());
          return;
        }
        const data = await res.json();
        if (!Array.isArray(data)) {
          console.error('Unexpected API response:', data);
          return;
        }
        setModels(data);
        if (data.length > 0) {
          setSelectedModelId(data[0].id);
        }
      } catch (err) {
        console.error('Failed to fetch models:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchBatteries();
  }, []);

  const selectedModel = useMemo(() => {
    return models.find(m => m.id === selectedModelId);
  }, [models, selectedModelId]);

  // Calculations
  const calcResults = useMemo(() => {
    if (!selectedModel || !selectedModel.capacities || selectedModel.capacities.length === 0) return null;
    if (loadW <= 0 || reserveHours <= 0) return null;

    const sizing = calculateRequiredBatteries(loadW, reserveHours, selectedModel.capacities, deratingFactor);
    const reverse = calculateActualReserveHours(installedBatteries, loadW, selectedModel.capacities, deratingFactor);

    return { sizing, reverse };
  }, [selectedModel, loadW, reserveHours, deratingFactor, installedBatteries]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 font-sans selection:bg-blue-500/30">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center gap-3">
          <div className="p-2 bg-blue-500/20 rounded-xl">
            <Zap className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
              PowerCalc Pro
            </h1>
            <p className="text-xs text-gray-400">Battery Bank Sizing & Analysis</p>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12 grid lg:grid-cols-12 gap-8">
        
        {/* Input Configuration */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-gray-900 rounded-3xl p-8 border border-gray-800 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-32 bg-blue-500/5 rounded-full blur-3xl -mr-16 -mt-16 transition-all duration-700 group-hover:bg-blue-500/10"></div>
            
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-blue-400" />
              System Requirements
            </h2>

            <div className="space-y-5 relative z-10">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Battery Model</label>
                <select
                  value={selectedModelId}
                  onChange={(e) => setSelectedModelId(e.target.value)}
                  className="w-full bg-gray-950 border border-gray-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all appearance-none text-white"
                >
                  {models.map(m => (
                    <option key={m.id} value={m.id}>{m.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Constant Load (W)</label>
                  <div className="relative">
                    <input
                      type="number"
                      value={loadW}
                      onChange={(e) => setLoadW(Number(e.target.value))}
                      className="w-full bg-gray-950 border border-gray-700 rounded-xl px-4 py-3 pl-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-white"
                    />
                    <Zap className="w-4 h-4 text-gray-500 absolute left-4 top-4" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Autonomy (Hours)</label>
                  <div className="relative">
                    <input
                      type="number"
                      value={reserveHours}
                      onChange={(e) => setReserveHours(Number(e.target.value))}
                      className="w-full bg-gray-950 border border-gray-700 rounded-xl px-4 py-3 pl-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-white"
                    />
                    <Clock className="w-4 h-4 text-gray-500 absolute left-4 top-4" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Derating Factor</label>
                  <input
                    type="number"
                    step="0.05"
                    min="0.1"
                    max="1.0"
                    value={deratingFactor}
                    onChange={(e) => setDeratingFactor(Number(e.target.value))}
                    className="w-full bg-gray-950 border border-gray-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-white"
                  />
                  <p className="text-xs text-gray-500 mt-2">Default is 0.8 (80%)</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Proposed Installed</label>
                  <div className="relative">
                    <input
                      type="number"
                      value={installedBatteries}
                      onChange={(e) => setInstalledBatteries(Number(e.target.value))}
                      className="w-full bg-gray-950 border border-gray-700 rounded-xl px-4 py-3 pl-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-white"
                    />
                    <Battery className="w-4 h-4 text-gray-500 absolute left-4 top-4" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-7 space-y-6">
          {!calcResults ? (
            <div className="h-full flex items-center justify-center bg-gray-900/50 rounded-3xl border border-gray-800/50 border-dashed p-8">
              <p className="text-gray-500">Please enter valid load and reserve hours.</p>
            </div>
          ) : (
            <div className="grid gap-6 h-full">
              
              {/* Primary Sizing Result */}
              <div className="bg-gradient-to-br from-blue-900/40 to-cyan-900/20 rounded-3xl p-8 border border-blue-500/20 shadow-[0_0_40px_-15px_rgba(59,130,246,0.2)]">
                <h3 className="text-blue-400 font-medium mb-6 text-sm tracking-wide uppercase">Primary Sizing Analysis</h3>
                
                <div className="flex items-end justify-between mb-8">
                  <div>
                    <p className="text-gray-400 mb-1">Batteries Required</p>
                    <p className="text-6xl font-light text-white tracking-tight">
                      {calcResults.sizing.stringsNeeded}
                      <span className="text-2xl text-gray-500 ml-2">units</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-400 mb-1">Target</p>
                    <p className="text-2xl font-semibold text-white">{reserveHours} hrs</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-6 border-t border-blue-500/20">
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Total Energy Required</p>
                    <p className="font-mono text-lg text-blue-200">{calcResults.sizing.requiredWh.toLocaleString()} Wh</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Derated Capacity / Cell</p>
                    <p className="font-mono text-lg text-blue-200">{Math.round(calcResults.sizing.deratedWhPerCell).toLocaleString()} Wh</p>
                  </div>
                </div>

                {calcResults.sizing.isExtrapolating && (
                  <div className="mt-6 flex items-start gap-3 bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 text-yellow-400 text-sm">
                    <AlertTriangle className="w-5 h-5 shrink-0" />
                    <p>The requested reserve hours fall outside the standard manufacturer discharge table. Values are extrapolated and may not be accurate.</p>
                  </div>
                )}
              </div>

              {/* Reverse Check Result */}
              <div className="bg-gray-900 rounded-3xl p-8 border border-gray-800 shadow-xl">
                <h3 className="text-gray-400 font-medium mb-6 text-sm tracking-wide uppercase">Reverse Validation Check</h3>
                
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-gray-400 mb-1">Achieved Reserve at Proposed</p>
                    <div className="flex items-baseline gap-2">
                      <p className="text-5xl font-light text-white tracking-tight">
                        {calcResults.reverse.actualReserveHours.toFixed(1)}
                      </p>
                      <span className="text-xl text-gray-500">hours</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-400 mb-1">Installed</p>
                    <p className="text-xl font-semibold text-white">{installedBatteries} units</p>
                  </div>
                </div>

                {calcResults.reverse.isExtrapolating && (
                  <div className="mt-6 flex items-start gap-3 bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 text-yellow-400 text-sm">
                    <AlertTriangle className="w-5 h-5 shrink-0" />
                    <p>The resulting duration falls outside the manufacturer discharge table range. Values are extrapolated.</p>
                  </div>
                )}
              </div>

            </div>
          )}
        </div>
      </main>
    </div>
  );
}
