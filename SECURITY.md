# Security Policy

PhantomOS is a security product. We take the safety of your agents and infrastructure seriously.

## 🛡️ Supported Versions

| Version | Supported |
| ------- | --------- |
| 2.5.x   | ✅ Yes    |
| 2.4.x   | ❌ No     |
| < 2.4   | ❌ No     |

## 🐛 Reporting a Vulnerability

**Do not open a GitHub issue for security vulnerabilities.**

Please report any security concerns by emailing `security@phantomos.os`. We aim to acknowledge all reports within 24 hours and provide a fix or mitigation within 72 hours for critical issues.

## 🔍 Security Model

PhantomOS operates on a **Zero-Trust** model for AI agents:
1. **Assume Breach**: We assume the LLM or agent logic could be compromised at any time.
2. **Deterministic Interception**: We do not rely on "AI to police AI". We use deterministic pattern matching and schema validation.
3. **Immutable Evidence**: We provide a cryptographically verifiable record of truth that serves as the final authority in audits.

## 🚀 Deployment Recommendations

For production environments, we strongly recommend:
- Running PhantomOS behind a secure API Gateway.
- Enabling HMAC-SHA256 request signatures in the SDK.
- Enforcing Tenant Isolation for all multi-user environments.
- Regularly verifying the Audit Chain integrity via the `/api/audit/verify-chain` endpoint.
