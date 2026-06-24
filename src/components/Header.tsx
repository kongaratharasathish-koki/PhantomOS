import React from "react";
import { ShieldCheck, RefreshCw, Zap, Lock } from "lucide-react";

interface HeaderProps {
  onClearDb: () => void;
  isSimulating: boolean;
}

export default function Header({
  onClearDb,
  isSimulating
}: HeaderProps) {
  return (
    <header className="bg-neutral-950 border-b border-neutral-900" id="phantom-header">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-3">
              <div className="bg-indigo-500/10 p-2 rounded-xl border border-indigo-500/20">
                <ShieldCheck className="text-indigo-500" size={24} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold text-white tracking-tight">
                    PhantomOS <span className="text-neutral-500 font-medium">Governance</span>
                  </h1>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 uppercase tracking-widest">
                    Enterprise Edition
                  </span>
                </div>
                <p className="text-xs text-neutral-500 font-mono mt-1">
                  Agent Security Platform // Status: Protected
                </p>
              </div>
            </div>
            <p className="text-sm text-neutral-400 max-w-2xl leading-relaxed">
              Stop AI agents before they cause damage. PhantomOS provides deterministic guardrails and cryptographically secure audit trails for your autonomous agent fleet.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start md:self-center">
            <div className="hidden lg:flex items-center gap-4 mr-4 border-r border-neutral-800 pr-4">
              <div className="text-right">
                <p className="text-[10px] font-mono text-neutral-500 uppercase">System Status</p>
                <p className="text-xs font-bold text-emerald-500">OPERATIONAL</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-mono text-neutral-500 uppercase">Defense Level</p>
                <p className="text-xs font-bold text-indigo-400">ENFORCED</p>
              </div>
            </div>

            <button
              id="btn-clear-db"
              onClick={onClearDb}
              disabled={isSimulating}
              className="inline-flex items-center justify-center px-4 py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-xs font-bold text-neutral-300 hover:text-white hover:bg-neutral-800 disabled:opacity-50 transition cursor-pointer gap-2"
              title="Reset Database to Start Clean"
            >
              <RefreshCw size={14} className={isSimulating ? "animate-spin" : ""} />
              Clear Audit Log
            </button>
            
            <button className="inline-flex items-center justify-center px-4 py-2 bg-indigo-600 rounded-xl text-xs font-bold text-white hover:bg-indigo-500 transition shadow-lg shadow-indigo-500/20 gap-2">
              <Lock size={14} />
              Deploy Policy
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
