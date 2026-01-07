import { Code, Activity, Bug, FileJson, BarChart3, ArrowRight } from "lucide-react";

const steps = [
  {
    icon: Code,
    title: "C/C++ Workload",
    description: "Execute benchmark programs with different memory access patterns",
    color: "primary",
  },
  {
    icon: Activity,
    title: "PMU Counters",
    description: "Hardware Performance Monitoring Unit captures cache events",
    color: "cache-l1",
  },
  {
    icon: Bug,
    title: "eBPF Tracing",
    description: "Kernel-level tracing for fine-grained cache miss analysis",
    color: "cache-l2",
  },
  {
    icon: FileJson,
    title: "Data Processing",
    description: "Convert raw data to structured CSV/JSON format",
    color: "accent",
  },
  {
    icon: BarChart3,
    title: "Visualization",
    description: "Interactive dashboard with charts and insights",
    color: "success",
  },
];

const ArchitectureSection = () => {
  return (
    <section id="architecture" className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="section-title">
            System <span className="gradient-text">Architecture</span>
          </h2>
          <p className="section-subtitle mx-auto">
            Our end-to-end pipeline for capturing, processing, and visualizing cache performance data.
          </p>
        </div>

        {/* Flow diagram */}
        <div className="relative">
          {/* Connection line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-success -translate-y-1/2 z-0" />
          
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 relative z-10">
            {steps.map((step, index) => (
              <div key={step.title} className="flex flex-col items-center">
                <div
                  className="glass-card text-center w-full relative group"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Animated glow effect */}
                  <div className={`absolute inset-0 rounded-xl bg-${step.color}/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                  
                  <div className={`relative z-10 inline-flex p-4 rounded-2xl bg-${step.color}/20 mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <step.icon className={`w-8 h-8 text-${step.color}`} />
                  </div>
                  
                  <h3 className="text-lg font-semibold mb-2 relative z-10">{step.title}</h3>
                  <p className="text-sm text-muted-foreground relative z-10">{step.description}</p>
                  
                  {/* Step number */}
                  <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-secondary border border-border flex items-center justify-center">
                    <span className="text-sm font-bold text-primary">{index + 1}</span>
                  </div>
                </div>
                
                {/* Arrow for mobile */}
                {index < steps.length - 1 && (
                  <ArrowRight className="w-6 h-6 text-muted-foreground my-4 md:hidden" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Code snippet */}
        <div className="mt-16 glass-card overflow-hidden">
          <div className="flex items-center gap-2 pb-4 border-b border-border/50">
            <div className="w-3 h-3 rounded-full bg-destructive/60" />
            <div className="w-3 h-3 rounded-full bg-warning/60" />
            <div className="w-3 h-3 rounded-full bg-success/60" />
            <span className="ml-4 text-sm text-muted-foreground font-mono">perf_command.sh</span>
          </div>
          <pre className="mt-4 text-sm overflow-x-auto">
            <code className="text-muted-foreground">
              <span className="text-success">$</span>{" "}
              <span className="text-primary">perf stat</span>{" "}
              <span className="text-accent">-e cache-references,cache-misses,L1-dcache-loads,L1-dcache-load-misses</span>{" "}
              <span className="text-foreground">./benchmark</span>
            </code>
          </pre>
        </div>
      </div>
    </section>
  );
};

export default ArchitectureSection;
