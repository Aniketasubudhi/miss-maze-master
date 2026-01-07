import { CheckCircle2, Lightbulb, ArrowRight } from "lucide-react";

const tips = [
  {
    title: "Use Sequential Access Patterns",
    description: "When iterating over arrays, prefer sequential access to maximize cache line utilization and enable hardware prefetching.",
    code: "for (int i = 0; i < n; i++) sum += arr[i];",
    impact: "Up to 50× faster than random access",
  },
  {
    title: "Avoid Pointer Chasing",
    description: "Linked structures cause cache pollution. Consider using arrays or contiguous memory layouts when performance matters.",
    code: "// Bad: node = node->next\n// Good: arr[i++]",
    impact: "Eliminates unpredictable memory patterns",
  },
  {
    title: "Prefer Row-Major Traversal",
    description: "In C/C++, 2D arrays are stored row-major. Traverse rows first to follow memory layout.",
    code: "for (i=0; i<N; i++)\n  for (j=0; j<N; j++)\n    sum += matrix[i][j]; // ✓",
    impact: "3-5× improvement over column-major",
  },
  {
    title: "Optimize Data Structures",
    description: "Keep frequently accessed data together. Use struct-of-arrays instead of array-of-structs for hot paths.",
    code: "// SoA: x[], y[], z[]\n// vs AoA: Point { x, y, z }[]",
    impact: "Better cache line packing",
  },
  {
    title: "Align Data to Cache Lines",
    description: "Ensure critical data structures are aligned to 64-byte cache line boundaries to prevent false sharing.",
    code: "alignas(64) int data[1024];",
    impact: "Prevents cache line splitting",
  },
  {
    title: "Block/Tile Large Computations",
    description: "For matrix operations, process in cache-sized blocks to maximize data reuse before eviction.",
    code: "// Process NxN blocks that fit in L1",
    impact: "Optimal cache reuse for large data",
  },
];

const OptimizationSection = () => {
  return (
    <section id="optimization" className="py-24 px-4 bg-gradient-to-b from-transparent via-secondary/20 to-transparent">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="section-title">
            Optimization <span className="gradient-text">Insights</span>
          </h2>
          <p className="section-subtitle mx-auto">
            Actionable tips based on our analysis to help you write cache-friendly code.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tips.map((tip, index) => (
            <div
              key={tip.title}
              className="glass-card group hover:border-success/50 transition-all duration-300"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-start gap-3 mb-4">
                <div className="p-2 rounded-lg bg-success/20 group-hover:bg-success/30 transition-colors">
                  <CheckCircle2 className="w-5 h-5 text-success" />
                </div>
                <h3 className="text-lg font-semibold">{tip.title}</h3>
              </div>
              
              <p className="text-muted-foreground text-sm mb-4">{tip.description}</p>
              
              <div className="bg-secondary/50 rounded-lg p-3 font-mono text-xs mb-4 overflow-x-auto">
                <pre className="text-primary whitespace-pre-wrap">{tip.code}</pre>
              </div>
              
              <div className="flex items-center gap-2 text-success text-sm">
                <Lightbulb className="w-4 h-4" />
                {tip.impact}
              </div>
            </div>
          ))}
        </div>

        {/* Quick reference */}
        <div className="mt-16 glass-card">
          <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-primary" />
            Quick Decision Guide
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="flex items-center gap-4">
              <span className="text-muted-foreground">Need speed?</span>
              <ArrowRight className="w-4 h-4 text-primary" />
              <span className="text-success font-medium">Sequential arrays</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-muted-foreground">Large dataset?</span>
              <ArrowRight className="w-4 h-4 text-primary" />
              <span className="text-success font-medium">Block processing</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-muted-foreground">Multi-threaded?</span>
              <ArrowRight className="w-4 h-4 text-primary" />
              <span className="text-success font-medium">Cache alignment</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OptimizationSection;
