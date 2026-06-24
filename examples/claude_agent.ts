import { PhantomGuard } from "../sdk/phantom.ts";

/**
 * Claude Code Example
 * 
 * Demonstrates guarding an Anthropic Claude Code session.
 */
async function runClaudeAgent() {
  const guard = new PhantomGuard("./phantom.yml");

  const task = "github_create_pr --branch feat-auth";

  console.log(`\n[Agent] Attempting task: ${task}`);

  const result = await guard.execute(task, async (instruction) => {
    // This represents your Anthropic API call:
    return {
      id: "pr-123",
      url: "https://github.com/org/repo/pull/123"
    };
  });

  if (result.allowed) {
    console.log("✅ Protected Output:", result.result);
  } else {
    console.log("❌ Blocked by Governance:", result.reason);
  }
}

if (import.meta.url.endsWith(process.argv[1])) {
  runClaudeAgent();
}
