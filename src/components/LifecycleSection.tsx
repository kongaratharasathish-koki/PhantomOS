import React, { useState } from "react";
import { Capability } from "../types.ts";
import { Command, HeartPulse, ShieldAlert, BadgeCheck, Play, Radio, Archive } from "lucide-react";

interface LifecycleSectionProps {
  capabilities: Capability[];
  onRestore: (id: string) => void;
}

export default function LifecycleSection({
  capabilities,
  onRestore
}: LifecycleSectionProps) {
  const [selectedCapId, setSelectedCapId] = useState<string | null>(null);

  const selectedCap = capabilities.find(c => c.id === selectedCapId) || capabilities[0];

  return (
    <div className="bg-white rounded-3xl border border-gray-200 p-6 space-y-6" id="lifecycle-section">
      <div>
        <div className="flex items-center gap-2">
          <HeartPulse size={16} className="text-rose-600" />
          <h2 className="text-sm font-bold font-mono text-neutral-800 uppercase tracking-widest">
            Durable Lifecycle Engine v0.3
          </h2>
        </div>
        <p className="text-xs text-gray-500 font-sans mt-1">
          State integrity controls. Transitioning is evidence-based and audit-backed. <strong>Humans restore capabilities</strong>; the platform handles garbage collection and quarantines defensively.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* State Map visualizer - Left Side */}
        <div className="lg:col-span-4 bg-neutral-50 rounded-2xl p-4 border border-gray-200 flex flex-col justify-between space-y-4">
          <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-gray-400">
            FSM Transition Logic:
          </span>
          
          <div className="space-y-2 text-xs font-mono">
            {/* Candidate state */}
            <div className="p-2.5 rounded-xl border bg-white border-indigo-200">
              <span className="font-bold text-indigo-700 block">Candidate</span>
              <p className="text-[10px] text-gray-400 mt-0.5 leading-snug">Trial runs. Waiting for Wilson Confidence index &gt; 85% to transition.</p>
            </div>

            <div className="text-center text-gray-300 font-black">↓</div>

            {/* Active state */}
            <div className="p-2.5 rounded-xl border bg-white border-emerald-200">
              <span className="font-bold text-emerald-700 block">Active</span>
              <p className="text-[10px] text-gray-400 mt-0.5 leading-snug">Pristine runtime bound. Continually processing inputs against contracts.</p>
            </div>

            <div className="text-center text-gray-300 font-black">↓</div>

            {/* Degraded state */}
            <div className="p-2.5 rounded-xl border bg-white border-amber-200">
              <span className="font-bold text-amber-700 block">Degraded</span>
              <p className="text-[10px] text-gray-400 mt-0.5 leading-snug">Success rate &lt; 90%. Confidence decay score rising. Marked for review.</p>
            </div>

            <div className="text-center text-gray-300 font-bold">↓↓ Breaker Trips ↓↓</div>

            {/* Quarantined state */}
            <div className="p-2.5 rounded-xl border bg-white border-rose-200 bg-rose-50/20">
              <span className="font-bold text-rose-700 block text-center">Quarantined (Sealed)</span>
              <p className="text-[10px] text-gray-400 mt-0.5 leading-snug text-center">Inhibited execution triggers. <strong>Only human operator audits can restore.</strong></p>
            </div>
          </div>
        </div>

        {/* Audit controls - Right Side */}
        <div className="lg:col-span-8 space-y-5">
          <span className="text-[10px] font-mono tracking-wider font-bold text-gray-400 block uppercase">
            Active Capability Sentinel List &amp; Live Restore Audit:
          </span>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {capabilities.map(cap => {
              const active = selectedCapId === cap.id || (!selectedCapId && cap.id === capabilities[0]?.id);
              return (
                <button
                  key={cap.id}
                  onClick={() => setSelectedCapId(cap.id)}
                  className={`p-3 rounded-xl border text-left transition text-xs font-sans ${
                    active 
                      ? "border-neutral-900 bg-neutral-900 text-white" 
                      : "border-gray-200 hover:bg-neutral-50 text-gray-700"
                  }`}
                >
                  <span className="block font-bold truncate">{cap.name}</span>
                  <span className={`inline-block mt-1 px-1 py-0.2 rounded text-[8px] font-mono font-bold leading-none ${
                    cap.status === "ACTIVE"
                      ? "bg-emerald-100 text-emerald-800"
                      : cap.status === "DEGRADED"
                      ? "bg-amber-100 text-amber-800"
                      : cap.status === "QUARANTINED"
                      ? "bg-rose-100 text-rose-800"
                      : "bg-indigo-100 text-indigo-800"
                  }`}>
                    {cap.status}
                  </span>
                </button>
              );
            })}
          </div>

          {selectedCap ? (
            <div className="border border-gray-200 rounded-2xl p-5 space-y-4">
              <div className="flex justify-between items-start gap-4">
                <div>
                  <h3 className="font-bold text-neutral-950 font-display text-sm">{selectedCap.name}</h3>
                  <span className="text-[10px] text-gray-400 font-mono">ID: {selectedCap.id} | Current SLA Version: {selectedCap.version}</span>
                </div>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-bold uppercase ${
                  selectedCap.status === "ACTIVE"
                    ? "bg-emerald-100 text-emerald-800"
                    : selectedCap.status === "DEGRADED"
                    ? "bg-amber-100 text-amber-800"
                    : selectedCap.status === "QUARANTINED"
                    ? "bg-rose-100 text-rose-800 animate-pulse"
                    : "bg-indigo-100 text-indigo-800"
                }`}>
                  {selectedCap.status}
                </span>
              </div>

              <p className="text-xs text-gray-500 leading-relaxed font-sans">{selectedCap.description}</p>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 bg-neutral-50 p-3 rounded-xl border border-gray-150 text-center font-mono text-[10px] text-gray-500">
                <div>
                  <span className="block text-gray-400">SUCCESS RATE</span>
                  <span className="font-bold text-gray-800 text-xs">{selectedCap.success_rate}%</span>
                </div>
                <div>
                  <span className="block text-gray-400">WILSON CONFIDENCE</span>
                  <span className="font-bold text-indigo-700 text-xs">{selectedCap.confidence}%</span>
                </div>
                <div>
                  <span className="block text-gray-400">HEALTH INDEX</span>
                  <span className="font-bold text-emerald-700 text-xs">{selectedCap.health_score}/100</span>
                </div>
              </div>

              {selectedCap.status !== "ACTIVE" ? (
                <div className="bg-amber-50/50 rounded-xl p-4 border border-amber-200/60 space-y-3">
                  <div className="text-xs text-amber-850 space-y-1.5 font-sans leading-relaxed">
                    <p className="font-bold flex items-center gap-1.5">
                      <ShieldAlert size={14} className="text-amber-800 shrink-0" />
                      Auditable Evidence:
                    </p>
                    <p>
                      This capability is flagged with <strong>{selectedCap.status}</strong> status. Wilson statistical limits dropped below bounds, and recent transactions recorded failures ({selectedCap.failure_modes.join(', ') || "No errors recorded"}). State has been sealed.
                    </p>
                  </div>
                  
                  <button
                    onClick={() => onRestore(selectedCap.id)}
                    className="w-full inline-flex items-center justify-center px-4 py-2 bg-indigo-650 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold select-none cursor-pointer duration-150"
                  >
                    <BadgeCheck size={14} className="mr-1.5" />
                    Manually Verify &amp; Restore to Active Pool
                  </button>
                </div>
              ) : (
                <div className="bg-emerald-50/30 rounded-xl p-4 border border-emerald-100 flex items-center gap-2 text-xs font-sans text-emerald-850">
                  <BadgeCheck size={16} className="text-emerald-700 shrink-0" />
                  <p>
                    This capability holds robust <strong>ACTIVE</strong> credentials and satisfies full contract constraints. No operator action required.
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-6 text-gray-400 font-mono text-xs">
              Load capabilities list to begin.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
