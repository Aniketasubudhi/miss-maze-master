import { useState, useCallback, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { GraduationCap, Play, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import CachePipeline from "./CachePipeline";
import SimulatorControls from "./SimulatorControls";
import MetricsPanel from "./MetricsPanel";
import SimulatorCharts from "./SimulatorCharts";
import TeachingOverlay from "./TeachingOverlay";
import ToolingCards from "./ToolingCards";
import {
  CacheSimulator,
  AccessPattern,
  CacheLevel,
  CacheMetrics,
  DEFAULT_CONFIG,
} from "@/lib/cacheSimulation";

const CacheSimulatorPage = () => {
  // Simulator state
  const [pattern, setPattern] = useState<AccessPattern>("sequential");
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [optimized, setOptimized] = useState(false);
  const [datasetSize, setDatasetSize] = useState<"small" | "medium" | "large">("medium");
  
  // Cache size state
  const [l1Size, setL1Size] = useState(DEFAULT_CONFIG.l1Size);
  const [l2Size, setL2Size] = useState(DEFAULT_CONFIG.l2Size);
  const [l3Size, setL3Size] = useState(DEFAULT_CONFIG.l3Size);

  // Visual state
  const [activeLevel, setActiveLevel] = useState<CacheLevel | null>(null);
  const [isHit, setIsHit] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentBlockId, setCurrentBlockId] = useState<number | null>(null);

  // Cache state
  const [l1Blocks, setL1Blocks] = useState<number[]>([]);
  const [l2Blocks, setL2Blocks] = useState<number[]>([]);
  const [l3Blocks, setL3Blocks] = useState<number[]>([]);

  // Metrics
  const [metrics, setMetrics] = useState<CacheMetrics>({
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
  });
  const [metricsHistory, setMetricsHistory] = useState<CacheMetrics[]>([]);

  // Teaching mode
  const [teachingMode, setTeachingMode] = useState(false);
  const [teachingStep, setTeachingStep] = useState(0);

  // Simulator instance
  const simulatorRef = useRef<CacheSimulator | null>(null);
  const animationRef = useRef<number | null>(null);

  // Initialize simulator
  useEffect(() => {
    const size = datasetSize === "small" ? 64 : datasetSize === "medium" ? 256 : 1024;
    if (!simulatorRef.current) {
      simulatorRef.current = new CacheSimulator(
        { l1Size, l2Size, l3Size, lineSize: 64 },
        size
      );
    }
  }, [l1Size, l2Size, l3Size, datasetSize]);

  // Update simulator config when settings change
  useEffect(() => {
    if (simulatorRef.current) {
      simulatorRef.current.updateConfig({ l1Size, l2Size, l3Size });
    }
  }, [l1Size, l2Size, l3Size]);

  useEffect(() => {
    if (simulatorRef.current) {
      const size = datasetSize === "small" ? 64 : datasetSize === "medium" ? 256 : 1024;
      simulatorRef.current.setDatasetSize(size);
    }
  }, [datasetSize]);

  // Perform a single access step
  const performStep = useCallback(async () => {
    if (!simulatorRef.current) return;

    setIsProcessing(true);
    const result = simulatorRef.current.access(pattern, optimized);
    setCurrentBlockId(result.blockId);

    // Animate through cache levels
    const levels: CacheLevel[] = ["L1", "L2", "L3", "RAM"];
    const hitIndex = levels.indexOf(result.hitLevel);

    for (let i = 0; i <= hitIndex; i++) {
      setActiveLevel(levels[i]);
      setIsHit(i === hitIndex && result.isHit);
      
      // Wait based on simulated latency (scaled by speed)
      const baseDelay = i === 3 ? 600 : i === 2 ? 200 : i === 1 ? 100 : 50;
      await new Promise((resolve) => setTimeout(resolve, baseDelay / speed));
    }

    // Update cache state visualization
    const state = simulatorRef.current.getCacheState();
    setL1Blocks(state.l1);
    setL2Blocks(state.l2);
    setL3Blocks(state.l3);

    // Update metrics
    const newMetrics = simulatorRef.current.getMetrics();
    setMetrics(newMetrics);
    setMetricsHistory((prev) => [...prev.slice(-100), newMetrics]);

    // Small delay before next access
    await new Promise((resolve) => setTimeout(resolve, 100 / speed));
    setIsProcessing(false);
    setActiveLevel(null);
    setCurrentBlockId(null);
  }, [pattern, optimized, speed]);

  // Auto-play loop
  useEffect(() => {
    if (!isPlaying) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      return;
    }

    let isCancelled = false;

    const runLoop = async () => {
      while (!isCancelled && isPlaying) {
        await performStep();
      }
    };

    runLoop();

    return () => {
      isCancelled = true;
    };
  }, [isPlaying, performStep]);

  // Reset simulation
  const handleReset = () => {
    setIsPlaying(false);
    if (simulatorRef.current) {
      simulatorRef.current.reset();
    }
    setMetrics({
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
    });
    setMetricsHistory([]);
    setL1Blocks([]);
    setL2Blocks([]);
    setL3Blocks([]);
    setActiveLevel(null);
    setIsProcessing(false);
  };

  const handleCacheSizeChange = (level: "l1" | "l2" | "l3", size: number) => {
    if (level === "l1") setL1Size(size);
    else if (level === "l2") setL2Size(size);
    else setL3Size(size);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b border-border/50 bg-background/80 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-bold gradient-text">Cache Miss Simulator</h1>
              <p className="text-sm text-muted-foreground">
                Visualizing CPU Cache Performance
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={() => setTeachingMode(true)}
            className="border-primary/50 hover:bg-primary/10"
          >
            <GraduationCap className="w-4 h-4 mr-2" />
            Teaching Mode
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* Hero buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap gap-4 justify-center"
        >
          <Button
            size="lg"
            onClick={() => setIsPlaying(!isPlaying)}
            className="px-8"
          >
            <Play className="w-5 h-5 mr-2" />
            {isPlaying ? "Pause Simulation" : "Start Simulation"}
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => setTeachingMode(true)}
          >
            <GraduationCap className="w-5 h-5 mr-2" />
            Teaching Mode
          </Button>
        </motion.div>

        {/* Main simulator area */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Cache Pipeline */}
          <div className="flex-1">
            <CachePipeline
              activeLevel={activeLevel}
              isHit={isHit}
              isProcessing={isProcessing}
              currentBlockId={currentBlockId}
              l1Blocks={l1Blocks}
              l2Blocks={l2Blocks}
              l3Blocks={l3Blocks}
            />
          </div>

          {/* Controls Panel */}
          <SimulatorControls
            pattern={pattern}
            onPatternChange={setPattern}
            isPlaying={isPlaying}
            onPlayPause={() => setIsPlaying(!isPlaying)}
            onStep={performStep}
            onReset={handleReset}
            speed={speed}
            onSpeedChange={setSpeed}
            optimized={optimized}
            onOptimizedChange={setOptimized}
            datasetSize={datasetSize}
            onDatasetSizeChange={setDatasetSize}
            l1Size={l1Size}
            l2Size={l2Size}
            l3Size={l3Size}
            onCacheSizeChange={handleCacheSizeChange}
          />
        </div>

        {/* Metrics Panel */}
        <section>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            Live Metrics
          </h2>
          <MetricsPanel metrics={metrics} />
        </section>

        {/* Charts */}
        <section>
          <h2 className="text-xl font-bold mb-4">Performance Charts</h2>
          <SimulatorCharts
            metricsHistory={metricsHistory}
            currentMetrics={metrics}
          />
        </section>

        {/* Tooling Cards */}
        <section className="py-8">
          <ToolingCards isSimulating={isPlaying} />
        </section>

        {/* Pattern explanation */}
        <section className="p-6 rounded-2xl bg-muted/30 border border-border/50">
          <h3 className="font-bold text-lg mb-4">Understanding the Current Pattern</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-primary mb-2">
                {pattern === "sequential" && "Sequential Array Access"}
                {pattern === "random" && "Random Array Access"}
                {pattern === "linked-list" && "Linked List Traversal"}
                {pattern === "matrix-row" && "Matrix Row-Major Access"}
                {pattern === "matrix-col" && "Matrix Column-Major Access"}
              </h4>
              <p className="text-sm text-muted-foreground">
                {pattern === "sequential" && 
                  "Accessing array elements in order (0, 1, 2, 3...) provides excellent spatial locality. The CPU prefetcher can predict and load data ahead of time."}
                {pattern === "random" && 
                  "Random access patterns are unpredictable. Each access might need a new cache line, causing many cache misses."}
                {pattern === "linked-list" && 
                  "Pointer chasing jumps around memory unpredictably. Each node could be anywhere, making caching difficult."}
                {pattern === "matrix-row" && 
                  "Row-major access matches how 2D arrays are stored in memory (row by row), providing good cache utilization."}
                {pattern === "matrix-col" && 
                  "Column-major access in a row-major stored matrix causes strided access, missing cache lines frequently."}
              </p>
            </div>
            <div className="p-4 rounded-xl bg-background/50">
              <h4 className="font-medium text-accent mb-2">
                {optimized ? "✨ Optimization Applied" : "⚠️ Unoptimized Mode"}
              </h4>
              <p className="text-sm text-muted-foreground">
                {optimized ? (
                  pattern === "random" ? "Using smaller working set to improve cache reuse." :
                  pattern === "linked-list" ? "Simulating array-of-structs (contiguous memory) instead of scattered nodes." :
                  pattern === "matrix-col" ? "Switched to row-major traversal for better locality." :
                  "Already optimal! Sequential patterns are naturally cache-friendly."
                ) : (
                  "Toggle 'Optimization Mode' to see how cache-aware techniques improve performance."
                )}
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Teaching Overlay */}
      <TeachingOverlay
        isActive={teachingMode}
        currentStep={teachingStep}
        onStepChange={setTeachingStep}
        onClose={() => {
          setTeachingMode(false);
          setTeachingStep(0);
        }}
      />

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border/50">
        <div className="max-w-6xl mx-auto text-center text-muted-foreground text-sm">
          <p>© 2024 Cache Miss Tracking & Optimization Project</p>
          <p className="mt-1">Interactive Simulator • RV College of Engineering</p>
        </div>
      </footer>
    </div>
  );
};

export default CacheSimulatorPage;
