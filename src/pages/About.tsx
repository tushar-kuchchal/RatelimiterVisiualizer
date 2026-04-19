export function About() {
  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-white mb-6">About Rate Limiter Visualizer</h1>
      <p className="text-gray-300 leading-relaxed mb-6">
        Rate Limiter Visualizer is a free educational tool that helps backend developers,
        computer science students, and system design interviewees build intuition about how
        rate limiting works inside real production systems. Instead of reading static
        diagrams and pseudo-code, you can configure the algorithm, drive synthetic
        request traffic, and watch requests flow through the limiter in real time.
      </p>

      <section className="bg-gray-800 rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold text-white mb-3">Why we built this</h2>
        <p className="text-gray-300 leading-relaxed mb-3">
          Rate limiting is one of those topics that sounds simple until you have to
          implement it. There are multiple algorithms, each with subtle trade-offs, and
          the differences between them only become obvious when you see their behavior at
          the boundaries &mdash; the moment a window rolls over, the moment a bucket
          refills, the moment a burst hits. Text descriptions and whiteboard diagrams rarely
          convey this.
        </p>
        <p className="text-gray-300 leading-relaxed">
          By giving you interactive controls and live animations, this tool makes those
          dynamics visible. It also mirrors real production metrics &mdash; allowed vs.
          rejected requests, throughput, rejection rate, and a time-series chart &mdash;
          so the experience feels close to debugging a real service behind a rate limiter.
        </p>
      </section>

      <section className="bg-gray-800 rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold text-white mb-3">Who this is for</h2>
        <ul className="text-gray-300 space-y-2 list-disc list-inside leading-relaxed">
          <li>
            <strong className="text-white">Backend developers</strong> designing API gateways,
            reverse proxies, or service meshes that need to throttle incoming traffic.
          </li>
          <li>
            <strong className="text-white">System design candidates</strong> preparing for
            interviews at companies where rate limiting is a common question.
          </li>
          <li>
            <strong className="text-white">Computer science students</strong> learning
            distributed systems, networking, and performance engineering.
          </li>
          <li>
            <strong className="text-white">SREs and platform engineers</strong> tuning
            existing rate limits and trying to predict behavior under different load
            profiles.
          </li>
        </ul>
      </section>

      <section className="bg-gray-800 rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold text-white mb-3">The three algorithms</h2>

        <h3 className="text-lg font-semibold text-white mt-4 mb-2">1. Token Bucket</h3>
        <p className="text-gray-300 leading-relaxed mb-3">
          A fixed-capacity bucket accumulates tokens at a constant refill rate. Each request
          consumes one token; when the bucket is empty, requests are rejected. Token bucket
          is the default choice for most APIs because it allows short bursts (up to the
          bucket's capacity) while enforcing a long-term average. Stripe, GitHub, and many
          cloud providers use token-bucket-style limiters.
        </p>

        <h3 className="text-lg font-semibold text-white mt-4 mb-2">2. Sliding Window</h3>
        <p className="text-gray-300 leading-relaxed mb-3">
          The limiter keeps a rolling count of requests made within the last N seconds. As
          time moves forward, old requests age out of the window and new ones enter.
          Sliding window provides the most accurate rate enforcement and avoids the
          boundary-abuse problem of fixed windows, but it costs more memory because each
          request timestamp is typically tracked individually (or approximated with a
          weighted counter).
        </p>

        <h3 className="text-lg font-semibold text-white mt-4 mb-2">3. Fixed Window</h3>
        <p className="text-gray-300 leading-relaxed mb-3">
          Time is divided into discrete, non-overlapping windows (per second, per minute,
          per hour). A single counter tracks requests in the current window, and the counter
          resets when the window ends. Fixed windows are easy to implement with a single
          integer in Redis (<code className="text-green-400">INCR</code> +{' '}
          <code className="text-green-400">EXPIRE</code>) but can let clients briefly double
          their effective rate around window boundaries.
        </p>
      </section>

      <section className="bg-gray-800 rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold text-white mb-3">How to use the visualizer</h2>
        <ol className="text-gray-300 space-y-2 list-decimal list-inside leading-relaxed">
          <li>On the home page, open the <strong className="text-white">Configuration</strong> panel.</li>
          <li>Pick an algorithm (token bucket, sliding window, or fixed window).</li>
          <li>Adjust the capacity, window size, or refill rate for that algorithm.</li>
          <li>Set the simulated request rate and click <strong className="text-white">Start</strong>.</li>
          <li>Watch the visualizer, request flow, analytics chart, and recent requests table update live.</li>
          <li>Try edge cases &mdash; very high request rates, tiny windows, empty buckets &mdash; to see how each algorithm behaves.</li>
        </ol>
      </section>

      <section className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-white mb-3">Open and free</h2>
        <p className="text-gray-300 leading-relaxed">
          This tool is free to use, runs entirely in your browser, and sends no data about
          your simulation to any server. The source code is available and the goal is
          purely educational. If ads appear on the site, they help cover hosting costs and
          are served by Google AdSense under their standard privacy practices &mdash; see
          our Privacy Policy for details.
        </p>
      </section>
    </main>
  );
}
