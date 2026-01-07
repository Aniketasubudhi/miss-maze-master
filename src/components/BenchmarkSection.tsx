import { ArrowRight, ArrowRightLeft, Link2, Grid3X3 } from "lucide-react";

const benchmarks = [
  {
    icon: ArrowRight,
    title: "Sequential Array Traversal",
    pattern: "arr[0] → arr[1] → arr[2] → ...",
    cacheExpected: "Excellent - High spatial locality",
    status: "optimal",
    description: "Accesses array elements in order, maximizing cache line utilization. Prefetcher can predict and load next elements.",
  },
  {
    icon: ArrowRightLeft,
    title: "Random Array Traversal",
    pattern: "arr[42] → arr[7] → arr[891] → ...",
    cacheExpected: "Poor - Frequent cache misses",
    status: "poor",
    description: "Unpredictable access patterns defeat cache prefetching. Each access likely triggers a cache miss.",
  },
  {
    icon: Link2,
    title: "Linked List Traversal",
    pattern: "node1 → node2 → node3 → ...",
    cacheExpected: "Variable - Depends on allocation",
    status: "moderate",
    description: "Pointer chasing prevents prefetching. Non-contiguous memory allocation leads to cache pollution.",
  },
  {
    icon: Grid3X3,
    title: "Matrix Access Patterns",
    pattern: "Row-major vs Column-major",
    cacheExpected: "Row-major optimal for C/C++",
    status: "comparative",
    description: "Row-major access follows memory layout in C. Column-major causes stride-based misses due to non-contiguous access.",
  },
];

const BenchmarkSection = () => {
  const getStatusStyles = (status: string) => {
    switch (status) {
      case "optimal":
        return "border-success/30 hover:border-success/60";
      case "poor":
        return "border-destructive/30 hover:border-destructive/60";
      case "moderate":
        return "border-warning/30 hover:border-warning/60";
      case "comparative":
        return "border-accent/30 hover:border-accent/60";
      default:
        return "";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "optimal":
        return <span className="px-2 py-1 rounded-full text-xs bg-success/20 text-success">Cache Friendly</span>;
      case "poor":
        return <span className="px-2 py-1 rounded-full text-xs bg-destructive/20 text-destructive">Cache Hostile</span>;
      case "moderate":
        return <span className="px-2 py-1 rounded-full text-xs bg-warning/20 text-warning">Unpredictable</span>;
      case "comparative":
        return <span className="px-2 py-1 rounded-full text-xs bg-accent/20 text-accent">Pattern Dependent</span>;
      default:
        return null;
    }
  };

  return (
    <section id="benchmarks" className="py-24 px-4 bg-gradient-to-b from-transparent via-secondary/20 to-transparent">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="section-title">
            Benchmark <span className="gradient-text">Workloads</span>
          </h2>
          <p className="section-subtitle mx-auto">
            We analyze different memory access patterns to understand their impact on cache performance.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {benchmarks.map((benchmark, index) => (
            <div
              key={benchmark.title}
              className={`glass-card transition-all duration-300 ${getStatusStyles(benchmark.status)}`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-secondary">
                    <benchmark.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold">{benchmark.title}</h3>
                </div>
                {getStatusBadge(benchmark.status)}
              </div>
              
              <div className="mb-4 p-3 rounded-lg bg-secondary/50 font-mono text-sm">
                <span className="text-muted-foreground">Pattern: </span>
                <span className="text-primary">{benchmark.pattern}</span>
              </div>
              
              <p className="text-muted-foreground text-sm mb-4">{benchmark.description}</p>
              
              <div className="pt-4 border-t border-border/50">
                <span className="text-xs text-muted-foreground uppercase tracking-wide">Expected Cache Behavior</span>
                <p className="text-sm font-medium mt-1">{benchmark.cacheExpected}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Visual comparison */}
        <div className="mt-12 glass-card">
          <h3 className="text-lg font-semibold mb-6">Memory Layout Visualization</h3>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <span className="text-sm text-muted-foreground mb-3 block">Sequential Access (Cache Friendly)</span>
              <div className="flex gap-1">
                {[...Array(16)].map((_, i) => (
                  <div
                    key={i}
                    className="w-full h-8 rounded bg-success/60 transition-all duration-300"
                    style={{ animationDelay: `${i * 50}ms` }}
                  />
                ))}
              </div>
              <div className="mt-2 flex items-center gap-2 text-success text-sm">
                <div className="w-2 h-2 rounded-full bg-success" />
                All in same cache line
              </div>
            </div>
            <div>
              <span className="text-sm text-muted-foreground mb-3 block">Random Access (Cache Hostile)</span>
              <div className="flex gap-1">
                {[...Array(16)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-full h-8 rounded transition-all duration-300 ${
                      [0, 3, 7, 11, 14].includes(i) ? "bg-destructive/60" : "bg-muted/30"
                    }`}
                  />
                ))}
              </div>
              <div className="mt-2 flex items-center gap-2 text-destructive text-sm">
                <div className="w-2 h-2 rounded-full bg-destructive" />
                Scattered access pattern
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BenchmarkSection;
