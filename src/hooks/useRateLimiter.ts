import { useState, useEffect, useCallback, useRef } from 'react';
import { RateLimiterConfig, RateLimiterState, RequestEvent, Analytics, SimulationConfig } from '../types';

export const useRateLimiter = () => {
  const [config, setConfig] = useState<RateLimiterConfig>({
    algorithm: 'token-bucket',
    requestsPerSecond: 10,
    burstCapacity: 50,
    windowSizeMs: 1000,
  });

  const [simulation, setSimulation] = useState<SimulationConfig>({
    requestRate: 15,
    burstPattern: false,
    duration: 60,
    clientCount: 1,
  });

  const [isRunning, setIsRunning] = useState(false);
  const [autoRefillEnabled, setAutoRefillEnabled] = useState(true);
  const [requests, setRequests] = useState<RequestEvent[]>([]);
  const [state, setState] = useState<RateLimiterState>({
    tokensRemaining: 50,
    maxTokens: 50,
    refillRate: 10,
    windowStart: Date.now(),
    requestCount: 0,
    isBlocked: false,
  });

  const [analyticsHistory, setAnalyticsHistory] = useState<Analytics[]>([]);
  const intervalRef = useRef<NodeJS.Timeout>();
  const refillIntervalRef = useRef<NodeJS.Timeout>();
  const requestIdRef = useRef(0);

  const getCurrentAnalytics = useCallback((): Analytics => {
    const now = Date.now();
    const recentRequests = requests.filter(r => now - r.timestamp < 5000);
    const allowedRequests = recentRequests.filter(r => r.allowed).length;
    const blockedRequests = recentRequests.filter(r => !r.allowed).length;
    
    return {
      totalRequests: requests.length,
      allowedRequests: requests.filter(r => r.allowed).length,
      blockedRequests: requests.filter(r => !r.allowed).length,
      currentRps: recentRequests.length / 5,
      averageRps: requests.length > 0 ? requests.length / Math.max((now - requests[0].timestamp) / 1000, 1) : 0,
      successRate: requests.length > 0 ? (requests.filter(r => r.allowed).length / requests.length) * 100 : 100,
    };
  }, [requests]);

  // Manual token management functions
  const manualFill = useCallback((amount: number) => {
    setState(prev => ({
      ...prev,
      tokensRemaining: Math.min(prev.tokensRemaining + amount, prev.maxTokens),
    }));
  }, []);

  const manualDrain = useCallback((amount: number) => {
    setState(prev => ({
      ...prev,
      tokensRemaining: Math.max(prev.tokensRemaining - amount, 0),
    }));
  }, []);

  const toggleAutoRefill = useCallback(() => {
    setAutoRefillEnabled(prev => !prev);
  }, []);

  // Auto-refill mechanism for token bucket
  useEffect(() => {
    if (config.algorithm === 'token-bucket' && autoRefillEnabled) {
      const refillInterval = 1000 / config.requestsPerSecond; // Time between each token refill
      
      refillIntervalRef.current = setInterval(() => {
        setState(prev => {
          if (prev.tokensRemaining < prev.maxTokens) {
            return {
              ...prev,
              tokensRemaining: Math.min(prev.tokensRemaining + 1, prev.maxTokens),
            };
          }
          return prev;
        });
      }, refillInterval);

      return () => {
        if (refillIntervalRef.current) {
          clearInterval(refillIntervalRef.current);
        }
      };
    } else {
      if (refillIntervalRef.current) {
        clearInterval(refillIntervalRef.current);
      }
    }
  }, [config.algorithm, config.requestsPerSecond, autoRefillEnabled]);

  const simulateTokenBucket = useCallback((currentState: RateLimiterState): boolean => {
    if (currentState.tokensRemaining >= 1) {
      setState(prev => ({
        ...prev,
        tokensRemaining: prev.tokensRemaining - 1,
        requestCount: prev.requestCount + 1,
        isBlocked: false,
      }));
      return true;
    } else {
      setState(prev => ({
        ...prev,
        requestCount: prev.requestCount + 1,
        isBlocked: true,
      }));
      return false;
    }
  }, []);

  const simulateSlidingWindow = useCallback((): boolean => {
    const now = Date.now();
    const windowStart = now - config.windowSizeMs;
    const recentRequests = requests.filter(r => r.timestamp > windowStart);
    const allowed = recentRequests.length < config.requestsPerSecond;
    
    setState(prev => ({
      ...prev,
      requestCount: prev.requestCount + 1,
      isBlocked: !allowed,
      windowStart: windowStart,
    }));
    
    return allowed;
  }, [config, requests]);

  const simulateFixedWindow = useCallback((): boolean => {
    const now = Date.now();
    const windowStartFixed = Math.floor(now / config.windowSizeMs) * config.windowSizeMs;
    const windowRequests = requests.filter(r => r.timestamp >= windowStartFixed);
    const allowed = windowRequests.length < config.requestsPerSecond;
    
    setState(prev => ({
      ...prev,
      requestCount: prev.requestCount + 1,
      isBlocked: !allowed,
      windowStart: windowStartFixed,
    }));
    
    return allowed;
  }, [config, requests]);

  const simulateRequest = useCallback(() => {
    const requestId = `req-${requestIdRef.current++}`;
    let allowed = false;

    switch (config.algorithm) {
      case 'token-bucket':
        allowed = simulateTokenBucket(state);
        break;
      case 'sliding-window':
        allowed = simulateSlidingWindow();
        break;
      case 'fixed-window':
        allowed = simulateFixedWindow();
        break;
    }

    const newRequest: RequestEvent = {
      id: requestId,
      timestamp: Date.now(),
      allowed,
      clientId: `client-${Math.floor(Math.random() * simulation.clientCount) + 1}`,
    };

    setRequests(prev => [...prev.slice(-100), newRequest]);
    return allowed;
  }, [config, state, simulation, simulateTokenBucket, simulateSlidingWindow, simulateFixedWindow]);

  useEffect(() => {
    if (!isRunning) return;

    const baseInterval = 1000 / simulation.requestRate;
    const interval = simulation.burstPattern 
      ? baseInterval * (0.5 + Math.random()) // Add randomness for burst
      : baseInterval;

    intervalRef.current = setTimeout(() => {
      simulateRequest();
    }, interval);

    return () => {
      if (intervalRef.current) {
        clearTimeout(intervalRef.current);
      }
    };
  }, [isRunning, simulation, simulateRequest, requests]);

  useEffect(() => {
    const analyticsInterval = setInterval(() => {
      const analytics = getCurrentAnalytics();
      setAnalyticsHistory(prev => [...prev.slice(-50), analytics]);
    }, 1000);

    return () => clearInterval(analyticsInterval);
  }, [getCurrentAnalytics]);

  useEffect(() => {
    setState(prev => ({
      ...prev,
      maxTokens: config.burstCapacity,
      refillRate: config.requestsPerSecond,
      tokensRemaining: config.algorithm === 'token-bucket' ? Math.min(prev.tokensRemaining, config.burstCapacity) : prev.tokensRemaining,
    }));
  }, [config]);

  const toggleSimulation = useCallback(() => {
    setIsRunning(prev => !prev);
  }, []);

  const reset = useCallback(() => {
    setIsRunning(false);
    setRequests([]);
    setState({
      tokensRemaining: config.burstCapacity,
      maxTokens: config.burstCapacity,
      refillRate: config.requestsPerSecond,
      windowStart: Date.now(),
      requestCount: 0,
      isBlocked: false,
    });
    setAnalyticsHistory([]);
    setAutoRefillEnabled(true);
    requestIdRef.current = 0;
  }, [config]);

  return {
    config,
    simulation,
    isRunning,
    autoRefillEnabled,
    requests,
    state,
    analytics: getCurrentAnalytics(),
    analyticsHistory,
    setConfig,
    setSimulation,
    toggleSimulation,
    toggleAutoRefill,
    manualFill,
    manualDrain,
    reset,
  };
};