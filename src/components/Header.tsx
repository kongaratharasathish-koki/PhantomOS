import React from "react";
import { AlertCircle, ShieldCheck, HelpCircle, Activity, Trash2, RefreshCw } from "lucide-react";

interface HeaderProps {
  onClearDb: () => void;
  isSimulating: boolean;
}

export default function Header({
  onClearDb,
  isSimulating
}: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200" id="phantom-header">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-neutral-950 text-white tracking-wider uppercase">
                v0.3 Verification Platform
              </span>
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-600 animate-pulse" />
              <span className="text-xs text-indigo-900 font-mono bg-indigo-50 px-1.5 py-0.5 rounded-md font-medium">Borders Enforced &amp; Sealed</span>
            </div>
            <h1 className="mt-2 text-3xl font-bold font-display text-gray-900 sm:text-4xl tracking-tight">
              PhantomOS <span className="font-light text-gray-400">Capability Selector &amp; Verifier</span>
            </h1>
            <p className="mt-1 text-sm text-gray-650 max-w-3xl font-sans leading-relaxed">
              Durable selections over cheap creation. PhantomOS continuously validates capability metrics, enforces behavioral schema contracts, trips defensive circuit breakers, and systematically garbage collects redundant organizational tech debt.
            </p>
          </div>

          <div className="mt-5 md:mt-0 flex items-center gap-3">
            <div className="bg-neutral-50 px-3 py-2 rounded-xl border border-gray-200 flex items-center gap-1.5 font-mono text-[11px] text-gray-500">
              <ShieldCheck size={13} className="text-emerald-700 font-bold" />
              <span>SLA Mode:</span>
              <span className="text-neutral-900 font-bold">Strict Selection</span>
            </div>

            <button
              id="btn-clear-db"
              onClick={onClearDb}
              disabled={isSimulating}
              className="inline-flex items-center justify-center px-4 py-2 border border-rose-200 rounded-xl text-xs font-semibold text-rose-700 bg-rose-50/50 hover:bg-rose-100 disabled:opacity-50 transition cursor-pointer"
              title="Reset Database to Start Clean"
            >
              <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
              Reset State
            </button>
          </div>
        </div>

        {/* Dashboard Flow Indicator Map */}
        <div className="mt-5 grid grid-cols-2 md:grid-cols-9 gap-2 bg-neutral-50 rounded-xl p-2 border border-gray-100 text-center font-mono text-[10px] text-gray-500">
          <div className="py-1 px-2 rounded-lg bg-white shadow-xs border border-gray-200">
            <span className="font-bold text-gray-800 block">1. Capability Input</span>
            <span className="text-gray-400">Bind to dynamic API host</span>
          </div>
          <div className="flex items-center justify-center font-bold text-neutral-300 hidden md:flex">➔</div>
          <div className="py-1 px-2 rounded-lg bg-white shadow-xs border border-gray-200">
            <span className="font-bold text-gray-800 block">2. Contract Binding</span>
            <span className="text-gray-400">JSON schema assertions</span>
          </div>
          <div className="flex items-center justify-center font-bold text-neutral-300 hidden md:flex">➔</div>
          <div className="py-1 px-2 rounded-lg bg-white shadow-xs border border-gray-200">
            <span className="font-bold text-gray-800 block">3. Verification Trial</span>
            <span className="text-gray-400 font-mono text-indigo-700 font-semibold bg-indigo-50/40 px-1 py-0.2 rounded">Calculate Wilson Score</span>
          </div>
          <div className="flex items-center justify-center font-bold text-neutral-300 hidden md:flex">➔</div>
          <div className="py-1 px-2 rounded-lg bg-white shadow-xs border border-gray-200">
            <span className="font-bold text-gray-800 block">4. Circuit Breaker</span>
            <span className="text-gray-405 text-amber-800 bg-amber-50/20 rounded font-semibold">Self-Quarantine Trip</span>
          </div>
          <div className="flex items-center justify-center font-bold text-neutral-300 hidden md:flex">➔</div>
          <div className="py-1 px-2 rounded-lg bg-white shadow-xs border border-gray-250">
            <span className="font-bold text-red-800 block">5. Zombie Hunter</span>
            <span className="text-rose-700 font-bold bg-rose-50/50 px-1 rounded block">Prune Bad Skills</span>
          </div>
        </div>
      </div>
    </header>
  );
}
