
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, Zap, Clock } from 'lucide-react';

interface PerformanceData {
  fps: number;
  memoryUsage: number;
  renderTime: number;
  grade: 'A' | 'B' | 'C' | 'D';
}

export function PerformanceMonitor() {
  const [isVisible, setIsVisible] = useState(false);
  const [data, setData] = useState<PerformanceData>({
    fps: 60,
    memoryUsage: 0,
    renderTime: 0,
    grade: 'A'
  });

  useEffect(() => {
    if (!isVisible) return;

    let frameCount = 0;
    let lastTime = performance.now();
    
    const measurePerformance = () => {
      const currentTime = performance.now();
      frameCount++;
      
      if (currentTime - lastTime >= 1000) {
        const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
        const memory = (performance as any).memory?.usedJSHeapSize / 1024 / 1024 || 0;
        
        const grade = fps >= 55 ? 'A' : fps >= 45 ? 'B' : fps >= 30 ? 'C' : 'D';
        
        setData({
          fps,
          memoryUsage: Math.round(memory),
          renderTime: Math.round(currentTime - lastTime),
          grade
        });
        
        frameCount = 0;
        lastTime = currentTime;
      }
      
      if (isVisible) {
        requestAnimationFrame(measurePerformance);
      }
    };
    
    requestAnimationFrame(measurePerformance);
  }, [isVisible]);

  if (!isVisible) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 left-4 z-50 bg-black/80 text-white border-gray-600 hover:bg-black/90"
      >
        <Activity className="h-4 w-4 mr-1" />
        Performance
      </Button>
    );
  }

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A': return 'bg-green-500';
      case 'B': return 'bg-yellow-500';
      case 'C': return 'bg-orange-500';
      default: return 'bg-red-500';
    }
  };

  return (
    <Card className="fixed bottom-4 left-4 z-50 w-64 bg-black/90 text-white border-gray-600">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center justify-between">
          <span className="flex items-center gap-1">
            <Activity className="h-4 w-4" />
            Performance
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsVisible(false)}
            className="h-6 w-6 p-0 text-gray-400 hover:text-white"
          >
            ×
          </Button>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-2 pt-0">
        <div className="flex items-center justify-between">
          <span className="text-xs flex items-center gap-1">
            <Zap className="h-3 w-3" />
            FPS
          </span>
          <div className="flex items-center gap-2">
            <span className="text-sm font-mono">{data.fps}</span>
            <Badge className={`${getGradeColor(data.grade)} text-white text-xs`}>
              {data.grade}
            </Badge>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-xs flex items-center gap-1">
            <Clock className="h-3 w-3" />
            Memory
          </span>
          <span className="text-sm font-mono">{data.memoryUsage}MB</span>
        </div>
        
        <div className="w-full bg-gray-700 rounded-full h-1.5">
          <div 
            className={`h-1.5 rounded-full transition-all duration-300 ${getGradeColor(data.grade)}`}
            style={{ width: `${Math.min(data.fps / 60 * 100, 100)}%` }}
          />
        </div>
      </CardContent>
    </Card>
  );
}
