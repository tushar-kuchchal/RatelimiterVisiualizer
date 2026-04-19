import { useRateLimiter } from '../hooks/useRateLimiter';
import { TokenBucketVisualizer } from '../components/TokenBucketVisualizer';
import { RequestFlow } from '../components/RequestFlow';
import { AnalyticsChart } from '../components/AnalyticsChart';
import { ConfigPanel } from '../components/ConfigPanel';
import { StatsPanel } from '../components/StatsPanel';
import { AdUnit } from '../components/AdUnit';

export function Home() {
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
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <section className="mb-10">
        <h2 className="text-3xl font-bold text-white mb-3">
          Interactive Rate Limiter Visualizer
        </h2>
        <p className="text-gray-300 max-w-3xl leading-relaxed">
          Learn how API rate limiting works by watching it happen in real time. Configure
          the algorithm, drive synthetic request traffic, and observe how the limiter allows
          or rejects requests based on capacity, windows, and token refill rates. This tool
          is free, runs entirely in your browser, and is designed to help backend developers
          and students build intuition about rate limiting in distributed systems.
        </p>
      </section>

      <div className="flex items-center gap-4 mb-6">
        <div className="text-sm text-gray-400">
          Algorithm:{' '}
          <span className="text-green-400 font-medium">{config.algorithm}</span>
        </div>
        {config.algorithm === 'token-bucket' && (
          <div className="text-sm text-gray-400">
            Auto-refill:{' '}
            <span className={`font-medium ${autoRefillEnabled ? 'text-green-400' : 'text-yellow-400'}`}>
              {autoRefillEnabled ? 'ON' : 'OFF'}
            </span>
          </div>
        )}
        <div
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            isRunning ? 'bg-green-400/20 text-green-400' : 'bg-gray-400/20 text-gray-400'
          }`}
        >
          {isRunning ? 'Running' : 'Stopped'}
        </div>
      </div>

      <StatsPanel analytics={analytics} className="mb-8" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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

        <div className="lg:col-span-2 space-y-8">
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4">
              {config.algorithm === 'token-bucket'
                ? 'Token Bucket'
                : config.algorithm === 'sliding-window'
                ? 'Sliding Window'
                : 'Fixed Window'}{' '}
              Visualization
            </h3>
            <TokenBucketVisualizer state={state} config={config} className="h-80" />
          </div>

          <RequestFlow requests={requests} className="h-64" />
        </div>
      </div>

      <div className="mt-8">
        <AnalyticsChart analytics={analyticsHistory} />
      </div>

      <div className="mt-8 bg-gray-800 rounded-lg p-6">
        <AdUnit slot="0000000000" />
      </div>

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
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        request.allowed
                          ? 'bg-green-400/20 text-green-400'
                          : 'bg-red-400/20 text-red-400'
                      }`}
                    >
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

      <section className="mt-16 bg-gray-800 rounded-lg p-8">
        <h2 className="text-2xl font-bold text-white mb-4">
          What Is Rate Limiting and Why Does It Matter?
        </h2>
        <p className="text-gray-300 mb-4 leading-relaxed">
          Rate limiting is a technique used by APIs, websites, and distributed systems to
          control how many requests a client can make in a given time window. It protects
          servers from being overwhelmed by traffic spikes, abuse, scraping, brute-force
          attacks, or accidental loops from buggy clients. Without rate limits, a single
          misbehaving client could consume all of a service's capacity and cause an outage
          for every other user.
        </p>
        <p className="text-gray-300 mb-4 leading-relaxed">
          Every major API you've ever used &mdash; Twitter, GitHub, Stripe, Google Maps,
          OpenAI &mdash; applies some form of rate limiting. When you exceed their limit,
          you typically get an HTTP <code className="text-green-400">429 Too Many Requests</code>{' '}
          response with a <code className="text-green-400">Retry-After</code> header telling
          you when to try again. Understanding the algorithm behind that response helps you
          design robust clients that back off gracefully and design servers that scale
          predictably.
        </p>
        <p className="text-gray-300 leading-relaxed">
          This visualizer simulates three common algorithms so you can see their behavior
          side by side. Each algorithm has different trade-offs around burstiness, fairness,
          memory usage, and implementation complexity. Pick one from the configuration panel
          and start the simulation to watch it in action.
        </p>

        <h3 className="text-xl font-semibold text-white mt-8 mb-3">Token Bucket</h3>
        <p className="text-gray-300 mb-3 leading-relaxed">
          The token bucket algorithm imagines a bucket with a fixed capacity that slowly
          fills with tokens at a constant rate (for example, 10 tokens per second). Each
          incoming request consumes one token; if the bucket is empty, the request is
          rejected or queued. Because the bucket can hold up to its full capacity of tokens
          at any time, token bucket naturally allows short bursts above the average rate,
          which is often desirable for APIs where legitimate clients occasionally make quick
          batches of calls.
        </p>

        <h3 className="text-xl font-semibold text-white mt-8 mb-3">Sliding Window</h3>
        <p className="text-gray-300 mb-3 leading-relaxed">
          The sliding window algorithm counts requests over a continuously moving time
          interval &mdash; for example, &ldquo;no more than 100 requests in the last 60
          seconds.&rdquo; Unlike fixed windows, the boundary moves with every request, which
          smooths out the bursty behavior you'd otherwise see at window edges. Sliding
          window is more memory-intensive because it typically tracks individual request
          timestamps, but it provides the fairest and most accurate rate enforcement.
        </p>

        <h3 className="text-xl font-semibold text-white mt-8 mb-3">Fixed Window</h3>
        <p className="text-gray-300 mb-3 leading-relaxed">
          The fixed window algorithm divides time into discrete buckets (every minute,
          every hour, etc.) and counts requests per bucket. It's the simplest algorithm to
          implement and has low memory overhead since you only store one counter per
          window. The trade-off is that clients can abuse the boundary: if the limit is 100
          requests per minute, a client could send 100 requests at 12:00:59 and another 100
          at 12:01:00 &mdash; effectively 200 requests in one second.
        </p>
      </section>
    </main>
  );
}
