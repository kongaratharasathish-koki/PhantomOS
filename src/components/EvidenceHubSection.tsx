import React, { useState } from "react";
import { VerificationTrace } from "../types.ts";
import { Activity, Clock, Fingerprint, Search, ShieldAlert, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface EvidenceHubSectionProps {
  traces: VerificationTrace[];
}

export default function EvidenceHubSection({ traces = [] }: EvidenceHubSectionProps) {
  const [filter, setFilter] = useState<'ALL' | 'SUCCESS' | 'VIOLATION'>('ALL');

  const filteredTraces = traces.filter(t => {
    if (filter === 'ALL') return true;
    if (filter === 'SUCCESS') return t.outcome === 'SUCCESS';
    return t.outcome === 'BLOCKED_GOVERNANCE' || t.outcome === 'QUARANTINED' || t.outcome === 'FAILURE';
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Activity className="text-indigo-500" size={16} />
            <h2 className="text-sm font-bold font-mono text-white uppercase tracking-widest">
              Audit Logs
            </h2>
          </div>
          <p className="text-[11px] text-neutral-500 font-sans">
            Real-time evidence of every intercepted agent action and governance verification.
          </p>
        </div>
        
        <div className="flex items-center gap-1 bg-neutral-900 border border-neutral-800 p-1 rounded-xl">
          {(['ALL', 'SUCCESS', 'VIOLATION'] as const).map((f) => (
            <button 
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-mono font-bold transition-all ${
                filter === f ? "bg-white text-black shadow-md" : "text-neutral-500 hover:text-neutral-300"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-neutral-950 border-b border-neutral-800">
                <th className="px-6 py-4 text-[10px] font-bold font-mono text-neutral-500 uppercase tracking-widest">Timestamp</th>
                <th className="px-6 py-4 text-[10px] font-bold font-mono text-neutral-500 uppercase tracking-widest">Outcome</th>
                <th className="px-6 py-4 text-[10px] font-bold font-mono text-neutral-500 uppercase tracking-widest">Evidence Hash</th>
                <th className="px-6 py-4 text-[10px] font-bold font-mono text-neutral-500 uppercase tracking-widest">Task Instruction</th>
                <th className="px-6 py-4 text-[10px] font-bold font-mono text-neutral-500 uppercase tracking-widest text-right">Verification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/50">
              {filteredTraces.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center text-neutral-600 italic font-mono text-xs">
                    No audit records match current filter.
                  </td>
                </tr>
              ) : (
                <AnimatePresence mode="popLayout">
                  {(filteredTraces || []).map((trace) => (
                    <motion.tr 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      key={trace.id} 
                      className="hover:bg-neutral-800/30 group transition-colors"
                    >
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2 text-neutral-500 font-mono text-[10px]">
                          <Clock size={12} className="text-neutral-600" />
                          {new Date(trace.timestamp).toLocaleTimeString()}
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold font-mono border ${
                          trace.outcome === 'SUCCESS' ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" :
                          trace.outcome === 'BLOCKED_GOVERNANCE' ? "bg-rose-500/10 text-rose-500 border-rose-500/20" :
                          "bg-amber-500/10 text-amber-500 border-amber-500/20"
                        }`}>
                          {trace.outcome}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2">
                            <Fingerprint size={12} className="text-neutral-600" />
                            <span className="text-[11px] font-mono font-bold text-neutral-300">{trace.capability_id}</span>
                          </div>
                          <span className="text-[8px] font-mono text-neutral-600 truncate max-w-[120px]">
                            {trace.hash || "NO_HASH_AVAILABLE"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex flex-col gap-1">
                          <p className="text-[11px] font-mono text-neutral-400 truncate max-w-[240px]" title={trace.task_description}>
                            {trace.task_description}
                          </p>
                          {trace.rejection_reason && (
                            <span className="text-[9px] font-mono text-rose-500/80 uppercase">
                              REASON: {trace.rejection_reason}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <div className="inline-flex items-center gap-2">
                          <span className={`text-[10px] font-mono font-bold ${
                            trace.shadow_agreement > 0.9 ? "text-emerald-500" : 
                            trace.shadow_agreement > 0.7 ? "text-amber-500" : "text-rose-500"
                          }`}>
                            {(trace.shadow_agreement * 100).toFixed(0)}%
                          </span>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
