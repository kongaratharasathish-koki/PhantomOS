import React, { useState } from "react";
import { VerificationTrace, Capability } from "../types.ts";
import { Activity, Clock, ChevronDown, ChevronUp, CheckCircle2, XCircle, ShieldCheck, AlertOctagon, HelpCircle } from "lucide-react";

interface TraceViewerProps {
  traces: VerificationTrace[];
  capabilities: Capability[];
}

export default function TraceViewer({ traces, capabilities }: TraceViewerProps) {
  const [expandedTraceId, setExpandedTraceId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedTraceId(expandedTraceId === id ? null : id);
  };

  const getCapabilityName = (id: string) => {
    const found = capabilities.find(c => c.id === id);
    return found ? found.name : "System Handshake Cluster";
  };

  return (
    <div className="bg-white rounded-3xl border border-gray-200 shadow-xs overflow-hidden" id="trace-viewer-container">
      <div className="bg-neutral-900 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity size={18} className="text-white" />
          <h2 className="text-sm font-semibold font-mono text-white uppercase tracking-wider">
            Real-time Verification Traces &amp; Auditing
          </h2>
        </div>
        <span className="text-xs bg-indigo-500 text-neutral-950 font-mono font-bold px-2 py-0.5 rounded-full animate-pulse">
          Monitoring Active
        </span>
      </div>

      <div className="p-6 space-y-4">
        <p className="text-xs text-gray-500 font-sans leading-relaxed">
          Operational tracing validates capability trials. Click on any log entry to inspect the behavioral validation sequence: <span className="font-semibold text-neutral-800">Task Ingestion ➔ Contract Preconditions ➔ Breaker Sentinel Check ➔ Trial Run execution ➔ Contract Postconditions verified ➔ Telemetry recalculation</span>.
        </p>

        <div className="space-y-3" id="trace-log-list">
          {traces.length > 0 ? (
            traces.map(trace => {
              const isExpanded = expandedTraceId === trace.id;
              const outcome = trace.outcome;
              const capName = getCapabilityName(trace.capability_id);

              return (
                <div 
                  key={trace.id}
                  className="border border-gray-200 rounded-2xl overflow-hidden transition bg-white"
                  id={`trace-card-${trace.id}`}
                >
                  {/* Row clicker */}
                  <div 
                    onClick={() => toggleExpand(trace.id)}
                    className="p-4 cursor-pointer hover:bg-neutral-50/60 flex items-center justify-between gap-4 flex-wrap"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {outcome === "SUCCESS" && (
                        <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                      )}
                      {outcome === "FAILURE" && (
                        <XCircle size={16} className="text-rose-600 shrink-0" />
                      )}
                      {outcome === "QUARANTINED" && (
                        <AlertOctagon size={16} className="text-amber-500 shrink-0 animate-pulse" />
                      )}
                      {outcome === "REROUTED_FALLBACK" && (
                        <HelpCircle size={16} className="text-indigo-600 shrink-0" />
                      )}
                      
                      <div className="space-y-0.5 min-w-0">
                        <span className="text-xs font-bold text-gray-950 block truncate font-display">
                          {trace.task_description}
                        </span>
                        <div className="flex items-center gap-2 text-[10px] font-mono text-gray-400">
                          <span className="text-indigo-700 font-bold bg-indigo-50/50 px-1 rounded">{capName}</span>
                          <span>•</span>
                          <span>Trace ID: {trace.id}</span>
                          <span>•</span>
                          <span>{new Date(trace.timestamp).toLocaleTimeString()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className={`inline-flex items-center px-1.5 py-0.5 rounded font-mono font-bold text-[9px] ${
                        outcome === "SUCCESS" 
                          ? "bg-emerald-100 text-emerald-800" 
                          : outcome === "FAILURE"
                          ? "bg-rose-100 text-rose-800"
                          : outcome === "QUARANTINED"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-indigo-100 text-indigo-800 font-mono"
                      }`}>
                        {outcome}
                      </span>
                      {isExpanded ? <ChevronUp size={14} className="text-gray-400" /> : <ChevronDown size={14} className="text-gray-400" />}
                    </div>
                  </div>

                  {/* Flow chart step expansions */}
                  {isExpanded && (
                    <div className="bg-neutral-50/60 p-5 border-t border-gray-100 space-y-4">
                      <span className="block text-[10px] font-bold text-gray-450 uppercase tracking-wider font-mono">
                        Verification Pipeline Stages:
                      </span>

                      {/* Visual flowchart */}
                      <div className="relative pl-6 space-y-4 text-xs font-sans">
                        {/* vertical line segment */}
                        <div className="absolute left-2.5 top-1.5 bottom-1.5 w-0.5 bg-gray-200 border-dashed" />

                        {/* Step 1: Ingest */}
                        <div className="relative">
                          <span className="absolute -left-5 h-3.5 w-3.5 rounded-full bg-white border-2 border-neutral-900 flex items-center justify-center font-mono text-[8px] font-bold">1</span>
                          <div>
                            <span className="font-bold text-[10px] text-gray-400 uppercase tracking-wider font-mono block">Ingress request validation</span>
                            <p className="text-gray-700 mt-0.5">Dispatched query target: <span className="font-mono font-semibold">"{trace.task_description}"</span></p>
                          </div>
                        </div>

                        {/* Step 2: Contract preconditions */}
                        <div className="relative">
                          <span className="absolute -left-5 h-3.5 w-3.5 rounded-full bg-white border-2 border-neutral-900 flex items-center justify-center font-mono text-[8px] font-bold">2</span>
                          <div>
                            <span className="font-bold text-[10px] text-gray-400 uppercase tracking-wider font-mono block">Behavioral Contract preconditions</span>
                            {trace.contract_verified ? (
                              <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-100 text-emerald-850 px-2 py-0.2 rounded font-mono font-bold mt-0.5">
                                <ShieldCheck size={11} className="text-emerald-700 font-bold" /> PRECONDITIONS VERIFIED: Input Schema Matches Specification
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[10px] bg-rose-100 text-rose-850 px-2 py-0.2 rounded font-mono font-bold mt-0.5">
                                <AlertOctagon size={11} className="text-rose-700 font-bold" /> REJECTED: Input Schema / Precondition violation or locked state.
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Step 3: Sentinel Breaker */}
                        <div className="relative">
                          <span className="absolute -left-5 h-3.5 w-3.5 rounded-full bg-white border-2 border-neutral-900 flex items-center justify-center font-mono text-[8px] font-bold">3</span>
                          <div>
                            <span className="font-bold text-[10px] text-gray-400 uppercase tracking-wider font-mono block">Circuit Breaker Sentinel state</span>
                            <p className="text-gray-700 mt-0.5">
                              Breaker State: <span className="font-mono font-bold uppercase text-neutral-850">{trace.circuit_breaker_status}</span> 
                              {trace.outcome === "REROUTED_FALLBACK" && (
                                <span className="text-indigo-800 font-mono font-semibold bg-indigo-50 ml-2 px-1 py-0.2 rounded">Fallback Circuit Triggered!</span>
                              )}
                            </p>
                          </div>
                        </div>

                        {/* Step 4: Verification trial outcome */}
                        <div className="relative">
                          <span className="absolute -left-5 h-3.5 w-3.5 rounded-full bg-white border-2 border-cyan-800 flex items-center justify-center font-mono text-[8px] font-bold">4</span>
                          <div>
                            <span className="font-bold text-[10px] text-gray-400 uppercase tracking-wider font-mono block">Capability execution results</span>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-1.5">
                              <div className="bg-white p-2 rounded-lg border border-gray-150">
                                <span className="text-[9px] text-gray-400 block font-mono">LATENCY</span>
                                <span className="font-bold font-mono text-xs">{trace.outcome === "REROUTED_FALLBACK" ? "Bypassed" : `${trace.latency_sec}s`}</span>
                              </div>
                              <div className="bg-white p-2 rounded-lg border border-gray-150">
                                <span className="text-[9px] text-gray-400 block font-mono">TOKENS</span>
                                <span className="font-bold font-mono text-xs">{trace.outcome === "REROUTED_FALLBACK" ? "0 (Cached)" : trace.tokens_used}</span>
                              </div>
                              <div className="bg-white p-2 rounded-lg border border-gray-150">
                                <span className="text-[9px] text-gray-400 block font-mono">ESTIMATED COST</span>
                                <span className="font-bold font-mono text-xs text-emerald-700">${trace.outcome === "REROUTED_FALLBACK" ? "0.00" : trace.cost.toFixed(4)}</span>
                              </div>
                              <div className="bg-white p-2 rounded-lg border border-gray-150">
                                <span className="text-[9px] text-gray-400 block font-mono">POSTCONDITIONS</span>
                                <span className={`font-bold font-mono text-xs ${trace.outcome === "SUCCESS" ? "text-emerald-700" : "text-rose-700"}`}>
                                  {trace.outcome === "SUCCESS" ? "COMPLIANT" : "VIOLATED"}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Step 5: Log trace logs details */}
                        <div className="relative">
                          <span className={`absolute -left-5 h-3.5 w-3.5 rounded-full bg-white border-2 flex items-center justify-center font-mono text-[8px] font-bold ${
                            outcome === "SUCCESS" ? "border-emerald-500" : "border-rose-500"
                          }`}>5</span>
                          <div>
                            <span className="font-bold text-[10px] text-gray-400 uppercase tracking-wider font-mono block">Telemetry &amp; Registry log state update</span>
                            <pre className="mt-2 bg-neutral-900 text-gray-100 p-3 rounded-lg font-mono text-[11px] leading-relaxed overflow-x-auto whitespace-pre-wrap">
                              {trace.details}
                            </pre>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="text-center py-8 text-xs font-mono text-gray-450 bg-neutral-50 rounded-2xl border border-dashed border-gray-200">
              No verification traces recorded. Trigger a capability validation run to generate traces.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
