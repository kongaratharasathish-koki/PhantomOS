export interface BehavioralContract {
  id: string;
  name?: string;
  version?: string;
  input_schema: string;
  output_schema: string;
  preconditions: string[];
  postconditions: string[];
  recovery_strategy: string;
  risk_tier: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  allowed_tools?: string[];
  blocked_tools?: string[];
}

export type CapabilityStatus = 'CANDIDATE' | 'ACTIVE' | 'DEGRADED' | 'QUARANTINED' | 'ARCHIVED';

export interface TimelineEvent {
  id: string;
  capability_id: string;
  timestamp: string;
  from_status: CapabilityStatus | 'NONE';
  to_status: CapabilityStatus;
  reason: string;
  reviewer_id?: string;
  reviewer_name?: string;
  trust_change?: { from: number; to: number };
  failure_incident_id?: string;
  breaker_event_type?: string;
  rollback_triggered?: boolean;
}

export interface Capability {
  id: string;
  name: string;
  description: string;
  version: string;
  status: CapabilityStatus;
  
  // Wilson Score Engine Fields (Legacy & backcompat)
  success_rate: number;
  successCount: number;
  failureCount: number;
  lowerBound: number;
  upperBound: number;
  confidence: number;
  effectiveSampleSize: number;

  // Bayesian Trust Engine Fields (v0.6)
  prior_belief: number;                  // e.g., default 0.70
  successes: number;
  failures: number;
  posterior_confidence: number;          // Beta posterior median/mean parameter
  effective_sample_size: number;         // conjugate updater sample size
  confidence_decay: number;              // Current penalty score
  lower_confidence_bound: number;        // Beta distribution lower credential bound
  trust_class: 'TRUSTED' | 'WATCHLIST' | 'DEGRADED' | 'UNTRUSTED';
  trust_trajectory: number[];            // Trajectory of posterior_confidence over time

  // Confidence Decay Engine Fields
  last_used: string;
  lastUsedAt: string;
  lastValidatedAt: string;
  decayCoefficient: number;
  confidenceTrend: number[];

  // Garbage Collector Archive metadata
  archiveReason?: string;
  archiveTimestamp?: string;
  archiveHistory?: string[];

  total_uses: number;
  rollback_rate: number;
  average_cost: number;
  average_time_seconds: number;
  health_score: number;
  failure_modes: string[];
  contract_id: string;
  created_at: string;

  // External Agent Registry support (v0.8)
  agent_type?: 'Claude Code' | 'OpenAI Codex' | 'Gemini CLI' | 'Cursor' | 'LangGraph agents' | 'Custom scripts' | 'n8n workflows' | 'GitHub Actions' | 'Docker pipelines';
  provider?: string;
  model?: string;
}

export interface FailureIncident {
  id: string;
  root_cause: string; 
  signature: string;
  frequency: number;
  affected_capabilities: string[];
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  last_occurred: string;
  first_occurred?: string;
  diagnostic_log_sample: string;
  recovery_action: string;
  
  // Failure Taxonomy fields (v0.6)
  category: 'Schema' | 'Tool' | 'Permission' | 'Memory' | 'Context' | 'Token' | 'Latency' | 'Security' | 'Goal Hijacking' | 'Supply Chain' | 'Session Contamination' | 'Memory Poisoning';
  subcategory: string;
  mean_recovery_time: number;            // seconds to resolve or failback
  recurrence_probability: number;        // % probability
  cost: number;                          // Financial/resource debt incurred
}

export interface CircuitBreaker {
  id: string;
  capability_id: string;
  state: 'CLOSED' | 'OPEN' | 'HALF-OPEN';
  success_count: number;
  failure_count: number;
  monitored_failure_types: string[]; 
  threshold_failures: number;
  current_consecutive_failures: number;
  fallback_skill_id: string;
  escalated: boolean;
  
  consecutive_failures_count: number;
  latency_spikes_count: number;
  cost_spikes_count: number;
  schema_violations_count: number;
  semantic_failures_count: number;
  malformed_outputs_count: number;
  token_explosions_count: number;

  // AI-Aware Breaker additions (v0.6)
  trip_count: number;
  recovery_count: number;
  average_open_duration: number;        // seconds
  fallback_usage: number;                // count of redirection hits
}

export interface HumanReviewer {
  id: string;
  name: string;
  avatar: string;
  approval_count: number;
  reject_count: number;                  // count of reviews rejected (v0.6)
  rollback_count: number;                // occurrences where their approvals were rolled back
  agreement_rate: number;
  reliability_score: number;             // calibration output 0-100
  risk_score: number;                    // risk index 0-100
  false_positive_rate: number;
  false_negative_rate: number;
  reliability_trend: number[];
  
  // Reviewer Calibration fields (v0.6)
  kappa_score: number;                   // Cohen's Kappa against system reality
  trust_weight: number;                  // Weighted vote power [0-1]
  high_risk_accuracy: number;            // Accuracy rating on HIGH risk contracts
  drift: number;                         // reviewer bias or drift index %
}

export interface ZombieAnalysis {
  id: string;
  capability_id: string;
  low_usage: boolean;
  high_rollback: boolean;
  falling_confidence: boolean;
  long_inactivity: boolean;
  poor_health: boolean;
  high_failure_recurrence: boolean;      // Zombie signal
  low_trust: boolean;                    // Zombie signal
  health_deterioration_timeline: number[];
  deprecation_reason: string;
  recommendation: 'RETAIN' | 'DEPRECATE_CRITICAL' | 'AUTO_ARCHIVE_RECOMMENDED';
  archiveReason?: string;
  archiveTimestamp?: string;
  
  // Tagging system (v0.6)
  tag: 'Healthy' | 'Watchlist' | 'Zombie' | 'Contaminated' | 'Archived';
  reasons: string[];
  auto_retirement_proposed: boolean;
}

export interface VerificationTrace {
  id: string;
  task_description: string;
  capability_id: string;
  outcome: 'SUCCESS' | 'FAILURE' | 'QUARANTINED' | 'REROUTED_FALLBACK';
  latency_sec: number;
  cost: number;
  tokens_used: number;
  contract_verified: boolean;
  circuit_breaker_status: 'CLOSED' | 'OPEN' | 'HALF-OPEN';
  details: string;
  timestamp: string;
}

export interface ProductionIntegration {
  id: string;
  name: string;
  version: string;
  provider: string;
  execution_count: number;
  success_count: number;
  violations: number;
  quarantines: number;
  recovery_count: number;
  circuit_status: 'CLOSED' | 'OPEN' | 'HALF-OPEN';
}

export interface DashboardData {
  capabilities: Capability[];
  contracts: BehavioralContract[];
  failures: FailureIncident[];
  breakers: CircuitBreaker[];
  reviewers: HumanReviewer[];
  zombies: ZombieAnalysis[];
  traces: VerificationTrace[];
  timeline: TimelineEvent[];             // Capability Timeline
  system_frozen?: boolean;                // System freeze state (v0.6)
  integrations?: ProductionIntegration[]; // Production Integrations (v1.0)
}
