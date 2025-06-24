import React, { useEffect, useRef, useState } from 'react';
import { RateLimiterState, RateLimiterConfig } from '../types';

interface TokenBucketVisualizerProps {
  state: RateLimiterState;
  config: RateLimiterConfig;
  className?: string;
}

interface Token {
  id: string;
  x: number;
  y: number;
  opacity: number;
  scale: number;
  vx: number;
  vy: number;
  age: number;
}

interface FillerDrop {
  id: string;
  x: number;
  y: number;
  targetY: number;
  speed: number;
  opacity: number;
  size: number;
}

interface WindowRequest {
  id: string;
  x: number;
  timestamp: number;
  allowed: boolean;
}

export const TokenBucketVisualizer: React.FC<TokenBucketVisualizerProps> = ({
  state,
  config,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const lastRefillRef = useRef<number>(Date.now());
  const [tokens, setTokens] = useState<Token[]>([]);
  const [fillerDrops, setFillerDrops] = useState<FillerDrop[]>([]);
  const [windowRequests, setWindowRequests] = useState<WindowRequest[]>([]);
  const [bucketShake, setBucketShake] = useState(0);

  const createFillerDrop = (bucketX: number, bucketWidth: number): FillerDrop => {
    return {
      id: `drop-${Date.now()}-${Math.random()}`,
      x: bucketX + bucketWidth / 2 + (Math.random() - 0.5) * 20,
      y: 20,
      targetY: 100,
      speed: 2 + Math.random() * 2,
      opacity: 0.8 + Math.random() * 0.2,
      size: 3 + Math.random() * 2,
    };
  };

  const createToken = (bucketX: number, bucketY: number, bucketWidth: number, bucketHeight: number): Token => {
    return {
      id: `token-${Date.now()}-${Math.random()}`,
      x: bucketX + 20 + Math.random() * (bucketWidth - 40),
      y: bucketY + bucketHeight - 30 - Math.random() * 20,
      opacity: 0.9,
      scale: 0.8 + Math.random() * 0.4,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      age: 0,
    };
  };

  const renderTokenBucket = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    const bucketX = canvas.width / 2 - 80;
    const bucketY = canvas.height / 2 - 100;
    const bucketWidth = 160;
    const bucketHeight = 180;
    
    // Apply shake effect
    const shakeX = Math.sin(bucketShake * 0.5) * 2;
    const shakeY = Math.cos(bucketShake * 0.3) * 1;
    
    ctx.save();
    ctx.translate(shakeX, shakeY);
    
    // Draw bucket shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.fillRect(bucketX + 5, bucketY + 5, bucketWidth, bucketHeight);
    
    // Draw bucket with gradient
    const bucketGradient = ctx.createLinearGradient(bucketX, bucketY, bucketX + bucketWidth, bucketY);
    bucketGradient.addColorStop(0, 'rgba(0, 255, 136, 0.3)');
    bucketGradient.addColorStop(0.5, 'rgba(0, 255, 136, 0.1)');
    bucketGradient.addColorStop(1, 'rgba(0, 255, 136, 0.3)');
    
    ctx.fillStyle = bucketGradient;
    ctx.fillRect(bucketX, bucketY, bucketWidth, bucketHeight);
    
    // Draw bucket rim with metallic effect
    const rimGradient = ctx.createLinearGradient(bucketX, bucketY - 10, bucketX, bucketY + 10);
    rimGradient.addColorStop(0, '#ffffff');
    rimGradient.addColorStop(0.5, '#00ff88');
    rimGradient.addColorStop(1, '#004d2a');
    
    ctx.fillStyle = rimGradient;
    ctx.fillRect(bucketX - 5, bucketY - 10, bucketWidth + 10, 15);
    
    // Draw bucket outline with glow
    ctx.shadowColor = '#00ff88';
    ctx.shadowBlur = 10;
    ctx.strokeStyle = '#00ff88';
    ctx.lineWidth = 3;
    ctx.strokeRect(bucketX, bucketY, bucketWidth, bucketHeight);
    ctx.shadowBlur = 0;
    
    // Fill level with animated liquid effect
    const fillPercentage = state.tokensRemaining / state.maxTokens;
    const fillHeight = (bucketHeight - 20) * fillPercentage;
    const fillY = bucketY + bucketHeight - fillHeight - 10;
    
    if (fillHeight > 0) {
      // Animated liquid surface
      const waveOffset = Date.now() * 0.005;
      const waveAmplitude = 3;
      const waveFrequency = 0.02;
      
      ctx.beginPath();
      ctx.moveTo(bucketX + 5, fillY);
      
      for (let x = bucketX + 5; x <= bucketX + bucketWidth - 5; x += 2) {
        const wave = Math.sin((x - bucketX) * waveFrequency + waveOffset) * waveAmplitude;
        ctx.lineTo(x, fillY + wave);
      }
      
      ctx.lineTo(bucketX + bucketWidth - 5, bucketY + bucketHeight - 10);
      ctx.lineTo(bucketX + 5, bucketY + bucketHeight - 10);
      ctx.closePath();
      
      // Liquid gradient
      const liquidGradient = ctx.createLinearGradient(bucketX, fillY, bucketX, bucketY + bucketHeight);
      liquidGradient.addColorStop(0, 'rgba(0, 255, 136, 0.9)');
      liquidGradient.addColorStop(0.3, 'rgba(0, 255, 136, 0.7)');
      liquidGradient.addColorStop(1, 'rgba(0, 255, 136, 0.5)');
      
      ctx.fillStyle = liquidGradient;
      ctx.fill();
      
      // Liquid surface highlight
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(bucketX + 5, fillY);
      for (let x = bucketX + 5; x <= bucketX + bucketWidth - 5; x += 2) {
        const wave = Math.sin((x - bucketX) * waveFrequency + waveOffset) * waveAmplitude;
        ctx.lineTo(x, fillY + wave);
      }
      ctx.stroke();
    }
    
    ctx.restore();
    
    // Draw filler spout
    const spoutX = bucketX + bucketWidth / 2 - 15;
    const spoutY = bucketY - 40;
    const spoutWidth = 30;
    const spoutHeight = 30;
    
    ctx.fillStyle = 'rgba(100, 116, 139, 0.8)';
    ctx.fillRect(spoutX, spoutY, spoutWidth, spoutHeight);
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 2;
    ctx.strokeRect(spoutX, spoutY, spoutWidth, spoutHeight);
    
    // Draw filler drops
    fillerDrops.forEach((drop) => {
      ctx.save();
      ctx.globalAlpha = drop.opacity;
      
      const dropGradient = ctx.createRadialGradient(drop.x, drop.y, 0, drop.x, drop.y, drop.size);
      dropGradient.addColorStop(0, '#00ff88');
      dropGradient.addColorStop(0.7, 'rgba(0, 255, 136, 0.8)');
      dropGradient.addColorStop(1, 'rgba(0, 255, 136, 0.3)');
      
      ctx.fillStyle = dropGradient;
      ctx.beginPath();
      ctx.ellipse(drop.x, drop.y, drop.size, drop.size * 1.5, 0, 0, Math.PI * 2);
      ctx.fill();
      
      // Drop trail
      ctx.strokeStyle = 'rgba(0, 255, 136, 0.4)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(drop.x, drop.y - drop.size * 2);
      ctx.lineTo(drop.x, drop.y);
      ctx.stroke();
      
      ctx.restore();
    });
    
    // Draw floating tokens with physics
    tokens.forEach((token) => {
      ctx.save();
      ctx.globalAlpha = token.opacity;
      ctx.translate(token.x, token.y);
      ctx.scale(token.scale, token.scale);
      
      // Token glow effect
      ctx.shadowColor = '#00ff88';
      ctx.shadowBlur = 15;
      
      const tokenGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, 12);
      tokenGradient.addColorStop(0, '#ffffff');
      tokenGradient.addColorStop(0.3, '#00ff88');
      tokenGradient.addColorStop(0.7, 'rgba(0, 255, 136, 0.8)');
      tokenGradient.addColorStop(1, 'rgba(0, 255, 136, 0.2)');
      
      ctx.fillStyle = tokenGradient;
      ctx.beginPath();
      ctx.arc(0, 0, 10, 0, Math.PI * 2);
      ctx.fill();
      
      // Token inner circle
      ctx.shadowBlur = 0;
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(0, 0, 4, 0, Math.PI * 2);
      ctx.fill();
      
      // Token sparkle
      if (token.age % 60 < 30) {
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(-6, 0);
        ctx.lineTo(6, 0);
        ctx.moveTo(0, -6);
        ctx.lineTo(0, 6);
        ctx.stroke();
      }
      
      ctx.restore();
    });
    
    // Capacity indicator
    const indicatorX = bucketX + bucketWidth + 20;
    const indicatorY = bucketY;
    const indicatorHeight = bucketHeight;
    const indicatorWidth = 20;
    
    // Background
    ctx.fillStyle = 'rgba(100, 116, 139, 0.3)';
    ctx.fillRect(indicatorX, indicatorY, indicatorWidth, indicatorHeight);
    
    // Fill level
    const indicatorFillHeight = indicatorHeight * fillPercentage;
    const indicatorFillY = indicatorY + indicatorHeight - indicatorFillHeight;
    
    const indicatorGradient = ctx.createLinearGradient(indicatorX, indicatorFillY, indicatorX, indicatorY + indicatorHeight);
    indicatorGradient.addColorStop(0, '#00ff88');
    indicatorGradient.addColorStop(1, 'rgba(0, 255, 136, 0.5)');
    
    ctx.fillStyle = indicatorGradient;
    ctx.fillRect(indicatorX, indicatorFillY, indicatorWidth, indicatorFillHeight);
    
    // Indicator outline
    ctx.strokeStyle = '#00ff88';
    ctx.lineWidth = 2;
    ctx.strokeRect(indicatorX, indicatorY, indicatorWidth, indicatorHeight);
    
    // Labels with enhanced styling
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 16px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
    ctx.shadowBlur = 3;
    ctx.fillText(
      `${Math.floor(state.tokensRemaining)}/${state.maxTokens}`,
      canvas.width / 2,
      canvas.height - 40
    );
    
    ctx.font = '12px Inter, sans-serif';
    ctx.fillText('TOKENS', canvas.width / 2, canvas.height - 20);
    
    // Refill rate indicator
    ctx.font = '14px Inter, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(`Refill: ${config.requestsPerSecond}/s`, bucketX, bucketY - 60);
    
    ctx.shadowBlur = 0;
  };

  const renderSlidingWindow = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    const windowWidth = 320;
    const windowHeight = 80;
    const windowX = (canvas.width - windowWidth) / 2;
    const windowY = canvas.height / 2 - 40;
    
    // Draw window background with gradient
    const bgGradient = ctx.createLinearGradient(windowX, windowY, windowX, windowY + windowHeight);
    bgGradient.addColorStop(0, 'rgba(100, 116, 139, 0.3)');
    bgGradient.addColorStop(1, 'rgba(100, 116, 139, 0.1)');
    
    ctx.fillStyle = bgGradient;
    ctx.fillRect(windowX, windowY, windowWidth, windowHeight);
    
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 2;
    ctx.strokeRect(windowX, windowY, windowWidth, windowHeight);
    
    // Draw sliding window indicator with animation
    const now = Date.now();
    const windowStart = now - config.windowSizeMs;
    const progress = ((now % config.windowSizeMs) / config.windowSizeMs);
    const slideX = windowX + (windowWidth * progress);
    
    // Sliding indicator
    const slideGradient = ctx.createLinearGradient(slideX - 10, windowY, slideX + 10, windowY);
    slideGradient.addColorStop(0, 'rgba(59, 130, 246, 0)');
    slideGradient.addColorStop(0.5, 'rgba(59, 130, 246, 0.8)');
    slideGradient.addColorStop(1, 'rgba(59, 130, 246, 0)');
    
    ctx.fillStyle = slideGradient;
    ctx.fillRect(slideX - 10, windowY, 20, windowHeight);
    
    // Draw requests in window with enhanced visuals
    windowRequests.forEach((request) => {
      const requestAge = now - request.timestamp;
      if (requestAge <= config.windowSizeMs) {
        const requestProgress = 1 - (requestAge / config.windowSizeMs);
        const requestX = windowX + (windowWidth * requestProgress);
        const opacity = Math.max(0.3, 1 - (requestAge / config.windowSizeMs));
        
        ctx.save();
        ctx.globalAlpha = opacity;
        
        // Request glow
        ctx.shadowColor = request.allowed ? '#10b981' : '#ef4444';
        ctx.shadowBlur = 8;
        
        ctx.fillStyle = request.allowed ? '#10b981' : '#ef4444';
        ctx.beginPath();
        ctx.arc(requestX, windowY + windowHeight / 2, 6, 0, Math.PI * 2);
        ctx.fill();
        
        // Request pulse
        if (requestAge < 500) {
          ctx.strokeStyle = request.allowed ? '#10b981' : '#ef4444';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(requestX, windowY + windowHeight / 2, 6 + (requestAge / 50), 0, Math.PI * 2);
          ctx.stroke();
        }
        
        ctx.restore();
      }
    });
    
    // Enhanced labels
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 16px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
    ctx.shadowBlur = 3;
    ctx.fillText(
      `Sliding Window (${config.windowSizeMs}ms)`,
      canvas.width / 2,
      windowY - 25
    );
    
    const activeRequests = windowRequests.filter(r => now - r.timestamp <= config.windowSizeMs).length;
    ctx.font = '14px Inter, sans-serif';
    ctx.fillText(
      `${activeRequests}/${config.requestsPerSecond} requests in window`,
      canvas.width / 2,
      windowY + windowHeight + 35
    );
    
    ctx.shadowBlur = 0;
  };

  const renderFixedWindow = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    const windowWidth = 320;
    const windowHeight = 100;
    const windowX = (canvas.width - windowWidth) / 2;
    const windowY = canvas.height / 2 - 50;
    
    // Calculate current window
    const now = Date.now();
    const currentWindowStart = Math.floor(now / config.windowSizeMs) * config.windowSizeMs;
    const windowProgress = (now - currentWindowStart) / config.windowSizeMs;
    
    // Draw window background with gradient
    const bgGradient = ctx.createLinearGradient(windowX, windowY, windowX, windowY + windowHeight);
    bgGradient.addColorStop(0, 'rgba(168, 85, 247, 0.3)');
    bgGradient.addColorStop(1, 'rgba(168, 85, 247, 0.1)');
    
    ctx.fillStyle = bgGradient;
    ctx.fillRect(windowX, windowY, windowWidth, windowHeight);
    
    ctx.strokeStyle = '#a855f7';
    ctx.lineWidth = 2;
    ctx.strokeRect(windowX, windowY, windowWidth, windowHeight);
    
    // Draw animated progress bar
    const progressWidth = windowWidth * windowProgress;
    const progressGradient = ctx.createLinearGradient(windowX, windowY + windowHeight - 12, windowX + progressWidth, windowY + windowHeight - 12);
    progressGradient.addColorStop(0, 'rgba(168, 85, 247, 0.8)');
    progressGradient.addColorStop(1, 'rgba(168, 85, 247, 0.4)');
    
    ctx.fillStyle = progressGradient;
    ctx.fillRect(windowX, windowY + windowHeight - 12, progressWidth, 12);
    
    // Draw request counter with enhanced visuals
    const currentWindowRequests = windowRequests.filter(r => r.timestamp >= currentWindowStart).length;
    const barHeight = (windowHeight - 40) * Math.min(currentWindowRequests / config.requestsPerSecond, 1);
    const barY = windowY + windowHeight - 25 - barHeight;
    
    // Request bar gradient
    const barGradient = ctx.createLinearGradient(windowX + 15, barY, windowX + 15, windowY + windowHeight - 25);
    if (currentWindowRequests > config.requestsPerSecond) {
      barGradient.addColorStop(0, '#ef4444');
      barGradient.addColorStop(1, '#dc2626');
    } else {
      barGradient.addColorStop(0, '#10b981');
      barGradient.addColorStop(1, '#059669');
    }
    
    ctx.fillStyle = barGradient;
    ctx.fillRect(windowX + 15, barY, 25, barHeight);
    
    // Bar outline
    ctx.strokeStyle = currentWindowRequests > config.requestsPerSecond ? '#ef4444' : '#10b981';
    ctx.lineWidth = 2;
    ctx.strokeRect(windowX + 15, windowY + 15, 25, windowHeight - 40);
    
    // Draw request dots with animation
    const windowRequestsInCurrent = windowRequests.filter(r => r.timestamp >= currentWindowStart);
    windowRequestsInCurrent.forEach((request, index) => {
      const dotX = windowX + 60 + (index * 18);
      const dotY = windowY + windowHeight / 2;
      
      if (dotX < windowX + windowWidth - 15) {
        const age = now - request.timestamp;
        const scale = age < 300 ? 1 + (300 - age) / 300 : 1;
        
        ctx.save();
        ctx.translate(dotX, dotY);
        ctx.scale(scale, scale);
        
        ctx.shadowColor = request.allowed ? '#10b981' : '#ef4444';
        ctx.shadowBlur = 6;
        
        ctx.fillStyle = request.allowed ? '#10b981' : '#ef4444';
        ctx.beginPath();
        ctx.arc(0, 0, 5, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
      }
    });
    
    // Enhanced labels
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 16px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
    ctx.shadowBlur = 3;
    ctx.fillText(
      `Fixed Window (${config.windowSizeMs}ms)`,
      canvas.width / 2,
      windowY - 25
    );
    
    ctx.font = '14px Inter, sans-serif';
    ctx.fillText(
      `${currentWindowRequests}/${config.requestsPerSecond} requests`,
      canvas.width / 2,
      windowY + windowHeight + 35
    );
    
    // Window reset timer with animation
    const timeUntilReset = config.windowSizeMs - (now - currentWindowStart);
    const resetProgress = timeUntilReset / config.windowSizeMs;
    
    ctx.font = '12px Inter, sans-serif';
    ctx.fillStyle = `rgba(255, 255, 255, ${0.6 + 0.4 * Math.sin(Date.now() * 0.01)})`;
    ctx.fillText(
      `Resets in: ${Math.ceil(timeUntilReset / 1000)}s`,
      canvas.width / 2,
      windowY + windowHeight + 55
    );
    
    ctx.shadowBlur = 0;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update animations
      setBucketShake(prev => prev + 1);
      
      // Update filler drops
      setFillerDrops(prev => prev
        .map(drop => ({
          ...drop,
          y: drop.y + drop.speed,
          opacity: drop.y > drop.targetY ? drop.opacity * 0.95 : drop.opacity,
        }))
        .filter(drop => drop.opacity > 0.1 && drop.y < 300)
      );
      
      // Update tokens with physics
      setTokens(prev => prev.map(token => ({
        ...token,
        x: token.x + token.vx,
        y: token.y + token.vy,
        vx: token.vx * 0.99,
        vy: token.vy * 0.99,
        age: token.age + 1,
        opacity: Math.max(0.3, token.opacity - 0.002),
      })).filter(token => token.age < 300));
      
      switch (config.algorithm) {
        case 'token-bucket':
          renderTokenBucket(ctx, canvas);
          break;
        case 'sliding-window':
          renderSlidingWindow(ctx, canvas);
          break;
        case 'fixed-window':
          renderFixedWindow(ctx, canvas);
          break;
      }
      
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [config, state, tokens, fillerDrops, windowRequests, bucketShake]);

  // Generate filler drops for token bucket
  useEffect(() => {
    if (config.algorithm === 'token-bucket') {
      const now = Date.now();
      const timeSinceLastRefill = now - lastRefillRef.current;
      const refillInterval = 1000 / config.requestsPerSecond;
      
      if (timeSinceLastRefill >= refillInterval && state.tokensRemaining < state.maxTokens) {
        const canvas = canvasRef.current;
        if (canvas) {
          const bucketX = canvas.width / 2 - 80;
          const bucketWidth = 160;
          
          setFillerDrops(prev => [...prev, createFillerDrop(bucketX, bucketWidth)]);
          lastRefillRef.current = now;
        }
      }
    }
  }, [config, state.tokensRemaining, state.maxTokens]);

  useEffect(() => {
    if (config.algorithm === 'token-bucket') {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const bucketX = canvas.width / 2 - 80;
      const bucketY = canvas.height / 2 - 100;
      const bucketWidth = 160;
      const bucketHeight = 180;
      
      // Generate tokens based on current state
      const newTokens: Token[] = [];
      const tokenCount = Math.min(Math.floor(state.tokensRemaining), 15);
      
      for (let i = 0; i < tokenCount; i++) {
        newTokens.push(createToken(bucketX, bucketY, bucketWidth, bucketHeight));
      }
      
      setTokens(newTokens);
    } else {
      // For window-based algorithms, simulate recent requests
      const now = Date.now();
      const recentRequests: WindowRequest[] = [];
      
      // Generate some sample requests for visualization
      for (let i = 0; i < Math.min(state.requestCount, 12); i++) {
        recentRequests.push({
          id: `req-${i}`,
          x: Math.random() * 200,
          timestamp: now - Math.random() * config.windowSizeMs,
          allowed: Math.random() > 0.3,
        });
      }
      
      setWindowRequests(recentRequests);
    }
  }, [config.algorithm, state.tokensRemaining, state.requestCount, config.windowSizeMs]);

  return (
    <div className={`relative ${className}`}>
      <canvas
        ref={canvasRef}
        width={500}
        height={350}
        className="w-full h-full"
      />
      <div className="absolute top-4 left-4 text-sm text-gray-300 bg-gray-900/80 backdrop-blur-sm rounded-lg p-3">
        <div className="font-semibold text-green-400">Algorithm: {config.algorithm}</div>
        <div>Rate: {config.requestsPerSecond}/s</div>
        <div>Burst: {config.burstCapacity}</div>
        <div className={`mt-1 font-medium ${state.isBlocked ? 'text-red-400' : 'text-green-400'}`}>
          Status: {state.isBlocked ? 'Rate Limited' : 'Available'}
        </div>
      </div>
    </div>
  );
};