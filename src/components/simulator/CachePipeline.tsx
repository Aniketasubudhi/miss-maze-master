import { motion, AnimatePresence } from "framer-motion";
import { Cpu, Database, HardDrive, Loader2, Check, X } from "lucide-react";
import { CacheLevel, CACHE_LATENCIES } from "@/lib/cacheSimulation";
import { cn } from "@/lib/utils";

interface CachePipelineProps {
  activeLevel: CacheLevel | null;
  isHit: boolean;
  isProcessing: boolean;
  currentBlockId: number | null;
  l1Blocks: number[];
  l2Blocks: number[];
  l3Blocks: number[];
  l1HitRate?: number;
  l2HitRate?: number;
  l3HitRate?: number;
  totalAccesses?: number;
  onReset?: () => void;
}

const CachePipeline = ({
  activeLevel,
  isHit,
  isProcessing,
  currentBlockId,
  l1Blocks,
  l2Blocks,
  l3Blocks,
  l1HitRate = 0,
  l2HitRate = 0,
  l3HitRate = 0,
  totalAccesses = 0,
  onReset,
}: CachePipelineProps) => {
  // Determine which level is active for highlighting
  const getHighlightClass = (level: CacheLevel) => {
    if (activeLevel !== level) return "";
    return isHit 
      ? "ring-4 ring-green-500/50 shadow-[0_0_30px_rgba(34,197,94,0.4)]" 
      : "ring-4 ring-red-500/50 shadow-[0_0_30px_rgba(239,68,68,0.4)]";
  };

  // Calculate position for data block animation
  const getBlockPosition = (level: CacheLevel | null) => {
    switch (level) {
      case 'L1': return { x: 200, y: 0 };
      case 'L2': return { x: 350, y: 0 };
      case 'L3': return { x: 500, y: 0 };
      case 'RAM': return { x: 650, y: 0 };
      default: return { x: 50, y: 0 };
    }
  };

  return (
    <div className="relative w-full bg-gradient-to-br from-background via-background to-muted/20 rounded-2xl p-8 overflow-hidden">
      {/* Background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />
      
      {/* Pipeline container */}
      <div className="relative flex items-center justify-between gap-4 min-h-[300px]">
        
        {/* CPU Block */}
        <motion.div
          className={cn(
            "relative flex flex-col items-center gap-2 p-6 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 transition-all duration-300",
            activeLevel === null && isProcessing && "ring-4 ring-primary/50"
          )}
          animate={isProcessing ? { scale: [1, 1.02, 1] } : {}}
          transition={{ duration: 0.5, repeat: isProcessing ? Infinity : 0 }}
        >
          <div className="relative">
            <Cpu className="w-12 h-12 text-primary" />
            {isProcessing && activeLevel === 'RAM' && (
              <motion.div
                className="absolute -top-2 -right-2"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <Loader2 className="w-5 h-5 text-yellow-500" />
              </motion.div>
            )}
          </div>
          <span className="font-bold text-sm">CPU</span>
          <span className="text-xs text-muted-foreground">Processor</span>
          
          {/* Request pulse */}
          <AnimatePresence>
            {isProcessing && (
              <motion.div
                initial={{ scale: 0, opacity: 1 }}
                animate={{ scale: 2, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, repeat: Infinity }}
                className="absolute inset-0 rounded-2xl bg-primary/30"
              />
            )}
          </AnimatePresence>
        </motion.div>

        {/* Connection Arrow 1 */}
        <ConnectionArrow active={isProcessing} />

        {/* L1 Cache */}
        <CacheBlock
          level="L1"
          label="L1 Cache"
          sublabel="4 cycles"
          size="small"
          blocks={l1Blocks}
          isActive={activeLevel === 'L1'}
          isHit={activeLevel === 'L1' && isHit}
          highlightClass={getHighlightClass('L1')}
          color="cache-l1"
          hitRate={l1HitRate}
        />

        <ConnectionArrow active={isProcessing && activeLevel !== 'L1'} />

        {/* L2 Cache */}
        <CacheBlock
          level="L2"
          label="L2 Cache"
          sublabel="12 cycles"
          size="medium"
          blocks={l2Blocks.slice(0, 8)}
          isActive={activeLevel === 'L2'}
          isHit={activeLevel === 'L2' && isHit}
          highlightClass={getHighlightClass('L2')}
          color="cache-l2"
          hitRate={l2HitRate}
        />

        <ConnectionArrow active={isProcessing && !['L1', 'L2'].includes(activeLevel || '')} />

        {/* L3 Cache */}
        <CacheBlock
          level="L3"
          label="L3/LLC"
          sublabel="40 cycles"
          size="large"
          blocks={l3Blocks.slice(0, 12)}
          isActive={activeLevel === 'L3'}
          isHit={activeLevel === 'L3' && isHit}
          highlightClass={getHighlightClass('L3')}
          color="cache-l3"
          hitRate={l3HitRate}
        />

        <ConnectionArrow active={isProcessing && activeLevel === 'RAM'} slow />

        {/* RAM Block */}
        <motion.div
          className={cn(
            "relative flex flex-col items-center gap-2 p-6 rounded-2xl bg-gradient-to-br from-orange-500/20 to-orange-500/5 border border-orange-500/30 transition-all duration-300",
            getHighlightClass('RAM')
          )}
        >
          <HardDrive className="w-12 h-12 text-orange-500" />
          <span className="font-bold text-sm">RAM</span>
          <span className="text-xs text-muted-foreground">~200 cycles</span>
          
          {/* RAM access indicator */}
          {activeLevel === 'RAM' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute -bottom-8 text-xs text-orange-400 font-medium"
            >
              CPU Waiting...
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Animated data block */}
      <AnimatePresence>
        {isProcessing && currentBlockId !== null && (
          <motion.div
            initial={{ x: 50, y: 120, opacity: 0, scale: 0 }}
            animate={{ 
              x: getBlockPosition(activeLevel).x + 50, 
              y: 120,
              opacity: 1, 
              scale: 1 
            }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ 
              duration: activeLevel === 'RAM' ? 1.5 : 0.4,
              ease: "easeInOut"
            }}
            className={cn(
              "absolute w-10 h-10 rounded-lg flex items-center justify-center text-xs font-bold shadow-lg",
              isHit 
                ? "bg-green-500 text-white" 
                : "bg-red-500 text-white"
            )}
          >
            {currentBlockId}
            {isHit ? (
              <Check className="absolute -top-1 -right-1 w-4 h-4 bg-green-600 rounded-full p-0.5" />
            ) : (
              <X className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 rounded-full p-0.5" />
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Legend and Reset */}
      <div className="flex items-center justify-between mt-8">
        <div className="flex items-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-green-500" />
            <span className="text-muted-foreground">Cache Hit (Fast)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-red-500" />
            <span className="text-muted-foreground">Cache Miss (Slow)</span>
          </div>
          {totalAccesses > 0 && (
            <span className="text-sm font-medium text-muted-foreground">
              Total: {totalAccesses} accesses
            </span>
          )}
        </div>
        {onReset && (
          <button
            onClick={onReset}
            className="px-4 py-2 text-sm font-medium rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 border border-destructive/30 transition-colors"
          >
            Reset
          </button>
        )}
      </div>
    </div>
  );
};

// Cache block component
interface CacheBlockProps {
  level: CacheLevel;
  label: string;
  sublabel: string;
  size: 'small' | 'medium' | 'large';
  blocks: number[];
  isActive: boolean;
  isHit: boolean;
  highlightClass: string;
  color: string;
  hitRate?: number;
}

const CacheBlock = ({ 
  level, 
  label, 
  sublabel, 
  size, 
  blocks, 
  isActive, 
  isHit, 
  highlightClass,
  color,
  hitRate = 0,
}: CacheBlockProps) => {
  const sizeClasses = {
    small: "w-20",
    medium: "w-24",
    large: "w-28",
  };

  return (
    <motion.div
      className={cn(
        "relative flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all duration-300",
        `bg-gradient-to-br from-${color}/20 to-${color}/5 border-${color}/30`,
        highlightClass
      )}
      style={{
        background: color === 'cache-l1' ? `linear-gradient(to bottom right, hsl(var(--l1-cache) / 0.2), hsl(var(--l1-cache) / 0.05))` :
                    color === 'cache-l2' ? `linear-gradient(to bottom right, hsl(var(--l2-cache) / 0.2), hsl(var(--l2-cache) / 0.05))` :
                    `linear-gradient(to bottom right, hsl(var(--l3-cache) / 0.2), hsl(var(--l3-cache) / 0.05))`,
        borderColor: color === 'cache-l1' ? `hsl(var(--l1-cache) / 0.3)` :
                     color === 'cache-l2' ? `hsl(var(--l2-cache) / 0.3)` :
                     `hsl(var(--l3-cache) / 0.3)`,
      }}
    >
      <Database 
        className={cn("w-8 h-8", sizeClasses[size])} 
        style={{ 
          color: color === 'cache-l1' ? `hsl(var(--l1-cache))` :
                 color === 'cache-l2' ? `hsl(var(--l2-cache))` :
                 `hsl(var(--l3-cache))` 
        }}
      />
      <span className="font-bold text-sm">{label}</span>
      <span className="text-xs text-muted-foreground">{sublabel}</span>
      
      {/* Hit rate indicator */}
      <div className="w-full mt-1">
        <div className="flex items-center justify-between text-[10px] mb-0.5">
          <span className="text-muted-foreground">Hit Rate</span>
          <span className={cn(
            "font-bold",
            hitRate >= 70 ? "text-green-500" : hitRate >= 40 ? "text-yellow-500" : "text-red-500"
          )}>
            {hitRate.toFixed(1)}%
          </span>
        </div>
        <div className="w-full h-1.5 rounded-full bg-muted/50 overflow-hidden">
          <motion.div
            className={cn(
              "h-full rounded-full",
              hitRate >= 70 ? "bg-green-500" : hitRate >= 40 ? "bg-yellow-500" : "bg-red-500"
            )}
            initial={{ width: 0 }}
            animate={{ width: `${hitRate}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>
      
      {/* Mini cache blocks visualization */}
      <div className="flex flex-wrap gap-1 justify-center max-w-full mt-2">
        {blocks.slice(0, size === 'small' ? 4 : size === 'medium' ? 6 : 8).map((block, i) => (
          <motion.div
            key={`${level}-${i}`}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className={cn(
              "w-5 h-5 rounded text-[8px] flex items-center justify-center font-mono",
              "bg-foreground/10 border border-foreground/20"
            )}
          >
            {block}
          </motion.div>
        ))}
      </div>

      {/* Hit/Miss indicator */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className={cn(
              "absolute -top-3 -right-3 w-8 h-8 rounded-full flex items-center justify-center",
              isHit ? "bg-green-500" : "bg-red-500"
            )}
          >
            {isHit ? (
              <Check className="w-5 h-5 text-white" />
            ) : (
              <X className="w-5 h-5 text-white" />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Connection arrow component
const ConnectionArrow = ({ active, slow }: { active: boolean; slow?: boolean }) => (
  <div className="relative flex-1 h-2 min-w-[30px]">
    <div className="absolute inset-0 bg-muted/50 rounded-full" />
    {active && (
      <motion.div
        initial={{ x: "-100%" }}
        animate={{ x: "100%" }}
        transition={{ 
          duration: slow ? 1.2 : 0.4, 
          repeat: Infinity,
          ease: "linear" 
        }}
        className={cn(
          "absolute inset-y-0 w-1/3 rounded-full",
          slow ? "bg-orange-500" : "bg-primary"
        )}
      />
    )}
  </div>
);

export default CachePipeline;
