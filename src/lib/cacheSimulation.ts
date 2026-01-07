/**
 * Cache Simulation Logic
 * Implements a simplified but realistic cache hierarchy model
 */

// Seeded PRNG for reproducible random access patterns
export class SeededRandom {
  private seed: number;

  constructor(seed: number = 12345) {
    this.seed = seed;
  }

  next(): number {
    this.seed = (this.seed * 1103515245 + 12345) & 0x7fffffff;
    return this.seed / 0x7fffffff;
  }

  nextInt(max: number): number {
    return Math.floor(this.next() * max);
  }

  reset(seed?: number) {
    this.seed = seed ?? 12345;
  }
}

export type AccessPattern = 
  | 'sequential' 
  | 'random' 
  | 'linked-list' 
  | 'matrix-row' 
  | 'matrix-col';

export type CacheLevel = 'L1' | 'L2' | 'L3' | 'RAM';

export interface CacheConfig {
  l1Size: number;  // Number of cache blocks
  l2Size: number;
  l3Size: number;
  lineSize: number; // Bytes per cache line (32 or 64)
}

export interface CacheState {
  l1: number[];  // Array of block IDs currently in cache
  l2: number[];
  l3: number[];
}

export interface AccessResult {
  blockId: number;
  hitLevel: CacheLevel;
  isHit: boolean;
  latency: number;  // Simulated cycles
}

export interface CacheMetrics {
  totalAccesses: number;
  l1Hits: number;
  l1Misses: number;
  l2Hits: number;
  l2Misses: number;
  l3Hits: number;
  l3Misses: number;
  ramAccesses: number;
  missRate: number;
  cpi: number;
}

// Latency in simulated cycles for each level
export const CACHE_LATENCIES = {
  L1: 4,
  L2: 12,
  L3: 40,
  RAM: 200,
};

// Default cache configuration
export const DEFAULT_CONFIG: CacheConfig = {
  l1Size: 8,
  l2Size: 32,
  l3Size: 128,
  lineSize: 64,
};

/**
 * LRU Cache implementation for each level
 */
export class LRUCache {
  private cache: number[] = [];
  private capacity: number;

  constructor(capacity: number) {
    this.capacity = capacity;
  }

  /**
   * Check if block is in cache and update LRU order
   * Returns true if hit, false if miss
   */
  access(blockId: number): boolean {
    const index = this.cache.indexOf(blockId);
    
    if (index !== -1) {
      // Hit: move to front (most recently used)
      this.cache.splice(index, 1);
      this.cache.unshift(blockId);
      return true;
    }
    
    return false;
  }

  /**
   * Insert block into cache with LRU eviction
   * Returns evicted block ID or -1 if no eviction
   */
  insert(blockId: number): number {
    let evicted = -1;
    
    // If at capacity, evict LRU (last element)
    if (this.cache.length >= this.capacity) {
      evicted = this.cache.pop() ?? -1;
    }
    
    // Insert at front (most recently used)
    this.cache.unshift(blockId);
    
    return evicted;
  }

  getBlocks(): number[] {
    return [...this.cache];
  }

  clear() {
    this.cache = [];
  }

  setCapacity(capacity: number) {
    this.capacity = capacity;
    // Evict excess blocks if capacity reduced
    while (this.cache.length > capacity) {
      this.cache.pop();
    }
  }
}

/**
 * Access pattern generators
 */
export class AccessPatternGenerator {
  private rng: SeededRandom;
  private datasetSize: number;
  private index: number = 0;
  private linkedListOrder: number[] = [];
  private matrixSize: number;

  constructor(datasetSize: number, seed: number = 12345) {
    this.rng = new SeededRandom(seed);
    this.datasetSize = datasetSize;
    this.matrixSize = Math.floor(Math.sqrt(datasetSize));
    this.generateLinkedListOrder();
  }

  private generateLinkedListOrder() {
    // Simulate pointer chasing with poor locality
    // Create jumps that span across memory
    this.linkedListOrder = [];
    const stride = Math.floor(this.datasetSize / 8) || 1;
    
    for (let i = 0; i < this.datasetSize; i++) {
      // Jump around memory to simulate pointer chasing
      const next = (i * stride + 7) % this.datasetSize;
      this.linkedListOrder.push(next);
    }
  }

