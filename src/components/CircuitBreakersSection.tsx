import React from "react";
import { CircuitBreaker } from "../types.ts";
import { Zap, ShieldAlert, Activity, RefreshCw } from "lucide-react";

interface CircuitBreakersSectionProps {
  breakers: CircuitBreaker[];
  onReopen: (capabilityId: string) => void;
}

export default function CircuitBreakersSection({
  breakers,
  onReopen
}: CircuitBreakersSectionProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <Zap className="text-amber-500" size={16} />
          <h2 className="text-sm font-bold font-mono text-white uppercase tracking-widest">
            Circuit Breakers
          </h2>
        </div>
        <p className="text-[11px] text-neutral-500 font-sans">
          Automated safety switches. When an agent violates a contract repeatedly, the breaker trips to prevent further production damage.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {(breakers || []).map(cb => (
          <div 
            key={cb.id}
            className={`bg-neutral-900 border rounded-2xl p-6 space-y-4 flex flex-col justify-between transition ${
              cb.state === "OPEN" ? "border-rose-500/50 shadow-[0_0_20px_rgba(244,63,94,0.1)]" : "border-neutral-800"
            }`}
          >
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-2.5">
                <div className="space-y-1">
                  <h3 className="font-bold font-mono text-white text-sm">{cb.capability_id}</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-neutral-500 font-mono block">ID: {cb.id}</span>
                    {cb.recovery_attempts && cb.recovery_attempts > 0 && (
                      <span className="text-[9px] text-amber-500 font-mono font-bold uppercase">Probes: {cb.recovery_attempts}</span>
                    )}
                  </div>
                </div>

                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase shrink-0 border ${
                  cb.state === "CLOSED"
                    ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                    : cb.state === "HALF_OPEN"
                    ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
                    : "bg-rose-500/10 text-rose-500 border-rose-500/20 animate-pulse"
                }`}>
                  {cb.state}
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-[11px] font-mono">
                  <span className="text-neutral-500">Failure Threshold:</span>
                  <span className="text-neutral-300">{cb.current_consecutive_failures} / {cb.threshold_failures}</span>
                </div>
                <div className="flex gap-1 h-1.5 w-full bg-neutral-800 rounded-full overflow-hidden p-0.5 border border-neutral-700">
                  {Array.from({ length: cb.threshold_failures }).map((_, idx) => (
                    <div 
                      key={idx}
                      className={`flex-1 rounded-full transition-all duration-300 ${
                        idx < cb.current_consecutive_failures 
                          ? "bg-rose-500" 
                          : "bg-neutral-700"
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="bg-neutral-950 p-3 rounded-xl border border-neutral-800 space-y-1">
                  <span className="text-[9px] text-neutral-600 font-mono uppercase tracking-widest block">Total Trips</span>
                  <span className="text-lg font-bold text-white font-mono">{cb.trip_count}</span>
                </div>
                <div className="bg-neutral-950 p-3 rounded-xl border border-neutral-800 space-y-1">
                  <span className="text-[9px] text-neutral-600 font-mono uppercase tracking-widest block">Health</span>
                  <span className={`text-lg font-bold font-mono ${cb.state === 'OPEN' ? 'text-rose-500' : 'text-emerald-500'}`}>
                    {cb.state === 'OPEN' ? '0%' : '100%'}
                  </span>
                </div>
              </div>
            </div>

            {cb.state === "OPEN" ? (
              <button
                onClick={() => onReopen(cb.capability_id)}
                className="w-full flex items-center justify-center gap-2 py-3 bg-rose-500 text-white font-bold rounded-xl hover:bg-rose-600 transition-colors text-xs uppercase tracking-widest"
              >
                <RefreshCw size={14} />
                Manually Reset Breaker
              </button>
            ) : (
              <div className="flex items-center gap-2 px-3 py-2 bg-emerald-500/5 border border-emerald-500/10 rounded-xl">
                <ShieldAlert size={14} className="text-emerald-500" />
                <span className="text-[10px] text-emerald-500/80 font-mono font-bold uppercase tracking-widest">Sentinel Monitoring Active</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
