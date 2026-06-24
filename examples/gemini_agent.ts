import { PhantomGuard } from "../sdk/phantom.ts";

/**
 * Gemini Agent Example
 * 
 * Demonstrates guarding a Google GenAI (Gemini) call.
 */
async function runGeminiAgent() {
  const guard = new PhantomGuard("./phantom.yml");

  const task = "rm -rf /"; // Malicious task

  console.log(`\n[Agent] Attempting task: ${task}`);

  try {
    const result = await guard.execute(task, async (instruction) => {
      // This represents your Gemini call:
      // const result = await model.generateContent(instruction);
      return "Execution finished.";
    });

    if (result.allowed) {
      console.log("✅ Protected Output:", result.result);
    } else {
      console.log("❌ Blocked by Governance:", result.reason);
    }
  } catch (err) {
    console.error("Agent failed:", err);
  }
}

if (import.meta.url.endsWith(process.argv[1])) {
  runGeminiAgent();
}
