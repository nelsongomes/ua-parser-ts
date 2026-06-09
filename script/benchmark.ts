import { UAParser } from '../src/main/ua-parser';
import * as fs from 'fs';
import * as path from 'path';
import UACHTests from '../test/data/ua-ch/headers';

const RUNS_PER_ITERATION = 10;
const ITERATIONS = 20;
const WARMUP_ITERATIONS = 2;

interface TestEntry {
    ua?: string;
}

function loadUAs(): string[] {
    const dataDir = path.join(__dirname, '..', 'test', 'data', 'ua');
    const uas: string[] = [];

    function scanDir(dir: string): void {
        for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
            const full = path.join(dir, entry.name);
            if (entry.isDirectory()) {
                scanDir(full);
            } else if (entry.name.endsWith('.json')) {
                const data = JSON.parse(fs.readFileSync(full, 'utf-8')) as TestEntry[];
                for (const item of data) {
                    if (item.ua) {
                        uas.push(item.ua);
                    }
                }
            }
        }
    }

    scanDir(dataDir);
    return uas;
}

interface Stats {
    min: number;
    max: number;
    mean: number;
    median: number;
    stddev: number;
}

function computeStats(values: number[]): Stats {
    const sorted = [...values].sort((a, b) => a - b);
    const min = sorted[0];
    const max = sorted[sorted.length - 1];
    const mean = values.reduce((s, v) => s + v, 0) / values.length;
    const median = sorted.length % 2 === 0
        ? (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2
        : sorted[Math.floor(sorted.length / 2)];
    const variance = values.reduce((s, v) => s + (v - mean) ** 2, 0) / values.length;
    return { min, max, mean, median, stddev: Math.sqrt(variance) };
}

function fmt(ms: number): string {
    return ms.toFixed(3).padStart(9) + ' ms';
}

function opsPerSec(ms: number, ops: number): string {
    return Math.round(ops / ms * 1000).toLocaleString().padStart(12);
}

function runBenchmark(
    label: string,
    parsesPerIteration: number,
    runIteration: () => void
): number[] {
    console.log(`\n── ${label} ${'─'.repeat(Math.max(0, 52 - label.length - 4))}`);
    console.log('  iter  |    elapsed    |      ops/s');
    console.log('─'.repeat(55));

    const iterationMs: number[] = [];

    for (let i = 0; i < ITERATIONS; i++) {
        const t0 = performance.now();
        runIteration();
        const elapsed = performance.now() - t0;
        iterationMs.push(elapsed);

        const iterLabel = String(i + 1).padStart(4) + '/' + ITERATIONS;
        console.log(`  ${iterLabel}  | ${fmt(elapsed)}  | ${opsPerSec(elapsed, parsesPerIteration)}`);
    }

    const s = computeStats(iterationMs);
    const nsPerOp = (s.mean / parsesPerIteration) * 1e6;

    console.log('─'.repeat(55));
    console.log('\nSummary (per iteration):');
    console.log(`  min    : ${fmt(s.min)}`);
    console.log(`  max    : ${fmt(s.max)}`);
    console.log(`  mean   : ${fmt(s.mean)}`);
    console.log(`  median : ${fmt(s.median)}`);
    console.log(`  stddev : ${fmt(s.stddev)}`);
    console.log(`\n  ops/s (mean)  : ${opsPerSec(s.mean, parsesPerIteration)}`);
    console.log(`  ns/op (mean)  : ${nsPerOp.toFixed(1).padStart(12)}`);

    return iterationMs;
}

const uas = loadUAs();
const uachHeaders = UACHTests.map(t => t.headers);

const uaParsesPerIteration = uas.length * RUNS_PER_ITERATION;
const uachParsesPerIteration = uachHeaders.length * RUNS_PER_ITERATION;
const totalParsesPerIteration = uaParsesPerIteration + uachParsesPerIteration;

console.log('UAParser.js Benchmark');
console.log('─'.repeat(55));
console.log(`  UA string samples : ${uas.length.toLocaleString()}`);
console.log(`  UA-CH header sets : ${uachHeaders.length.toLocaleString()}`);
console.log(`  Runs per iteration: ${RUNS_PER_ITERATION}`);
console.log(`  Iterations        : ${ITERATIONS}`);
console.log(`  Warmup iterations : ${WARMUP_ITERATIONS}`);
console.log('─'.repeat(55));

// Warmup — not counted
process.stdout.write('Warming up...');
for (let w = 0; w < WARMUP_ITERATIONS; w++) {
    for (let r = 0; r < RUNS_PER_ITERATION; r++) {
        for (const ua of uas) {
            UAParser(ua);
        }
        for (const headers of uachHeaders) {
            UAParser(headers);
        }
    }
}
console.log(' done');

// UA strings benchmark
runBenchmark(
    `UA strings (${uas.length.toLocaleString()} samples × ${RUNS_PER_ITERATION} runs = ${uaParsesPerIteration.toLocaleString()} parses/iter)`,
    uaParsesPerIteration,
    () => {
        for (let r = 0; r < RUNS_PER_ITERATION; r++) {
            for (const ua of uas) {
                UAParser(ua);
            }
        }
    }
);

// UA-CH headers benchmark
runBenchmark(
    `UA-CH headers (${uachHeaders.length} samples × ${RUNS_PER_ITERATION} runs = ${uachParsesPerIteration} parses/iter)`,
    uachParsesPerIteration,
    () => {
        for (let r = 0; r < RUNS_PER_ITERATION; r++) {
            for (const headers of uachHeaders) {
                UAParser(headers);
            }
        }
    }
);

// Combined benchmark
runBenchmark(
    `Combined (${totalParsesPerIteration.toLocaleString()} parses/iter)`,
    totalParsesPerIteration,
    () => {
        for (let r = 0; r < RUNS_PER_ITERATION; r++) {
            for (const ua of uas) {
                UAParser(ua);
            }
            for (const headers of uachHeaders) {
                UAParser(headers);
            }
        }
    }
);
