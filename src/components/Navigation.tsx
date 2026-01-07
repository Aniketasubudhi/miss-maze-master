import { useState, useEffect } from "react";
import { Menu, X, Cpu } from "lucide-react";
import { Button } from "@/components/ui/button";

const navItems = [
  { label: "About", href: "#about" },
  { label: "Concepts", href: "#concepts" },
  { label: "Architecture", href: "#architecture" },
  { label: "Benchmarks", href: "#benchmarks" },
  { label: "Dashboard", href: "#dashboard" },
  { label: "Results", href: "#results" },
  { label: "Team", href: "#team" },
];

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "glass py-3" : "py-5"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2 group">
          <div className="p-2 rounded-lg bg-primary/20 group-hover:bg-primary/30 transition-colors">
            <Cpu className="w-5 h-5 text-primary" />
          </div>
          <span className="font-semibold hidden sm:block">Cache Optimizer</span>
        </a>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-secondary/50"
            >
              {item.label}
            </a>
          ))}
        </div>

        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden glass mt-2 mx-4 rounded-xl p-4 animate-fade-in">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="block px-4 py-3 text-muted-foreground hover:text-foreground hover:bg-secondary/50 rounded-lg transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {item.label}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navigation;