  /**
   * Get next block ID based on access pattern
   */
  nextAccess(pattern: AccessPattern, optimized: boolean = false): number {
    let blockId: number;

    switch (pattern) {
      case 'sequential':
        // Sequential access - best for cache
        blockId = this.index % this.datasetSize;
        this.index++;
        break;

      case 'random':
        if (optimized) {
          // "Optimized" random: use smaller working set
          const workingSet = Math.floor(this.datasetSize / 4);
          blockId = this.rng.nextInt(workingSet);
        } else {
          blockId = this.rng.nextInt(this.datasetSize);
        }
        break;

      case 'linked-list':
        if (optimized) {
          // Optimized: sequential access (simulating array-of-structs)
          blockId = this.index % this.datasetSize;
          this.index++;
        } else {
          // Pointer chasing - poor locality
          const listIndex = this.index % this.linkedListOrder.length;
          blockId = this.linkedListOrder[listIndex];
          this.index++;
        }
        break;

      case 'matrix-row':
        // Row-major access - good for cache
        blockId = this.index % this.datasetSize;
        this.index++;
        break;

      case 'matrix-col':
        if (optimized) {
          // Optimized: switch to row-major
          blockId = this.index % this.datasetSize;
          this.index++;
        } else {
          // Column-major access - poor locality for row-major stored matrices
          const col = Math.floor(this.index / this.matrixSize) % this.matrixSize;
          const row = this.index % this.matrixSize;
          blockId = row * this.matrixSize + col;
          this.index++;
        }
        break;

      default:
        blockId = this.index++ % this.datasetSize;
    }

    return blockId;
  }

  reset(seed?: number) {
    this.index = 0;
    this.rng.reset(seed);
  }

  setDatasetSize(size: number) {
    this.datasetSize = size;
    this.matrixSize = Math.floor(Math.sqrt(size));
    this.generateLinkedListOrder();
  }
}

/**
 * Main Cache Simulator class
 */
export class CacheSimulator {
  private l1: LRUCache;
  private l2: LRUCache;
  private l3: LRUCache;
  private patternGenerator: AccessPatternGenerator;
  private metrics: CacheMetrics;
  private config: CacheConfig;

  constructor(config: CacheConfig = DEFAULT_CONFIG, datasetSize: number = 256) {
    this.config = config;
    this.l1 = new LRUCache(config.l1Size);
    this.l2 = new LRUCache(config.l2Size);
    this.l3 = new LRUCache(config.l3Size);
    this.patternGenerator = new AccessPatternGenerator(datasetSize);
    this.metrics = this.createEmptyMetrics();
  }

  private createEmptyMetrics(): CacheMetrics {
    return {
      totalAccesses: 0,
      l1Hits: 0,
      l1Misses: 0,
      l2Hits: 0,
      l2Misses: 0,
      l3Hits: 0,
      l3Misses: 0,
      ramAccesses: 0,
      missRate: 0,
      cpi: 1.0,
    };
  }

  /**
   * Perform a single memory access
   */
  access(pattern: AccessPattern, optimized: boolean = false): AccessResult {
    const blockId = this.patternGenerator.nextAccess(pattern, optimized);
    this.metrics.totalAccesses++;

    // Check L1
    if (this.l1.access(blockId)) {
      this.metrics.l1Hits++;
      return { blockId, hitLevel: 'L1', isHit: true, latency: CACHE_LATENCIES.L1 };
    }
    this.metrics.l1Misses++;

    // Check L2
    if (this.l2.access(blockId)) {
      this.metrics.l2Hits++;
      // Promote to L1
      this.l1.insert(blockId);
      return { blockId, hitLevel: 'L2', isHit: true, latency: CACHE_LATENCIES.L2 };
    }
    this.metrics.l2Misses++;

    // Check L3
    if (this.l3.access(blockId)) {
      this.metrics.l3Hits++;
      // Promote to L1 and L2
      this.l1.insert(blockId);
      this.l2.insert(blockId);
      return { blockId, hitLevel: 'L3', isHit: true, latency: CACHE_LATENCIES.L3 };
    }
    this.metrics.l3Misses++;

    // RAM access (cold miss)
    this.metrics.ramAccesses++;
    
    // Insert into all cache levels
    this.l1.insert(blockId);
    this.l2.insert(blockId);
    this.l3.insert(blockId);

    // Update derived metrics
    this.updateDerivedMetrics();

    return { blockId, hitLevel: 'RAM', isHit: false, latency: CACHE_LATENCIES.RAM };
  }

  private updateDerivedMetrics() {
    const totalMisses = this.metrics.l1Misses;
    this.metrics.missRate = this.metrics.totalAccesses > 0 
      ? (totalMisses / this.metrics.totalAccesses) * 100 
      : 0;

    // CPI calculation: base CPI + penalty for cache misses
    const baseCPI = 1.0;
    const l2Penalty = 0.1 * (this.metrics.l2Misses / Math.max(1, this.metrics.totalAccesses));
    const l3Penalty = 0.3 * (this.metrics.l3Misses / Math.max(1, this.metrics.totalAccesses));
    const ramPenalty = 1.5 * (this.metrics.ramAccesses / Math.max(1, this.metrics.totalAccesses));
    
    this.metrics.cpi = baseCPI + l2Penalty + l3Penalty + ramPenalty;
  }

