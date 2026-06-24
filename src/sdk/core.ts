import { BehavioralContract, VerificationTrace } from '../types';

export interface GuardResult<T> {
  allowed: boolean;
  blocked: boolean;
  reason?: string;
  result?: T;
  traceId?: string;
}

export class PhantomSDK {
  private endpoint: string;
  private apiKey: string;

  constructor(apiKey: string, endpoint: string = '/api/audit') {
    this.apiKey = apiKey;
    this.endpoint = endpoint;
  }

  /**
   * The Primary Firewall Entry Point
   */
  async guard<T>(
    agentId: string, 
    task: string, 
    payload: any,
    agentAction: () => Promise<T>
  ): Promise<GuardResult<T>> {
    // 1. Pre-execution Check (Interception)
    const interceptResponse = await fetch(`${this.endpoint}/intercept`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${this.apiKey}` },
      body: JSON.stringify({ agentId, task, payload })
    });

    const intercept = await interceptResponse.json();

    if (intercept.blocked) {
      return {
        allowed: false,
        blocked: true,
        reason: intercept.reason,
        traceId: intercept.traceId
      };
    }

    // 2. Execution
    try {
      const result = await agentAction();

      // 3. Post-execution Verification (Shadow/Audit)
      const auditResponse = await fetch(`${this.endpoint}/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${this.apiKey}` },
        body: JSON.stringify({ 
          agentId, 
          traceId: intercept.traceId, 
          result,
          task 
        })
      });

      const audit = await auditResponse.json();

      return {
        allowed: true,
        blocked: false,
        result,
        traceId: intercept.traceId
      };
    } catch (error: any) {
      // 4. Incident Reporting
      await fetch(`${this.endpoint}/incident`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${this.apiKey}` },
        body: JSON.stringify({ 
          agentId, 
          traceId: intercept.traceId, 
          error: error.message 
        })
      });

      throw error;
    }
  }
}

export const phantom = new PhantomSDK('local-dev-key');
