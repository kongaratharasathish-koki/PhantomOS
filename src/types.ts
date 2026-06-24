export type RiskTier = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface BehavioralContract {
  id: string;
  name: string;
  version: string;
  risk_tier: RiskTier;
  allowed_tools: string[];
  blocked_patterns: string[];
  input_schema: any; 
  output_schema: any;
  shadow_mode: boolean;
  api_key?: string; // For request authentication
  tenant_id: string; // Multi-tenant support
}

export interface User {
  id: string;
  email: string;
  role: 'ADMIN' | 'SECURITY_REVIEWER' | 'DEVELOPER' | 'AUDITOR';
  tenant_id: string;
}

export type RejectionReason = 
  | 'CONTRACT_MISSING' 
  | 'INPUT_SCHEMA_INVALID' 
  | 'OUTPUT_SCHEMA_INVALID' 
  | 'TOOL_NOT_ALLOWED' 
  | 'PATTERN_BLOCKED' 
  | 'SHADOW_DIVERGENCE'
  | 'CIRCUIT_OPEN'
  | 'AUTH_FAILED';

export interface VerificationTrace {
  id: string;
  task_description: string;
  capability_id: string;
  outcome: 'SUCCESS' | 'FAILURE' | 'BLOCKED_GOVERNANCE' | 'QUARANTINED';
  latency_sec: number;
  cost: number;
  tokens_used: number;
  contract_verified: boolean;
  circuit_breaker_status: 'CLOSED' | 'OPEN' | 'HALF_OPEN';
  details: string;
  timestamp: string;
  shadow_agreement: number; 
  rejection_reason?: RejectionReason;
  payload?: any;
  hash?: string; // SHA-256 hash of this record
  prev_hash?: string; // Link to previous record hash
  tenant_id: string;
}

export interface CircuitBreaker {
  id: string;
  capability_id: string;
  state: 'CLOSED' | 'OPEN' | 'HALF_OPEN';
  threshold_failures: number;
  current_consecutive_failures: number;
  trip_count: number;
  last_trip_time?: string;
  recovery_attempts?: number;
  tenant_id: string;
}

export interface ProductionIntegration {
  id: string;
  name: string;
  provider: 'Claude Code' | 'Gemini CLI' | 'Docker' | 'GitHub Actions' | 'n8n' | 'OpenAI';
  version: string;
  availability_score: number;
  circuit_status: 'CLOSED' | 'OPEN';
  tenant_id: string;
}

export interface AlertDestination {
  id: string;
  type: 'SLACK' | 'DISCORD' | 'TEAMS' | 'WEBHOOK' | 'EMAIL';
  config: {
    url?: string;
    email?: string;
  };
  enabled: boolean;
  tenant_id: string;
}

export interface TenantMetrics {
  id: string; // Typically matches tenant_id
  requests_protected: number;
  violations_blocked: number;
  active_agents: number;
  audit_storage_used: number; // in bytes
  tenant_id: string;
  last_updated: string;
}

export interface SecurityAuditLog {
  id: string;
  timestamp: string;
  user_id: string;
  tenant_id: string;
  action: string;
  resource: string;
  outcome: 'GRANTED' | 'DENIED';
  details: string;
}

export interface ApiKeyMetadata {
  id: string;
  key: string; // Hashed or masked in DB
  tenant_id: string;
  agent_id: string;
  created_at: string;
  expires_at: string;
  last_used_at?: string;
  is_revoked: boolean;
}

export interface DashboardData {
  contracts: BehavioralContract[];
  breakers: CircuitBreaker[];
  traces: VerificationTrace[];
  integrations: ProductionIntegration[];
  alerts: AlertDestination[];
  metrics: TenantMetrics[];
  security_logs: SecurityAuditLog[];
}
