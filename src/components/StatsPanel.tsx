import React from 'react';
import { TrendingUp, TrendingDown, Activity, Shield } from 'lucide-react';
import { Analytics } from '../types';

interface StatsPanelProps {
  analytics: Analytics;
  className?: string;
}

export const StatsPanel: React.FC<StatsPanelProps> = ({
  analytics,
  className = '',
}) => {
  const stats = [
    {
      label: 'Total Requests',
      value: analytics.totalRequests.toLocaleString(),
      icon: Activity,
      color: 'text-blue-400',
      bgColor: 'bg-blue-400/10',
    },
    {
      label: 'Success Rate',
      value: `${analytics.successRate.toFixed(1)}%`,
      icon: analytics.successRate > 80 ? TrendingUp : TrendingDown,
      color: analytics.successRate > 80 ? 'text-green-400' : 'text-red-400',
      bgColor: analytics.successRate > 80 ? 'bg-green-400/10' : 'bg-red-400/10',
    },
    {
      label: 'Current RPS',
      value: analytics.currentRps.toFixed(1),
      icon: Activity,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-400/10',
    },
    {
      label: 'Blocked Requests',
      value: analytics.blockedRequests.toLocaleString(),
      icon: Shield,
      color: 'text-red-400',
      bgColor: 'bg-red-400/10',
    },
  ];

  return (
    <div className={`grid grid-cols-2 lg:grid-cols-4 gap-4 ${className}`}>
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-gray-600 transition-colors"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">{stat.label}</p>
              <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
            </div>
            <div className={`p-2 rounded-lg ${stat.bgColor}`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};