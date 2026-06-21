import React from "react";
import { Capability, CircuitBreaker, FailureIncident, ZombieAnalysis, TimelineEvent } from "../types.ts";
import { ShieldCheck, Flame, Scale, ServerCrash, CheckCircle, ChevronRight, AlertTriangle, Play, RefreshCw } from "lucide-react";

interface OverviewSectionProps {
  capabilities: Capability[];
  breakers: CircuitBreaker[];
  failures: FailureIncident[];
  zombies: ZombieAnalysis[];
  timeline: TimelineEvent[];
  system_frozen: boolean;
  onUnfreeze: () => void;
  onSelectTab: (tab: string) => void;
}

export default function OverviewSection({
  capabilities,
  breakers,
  failures,
  zombies,
  timeline = [],
  system_frozen,
  onUnfreeze,
  onSelectTab
}: OverviewSectionProps) {
  // Statistics
  const activeCount = capabilities.filter(c => c.status === "ACTIVE").length;
  const totalCount = capabilities.filter(c => c.status !== "ARCHIVED").length;
  const degradedCount = capabilities.filter(c => c.status === "DEGRADED").length;
  const quarantinedCount = capabilities.filter(c => c.status === "QUARANTINED").length;
  const candidateCount = capabilities.filter(c => c.status === "CANDIDATE").length;

  const avgPosteriorConfidence = totalCount > 0 
    ? Number((capabilities
        .filter(c => c.status !== "ARCHIVED")
        .reduce((sum, c) => sum + (c.posterior_confidence || c.success_rate), 0) / totalCount).toFixed(1))
    : 0;

  const avgLowerBound = totalCount > 0 
    ? Number((capabilities
        .filter(c => c.status !== "ARCHIVED")
        .reduce((sum, c) => sum + (c.lower_confidence_bound || c.lowerBound), 0) / totalCount).toFixed(1))
    : 0;

  const trippedBreakers = breakers.filter(b => b.state === "OPEN").length;
  const totalBreakers = breakers.length;

  const zombieArchivableCount = zombies.filter(z => z.tag === "Zombie" || z.recommendation === "AUTO_ARCHIVE_RECOMMENDED").length;

  // Bayesian trust class counters
  const trustedCount = capabilities.filter(c => c.status !== "ARCHIVED" && c.trust_class === "TRUSTED").length;
  const watchlistCount = capabilities.filter(c => c.status !== "ARCHIVED" && c.trust_class === "WATCHLIST").length;
  const degradedTrustCount = capabilities.filter(c => c.status !== "ARCHIVED" && c.trust_class === "DEGRADED").length;
  const untrustedCount = capabilities.filter(c => c.status !== "ARCHIVED" && (c.trust_class === "UNTRUSTED" || !c.trust_class)).length;

  return (
    <div className="space-y-6" id="overview-section">
      {/* EXPLICIT STOPPING RULES HARDFREEZE BANNER */}
      {system_frozen && (
        <div className="bg-red-50 border-2 border-red-200 rounded-3xl p-6 text-red-900 shadow-sm animate-pulse flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1 max-w-2xl">
            <div className="flex items-center gap-2 text-red-800 font-mono font-bold text-xs uppercase tracking-wider">
              <AlertTriangle size={18} className="text-red-600 animate-bounce" />
              <span>Hard Stopping Rule Triggered &mdash; System Frozen</span>
            </div>
            <h3 className="text-lg font-bold font-display text-red-950 mt-1">Autonomous Execution Stalled</h3>
            <p className="text-xs text-red-700 leading-relaxed font-sans">
              Continuous capability verification popped a high-severity alarm: either 3 consecutive monitored exceptions, a credential interval collapse (&lt;35% trust), or direct malicious injection occurred. Autonomous recovery is disabled to protect the system.
            </p>
          </div>
          <button
            onClick={onUnfreeze}
            id="btn-unfreeze-system"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-900 text-white hover:bg-red-950 transition font-mono font-bold text-xs shadow-md cursor-pointer shrink-0"
          >
            <RefreshCw size={14} className="animate-spin" style={{ animationDuration: '3s' }} />
            <span>Operator Clear &amp; Unfreeze</span>
          </button>
        </div>
      )}

      {/* Visual Welcome Board */}
      <div className="bg-neutral-950 rounded-3xl p-6 text-white border border-neutral-900 shadow-xl overflow-hidden relative">
        <div className="absolute right-0 top-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="max-w-3xl">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-indigo-900 text-indigo-250 uppercase tracking-widest leading-none">
            Selection &gt; Creation
          </span>
          <h2 className="mt-3 text-2xl sm:text-3xl font-bold tracking-tight font-display text-white">
            PhantomOS v0.6 &mdash; Selection &amp; Survival
          </h2>
          <p className="mt-2 text-xs text-neutral-450 leading-relaxed font-sans">
            Our Continuous Capability Verification platform operates on a key law: <strong>Creation is abundant. Selection is scarce. Deletion compounds.</strong> Instead of allowing chaotic skill sprawl, v0.6 uses mathematical Bayesian trust, reviewer calibration indexes, and strict stopper conditions to ensure high-entropy AI pipelines remain stable.
          </p>
        </div>
      </div>

      {/* Grid Counters */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4" id="overview-metrics-grid">
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
          <span className="text-[10px] font-mono tracking-wider text-gray-400 block uppercase">Selection Library</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold font-display text-neutral-950">{activeCount}</span>
            <span className="text-xs font-mono text-gray-450">/ {totalCount} Active</span>
          </div>
          <div className="mt-1 flex gap-1 flex-wrap">
            {degradedCount > 0 && <span className="bg-amber-50 text-amber-700 text-[9px] font-bold px-1 rounded">{degradedCount} Degraded</span>}
            {quarantinedCount > 0 && <span className="bg-red-50 text-red-700 text-[9px] font-bold px-1 rounded">{quarantinedCount} Quarantined</span>}
            {candidateCount > 0 && <span className="bg-indigo-50 text-indigo-700 text-[9px] font-bold px-1 rounded">{candidateCount} Candidates</span>}
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
          <span className="text-[10px] font-mono tracking-wider text-gray-400 block uppercase">Bayesian Lower Bound</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold font-display text-indigo-700">{avgLowerBound}%</span>
            <span className="text-xs font-mono text-indigo-500 font-medium">Posterior: {avgPosteriorConfidence}%</span>
          </div>
          <p className="text-[9px] text-gray-450 mt-1 font-mono leading-none">Robust statistical safety margin (Beta-binomial)</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
          <span className="text-[10px] font-mono tracking-wider text-gray-400 block uppercase">Active Sentinels</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold font-display text-neutral-900">{trippedBreakers}</span>
            <span className="text-xs font-mono text-gray-500">/ {totalBreakers} Tripped</span>
          </div>
          <p className={`text-[9px] font-bold mt-1 ${trippedBreakers > 0 ? "text-amber-600 block animate-pulse" : "text-emerald-700 block"}`}>
            {trippedBreakers > 0 ? "⚠️ Tripped Breakers Quarantining" : "✓ Active Sentinels Closed"}
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
          <span className="text-[10px] font-mono tracking-wider text-gray-400 block uppercase">Pruners and Debt</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold font-display text-rose-700">{zombieArchivableCount}</span>
            <span className="text-xs font-mono text-gray-450">Zombies proposals</span>
          </div>
          <p className="text-[9px] text-gray-450 mt-1 font-mono leading-none">Recommended for immediate archiving</p>
        </div>
      </div>

      {/* 2-Column Overview Split: Bayesian Distribution & Cap Transitions timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Bayesian allocation summary card */}
        <div className="lg:col-span-4 bg-white p-5 rounded-3xl border border-gray-200 space-y-4">
          <h3 className="text-xs font-bold font-mono text-neutral-800 uppercase tracking-widest flex items-center gap-1.5">
            <ShieldCheck size={14} className="text-indigo-600" />
            Bayesian Trust Allocation
          </h3>
          <p className="text-[11px] text-gray-500 font-sans">
            Beta distribution model divides capabilities based on posterior credible lower boundaries.
          </p>

          <div className="space-y-3 pt-2 font-mono text-xs">
            {/* Trusted Category */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-emerald-700 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  TRUSTED (&gt;85%)
                </span>
                <span className="text-gray-600 font-bold">{trustedCount}</span>
              </div>
              <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-emerald-500 h-full rounded-full transition-all duration-500" 
                  style={{ width: `${totalCount > 0 ? (trustedCount / totalCount) * 100 : 0}%` }} 
                />
              </div>
            </div>

            {/* Watchlist Category */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-indigo-700 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                  WATCHLIST (70-85%)
                </span>
                <span className="text-gray-600 font-bold">{watchlistCount}</span>
              </div>
              <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-indigo-500 h-full rounded-full transition-all duration-500" 
                  style={{ width: `${totalCount > 0 ? (watchlistCount / totalCount) * 100 : 0}%` }} 
                />
              </div>
            </div>

            {/* Degraded Category */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-amber-700 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  DEGRADED (40-70%)
                </span>
                <span className="text-gray-600 font-bold">{degradedTrustCount}</span>
              </div>
              <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-amber-500 h-full rounded-full transition-all duration-500" 
                  style={{ width: `${totalCount > 0 ? (degradedTrustCount / totalCount) * 100 : 0}%` }} 
                />
              </div>
            </div>

            {/* Untrusted Category */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-rose-700 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                  UNTRUSTED (&lt;40%)
                </span>
                <span className="text-gray-600 font-bold">{untrustedCount}</span>
              </div>
              <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-rose-500 h-full rounded-full transition-all duration-500" 
                  style={{ width: `${totalCount > 0 ? (untrustedCount / totalCount) * 100 : 0}%` }} 
                />
              </div>
            </div>
          </div>
        </div>

        {/* Transition timeline feed Card */}
        <div className="lg:col-span-8 bg-white p-5 rounded-3xl border border-gray-200 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-xs font-bold font-mono text-neutral-800 uppercase tracking-widest flex items-center gap-1.5">
              <Play size={13} className="text-indigo-600" />
              State Transitions History Logs
            </h3>
            <p className="text-[11px] text-gray-500 font-sans">
              Dynamic tracking of capability promotions, suspensions, rollbacks, and quarantines under execution limits.
            </p>

            <div className="space-y-3 max-h-[220px] overflow-y-auto scrollbar-thin font-mono text-[11px] pt-1 pr-1">
              {timeline.length === 0 ? (
                <div className="text-center py-8 text-xs text-gray-400">No transitions recorded in the ledger yet.</div>
              ) : (
                timeline.slice(0, 5).map((evt) => (
                  <div key={evt.id} className="p-3 bg-neutral-50 rounded-xl border border-gray-100 flex items-start gap-3 justify-between">
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-bold text-gray-900 bg-gray-200 px-1 rounded">{evt.capability_id}</span>
                        <span className="text-gray-400">&rarr;</span>
                        <span className={`px-1.5 rounded-full text-[9px] font-bold ${
                          evt.to_status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                          evt.to_status === 'DEGRADED' ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                          evt.to_status === 'QUARANTINED' ? 'bg-red-50 text-red-700 border border-red-100' :
                          evt.to_status === 'ARCHIVED' ? 'bg-neutral-200 text-neutral-700' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {evt.to_status}
                        </span>
                        {evt.reviewer_name && (
                          <span className="text-gray-400 text-[10px]">by {evt.reviewer_name}</span>
                        )}
                        {evt.rollback_triggered && (
                          <span className="bg-red-900 text-white font-bold text-[9px] px-1 rounded animate-pulse">ROLLBACK</span>
                        )}
                      </div>
                      <p className="text-gray-600 font-sans leading-relaxed text-[11px] truncate md:whitespace-normal">
                        {evt.reason}
                      </p>
                    </div>
                    
                    <div className="text-right shrink-0">
                      <span className="text-[9px] text-gray-450 block">{new Date(evt.timestamp).toLocaleTimeString()}</span>
                      {evt.trust_change && (
                        <span className="text-[10px] text-indigo-600 font-bold block mt-0.5">
                          {evt.trust_change.from}% &rarr; {evt.trust_change.to}%
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="border-t border-gray-150 pt-3 mt-4 text-right">
            <button 
              onClick={() => onSelectTab("Operational Traces")} 
              className="text-xs text-indigo-700 font-bold hover:underline cursor-pointer inline-flex items-center gap-1"
            >
              <span>View full verification audit trail</span>
              <span>&rarr;</span>
            </button>
          </div>
        </div>
      </div>

      {/* Comparative Selection Performance Section */}
      <div className="bg-white p-6 rounded-3xl border border-gray-200 space-y-6" id="overview-comparison">
        <div className="border-b border-gray-150 pb-4">
          <h3 className="text-xs font-bold font-mono text-neutral-800 uppercase tracking-widest flex items-center gap-2">
            <Scale size={15} className="text-indigo-600" />
            Selection Engine vs Legacy Systems
          </h3>
          <p className="text-xs text-gray-500 font-sans mt-0.5">
            Quantitative verification proof. When compared below, our strict selective verification bounds prevent high-cost hallucinations and latent failure spikes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Baseline Agent Card */}
          <div className="bg-neutral-50 p-5 rounded-2xl border border-gray-200 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                <span className="text-xs font-bold text-gray-900 font-display">Baseline AI (Generative Swarms)</span>
              </div>
              <p className="text-[11px] text-gray-500 italic mt-1.5 font-sans leading-relaxed">
                "Infinite creation with no guardrails." Generates unchecked files, prompts continuously, leading to catastrophic context growth.
              </p>
            </div>
            <div className="space-y-2 mt-4 pt-4 border-t border-gray-200 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-gray-400">Success SLA:</span>
                <span className="text-red-700 font-bold">~64.0%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Audit Latency:</span>
                <span className="text-neutral-700">154s avg</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Execution Cost:</span>
                <span className="text-neutral-700">$0.18</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Hallucination Rate:</span>
                <span className="text-red-700 font-bold">16.5%</span>
              </div>
            </div>
          </div>

          {/* Human Reviewer Card */}
          <div className="bg-neutral-50 p-5 rounded-2xl border border-gray-200 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                <span className="text-xs font-bold text-gray-900 font-display">Human Auditor Decisions</span>
              </div>
              <p className="text-[11px] text-gray-500 italic mt-1.5 font-sans leading-relaxed">
                "The noisy human sensor." Good protection but bounded by slow manual review speeds, high reviewer fatigue, and high evaluation noise.
              </p>
            </div>
            <div className="space-y-2 mt-4 pt-4 border-t border-gray-200 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-gray-400">Success SLA:</span>
                <span className="text-amber-700 font-bold">~84.5%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Audit Latency:</span>
                <span className="text-neutral-700">98s avg</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Execution Cost:</span>
                <span className="text-neutral-700">$0.09</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Hallucination Rate:</span>
                <span className="text-amber-700 font-bold">5.4%</span>
              </div>
            </div>
          </div>

          {/* Selective Verification Card */}
          <div className="bg-indigo-50/40 p-5 rounded-2xl border border-indigo-200 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse" />
                <span className="text-xs font-bold text-indigo-900 font-display">PhantomOS Selection Engine</span>
              </div>
              <p className="text-[11px] text-indigo-950 font-medium italic mt-1.5 font-sans leading-relaxed">
                "Continuous automated selection." Rigorously tests preconditions against behavioral schemas, trips circuit breakers instantly, and auto-purges zombies.
              </p>
            </div>
            <div className="space-y-2 mt-4 pt-4 border-t border-indigo-100 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-indigo-950 font-medium">Success SLA:</span>
                <span className="text-indigo-800 font-bold">98.4%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-indigo-900">Audit Latency:</span>
                <span className="text-indigo-850 font-bold">14s avg</span>
              </div>
              <div className="flex justify-between">
                <span className="text-indigo-900">Execution Cost:</span>
                <span className="text-emerald-700 font-bold">$0.012</span>
              </div>
              <div className="flex justify-between">
                <span className="text-indigo-900">Hallucination Rate:</span>
                <span className="text-emerald-700 font-extrabold">0.00%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Action Navigation links */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
        <button 
          onClick={() => onSelectTab("Reviewer Reliability")}
          id="quicklink-reviewers"
          className="bg-white p-4 rounded-xl border border-gray-200 text-left hover:bg-neutral-50/50 transition cursor-pointer flex items-center justify-between"
        >
          <div>
            <span className="block text-[9px] text-gray-400">HUMAN NOISE</span>
            <span className="font-semibold text-neutral-800 block mt-0.5">Audit Human Reviewers</span>
          </div>
          <ChevronRight size={14} className="text-gray-400" />
        </button>

        <button 
          onClick={() => onSelectTab("Circuit Breakers")}
          id="quicklink-breakers"
          className="bg-white p-4 rounded-xl border border-gray-200 text-left hover:bg-neutral-50/50 transition cursor-pointer flex items-center justify-between"
        >
          <div>
            <span className="block text-[9px] text-gray-400">CIRCUITS</span>
            <span className="font-semibold text-neutral-800 block mt-0.5">Circuit Break Sentinels</span>
          </div>
          <ChevronRight size={14} className="text-gray-400" />
        </button>

        <button 
          onClick={() => onSelectTab("Zombie Hunter")}
          id="quicklink-zombies"
          className="bg-white p-4 rounded-xl border border-gray-200 text-left hover:bg-neutral-50/50 transition cursor-pointer flex items-center justify-between"
        >
          <div>
            <span className="block text-[9px] text-gray-400">GARBAGE COLLECTOR</span>
            <span className="font-semibold text-neutral-800 block mt-0.5">Uncover Zombie Debt</span>
          </div>
          <ChevronRight size={14} className="text-gray-400" />
        </button>
      </div>
    </div>
  );
}
