import { Request, Response, NextFunction } from "express";
import { PersistenceLayer } from "./db.ts";
import { SecurityAuditLog } from "../src/types.ts";

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
    tenant_id: string;
  };
}

export class SecurityMiddleware {
  /**
   * Mock Authentication & Tenant Isolation
   * In a real app, this would verify a JWT or session.
   */
  static authenticate(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    const userId = req.headers["x-user-id"] as string || "user-admin"; // Default to admin for demo
    const db = PersistenceLayer.db;
    const user = db.users.find(u => u.id === userId);

    if (!user) {
      return res.status(401).json({ error: "Unauthorized: User not found." });
    }

    req.user = user;
    next();
  }

  /**
   * Role Based Access Control (RBAC)
   */
  static authorize(allowedRoles: string[]) {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
      if (!req.user) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      if (!allowedRoles.includes(req.user.role)) {
        const log: SecurityAuditLog = {
          id: `sec-log-${Date.now()}`,
          timestamp: new Date().toISOString(),
          user_id: req.user.id,
          tenant_id: req.user.tenant_id,
          action: req.method,
          resource: req.originalUrl,
          outcome: 'DENIED',
          details: `RBAC Violation: Role ${req.user.role} attempted to access ${req.originalUrl}.`
        };
        PersistenceLayer.db.security_logs.unshift(log);
        PersistenceLayer.sync();

        return res.status(403).json({ 
          error: "Forbidden: Insufficient permissions.",
          required_roles: allowedRoles,
          your_role: req.user.role
        });
      }

      next();
    };
  }

  /**
   * Tenant Integrity Enforcement
   */
  static enforceTenant(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    if (!req.user) return res.status(401).json({ error: "Unauthorized" });
    next();
  }

  /**
   * Rate Limiting (Per Tenant)
   */
  private static rateLimits = new Map<string, { count: number, lastReset: number }>();

  static rateLimit(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    const tenantId = req.user?.tenant_id || "public";
    const now = Date.now();
    const limit = 100; // 100 requests per minute per tenant
    const window = 60000;

    let data = SecurityMiddleware.rateLimits.get(tenantId);
    if (!data || (now - data.lastReset > window)) {
      data = { count: 0, lastReset: now };
    }

    data.count++;
    SecurityMiddleware.rateLimits.set(tenantId, data);

    if (data.count > limit) {
      return res.status(429).json({ error: "Too Many Requests: Tenant quota exceeded." });
    }

    res.setHeader("X-RateLimit-Limit", limit);
    res.setHeader("X-RateLimit-Remaining", Math.max(0, limit - data.count));
    
    next();
  }
}
