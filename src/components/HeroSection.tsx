import { Cpu, Database, Zap, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-accent/5" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[128px] animate-pulse-glow" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-[128px] animate-pulse-glow" style={{ animationDelay: "1s" }} />
      
      {/* Floating icons */}
      <div className="absolute top-20 left-[15%] animate-float" style={{ animationDelay: "0s" }}>
        <div className="glass p-4 rounded-2xl">
          <Cpu className="w-8 h-8 text-primary" />
        </div>
      </div>
      <div className="absolute top-32 right-[20%] animate-float" style={{ animationDelay: "1s" }}>
        <div className="glass p-4 rounded-2xl">
          <Database className="w-8 h-8 text-cache-l2" />
        </div>
      </div>
      <div className="absolute bottom-32 left-[20%] animate-float" style={{ animationDelay: "2s" }}>
        <div className="glass p-4 rounded-2xl">
          <Zap className="w-8 h-8 text-warning" />
        </div>
      </div>
      <div className="absolute bottom-40 right-[15%] animate-float" style={{ animationDelay: "0.5s" }}>
        <div className="glass p-4 rounded-2xl">
          <BarChart3 className="w-8 h-8 text-accent" />
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
        <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full mb-8 animate-fade-in">
          <span className="w-2 h-2 bg-success rounded-full animate-pulse" />
          <span className="text-sm text-muted-foreground">Operating Systems Project</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 animate-slide-up">
          <span className="gradient-text">Cache Miss</span>
          <br />
          <span className="text-foreground">Tracking & Optimization</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto animate-slide-up" style={{ animationDelay: "0.2s" }}>
          Visualizing CPU Cache Performance using{" "}
          <span className="text-primary font-medium">PMU</span>,{" "}
          <span className="text-cache-l2 font-medium">perf</span> &{" "}
          <span className="text-accent font-medium">eBPF</span>
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up" style={{ animationDelay: "0.4s" }}>
          <Button variant="hero" size="xl" onClick={() => document.getElementById('concepts')?.scrollIntoView({ behavior: 'smooth' })}>
            Explore Cache Concepts
          </Button>
          <Button variant="glass" size="xl" onClick={() => document.getElementById('dashboard')?.scrollIntoView({ behavior: 'smooth' })}>
            View Dashboard
          </Button>
        </div>

        {/* Animated cache lines */}
        <div className="mt-20 flex justify-center gap-2 animate-fade-in" style={{ animationDelay: "0.6s" }}>
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="cache-line w-8 md:w-12"
              style={{
                backgroundColor: i < 4 ? 'hsl(var(--l1-cache))' : i < 8 ? 'hsl(var(--l2-cache))' : 'hsl(var(--l3-cache))',
                opacity: 0.3 + (i % 4) * 0.2,
                animationDelay: `${i * 0.1}s`,
              }}
            />
          ))}
        </div>
        <p className="text-sm text-muted-foreground mt-3 animate-fade-in" style={{ animationDelay: "0.8s" }}>
          L1 • L2 • L3 Cache Hierarchy
        </p>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex justify-center pt-2">
          <div className="w-1.5 h-3 bg-primary rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
