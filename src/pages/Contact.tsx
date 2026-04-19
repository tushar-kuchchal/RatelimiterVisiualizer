export function Contact() {
  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-gray-300 leading-relaxed">
      <h1 className="text-4xl font-bold text-white mb-6">Contact</h1>

      <p className="mb-6">
        Have a question, bug report, feature request, or feedback about Rate Limiter
        Visualizer? We&apos;d love to hear from you.
      </p>

      <section className="bg-gray-800 rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold text-white mb-3">Email</h2>
        <p className="mb-3">
          For any questions, concerns, privacy requests, or partnership inquiries, please
          email us at:
        </p>
        <a
          href="mailto:tkuchchal530@gmail.com"
          className="text-green-400 hover:underline text-lg font-medium"
        >
          tkuchchal530@gmail.com
        </a>
      </section>

      <section className="bg-gray-800 rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold text-white mb-3">Response time</h2>
        <p>
          We typically respond within 2&ndash;5 business days. For urgent privacy-related
          requests (GDPR, CCPA, data deletion), please include &ldquo;Privacy&rdquo; in the
          subject line and we will prioritize the response.
        </p>
      </section>

      <section className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-white mb-3">What to include</h2>
        <p className="mb-3">To help us respond faster, please include:</p>
        <ul className="list-disc list-inside space-y-1 ml-4">
          <li>A clear description of your question or issue</li>
          <li>Steps to reproduce (for bug reports)</li>
          <li>Your browser and operating system (for technical issues)</li>
          <li>Screenshots if relevant</li>
        </ul>
      </section>
    </main>
  );
}
