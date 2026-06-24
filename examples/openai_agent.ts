import { PhantomGuard } from "../sdk/phantom.ts";

/**
 * OpenAI Agent Example
 * 
 * Demonstrates how to guard a standard OpenAI chat completion call.
 */
async function runOpenAIAgent() {
  const guard = new PhantomGuard("./phantom.yml");

  const task = "read_file config.json";

  console.log(`\n[Agent] Attempting task: ${task}`);

  const result = await guard.execute(task, async (instruction) => {
    // This represents your actual OpenAI call:
    // const completion = await openai.chat.completions.create({ ... })
    
    console.log("[Execution] Internal agent logic running...");
    return {
      content: "File contents: { \"db_host\": \"localhost\" }",
      tokens: 150
    };
  });

  if (result.allowed) {
    console.log("✅ Protected Output:", result.result);
  } else {
    console.log("❌ Blocked by Governance:", result.reason);
  }
}

// Check if running directly
if (import.meta.url.endsWith(process.argv[1])) {
  runOpenAIAgent();
}

export { runOpenAIAgent };
