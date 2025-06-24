import React from 'react';
import { Activity } from 'lucide-react';
import { useRateLimiter } from './hooks/useRateLimiter';
import { TokenBucketVisualizer } from './components/TokenBucketVisualizer';
import { RequestFlow } from './components/RequestFlow';
import { AnalyticsChart } from './components/AnalyticsChart';
import { ConfigPanel } from './components/ConfigPanel';
import { StatsPanel } from './components/StatsPanel';

function App() {
  const {
    config,
    simulation,
    isRunning,
    autoRefillEnabled,
    requests,
    state,
    analytics,
    analyticsHistory,
    setConfig,
    setSimulation,
    toggleSimulation,
    toggleAutoRefill,
    manualFill,
    manualDrain,
    reset,
  } = useRateLimiter();

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-400/10 rounded-lg">
                <Activity className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Rate Limiter Visualizer</h1>
                <p className="text-sm text-gray-400">Real-time monitoring and simulation</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-400">
                Algorithm: <span className="text-green-400 font-medium">{config.algorithm}</span>
              </div>
              {config.algorithm === 'token-bucket' && (
                <div className="text-sm text-gray-400">
                  Auto-refill: <span className={`font-medium ${autoRefillEnabled ? 'text-green-400' : 'text-yellow-400'}`}>
                    {autoRefillEnabled ? 'ON' : 'OFF'}
                  </span>
                </div>
              )}
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                isRunning 
                  ? 'bg-green-400/20 text-green-400' 
                  : 'bg-gray-400/20 text-gray-400'
              }`}>
                {isRunning ? 'Running' : 'Stopped'}
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <StatsPanel analytics={analytics} className="mb-8" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Configuration Panel */}
          <div className="lg:col-span-1">
            <ConfigPanel
              config={config}
              simulation={simulation}
              isRunning={isRunning}
              autoRefillEnabled={autoRefillEnabled}
              currentTokens={state.tokensRemaining}
              maxTokens={state.maxTokens}
              onConfigChange={setConfig}
              onSimulationChange={setSimulation}
              onToggleSimulation={toggleSimulation}
              onToggleAutoRefill={toggleAutoRefill}
              onManualFill={manualFill}
              onManualDrain={manualDrain}
              onReset={reset}
            />
          </div>

          {/* Visualization Area */}
          <div className="lg:col-span-2 space-y-8">
            {/* Algorithm Visualizer */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                {config.algorithm === 'token-bucket' ? 'Token Bucket' : 
                 config.algorithm === 'sliding-window' ? 'Sliding Window' : 
                 'Fixed Window'} Visualization
              </h3>
              <TokenBucketVisualizer state={state} config={config} className="h-80" />
            </div>

            {/* Request Flow */}
            <RequestFlow requests={requests} className="h-64" />
          </div>
        </div>

        {/* Analytics Chart */}
        <div className="mt-8">
          <AnalyticsChart analytics={analyticsHistory} />
        </div>

        {/* Recent Requests Table */}
        <div className="mt-8 bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Recent Requests</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-2 text-gray-400">Request ID</th>
                  <th className="text-left py-2 text-gray-400">Timestamp</th>
                  <th className="text-left py-2 text-gray-400">Client</th>
                  <th className="text-left py-2 text-gray-400">Status</th>
                </tr>
              </thead>
              <tbody>
                {requests.slice(-10).reverse().map((request) => (
                  <tr key={request.id} className="border-b border-gray-700/50">
                    <td className="py-2 font-mono text-gray-300">{request.id}</td>
                    <td className="py-2 text-gray-300">
                      {new Date(request.timestamp).toLocaleTimeString()}
                    </td>
                    <td className="py-2 text-gray-300">{request.clientId}</td>
                    <td className="py-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        request.allowed 
                          ? 'bg-green-400/20 text-green-400' 
                          : 'bg-red-400/20 text-red-400'
                      }`}>
                        {request.allowed ? 'ALLOWED' : 'BLOCKED'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {requests.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No requests yet. Start the simulation to see data.
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;