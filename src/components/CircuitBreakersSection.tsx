import React, { useState } from "react";
import { CircuitBreaker, Capability } from "../types.ts";
import { Command, HelpCircle, ShieldAlert, Sparkles, AlertOctagon, RefreshCw, Layers, ArrowRight, Zap } from "lucide-react";

interface CircuitBreakersSectionProps {
  breakers: CircuitBreaker[];
  capabilities: Capability[];
  onTriggerFailure: (capabilityId: string, failureType: string) => void;
  onRestore: (capabilityId: string) => void;
  isSimulating: boolean;
}

export default function CircuitBreakersSection({
  breakers,
  capabilities,
  onTriggerFailure,
  onRestore,
  isSimulating
}: CircuitBreakersSectionProps) {
  const [selectedBreakerId, setSelectedBreakerId] = useState<string | null>(null);

  const getCapabilityName = (id: string) => {
    const found = capabilities.find(c => c.id === id);
    return found ? found.name : id;
  };

  const activeBreaker = breakers.find(b => b.id === selectedBreakerId) || breakers[0];

  return (
    <div className="bg-white rounded-3xl border border-gray-200 p-6 space-y-6" id="circuit-breaker-section">
      
      {/* Title Header */}
      <div className="border-b border-gray-150 pb-4">
        <div className="flex items-center gap-2">
          <AlertOctagon size={16} className="text-amber-600 font-bold" />
          <h2 className="text-sm font-bold font-mono text-neutral-800 uppercase tracking-widest">
            Defensive Circuit Breaker Sentinels
          </h2>
        </div>
        <p className="text-xs text-gray-500 font-sans mt-1">
          Each capability is isolated by automated circuit breakers. When schema mismatches, SELinux denials, or token explosions hit bounds, the breaker trips to <strong>OPEN</strong>: locking down the capability, triggering fallback pipelines, and escalating to humans.
        </p>
      </div>

      {/* MAGNIFICENT DYNAMIC STATE MACHINE VISUALIZER */}
      {activeBreaker && (
        <div className="p-5 bg-neutral-900 rounded-2xl border border-neutral-800 text-neutral-100 space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-2.5">
            <div>
              <span className="text-[9px] font-mono text-indigo-400 font-extrabold uppercase tracking-wider block">Flow Overwatch State Machine:</span>
              <strong className="text-xs font-mono text-white">{getCapabilityName(activeBreaker.capability_id)}</strong>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-gray-400">STATE:</span>
              <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase ${
                activeBreaker.state === "CLOSED"
                  ? "bg-emerald-900/60 text-emerald-300 border border-emerald-800"
                  : activeBreaker.state === "HALF-OPEN"
                  ? "bg-amber-900/60 text-amber-300 border border-amber-800 animate-pulse"
                  : "bg-red-900/60 text-red-300 border border-red-800 animate-pulse"
              }`}>
                {activeBreaker.state}
              </span>
            </div>
          </div>

          {/* Interactive Flow Diagram */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center py-2 h-auto md:h-28">
            {/* 1. Request Entry Port */}
            <div className="md:col-span-3 text-center p-3 rounded-xl bg-neutral-950 border border-neutral-850 font-mono text-[10px]">
              <span className="text-gray-500 block uppercase font-bold">API Ingress</span>
              <span className="text-indigo-400 font-semibold text-[9px] block leading-none mt-1 animate-pulse">● Live Traffic</span>
              <span className="text-[9px] text-gray-405 block mt-0.5">Payload incoming</span>
            </div>

            {/* 2. Transitioning Vector Line */}
            <div className="hidden md:flex md:col-span-1 justify-center">
              <ArrowRight size={16} className="text-neutral-700 font-black animate-pulse" />
            </div>

            {/* 3. The Breaker FSM Guard Node */}
            <div className="md:col-span-4 text-center p-3.5 rounded-xl border relative overflow-hidden bg-neutral-950/70 border-neutral-800">
              {/* Conditional background pulse glow */}
              <div className={`absolute inset-0 opacity-10 filter blur-xl ${
                activeBreaker.state === "CLOSED" ? "bg-emerald-500" : activeBreaker.state === "HALF-OPEN" ? "bg-amber-500" : "bg-red-500"
              }`} />

              <span className="text-gray-505 block uppercase font-mono text-[9px] font-bold">SENTINEL SWITCH</span>
              
              <div className="flex items-center justify-center gap-1.5 mt-2">
                <span className={`h-2.5 w-2.5 rounded-full ${
                  activeBreaker.state === "CLOSED" ? "bg-emerald-500 animate-ping" : "bg-neutral-750"
                }`} title="CLOSED" />
                <span className={`h-2.5 w-2.5 rounded-full ${
                  activeBreaker.state === "HALF-OPEN" ? "bg-amber-500 animate-bounce" : "bg-neutral-750"
                }`} title="HALF-OPEN" />
                <span className={`h-2.5 w-2.5 rounded-full ${
                  activeBreaker.state === "OPEN" ? "bg-red-500 animate-ping" : "bg-neutral-750"
                }`} title="OPEN" />
              </div>

              <span className="text-[9px] text-gray-400 block mt-1 font-mono uppercase tracking-wider">
                {activeBreaker.state === "CLOSED" ? "Safe Passage Asserted" : activeBreaker.state === "HALF-OPEN" ? "Canary Testing Route" : "CRITICAL SHIELD ACTIVATED"}
              </span>
            </div>

            {/* 4. Selector Line */}
            <div className="hidden md:flex md:col-span-1 justify-center">
              <ArrowRight size={16} className="text-neutral-700 font-black animate-pulse" />
            </div>

            {/* 5. Destination Endpoint Port */}
            <div className="md:col-span-3 text-center p-3 rounded-xl bg-neutral-950 border border-neutral-850 font-mono text-[10.5px]">
              {activeBreaker.state !== "OPEN" ? (
                <>
                  <span className="text-emerald-450 font-bold block uppercase text-[9px]">COMPLIANCE PORT</span>
                  <span className="font-medium text-white truncate block mt-0.5">{getCapabilityName(activeBreaker.capability_id)}</span>
                  <span className="text-[8px] text-gray-500 block leading-tight">State: {activeBreaker.state}</span>
                </>
              ) : (
                <>
                  <span className="text-red-400 font-semibold block uppercase text-[9px] animate-pulse">● FALLBACK RE-ROUTE</span>
                  <span className="font-medium text-gray-300 truncate block mt-0.5">TLS Core Fallback</span>
                  <span className="text-[8px] text-red-500 block leading-tight font-bold">Quarantine Triggered</span>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Grid of Active Circuit Monitors */}
      <div className="space-y-4">
        <span className="text-[10px] font-mono tracking-wider font-bold text-gray-400 block uppercase">
          Sentinel overwatch ports:
        </span>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="sentinel-list">
          {breakers.map(cb => {
            const cap = capabilities.find(c => c.id === cb.capability_id);
            const fallbackCap = capabilities.find(c => c.id === cb.fallback_skill_id);
            const isSelected = cb.id === activeBreaker.id;

            return (
              <div 
                key={cb.id}
                onClick={() => setSelectedBreakerId(cb.id)}
                className={`bg-white border text-left rounded-2xl p-5 space-y-4 flex flex-col justify-between transition cursor-pointer ${
                  isSelected ? "border-neutral-900 ring-2 ring-neutral-950/5 shadow-md bg-neutral-50/20" : "border-gray-200 hover:bg-neutral-50/50"
                }`}
                id={`breaker-card-${cb.id}`}
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2.5">
                    <div>
                      <h3 className="font-bold font-mono text-gray-950 text-sm">{getCapabilityName(cb.capability_id)}</h3>
                      <span className="text-[9px] text-gray-400 font-mono block">Breaker Port Reference: {cb.id}</span>
                    </div>

                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase shrink-0 ${
                      cb.state === "CLOSED"
                        ? "bg-emerald-100 text-emerald-800"
                        : cb.state === "HALF-OPEN"
                        ? "bg-amber-100 text-amber-800"
                        : "bg-red-100 text-red-800 animate-pulse"
                    }`}>
                      {cb.state}
                    </span>
                  </div>

                  {/* Monitors */}
                  <div className="flex items-center gap-1.5 flex-wrap text-[9.5px] font-mono">
                    <span className="text-gray-450 block uppercase font-bold text-[8.5px]">MONITORING VECTORS:</span>
                    {cb.monitored_failure_types.map(f => (
                      <span key={f} className="bg-neutral-100 text-neutral-800 px-1.5 py-0.2 rounded">
                        {f}
                      </span>
                    ))}
                  </div>

                  {/* Consecutive failures bar tracker */}
                  <div className="space-y-1 text-[10.5px] font-mono border-b border-gray-100 pb-2.5">
                    <div className="flex justify-between font-mono">
                      <span className="text-gray-400">Consecutive Failures:</span>
                      <span className={`font-bold ${cb.current_consecutive_failures > 0 ? "text-red-650" : "text-gray-500"}`}>
                        {cb.current_consecutive_failures} / {cb.threshold_failures} Max limit
                      </span>
                    </div>
                    {/* Visual failure pegs */}
                    <div className="flex gap-1 h-2 rounded-md overflow-hidden bg-neutral-100 border border-gray-150 p-0.5">
                      {Array.from({ length: cb.threshold_failures }).map((_, idx) => (
                        <div 
                          key={idx}
                          className={`flex-1 rounded-md transition ${
                            idx < cb.current_consecutive_failures 
                              ? "bg-red-500 animate-pulse" 
                              : "bg-gray-200"
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* V0.4 DETAILED MONITORED TELEMETRY COUNTS GRID */}
                  <div className="space-y-1.5 font-mono text-[9px] text-gray-500">
                    <span className="block font-bold text-gray-400 uppercase tracking-widest text-[8px]">Lifetime Sentinel Telemetry Counts</span>
                    <div className="grid grid-cols-2 gap-1.5 bg-neutral-50 p-2.5 rounded-xl border border-gray-150">
                      <div className="flex justify-between border-b border-gray-200 pb-0.5">
                        <span>Schema Violations:</span>
                        <strong className="text-neutral-800">{cb.schema_violations_count || 0}</strong>
                      </div>
                      <div className="flex justify-between border-b border-gray-200 pb-0.5">
                        <span>Semantic Failures:</span>
                        <strong className="text-neutral-800">{cb.semantic_failures_count || 0}</strong>
                      </div>
                      <div className="flex justify-between border-b border-gray-200 pb-0.5">
                        <span>Malformed Output:</span>
                        <strong className="text-neutral-800">{cb.malformed_outputs_count || 0}</strong>
                      </div>
                      <div className="flex justify-between border-b border-gray-200 pb-0.5">
                        <span>SELinux Block:</span>
                        <strong className="text-neutral-800">{cb.monitored_failure_types.includes("SELinux Context") ? 2 : 0}</strong>
                      </div>
                      <div className="flex justify-between border-b border-gray-200 pb-0.5">
                        <span>Token Explosions:</span>
                        <strong className="text-neutral-800">{cb.token_explosions_count || 0}</strong>
                      </div>
                      <div className="flex justify-between border-b border-gray-200 pb-0.5">
                        <span>Latency Spikes:</span>
                        <strong className="text-neutral-800">{cb.latency_spikes_count || 0}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Budget Spikes:</span>
                        <strong className="text-neutral-800">{cb.cost_spikes_count || 0}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Success count:</span>
                        <strong className="text-emerald-700">{cap ? cap.successCount : 0}</strong>
                      </div>
                    </div>
                  </div>

                  {/* V0.6 AI-AWARE SENTINEL METRICS */}
                  <div className="space-y-1 font-mono text-[9px] text-gray-500">
                    <span className="block font-bold text-gray-400 uppercase tracking-widest text-[8px]">AI-Aware State Escalations (v0.6)</span>
                    <div className="grid grid-cols-2 gap-1.5 bg-neutral-950 text-neutral-300 p-2.5 rounded-xl border border-neutral-800">
                      <div className="flex justify-between border-b border-neutral-850 pb-0.5">
                        <span>Sentinel Trip Rate:</span>
                        <strong className="text-red-400">{cb.trip_count !== undefined ? cb.trip_count : 2} triggers</strong>
                      </div>
                      <div className="flex justify-between border-b border-neutral-850 pb-0.5">
                        <span>Recovery Canaries:</span>
                        <strong className="text-emerald-400">{cb.recovery_count !== undefined ? cb.recovery_count : 1} resets</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Avg Open Duration:</span>
                        <strong className="text-neutral-250">{cb.average_open_duration !== undefined ? cb.average_open_duration : 45}s cooldown</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Fallback Traffic:</span>
                        <strong className="text-indigo-300">{cb.fallback_usage !== undefined ? cb.fallback_usage : 4} routings</strong>
                      </div>
                    </div>
                  </div>

                  {/* Fallback configuration tag link */}
                  {cb.state === "OPEN" && (
                    <div className="bg-rose-50 border border-rose-300 rounded-xl p-3 text-[10.5px] font-mono leading-relaxed text-rose-900 animate-pulse space-y-1">
                      <div className="font-extrabold flex items-center gap-1">
                        <Zap size={11} className="text-rose-700 animate-bounce" />
                        <span>[AGENT FROZEN - SYSTEM SHIELD ACTIVE]</span>
                      </div>
                      <p className="font-sans text-[10px] text-rose-800 leading-normal">
                        All autonomous execution on this node is halted. Ingress traffic is currently routed to fallback to maintain SLA. Resuming requires physical operator signature below.
                      </p>
                    </div>
                  )}

                  <div className="bg-neutral-50 px-3 py-2 rounded-xl border border-gray-150 flex items-center justify-between text-[11px] font-sans text-gray-650">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <Layers size={13} className="text-gray-400 shrink-0" />
                      <span className="truncate">Active Fallback Skill:</span>
                    </div>
                    <span className="font-semibold text-neutral-800 truncate pl-2 font-mono">
                      {fallbackCap ? fallbackCap.name : "System TLS Authority Handshake fallback"}
                    </span>
                  </div>
                </div>

                {/* Operations trigger */}
                <div className="flex gap-2 pt-3 border-t border-gray-100 font-mono text-[10px]">
                  {cb.state === "OPEN" ? (
                    <button
                      disabled={isSimulating}
                      onClick={(e) => {
                        e.stopPropagation();
                        onRestore(cb.capability_id);
                      }}
                      className="w-full inline-flex items-center justify-center py-2 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 font-bold rounded-xl cursor-pointer"
                    >
                      <RefreshCw size={11} className="mr-1.5 animate-spin-hover" />
                      Perform Audit &amp; Reset Breaker (Half-Open)
                    </button>
                  ) : (
                    <div className="grid grid-cols-2 gap-2 w-full">
                      <button
                        disabled={isSimulating}
                        onClick={(e) => {
                          e.stopPropagation();
                          onTriggerFailure(cb.capability_id, cb.monitored_failure_types[0] || "Schema Mismatch");
                        }}
                        className="py-2 bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 font-bold rounded-xl cursor-pointer text-center"
                      >
                        ⚡ Trigger Failure
                      </button>
                      <button
                        disabled={isSimulating}
                        onClick={(e) => {
                          e.stopPropagation();
                          onTriggerFailure(cb.capability_id, "Context Overflow");
                        }}
                        className="py-2 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-700 font-bold rounded-xl cursor-pointer text-center"
                      >
                        💥 Context Overflow
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
