import { motion } from "framer-motion";
import { Activity, Zap, AlertTriangle, Clock, TrendingUp, TrendingDown } from "lucide-react";
import { CacheMetrics } from "@/lib/cacheSimulation";
import { cn } from "@/lib/utils";

interface MetricsPanelProps {
  metrics: CacheMetrics;
}

const MetricsPanel = ({ metrics }: MetricsPanelProps) => {
  const {
    totalAccesses,
    l1Hits,
    l1Misses,
    l2Hits,
    l2Misses,
    l3Hits,
    l3Misses,
    ramAccesses,
    missRate,
    cpi,
  } = metrics;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
      {/* Total Accesses */}
      <MetricCard
        label="Accesses"
        value={totalAccesses}
        icon={<Activity className="w-4 h-4" />}
        color="primary"
        tooltip="Total number of memory access requests"
      />

      {/* L1 Stats */}
      <MetricCard
        label="L1 Hits"
        value={l1Hits}
        subValue={l1Misses > 0 ? `${l1Misses} miss` : undefined}
        icon={<Zap className="w-4 h-4" />}
        color="cache-l1"
        isGood={l1Hits > l1Misses}
        tooltip="L1 cache is the fastest! Hits here are great."
      />

      {/* L2 Stats */}
      <MetricCard
        label="L2 Hits"
        value={l2Hits}
        subValue={l2Misses > 0 ? `${l2Misses} miss` : undefined}
        icon={<Zap className="w-4 h-4" />}
        color="cache-l2"
        isGood={l2Hits > l2Misses}
        tooltip="L2 is slower than L1, but still fast."
      />

      {/* L3 Stats */}
      <MetricCard
        label="L3 Hits"
        value={l3Hits}
        subValue={l3Misses > 0 ? `${l3Misses} miss` : undefined}
        icon={<Zap className="w-4 h-4" />}
        color="cache-l3"
        isGood={l3Hits > l3Misses}
        tooltip="L3/LLC is the last cache before RAM."
      />

      {/* RAM Accesses */}
      <MetricCard
        label="RAM Accesses"
        value={ramAccesses}
        icon={<AlertTriangle className="w-4 h-4" />}
        color="warning"
        isGood={ramAccesses < totalAccesses * 0.1}
        tooltip="RAM access is very slow (~200 cycles). Minimize these!"
      />

      {/* Miss Rate */}
      <MetricCard
        label="Miss Rate"
        value={`${missRate.toFixed(1)}%`}
        icon={missRate > 30 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
        color={missRate > 50 ? "destructive" : missRate > 20 ? "warning" : "success"}
        isGood={missRate < 20}
        tooltip="Percentage of accesses that missed L1 cache."
      />

      {/* CPI */}
      <MetricCard
        label="CPI"
        value={cpi.toFixed(2)}
        icon={<Clock className="w-4 h-4" />}
        color={cpi > 2 ? "destructive" : cpi > 1.3 ? "warning" : "success"}
        isGood={cpi < 1.3}
        tooltip="Cycles Per Instruction. Lower is better! Cache misses increase CPI."
      />
    </div>
  );
};

interface MetricCardProps {
  label: string;
  value: string | number;
  subValue?: string;
  icon: React.ReactNode;
  color: string;
  isGood?: boolean;
  tooltip: string;
}

const MetricCard = ({ label, value, subValue, icon, color, isGood, tooltip }: MetricCardProps) => {
  // Map color names to CSS custom properties
  const colorMap: Record<string, string> = {
    'primary': 'hsl(var(--primary))',
    'cache-l1': 'hsl(var(--l1-cache))',
    'cache-l2': 'hsl(var(--l2-cache))',
    'cache-l3': 'hsl(var(--l3-cache))',
    'warning': 'hsl(var(--warning))',
    'success': 'hsl(var(--success))',
    'destructive': 'hsl(var(--destructive))',
  };

  const bgColor = colorMap[color] || colorMap.primary;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn(
        "relative p-4 rounded-xl border backdrop-blur-sm transition-all group cursor-help",
        "bg-card/50 border-border/50 hover:border-border"
      )}
      title={tooltip}
    >
      {/* Colored accent bar */}
      <div 
        className="absolute top-0 left-0 right-0 h-1 rounded-t-xl opacity-70"
        style={{ backgroundColor: bgColor }}
      />
      
      <div className="flex items-start justify-between mb-2">
        <span 
          className="p-1.5 rounded-lg"
          style={{ backgroundColor: `${bgColor}20`, color: bgColor }}
        >
          {icon}
        </span>
        {isGood !== undefined && (
          <span className={cn(
            "text-[10px] px-1.5 py-0.5 rounded-full font-medium",
            isGood ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
          )}>
            {isGood ? "Good" : "High"}
          </span>
        )}
      </div>

      <motion.div
        key={value.toString()}
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-bold tabular-nums"
        style={{ color: bgColor }}
      >
        {value}
      </motion.div>

      <div className="flex items-center justify-between mt-1">
        <span className="text-xs text-muted-foreground">{label}</span>
        {subValue && (
          <span className="text-xs text-red-400">{subValue}</span>
        )}
      </div>

      {/* Tooltip indicator */}
      <div className="absolute bottom-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <span className="text-[8px] text-muted-foreground">ℹ️</span>
      </div>
    </motion.div>
  );
};

export default MetricsPanel;
