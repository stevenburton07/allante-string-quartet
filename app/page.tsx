export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-light-blue text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Allante String Quartet
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-light-gray">
            Bringing beautiful chamber music to San Diego and beyond
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/concerts"
              className="bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-light-gray transition-colors"
            >
              View Concerts
            </a>
            <a
              href="/hire"
              className="bg-secondary text-white px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
            >
              Hire Us
            </a>
          </div>
        </div>
      </section>

      {/* About Preview */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6">
              Welcome
            </h2>
            <p className="text-lg text-gray-700 mb-8">
              The Allante String Quartet is a professional ensemble dedicated to performing
              exceptional chamber music for audiences throughout San Diego County and beyond.
              Our repertoire spans from classical masterworks to contemporary compositions.
            </p>
            <a
              href="/about"
              className="inline-block text-secondary hover:text-primary font-semibold transition-colors"
            >
              Learn More About Us →
            </a>
          </div>
        </div>
      </section>

      {/* Upcoming Concerts Preview */}
      <section className="py-16 bg-light-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-primary text-center mb-12">
            Upcoming Performances
          </h2>
          <div className="text-center">
            <p className="text-gray-600 mb-6">
              Stay tuned for our upcoming concert schedule
            </p>
            <a
              href="/concerts"
              className="inline-block bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-opacity"
            >
              View All Concerts
            </a>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6">
            Support Our Music
          </h2>
          <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
            Your donations help us continue bringing live chamber music to the community
          </p>
          <a
            href="/donate"
            className="inline-block bg-secondary text-white px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
          >
            Make a Donation
          </a>
        </div>
      </section>
    </div>
  );
}
