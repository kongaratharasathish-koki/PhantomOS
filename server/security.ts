import crypto from "crypto";

export class SecurityEngine {
  /**
   * Layered Normalization
   */
  static normalize(input: string): string {
    if (!input) return "";
    
    let result = input;
    
    // 1. Unicode Normalization
    result = result.normalize("NFKC");
    
    // 2. Lowercase for pattern matching (but preserve original for execution logs if needed)
    // Here we return a clean version for pattern matching
    result = result.toLowerCase();
    
    // 3. Remove common bypass characters
    result = result.replace(/[\u200B-\u200D\uFEFF]/g, ""); 
    
    return result;
  }

  /**
   * Secret Redaction Engine
   */
  static redact(text: string): string {
    if (!text) return "";
    
    let redacted = text;
    
    // Patterns for common secrets
    const patterns = [
      // API Keys / Secrets
      /(?:key|secret|password|token|auth|bearer|passwd|credential|api[_-]?key)["']?\s*[:=]\s*["']?([a-zA-Z0-9\-_.~%]{8,})["']?/gi,
      // JWTs
      /eyJ[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*/g,
      // Generic high-entropy strings (simplified)
      /\b[A-Za-z0-9]{32,}\b/g,
      // Private Keys
      /-----BEGIN [A-Z ]+PRIVATE KEY-----[\s\S]*?-----END [A-Z ]+PRIVATE KEY-----/g
    ];

    patterns.forEach(pattern => {
      redacted = redacted.replace(pattern, (match, p1) => {
        if (p1) {
          return match.replace(p1, "[REDACTED]");
        }
        return "[REDACTED]";
      });
    });

    return redacted;
  }

  /**
   * SHA-256 Hashing for Evidence Chain
   */
  static hash(data: any): string {
    const str = typeof data === "string" ? data : JSON.stringify(data);
    return crypto.createHash("sha256").update(str).digest("hex");
  }

  /**
   * API Key Verification
   */
  static verifyApiKey(provided: string | undefined, expected: string | undefined): boolean {
    if (!expected) return true; // Default to allow if no key configured (for dev)
    if (!provided) return false;
    
    // Constant time comparison to prevent timing attacks
    try {
      return crypto.timingSafeEqual(
        Buffer.from(provided),
        Buffer.from(expected)
      );
    } catch (e) {
      return false;
    }
  }

  /**
   * Request Signature Verification (HMAC-SHA256)
   */
  static verifySignature(signature: string, payload: any, secret: string): boolean {
    const data = JSON.stringify(payload);
    const expected = crypto.createHmac("sha256", secret).update(data).digest("hex");
    return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
  }

  /**
   * Replay Attack Protection
   */
  static isReplay(timestamp: string, windowMs: number = 60000): boolean {
    const ts = new Date(timestamp).getTime();
    const now = Date.now();
    return Math.abs(now - ts) > windowMs;
  }

  /**
   * Audit Chain Verification
   */
  static verifyAuditChain(traces: any[]): { valid: boolean; broken_at?: string } {
    for (let i = 0; i < traces.length - 1; i++) {
      const current = traces[i];
      const prev = traces[i + 1];
      
      // Verify link
      if (current.prev_hash !== prev.hash) {
        return { valid: false, broken_at: current.id };
      }
      
      // Re-verify hash
      const traceCopy = { ...current };
      delete traceCopy.hash;
      const rehash = this.hash(traceCopy);
      if (rehash !== current.hash) {
        return { valid: false, broken_at: current.id };
      }
    }
    return { valid: true };
  }
}
