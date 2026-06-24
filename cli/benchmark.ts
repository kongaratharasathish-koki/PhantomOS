import { PhantomGuard } from "../sdk/phantom.ts";
import chalk from "chalk";

async function runBenchmark() {
  const guard = new PhantomGuard("./phantom.yml");
  const iterations = 100;
  
  console.log(chalk.bold.blue(`\n🚀 Starting PhantomOS Performance Benchmark (${iterations} iterations)...`));
  
  const latencies: number[] = [];
  
  for (let i = 0; i < iterations; i++) {
    const start = performance.now();
    await guard.execute("read_file test.txt", async () => {
      return { status: "ok" };
    });
    const end = performance.now();
    latencies.push(end - start);
    
    if (i % 10 === 0) process.stdout.write(chalk.gray("."));
  }
  
  const avg = latencies.reduce((a, b) => a + b, 0) / latencies.length;
  const p99 = latencies.sort((a, b) => a - b)[Math.floor(latencies.length * 0.99)];
  
  console.log(chalk.green("\n\n✅ Benchmark Complete"));
  console.log(chalk.white(`Average Latency: `) + chalk.bold.green(`${avg.toFixed(2)}ms`));
  console.log(chalk.white(`P99 Latency:     `) + chalk.bold.green(`${p99.toFixed(2)}ms`));
  console.log(chalk.white(`Throughput (est):`) + chalk.bold.green(`${(1000/avg).toFixed(0)} req/sec`));
}

runBenchmark();
