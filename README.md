# PhantomOS 🛡️
> The Headless Governance Layer for AI Agents

PhantomOS is a production-ready, security-first firewall for AI agents. It intercepts agent instructions, validates them against declarative **Behavioral Contracts**, and ensures immutable auditability for every action taken by an autonomous system.

---

## 🌟 Core Value Proposition

*   **Deterministic Guardrails**: Stop dangerous commands (`rm -rf`, `DROP TABLE`) before they reach the shell or database.
*   **RBAC Enforcement**: Granular control for Admins, Security Reviewers, Developers, and Auditors.
*   **Multi-Tenant Isolation**: Securely host multiple agent fleets with cryptographically isolated audit chains.
*   **Tamper-Proof Auditing**: Every agent decision is hashed into a SHA-256 evidence chain, ensuring a forensic record that cannot be altered.
*   **Operational Resilience**: Built-in circuit breakers and local policy caching for high-availability protection.

---

## 🚀 Quick Start (Under 10 Minutes)

### 1. Installation
```bash
npm install @phantomos/sdk
# Or install the CLI globally
npm install -g @phantomos/cli
```

### 2. Initialize Governance
```bash
phantom init
```
This generates a `phantom.yml` contract for your agent:
```yaml
name: code-reviewer-agent
version: 1.0.0
risk_tier: HIGH
allowed_tools:
  - git_fetch
  - npm_test
blocked_patterns:
  - "rm -rf"
  - "curl .* | bash"
endpoint: "https://your-phantom-server.os/api/audit"
api_key: "your-secure-pk"
```

### 3. Guard your Agent
Wrap your existing agent logic with the `PhantomGuard`:

```typescript
import { PhantomGuard } from "@phantomos/sdk";

const guard = new PhantomGuard("./phantom.yml");

// The agent's intended task
const task = "npm test && rm -rf /";

const result = await guard.execute(task, async (instruction) => {
  // Your actual LLM/Tool execution logic here
  return await agent.run(instruction);
});

if (!result.allowed) {
  console.error(`🛡️ Blocked: ${result.reason}`);
  // Trace ID is available for debugging: result.traceId
}
```

---

## 🏛️ Enterprise Security Features

### Cryptographic Request Signatures
Every request from the SDK is signed using **HMAC-SHA256** to prevent tampering and man-in-the-middle attacks.

### Multi-Tenant Isolation
PhantomOS supports full tenant isolation. Specify your `tenant_id` in the contract or SDK to ensure data and audit logs are isolated from other teams or customers.

### Immutable Evidence Hub
The Evidence Hub provides a cryptographically linked chain of all agent executions. Use the `/api/audit/verify-chain` endpoint to verify the integrity of your audit history.

---

## 📚 Integration Examples

| Framework | Link |
| :--- | :--- |
| **LangGraph** | [examples/langgraph_agent.ts](./examples/langgraph_agent.ts) |
| **Claude Code** | [examples/claude_agent.ts](./examples/claude_agent.ts) |
| **OpenAI SDK** | [examples/openai_agent.ts](./examples/openai_agent.ts) |
| **GitHub Actions** | [examples/github_action.ts](./examples/github_action.ts) |

---

## 📈 Benchmarks

*   **Intercept Latency**: < 15ms (P99)
*   **Throughput**: 5,000+ Requests/sec per node
*   **Cold Start**: < 200ms
*   **Policy Cache Hit Rate**: 99.8%

---

## 🤝 Contributing & Security

*   [CONTRIBUTING.md](./CONTRIBUTING.md)
*   [SECURITY.md](./SECURITY.md)

© 2026 PhantomOS Governance Systems. MIT Licensed.
