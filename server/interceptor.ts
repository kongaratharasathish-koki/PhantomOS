import { BehavioralContract, RejectionReason } from "../src/types.ts";
import { SecurityEngine } from "./security.ts";

export class PhantomOSInterceptor {
  private static GLOBAL_BLOCKED_PATTERNS = [
    { pattern: /rm\s+-rf/i, name: "FILE_DESTRUCTION_RM", severity: "CRITICAL" },
    { pattern: /del\s+\/s/i, name: "FILE_DESTRUCTION_DEL", severity: "CRITICAL" },
    { pattern: /format\s+[a-z]:/i, name: "FILE_DESTRUCTION_FORMAT", severity: "CRITICAL" },
    { pattern: /drop\s+table/i, name: "DB_DESTRUCTION_DROP", severity: "CRITICAL" },
    { pattern: /delete\s+from\s+(?!.*where)/i, name: "DB_DESTRUCTION_DELETE_UNGUARDED", severity: "CRITICAL" },
    { pattern: /chmod\s+777/i, name: "PERMISSION_ESCALATION_CHMOD", severity: "HIGH" },
    { pattern: /sudo\s+su/i, name: "PERMISSION_ESCALATION_SUDO", severity: "HIGH" },
    { pattern: /curl\s+.*--loop/i, name: "NETWORK_ABUSE_LOOP", severity: "MEDIUM" },
    { pattern: /curl\s+-x\s+post\s+http[s]?:\/\/(?!localhost|127\.0\.0\.1)/i, name: "NETWORK_ABUSE_EXTERNAL_POST", severity: "MEDIUM" },
    { pattern: /bash\s+-c/i, name: "SHELL_ESCAPE_BASH_C", severity: "HIGH" },
    { pattern: /eval\s*\(/i, name: "SHELL_ESCAPE_EVAL", severity: "HIGH" },
  ];

  static inspect(command: string, contract: BehavioralContract): { blocked: boolean; reason?: string; rejection_reason?: RejectionReason } {
    // Layer 0: Fuzzing Protection
    if (!contract) {
      return { 
        blocked: true, 
        reason: "Operational Error: Missing or corrupted contract provided.", 
        rejection_reason: "CONTRACT_MISSING" 
      };
    }

    // Layer 1: Normalization
    const normalized = SecurityEngine.normalize(command);
    
    // Layer 2: Global Denylist
    for (const { pattern, name } of this.GLOBAL_BLOCKED_PATTERNS) {
      if (pattern.test(normalized)) {
        return { 
          blocked: true, 
          reason: `Safety Violation [${name}]: Prohibited system pattern detected.`, 
          rejection_reason: 'PATTERN_BLOCKED' 
        };
      }
    }

    // Layer 3: Contract Specific Denylist
    if (contract.blocked_patterns) {
      for (const patternStr of contract.blocked_patterns) {
        try {
          const regex = new RegExp(patternStr, 'i');
          if (regex.test(normalized)) {
            return { 
              blocked: true, 
              reason: `Contract Violation: Action matches blocked pattern "${patternStr}".`, 
              rejection_reason: 'PATTERN_BLOCKED' 
            };
          }
        } catch (e) {
          if (normalized.includes(patternStr.toLowerCase())) {
            return { 
              blocked: true, 
              reason: `Contract Violation: Action contains blocked string "${patternStr}".`, 
              rejection_reason: 'PATTERN_BLOCKED' 
            };
          }
        }
      }
    }

    // Layer 4: Tool Allowlist (Strict Mode)
    if (contract.allowed_tools && contract.allowed_tools.length > 0) {
      const toolUsed = this.extractToolName(normalized);
      const isAllowed = contract.allowed_tools.some(t => normalized.includes(t.toLowerCase()) || (toolUsed && t.toLowerCase() === toolUsed));
      
      if (!isAllowed) {
        return { 
          blocked: true, 
          reason: `Policy Enforcement: Tool "${toolUsed || 'Unknown'}" is not in the allowlist for contract "${contract.id}".`, 
          rejection_reason: 'TOOL_NOT_ALLOWED' 
        };
      }
    }

    // Layer 5: Input Schema Validation (Basic)
    if (contract.input_schema) {
      // In a real system, we'd use JSON Schema validation here.
      // For this implementation, we'll verify if the instruction is non-empty if required.
      if (!command || command.trim().length === 0) {
        return {
          blocked: true,
          reason: "Schema Validation: Empty instruction payload rejected.",
          rejection_reason: "INPUT_SCHEMA_INVALID"
        };
      }
    }

    return { blocked: false };
  }

  private static extractToolName(command: string): string | null {
    // Simple heuristic: first word usually represents the tool/command
    const parts = command.trim().split(/\s+/);
    return parts.length > 0 ? parts[0] : null;
  }
}
