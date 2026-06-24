import { Command } from "commander";
import fs from "fs";
import path from "path";
import chalk from "chalk";
import yaml from "js-yaml";

const program = new Command();

program
  .name("phantom")
  .description("PhantomOS Governance CLI")
  .version("2.1.0");

// phantom init
program
  .command("init")
  .description("Initialize a new phantom.yml configuration")
  .action(() => {
    const template = `name: production-agent
version: 1.0.0
risk_level: high
api_key: "PHANTOM_REPLACE_ME_WITH_SECURE_KEY"

allowed_tools:
  - read_file
  - github_create_pr
  - database_select

blocked_patterns:
  - rm -rf
  - DROP TABLE
  - chmod 777
  - curl .* | bash

circuit_breaker:
  max_failures: 3
  threshold_consecutive: 3

shadow_mode: true

endpoint: http://localhost:3000/api/audit
`;
    const target = path.join(process.cwd(), "phantom.yml");
    if (fs.existsSync(target)) {
      console.log(chalk.yellow("⚠ phantom.yml already exists. Skipping initialization."));
    } else {
      fs.writeFileSync(target, template);
      console.log(chalk.green("✔ Created phantom.yml"));
      console.log(chalk.blue("\nNext steps:"));
      console.log("1. Update allowed_tools and blocked_patterns");
      console.log("2. Set a secure api_key");
      console.log("3. Sign your contract using 'phantom sign'");
    }
  });

// phantom sign
program
  .command("sign")
  .description("Sign the governance contract for production deployment")
  .action(() => {
    const target = path.join(process.cwd(), "phantom.yml");
    if (!fs.existsSync(target)) {
      console.log(chalk.red("✘ phantom.yml not found."));
      return;
    }
    const content = fs.readFileSync(target, "utf8");
    if (content.includes("signature:")) {
      console.log(chalk.yellow("⚠ Contract is already signed."));
      return;
    }
    
    // Simulate signing logic
    const signature = Buffer.from(content).toString("base64").substring(0, 32);
    fs.appendFileSync(target, `\nsignature: ${signature}\n`);
    console.log(chalk.green("✔ Contract signed successfully."));
  });

// phantom validate
program
  .command("validate")
  .description("Validate the current governance contracts")
  .action(() => {
    const target = path.join(process.cwd(), "phantom.yml");
    if (!fs.existsSync(target)) {
      console.log(chalk.red("✘ Error: phantom.yml not found. Run 'phantom init' first."));
      process.exit(1);
    }
    try {
      const config = yaml.load(fs.readFileSync(target, "utf8")) as any;
      const required = ["name", "risk_level", "allowed_tools", "endpoint"];
      for (const field of required) {
        if (!config[field]) throw new Error(`Missing required field: ${field}`);
      }
      console.log(chalk.green("✔ Governance contract is valid."));
      console.log(chalk.gray(`Agent Identity: ${config.name}`));
      console.log(chalk.gray(`Risk Tier: ${config.risk_level}`));
    } catch (e: any) {
      console.log(chalk.red(`✘ Validation Failed: ${e.message}`));
    }
  });

// phantom status
program
  .command("status")
  .description("Display circuit breaker states")
  .action(async () => {
    try {
      const resp = await fetch("http://localhost:3000/api/dashboard");
      const data = await resp.json();
      console.log(chalk.bold("\n--- AGENT CIRCUIT STATUS ---"));
      data.breakers.forEach((cb: any) => {
        const stateColor = cb.state === "CLOSED" ? chalk.green : chalk.red;
        console.log(`${chalk.bold(cb.capability_id.padEnd(25))} [${stateColor(cb.state)}]  Trips: ${cb.trip_count}`);
      });
    } catch (e) {
      console.log(chalk.red("✘ Could not connect to PhantomOS server."));
    }
  });

// phantom tail
program
  .command("tail")
  .description("Stream audit events")
  .action(async () => {
    console.log(chalk.cyan("Streaming audit logs from http://localhost:3000... (Ctrl+C to stop)"));
    
    let lastSeenId = "";
    
    setInterval(async () => {
      try {
        const resp = await fetch("http://localhost:3000/api/dashboard");
        const data = await resp.json();
        const traces = data.traces || [];
        
        const newTraces = [];
        for (const t of traces) {
          if (t.id === lastSeenId) break;
          newTraces.unshift(t);
        }
        
        if (newTraces.length > 0) {
          newTraces.forEach((t: any) => {
            const statusColor = t.outcome === "SUCCESS" ? chalk.green : chalk.red;
            console.log(`${chalk.gray(new Date(t.timestamp).toLocaleTimeString())} [${statusColor(t.outcome.padEnd(18))}] ${chalk.bold(t.capability_id)}: ${t.task_description}`);
          });
          lastSeenId = traces[0].id;
        }
      } catch (e) {}
    }, 1000);
  });

program.parse();
