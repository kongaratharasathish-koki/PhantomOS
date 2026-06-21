import React, { useState } from "react";
import { Capability, BehavioralContract } from "../types.ts";
import { 
  ArrowRight, ShieldCheck, AlertTriangle, AlertOctagon, HelpCircle, 
  Layers, Lock, Zap, RefreshCw, CheckCircle, Flame 
} from "lucide-react";

interface CompositionSafetySectionProps {
  capabilities: Capability[];
  contracts: BehavioralContract[];
}

export default function CompositionSafetySection({
  capabilities,
  contracts
}: CompositionSafetySectionProps) {
  const [sourceId, setSourceId] = useState<string>("");
  const [targetId, setTargetId] = useState<string>("");
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<{
    status: "SAFE" | "WARNING" | "BLOCKED";
    chainConfidence: number;
    reasons: string[];
    details: {
      source: { id: string; name: string; confidence: number; risk: string };
      target: { id: string; name: string; confidence: number; risk: string };
    };
  } | null>(null);

  const availableCaps = capabilities.filter(c => c.status !== "ARCHIVED");

  const runValidation = async () => {
    if (!sourceId || !targetId) return;
    setIsValidating(true);
    try {
      const res = await fetch("/api/composition/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ source_id: sourceId, target_id: targetId })
      });
      const data = await res.json();
      if (data.success) {
        setValidationResult({
          status: data.status,
          chainConfidence: data.chainConfidence,
          reasons: data.reasons,
          details: data.details
        });
      }
    } catch (err) {
      console.error("Composition validation failed:", err);
    } finally {
      setIsValidating(false);
    }
  };

  const getContractForCap = (capId: string) => {
    const cap = capabilities.find(c => c.id === capId);
    if (!cap) return null;
    return contracts.find(co => co.id === cap.contract_id) || null;
  };

  const sourceContract = getContractForCap(sourceId);
  const targetContract = getContractForCap(targetId);

  return (
    <div className="bg-white rounded-3xl border border-gray-200 p-6 space-y-6" id="composition-safety-section">
      <div>
        <div className="flex items-center gap-2">
          <Layers size={16} className="text-indigo-600" />
          <h2 className="text-sm font-bold font-mono text-neutral-800 uppercase tracking-widest">
            Composition Safety &amp; Validation Engine
          </h2>
        </div>
        <p className="text-xs text-gray-500 font-sans mt-1">
          Validate capability pipeline compatibility before binding execution chains. Ensures strict type-safety, contract assertion overlap, recovery configuration, and risk escalation enforcement.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Selection panel */}
        <div className="lg:col-span-4 bg-neutral-50 border border-gray-200 rounded-2xl p-5 space-y-5">
          <span className="text-[10px] font-mono tracking-wider font-bold text-gray-400 block uppercase">
            Select Composition Chain Nodes:
          </span>

          <div className="space-y-4">
            {/* Upstream/Source Node Selection */}
            <div className="space-y-1">
              <label className="text-xs font-mono font-bold text-gray-600 block">Upstream Node (Skill A Output):</label>
              <select
                value={sourceId}
                onChange={(e) => {
                  setSourceId(e.target.value);
                  setValidationResult(null);
                }}
                className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 font-sans cursor-pointer"
              >
                <option value="">-- Choose Upstream Capability --</option>
                {availableCaps.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({getContractForCap(c.id)?.risk_tier || "LOW"} Risk)
                  </option>
                ))}
              </select>
            </div>

            {/* Downstream/Target Node Selection */}
            <div className="space-y-1">
              <label className="text-xs font-mono font-bold text-gray-600 block">Downstream Node (Skill B Input):</label>
              <select
                value={targetId}
                onChange={(e) => {
                  setTargetId(e.target.value);
                  setValidationResult(null);
                }}
                className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 font-sans cursor-pointer"
              >
                <option value="">-- Choose Downstream Capability --</option>
                {availableCaps.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({getContractForCap(c.id)?.risk_tier || "LOW"} Risk)
                  </option>
                ))}
              </select>
            </div>

            {/* Validation Trigger Button */}
            <button
              disabled={!sourceId || !targetId || isValidating}
              onClick={runValidation}
              className="w-full inline-flex items-center justify-center py-2.5 bg-neutral-900 text-white hover:bg-neutral-850 rounded-xl text-xs font-mono font-bold cursor-pointer disabled:opacity-40 transition duration-150 select-none border border-neutral-900"
            >
              {isValidating ? (
                <>
                  <RefreshCw size={12} className="mr-1.5 animate-spin" />
                  Asserting Boundary Conditions...
                </>
              ) : (
                <>
                  <Layers size={12} className="mr-1.5" />
                  Verify Composition Safety
                </>
              )}
            </button>
          </div>

          {/* Quick Context Reference Column */}
          {sourceContract && targetContract && (
            <div className="border-t border-gray-200 pt-4 space-y-3 font-mono text-[10px] text-gray-500">
              <div className="space-y-1">
                <span className="font-bold text-neutral-800">SOURCE: {sourceContract.id.toUpperCase()}</span>
                <div className="pl-2 border-l border-gray-300">
                  <span className="block">Output schema variables:</span>
                  <code className="text-indigo-700 bg-indigo-50/50 px-1 py-0.2 rounded truncate block">
                    {Object.keys(JSON.parse(sourceContract.output_schema)).join(", ")}
                  </code>
                </div>
              </div>

              <div className="space-y-1">
                <span className="font-bold text-neutral-800">TARGET: {targetContract.id.toUpperCase()}</span>
                <div className="pl-2 border-l border-gray-300">
                  <span className="block">Input schema requirements:</span>
                  <code className="text-emerald-700 bg-emerald-50/50 px-1 py-0.2 rounded truncate block">
                    {Object.keys(JSON.parse(targetContract.input_schema)).join(", ")}
                  </code>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-8 flex flex-col justify-between">
          {validationResult ? (
            <div className="border border-gray-200 rounded-2xl p-5 space-y-5 flex-1 flex flex-col justify-between">
              
              {/* Output status indicator */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-gray-150 pb-3">
                  <div>
                    <h3 className="font-bold text-neutral-950 text-sm font-display uppercase tracking-tight">
                      Safety Certification Verification
                    </h3>
                    <span className="text-[10px] text-gray-400 font-mono block mt-0.5">
                      Compile-time Static Check
                    </span>
                  </div>

                  <span className={`px-3 py-1 rounded-xl text-xs font-mono font-bold uppercase ${
                    validationResult.status === "SAFE"
                      ? "bg-emerald-100 text-emerald-850 border border-emerald-250 animate-pulse"
                      : validationResult.status === "WARNING"
                      ? "bg-amber-100 text-amber-850 border border-amber-250"
                      : "bg-red-150 text-red-900 border border-red-300 font-black animate-pulse"
                  }`}>
                    🛡️ {validationResult.status}
                  </span>
                </div>

                {/* Flow Diagram Mapping */}
                <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-900 grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                  
                  {/* Src Node Block */}
                  <div className="md:col-span-4 p-3 bg-neutral-900 border border-neutral-850 rounded-lg text-center font-mono">
                    <span className="text-[9px] text-indigo-400 font-bold uppercase tracking-wider block">SOURCE MODULE</span>
                    <span className="text-[11px] text-white font-bold block truncate mt-1">
                      {validationResult.details.source.name}
                    </span>
                    <span className="text-[9px] text-gray-500 block">
                      Risk: <strong className="text-indigo-400">{validationResult.details.source.risk}</strong>
                    </span>
                  </div>

                  {/* Transition Vector */}
                  <div className="md:col-span-4 flex flex-col items-center justify-center text-center">
                    <div className="flex items-center gap-1">
                      <div className="h-1 bg-neutral-800 w-8 inline-block" />
                      <ArrowRight size={14} className={
                        validationResult.status === "SAFE" ? "text-emerald-500" :
                        validationResult.status === "WARNING" ? "text-amber-500" : "text-red-500"
                      } />
                      <div className="h-1 bg-neutral-800 w-8 inline-block" />
                    </div>
                    <span className="text-[9px] font-mono text-gray-400 mt-1 uppercase">
                      Schema Pipe
                    </span>
                  </div>

                  {/* Dest Node Block */}
                  <div className="md:col-span-4 p-3 bg-neutral-900 border border-neutral-850 rounded-lg text-center font-mono">
                    <span className="text-[9px] text-emerald-400 font-bold uppercase tracking-wider block">TARGET MODULE</span>
                    <span className="text-[11px] text-white font-bold block truncate mt-1">
                      {validationResult.details.target.name}
                    </span>
                    <span className="text-[9px] text-gray-500 block">
                      Risk: <strong className="text-emerald-400">{validationResult.details.target.risk}</strong>
                    </span>
                  </div>

                </div>

                {/* Chain confidence rating card */}
                <div className="bg-neutral-50 px-4 py-3 rounded-xl border border-gray-150 space-y-1.5 font-mono text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Pipeline Composition Confidence Score:</span>
                    <span className={`font-extrabold ${
                      validationResult.status === "SAFE" ? "text-emerald-700" :
                      validationResult.status === "WARNING" ? "text-amber-700" : "text-red-700"
                    }`}>
                      {validationResult.chainConfidence}% Lower Bound SLA
                    </span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-300 ${
                        validationResult.status === "SAFE" ? "bg-emerald-500" :
                        validationResult.status === "WARNING" ? "bg-amber-400" : "bg-red-500"
                      }`} 
                      style={{ width: `${validationResult.chainConfidence}%` }}
                    />
                  </div>
                  <span className="text-[9px] text-gray-400 block pt-0.5">
                    Calculated recursively via joint Wilson probability margins &amp; risk factors deduction.
                  </span>
                </div>

                {/* List of checks status reports */}
                <div className="space-y-2 pt-2">
                  <span className="text-[10px] font-mono font-bold text-gray-400 block uppercase tracking-wider">
                    COMPOSITION THREAT AUDIT FEEDBACK:
                  </span>

                  {validationResult.reasons.length > 0 ? (
                    <div className="space-y-2">
                      {validationResult.reasons.map((rec, idx) => (
                        <div 
                          key={idx}
                          className={`p-3 rounded-xl border text-xs flex gap-2.5 items-start ${
                            validationResult.status === "BLOCKED" 
                              ? "bg-red-50/60 border-red-150 text-red-850" 
                              : "bg-amber-55/60 border-amber-200 text-amber-900"
                          }`}
                        >
                          {validationResult.status === "BLOCKED" ? (
                            <AlertOctagon size={16} className="text-red-700 shrink-0 mt-0.5" />
                          ) : (
                            <AlertTriangle size={16} className="text-amber-700 shrink-0 mt-0.5" />
                          )}
                          <div>
                            <strong className="block font-semibold uppercase tracking-wide text-[10px] mb-0.5 font-mono">
                              🛡️ Boundary Violation Detected
                            </strong>
                            <p className="leading-relaxed">{rec}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-emerald-50/50 border border-emerald-150 p-4 rounded-xl flex gap-3 text-xs text-emerald-950">
                      <CheckCircle size={18} className="text-emerald-700 shrink-0 mt-0.5" />
                      <div>
                        <strong className="block text-[11px] uppercase tracking-wider font-bold">
                          Composition Certified Perfect
                        </strong>
                        <p className="leading-normal">
                          All interface variables coincide. Upstream output provides a matching schema feeding into target input. Risk levels are symmetric and recovery behaviors are fully mapped. Output is SAFE to deploy.
                        </p>
                      </div>
                    </div>
                  )}
                </div>

              </div>
              
              {/* Explanatory footer */}
              <div className="text-[10px] text-gray-400 font-mono text-center border-t border-gray-150 pt-3">
                Zero-Trust Shielding enforced. Compositions with BLOCKED flags are rejected by continuous runtimes.
              </div>

            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 border border-dashed border-gray-200 rounded-2xl bg-neutral-50/50 min-h-[300px]">
              <Layers size={36} className="text-gray-350 stroke-1 animate-pulse" />
              <strong className="text-sm text-neutral-800 font-semibold mt-4">No Active Chain Validation Mapped</strong>
              <p className="text-xs text-gray-400 text-center max-w-sm mt-1">
                Select an upstream capability output and corresponding downstream input to run static compiler checks.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