  getMetrics(): CacheMetrics {
    this.updateDerivedMetrics();
    return { ...this.metrics };
  }

  getCacheState(): CacheState {
    return {
      l1: this.l1.getBlocks(),
      l2: this.l2.getBlocks(),
      l3: this.l3.getBlocks(),
    };
  }

  reset() {
    this.l1.clear();
    this.l2.clear();
    this.l3.clear();
    this.patternGenerator.reset();
    this.metrics = this.createEmptyMetrics();
  }

  updateConfig(config: Partial<CacheConfig>) {
    if (config.l1Size) this.l1.setCapacity(config.l1Size);
    if (config.l2Size) this.l2.setCapacity(config.l2Size);
    if (config.l3Size) this.l3.setCapacity(config.l3Size);
    this.config = { ...this.config, ...config };
  }

  setDatasetSize(size: number) {
    this.patternGenerator.setDatasetSize(size);
  }
}

/**
 * Pattern descriptions for teaching mode
 */
export const PATTERN_DESCRIPTIONS: Record<AccessPattern, { name: string; description: string; cacheImpact: string }> = {
  'sequential': {
    name: 'Sequential Array Access',
    description: 'Accessing array elements one after another (arr[0], arr[1], arr[2]...)',
    cacheImpact: '✅ Excellent locality! Each cache line holds multiple elements, so most accesses are hits.',
  },
  'random': {
    name: 'Random Array Access',
    description: 'Accessing array elements in random order',
    cacheImpact: '❌ Poor locality! Each access likely needs a new cache line, causing many misses.',
  },
  'linked-list': {
    name: 'Linked List Traversal',
    description: 'Following pointers from one node to the next (pointer chasing)',
    cacheImpact: '❌ Unpredictable! Nodes may be scattered in memory, causing frequent cache misses.',
  },
  'matrix-row': {
    name: 'Matrix Row-Major Access',
    description: 'Accessing matrix elements row by row (matching memory layout)',
    cacheImpact: '✅ Good locality! Memory is laid out row-by-row, so this is cache-friendly.',
  },
  'matrix-col': {
    name: 'Matrix Column-Major Access',
    description: 'Accessing matrix elements column by column (opposite of memory layout)',
    cacheImpact: '❌ Poor locality! Jumps across rows cause many cache misses.',
  },
};

/**
 * Teaching mode steps
 */
export interface TeachingStep {
  id: number;
  title: string;
  description: string;
  highlight: 'CPU' | 'L1' | 'L2' | 'L3' | 'RAM' | 'all';
  tip: string;
}

export const TEACHING_STEPS: TeachingStep[] = [
  {
    id: 1,
    title: 'CPU Requests Data',
    description: 'When your program needs data (like arr[5]), the CPU sends a request. Think of it as asking: "Hey, I need this piece of information!"',
    highlight: 'CPU',
    tip: 'The CPU is super fast but can\'t hold much data itself.',
  },
  {
    id: 2,
    title: 'Check L1 Cache (Fastest)',
    description: 'First, we check L1 cache - the CPU\'s "pocket drawer". It\'s tiny (a few KB) but incredibly fast (4 cycles). If the data is here, great!',
    highlight: 'L1',
    tip: 'L1 is like having notes in your pocket - instant access!',
  },
  {
    id: 3,
    title: 'Check L2 Cache (Still Fast)',
    description: 'If not in L1, check L2 - like a desk drawer. Bigger (256KB-1MB) but slower (12 cycles). Still much faster than going to RAM!',
    highlight: 'L2',
    tip: 'L2 is like your desk - takes a moment to reach, but close by.',
  },
  {
    id: 4,
    title: 'Check L3 Cache (Shared)',
    description: 'Still not found? Check L3 - shared by all CPU cores. Largest cache (8-64MB) but slowest of the caches (40 cycles).',
    highlight: 'L3',
    tip: 'L3 is like a shared filing cabinet - bigger but takes a walk.',
  },
  {
    id: 5,
    title: 'Fetch from RAM (Slowest)',
    description: 'If the data isn\'t in any cache level, we must go to RAM. This is the "warehouse" - huge storage but ~200 cycles! The CPU waits...',
    highlight: 'RAM',
    tip: 'RAM access is 50x slower than L1! This is why caches matter.',
  },
  {
    id: 6,
    title: 'Cache Fill & Future Speed',
    description: 'When we fetch from RAM, we also copy the data into all cache levels. Next time you need it, it\'ll be in L1 - super fast!',
    highlight: 'all',
    tip: 'Good programs access data in patterns that keep it in cache.',
  },
];
