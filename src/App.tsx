import React, { useState, useEffect } from "react";
import Header from "./components/Header.tsx";
import OverviewSection from "./components/OverviewSection.tsx";
import LifecycleSection from "./components/LifecycleSection.tsx";
import SkillInventorySection from "./components/SkillInventorySection.tsx";
import FailureIndexSection from "./components/FailureIndexSection.tsx";
import ZombieHunterSection from "./components/ZombieHunterSection.tsx";
import CircuitBreakersSection from "./components/CircuitBreakersSection.tsx";
import ReviewerSection from "./components/ReviewerSection.tsx";
import ContractsSection from "./components/ContractsSection.tsx";
import CompositionSafetySection from "./components/CompositionSafetySection.tsx";
import TraceViewer from "./components/TraceViewer.tsx";
import SandboxPanel from "./components/SandboxPanel.tsx";
import EvidenceHubSection from "./components/EvidenceHubSection.tsx";
import ProductionValidationSection from "./components/ProductionValidationSection.tsx";
import { DashboardData } from "./types.ts";
import { 
  Activity, 
  Layers, 
  Trash2, 
  AlertOctagon, 
  Users, 
  ShieldCheck, 
  ServerCrash, 
  HeartPulse, 
  Command,
  TrendingUp,
  Cpu
} from "lucide-react";

