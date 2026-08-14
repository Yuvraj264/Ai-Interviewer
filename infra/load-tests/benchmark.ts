import { LoadTestResult } from '@ai-interviewer/shared';

export interface LoadBenchmarkOptions {
  targetUrl: string;
  concurrency: number;
  durationSeconds: number;
}

export class LoadTester {
  public calculatePercentile(latencies: number[], percentile: number): number {
    if (latencies.length === 0) return 0;
    const sorted = [...latencies].sort((a, b) => a - b);
    const index = Math.min(
      Math.floor((percentile / 100) * sorted.length),
      sorted.length - 1
    );
    return sorted[index];
  }

  public async runBenchmark(options: LoadBenchmarkOptions): Promise<LoadTestResult> {
    const latencies: number[] = [];
    let errorCount = 0;
    let totalRequests = 0;

    const startTime = Date.now();
    const endTime = startTime + options.durationSeconds * 1000;

    // Simulate concurrent batch executions
    while (Date.now() < endTime) {
      const batchPromises: Array<Promise<void>> = [];

      for (let i = 0; i < options.concurrency; i++) {
        totalRequests++;
        const reqStart = Date.now();

        const promise = fetch(options.targetUrl)
          .then((res) => {
            const reqEnd = Date.now();
            latencies.push(reqEnd - reqStart);
            if (!res.ok) errorCount++;
          })
          .catch(() => {
            const reqEnd = Date.now();
            latencies.push(reqEnd - reqStart);
            errorCount++;
          });

        batchPromises.push(promise);
      }

      await Promise.all(batchPromises);
      await new Promise((res) => setTimeout(res, 50));
    }

    const actualDurationSeconds = Math.max((Date.now() - startTime) / 1000, 0.1);
    const rps = Number((totalRequests / actualDurationSeconds).toFixed(1));
    const p50Ms = this.calculatePercentile(latencies, 50);
    const p95Ms = this.calculatePercentile(latencies, 95);
    const p99Ms = this.calculatePercentile(latencies, 99);
    const errorRatePercentage = Number(((errorCount / totalRequests) * 100).toFixed(1));

    let bottleneck = 'None (API Latency & Capacity Baseline OK)';
    if (p95Ms > 500) {
      bottleneck = 'High Database / API Network Latency';
    } else if (errorRatePercentage > 1.0) {
      bottleneck = 'Rate Limiting / Connection Pool Exhaustion';
    }

    return {
      concurrency: options.concurrency,
      durationSeconds: Number(actualDurationSeconds.toFixed(1)),
      totalRequests,
      rps,
      p50Ms,
      p95Ms,
      p99Ms,
      errorRatePercentage,
      bottleneck,
    };
  }
}
