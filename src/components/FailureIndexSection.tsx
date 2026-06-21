import React, { useState } from "react";
import { FailureIncident, Capability } from "../types.ts";
import { 
  ServerCrash, Flame, AlertOctagon, Terminal, Copy, Search, 
  ShieldCheck, ArrowRight, Activity, Clock
} from "lucide-react";

interface FailureIndexSectionProps {
  failures: FailureIncident[];
  capabilities: Capability[];
}

export default function FailureIndexSection({
  failures,
  capabilities
}: FailureIndexSectionProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCapFilter, setSelectedCapFilter] = useState("all");
  const [activeGraphNode, setActiveGraphNode] = useState<string>(failures[0]?.id || "");

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const getCapById = (id: string) => {
    return capabilities.find(c => c.id === id);
  };

  const getCapName = (id: string) => {
    const found = getCapById(id);
    return found ? found.name : id;
  };

  // Filter list
  const filteredFailures = failures.filter(fail => {
    const matchesSearch = fail.root_cause.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (fail.signature && fail.signature.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCap = selectedCapFilter === "all" || fail.affected_capabilities.includes(selectedCapFilter);
    return matchesSearch && matchesCap;
  });

  // Calculate top recurring failures
  const topFailures = [...failures]
    .sort((a, b) => b.frequency - a.frequency)
    .slice(0, 3);

  // Selected node for the live relationship graph
  const selectedGraphIncident = failures.find(f => f.id === activeGraphNode) || failures[0];

  return (
    <div className="space-y-6 animate-fade-in" id="failure-index-section">
      
      {/* 1. Failure Graph & Link Map */}
      <div className="bg-white rounded-3xl border border-gray-200 p-6 space-y-4">
        <div>
          <div className="flex items-center gap-2">
            <Activity size={16} className="text-rose-600" />
            <h2 className="text-sm font-bold font-mono text-neutral-800 uppercase tracking-widest">
              Bi-directional Failure Relationship Map (Dependency Graph)
            </h2>
          </div>
          <p className="text-xs text-gray-500 font-sans mt-1">
            Visualized schema relationship links mapping active exceptions down to their contracts, vulnerable containers, and recovery strategies. Select a node to isolate trace paths.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
          {/* Node list list */}
          <div className="lg:col-span-4 border border-gray-250/65 rounded-2xl p-4 bg-neutral-50/80 space-y-2.5">
            <span className="text-[10px] font-mono font-bold text-gray-400 block uppercase tracking-wider">
              Select Failure Node:
            </span>
            <div className="space-y-1.5 max-h-[260px] overflow-y-auto">
              {failures.map(item => (
                <button
                  key={item.id}
                  onClick={() => setActiveGraphNode(item.id)}
                  className={`w-full text-left p-2.5 rounded-xl border text-xs font-mono transition-all flex items-center justify-between cursor-pointer ${
                    activeGraphNode === item.id || (!activeGraphNode && failures[0]?.id === item.id)
                      ? "bg-neutral-900 text-white border-neutral-900 font-bold"
                      : "bg-white text-gray-600 border-gray-150 hover:bg-neutral-100"
                  }`}
                >
                  <span className="truncate">{item.root_cause}</span>
                  <span className={`text-[9px] px-1.5 rounded uppercase font-bold text-right ml-2 ${
                    activeGraphNode === item.id 
                    ? "bg-rose-500 text-white" 
                    : "bg-rose-100 text-rose-800"
                  }`}>
                    {item.frequency}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Relationship detail visualizer */}
          <div className="lg:col-span-8 bg-neutral-950 rounded-2xl border border-neutral-900 p-5 font-mono text-xs text-gray-300 flex flex-col justify-between">
            {selectedGraphIncident ? (
              <div className="space-y-5">
                <div className="flex justify-between items-start border-b border-neutral-800 pb-3">
                  <div>
                    <span className="text-[9px] text-rose-400 font-bold uppercase tracking-widest block">GRAPH ROOT ORIGIN Exception</span>
                    <h3 className="text-sm font-bold text-white mt-1 uppercase">
                      {selectedGraphIncident.root_cause}
                    </h3>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-[9.5px] text-gray-450 uppercase font-bold">Taxonomy Category:</span>
                      <span className="bg-red-950 text-red-400 font-bold text-[9px] font-mono px-1.5 py-0.2 rounded border border-red-900 uppercase">
                        {selectedGraphIncident.category || "General Exception"}
                      </span>
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    selectedGraphIncident.severity === "CRITICAL"
                      ? "bg-red-950/80 border border-red-800 text-red-400"
                      : "bg-amber-950/80 border border-amber-800 text-amber-400"
                  }`}>
                    {selectedGraphIncident.severity}
                  </span>
                </div>

                {/* Relational Flow Nodes */}
                <div className="space-y-3 pt-1">
                  
                  {/* FAILURE -> CAPABILITY LINK */}
                  <div className="flex items-start md:items-center gap-3 flex-col md:flex-row pb-3 border-b border-neutral-900">
                    <span className="w-full md:w-32 text-[10px] text-gray-500 font-bold uppercase tracking-wider shrink-0">
                      Failure ──🔗──&gt; Cap
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedGraphIncident.affected_capabilities.map(capId => {
                        const cap = getCapById(capId);
                        return (
                          <span 
                            key={capId} 
                            className="bg-neutral-900 border border-neutral-800 text-indigo-400 py-1 px-2.5 rounded-lg text-[10px]"
                          >
                            {cap?.name || capId} <span className="text-gray-600 font-normal">({capId})</span>
                          </span>
                        );
                      })}
                    </div>
                  </div>

                  {/* FAILURE -> CONTRACT LINK */}
                  <div className="flex items-start md:items-center gap-3 flex-col md:flex-row pb-3 border-b border-neutral-900">
                    <span className="w-full md:w-32 text-[10px] text-gray-500 font-bold uppercase tracking-wider shrink-0">
                      Failure ──📃──&gt; Contract
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedGraphIncident.affected_capabilities.map(capId => {
                        const cap = getCapById(capId);
                        if (!cap) return null;
                        return (
                          <span 
                            key={capId + "-contract"} 
                            className="bg-neutral-900 border border-neutral-800 text-emerald-400 py-1 px-2.5 rounded-lg text-[10px]"
                          >
                            Ref: {cap.contract_id || "Uncontracted!"}
                          </span>
                        );
                      })}
                    </div>
                  </div>

                  {/* FAILURE -> RECOVERY STRATEGY LINK */}
                  <div className="flex items-start md:items-center gap-3 flex-col md:flex-row pb-1">
                    <span className="w-full md:w-32 text-[10px] text-gray-500 font-bold uppercase tracking-wider shrink-0">
                      Remediation Route
                    </span>
                    <div className="flex-1 bg-neutral-900/40 p-2.5 rounded-lg border border-neutral-900 font-sans text-xs text-gray-400 leading-normal">
                      <strong className="block text-[10px] font-mono text-emerald-500 font-semibold mb-1 uppercase tracking-wide">
                        🔐 Fallback Remediator Action:
                      </strong>
                      {selectedGraphIncident.recovery_action}
                    </div>
                  </div>

                </div>

                {/* Seen Times and metadata footer */}
                <div className="pt-2 border-t border-neutral-900 flex justify-between items-center text-[10px] text-gray-400 flex-wrap gap-2">
                  <span className="flex items-center gap-1.5">
                    <Clock size={11} className="text-gray-500" />
                    First seen: <strong className="text-gray-300">{selectedGraphIncident.first_occurred ? new Date(selectedGraphIncident.first_occurred).toLocaleString() : "Initialization Check"}</strong>
                  </span>
                  <span>
                    Last seen: <strong className="text-gray-300">{new Date(selectedGraphIncident.last_occurred).toLocaleString()}</strong>
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 text-gray-500">
                Select an origin node to witness dependency pathways.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 2. Top Recurring Failures */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Top 3 Alarm Index Panel */}
        <div className="bg-white rounded-3xl border border-gray-200 p-6 space-y-4">
          <div>
            <h3 className="text-xs font-bold font-mono text-neutral-800 uppercase tracking-widest">
              Top Recurring Telemetry Exceptions
            </h3>
            <p className="text-[11px] text-gray-500">
              The highest-frequency threat categories identified over active validation trials.
            </p>
          </div>

          <div className="space-y-4 font-mono text-xs">
            {topFailures.map((fail, i) => (
              <div key={fail.id} className="space-y-1.5">
                <div className="flex justify-between items-center text-[11px]">
                  <span className="font-bold text-gray-900">
                    {i+1}. {fail.root_cause}
                  </span>
                  <span className="text-red-700 font-black">
                    {fail.frequency} incidents
                  </span>
                </div>
                <div className="w-full h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-rose-500"
                    style={{ width: `${Math.min(100, (fail.frequency / 50) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Security Rule Guardrail Warning */}
        <div className="bg-white rounded-3xl border border-gray-200 p-6 flex flex-col justify-between">
          <div className="space-y-2">
            <h3 className="text-xs font-bold font-mono text-neutral-800 uppercase tracking-widest flex items-center gap-1.5">
              <Flame size={12} className="text-red-600 animate-pulse" />
              Contaminated Capability Audit
            </h3>
            <p className="text-xs text-gray-500 leading-normal font-sans">
              Continuous monitoring targets "contaminated" capabilities tied to critical failure signatures. Active circuit breakers monitor these intersections to prevent cascading memory poisons from flowing downstream.
            </p>
          </div>

          <div className="mt-4 bg-rose-50 border border-rose-100 p-3 rounded-2xl flex gap-3 text-[11px] text-rose-900">
            <AlertOctagon size={16} className="text-rose-700 shrink-0 mt-0.5" />
            <p className="leading-normal font-mono">
              <strong>CRITICAL PREDECESSOR NOTICE:</strong> Joint failure mapping flags any cascade exceeding 3 failure events inside 60,000ms, automatically sealing docker daemon binds.
            </p>
          </div>
        </div>

      </div>

      {/* 3. Failure list details */}
      <div className="bg-white rounded-3xl border border-gray-200 p-6 space-y-6">
        <div className="flex flex-col sm:flex-row gap-3 bg-neutral-50 p-4 rounded-2xl border border-gray-200/80 justify-between items-center">
          <div className="flex-1 relative w-full">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={15} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search exceptions, signatures, or root causes..."
              className="w-full bg-white border border-gray-200 rounded-xl pl-9 pr-4 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 font-sans"
            />
          </div>

          <div className="w-full sm:w-64">
            <select
              value={selectedCapFilter}
              onChange={(e) => setSelectedCapFilter(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 font-sans cursor-pointer"
            >
              <option value="all">All Affected Capabilities</option>
              {capabilities.map(cap => (
                <option key={cap.id} value={cap.id}>
                  {cap.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-4">
          <span className="text-[10px] font-mono tracking-wider font-bold text-gray-400 block uppercase">
            Captured Telemetry Root Causes ({filteredFailures.length}):
          </span>

          {filteredFailures.length > 0 ? (
            <div className="grid grid-cols-1 gap-5" id="failure-log-list">
              {filteredFailures.map(fail => (
                <div 
                  key={fail.id}
                  className="bg-white border border-gray-200 rounded-2xl p-5 space-y-4 shadow-sm relative overflow-hidden"
                >
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-red-650" />
                        <h3 className="font-bold font-mono text-gray-950 text-sm">{fail.root_cause}</h3>
                        <span className={`inline-block px-1.5 py-0.2 rounded text-[8px] font-mono font-bold uppercase leading-none ${
                          fail.severity === "CRITICAL"
                            ? "bg-red-100 text-red-800"
                            : fail.severity === "HIGH"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-blue-100 text-blue-800"
                        }`}>
                          {fail.severity}
                        </span>
                      </div>
                      
                      <div className="text-[10px] font-mono text-gray-454 flex items-center gap-2 flex-wrap">
                        <span className="text-gray-400 font-bold uppercase">CATEGORY:</span>
                        <span className="bg-rose-50 text-rose-800 border border-rose-150 font-bold px-1.5 py-0.2 rounded text-[9.5px] uppercase">{fail.category || "General Exception"}</span>
                        <span className="text-gray-300">|</span>
                        <span className="text-gray-400 font-bold uppercase">SIGNATURE:</span>
                        <code className="bg-neutral-100 text-neutral-800 px-1 py-0.2 rounded font-semibold text-[9.5px]">
                          {fail.signature || `EX_SIG_ERR_8847`}
                        </code>
                        <span className="text-gray-300">|</span>
                        <span className="pl-1 text-gray-400">Last Detected: {new Date(fail.last_occurred).toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="text-xs font-mono">
                      <span className="text-gray-400 block text-[9px] text-right font-bold uppercase">FREQUENCY</span>
                      <span className="font-extrabold text-neutral-800 block text-right text-sm">{fail.frequency} events</span>
                    </div>
                  </div>

                  <div className="text-[11px] font-sans text-gray-500 flex items-center gap-1.5 flex-wrap">
                    <span className="font-bold text-neutral-800">Contaminated Capabilities:</span>
                    {fail.affected_capabilities.map(cid => (
                      <span key={cid} className="bg-neutral-100 text-neutral-800 px-1.5 py-0.2 rounded text-[10px] font-mono font-bold">
                        {getCapName(cid)}
                      </span>
                    ))}
                  </div>

                  <div className="relative group">
                    <div className="absolute right-2.5 top-2.5 opacity-60 hover:opacity-100 transition z-10">
                      <button 
                        onClick={() => handleCopy(fail.id, fail.diagnostic_log_sample)}
                        className="p-1 px-1.5 bg-neutral-800 text-white rounded hover:bg-neutral-700 text-[9px] font-mono flex items-center gap-1 cursor-pointer select-none"
                      >
                        <span>{copiedId === fail.id ? "COPIED!" : "COPY LOG"}</span>
                      </button>
                    </div>
                    <pre className="bg-neutral-900 text-red-400/90 p-4 rounded-xl font-mono text-[10.5px] leading-relaxed overflow-x-auto whitespace-pre-wrap border border-neutral-800">
                      {fail.diagnostic_log_sample}
                    </pre>
                  </div>

                  {fail.recovery_action && (
                    <div className="bg-emerald-50/40 border border-emerald-150 p-4 rounded-xl flex gap-3 text-xs">
                      <ShieldCheck size={18} className="text-emerald-700 shrink-0 mt-0.5" />
                      <div className="space-y-0.5 text-emerald-950 font-sans">
                        <strong className="block text-[11px] uppercase tracking-wider font-bold">Defensive Operator Recovery Protocol</strong>
                        <p className="leading-normal">{fail.recovery_action}</p>
                      </div>
                    </div>
                  )}

                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-xs font-mono text-gray-400 bg-neutral-50 rounded-2xl border border-dashed border-gray-200">
              No telemetry failures matches description or filter settings.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
