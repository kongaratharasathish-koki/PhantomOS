import React, { useState } from "react";
import { motion } from "motion/react";
import { 
  ShieldAlert, 
  ShieldCheck, 
  Zap, 
  Lock, 
  BarChart3, 
  TrendingUp, 
  Users, 
  Building2, 
  Server,
  ChevronRight,
  Target,
  ArrowRight
} from "lucide-react";

export default function BusinessLanding({ onStartSimulation }: { onStartSimulation: () => void }) {
  const [agents, setAgents] = useState(10);
  const [incidents, setIncidents] = useState(2);
  const [costPerIncident, setCostPerIncident] = useState(50000);

  const riskReduction = agents * incidents * costPerIncident * 0.95; // Assuming 95% protection

  return (
    <div className="space-y-24 pb-24">
      {/* Hero Section */}
      <section className="text-center space-y-8 pt-12 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(99,102,241,0.1),transparent)] pointer-events-none" />
        
        <div className="space-y-4 relative z-10">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-bold text-white tracking-tight leading-tight"
          >
            Stop AI Agents Before <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-indigo-600">
              They Cause Damage
            </span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl text-neutral-400 max-w-3xl mx-auto leading-relaxed"
          >
            PhantomOS sits between your AI agents and production systems, blocking dangerous actions before they execute.
          </motion.p>
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10"
        >
          <button 
            onClick={onStartSimulation}
            className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl transition-all shadow-xl shadow-indigo-500/20 flex items-center gap-2 group"
          >
            Run Live Attack Simulation
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
          <button className="px-8 py-4 bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-white font-bold rounded-2xl transition-all">
            Book a Security Audit
          </button>
        </motion.div>
      </section>

      {/* Value Cards */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            title: "Prevent Destructive Commands",
            desc: "Instantly block commands that delete databases, exfiltrate secrets, or wipe infrastructure.",
            icon: ShieldAlert,
            color: "rose"
          },
          {
            title: "Control Agent Permissions",
            desc: "Define precise 'Behavioral Contracts' specifying exactly what tools each agent can use.",
            icon: Lock,
            color: "indigo"
          },
          {
            title: "Compliance Audit Trails",
            desc: "Maintain an immutable, cryptographically-signed record of every agent decision.",
            icon: BarChart3,
            color: "emerald"
          },
          {
            title: "Stop Runaway Agents",
            desc: "Automatic circuit breakers quarantine agents that repeatedly violate security policies.",
            icon: Zap,
            color: "amber"
          }
        ].map((card, idx) => (
          <motion.div 
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            viewport={{ once: true }}
            className="p-8 bg-neutral-900/50 border border-neutral-800 rounded-3xl hover:border-neutral-700 transition-all space-y-6"
          >
            <div className={`w-12 h-12 rounded-2xl bg-${card.color}-500/10 flex items-center justify-center`}>
              <card.icon className={`text-${card.color}-500`} size={24} />
            </div>
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-white">{card.title}</h3>
              <p className="text-sm text-neutral-500 leading-relaxed">{card.desc}</p>
            </div>
          </motion.div>
        ))}
      </section>

      {/* ROI Calculator */}
      <section className="bg-neutral-900 border border-neutral-800 rounded-[3rem] p-8 md:p-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-8">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-white tracking-tight">Live ROI Calculator</h2>
            <p className="text-neutral-500">Quantify the business value of agent governance.</p>
          </div>

          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-sm font-bold text-neutral-400">Number of Agents</label>
                <span className="text-indigo-400 font-mono font-bold">{agents}</span>
              </div>
              <input 
                type="range" min="1" max="100" value={agents} 
                onChange={(e) => setAgents(parseInt(e.target.value))}
                className="w-full accent-indigo-500"
              />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-sm font-bold text-neutral-400">Estimated Incidents / Year</label>
                <span className="text-indigo-400 font-mono font-bold">{incidents}</span>
              </div>
              <input 
                type="range" min="1" max="20" value={incidents} 
                onChange={(e) => setIncidents(parseInt(e.target.value))}
                className="w-full accent-indigo-500"
              />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-sm font-bold text-neutral-400">Avg. Outage Cost ($)</label>
                <span className="text-indigo-400 font-mono font-bold">${costPerIncident.toLocaleString()}</span>
              </div>
              <input 
                type="range" min="10000" max="500000" step="10000" value={costPerIncident} 
                onChange={(e) => setCostPerIncident(parseInt(e.target.value))}
                className="w-full accent-indigo-500"
              />
            </div>
          </div>
        </div>

        <div className="bg-neutral-950 border border-neutral-800 rounded-[2.5rem] p-10 space-y-8 text-center">
          <div className="space-y-2">
            <p className="text-sm font-mono text-neutral-500 uppercase tracking-widest">Estimated Risk Reduction</p>
            <p className="text-6xl font-bold text-white tracking-tighter">
              ${(riskReduction / 1000000).toFixed(1)}M
            </p>
            <p className="text-sm text-neutral-500">per year in avoided damage</p>
          </div>
          
          <div className="pt-8 border-t border-neutral-900 grid grid-cols-2 gap-4">
            <div>
              <p className="text-[10px] font-mono text-neutral-600 uppercase">Protection Rate</p>
              <p className="text-xl font-bold text-emerald-500">95%</p>
            </div>
            <div>
              <p className="text-[10px] font-mono text-neutral-600 uppercase">Deployment Time</p>
              <p className="text-xl font-bold text-indigo-400">&lt; 10m</p>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Scenarios */}
      <section className="space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold text-white">Vertical-Specific Governance</h2>
          <p className="text-neutral-500">Tailored protection for high-stakes industries.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              industry: "FinTech",
              outcome: "Prevent unauthorized account modifications.",
              icon: TrendingUp,
              points: ["Block mass balance adjustments", "Audit high-value transactions", "Verify AML compliance"]
            },
            {
              industry: "HealthTech",
              outcome: "Prevent patient data exposure.",
              icon: Users,
              points: ["Anonymize PII automatically", "Verify HIPAA data boundaries", "Log every record access"]
            },
            {
              industry: "DevOps",
              outcome: "Prevent destructive infrastructure changes.",
              icon: Server,
              points: ["Block production database drops", "Verify IAM role escalations", "Intercept dangerous shell scripts"]
            }
          ].map((item) => (
            <div key={item.industry} className="p-8 bg-neutral-900 border border-neutral-800 rounded-3xl space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center">
                  <item.icon className="text-indigo-400" size={20} />
                </div>
                <h3 className="text-lg font-bold text-white">{item.industry}</h3>
              </div>
              <p className="text-sm text-white font-medium">{item.outcome}</p>
              <ul className="space-y-3">
                {item.points.map(point => (
                  <li key={point} className="flex items-center gap-2 text-xs text-neutral-500">
                    <ChevronRight size={14} className="text-indigo-500" />
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Trust Section */}
      <section className="bg-neutral-950 border border-neutral-900 rounded-[3rem] p-12 overflow-hidden relative">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-12 text-center">
          {[
            { label: "Latency", val: "<15ms" },
            { label: "Audit Integrity", val: "SHA-256" },
            { label: "Integrity", val: "HMAC" },
            { label: "Deployment", val: "Multi-Tenant" },
            { label: "Resilience", val: "Circuit Breakers" }
          ].map(item => (
            <div key={item.label} className="space-y-2">
              <p className="text-2xl font-bold text-white tracking-tight">{item.val}</p>
              <p className="text-[10px] font-mono text-neutral-600 uppercase tracking-widest">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 text-center space-y-12 bg-indigo-600 rounded-[3rem] relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
        <div className="relative z-10 space-y-6">
          <h2 className="text-4xl md:text-5xl font-bold text-white">Deploy AI Agents Without Fear</h2>
          <p className="text-indigo-100 text-lg max-w-2xl mx-auto">
            Join the forward-thinking enterprises securing their agentic future with PhantomOS.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="px-10 py-5 bg-white text-indigo-600 font-bold rounded-2xl hover:bg-neutral-100 transition-all shadow-2xl">
              Start Your Free Pilot
            </button>
            <button className="px-10 py-5 bg-indigo-700 text-white font-bold rounded-2xl hover:bg-indigo-800 transition-all">
              Talk to a Security Expert
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
