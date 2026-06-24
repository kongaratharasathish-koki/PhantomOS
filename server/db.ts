import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { 
  BehavioralContract, 
  CircuitBreaker, 
  VerificationTrace, 
  ProductionIntegration,
  AlertDestination,
  User,
  TenantMetrics,
  SecurityAuditLog
} from "../src/types.ts";

let _dirname = "";
try {
  _dirname = __dirname;
} catch (e) {
  _dirname = path.dirname(fileURLToPath(import.meta.url));
}

const dbPath = path.join(process.cwd(), "db.json");

export interface DbSchema {
  contracts: BehavioralContract[];
  breakers: CircuitBreaker[];
  traces: VerificationTrace[];
  integrations: ProductionIntegration[];
  alerts: AlertDestination[];
  users: User[];
  metrics: TenantMetrics[];
  security_logs: SecurityAuditLog[];
}

export const initialDb: DbSchema = {
  contracts: [
    {
      id: "customer-service-bot",
      name: "Customer Service Agent",
      version: "2.1.0",
      risk_tier: "MEDIUM",
      allowed_tools: ["knowledge-base", "email-client", "zendesk-api"],
      blocked_patterns: ["rm\\s+-rf", "DELETE\\s+FROM\\s+users"],
      input_schema: { query: "string" },
      output_schema: { response: "string", action: "string" },
      shadow_mode: true,
      tenant_id: "tenant-default"
    },
    {
      id: "order-management",
      name: "Order Fulfillment System",
      version: "1.4.2",
      risk_tier: "HIGH",
      allowed_tools: ["postgres-db", "stripe-api", "inventory-service"],
      blocked_patterns: ["DROP\\s+TABLE", "TRUNCATE"],
      input_schema: { orderId: "string", action: "string" },
      output_schema: { success: "boolean", txId: "string" },
      shadow_mode: true,
      tenant_id: "tenant-default"
    },
    {
      id: "infra-ops-agent",
      name: "Infrastructure Operations",
      version: "3.0.1",
      risk_tier: "CRITICAL",
      allowed_tools: ["docker-api", "kubectl", "aws-sdk"],
      blocked_patterns: ["terminate-instances", "delete-cluster"],
      input_schema: { cluster: "string", operation: "string" },
      output_schema: { status: "string" },
      shadow_mode: false,
      tenant_id: "tenant-default"
    },
    {
      id: "production-agent",
      name: "production-agent",
      version: "1.0.0",
      risk_tier: "HIGH",
      allowed_tools: ["read_file", "github_create_pr", "database_select", "search_web"],
      blocked_patterns: ["rm\\s+-rf", "DROP\\s+TABLE", "chmod\\s+777", "curl\\s+.*\\s+\\|\\s+bash", "sudo\\s+.*"],
      input_schema: { query: "string" },
      output_schema: { result: "any" },
      shadow_mode: true,
      api_key: "dev-key-12345",
      tenant_id: "tenant-default"
    }
  ],
  breakers: [
    {
      id: "cb-cs-bot",
      capability_id: "customer-service-bot",
      state: "CLOSED",
      threshold_failures: 3,
      current_consecutive_failures: 0,
      trip_count: 0,
      tenant_id: "tenant-default"
    },
    {
      id: "cb-order-mgmt",
      capability_id: "order-management",
      state: "OPEN",
      threshold_failures: 2,
      current_consecutive_failures: 2,
      trip_count: 1,
      tenant_id: "tenant-default"
    },
    {
      id: "cb-infra-ops",
      capability_id: "infra-ops-agent",
      state: "CLOSED",
      threshold_failures: 1,
      current_consecutive_failures: 0,
      trip_count: 0,
      tenant_id: "tenant-default"
    },
    {
      id: "cb-prod-agent",
      capability_id: "production-agent",
      state: "CLOSED",
      threshold_failures: 3,
      current_consecutive_failures: 0,
      trip_count: 0,
      tenant_id: "tenant-default"
    }
  ],
  traces: [
    {
      id: "tr-initial-1",
      task_description: "Check status for order #9982",
      capability_id: "customer-service-bot",
      outcome: "SUCCESS",
      latency_sec: 0.15,
      cost: 0.002,
      tokens_used: 140,
      contract_verified: true,
      circuit_breaker_status: "CLOSED",
      details: "Request validated and executed within safety bounds.",
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      shadow_agreement: 1.0,
      tenant_id: "tenant-default"
    },
    {
      id: "tr-initial-2",
      task_description: "Attempted: rm -rf /etc/ssl/certs",
      capability_id: "infra-ops-agent",
      outcome: "BLOCKED_GOVERNANCE",
      latency_sec: 0.01,
      cost: 0,
      tokens_used: 0,
      contract_verified: true,
      circuit_breaker_status: "CLOSED",
      details: "Safety Violation [FILE_DESTRUCTION_RM]: Prohibited pattern detected globally.",
      timestamp: new Date(Date.now() - 1800000).toISOString(),
      shadow_agreement: 0,
      rejection_reason: "PATTERN_BLOCKED",
      tenant_id: "tenant-default"
    }
  ],
  integrations: [
    {
      id: "int-claude",
      name: "Claude Code",
      provider: "OpenAI",
      version: "1.0",
      availability_score: 99.8,
      circuit_status: "CLOSED",
      tenant_id: "tenant-default"
    },
    {
      id: "int-gemini",
      name: "Gemini CLI",
      provider: "Gemini CLI",
      version: "1.5",
      availability_score: 99.9,
      circuit_status: "CLOSED",
      tenant_id: "tenant-default"
    }
  ],
  alerts: [
    {
      id: "alert-slack-default",
      type: "SLACK",
      config: { url: "https://hooks.slack.com/services/T000/B000/XXXX" },
      enabled: false,
      tenant_id: "tenant-default"
    }
  ],
  users: [
    {
      id: "user-admin",
      email: "admin@phantom.os",
      role: "ADMIN",
      tenant_id: "tenant-default"
    }
  ],
  metrics: [
    {
      id: "tenant-default",
      tenant_id: "tenant-default",
      requests_protected: 1250,
      violations_blocked: 42,
      active_agents: 4,
      audit_storage_used: 1048576,
      last_updated: new Date().toISOString()
    }
  ],
  security_logs: [
    {
      id: "log-initial-1",
      timestamp: new Date().toISOString(),
      user_id: "user-admin",
      tenant_id: "tenant-default",
      action: "READ_DASHBOARD",
      resource: "API",
      outcome: "GRANTED",
      details: "User authenticated and authorized."
    }
  ]
};

