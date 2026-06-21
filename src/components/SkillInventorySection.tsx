import React, { useState } from "react";
import { Capability } from "../types.ts";
import { Play, TrendingUp, AlertTriangle, ShieldCheck, Heart, Trash2, Milestone, Clock, Database, Lock, AlertOctagon, HelpCircle } from "lucide-react";

interface SkillInventorySectionProps {
  capabilities: Capability[];
  onExecuteTrial: (id: string, task: string, forceFail: boolean, failType: string) => void;
  isSimulating: boolean;
}

export default function SkillInventorySection({
  capabilities,
  onExecuteTrial,
  isSimulating
}: SkillInventorySectionProps) {
  const [selectedCapId, setSelectedCapId] = useState<string | null>(null);
  const [customTask, setCustomTask] = useState("");
  const [injectFail, setInjectFail] = useState(false);
  const [failType, setFailType] = useState("Schema Mismatch");

  const visibleCapabilities = capabilities.filter(c => c.status !== "ARCHIVED");
  const selectedCap = visibleCapabilities.find(c => c.id === selectedCapId) || visibleCapabilities[0];

  const handleRun = () => {
    if (!selectedCap) return;
    const task = customTask.trim() || `Automated SLA verification check on: ${selectedCap.name}.`;
    onExecuteTrial(selectedCap.id, task, injectFail, failType);
    setCustomTask("");
  };

  return (
    <div className="space-y-6" id="skill-inventory-section">
      <div className="bg-white rounded-3xl border border-gray-200 p-6 space-y-4 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <TrendingUp size={16} className="text-neutral-900" />
            <h2 className="text-sm font-bold font-mono text-neutral-800 uppercase tracking-widest">
              Verified Capability Inventory &mdash; Bayesian Trust Gate
            </h2>
          </div>
          <p className="text-xs text-gray-500 font-sans mt-0.5">
            Browse active organization capabilities, witness Bayesian credible lower limits, and run verification probes.
          </p>
        </div>

        {/* Dynamic List */}
        <div className="overflow-x-auto border border-gray-200 rounded-2xl">
          <table className="min-w-full divide-y divide-gray-200 text-left text-xs font-sans">
            <thead className="bg-neutral-50 text-[10px] uppercase font-mono text-gray-400 font-bold tracking-wider">
              <tr>
                <th className="px-6 py-3">Capability / Contract Name</th>
                <th className="px-6 py-3">Bayesian Class</th>
                <th className="px-6 py-3">Beta Successes</th>
                <th className="px-6 py-3">Bayesian Confidence Bounds</th>
                <th className="px-6 py-3">Rollback &amp; Decay</th>
                <th className="px-6 py-3">SLA Metrics</th>
                <th className="px-6 py-3">Health score</th>
                <th className="px-6 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {visibleCapabilities.length > 0 ? (
                visibleCapabilities.map(cap => {
                  const isSelected = selectedCap?.id === cap.id;
                  
                  // Bayesian Trust indicators
                  const tClass = cap.trust_class || "TRUSTED";
                  const postConf = cap.posterior_confidence || cap.success_rate;
                  const lowerBound = cap.lower_confidence_bound || cap.lowerBound;
                  const upperBound = cap.upperBound;
                  const decay = cap.confidence_decay || 0.1;

                  return (
                    <tr 
                      key={cap.id}
                      onClick={() => setSelectedCapId(cap.id)}
                      className={`hover:bg-neutral-50/50 cursor-pointer transition ${
                        isSelected ? "bg-indigo-50/20" : ""
                      }`}
                    >
                      {/* Name/ID */}
                      <td className="px-6 py-4">
                        <span className="font-semibold text-gray-950 block">{cap.name}</span>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-[9px] text-gray-450 font-mono">ID: {cap.id}</span>
                          <span className="text-gray-300">•</span>
                          <span className="text-[9px] text-indigo-700 font-mono font-bold bg-indigo-50 px-1 rounded">SLA v{cap.version}</span>
                        </div>
                      </td>

                      {/* Bayesian Trust Class */}
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-[9px] font-mono font-extrabold leading-none uppercase border ${
                          tClass === "TRUSTED"
                            ? "bg-emerald-50 text-emerald-800 border-emerald-250"
                            : tClass === "WATCHLIST"
                            ? "bg-indigo-50 text-indigo-800 border-indigo-250 animate-pulse"
                            : tClass === "DEGRADED"
                            ? "bg-amber-50 text-amber-800 border-amber-250"
                            : "bg-rose-50 text-rose-800 border-rose-250 animate-pulse"
                        }`}>
                          {tClass}
                        </span>
                        <span className="block text-[8px] text-gray-400 font-mono mt-1 font-bold">STATUS: {cap.status}</span>
                      </td>

                      {/* Beta Successes */}
                      <td className="px-6 py-4 font-mono text-[11px] leading-tight">
                        <span className="font-bold text-gray-950">{cap.successes !== undefined ? cap.successes : cap.successCount} / {cap.failures !== undefined ? cap.failures : cap.failureCount}</span>
                        <span className="block text-[9px] text-gray-400 font-medium">N_eff: {cap.effectiveSampleSize} uses</span>
                      </td>

                      {/* Bayesian Credible Bounds */}
                      <td className="px-6 py-4 font-mono text-[11px] leading-tight">
                        <span className="text-indigo-800 font-extrabold text-xs block">{postConf}%</span>
                        <span className="text-gray-450 text-[9px] block">Bound: &ge; {lowerBound}%</span>
                      </td>

                      {/* Rollback & Decay */}
                      <td className="px-6 py-4 font-mono text-[11px] leading-tight">
                        <span className="text-rose-700 font-semibold block">{cap.rollback_rate}% Rollback</span>
                        <span className="text-gray-400 text-[9px] block">Decay penalty: {decay}</span>
                      </td>

                      {/* SLA metrics */}
                      <td className="px-6 py-4 text-gray-500 font-mono text-[11px] leading-tight">
                        <span>{cap.average_time_seconds}s latency</span>
                        <span className="block text-emerald-700 font-bold">${cap.average_cost.toFixed(3)} execution</span>
                      </td>

                      {/* Health bar */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5">
                          <span className={`font-mono font-bold text-xs ${
                            cap.health_score > 80 
                              ? "text-emerald-700" 
                              : cap.health_score > 50 
                              ? "text-amber-700" 
                              : "text-rose-700"
                          }`}>{cap.health_score}</span>
                          <div className="w-12 h-1.5 bg-gray-150 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full transition-all duration-300 ${
                                cap.health_score > 80 
                                  ? "bg-emerald-500" 
                                  : cap.health_score > 50 
                                  ? "bg-amber-500" 
                                  : "bg-rose-500"
                              }`} 
                              style={{ width: `${cap.health_score}%` }} 
                            />
                          </div>
                        </div>
                      </td>

                      {/* Selection Focus */}
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedCapId(cap.id);
                          }}
                          className={`inline-flex items-center px-2 py-1 rounded-lg border text-[10px] font-mono uppercase tracking-wider font-extrabold select-none transition cursor-pointer ${
                            isSelected 
                              ? "bg-neutral-900 text-white border-neutral-900 shadow-sm" 
                              : "bg-white text-gray-700 border-gray-250 hover:bg-neutral-50"
                          }`}
                        >
                          Focus
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-xs font-mono text-gray-400">
                    No active capabilities registered. Reset database or add candidates!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manual Verification Probe Testing Playground */}
      {selectedCap && (
        <div className="bg-white rounded-3xl border border-gray-200 p-6 space-y-4 shadow-xs font-sans" id="trial-playground">
          <div className="border-b border-gray-150 pb-3">
            <h3 className="text-xs font-bold font-mono uppercase tracking-widest text-neutral-800 flex items-center gap-1.5">
              <Play size={13} className="text-indigo-600 shrink-0" />
              Dynamic Verification Trial Console: {selectedCap.name}
            </h3>
            <p className="text-[11px] text-gray-400 mt-0.5">
              Launch manual verification tests on this capability. Monitor if contracts are satisfied or if defensive circuit breakers trip under failure scenarios.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-8 space-y-3">
              <div>
                <label className="block text-[10px] font-mono uppercase font-bold text-gray-400 mb-1.5">
                  1. Enter Trial Context / Instructions (Optional):
                </label>
                <input 
                  type="text"
                  value={customTask}
                  onChange={(e) => setCustomTask(e.target.value)}
                  placeholder={`e.g. Test safe rootless configuration boundaries in node-42b after systemd logs reload.`}
                  className="w-full text-xs bg-neutral-50 px-3 py-2.5 rounded-xl border border-gray-250 focus:outline-hidden focus:ring-1 focus:ring-indigo-500 font-sans"
                />
              </div>

              {/* Advanced Injection Controls */}
              <div className="bg-neutral-50/60 p-4 rounded-xl border border-gray-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-[11px] font-bold text-gray-950 block">Defensive Injection Mode</span>
                    <span className="text-[10px] text-gray-405 font-mono block">Deliberately inject failures to observe Breaker popping!</span>
                  </div>
                  <button
                    onClick={() => setInjectFail(!injectFail)}
                    id="toggle-inject-fail"
                    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-hidden ${
                      injectFail ? "bg-amber-500" : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ${
                        injectFail ? "translate-x-4" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>

                {injectFail && (
                  <div className="pt-2 border-t border-gray-200">
                    <label className="block text-[10px] font-mono font-bold text-gray-450 mb-1.5">
                      Select Failure Vector to Inject:
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-[10px]" id="failure-vectors-grid">
                      {[
                        "Schema Mismatch", 
                        "SELinux Context", 
                        "Goal Hijacking", 
                        "Memory Poisoning",
                        "Token Exhaustion",
                        "Latency Spike",
                        "Cost Spike",
                        "Semantic Failure"
                      ].map((t) => (
                        <button
                          key={t}
                          onClick={() => setFailType(t)}
                          id={`vector-btn-${t.toLowerCase().replace(/\s+/g, '-')}`}
                          className={`p-2 rounded-lg border text-left transition font-mono ${
                            failType === t 
                              ? "bg-amber-100 text-amber-800 border-amber-300 font-bold" 
                              : "bg-white text-gray-600 border-gray-205 hover:bg-neutral-50"
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="md:col-span-4 bg-neutral-50 rounded-2xl p-4 border border-gray-200 flex flex-col justify-between">
              <div className="space-y-1 text-xs">
                <span className="text-[10px] text-gray-400 font-mono block font-bold uppercase">CAPABILITY FOCUS:</span>
                <span className="font-bold block text-gray-900">{selectedCap.name}</span>
                <span className="text-[10px] font-mono text-gray-400 font-bold block mt-1.5 uppercase font-semibold">BAYES DIAGRAM:</span>
                
                <div className="space-y-1 text-[10px] font-mono text-gray-500">
                  <div className="flex justify-between">
                    <span>Posterior Trust:</span>
                    <span className="font-extrabold text-indigo-700">{(selectedCap.posterior_confidence || selectedCap.success_rate)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Bayesian Limit:</span>
                    <span className="font-bold text-purple-700">{(selectedCap.lower_confidence_bound || selectedCap.lowerBound)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Health Score:</span>
                    <span className="font-bold">{selectedCap.health_score}/100</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Uses:</span>
                    <span className="font-bold">{selectedCap.total_uses} trials</span>
                  </div>
                </div>
              </div>

              <button
                disabled={isSimulating}
                onClick={handleRun}
                id="btn-run-trial"
                className="w-full mt-4 bg-neutral-950 hover:bg-neutral-850 text-white rounded-xl py-2 px-4 text-xs font-semibold select-none cursor-pointer duration-150 inline-flex items-center justify-center disabled:opacity-50"
              >
                <Play size={13} className="mr-1.5 fill-white text-white" />
                <span>Run Trial Verification</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
