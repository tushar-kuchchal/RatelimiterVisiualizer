import React, { useEffect, useRef } from 'react';
import { Analytics } from '../types';

interface AnalyticsChartProps {
  analytics: Analytics[];
  className?: string;
}

export const AnalyticsChart: React.FC<AnalyticsChartProps> = ({
  analytics,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || analytics.length === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const padding = 40;
    const chartWidth = canvas.width - padding * 2;
    const chartHeight = canvas.height - padding * 2;

    // Draw grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;

    for (let i = 0; i <= 10; i++) {
      const y = padding + (chartHeight / 10) * i;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(canvas.width - padding, y);
      ctx.stroke();
    }

    for (let i = 0; i <= 10; i++) {
      const x = padding + (chartWidth / 10) * i;
      ctx.beginPath();
      ctx.moveTo(x, padding);
      ctx.lineTo(x, canvas.height - padding);
      ctx.stroke();
    }

    // Draw RPS line
    if (analytics.length > 1) {
      const maxRps = Math.max(...analytics.map(a => a.currentRps));
      const step = chartWidth / (analytics.length - 1);

      ctx.strokeStyle = '#00ff88';
      ctx.lineWidth = 2;
      ctx.beginPath();

      analytics.forEach((point, index) => {
        const x = padding + step * index;
        const y = padding + chartHeight - (point.currentRps / maxRps) * chartHeight;
        
        if (index === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });

      ctx.stroke();

      // Draw success rate line
      ctx.strokeStyle = '#4ecdc4';
      ctx.lineWidth = 2;
      ctx.beginPath();

      analytics.forEach((point, index) => {
        const x = padding + step * index;
        const y = padding + chartHeight - (point.successRate / 100) * chartHeight;
        
        if (index === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });

      ctx.stroke();
    }

    // Labels
    ctx.fillStyle = '#ffffff';
    ctx.font = '12px Inter, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('RPS', padding + 10, padding + 20);
    ctx.fillStyle = '#4ecdc4';
    ctx.fillText('Success Rate', padding + 60, padding + 20);

  }, [analytics]);

  return (
    <div className={`bg-gray-800 rounded-lg p-4 ${className}`}>
      <h3 className="text-lg font-semibold text-white mb-4">Performance Metrics</h3>
      <canvas
        ref={canvasRef}
        width={400}
        height={200}
        className="w-full"
      />
    </div>
  );
};