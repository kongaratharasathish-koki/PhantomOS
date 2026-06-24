import React from "react";
import { Building2, ShieldCheck, Users, Lock, HardDrive, Key, Globe, FileCheck } from "lucide-react";

export default function EnterpriseSection() {
  const tenants = [
    { id: 'tenant-default', name: 'PhantomOS Internal', agents: 4, usage: '82%' },
    { id: 'tenant-acme', name: 'Acme Corp', agents: 12, usage: '14%' },
    { id: 'tenant-globex', name: 'Globex Corp', agents: 8, usage: '45%' },
  ];

  const roles = [
    { name: 'Admin', description: 'Full access to all contracts, audits, and tenant settings.', count: 2 },
    { name: 'Security Reviewer', description: 'Can sign contracts and review security incidents.', count: 5 },
    { name: 'Developer', description: 'Can create contracts and view audit logs for their agents.', count: 24 },
    { name: 'Auditor', description: 'Read-only access to immutable evidence hub.', count: 3 },
  ];

  return (
    <div className="space-y-8" id="enterprise-section">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Multi-Tenant Isolation */}
        <section className="lg:col-span-2 bg-neutral-900 border border-neutral-800 rounded-3xl p-8 space-y-6">
          <div className="flex items-center gap-4">
            <div className="bg-indigo-500/10 p-3 rounded-2xl border border-indigo-500/20">
              <Building2 className="text-indigo-400" size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">Multi-Tenant Governance</h2>
              <p className="text-sm text-neutral-500 font-mono">Isolated environments for SaaS and Enterprise deployments.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {tenants.map(t => (
              <div key={t.id} className="bg-neutral-950 border border-neutral-800 p-5 rounded-2xl space-y-3 hover:border-indigo-500/30 transition cursor-pointer group">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-indigo-400 font-mono tracking-widest uppercase">Active Tenant</span>
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                </div>
                <h3 className="text-sm font-bold text-white font-mono">{t.name}</h3>
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] text-neutral-500 font-mono uppercase">
                    <span>Agents</span>
                    <span>{t.agents}</span>
                  </div>
                  <div className="flex justify-between text-[10px] text-neutral-500 font-mono uppercase">
                    <span>Quota</span>
                    <span>{t.usage}</span>
                  </div>
                </div>
                <div className="h-1 bg-neutral-900 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500" style={{ width: t.usage }} />
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-neutral-800 grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: HardDrive, label: 'Isolated DBs' },
              { icon: Key, label: 'Key Isolation' },
              { icon: Globe, label: 'Network Pol.' },
              { icon: FileCheck, label: 'Audit Chains' },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-2 text-neutral-600">
                <item.icon size={12} />
                <span className="text-[10px] font-bold font-mono uppercase tracking-widest">{item.label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* RBAC Control */}
        <section className="bg-neutral-900 border border-neutral-800 rounded-3xl p-8 space-y-6">
          <div className="flex items-center gap-4">
            <div className="bg-emerald-500/10 p-3 rounded-2xl border border-emerald-500/20">
              <ShieldCheck className="text-emerald-400" size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">Access Control (RBAC)</h2>
              <p className="text-sm text-neutral-500 font-mono">Enforce granular permissions.</p>
            </div>
          </div>

          <div className="space-y-4">
            {roles.map(role => (
              <div key={role.name} className="p-4 bg-neutral-950 border border-neutral-800 rounded-2xl space-y-2 relative group overflow-hidden">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Lock size={12} className="text-neutral-500" />
                    <span className="text-xs font-bold text-white font-mono uppercase tracking-widest">{role.name}</span>
                  </div>
                  <span className="text-[10px] font-mono text-neutral-600">{role.count} Users</span>
                </div>
                <p className="text-[11px] text-neutral-500 leading-relaxed italic">{role.description}</p>
                <div className="absolute inset-y-0 right-0 w-1 bg-emerald-500 transform translate-x-1 group-hover:translate-x-0 transition" />
              </div>
            ))}
          </div>
          
          <button className="w-full py-3 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-bold rounded-xl transition border border-neutral-700 text-xs flex items-center justify-center gap-2">
            <Users size={14} />
            Manage Team Access
          </button>
        </section>
      </div>

      {/* Compliance & Export */}
      <section className="bg-neutral-900 border border-neutral-800 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-1">
          <h2 className="text-lg font-bold text-white tracking-tight">Compliance Export Engine</h2>
          <p className="text-sm text-neutral-500 font-mono italic text-balance">Generate SOC2 / ISO 27001 evidence reports directly from the immutable audit chain.</p>
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <button className="flex-1 md:px-6 py-3 bg-neutral-950 border border-neutral-800 text-neutral-300 rounded-xl hover:bg-neutral-800 transition font-mono text-xs font-bold">
            JSON EXPORT
          </button>
          <button className="flex-1 md:px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-500 transition font-mono text-xs font-bold shadow-lg shadow-indigo-500/20">
            GENERATE PDF REPORT
          </button>
        </div>
      </section>
    </div>
  );
}