export class PersistenceLayer {
  static db: DbSchema = { ...initialDb };
  static firestore: any;

  static setFirestore(fsInstance: any) {
    this.firestore = fsInstance;
  }

  static load() {
    if (fs.existsSync(dbPath)) {
      try {
        const data = JSON.parse(fs.readFileSync(dbPath, "utf8"));
        
        // Smarter merge: preserve initial items that are missing from the loaded data
        this.db.contracts = this.mergeById(initialDb.contracts, data.contracts || []);
        this.db.breakers = this.mergeById(initialDb.breakers, data.breakers || []);
        this.db.integrations = this.mergeById(initialDb.integrations, data.integrations || []);
        this.db.alerts = this.mergeById(initialDb.alerts, data.alerts || []);
        this.db.users = this.mergeById(initialDb.users, data.users || []);
        this.db.metrics = this.mergeById(initialDb.metrics || [], data.metrics || []);
        this.db.security_logs = [...(initialDb.security_logs || []), ...(data.security_logs || [])];
        this.db.traces = [...initialDb.traces, ...(data.traces || [])]; // Append traces
        
      } catch (e) {
        console.error("PersistenceLayer: Load failure", e);
      }
    }
    return this.db;
  }

  private static mergeById<T extends { id: string }>(initial: T[], loaded: T[]): T[] {
    const map = new Map<string, T>();
    initial.forEach(item => map.set(item.id, item));
    loaded.forEach(item => map.set(item.id, item));
    return Array.from(map.values());
  }

  static async syncToCloud() {
    if (!this.firestore) return;
    
    // CHAOS SIMULATION: DB Outage
    if ((global as any).chaos_active_db_outage) {
      throw new Error("Simulated Database Outage");
    }

    try {
      const collections = ['contracts', 'breakers', 'traces', 'integrations', 'alerts', 'users', 'metrics', 'security_logs'];
      for (const coll of collections) {
        const items = (this.db as any)[coll] || [];
        for (const item of items) {
          if (item.id) {
            await this.firestore.collection(coll).doc(item.id).set(item, { merge: true });
          }
        }
      }
    } catch (e) {
      console.error("PersistenceLayer: Cloud sync failure", e);
      throw e; // Re-throw to be caught by sync()
    }
  }

  static sync() {
    try {
      // 1. Local Persistence (Survivability)
      fs.writeFileSync(dbPath, JSON.stringify(this.db, null, 2));
      
      // 2. Cloud Persistence (Async & Error-Tolerant)
      this.syncToCloud().catch(e => {
        console.warn("PersistenceLayer: Cloud sync unavailable. Local cache is healthy.");
      });
    } catch (e) {
      console.error("PersistenceLayer: CRITICAL_SYNC_FAILURE (Local Storage Full?)", e);
    }
  }

  static async updateDoc(collection: string, id: string, data: any) {
    if (this.firestore) {
      await this.firestore.collection(collection).doc(id).set(data, { merge: true })
        .catch((err: any) => console.warn(`PersistenceLayer: Update cloud failure for ${collection}/${id}:`, err.message));
    }
  }
}
