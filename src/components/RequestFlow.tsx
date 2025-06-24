import React, { useEffect, useState } from 'react';
import { RequestEvent } from '../types';

interface RequestFlowProps {
  requests: RequestEvent[];
  className?: string;
}

interface FloatingRequest {
  id: string;
  x: number;
  y: number;
  allowed: boolean;
  timestamp: number;
  opacity: number;
}

export const RequestFlow: React.FC<RequestFlowProps> = ({
  requests,
  className = '',
}) => {
  const [floatingRequests, setFloatingRequests] = useState<FloatingRequest[]>([]);

  useEffect(() => {
    const newRequests = requests.slice(-10).map((request, index) => ({
      id: request.id,
      x: Math.random() * 300,
      y: 50 + index * 25,
      allowed: request.allowed,
      timestamp: request.timestamp,
      opacity: 1,
    }));

    setFloatingRequests(newRequests);

    const timer = setTimeout(() => {
      setFloatingRequests(prev => 
        prev.map(req => ({ ...req, opacity: req.opacity * 0.9 }))
      );
    }, 100);

    return () => clearTimeout(timer);
  }, [requests]);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 rounded-lg">
        <div className="p-4">
          <h3 className="text-lg font-semibold text-white mb-4">Request Flow</h3>
          
          <div className="space-y-2">
            {floatingRequests.map((request) => (
              <div
                key={request.id}
                className={`flex items-center space-x-3 transition-all duration-500 ${
                  request.allowed ? 'text-green-400' : 'text-red-400'
                }`}
                style={{
                  opacity: request.opacity,
                  transform: `translateX(${request.x}px)`,
                }}
              >
                <div
                  className={`w-3 h-3 rounded-full ${
                    request.allowed ? 'bg-green-400' : 'bg-red-400'
                  } animate-pulse`}
                />
                <span className="text-sm font-mono">
                  {new Date(request.timestamp).toLocaleTimeString()}
                </span>
                <span className="text-sm">
                  {request.allowed ? 'ALLOWED' : 'BLOCKED'}
                </span>
              </div>
            ))}
          </div>
          
          {floatingRequests.length === 0 && (
            <div className="text-gray-500 text-center py-8">
              No recent requests
            </div>
          )}
        </div>
      </div>
    </div>
  );
};