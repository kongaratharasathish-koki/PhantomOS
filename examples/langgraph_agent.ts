import { PhantomGuard } from "../sdk/phantom.ts";

/**
 * LangGraph Agent Integration Example
 * 
 * Demonstrates how to wrap a LangGraph tool-calling node with PhantomOS.
 */
async function runLangGraphExample() {
  const guard = new PhantomGuard("./phantom.yml");

  // Mocking a LangGraph Tool Call
  const toolCall = {
    name: "execute_shell",
    args: { command: "rm -rf /var/log" }
  };

  console.log(`\n[LangGraph] Node "call_tool" triggered with: ${toolCall.name}`);

  try {
    // Wrap the tool execution logic
    const result = await guard.execute(
      `${toolCall.name} ${toolCall.args.command}`, 
      async (instruction) => {
        // This is where you would actually call your LangGraph tool
        console.log(`[Execution] Calling real tool: ${toolCall.name} with ${toolCall.args.command}`);
        return { success: true, output: "Command executed (mocked)" };
      },
      { original_tool_call: toolCall } // Pass extra metadata for auditing
    );

    if (result.allowed) {
      console.log("✅ Protected Output:", result.result);
    } else {
      console.error(`🛡️ PhantomOS Governance Intercepted: ${result.reason}`);
      console.log(`   Trace Reference: ${result.traceId}`);
    }
  } catch (e: any) {
    console.error("❌ Execution Error:", e.message);
  }
}

runLangGraphExample();
