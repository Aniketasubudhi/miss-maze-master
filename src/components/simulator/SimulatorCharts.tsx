import { useMemo } from "react";
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { CacheMetrics } from "@/lib/cacheSimulation";

interface SimulatorChartsProps {
  metricsHistory: CacheMetrics[];
  currentMetrics: CacheMetrics;
}

const SimulatorCharts = ({ metricsHistory, currentMetrics }: SimulatorChartsProps) => {
  // Prepare miss rate over time data
  const missRateData = useMemo(() => {
    return metricsHistory.slice(-50).map((m, i) => ({
      access: i + 1,
      missRate: m.missRate,
      cpi: m.cpi,
    }));
  }, [metricsHistory]);

  // Prepare hits vs misses bar chart data
  const hitsMissesData = useMemo(() => [
    {
      level: "L1",
      hits: currentMetrics.l1Hits,
      misses: currentMetrics.l1Misses,
    },
    {
      level: "L2",
      hits: currentMetrics.l2Hits,
      misses: currentMetrics.l2Misses,
    },
    {
      level: "L3",
      hits: currentMetrics.l3Hits,
      misses: currentMetrics.l3Misses,
    },
  ], [currentMetrics]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Miss Rate Over Time */}
      <div className="p-6 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-primary animate-pulse" />
          Miss Rate Over Time
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          Watch how the miss rate changes as the cache warms up
        </p>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={missRateData}>
            <defs>
              <linearGradient id="missRateGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
            <XAxis 
              dataKey="access" 
              stroke="hsl(var(--muted-foreground))" 
              fontSize={12}
              tickLine={false}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))" 
              fontSize={12}
              tickLine={false}
              domain={[0, 100]}
              tickFormatter={(v) => `${v}%`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                fontSize: '12px',
              }}
              formatter={(value: number) => [`${value.toFixed(1)}%`, 'Miss Rate']}
            />
            <Area
              type="monotone"
              dataKey="missRate"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              fill="url(#missRateGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Hits vs Misses by Level */}
      <div className="p-6 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-green-500" />
          <span className="w-3 h-3 rounded-full bg-red-500" />
          Hits vs Misses by Cache Level
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          Green = hits (fast), Red = misses (need next level)
        </p>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={hitsMissesData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
            <XAxis 
              type="number" 
              stroke="hsl(var(--muted-foreground))" 
              fontSize={12}
              tickLine={false}
            />
            <YAxis 
              type="category" 
              dataKey="level" 
              stroke="hsl(var(--muted-foreground))" 
              fontSize={12}
              tickLine={false}
              width={30}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                fontSize: '12px',
              }}
            />
            <Legend />
            <Bar dataKey="hits" name="Hits" fill="hsl(142, 76%, 36%)" radius={[0, 4, 4, 0]} />
            <Bar dataKey="misses" name="Misses" fill="hsl(0, 84%, 60%)" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* CPI Trend */}
      <div className="p-6 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50 lg:col-span-2">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-accent" />
          CPI (Cycles Per Instruction) Trend
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          Lower CPI = better performance. Cache misses increase CPI because the CPU waits.
        </p>
        <ResponsiveContainer width="100%" height={150}>
          <LineChart data={missRateData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
            <XAxis 
              dataKey="access" 
              stroke="hsl(var(--muted-foreground))" 
              fontSize={12}
              tickLine={false}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))" 
              fontSize={12}
              tickLine={false}
              domain={[1, 'auto']}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                fontSize: '12px',
              }}
              formatter={(value: number) => [value.toFixed(2), 'CPI']}
            />
            <Line
              type="monotone"
              dataKey="cpi"
              stroke="hsl(var(--accent))"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
        
        {/* CPI explanation */}
        <div className="mt-4 p-3 rounded-lg bg-muted/30 text-sm">
          <strong>CPI Formula:</strong> Base CPI (1.0) + L2 penalty + L3 penalty + RAM penalty
          <br />
          <span className="text-muted-foreground">
            Current CPI: <span className="text-accent font-bold">{currentMetrics.cpi.toFixed(2)}</span>
            {currentMetrics.cpi > 2 ? " ⚠️ High - too many cache misses!" : 
             currentMetrics.cpi > 1.3 ? " 🟡 Moderate" : " ✅ Good!"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default SimulatorCharts;
