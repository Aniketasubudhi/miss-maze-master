import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, X, Lightbulb, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TeachingStep, TEACHING_STEPS } from "@/lib/cacheSimulation";
import { cn } from "@/lib/utils";

interface TeachingOverlayProps {
  isActive: boolean;
  currentStep: number;
  onStepChange: (step: number) => void;
  onClose: () => void;
}

const TeachingOverlay = ({
  isActive,
  currentStep,
  onStepChange,
  onClose,
}: TeachingOverlayProps) => {
  const step = TEACHING_STEPS[currentStep];
  const totalSteps = TEACHING_STEPS.length;

  if (!isActive) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        {/* Backdrop with blur */}
        <div 
          className="absolute inset-0 bg-background/80 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Teaching card */}
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          className="relative w-full max-w-2xl bg-card border border-border rounded-2xl shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border bg-gradient-to-r from-primary/10 to-accent/10">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-primary/20">
                <GraduationCap className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Teaching Mode</h3>
                <p className="text-sm text-muted-foreground">
                  Step {currentStep + 1} of {totalSteps}
                </p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Progress bar */}
          <div className="h-1 bg-muted">
            <motion.div
              className="h-full bg-primary"
              initial={{ width: 0 }}
              animate={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Highlight indicator */}
            <div className="flex items-center gap-2 mb-4">
              <span className="text-sm text-muted-foreground">Highlighting:</span>
              <HighlightBadge level={step.highlight} />
            </div>

            {/* Step title */}
            <motion.h4
              key={step.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-2xl font-bold mb-4"
            >
              {step.title}
            </motion.h4>

            {/* Step description */}
            <motion.p
              key={`desc-${step.id}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-lg text-muted-foreground mb-6 leading-relaxed"
            >
              {step.description}
            </motion.p>

            {/* Tip box */}
            <motion.div
              key={`tip-${step.id}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="p-4 rounded-xl bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20"
            >
              <div className="flex items-start gap-3">
                <Lightbulb className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-yellow-500">Pro Tip:</span>
                  <p className="text-sm text-muted-foreground mt-1">{step.tip}</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between p-4 border-t border-border bg-muted/30">
            <Button
              variant="outline"
              onClick={() => onStepChange(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Previous
            </Button>

            {/* Step dots */}
            <div className="flex items-center gap-2">
              {TEACHING_STEPS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => onStepChange(i)}
                  className={cn(
                    "w-2 h-2 rounded-full transition-all",
                    i === currentStep 
                      ? "w-6 bg-primary" 
                      : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                  )}
                />
              ))}
            </div>

            <Button
              onClick={() => {
                if (currentStep === totalSteps - 1) {
                  onClose();
                } else {
                  onStepChange(currentStep + 1);
                }
              }}
            >
              {currentStep === totalSteps - 1 ? (
                "Finish"
              ) : (
                <>
                  Next
                  <ChevronRight className="w-4 h-4 ml-1" />
                </>
              )}
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// Highlight badge component
const HighlightBadge = ({ level }: { level: string }) => {
  const colors: Record<string, string> = {
    CPU: "bg-primary/20 text-primary border-primary/30",
    L1: "bg-[hsl(var(--l1-cache))]/20 text-[hsl(var(--l1-cache))] border-[hsl(var(--l1-cache))]/30",
    L2: "bg-[hsl(var(--l2-cache))]/20 text-[hsl(var(--l2-cache))] border-[hsl(var(--l2-cache))]/30",
    L3: "bg-[hsl(var(--l3-cache))]/20 text-[hsl(var(--l3-cache))] border-[hsl(var(--l3-cache))]/30",
    RAM: "bg-orange-500/20 text-orange-500 border-orange-500/30",
    all: "bg-gradient-to-r from-primary/20 to-accent/20 text-primary border-primary/30",
  };

  return (
    <span className={cn(
      "px-3 py-1 rounded-full text-sm font-medium border",
      colors[level] || colors.all
    )}>
      {level === 'all' ? 'All Levels' : level}
    </span>
  );
};

export default TeachingOverlay;