export default function App() {
  const [data, setData] = useState<DashboardData>({
    capabilities: [],
    contracts: [],
    failures: [],
    breakers: [],
    reviewers: [],
    zombies: [],
    traces: [],
    timeline: [],
    system_frozen: false
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSimulating, setIsSimulating] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("Overview");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Fetch initial dashboard state
  const fetchDashboard = async () => {
    try {
      const resp = await fetch("/api/dashboard");
      if (resp.ok) {
        const json = await resp.json();
        setData(json);
      } else {
        console.error("Failed to load dashboard data");
      }
    } catch (err) {
      console.error("Failed to fetch dashboard data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  // Show quick success flash toast
  const showSuccess = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 4000);
  };

  // Reset database state back to baseline
  const handleClearDb = async () => {
    setIsSimulating(true);
    try {
      const resp = await fetch("/api/reset", { method: "POST" });
      if (resp.ok) {
        await fetchDashboard();
        showSuccess("Database state successfully restored back to baseline startup defaults.");
      }
    } catch (err) {
      console.error("Reset error:", err);
    } finally {
      setIsSimulating(false);
    }
  };

  // Advance simulation cycle (passage of time / decay)
  const handleAdvanceTime = async () => {
    setIsSimulating(true);
    try {
      const resp = await fetch("/api/simulate/tick", { method: "POST" });
      if (resp.ok) {
        await fetchDashboard();
        showSuccess("Simulated cycle passage: confidence decayed & Garbage Collector sweep finalized.");
      }
    } catch (err) {
      console.error("Time tick failed:", err);
    } finally {
      setIsSimulating(false);
    }
  };

  // Run dynamic verification trials
  const handleExecuteTrial = async (
    capabilityId: string, 
    taskDescription: string, 
    forceFail: boolean, 
    failType: string
  ) => {
    setIsSimulating(true);
    try {
      const resp = await fetch(`/api/capabilities/${capabilityId}/execute`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          task_description: taskDescription,
          trigger_failure: forceFail,
          failure_type: failType
        })
      });

      if (resp.ok) {
        const result = await resp.json();
        await fetchDashboard();
        
        if (result.success) {
          showSuccess(`Verification trial PASSED on cap: "${result.execution.task_description}".`);
        } else {
          setErrorMessage(`Verification Trial ERROR! Circuit Breaker: ${result.circuit_breaker?.state}. Outcome: ${result.outcome}.`);
          setTimeout(() => setErrorMessage(null), 6000);
        }
        
        // Auto route to Operational Traces to witness flow!
        setActiveTab("Operational Traces");
      }
    } catch (err) {
      console.error("Execution failed:", err);
    } finally {
      setIsSimulating(false);
    }
  };

  // Decisive restoration of a Quarantined skill by human auditor
  const handleRestoreCapability = async (id: string) => {
    setIsSimulating(true);
    try {
      const resp = await fetch(`/api/capabilities/${id}/restore`, { method: "POST" });
      if (resp.ok) {
        await fetchDashboard();
        showSuccess("Human Operator verified capability integrity. Re-routed back to ACTIVE pool.");
        setActiveTab("Skill Inventory");
      }
    } catch (err) {
      console.error("Restore failed:", err);
    } finally {
      setIsSimulating(false);
    }
  };

  // Permanent pruning/archival of a Zombie Skill
  const handleArchiveCapability = async (id: string) => {
    setIsSimulating(true);
    try {
      const resp = await fetch(`/api/capabilities/${id}/archive`, { method: "POST" });
      if (resp.ok) {
        await fetchDashboard();
        showSuccess("Organizational redundancy cleared. Decayed asset safely retired from active path.");
        setActiveTab("Zombie Hunter");
      }
    } catch (err) {
      console.error("Archive failed:", err);
    } finally {
      setIsSimulating(false);
    }
  };

  // Run Operator Decision Trust audit
  const handleAuditReviewer = async (id: string) => {
    setIsSimulating(true);
    try {
      const resp = await fetch(`/api/reviewers/${id}/audit`, { method: "POST" });
      if (resp.ok) {
        await fetchDashboard();
        showSuccess("Audit successful. Recalculated analyst false positive / negative rates.");
      }
    } catch (err) {
      console.error("Audit failed:", err);
    } finally {
      setIsSimulating(false);
    }
  };

  // Clear system freeze stopping blocks
  const handleUnfreezeSystem = async () => {
    setIsSimulating(true);
    try {
      const resp = await fetch("/api/system/unfreeze", { method: "POST" });
      if (resp.ok) {
        await fetchDashboard();
        showSuccess("SYSTEM UNCONSTRAINED: Hard stopping locks cleared. Handshake channels certified.");
      }
    } catch (err) {
      console.error("Unfreeze error:", err);
    } finally {
      setIsSimulating(false);
    }
  };

  // Tab definitions
  const tabs = [
    { name: "Overview", icon: Command },
    { name: "Evidence & Verification", icon: ShieldCheck },
    { name: "Lifecycle Engine", icon: HeartPulse },
    { name: "Skill Inventory", icon: TrendingUp },
    { name: "Composition Safety", icon: Layers },
    { name: "Failure Index", icon: ServerCrash },
    { name: "Zombie Hunter", icon: Trash2 },
    { name: "Circuit Breakers", icon: AlertOctagon },
    { name: "Reviewer Reliability", icon: Users },
    { name: "Contracts", icon: ShieldCheck },
    { name: "Operational Traces", icon: Activity }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center font-sans">
        <div className="text-center space-y-3">
          <div className="h-8 w-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-gray-500 font-mono tracking-wider uppercase">Loading Continuous Verification Ledger...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col font-sans text-gray-800 antialiased selection:bg-indigo-120">
      <Header onClearDb={handleClearDb} isSimulating={isSimulating} />

      {/* Main Content Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* Toast Status Alerts */}
        <div className="space-y-3">
          {successToast && (
            <div className="bg-emerald-600 text-white p-4 rounded-2xl text-xs font-mono font-bold flex items-center gap-2.5 shadow-lg animate-fade-in">
              <CheckBadge />
              <span>{successToast}</span>
            </div>
          )}

          {errorMessage && (
            <div className="bg-rose-600 text-white p-4 rounded-2xl text-xs font-mono font-bold flex items-center gap-2.5 shadow-lg animate-slide-in">
              <AlertOctagon size={16} />
              <span>{errorMessage}</span>
            </div>
          )}
        </div>

        {/* 2-Column Responsive Panel Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Column A: Left Main Workspace (Tabs + Contents) */}
          <div className="lg:col-span-8 xl:col-span-9 space-y-6 min-w-0">
            
            {/* Nav Pill bar */}
            <div className="flex border-b border-gray-200 overflow-x-auto py-1 scrollbar-thin">
              <div className="flex space-x-1 pl-1">
                {tabs.map(tab => {
                  const TabIcon = tab.icon;
                  const isActive = activeTab === tab.name;
                  return (
                    <button
                      key={tab.name}
                      id={`tab-${tab.name.toLowerCase().replace(/\s+/g, '-')}`}
                      onClick={() => setActiveTab(tab.name)}
                      className={`inline-flex items-center px-4 py-2 rounded-xl text-xs font-semibold select-none cursor-pointer duration-150 gap-2 whitespace-nowrap ${
                        isActive 
                          ? "bg-neutral-900 text-white shadow-xs" 
                          : "text-gray-500 hover:text-gray-900 hover:bg-neutral-100"
                      }`}
                    >
                      <TabIcon size={14} className={isActive ? "text-white" : "text-gray-400"} />
                      <span>{tab.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Active Workspace renderer */}
            <div className="py-1">
              {activeTab === "Overview" && (
                <OverviewSection 
                  capabilities={data.capabilities}
                  breakers={data.breakers}
                  failures={data.failures}
                  zombies={data.zombies}
                  timeline={data.timeline}
                  system_frozen={!!data.system_frozen}
                  onUnfreeze={handleUnfreezeSystem}
                  onSelectTab={(tabName) => setActiveTab(tabName)}
                />
              )}

              {activeTab === "Evidence & Verification" && (
                <EvidenceHubSection 
                  capabilities={data.capabilities}
                  failures={data.failures}
                  breakers={data.breakers}
                  reviewers={data.reviewers}
                  traces={data.traces}
                  onTriggerFailure={(capId, failType) => handleExecuteTrial(capId, `Stress-inject target probe: ${failType}`, true, failType)}
                  isSimulating={isSimulating}
                />
              )}

              {activeTab === "Lifecycle Engine" && (
                <LifecycleSection 
                  capabilities={data.capabilities}
                  onRestore={handleRestoreCapability}
                />
              )}

              {activeTab === "Skill Inventory" && (
                <SkillInventorySection 
                  capabilities={data.capabilities}
                  onExecuteTrial={handleExecuteTrial}
                  isSimulating={isSimulating}
                />
              )}

              {activeTab === "Composition Safety" && (
                <CompositionSafetySection 
                  capabilities={data.capabilities}
                  contracts={data.contracts}
                />
              )}

              {activeTab === "Failure Index" && (
                <FailureIndexSection 
                  failures={data.failures}
                  capabilities={data.capabilities}
                />
              )}

              {activeTab === "Zombie Hunter" && (
                <ZombieHunterSection 
                  zombies={data.zombies}
                  capabilities={data.capabilities}
                  onArchive={handleArchiveCapability}
                  onRestore={handleRestoreCapability}
                  isSimulating={isSimulating}
                />
              )}

              {activeTab === "Circuit Breakers" && (
                <CircuitBreakersSection 
                  breakers={data.breakers}
                  capabilities={data.capabilities}
                  onTriggerFailure={(capId, failType) => handleExecuteTrial(capId, `Defensive failure trigger probe: ${failType}.`, true, failType)}
                  onRestore={handleRestoreCapability}
                  isSimulating={isSimulating}
                />
              )}

              {activeTab === "Reviewer Reliability" && (
                <ReviewerSection 
                  reviewers={data.reviewers}
                  onAuditReviewer={handleAuditReviewer}
                  isSimulating={isSimulating}
                  capabilities={data.capabilities}
                />
              )}

              {activeTab === "Contracts" && (
                <ContractsSection 
                  contracts={data.contracts}
                  capabilities={data.capabilities}
                />
              )}

              {activeTab === "Operational Traces" && (
                <TraceViewer 
                  traces={data.traces}
                  capabilities={data.capabilities}
                />
              )}
            </div>

          </div>

          {/* Column B: Right Persistent Sandbox Panel */}
          <div className="lg:col-span-4 xl:col-span-3 lg:sticky lg:top-6 space-y-4">
            <SandboxPanel
              capabilities={data.capabilities}
              isSimulating={isSimulating}
              onExecuteTrial={handleExecuteTrial}
              onAdvanceTime={handleAdvanceTime}
              onResetDb={handleClearDb}
            />
          </div>

        </div>
      </main>

      {/* Footer Branding */}
      <footer className="bg-white border-t border-gray-200 py-6 mt-12 text-center text-[11px] text-gray-400 font-mono">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>
            © {new Date().getFullYear()} PhantomOS Technology Inc. All defensive borders certified.
          </p>
          <div className="flex gap-4">
            <span>SLA Mode: Strict Selection Engine</span>
            <span>v0.4 Continuous Verification</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Inline svg icons so we don't import buggy external packs
function CheckBadge() {
  return (
    <svg className="w-4 h-4 text-emerald-300 stroke-current shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth="2.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
    </svg>
  );
}
