import { AlertTriangle, Gauge, Search, Lightbulb } from "lucide-react";

const aboutCards = [
  {
    icon: Gauge,
    title: "What is CPU Cache?",
    description: "A small, ultra-fast memory located close to the CPU that stores frequently accessed data. It bridges the speed gap between the blazing-fast processor and slower main memory.",
    color: "primary",
  },
  {
    icon: AlertTriangle,
    title: "Why Cache Misses Matter",
    description: "When the CPU can't find data in cache (a 'miss'), it must fetch from slower RAM—costing 100-300 cycles. In hot loops, this creates massive performance bottlenecks.",
    color: "destructive",
  },
  {
    icon: Search,
    title: "Traditional Tools Fall Short",
    description: "Standard profilers only show high-level metrics. They can't pinpoint which memory access patterns cause cache misses or provide actionable optimization insights.",
    color: "warning",
  },
  {
    icon: Lightbulb,
    title: "Our Solution",
    description: "We combine PMU counters, Linux perf, and eBPF tracing to provide deep visibility into cache behavior—with clear visualizations and optimization recommendations.",
    color: "success",
  },
];

const AboutSection = () => {
  return (
    <section id="about" className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="section-title">
            About the <span className="gradient-text">Project</span>
          </h2>
          <p className="section-subtitle mx-auto">
            Understanding CPU cache behavior is crucial for writing high-performance software.
            Our project makes this invisible world visible.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {aboutCards.map((card, index) => (
            <div
              key={card.title}
              className="glass-card group"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={`inline-flex p-3 rounded-xl bg-${card.color}/10 mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <card.icon className={`w-6 h-6 text-${card.color}`} />
              </div>
              <h3 className="text-xl font-semibold mb-3">{card.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{card.description}</p>
            </div>
          ))}
        </div>

        {/* Stats row */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { value: "3-5×", label: "Performance Gain" },
            { value: "100+", label: "Cycle Penalty" },
            { value: "32KB", label: "L1 Cache Size" },
            { value: "~1ns", label: "L1 Access Time" },
          ].map((stat, index) => (
            <div key={stat.label} className="glass text-center p-6 rounded-xl">
              <div className="text-3xl md:text-4xl font-bold gradient-text mb-2">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
