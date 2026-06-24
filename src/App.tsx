import React, { useState, useEffect } from "react";
import Header from "./components/Header.tsx";
import ContractsSection from "./components/ContractsSection.tsx";
import CircuitBreakersSection from "./components/CircuitBreakersSection.tsx";
import EvidenceHubSection from "./components/EvidenceHubSection.tsx";
import AdoptionSection from "./components/AdoptionSection.tsx";
import EnterpriseSection from "./components/EnterpriseSection.tsx";
import OnboardingDemo from "./components/OnboardingDemo.tsx";
import BusinessLanding from "./components/BusinessLanding.tsx";
import { DashboardData } from "./types.ts";
import { 
  ShieldCheck, 
  Activity, 
  Layers, 
  Zap, 
  Terminal,
  Code2,
  Copy,
  Check,
  Sparkles,
  Building2,
  Play,
  TrendingUp
} from "lucide-react";

export default function App() {
  const [data, setData] = useState<DashboardData>({
    contracts: [],
    breakers: [],
    traces: [],
    integrations: []
  });

  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>("Business Value");
  const [copied, setCopied] = useState(false);

  const fetchDashboard = async () => {
    try {
      const resp = await fetch("/api/dashboard");
      if (resp.ok) {
        const json = await resp.json();
        setData({
          contracts: json.contracts || [],
          breakers: json.breakers || [],
          traces: json.traces || [],
          integrations: json.integrations || []
        });
      }
    } catch (err) {
      console.error("Failed to fetch dashboard data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
    const interval = setInterval(fetchDashboard, 5000); // Poll for logs
    return () => clearInterval(interval);
  }, []);

  const handleReset = async () => {
    await fetch("/api/reset", { method: "POST" });
    fetchDashboard();
  };

  const copyToClipboard = () => {
    const code = `import { PhantomSDK } from "@phantomos/sdk";

const phantom = new PhantomSDK({ 
  endpoint: "https://firewall.phantom.os",
  apiKey: process.env.PHANTOM_KEY 
});

// Protect your agent call
const result = await phantom.guard({
  agentId: "customer-service-bot",
  task: "Process refund for order #1234",
  execute: async (task) => {
    return await myAgent.run(task);
  }
});

if (result.allowed) {
  console.log("Action safe:", result.result);
} else {
  console.error("Action blocked:", result.reason);
}`;
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const tabs = [
    { name: "Business Value", icon: TrendingUp },
    { name: "Product Tour", icon: Play },
    { name: "Audit Logs", icon: Activity },
    { name: "Firewall Policies", icon: Layers },
    { name: "Circuit Breakers", icon: Zap },
    { name: "Adoption Toolkit", icon: Sparkles },
    { name: "Enterprise Readiness", icon: Building2 },
    { name: "SDK Quickstart", icon: Code2 },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center font-sans">
        <div className="text-center space-y-3">
          <div className="h-8 w-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-neutral-500 font-mono tracking-wider uppercase">Loading Firewall Logs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col font-sans text-neutral-200 antialiased">
      <Header onClearDb={handleReset} isSimulating={false} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* Stats Header */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-4">
            <p className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest mb-1">Active Policies</p>
            <p className="text-2xl font-bold text-white">{data.contracts.length}</p>
          </div>
          <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-4">
            <p className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest mb-1">Total Audits</p>
            <p className="text-2xl font-bold text-white">{data.traces.length}</p>
          </div>
          <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-4">
            <p className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest mb-1">Blocked Actions</p>
            <p className="text-2xl font-bold text-rose-500">{data.traces.filter(t => t.outcome === 'BLOCKED_GOVERNANCE').length}</p>
          </div>
          <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-4">
            <p className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest mb-1">Open Circuits</p>
            <p className="text-2xl font-bold text-amber-500">{data.breakers.filter(b => b.state === 'OPEN').length}</p>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex border-b border-neutral-800 py-1">
          <div className="flex space-x-1">
            {tabs.map(tab => {
              const TabIcon = tab.icon;
              const isActive = activeTab === tab.name;
              return (
                <button
                  key={tab.name}
                  onClick={() => setActiveTab(tab.name)}
                  className={`inline-flex items-center px-4 py-2 rounded-xl text-xs font-semibold duration-150 gap-2 whitespace-nowrap ${
                    isActive 
                      ? "bg-white text-black" 
                      : "text-neutral-500 hover:text-white hover:bg-neutral-900"
                  }`}
                >
                  <TabIcon size={14} />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="min-h-[500px]">
          {activeTab === "Business Value" && (
            <BusinessLanding onStartSimulation={() => setActiveTab("Product Tour")} />
          )}

          {activeTab === "Product Tour" && (
            <OnboardingDemo />
          )}

          {activeTab === "Audit Logs" && (
            <EvidenceHubSection traces={data.traces} />
          )}

          {activeTab === "Firewall Policies" && (
            <ContractsSection contracts={data.contracts} capabilities={[]} />
          )}

          {activeTab === "Circuit Breakers" && (
            <CircuitBreakersSection breakers={data.breakers} onReopen={() => {}} />
          )}

          {activeTab === "Adoption Toolkit" && (
            <AdoptionSection />
          )}

          {activeTab === "Enterprise Readiness" && (
            <EnterpriseSection />
          )}

          {activeTab === "SDK Quickstart" && (
            <div className="space-y-6 max-w-4xl">
              <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-2xl">
                <div className="bg-neutral-800/50 px-4 py-3 flex items-center justify-between border-b border-neutral-700/50">
                  <div className="flex items-center gap-2">
                    <Terminal size={14} className="text-neutral-400" />
                    <span className="text-[10px] font-mono text-neutral-300 uppercase tracking-widest">SDK Integration</span>
                  </div>
                  <button 
                    onClick={copyToClipboard}
                    className="p-1.5 hover:bg-neutral-700 rounded-lg transition-colors text-neutral-400 hover:text-white"
                  >
                    {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                  </button>
                </div>
                <div className="p-6 font-mono text-xs leading-relaxed overflow-x-auto bg-[#0d1117]">
                  <pre className="text-neutral-300">
                    <code className="language-typescript">
{`// 1. Install SDK
npm install @phantomos/core

// 2. Wrap Agent Dispatches
import { PhantomSDK } from "@phantomos/core";

const phantom = new PhantomSDK({ 
  endpoint: "https://audit.phantom.os",
  apiKey: "pt-..." 
});

const result = await phantom.guard({
  agentId: "order-management",
  task: "DELETE FROM orders WHERE id=5",
  execute: async (task) => {
    return await db.query(task);
  }
});

if (result.allowed) {
  // result.result contains execution output
} else {
  // result.reason contains firewall rejection details
}`}
                    </code>
                  </pre>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-6 bg-neutral-900/30 border border-neutral-800 rounded-2xl space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center mb-2">
                    <ShieldCheck size={16} className="text-indigo-400" />
                  </div>
                  <h4 className="text-sm font-bold text-white">Interceptor Guard</h4>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    Automatically checks task descriptions against Behavioral Contracts and global security patterns before the agent executes.
                  </p>
                </div>
                <div className="p-6 bg-neutral-900/30 border border-neutral-800 rounded-2xl space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center mb-2">
                    <Activity size={16} className="text-emerald-400" />
                  </div>
                  <h4 className="text-sm font-bold text-white">Post-Audit Verification</h4>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    Synchronizes execution outcomes back to the governance layer for shadow verification and trust score calibration.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="bg-neutral-950 border-t border-neutral-900 py-8 text-[11px] text-neutral-600 font-mono">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <p>PHANTOM_FIREWALL v2.0 // STATUS: NOMINAL</p>
          </div>
          <div className="flex gap-6">
            <span>AUDIT_ENPOINT: /api/audit</span>
            <span>LATENCY: 12ms</span>
            <span>SLA: 99.99%</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
