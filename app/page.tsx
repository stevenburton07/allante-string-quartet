import Image from 'next/image';

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section>
        {/* Hero Image */}
        <div className="relative w-full h-96 md:h-[600px]">
          <Image
            src="/images/hero-background.JPG"
            alt="Allante String Quartet"
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-12">
          <div className="mb-6 flex justify-center">
            <Image
              src="/images/logo.jpg"
              alt="Allante String Quartet"
              width={400}
              height={200}
              className="max-w-full h-auto"
            />
          </div>
          <p className="text-xl md:text-2xl mb-8 text-gray-700">
            Professional string quartet of Utah county
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/hire"
              className="bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-all"
            >
              Hire us
            </a>
            <a
              href="/concerts"
              className="border-2 border-primary text-primary px-8 py-3 rounded-lg font-semibold hover:bg-primary hover:text-white transition-colors"
            >
              View concerts
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
              exceptional chamber music for audiences throughout Utah County and beyond.
              Our repertoire spans from classical masterworks to contemporary compositions.
            </p>
            <a
              href="/about"
              className="inline-block text-secondary hover:text-primary font-semibold transition-colors"
            >
              Learn more about us →
            </a>
          </div>
        </div>
      </section>

      {/* Upcoming Concerts Preview */}
      <section className="py-16 bg-light-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-primary text-center mb-12">
            Upcoming performances
          </h2>
          <div className="text-center">
            <p className="text-gray-600 mb-6">
              Stay tuned for our upcoming concert schedule
            </p>
            <a
              href="/concerts"
              className="inline-block bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-opacity"
            >
              View all concerts
            </a>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6">
            Support our music
          </h2>
          <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
            Your donations help us continue bringing live chamber music to the community
          </p>
          <a
            href="/donate"
            className="inline-block bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-all"
          >
            Make a donation
          </a>
        </div>
      </section>
    </div>
  );
}
