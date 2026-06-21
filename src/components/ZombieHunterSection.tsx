import React, { useState } from "react";
import { ZombieAnalysis, Capability } from "../types.ts";
import { Trash2, AlertTriangle, Archive, RefreshCw, Layers, ShieldCheck, Skull, Gauge } from "lucide-react";

interface ZombieHunterSectionProps {
  zombies: ZombieAnalysis[];
  capabilities: Capability[];
  onArchive: (id: string) => void;
  onRestore: (id: string) => void;
  isSimulating: boolean;
}

export default function ZombieHunterSection({
  zombies = [],
  capabilities = [],
  onArchive,
  onRestore,
  isSimulating
}: ZombieHunterSectionProps) {
  const [filterTag, setFilterTag] = useState<string>("ALL");

  const getCapabilityObj = (id: string) => {
    return capabilities.find(c => c.id === id);
  };

  const filteredZombies = zombies.filter(z => {
    // Sync with capability archived state
    const cap = getCapabilityObj(z.capability_id);
    if (!cap) return false;
    const realTag = cap.status === "ARCHIVED" ? "Archived" : z.tag;

    if (filterTag === "ALL") return true;
    return realTag.toUpperCase() === filterTag.toUpperCase();
  });

  const archivedCapabilities = capabilities.filter(c => c.status === "ARCHIVED");

  return (
    <div className="space-y-6 animate-fade-in" id="zombie-hunter-section">
      
      {/* Informational Header */}
      <div className="bg-white rounded-3xl border border-gray-200 p-6 space-y-6 shadow-xs">
        <div className="border-b border-gray-150 pb-4">
          <div className="flex items-center gap-2">
            <Trash2 size={16} className="text-red-700 font-bold" />
            <h2 className="text-sm font-bold font-mono text-neutral-800 uppercase tracking-widest">
              Zombie Detector &amp; Technical Debt Pruner
            </h2>
          </div>
          <p className="text-xs text-gray-500 font-sans mt-0.5">
            Auto-purges inactive, unverified, or hazardous capabilities. Bayesian trust erosion of unused code triggers auto-retirement proposals.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-neutral-50 p-4 rounded-xl border border-gray-205 text-center font-sans space-y-0.5">
            <span className="text-[9px] text-gray-400 block font-mono font-bold uppercase">Survival Strategy</span>
            <span className="font-extrabold text-neutral-900 block text-sm">Deletion is the moat</span>
            <p className="text-[10px] text-gray-400">Creation is abundant. Trust is scarce.</p>
          </div>

          <div className="bg-neutral-50 p-4 rounded-xl border border-gray-205 text-center font-sans space-y-0.5">
            <span className="text-[9px] text-gray-400 block font-mono font-bold uppercase">Erosion Metric</span>
            <span className="font-extrabold text-indigo-700 block text-sm">Dynamic Decay Load</span>
            <p className="text-[10px] text-gray-400">Idle assets lose effective sample size.</p>
          </div>

          <div className="bg-neutral-50 p-4 rounded-xl border border-gray-205 text-center font-sans space-y-0.5">
            <span className="text-[9px] text-gray-400 block font-mono font-bold uppercase">SLA Safety Gate</span>
            <span className="font-extrabold text-emerald-700 block text-sm">&lt;35% Auto-Purge</span>
            <p className="text-[10px] text-gray-400">Automatic garbage collection threshold.</p>
          </div>
        </div>

        {/* Filters bar */}
        <div className="flex items-center gap-1.5 border-b border-gray-150 pb-3 font-mono text-[10px]">
          <span className="text-gray-400 font-bold uppercase">Filter Tag:</span>
          {["ALL", "HEALTHY", "WATCHLIST", "ZOMBIE", "ARCHIVED"].map((t) => (
            <button
              key={t}
              onClick={() => setFilterTag(t)}
              id={`tag-filter-${t.toLowerCase()}`}
              className={`px-2.5 py-1 rounded-lg border font-bold uppercase transition scale-95 hover:scale-100 cursor-pointer ${
                filterTag === t 
                  ? "bg-neutral-900 text-white border-neutral-900" 
                  : "bg-white text-gray-500 border-gray-200 hover:text-gray-900"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Dynamic Zombie List */}
        <div className="space-y-4 pt-1">
          {filteredZombies.length > 0 ? (
            <div className="space-y-4" id="zombie-list">
              {filteredZombies.map(zombie => {
                const cap = getCapabilityObj(zombie.capability_id);
                if (!cap) return null;

                const realTag = cap.status === "ARCHIVED" ? "Archived" : zombie.tag;

                return (
                  <div 
                    key={zombie.id}
                    className={`border rounded-2xl p-5 space-y-4 transition ${
                      realTag === "Zombie" ? "bg-white border-red-300 hover:bg-red-50/10" :
                      realTag === "Watchlist" ? "bg-white border-amber-305 hover:bg-amber-50/5" :
                      realTag === "Archived" ? "bg-gray-50/50 border-gray-200 opacity-75" :
                      "bg-white border-gray-200 hover:border-indigo-200"
                    }`}
                    id={`zombie-list-row-${zombie.id}`}
                  >
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                      <div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h3 className="font-bold text-neutral-950 font-display text-sm">{cap.name}</h3>
                          <span className={`px-2 py-0.5 rounded-full text-[8.5px] font-mono font-bold border uppercase ${
                            realTag === "Zombie" ? "bg-red-50 text-red-800 border-red-200 animate-pulse" :
                            realTag === "Watchlist" ? "bg-indigo-50 text-indigo-800 border-indigo-200" :
                            realTag === "Archived" ? "bg-neutral-200 text-neutral-700 border-neutral-300" :
                            "bg-emerald-50 text-emerald-800 border-emerald-200"
                          }`}>
                            {realTag}
                          </span>
                        </div>
                        <span className="text-[10px] text-gray-400 font-mono">Reference capability ID: {cap.id} | Status: {cap.status}</span>
                      </div>

                      {zombie.auto_retirement_proposed && cap.status !== "ARCHIVED" && (
                        <span className="px-2.5 py-0.5 rounded-md text-[9px] font-mono font-bold bg-rose-900 text-white animate-pulse inline-flex items-center gap-1">
                          <Skull size={10} />
                          <span>AUTO-RETIREMENT PROPOSED</span>
                        </span>
                      )}
                    </div>

                    {/* All 7 Zombie Signal indicators */}
                    <div className="grid grid-cols-2 sm:grid-cols-7 gap-1.5 text-[9.5px] font-mono">
                      <div className={`p-1.5 rounded-lg border text-center ${zombie.low_usage ? "bg-red-100/60 text-red-800 border-red-200 font-bold" : "bg-neutral-50 text-gray-300 border-gray-200"}`}>
                        Low Usage
                      </div>
                      <div className={`p-1.5 rounded-lg border text-center ${zombie.high_rollback ? "bg-red-100/60 text-red-800 border-red-200 font-bold" : "bg-neutral-50 text-gray-300 border-gray-200"}`}>
                        High Rollback
                      </div>
                      <div className={`p-1.5 rounded-lg border text-center ${zombie.falling_confidence ? "bg-red-100/60 text-red-800 border-red-200 font-bold" : "bg-neutral-50 text-gray-300 border-gray-200"}`}>
                        Decay Drop
                      </div>
                      <div className={`p-1.5 rounded-lg border text-center ${zombie.long_inactivity ? "bg-red-100/60 text-red-800 border-red-200 font-bold" : "bg-neutral-50 text-gray-300 border-gray-200"}`}>
                        Idle Time
                      </div>
                      <div className={`p-1.5 rounded-lg border text-center ${zombie.poor_health ? "bg-red-100/60 text-red-800 border-red-200 font-bold" : "bg-neutral-50 text-gray-300 border-gray-200"}`}>
                        Bad Health
                      </div>
                      <div className={`p-1.5 rounded-lg border text-center ${zombie.high_failure_recurrence ? "bg-red-100/60 text-red-800 border-red-200 font-bold" : "bg-neutral-50 text-gray-300 border-gray-200"}`}>
                        High Recur
                      </div>
                      <div className={`p-1.5 rounded-lg border text-center ${zombie.low_trust ? "bg-red-100/60 text-red-800 border-red-200 font-bold" : "bg-neutral-50 text-gray-300 border-gray-200"}`}>
                        Low Trust
                      </div>
                    </div>

                    {/* Historical Health Deterioration Timeline plot */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-[10px] font-mono text-gray-400">
                        <span>Index Health Trajectory (Last 6 calculations):</span>
                        <span className="font-semibold text-gray-500 uppercase">Erosion Trend Monitor</span>
                      </div>
                      
                      <div className="flex items-center gap-1.5 h-14 bg-neutral-50 p-2.5 border border-gray-200 rounded-xl justify-around">
                        {zombie.health_deterioration_timeline.map((score, idx) => (
                          <div key={idx} className="flex flex-col items-center flex-1">
                            <span className="text-[8.5px] font-mono text-gray-450">{score}%</span>
                            <div className="w-full max-w-[45px] h-2 bg-gray-200 rounded-md overflow-hidden mt-0.5 relative">
                              <div 
                                className={`h-full rounded-md ${
                                  score > 80 
                                    ? "bg-emerald-400" 
                                    : score > 50 
                                    ? "bg-amber-400" 
                                    : "bg-red-500 animate-pulse"
                                }`}
                                style={{ width: `${score}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Deprecation reasons explaining the situation */}
                    <div className="space-y-1 font-sans text-xs">
                      <span className="text-[10px] font-mono text-gray-450 block font-bold uppercase">Archival Recommendation Analysis:</span>
                      <div className="bg-neutral-50 p-4 rounded-xl border border-gray-250 text-gray-700 leading-relaxed italic">
                        {zombie.deprecation_reason}
                      </div>
                    </div>

                    {/* Command buttons */}
                    <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                      <div className="flex items-center gap-1 text-[10px] font-mono text-gray-400">
                        <Gauge size={12} />
                        <span>Cumulative Risk Quotient: {cap.rollback_rate > 20 ? "HIGH" : "MODERATE"}</span>
                      </div>
                      <div className="flex gap-2">
                        {cap.status === "ARCHIVED" ? (
                          <button
                            disabled={isSimulating}
                            onClick={() => onRestore(cap.id)}
                            className="inline-flex items-center justify-center px-3.5 py-1.5 bg-indigo-50 border border-indigo-250 hover:bg-indigo-100 text-indigo-700 text-xs font-mono font-bold rounded-xl transition cursor-pointer select-none"
                          >
                            <RefreshCw size={12} className="mr-1.5" />
                            Overrule &amp; Restore Active
                          </button>
                        ) : (
                          <>
                            {zombie.tag === "Watchlist" && (
                              <button
                                disabled={isSimulating}
                                onClick={() => onRestore(cap.id)}
                                className="inline-flex items-center justify-center px-3.5 py-1.5 bg-neutral-100 border border-gray-300 hover:bg-neutral-200 text-neutral-800 text-xs font-mono font-bold rounded-xl transition cursor-pointer select-none"
                              >
                                Optimize / Re-calibrate
                              </button>
                            )}
                            <button
                              disabled={isSimulating}
                              onClick={() => onArchive(cap.id)}
                              id={`archive-btn-${cap.id}`}
                              className="inline-flex items-center justify-center px-3.5 py-1.5 bg-red-700 hover:bg-red-800 text-white rounded-xl text-xs font-semibold select-none cursor-pointer duration-150"
                            >
                              <Trash2 size={12} className="mr-1.5" />
                              Garbage Collect &amp; Archive
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-xs font-mono text-gray-400 bg-neutral-50 rounded-2xl border border-dashed border-gray-200">
              Clean SLA Ledger. No capabilities are proposed for pruning under this tag match.
            </div>
          )}
        </div>
      </div>

      {/* Inactive Archive Vault (Decommissioned Assets Ledger) */}
      <div className="bg-white rounded-3xl border border-gray-200 p-6 space-y-4 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <Archive size={16} className="text-zinc-700" />
            <h3 className="text-sm font-bold font-mono text-neutral-800 uppercase tracking-widest">
              Garbage Collector Archive Vault
            </h3>
          </div>
          <p className="text-xs text-gray-500 font-sans mt-0.5">
            Permanently retired capabilities that fell below credentials bounds. All active executions are blocked.
          </p>
        </div>

        {archivedCapabilities.length > 0 ? (
          <div className="grid grid-cols-1 gap-4" id="archive-vault-list">
            {archivedCapabilities.map(cap => (
              <div 
                key={cap.id} 
                className="bg-neutral-50 border border-gray-205 rounded-2xl p-4 space-y-3.5"
                id={`archived-box-${cap.id}`}
              >
                <div className="flex justify-between items-start gap-4 flex-wrap">
                  <div>
                    <h4 className="font-bold text-gray-900 text-xs font-mono">{cap.name}</h4>
                    <span className="text-[10px] text-gray-450 font-mono">Archived Target ID: {cap.id}</span>
                  </div>

                  <span className="inline-flex px-1.5 py-0.2 rounded text-[9px] font-mono font-extrabold bg-neutral-250 text-neutral-700 uppercase border border-neutral-300">
                    ARCHIVED
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px] font-sans leading-relaxed text-gray-600 bg-white p-3 rounded-xl border border-gray-200/60">
                  <div>
                    <span className="text-[9px] font-mono text-gray-400 block font-bold uppercase">ARCHIVAL EXPLANATION:</span>
                    <p className="italic text-gray-700 text-xs">
                      {cap.archiveReason || "Archived automatically by continuous garbage collection cycle (health index below 35%)."}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[9px] font-mono text-gray-400 block font-bold uppercase">RETIREMENT SUMMARY:</span>
                    <div className="grid grid-cols-2 text-[10px] font-mono text-gray-500">
                      <span>Bayesian confidence:</span>
                      <strong className="text-neutral-800">{cap.confidence}%</strong>
                      <span>Sample Size:</span>
                      <strong className="text-neutral-800">{cap.effectiveSampleSize} uses</strong>
                      <span>Archived At:</span>
                      <strong className="text-neutral-800">{cap.archiveTimestamp ? new Date(cap.archiveTimestamp).toLocaleTimeString() : "Automatic GC Cycle"}</strong>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    disabled={isSimulating}
                    onClick={() => onRestore(cap.id)}
                    id={`restore-archived-btn-${cap.id}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 text-[10.5px] font-mono font-bold rounded-xl transition cursor-pointer select-none"
                  >
                    <RefreshCw size={11} className="text-indigo-600" />
                    Re-Commission &amp; Restore Candidate
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-xs font-mono text-gray-400 bg-neutral-50 rounded-2xl border border-dashed border-gray-200">
            Vault is empty. No capabilities have been archived yet. Try advancing simulation time to active decay.
          </div>
        )}
      </div>

    </div>
  );
}
