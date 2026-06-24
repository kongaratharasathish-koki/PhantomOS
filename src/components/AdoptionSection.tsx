import React, { useState } from "react";
import { Sparkles, Play, Bell, CheckCircle2, AlertTriangle, Terminal, Copy, Check, Plus, Trash2, Send } from "lucide-react";
import { AlertDestination } from "../types";

export default function AdoptionSection() {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedYaml, setGeneratedYaml] = useState("");
  const [copyStatus, setCopyStatus] = useState(false);

  const [simYaml, setSimYaml] = useState("");
  const [simReport, setSimReport] = useState<any>(null);
  const [isSimulating, setIsSimulating] = useState(false);

  const [alerts, setAlerts] = useState<AlertDestination[]>([]);
  const [newWebhook, setNewWebhook] = useState("");

  const handleGenerate = async () => {
    if (!prompt) return;
    setIsGenerating(true);
    try {
      const resp = await fetch("/api/contracts/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt })
      });
      if (resp.ok) {
        const data = await resp.json();
        setGeneratedYaml(data.yaml);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSimulate = async () => {
    if (!simYaml) return;
    setIsSimulating(true);
    try {
      // Very naive YAML to JSON for simulation
      const mockContract = { 
        allowed_tools: simYaml.includes("allowed_tools") ? ["found"] : [],
        risk_tier: simYaml.includes("risk_tier: CRITICAL") ? "CRITICAL" : "MEDIUM",
        shadow_mode: simYaml.includes("shadow_mode: true")
      };
      const resp = await fetch("/api/contracts/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contract: mockContract })
      });
      if (resp.ok) {
        setSimReport(await resp.json());
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSimulating(false);
    }
  };

  const handleAddAlert = async () => {
    if (!newWebhook) return;
    const resp = await fetch("/api/alerts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "WEBHOOK",
        config: { url: newWebhook },
        enabled: true
      })
    });
    if (resp.ok) {
      const added = await resp.json();
      setAlerts([...alerts, added]);
      setNewWebhook("");
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedYaml);
    setCopyStatus(true);
    setTimeout(() => setCopyStatus(false), 2000);
  };

  return (
    <div className="space-y-8" id="adoption-section">
      {/* AI Contract Generator */}
      <section className="bg-neutral-900 border border-neutral-800 rounded-3xl overflow-hidden shadow-2xl shadow-indigo-500/5">
        <div className="p-8 space-y-6">
          <div className="flex items-center gap-4">
            <div className="bg-indigo-500/10 p-3 rounded-2xl border border-indigo-500/20">
              <Sparkles className="text-indigo-400" size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">AI Contract Generator</h2>
              <p className="text-sm text-neutral-500 font-mono">Convert natural language descriptions into secure phantom.yml contracts.</p>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1 space-y-4">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe your agent's behavior (e.g., 'This agent reads GitHub issues and creates pull requests')..."
                className="w-full h-40 bg-neutral-950 border border-neutral-800 rounded-2xl p-4 text-sm text-neutral-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition resize-none font-mono"
              />
              <button
                onClick={handleGenerate}
                disabled={isGenerating || !prompt}
                className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold rounded-2xl transition flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20"
              >
                {isGenerating ? "Analyzing Agent Scope..." : "Generate Secure Contract"}
                <Sparkles size={16} className={isGenerating ? "animate-pulse" : ""} />
              </button>
            </div>

            <div className="flex-1 bg-neutral-950 border border-neutral-800 rounded-2xl p-6 relative min-h-[240px]">
              {generatedYaml ? (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-bold text-neutral-500 font-mono uppercase tracking-widest">phantom.yml output</span>
                    <button onClick={handleCopy} className="p-2 text-neutral-500 hover:text-white transition">
                      {copyStatus ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                    </button>
                  </div>
                  <pre className="text-xs font-mono text-neutral-400 whitespace-pre-wrap leading-relaxed">
                    {generatedYaml}
                  </pre>
                </>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-neutral-600 space-y-2 opacity-50">
                  <Terminal size={32} />
                  <p className="text-xs font-mono">Generated YAML will appear here.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Contract Simulator */}
        <section className="bg-neutral-900 border border-neutral-800 rounded-3xl p-8 space-y-6">
          <div className="flex items-center gap-4">
            <div className="bg-emerald-500/10 p-3 rounded-2xl border border-emerald-500/20">
              <Play className="text-emerald-400" size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">Deployment Simulator</h2>
              <p className="text-sm text-neutral-500 font-mono">Stress-test contracts before production rollout.</p>
            </div>
          </div>

          <div className="space-y-4">
            <textarea
              value={simYaml}
              onChange={(e) => setSimYaml(e.target.value)}
              placeholder="Paste phantom.yml content here to simulate..."
              className="w-full h-32 bg-neutral-950 border border-neutral-800 rounded-2xl p-4 text-xs text-neutral-400 font-mono focus:ring-1 focus:ring-emerald-500 outline-none"
            />
            <button
              onClick={handleSimulate}
              disabled={isSimulating || !simYaml}
              className="w-full py-3 bg-neutral-800 hover:bg-neutral-700 text-emerald-400 font-bold rounded-2xl transition border border-neutral-700 flex items-center justify-center gap-2"
            >
              Run Pre-flight Checks
            </button>
          </div>

          {simReport && (
            <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-neutral-500">Readiness Score</span>
                <span className={`text-lg font-bold font-mono ${simReport.score > 80 ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {simReport.score}/100
                </span>
              </div>
              <div className="space-y-2">
                {simReport.checks.map((check: any, idx: number) => (
                  <div key={idx} className="flex items-center justify-between py-2 border-b border-neutral-900 last:border-0">
                    <span className="text-xs text-neutral-400 font-mono">{check.name}</span>
                    <span className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded ${check.status === 'PASS' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                      {check.status}
                    </span>
                  </div>
                ))}
              </div>
              {simReport.warnings.length > 0 && (
                <div className="pt-4 border-t border-neutral-900 space-y-2">
                  <div className="flex items-center gap-2 text-rose-400">
                    <AlertTriangle size={14} />
                    <span className="text-[10px] font-bold font-mono uppercase">Critical Warnings</span>
                  </div>
                  <ul className="space-y-1">
                    {simReport.warnings.map((warn: string, idx: number) => (
                      <li key={idx} className="text-[11px] text-neutral-500 italic leading-relaxed">• {warn}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </section>

        {/* Alerting Engine */}
        <section className="bg-neutral-900 border border-neutral-800 rounded-3xl p-8 space-y-6">
          <div className="flex items-center gap-4">
            <div className="bg-rose-500/10 p-3 rounded-2xl border border-rose-500/20">
              <Bell className="text-rose-400" size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">Alerting Engine</h2>
              <p className="text-sm text-neutral-500 font-mono">Stream security events to external operations platforms.</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={newWebhook}
                onChange={(e) => setNewWebhook(e.target.value)}
                placeholder="Slack/Discord Webhook URL..."
                className="flex-1 bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-xs text-neutral-300 font-mono outline-none"
              />
              <button 
                onClick={handleAddAlert}
                className="p-3 bg-neutral-800 text-white rounded-xl border border-neutral-700 hover:bg-neutral-700 transition"
              >
                <Plus size={18} />
              </button>
            </div>

            <div className="space-y-3">
              {alerts.length === 0 && (
                <div className="py-8 text-center text-neutral-600">
                  <Bell size={24} className="mx-auto mb-2 opacity-20" />
                  <p className="text-[11px] font-mono">No active alerting integrations.</p>
                </div>
              )}
              {alerts.map(alert => (
                <div key={alert.id} className="flex items-center justify-between p-4 bg-neutral-950 border border-neutral-800 rounded-2xl group">
                  <div className="flex items-center gap-3">
                    <div className="bg-neutral-900 p-2 rounded-lg border border-neutral-800">
                      <Send size={14} className="text-neutral-500" />
                    </div>
                    <div>
                      <p className="text-[11px] font-bold text-white font-mono uppercase tracking-widest">{alert.type}</p>
                      <p className="text-[10px] text-neutral-500 font-mono truncate max-w-[150px]">{alert.config.url}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button className={`w-8 h-4 rounded-full relative transition ${alert.enabled ? 'bg-rose-600' : 'bg-neutral-800'}`}>
                      <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition ${alert.enabled ? 'left-4.5' : 'left-0.5'}`} />
                    </button>
                    <button className="text-neutral-600 hover:text-rose-500 transition opacity-0 group-hover:opacity-100">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-neutral-800">
            <div className="flex items-center gap-2 text-neutral-500 mb-2">
              <CheckCircle2 size={12} className="text-emerald-500" />
              <span className="text-[10px] font-bold font-mono uppercase tracking-widest">Trigger Events</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {['VIOLATIONS', 'CIRCUIT_TRIP', 'AUTH_FAIL', 'SECRET_DETECT'].map(evt => (
                <span key={evt} className="px-2 py-0.5 bg-neutral-950 border border-neutral-800 rounded text-[9px] text-neutral-600 font-mono">
                  {evt}
                </span>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
