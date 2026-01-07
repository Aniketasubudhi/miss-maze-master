import { motion } from "framer-motion";
import { Gauge, Terminal, Eye, Cpu, BarChart3, Shield } from "lucide-react";
import { useEffect, useState } from "react";

interface ToolingCardsProps {
  isSimulating: boolean;
}

const ToolingCards = ({ isSimulating }: ToolingCardsProps) => {
  const tools = [
    {
      name: "PMU",
      fullName: "Performance Monitoring Unit",
      icon: <Gauge className="w-6 h-6" />,
      color: "primary",
      description: "Tiny counters inside CPU that count events",
      bullets: [
        "Hardware counters built into the CPU",
        "Count cache hits, misses, cycles, instructions",
        "Zero overhead - runs in silicon!",
      ],
      counterLabel: "Events Counted",
    },
    {
      name: "perf",
      fullName: "Linux Performance Tool",
      icon: <Terminal className="w-6 h-6" />,
      color: "accent",
      description: "Reads PMU counters and prints stats",
      bullets: [
        "Command-line tool: perf stat ./program",
        "Reads PMU counters from the kernel",
        "Shows cache-misses, cycles, instructions",
      ],
      counterLabel: "Samples Collected",
    },
    {
      name: "eBPF",
      fullName: "Extended Berkeley Packet Filter",
      icon: <Eye className="w-6 h-6" />,
      color: "warning",
      description: "Safe observer inside the Linux kernel",
      bullets: [
        "Programs run inside the kernel safely",
        "Can trace cache misses per function",
        "Enables real-time visualization dashboards",
      ],
      counterLabel: "Traces Captured",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold mb-2">Our Project Tooling</h3>
        <p className="text-muted-foreground">
          These are the real tools we use to track cache misses on Linux
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {tools.map((tool, index) => (
          <ToolCard 
            key={tool.name} 
            tool={tool} 
            index={index}
            isSimulating={isSimulating}
          />
        ))}
      </div>

      {/* How they connect */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-primary/5 via-accent/5 to-warning/5 border border-border/50">
        <h4 className="font-bold mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5 text-primary" />
          How They Work Together
        </h4>
        <div className="flex flex-col md:flex-row items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-primary" />
            <span>CPU runs workload</span>
          </div>
          <span className="hidden md:block">→</span>
          <div className="flex items-center gap-2">
            <Gauge className="w-5 h-5 text-primary" />
            <span>PMU counts events</span>
          </div>
          <span className="hidden md:block">→</span>
          <div className="flex items-center gap-2">
            <Terminal className="w-5 h-5 text-accent" />
            <span>perf reads counters</span>
          </div>
          <span className="hidden md:block">→</span>
          <div className="flex items-center gap-2">
            <Eye className="w-5 h-5 text-warning" />
            <span>eBPF traces details</span>
          </div>
          <span className="hidden md:block">→</span>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-success" />
            <span>Dashboard visualizes</span>
          </div>
        </div>
      </div>
    </div>
  );
};

interface ToolCardProps {
  tool: {
    name: string;
    fullName: string;
    icon: React.ReactNode;
    color: string;
    description: string;
    bullets: string[];
    counterLabel: string;
  };
  index: number;
  isSimulating: boolean;
}

const ToolCard = ({ tool, index, isSimulating }: ToolCardProps) => {
  const [counter, setCounter] = useState(0);

  // Animate counter when simulating
  useEffect(() => {
    if (!isSimulating) return;
    
    const interval = setInterval(() => {
      setCounter((prev) => prev + Math.floor(Math.random() * 100) + 50);
    }, 500);

    return () => clearInterval(interval);
  }, [isSimulating]);

  const colorMap: Record<string, { bg: string; text: string; border: string }> = {
    primary: {
      bg: "from-primary/20 to-primary/5",
      text: "text-primary",
      border: "border-primary/30",
    },
    accent: {
      bg: "from-accent/20 to-accent/5",
      text: "text-accent",
      border: "border-accent/30",
    },
    warning: {
      bg: "from-warning/20 to-warning/5",
      text: "text-warning",
      border: "border-warning/30",
    },
  };

  const colors = colorMap[tool.color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`relative p-6 rounded-2xl bg-gradient-to-br ${colors.bg} border ${colors.border} overflow-hidden group hover:shadow-lg transition-shadow`}
    >
      {/* Animated background glow */}
      {isSimulating && (
        <motion.div
          className="absolute inset-0 opacity-30"
          animate={{
            background: [
              `radial-gradient(circle at 20% 20%, hsl(var(--${tool.color})) 0%, transparent 50%)`,
              `radial-gradient(circle at 80% 80%, hsl(var(--${tool.color})) 0%, transparent 50%)`,
              `radial-gradient(circle at 20% 20%, hsl(var(--${tool.color})) 0%, transparent 50%)`,
            ],
          }}
          transition={{ duration: 3, repeat: Infinity }}
        />
      )}

      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-xl bg-background/50 ${colors.text}`}>
          {tool.icon}
        </div>
        <span className={`text-xs font-mono px-2 py-1 rounded-full bg-background/50 ${colors.text}`}>
          {tool.name}
        </span>
      </div>

      {/* Title */}
      <h4 className="font-bold text-lg mb-1">{tool.fullName}</h4>
      <p className="text-sm text-muted-foreground mb-4">{tool.description}</p>

      {/* Bullets */}
      <ul className="space-y-2 mb-4">
        {tool.bullets.map((bullet, i) => (
          <li key={i} className="flex items-start gap-2 text-sm">
            <span className={`mt-1 w-1.5 h-1.5 rounded-full flex-shrink-0 ${colors.text} bg-current`} />
            <span className="text-muted-foreground">{bullet}</span>
          </li>
        ))}
      </ul>

      {/* Live counter */}
      <div className={`mt-auto pt-4 border-t ${colors.border}`}>
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">{tool.counterLabel}</span>
          <motion.span
            key={counter}
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className={`font-mono font-bold ${colors.text}`}
          >
            {counter.toLocaleString()}
          </motion.span>
        </div>
        {isSimulating && (
          <motion.div
            className={`h-1 mt-2 rounded-full overflow-hidden bg-background/50`}
          >
            <motion.div
              className={`h-full bg-current ${colors.text}`}
              animate={{ x: ["-100%", "100%"] }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              style={{ width: "50%" }}
            />
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default ToolingCards;
