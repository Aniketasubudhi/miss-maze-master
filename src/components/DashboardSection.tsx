import { useState } from "react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";

const sequentialData = [
  { name: "L1 Refs", value: 1250000, color: "#22d3ee" },
  { name: "L1 Misses", value: 12500, color: "#f43f5e" },
  { name: "L2 Refs", value: 125000, color: "#38bdf8" },
  { name: "L2 Misses", value: 3750, color: "#f43f5e" },
  { name: "LLC Refs", value: 37500, color: "#a78bfa" },
  { name: "LLC Misses", value: 1875, color: "#f43f5e" },
];

const randomData = [
  { name: "L1 Refs", value: 1250000, color: "#22d3ee" },
  { name: "L1 Misses", value: 625000, color: "#f43f5e" },
  { name: "L2 Refs", value: 625000, color: "#38bdf8" },
  { name: "L2 Misses", value: 312500, color: "#f43f5e" },
  { name: "LLC Refs", value: 312500, color: "#a78bfa" },
  { name: "LLC Misses", value: 156250, color: "#f43f5e" },
];

const comparisonData = [
  { name: "Sequential", missRate: 1.0, cpi: 1.2, time: 45 },
  { name: "Random", missRate: 50.0, cpi: 8.5, time: 320 },
  { name: "Linked List", missRate: 25.0, cpi: 4.2, time: 180 },
  { name: "Row-major", missRate: 2.5, cpi: 1.5, time: 65 },
  { name: "Col-major", missRate: 35.0, cpi: 6.8, time: 250 },
];

const tooltips = {
  refs: "Total number of memory accesses that checked this cache level",
  misses: "Accesses where data was not found, requiring fetch from next level",
  missRate: "Percentage of cache accesses that result in a miss",
  cpi: "Cycles Per Instruction - higher means more stalls due to cache misses",
};

const DashboardSection = () => {
  const [selectedWorkload, setSelectedWorkload] = useState<"sequential" | "random">("sequential");

  const currentData = selectedWorkload === "sequential" ? sequentialData : randomData;
  const missRate = selectedWorkload === "sequential" ? "1.0%" : "50.0%";
  const cpi = selectedWorkload === "sequential" ? "1.2" : "8.5";

  return (
    <section id="dashboard" className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="section-title">
            Performance <span className="gradient-text">Dashboard</span>
          </h2>
          <p className="section-subtitle mx-auto">
            Interactive visualization of cache behavior across different workloads. Toggle between patterns to see the difference.
          </p>
        </div>

        {/* Workload selector */}
        <div className="flex justify-center gap-4 mb-8">
          <Button
            variant={selectedWorkload === "sequential" ? "hero" : "glass"}
            onClick={() => setSelectedWorkload("sequential")}
          >
            Sequential Access
          </Button>
          <Button
            variant={selectedWorkload === "random" ? "hero" : "glass"}
            onClick={() => setSelectedWorkload("random")}
          >
            Random Access
          </Button>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="glass-card text-center">
            <span className="text-sm text-muted-foreground flex items-center justify-center gap-1">
              Cache Miss Rate
              <Info className="w-3 h-3" />
            </span>
            <p className={`text-3xl font-bold mt-2 ${selectedWorkload === "sequential" ? "text-success" : "text-destructive"}`}>
              {missRate}
            </p>
          </div>
          <div className="glass-card text-center">
            <span className="text-sm text-muted-foreground flex items-center justify-center gap-1">
              CPI
              <Info className="w-3 h-3" />
            </span>
            <p className={`text-3xl font-bold mt-2 ${selectedWorkload === "sequential" ? "text-success" : "text-destructive"}`}>
              {cpi}
            </p>
          </div>
          <div className="glass-card text-center">
            <span className="text-sm text-muted-foreground">L1 Hit Rate</span>
            <p className={`text-3xl font-bold mt-2 ${selectedWorkload === "sequential" ? "text-success" : "text-destructive"}`}>
              {selectedWorkload === "sequential" ? "99%" : "50%"}
            </p>
          </div>
          <div className="glass-card text-center">
            <span className="text-sm text-muted-foreground">Execution Time</span>
            <p className={`text-3xl font-bold mt-2 ${selectedWorkload === "sequential" ? "text-success" : "text-destructive"}`}>
              {selectedWorkload === "sequential" ? "45ms" : "320ms"}
            </p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-6 mb-12">
          {/* Bar chart */}
          <div className="glass-card">
            <h3 className="text-lg font-semibold mb-6">Cache References vs Misses</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={currentData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                    labelStyle={{ color: "hsl(var(--foreground))" }}
                  />
                  <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Comparison line chart */}
          <div className="glass-card">
            <h3 className="text-lg font-semibold mb-6">Workload Comparison</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={comparisonData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="missRate" stroke="hsl(var(--destructive))" strokeWidth={2} dot={{ r: 4 }} name="Miss Rate %" />
                  <Line type="monotone" dataKey="cpi" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 4 }} name="CPI" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Metric explanations */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(tooltips).map(([key, desc]) => (
            <div key={key} className="glass p-4 rounded-xl">
              <span className="text-primary font-mono text-sm uppercase">{key}</span>
              <p className="text-muted-foreground text-sm mt-1">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DashboardSection;
