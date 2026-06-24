import fs from "fs";
import yaml from "js-yaml";
import path from "path";
import crypto from "crypto";

export interface PhantomConfig {
  name: string;
  version: string;
  risk_level: string;
  allowed_tools: string[];
  blocked_patterns: string[];
  circuit_breaker: {
    max_failures: number;
    threshold_consecutive: number;
  };
  shadow_mode: boolean;
  endpoint: string;
  api_key?: string; // Production API Key
  tenant_id?: string;
}

export interface PhantomGuardResult<T> {
  allowed: boolean;
  reason?: string;
  result?: T;
  traceId?: string;
}

export class PhantomGuard {
  private config: PhantomConfig;

  constructor(configPath: string = "./phantom.yml") {
    const fullPath = path.resolve(configPath);
    if (!fs.existsSync(fullPath)) {
      throw new Error(`PhantomOS: Configuration file not found at ${fullPath}`);
    }
    const fileContents = fs.readFileSync(fullPath, "utf8");
    this.config = yaml.load(fileContents) as PhantomConfig;
    
    // Default endpoint if not provided
    if (!this.config.endpoint) {
      this.config.endpoint = "http://localhost:3000/api/audit";
    }
  }

  private async calculateSignature(payload: any): Promise<string> {
    if (!this.config.api_key) return "";
    const data = JSON.stringify(payload);
    return crypto.createHmac("sha256", this.config.api_key).update(data).digest("hex");
  }

  /**
   * Guards the execution of an agent task.
   */
  async execute<T>(
    task: string, 
    fn: (task: string) => Promise<T>,
    payload?: any
  ): Promise<PhantomGuardResult<T>> {
    const timestamp = new Date().toISOString();
    const interceptPayload = {
      agentId: this.config.name,
      task,
      payload,
      timestamp
    };

    const signature = await this.calculateSignature(interceptPayload);
    
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "x-phantom-signature": signature,
      "x-phantom-timestamp": timestamp
    };
    
    if (this.config.api_key) {
      headers["x-phantom-key"] = this.config.api_key;
    }

    if (this.config.tenant_id) {
      headers["x-tenant-id"] = this.config.tenant_id;
    }

    // 1. Intercept (Pre-execution)
    try {
      const interceptResponse = await fetch(`${this.config.endpoint}/intercept`, {
        method: "POST",
        headers,
        body: JSON.stringify(interceptPayload)
      });

      if (!interceptResponse.ok) {
        const error = await interceptResponse.json();
        throw new Error(`PhantomOS Intercept Error: ${error.error || interceptResponse.statusText}`);
      }

      const intercept = await interceptResponse.json();

      if (intercept.blocked) {
        return {
          allowed: false,
          reason: intercept.reason,
          traceId: intercept.traceId
        };
      }

      // 2. Execute
      const result = await fn(task);

      // 3. Verify (Post-execution)
      await fetch(`${this.config.endpoint}/verify`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          agentId: this.config.name,
          traceId: intercept.traceId,
          result,
          task
        })
      });

      return {
        allowed: true,
        result,
        traceId: intercept.traceId
      };
    } catch (error: any) {
      // Handle connection errors or execution errors
      console.error("PhantomOS Execution Error:", error.message);
      throw error;
    }
  }

  getConfig(): PhantomConfig {
    return this.config;
  }
}
