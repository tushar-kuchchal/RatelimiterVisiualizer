export interface RateLimiterConfig {
  algorithm: 'token-bucket' | 'sliding-window' | 'fixed-window';
  requestsPerSecond: number;
  burstCapacity: number;
  windowSizeMs: number;
}

export interface RequestEvent {
  id: string;
  timestamp: number;
  allowed: boolean;
  clientId?: string;
  endpoint?: string;
}

export interface RateLimiterState {
  tokensRemaining: number;
  maxTokens: number;
  refillRate: number;
  windowStart: number;
  requestCount: number;
  isBlocked: boolean;
}

export interface Analytics {
  totalRequests: number;
  allowedRequests: number;
  blockedRequests: number;
  currentRps: number;
  averageRps: number;
  successRate: number;
}

export interface SimulationConfig {
  requestRate: number;
  burstPattern: boolean;
  duration: number;
  clientCount: number;
}