import React, { useState } from "react";
import { Capability } from "../types.ts";
import { Play, Flame, HelpCircle, Thermometer, ShieldAlert, Cpu, Sparkles, RefreshCw, Clock } from "lucide-react";

interface SandboxPanelProps {
  capabilities: Capability[];
  isSimulating: boolean;
  onExecuteTrial: (id: string, task: string, forceFail: boolean, failType: string) => void;
  onAdvanceTime: () => Promise<void>;
  onResetDb: () => Promise<void>;
}

export default function SandboxPanel({
  capabilities,
  isSimulating,
  onExecuteTrial,
  onAdvanceTime,
  onResetDb
}: SandboxPanelProps) {
  const [selectedCapId, setSelectedCapId] = useState("");
  const [selectedFailType, setSelectedFailType] = useState("Schema Mismatch");
  const [customTaskInput, setCustomTaskInput] = useState("");
  const [logTrace, setLogTrace] = useState<string | null>(null);

  const activeCapabilities = capabilities.filter(c => c.status !== "ARCHIVED");

  // Keep dropdown default synced
  React.useEffect(() => {
    if (activeCapabilities.length > 0 && !selectedCapId) {
      setSelectedCapId(activeCapabilities[0].id);
    }
  }, [capabilities, selectedCapId]);

  const handleInjectFault = async () => {
    const targetId = selectedCapId || (activeCapabilities[0]?.id);
    if (!targetId) return;

    const task = customTaskInput.trim() || `Simulator Fault Infection test with Vector: ${selectedFailType}`;
    
    setLogTrace(`Injecting [${selectedFailType}] fault vector on Cap ID: ${targetId}...`);
    onExecuteTrial(targetId, task, true, selectedFailType);
    setCustomTaskInput("");
    
    setTimeout(() => {
      setLogTrace(`Dispatched fault vector. Breaker and state transition pipelines active.`);
    }, 1200);
  };

  const handleAdvanceTimeClick = async () => {
    setLogTrace("Dispatched simulated passage of time. Recalculating Wilson score lower bounds, increasing confidence decays, and launching Garbage Collector pruning ticks...");
    await onAdvanceTime();
    setTimeout(() => {
      setLogTrace("Time simulation complete. Pruned obsolete candidates. Refreshed statistical metrics.");
    }, 1500);
  };

  return (
    <div className="bg-neutral-900 text-neutral-100 rounded-3xl p-5 border border-neutral-800 shadow-2xl space-y-6 font-sans">
      
      {/* Visual Header */}
      <div className="border-b border-neutral-800 pb-4 space-y-1">
        <div className="flex items-center gap-2">
          <Cpu className="text-indigo-400 shrink-0 fill-indigo-400/20 animate-pulse" size={16} />
          <h3 className="text-xs font-bold font-mono tracking-widest uppercase text-white">
            Verifiable Sandbox Console
          </h3>
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping inline-block ml-auto" />
        </div>
        <p className="text-[10px] text-gray-400 font-sans leading-relaxed">
          Administer deterministic stress testing, simulated decay intervals, and witness real-time Lifecycle Garbage Collection loops.
        </p>
      </div>

      {/* Control Module 1: Time passage wave */}
      <div className="space-y-2.5">
        <label className="text-[10px] font-mono uppercase font-bold text-gray-400 tracking-wider flex items-center gap-1.5">
          <Clock size={12} className="text-indigo-400" />
          1. Confidence Decay / Time Simulation
        </label>
        <div className="bg-neutral-950 p-3.5 rounded-2xl border border-neutral-800 space-y-2.5">
          <p className="text-[10px] text-gray-400 leading-tight">
            Advancing simulation time shrinks active sample sizes, decays Wilson lower bounds, decays health, and triggers automatic archiving of zombies.
          </p>
          <button
            disabled={isSimulating}
            onClick={handleAdvanceTimeClick}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-[10px] font-bold uppercase rounded-xl py-2 px-3 tracking-wider flex items-center justify-center gap-2 shadow-md transition disabled:opacity-50 select-none cursor-pointer"
          >
            <RefreshCw size={11} className={isSimulating ? "animate-spin" : ""} />
            Advance Simulation Cycle
          </button>
        </div>
      </div>

      {/* Control Module 2: Fault Injection */}
      <div className="space-y-3">
        <label className="text-[10px] font-mono uppercase font-bold text-gray-400 tracking-wider flex items-center gap-1.5">
          <Flame size={12} className="text-amber-400" />
          2. Deterministic Fault Injector
        </label>

        <div className="bg-neutral-950 p-4 rounded-2xl border border-neutral-800 space-y-3.5">
          {/* Target Cap list */}
          <div className="space-y-1">
            <span className="text-[9px] font-mono text-gray-450 block uppercase">Target Capability:</span>
            {activeCapabilities.length > 0 ? (
              <select
                value={selectedCapId}
                onChange={(e) => setSelectedCapId(e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-2.5 py-2 text-xs font-mono text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                {activeCapabilities.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.status})
                  </option>
                ))}
              </select>
            ) : (
              <div className="text-[10px] text-red-400 font-mono italic">No candidate capabilities active.</div>
            )}
          </div>

          {/* Fault vector picker */}
          <div className="space-y-1">
            <span className="text-[9px] font-mono text-gray-450 block uppercase">Fault Vector Code:</span>
            <select
              value={selectedFailType}
              onChange={(e) => setSelectedFailType(e.target.value)}
              className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-2.5 py-2 text-xs font-mono text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 scrollbar-thin"
            >
              <optgroup label="SLA & Output Boundaries" className="bg-neutral-900 text-gray-300">
                <option value="Schema Mismatch">Schema Mismatch (JSON Key violation)</option>
                <option value="Semantic Failure">Semantic Failure (Improper Output Schema)</option>
                <option value="Malformed Output">Malformed Output (Incomplete parser errors)</option>
              </optgroup>
              <optgroup label="Severe Security Bounds" className="bg-neutral-900 text-gray-300">
                <option value="SELinux Context">SELinux Context policies block</option>
                <option value="Permission Denied">Permission Denied (Dangerous chmod execution)</option>
                <option value="Memory Poisoning">Memory Poisoning (Prompt injection override)</option>
              </optgroup>
              <optgroup label="System Quotas" className="bg-neutral-900 text-gray-300">
                <option value="Context Overflow">Context Overflow (&gt;1,000,000 Window Limit)</option>
                <option value="Token Exhaustion">Token Exhaustion (429 API Quota Empty)</option>
                <option value="Tool Failure">Tool Failure (Port handover Loss)</option>
              </optgroup>
              <optgroup label="Integrity Bounds" className="bg-neutral-900 text-gray-300">
                <option value="Goal Hijacking">Goal Hijacking (Agent diverged target path)</option>
                <option value="Supply Chain Compromise">Supply Chain (Package Cryptographic mismatch)</option>
                <option value="Latency Spike">Latency Spike (&gt;10,000ms delay delay SLA)</option>
                <option value="Cost Spike">Cost Spike (Excessive auxiliary budget bill)</option>
              </optgroup>
            </select>
          </div>

          {/* Context input */}
          <div className="space-y-1">
            <span className="text-[9px] font-mono text-gray-450 block uppercase">Manual Task context:</span>
            <input
              type="text"
              value={customTaskInput}
              onChange={(e) => setCustomTaskInput(e.target.value)}
              placeholder="e.g. Verify EKS balance state..."
              className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-400 placeholder-neutral-600"
            />
          </div>

          <button
            disabled={isSimulating || activeCapabilities.length === 0}
            onClick={handleInjectFault}
            className="w-full bg-orange-600 hover:bg-orange-500 text-white font-mono text-[10px] font-bold uppercase rounded-xl py-2 px-3 tracking-wider flex items-center justify-center gap-2 shadow-md transition disabled:opacity-50 select-none cursor-pointer"
          >
            <Play size={11} className="fill-current text-white" />
            Inject Fault vector
          </button>
        </div>
      </div>

      {/* Simulator Log Console Output */}
      {logTrace && (
        <div className="space-y-1.5">
          <span className="text-[9px] font-mono font-bold text-gray-400 uppercase tracking-widest block">实时监控 Sandbox Log:</span>
          <div className="bg-neutral-950 p-3 rounded-xl border border-neutral-800 font-mono text-[10px] text-amber-400/90 leading-normal max-h-24 overflow-y-auto scrollbar-thin">
            &gt; {logTrace}
          </div>
        </div>
      )}

      {/* Global State reset */}
      <div className="border-t border-neutral-850 pt-4 flex justify-between items-center text-[10px]">
        <span className="text-gray-500 font-mono">System state db:</span>
        <button
          disabled={isSimulating}
          onClick={onResetDb}
          className="text-gray-400 hover:text-white font-mono font-bold hover:underline transition select-none cursor-pointer"
        >
          Reset Baseline Defaults
        </button>
      </div>

    </div>
  );
}
