import { Play, Pause, SkipForward, RotateCcw, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AccessPattern, PATTERN_DESCRIPTIONS } from "@/lib/cacheSimulation";
import { cn } from "@/lib/utils";

interface SimulatorControlsProps {
  pattern: AccessPattern;
  onPatternChange: (pattern: AccessPattern) => void;
  isPlaying: boolean;
  onPlayPause: () => void;
  onStep: () => void;
  onReset: () => void;
  speed: number;
  onSpeedChange: (speed: number) => void;
  optimized: boolean;
  onOptimizedChange: (optimized: boolean) => void;
  datasetSize: 'small' | 'medium' | 'large';
  onDatasetSizeChange: (size: 'small' | 'medium' | 'large') => void;
  l1Size: number;
  l2Size: number;
  l3Size: number;
  onCacheSizeChange: (level: 'l1' | 'l2' | 'l3', size: number) => void;
}

const SimulatorControls = ({
  pattern,
  onPatternChange,
  isPlaying,
  onPlayPause,
  onStep,
  onReset,
  speed,
  onSpeedChange,
  optimized,
  onOptimizedChange,
  datasetSize,
  onDatasetSizeChange,
  l1Size,
  l2Size,
  l3Size,
  onCacheSizeChange,
}: SimulatorControlsProps) => {
  const patterns: AccessPattern[] = ['sequential', 'random', 'linked-list', 'matrix-row', 'matrix-col'];
  const datasetSizes = ['small', 'medium', 'large'] as const;

  return (
    <div className="w-full lg:w-80 space-y-6 p-6 bg-card/50 backdrop-blur-sm rounded-2xl border border-border/50">
      {/* Pattern Selector */}
      <div className="space-y-3">
        <Label className="text-sm font-semibold flex items-center gap-2">
          <Zap className="w-4 h-4 text-primary" />
          Access Pattern
        </Label>
        <div className="grid grid-cols-1 gap-2">
          {patterns.map((p) => (
            <button
              key={p}
              onClick={() => onPatternChange(p)}
              className={cn(
                "px-3 py-2 rounded-lg text-left text-sm transition-all",
                "border hover:border-primary/50",
                pattern === p 
                  ? "bg-primary/20 border-primary text-primary" 
                  : "bg-muted/30 border-border/50 text-muted-foreground hover:text-foreground"
              )}
            >
              <div className="font-medium">{PATTERN_DESCRIPTIONS[p].name}</div>
              <div className="text-xs opacity-70 mt-0.5 line-clamp-1">
                {p === 'sequential' || p === 'matrix-row' ? '✅ Good' : '❌ Poor'} locality
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Optimization Toggle */}
      <div className="space-y-3 p-4 rounded-xl bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-semibold text-green-400">
            Optimization Mode
          </Label>
          <Switch
            checked={optimized}
            onCheckedChange={onOptimizedChange}
          />
        </div>
        <p className="text-xs text-muted-foreground">
          {optimized 
            ? "✨ Using cache-friendly patterns" 
            : "Using original (unoptimized) patterns"}
        </p>
      </div>

      {/* Dataset Size */}
      <div className="space-y-3">
        <Label className="text-sm font-semibold">Dataset Size</Label>
        <Tabs value={datasetSize} onValueChange={(v) => onDatasetSizeChange(v as typeof datasetSize)}>
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="small">Small</TabsTrigger>
            <TabsTrigger value="medium">Medium</TabsTrigger>
            <TabsTrigger value="large">Large</TabsTrigger>
          </TabsList>
        </Tabs>
        <p className="text-xs text-muted-foreground text-center">
          {datasetSize === 'small' ? '64 blocks' : datasetSize === 'medium' ? '256 blocks' : '1024 blocks'}
        </p>
      </div>

      {/* Cache Size Sliders */}
      <div className="space-y-4">
        <Label className="text-sm font-semibold">Cache Sizes (blocks)</Label>
        
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-cache-l1">L1 Cache</span>
            <span className="text-muted-foreground">{l1Size} blocks</span>
          </div>
          <Slider
            value={[l1Size]}
            onValueChange={([v]) => onCacheSizeChange('l1', v)}
            min={4}
            max={32}
            step={4}
            className="[&_[role=slider]]:bg-cache-l1"
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-cache-l2">L2 Cache</span>
            <span className="text-muted-foreground">{l2Size} blocks</span>
          </div>
          <Slider
            value={[l2Size]}
            onValueChange={([v]) => onCacheSizeChange('l2', v)}
            min={16}
            max={128}
            step={16}
            className="[&_[role=slider]]:bg-cache-l2"
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-cache-l3">L3 Cache</span>
            <span className="text-muted-foreground">{l3Size} blocks</span>
          </div>
          <Slider
            value={[l3Size]}
            onValueChange={([v]) => onCacheSizeChange('l3', v)}
            min={64}
            max={512}
            step={64}
            className="[&_[role=slider]]:bg-cache-l3"
          />
        </div>
      </div>

      {/* Speed Control */}
      <div className="space-y-3">
        <Label className="text-sm font-semibold">Speed</Label>
        <Tabs value={speed.toString()} onValueChange={(v) => onSpeedChange(parseFloat(v))}>
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="0.5">0.5x</TabsTrigger>
            <TabsTrigger value="1">1x</TabsTrigger>
            <TabsTrigger value="2">2x</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Playback Controls */}
      <div className="flex gap-2">
        <Button
          onClick={onPlayPause}
          className="flex-1"
          variant={isPlaying ? "secondary" : "default"}
        >
          {isPlaying ? (
            <>
              <Pause className="w-4 h-4 mr-2" />
              Pause
            </>
          ) : (
            <>
              <Play className="w-4 h-4 mr-2" />
              Play
            </>
          )}
        </Button>
        <Button onClick={onStep} variant="outline" disabled={isPlaying}>
          <SkipForward className="w-4 h-4" />
        </Button>
        <Button onClick={onReset} variant="outline">
          <RotateCcw className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default SimulatorControls;
