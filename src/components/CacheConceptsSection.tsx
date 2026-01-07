import { useState } from "react";
import { ChevronDown, Zap, Cpu, Database } from "lucide-react";
import { cn } from "@/lib/utils";

interface CacheLevel {
  id: string;
  name: string;
  icon: typeof Zap;
  color: string;
  size: string;
  speed: string;
  missImpact: string;
  description: string;
  details: string[];
}

const cacheLevels: CacheLevel[] = [
  {
    id: "l1",
    name: "L1 Cache",
    icon: Zap,
    color: "cache-l1",
    size: "32-64 KB",
    speed: "~1 ns (4 cycles)",
    missImpact: "Low - Falls back to L2",
    description: "The fastest cache, split into instruction (L1i) and data (L1d) caches. Each core has its own dedicated L1 cache.",
    details: [
      "Directly integrated into each CPU core",
      "Split architecture: L1i for instructions, L1d for data",
      "Associativity: 8-way set associative",
      "Line size: 64 bytes",
    ],
  },
  {
    id: "l2",
    name: "L2 Cache",
    icon: Cpu,
    color: "cache-l2",
    size: "256 KB - 1 MB",
    speed: "~4 ns (12 cycles)",
    missImpact: "Medium - Noticeable latency",
    description: "Per-core unified cache that handles both instructions and data. Larger than L1 but slower.",
    details: [
      "Unified cache for both instructions and data",
      "Private to each core (non-shared)",
      "Associativity: 8-16 way set associative",
      "Acts as victim cache for L1 evictions",
    ],
  },
  {
    id: "l3",
    name: "L3 / LLC Cache",
    icon: Database,
    color: "cache-l3",
    size: "8-64 MB",
    speed: "~12 ns (40 cycles)",
    missImpact: "High - RAM fetch required",
    description: "Last Level Cache shared across all cores. Missing here means expensive RAM access.",
    details: [
      "Shared among all cores on the chip",
      "Inclusive or exclusive design varies by architecture",
      "Critical for multi-threaded workloads",
      "Miss here = 100-300 cycle RAM penalty",
    ],
  },
];

const CacheConceptsSection = () => {
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  const toggleCard = (id: string) => {
    setExpandedCard(expandedCard === id ? null : id);
  };

  return (
    <section id="concepts" className="py-24 px-4 bg-gradient-to-b from-transparent via-secondary/20 to-transparent">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="section-title">
            Cache <span className="gradient-text">Hierarchy</span>
          </h2>
          <p className="section-subtitle mx-auto">
            Modern CPUs use a multi-level cache hierarchy to minimize memory latency.
            Click on each level to explore its characteristics.
          </p>
        </div>

        {/* Visual hierarchy */}
        <div className="flex justify-center mb-12">
          <div className="flex items-end gap-4">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-lg bg-cache-l1/20 border-2 border-cache-l1 flex items-center justify-center">
                <span className="text-cache-l1 font-bold">L1</span>
              </div>
              <span className="text-xs text-muted-foreground mt-2">Fastest</span>
            </div>
            <div className="text-muted-foreground">→</div>
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 rounded-lg bg-cache-l2/20 border-2 border-cache-l2 flex items-center justify-center">
                <span className="text-cache-l2 font-bold">L2</span>
              </div>
              <span className="text-xs text-muted-foreground mt-2">Larger</span>
            </div>
            <div className="text-muted-foreground">→</div>
            <div className="flex flex-col items-center">
              <div className="w-32 h-32 rounded-lg bg-cache-l3/20 border-2 border-cache-l3 flex items-center justify-center">
                <span className="text-cache-l3 font-bold">L3</span>
              </div>
              <span className="text-xs text-muted-foreground mt-2">Shared</span>
            </div>
            <div className="text-muted-foreground">→</div>
            <div className="flex flex-col items-center">
              <div className="w-40 h-40 rounded-lg bg-muted/50 border-2 border-muted-foreground/30 flex items-center justify-center">
                <span className="text-muted-foreground font-bold">RAM</span>
              </div>
              <span className="text-xs text-muted-foreground mt-2">Slowest</span>
            </div>
          </div>
        </div>

        {/* Expandable cards */}
        <div className="space-y-4">
          {cacheLevels.map((cache) => (
            <div
              key={cache.id}
              className={cn(
                "glass-card cursor-pointer transition-all duration-300",
                expandedCard === cache.id && "ring-2 ring-primary/50"
              )}
              onClick={() => toggleCard(cache.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={cn("p-3 rounded-xl", `bg-${cache.color}/20`)}>
                    <cache.icon className={cn("w-6 h-6", `text-${cache.color}`)} />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">{cache.name}</h3>
                    <p className="text-muted-foreground text-sm">{cache.description}</p>
                  </div>
                </div>
                <ChevronDown
                  className={cn(
                    "w-6 h-6 text-muted-foreground transition-transform duration-300",
                    expandedCard === cache.id && "rotate-180"
                  )}
                />
              </div>

              {expandedCard === cache.id && (
                <div className="mt-6 pt-6 border-t border-border/50 animate-fade-in">
                  <div className="grid md:grid-cols-3 gap-6 mb-6">
                    <div className="bg-secondary/50 rounded-lg p-4">
                      <span className="text-sm text-muted-foreground">Size</span>
                      <p className={cn("text-lg font-semibold", `text-${cache.color}`)}>{cache.size}</p>
                    </div>
                    <div className="bg-secondary/50 rounded-lg p-4">
                      <span className="text-sm text-muted-foreground">Access Speed</span>
                      <p className={cn("text-lg font-semibold", `text-${cache.color}`)}>{cache.speed}</p>
                    </div>
                    <div className="bg-secondary/50 rounded-lg p-4">
                      <span className="text-sm text-muted-foreground">Miss Impact</span>
                      <p className={cn("text-lg font-semibold", `text-${cache.color}`)}>{cache.missImpact}</p>
                    </div>
                  </div>
                  <ul className="space-y-2">
                    {cache.details.map((detail, index) => (
                      <li key={index} className="flex items-start gap-2 text-muted-foreground">
                        <span className={cn("w-1.5 h-1.5 rounded-full mt-2", `bg-${cache.color}`)} />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CacheConceptsSection;
