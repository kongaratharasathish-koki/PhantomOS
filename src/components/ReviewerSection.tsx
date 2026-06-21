import React, { useState } from "react";
import { HumanReviewer, Capability } from "../types.ts";
import { Users, ShieldCheck, HeartCrack, HelpCircle, RefreshCw, AlertCircle, Sparkles, Scale, CheckCircle, XCircle } from "lucide-react";

interface ReviewerSectionProps {
  reviewers: HumanReviewer[];
  onAuditReviewer: (id: string) => void;
  isSimulating: boolean;
  capabilities?: Capability[]; // optional backcompat
}

export default function ReviewerSection({
  reviewers = [],
  onAuditReviewer,
  isSimulating,
  capabilities = []
}: ReviewerSectionProps) {
  const [selectedCapId, setSelectedCapId] = useState("");
  const [riskTier, setRiskTier] = useState<"HIGH" | "MEDIUM" | "LOW">("HIGH");
  const [consensusResult, setConsensusResult] = useState<{
    consensus_score: number;
    required_consensus_gate: number;
    approved: boolean;
    weighted_approvers_count: number;
    weighted_rejecters_count: number;
  } | null>(null);
  const [calibratingConsensus, setCalibratingConsensus] = useState(false);

  const handleCalculateConsensus = async () => {
    if (!selectedCapId) return;
    setCalibratingConsensus(true);
    try {
      const resp = await fetch("/api/reviewers/consensus", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          capability_id: selectedCapId,
          risk_tier: riskTier
        })
      });
      if (resp.ok) {
        const json = await resp.json();
        setConsensusResult(json);
      }
    } catch (err) {
      console.error("Failed to run consensus simulator:", err);
    } finally {
      setCalibratingConsensus(false);
    }
  };

  const activeReviewCapabilities = capabilities.filter(c => c.status !== "ARCHIVED");

  return (
    <div className="space-y-6 animate-fade-in" id="reviewer-section">
      
      {/* Informational Header */}
      <div className="bg-white rounded-3xl border border-gray-200 p-6 space-y-4 shadow-xs">
        <div className="border-b border-gray-150 pb-4">
          <div className="flex items-center gap-2">
            <Users size={16} className="text-zinc-800" />
            <h2 className="text-sm font-bold font-mono text-neutral-800 uppercase tracking-widest">
              Reviewer Calibration &amp; Consensus Engine
            </h2>
          </div>
          <p className="text-xs text-gray-500 font-sans mt-0.5">
            Evaluates human reviewer decisions against ground truth runtime logs. Calculates Cohen's Kappa index ($k$) to weight operator vote consensus on high-risk boundaries.
          </p>
        </div>

        {/* INTERACTIVE WG CONSENSUS GENERATOR */}
        {activeReviewCapabilities.length > 0 && (
          <div className="bg-neutral-50 p-5 rounded-2xl border border-gray-200 space-y-4 font-sans">
            <div>
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 uppercase tracking-wider mb-1.5">
                Consensus Verification Desk
              </span>
              <h3 className="text-xs font-bold text-gray-900 font-display">Run Group Calibrated Consensus Vote</h3>
              <p className="text-[11px] text-gray-400 mt-0.5">
                Simulate high-SLA operator voting. Calculates decision thresholds adjusted for Cohen's Kappa reliability index.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-[10px] font-mono uppercase font-bold text-gray-400 mb-1">
                  Capability Target:
                </label>
                <select 
                  value={selectedCapId}
                  onChange={(e) => setSelectedCapId(e.target.value)}
                  id="consensus-cap-select"
                  className="w-full text-xs bg-white px-3 py-2 rounded-xl border border-gray-250 font-mono tracking-tight"
                >
                  <option value="">&mdash; Select Capability &mdash;</option>
                  {activeReviewCapabilities.map(c => (
                    <option key={c.id} value={c.id}>[{c.id}] {c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase font-bold text-gray-400 mb-1">
                  Contract Risk Tier:
                </label>
                <div className="flex bg-white rounded-xl border border-gray-250 p-1" id="consensus-risk-select">
                  {["LOW", "MEDIUM", "HIGH"].map((r) => (
                    <button
                      key={r}
                      onClick={() => setRiskTier(r as any)}
                      className={`flex-1 text-[10px] font-mono font-bold py-1.5 rounded-lg transition ${
                        riskTier === r 
                          ? "bg-neutral-900 text-white" 
                          : "text-gray-500 hover:text-gray-900"
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-end">
                <button
                  disabled={calibratingConsensus || !selectedCapId}
                  onClick={handleCalculateConsensus}
                  id="btn-trigger-consensus"
                  className="w-full inline-flex items-center justify-center py-2 bg-indigo-650 hover:bg-indigo-700 text-white rounded-xl text-xs font-mono font-bold select-none cursor-pointer duration-150 disabled:opacity-50"
                >
                  <Scale size={13} className="mr-1.5" />
                  Consensus Calibration
                </button>
              </div>
            </div>

            {consensusResult && (
              <div className="p-4 bg-white border border-gray-205 rounded-xl font-mono text-[11px] grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in" id="consensus-trial-result">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    {consensusResult.approved ? (
                      <CheckCircle size={14} className="text-emerald-600 shrink-0" />
                    ) : (
                      <XCircle size={14} className="text-red-600 shrink-0" />
                    )}
                    <span className="font-bold text-gray-900 text-xs uppercase">
                      Outcome: {consensusResult.approved ? "APPROVED BY CONSENSUS" : "BLOCKED BY CONSENSUS"}
                    </span>
                  </div>
                  <p className="text-[10.5px] text-gray-500 font-sans leading-relaxed mt-1">
                    {consensusResult.approved 
                      ? "Weighted positive reviews satisfied risk threshold standards. Candidate cleared." 
                      : "Reviewer uncertainty score is too high. Candidate blocked until manual re-verification."}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-x-2 gap-y-1 pt-1.5 md:pt-0 border-t md:border-t-0 md:border-l border-gray-150 md:pl-4">
                  <span className="text-gray-400">Consensus Score:</span>
                  <strong className={consensusResult.approved ? "text-emerald-700" : "text-rose-700"}>
                    {consensusResult.consensus_score}%
                  </strong>
                  <span className="text-gray-400">Required Gate limit:</span>
                  <strong className="text-neutral-800">{consensusResult.required_consensus_gate}%</strong>
                  <span className="text-gray-400">Weighted Approvers:</span>
                  <strong className="text-emerald-700">{consensusResult.weighted_approvers_count}</strong>
                  <span className="text-gray-400">Weighted Rejecters:</span>
                  <strong className="text-rose-700">{consensusResult.weighted_rejecters_count}</strong>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Cards of Human Reviewers */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6" id="reviewer-list">
          {reviewers.map(rev => {
            const trend = rev.reliability_trend || [85, 90, 88, 92, 87, 95];
            
            // v0.6 parameters
            const kappa = rev.kappa_score !== undefined ? rev.kappa_score : 0.75;
            const weight = rev.trust_weight !== undefined ? rev.trust_weight : 0.80;
            const highRiskAcc = rev.high_risk_accuracy !== undefined ? rev.high_risk_accuracy : 82.0;
            const driftVal = rev.drift !== undefined ? rev.drift : 0.0;
            const reject_count = rev.reject_count !== undefined ? rev.reject_count : 12;

            return (
              <div 
                key={rev.id}
                className="bg-white border border-gray-200 hover:border-gray-250 rounded-2xl p-5 space-y-4 shadow-sm flex flex-col justify-between"
                id={`reviewer-card-${rev.id}`}
              >
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <img 
                      src={rev.avatar} 
                      alt={rev.name} 
                      referrerPolicy="no-referrer"
                      className="w-11 h-11 rounded-full border border-gray-200 shadow-inner bg-neutral-150" 
                    />
                    <div>
                      <h3 className="font-bold text-gray-950 text-sm font-display">{rev.name}</h3>
                      <div className="flex items-center gap-1 font-mono text-[9px] text-gray-400 font-bold mt-0.5">
                        <span>ID: {rev.id}</span>
                        <span>•</span>
                        <span className="text-indigo-700 uppercase">Weight: {weight.toFixed(2)}w</span>
                      </div>
                    </div>
                  </div>

                  {/* Performance metrics breakdown stack */}
                  <div className="space-y-2 text-xs font-mono pt-3 border-t border-gray-100">
                    <div className="flex justify-between">
                      <span className="text-gray-405">Review Decisions:</span>
                      <span className="font-bold text-gray-800">
                        {rev.approval_count} A / {reject_count} R
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-450">Fails / Rollbacks:</span>
                      <span className="font-bold text-red-700">{rev.rollback_count} rollbacks</span>
                    </div>

                    {/* v0.6 COHEN'S KAPPA & CALIBRATION */}
                    <div className="p-2.5 bg-neutral-50 rounded-xl border border-gray-200 space-y-1 text-[10px]">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-450 font-sans font-bold text-[8.5px] uppercase">Cohen's Kappa (Agreement):</span>
                        <strong className="text-indigo-700 font-bold">k = {kappa.toFixed(2)}</strong>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-450 font-sans font-bold text-[8.5px] uppercase">High Risk SLA Accuracy:</span>
                        <strong className="text-neutral-800">{highRiskAcc}%</strong>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-450 font-sans font-bold text-[8.5px] uppercase">Decision Noise Drift:</span>
                        <strong className={`font-bold ${driftVal > 5 ? "text-amber-700" : "text-emerald-700"}`}>
                          {driftVal > 0 ? `+${driftVal}% leniency` : `${driftVal}% strict`}
                        </strong>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[10.5px]">
                      <div className="bg-neutral-50 p-2 rounded-lg border border-gray-150">
                        <span className="text-gray-400 block font-sans font-bold text-[8px] leading-tight">FALSE POSITIVE</span>
                        <strong className="text-amber-700 text-xs">{rev.false_positive_rate}%</strong>
                      </div>
                      <div className="bg-neutral-50 p-2 rounded-lg border border-gray-150">
                        <span className="text-gray-400 block font-sans font-bold text-[8px] leading-tight">FALSE NEGATIVE</span>
                        <strong className="text-red-700 text-xs">{rev.false_negative_rate}%</strong>
                      </div>
                    </div>

                    {/* Progress bars indicators */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px]">
                        <span className="text-gray-400">Decision Calibration Score:</span>
                        <span className="font-bold text-emerald-700">{rev.reliability_score}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-emerald-500 rounded-full" 
                          style={{ width: `${rev.reliability_score}%` }}
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px]">
                        <span className="text-gray-400">Analyst Risk Weight:</span>
                        <span className={`font-bold ${rev.risk_score > 15 ? "text-red-700 animate-pulse" : "text-gray-500"}`}>{rev.risk_score}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${rev.risk_score > 15 ? "bg-red-500" : "bg-neutral-500"}`} 
                          style={{ width: `${rev.risk_score}%` }}
                        />
                      </div>
                    </div>

                    {/* reliability sparkline */}
                    <div className="space-y-1 pt-1">
                      <span className="text-[9.5px] text-gray-400 block font-bold">Reliability History Sparkline:</span>
                      <div className="flex items-end gap-1 h-10 px-2 justify-between bg-neutral-50 rounded-xl border border-gray-150 py-1">
                        {trend.map((val, idx) => (
                          <div 
                            key={idx} 
                            style={{ height: `${val}%` }} 
                            className={`w-4 rounded-t-xs transition-all pointer-events-none ${
                              val > 80 
                                ? "bg-emerald-500" 
                                : val > 50 
                                ? "bg-amber-400" 
                                : "bg-red-500 animate-pulse"
                            }`}
                            title={`Audit Tick ${idx + 1}: ${val}%`}
                          />
                        ))}
                      </div>
                    </div>

                  </div>
                </div>

                {/* Audit Decision validation */}
                <button
                  disabled={isSimulating}
                  onClick={() => onAuditReviewer(rev.id)}
                  id={`audit-btn-${rev.id}`}
                  className="w-full mt-4 inline-flex items-center justify-center py-2 bg-neutral-900 border border-neutral-900 text-white hover:bg-neutral-850 rounded-xl text-xs font-mono font-bold select-none cursor-pointer duration-150 disabled:opacity-50"
                >
                  <RefreshCw size={11} className={`mr-1.5 ${isSimulating ? "animate-spin" : ""}`} />
                  Audit Decision Trust
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
