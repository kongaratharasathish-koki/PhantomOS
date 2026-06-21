import React, { useState } from "react";
import { BehavioralContract, Capability } from "../types.ts";
import { ShieldCheck, Command, Code, AlertTriangle, Layers, ChevronRight } from "lucide-react";

interface ContractsSectionProps {
  contracts: BehavioralContract[];
  capabilities: Capability[];
}

export default function ContractsSection({
  contracts,
  capabilities
}: ContractsSectionProps) {
  const [selectedContractId, setSelectedContractId] = useState<string | null>(null);

  const selectedContract = contracts.find(c => c.id === selectedContractId) || contracts[0];
  const linkedCapabilities = selectedContract 
    ? capabilities.filter(cap => cap.contract_id === selectedContract.id)
    : [];

  return (
    <div className="bg-white rounded-3xl border border-gray-200 p-6 space-y-6" id="contracts-section">
      <div>
        <div className="flex items-center gap-2">
          <ShieldCheck size={16} className="text-emerald-700" />
          <h2 className="text-sm font-bold font-mono text-neutral-800 uppercase tracking-widest">
            Mandatory Behavioral Contracts
          </h2>
        </div>
        <p className="text-xs text-gray-500 font-sans mt-1">
          Zero trust compositions. Every capability library module is bounded by mandatory contracts asserting precise JSON schemas, precondition constraints, and fallback recovery steps.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Navigation Index - Left Column */}
        <div className="lg:col-span-4 space-y-3 font-mono">
          <span className="text-[10px] tracking-wider font-bold text-gray-400 block uppercase">
            SLA Contract Schema Registry:
          </span>

          <div className="space-y-2">
            {contracts.map(con => {
              const isActive = selectedContractId === con.id || (!selectedContractId && con.id === contracts[0]?.id);
              return (
                <button
                  key={con.id}
                  onClick={() => setSelectedContractId(con.id)}
                  className={`w-full p-3 rounded-xl border text-left transition flex items-center justify-between text-xs font-sans ${
                    isActive 
                      ? "border-neutral-900 bg-neutral-900 text-white" 
                      : "border-gray-250 hover:bg-neutral-50 text-gray-700"
                  }`}
                >
                  <div>
                    <span className="font-bold block">{con.id.toUpperCase()} Schema</span>
                    <span className="text-[10px] text-gray-400 font-mono italic">
                      {con.preconditions.length} pre | {con.postconditions.length} post assertions
                    </span>
                  </div>
                  <ChevronRight size={14} className="text-gray-400" />
                </button>
              );
            })}
          </div>
        </div>

        {/* Detailed Contract specifications card - Right Column */}
        <div className="lg:col-span-8 space-y-4">
          {selectedContract ? (
            <div className="border border-gray-200 rounded-2xl p-5 space-y-5">
              <div className="flex justify-between items-start border-b border-gray-150 pb-3">
                <div>
                  <h3 className="font-bold text-neutral-950 text-sm font-display">
                    {selectedContract.name || `${selectedContract.id.toUpperCase()} SLA Behavioral Bounds`}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] text-gray-400 font-mono block">
                      Contract Ref: <strong className="text-gray-600">{selectedContract.id}</strong> (v{selectedContract.version || "1.0"})
                    </span>
                    <span className="text-gray-300">•</span>
                    <span className="text-[10px] text-gray-400 font-mono block">
                      Risk Assessment level: <strong className={`uppercase ${
                        selectedContract.risk_tier === "CRITICAL" ? "text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded font-extrabold border border-rose-200" :
                        selectedContract.risk_tier === "HIGH" ? "text-red-650 bg-red-50 px-1.5 py-0.5 rounded font-bold border border-red-200" :
                        selectedContract.risk_tier === "MEDIUM" ? "text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded font-semibold border border-amber-200" : 
                        "text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded font-semibold border border-emerald-200"
                      }`}>{selectedContract.risk_tier || "LOW"} Risk</strong>
                    </span>
                  </div>
                </div>
                <span className="bg-emerald-150 text-emerald-800 px-2 py-0.5 rounded text-[10px] font-mono border border-emerald-250 font-bold uppercase shrink-0">
                  ACTIVE BOUNDS
                </span>
              </div>

              {/* Allowed / Blocked Tools Pipelines - System 1 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-b border-gray-100 pb-4">
                <div className="space-y-1.5">
                  <span className="text-[9px] font-bold text-emerald-800 font-mono uppercase tracking-wider block">✓ ALLOWED CAPABILITY TOOLS:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedContract.allowed_tools && selectedContract.allowed_tools.length > 0 ? (
                      selectedContract.allowed_tools.map((t, idx) => (
                        <span key={idx} className="bg-emerald-50 text-emerald-800 border border-emerald-150 px-2 py-0.5 rounded font-mono text-[10px] font-bold">
                          {t}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-400 text-xs italic font-mono">No special tools registered (autonomous limits enforced)</span>
                    )}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <span className="text-[9px] font-bold text-red-800 font-mono uppercase tracking-wider block">✕ BLOCKED / HARMFUL TOOLS (IMMEDIATE HALT):</span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedContract.blocked_tools && selectedContract.blocked_tools.length > 0 ? (
                      selectedContract.blocked_tools.map((t, idx) => (
                        <span key={idx} className="bg-red-50 text-red-800 border border-red-150 px-2 py-0.5 rounded font-mono text-[10px] font-bold">
                          {t}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-400 text-xs italic font-mono">None registered (baseline proxy limits apply)</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Linked capabilities list */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-gray-400 font-mono uppercase block">BOUND READ-WRITE PORT MODULES:</span>
                <div className="flex gap-2 flex-wrap">
                  {linkedCapabilities.length > 0 ? (
                    linkedCapabilities.map(cap => (
                      <span key={cap.id} className="bg-indigo-50 text-indigo-800 border border-indigo-150 px-2.5 py-0.5 rounded-full text-xs font-sans font-semibold">
                        {cap.name} (SLA v{cap.version})
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-400 text-xs italic font-mono">No active capabilities bound in this pool.</span>
                  )}
                </div>
              </div>

              {/* pre / post assertions split */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-neutral-50/50 p-3.5 rounded-xl border border-gray-150 space-y-2">
                  <span className="text-[10px] font-bold text-emerald-800 font-mono uppercase block">✓ PRECONDITIONS:</span>
                  <ul className="text-xs list-disc pl-4 space-y-1 text-gray-650">
                    {selectedContract.preconditions.map((pre, i) => (
                      <li key={i}>{pre}</li>
                    ))}
                  </ul>
                </div>

                <div className="bg-neutral-50/50 p-3.5 rounded-xl border border-gray-150 space-y-2">
                  <span className="text-[10px] font-bold text-indigo-800 font-mono uppercase block">✓ POSTCONDITIONS ASSERTIONS:</span>
                  <ul className="text-xs list-disc pl-4 space-y-1 text-gray-650">
                    {selectedContract.postconditions.map((post, i) => (
                      <li key={i}>{post}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* JSON schema files representation */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-gray-400 font-mono uppercase block">Input Payload Schema Bound:</span>
                  <pre className="bg-neutral-900 text-gray-100 p-3.5 rounded-xl font-mono text-[10.5px] leading-relaxed overflow-x-auto border border-neutral-800">
                    {selectedContract.input_schema}
                  </pre>
                </div>

                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-gray-400 font-mono uppercase block">Output Payload Schema Bound:</span>
                  <pre className="bg-neutral-900 text-gray-100 p-3.5 rounded-xl font-mono text-[10.5px] leading-relaxed overflow-x-auto border border-neutral-800">
                    {selectedContract.output_schema}
                  </pre>
                </div>
              </div>

              {/* State Fallback Action Recovery Strategy */}
              <div className="bg-amber-50/50 rounded-xl p-4 border border-amber-200/65 flex gap-3">
                <AlertTriangle size={18} className="text-amber-700 shrink-0 mt-0.5" />
                <div className="text-xs leading-relaxed text-amber-900 space-y-0.5 font-sans">
                  <span className="font-bold text-amber-950 block">Assigned Fallback Recovery Program:</span>
                  <p>{selectedContract.recovery_strategy}</p>
                </div>
              </div>

              {/* Explanatory Banner for Uncontracted Block Rejection */}
              <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 text-xs text-rose-950 font-mono space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold"><ShieldCheck size={14} className="text-rose-700 font-extrabold" /> ZERO-CONTRACT SAFETY POLICE SYSTEM:</div>
                <p className="text-[11px] leading-relaxed font-sans text-rose-800">
                  Execution of any agent driver is <strong>STRICTLY FORBIDDEN</strong> if no matching contract policy exists in this registry. Attempting to run uncontracted routines outputs an immediate system block:
                </p>
                <div className="bg-neutral-950 text-red-400 p-2.5 rounded-lg border border-neutral-900 text-[10px] mt-1 pr-6 leading-relaxed">
                  [REJECT PROTOCOL] Execution blocked because target capability 'FTP-Prune-Aux' is uncontracted. PhantomOS blocked dispatch instantly to prevent silent failure loop.
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400 font-mono text-xs">
              Load contract database to inspect.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
