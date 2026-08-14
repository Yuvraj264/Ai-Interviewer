import { describe, it, expect, beforeEach } from 'vitest';
import { LoadTester } from './benchmark';

describe('Phase 10 Load Benchmark Subsystem', () => {
  let loadTester: LoadTester;

  beforeEach(() => {
    loadTester = new LoadTester();
  });

  it('should calculate percentiles p50, p95, p99 accurately', () => {
    const latencies = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
    expect(loadTester.calculatePercentile(latencies, 50)).toBe(60);
    expect(loadTester.calculatePercentile(latencies, 95)).toBe(100);
    expect(loadTester.calculatePercentile(latencies, 99)).toBe(100);
  });

  it('should return 0 percentiles for empty latencies array cleanly', () => {
    expect(loadTester.calculatePercentile([], 50)).toBe(0);
  });
});
