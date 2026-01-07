import { useEffect, useState, useRef } from "react";
import { TrendingUp, TrendingDown, Target, Zap } from "lucide-react";

const results = [
  {
    icon: TrendingUp,
    value: 5,
    suffix: "×",
    label: "Performance Improvement",
    description: "Sequential vs random access",
    color: "success",
  },
  {
    icon: TrendingDown,
    value: 97,
    suffix: "%",
    label: "Cache Miss Reduction",
    description: "With optimized patterns",
    color: "primary",
  },
  {
    icon: Target,
    value: 99,
    suffix: "%",
    label: "L1 Hit Rate Achieved",
    description: "For sequential workloads",
    color: "cache-l1",
  },
  {
    icon: Zap,
    value: 1.2,
    suffix: "",
    label: "CPI (Optimized)",
    description: "Cycles per instruction",
    color: "accent",
  },
];

const AnimatedCounter = ({ target, suffix }: { target: number; suffix: string }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const duration = 2000;
          const steps = 60;
          const increment = target / steps;
          let current = 0;

          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              setCount(target);
              clearInterval(timer);
            } else {
              setCount(Number(current.toFixed(1)));
            }
          }, duration / steps);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [target]);

  return (
    <div ref={ref} className="text-4xl md:text-5xl font-bold gradient-text">
      {count}
      {suffix}
    </div>
  );
};

const ResultsSection = () => {
  return (
    <section id="results" className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="section-title">
            Key <span className="gradient-text">Results</span>
          </h2>
          <p className="section-subtitle mx-auto">
            Our analysis demonstrates the dramatic impact of cache-aware programming.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {results.map((result, index) => (
            <div
              key={result.label}
              className="glass-card text-center group"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={`inline-flex p-3 rounded-xl bg-${result.color}/20 mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <result.icon className={`w-6 h-6 text-${result.color}`} />
              </div>
              <AnimatedCounter target={result.value} suffix={result.suffix} />
              <p className="text-foreground font-medium mt-2">{result.label}</p>
              <p className="text-muted-foreground text-sm mt-1">{result.description}</p>
            </div>
          ))}
        </div>

        {/* Key learnings */}
        <div className="glass-card">
          <h3 className="text-xl font-semibold mb-6">Key Learnings</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-success mt-2" />
                <div>
                  <p className="font-medium">Spatial Locality Matters</p>
                  <p className="text-muted-foreground text-sm">
                    Sequential access patterns achieve near-perfect cache utilization due to hardware prefetching.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                <div>
                  <p className="font-medium">Cache Hierarchy is Critical</p>
                  <p className="text-muted-foreground text-sm">
                    Understanding L1/L2/L3 characteristics enables targeted optimization strategies.
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-accent mt-2" />
                <div>
                  <p className="font-medium">Data Structure Choice</p>
                  <p className="text-muted-foreground text-sm">
                    Arrays outperform linked structures for sequential access patterns.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-warning mt-2" />
                <div>
                  <p className="font-medium">Profiling is Essential</p>
                  <p className="text-muted-foreground text-sm">
                    PMU counters and eBPF reveal hidden performance bottlenecks invisible to standard profilers.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ResultsSection;
