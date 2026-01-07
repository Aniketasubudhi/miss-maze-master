import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import CacheConceptsSection from "@/components/CacheConceptsSection";
import ArchitectureSection from "@/components/ArchitectureSection";
import BenchmarkSection from "@/components/BenchmarkSection";
import DashboardSection from "@/components/DashboardSection";
import OptimizationSection from "@/components/OptimizationSection";
import ResultsSection from "@/components/ResultsSection";
import TeamSection from "@/components/TeamSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      <HeroSection />
      <AboutSection />
      <CacheConceptsSection />
      <ArchitectureSection />
      <BenchmarkSection />
      <DashboardSection />
      <OptimizationSection />
      <ResultsSection />
      <TeamSection />
      
      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border/50">
        <div className="max-w-6xl mx-auto text-center text-muted-foreground text-sm">
          <p>© 2024 Cache Miss Tracking & Optimization Project</p>
          <p className="mt-1">Built with React • RV College of Engineering</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
