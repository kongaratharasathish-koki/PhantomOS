import React, { useState } from "react";
import { BehavioralContract } from "../types.ts";
import { ShieldCheck, AlertTriangle, Layers, ChevronRight, Eye, EyeOff, BrainCircuit, Sparkles } from "lucide-react";

interface ContractsSectionProps {
  contracts: BehavioralContract[];
  capabilities: any[]; 
}

export default function ContractsSection({
  contracts
}: ContractsSectionProps) {
  const [selectedContractId, setSelectedContractId] = useState<string | null>(null);
  const [learningSuggestion, setLearningSuggestion] = useState<string | null>(null);
  const [isLearning, setIsLearning] = useState(false);

  const selectedContract = contracts.find(c => c.id === selectedContractId) || contracts[0];

  const handleLearn = async () => {
    if (!selectedContract) return;
    setIsLearning(true);
    setLearningSuggestion(null);
    try {
      const resp = await fetch(`/api/contracts/learn/${selectedContract.id}`);
      if (resp.ok) {
        const data = await resp.json();
        setLearningSuggestion(data.suggestion);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLearning(false);
    }
  };

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <ShieldCheck size={16} className="text-indigo-400" />
            <h2 className="text-sm font-bold font-mono text-white uppercase tracking-widest">
              Firewall Policies
            </h2>
          </div>
          <p className="text-[11px] text-neutral-500 font-sans">
            Declarative behavioral boundaries. Every agent request is intercepted and verified against these contracts.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4 space-y-3 font-mono">
          <span className="text-[10px] tracking-wider font-bold text-neutral-600 block uppercase">
            Active Registry:
          </span>

          <div className="space-y-2">
            {(contracts || []).map(con => {
              const isActive = (selectedContractId === con.id) || (!selectedContractId && con.id === contracts[0]?.id);
              return (
                <button
                  key={con.id}
                  onClick={() => setSelectedContractId(con.id)}
                  className={`w-full p-4 rounded-2xl border text-left transition flex items-center justify-between text-xs font-sans ${
                    isActive 
                      ? "border-indigo-500 bg-indigo-500/10 text-white shadow-[0_0_15px_rgba(99,102,241,0.1)]" 
                      : "border-neutral-800 hover:bg-neutral-800/50 text-neutral-400"
                  }`}
                >
                  <div>
                    <span className="font-bold block">{con.name}</span>
                    <span className="text-[10px] text-neutral-500 font-mono mt-1 block">
                      ID: {con.id}
                    </span>
                  </div>
                  <ChevronRight size={14} className={isActive ? "text-indigo-400" : "text-neutral-600"} />
                </button>
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-8">
          {selectedContract ? (
            <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-6 space-y-6">
              <div className="flex justify-between items-start border-b border-neutral-800 pb-4">
                <div>
                  <h3 className="font-bold text-white text-base">
                    {selectedContract.name}
                  </h3>
                  <div className="flex items-center gap-3 mt-1.5">
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                      selectedContract.risk_tier === 'CRITICAL' ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20' :
                      selectedContract.risk_tier === 'HIGH' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' :
                      'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                    }`}>
                      {selectedContract.risk_tier} RISK
                    </span>
                    <span className="flex items-center gap-1.5 text-[10px] text-neutral-500 font-mono">
                      {selectedContract.shadow_mode ? <Eye size={12} className="text-indigo-400" /> : <EyeOff size={12} />}
                      SHADOW_MODE: {selectedContract.shadow_mode ? 'ENABLED' : 'DISABLED'}
                    </span>
                    <span className="flex items-center gap-1.5 text-[10px] text-neutral-500 font-mono ml-4">
                      <ShieldCheck size={12} className={selectedContract.api_key ? "text-emerald-400" : "text-neutral-600"} />
                      AUTH_STATUS: {selectedContract.api_key ? 'ENFORCED' : 'INSECURE'}
                    </span>
                  </div>
                </div>
                <span className="text-[10px] text-neutral-500 font-mono">v{selectedContract.version}</span>
              </div>

              {learningSuggestion && (
                <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-2xl p-4 space-y-2 animate-in fade-in slide-in-from-top-4 duration-500">
                  <div className="flex items-center gap-2 text-indigo-400">
                    <Sparkles size={14} />
                    <span className="text-[10px] font-bold font-mono uppercase tracking-widest">AI Learning Suggestion</span>
                  </div>
                  <p className="text-[11px] text-neutral-300 leading-relaxed font-sans italic">{learningSuggestion}</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-neutral-500 font-mono uppercase tracking-widest block">Allowed Tools</span>
                  <div className="flex flex-wrap gap-2">
                    {(selectedContract.allowed_tools || []).map(tool => (
                      <span key={tool} className="px-2 py-1 bg-neutral-900 border border-neutral-800 rounded text-[11px] text-neutral-300 font-mono">
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-rose-500/70 font-mono uppercase tracking-widest block">Blocked Patterns</span>
                  <div className="flex flex-wrap gap-2">
                    {(selectedContract.blocked_patterns || []).map(pattern => (
                      <span key={pattern} className="px-2 py-1 bg-rose-500/5 border border-rose-500/10 rounded text-[11px] text-rose-500 font-mono italic">
                        {pattern}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <span className="text-[10px] font-bold text-neutral-500 font-mono uppercase tracking-widest block">Post-Condition Schemas</span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-neutral-900 rounded-xl p-4 border border-neutral-800">
                    <p className="text-[9px] text-neutral-600 font-mono uppercase mb-2">Input Schema</p>
                    <pre className="text-[11px] text-indigo-300/80 font-mono leading-relaxed">
                      {JSON.stringify(selectedContract.input_schema, null, 2)}
                    </pre>
                  </div>
                  <div className="bg-neutral-900 rounded-xl p-4 border border-neutral-800">
                    <p className="text-[9px] text-neutral-600 font-mono uppercase mb-2">Output Schema</p>
                    <pre className="text-[11px] text-emerald-300/80 font-mono leading-relaxed">
                      {JSON.stringify(selectedContract.output_schema, null, 2)}
                    </pre>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-neutral-800 flex justify-end">
                <button 
                  onClick={handleLearn}
                  disabled={isLearning}
                  className="flex items-center gap-2 px-4 py-2 bg-neutral-900 hover:bg-indigo-600 border border-neutral-800 hover:border-indigo-500 text-[11px] font-bold text-neutral-400 hover:text-white rounded-xl transition duration-150 disabled:opacity-50"
                >
                  <BrainCircuit size={14} />
                  {isLearning ? "Analyzing Execution History..." : "Learn From Execution"}
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-20 border-2 border-dashed border-neutral-900 rounded-3xl">
              <Layers size={32} className="mx-auto text-neutral-800 mb-4" />
              <p className="text-xs text-neutral-600 font-mono">No policy selected</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
