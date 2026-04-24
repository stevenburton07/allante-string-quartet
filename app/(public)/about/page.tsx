import type { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'About Us | Allante String Quartet',
  description: 'Learn about the Allante String Quartet members, our history, and our mission to bring exceptional chamber music to audiences.',
};

export default function AboutPage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative py-16 md:py-24">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/allante.jpg"
            alt="Allante String Quartet"
            fill
            className="object-cover opacity-25"
            style={{ objectPosition: '50% 47.5%' }}
            priority
          />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-primary">
            About us
          </h1>
          <p className="text-xl max-w-3xl mx-auto text-gray-900">
            Meet the musicians behind the quartet
          </p>
        </div>
      </section>

      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Mission Statement */}
        <section className="mb-16">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            {/* Image */}
            <div className="relative w-full h-96 md:h-[500px] rounded-lg overflow-hidden">
              <Image
                src="/images/about.JPG"
                alt="Allante String Quartet"
                fill
                className="object-cover"
              />
            </div>

            {/* Text */}
            <div>
              <h2 className="text-3xl font-bold text-primary mb-6">
                We are the Allante String Quartet
              </h2>
              <div className="text-lg text-gray-700 space-y-4">
                <p>
                  Inspiration for our group title comes from the artistic work "Quartet" by Marc Allante – a painting we feature with permission on every concert program.
                </p>
                <p>
                  The Allante String Quartet was first brought to life by our cellist, Rachel Burton. In the spring of 2013, Rachel was a member of the Utah State Alumni String Quartet in Logan.
                </p>
                <p>
                  She loved the way they brought music to the community by visiting schools, inspiring kids, and giving public performances. But it was a two-hour drive from American Fork every week for rehearsal, which she did while pregnant with her first baby and very sick! She decided to create a similar musical opportunity in Utah Valley.
                </p>
                <p>
                  Rachel dreamed of a professional quality performing group that would give regular concerts for the community. While many string quartets rely on weddings and Christmas parties, this group would focus on the tough stuff, the rockstar literature of the classical world, the stuff that feeds our souls! It wasn't difficult to find colleagues that shared her similar passion, and our ensemble was born.
                </p>
                <p>
                  In addition to some great collaborations with other artists and groups in the Valley, the ASQ has regular coaching sessions with the best teachers in Utah. We work especially closely with the Fry Street Quartet, the quartet in residence at Utah State University.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Quartet Members */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-primary mb-12 text-center">
            Meet the quartet
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Member 1 */}
            <div className="bg-light-gray p-6 rounded-lg">
              <div className="relative w-full aspect-[4/5] mb-4 rounded-lg overflow-hidden">
                <Image
                  src="/images/kristi.JPG"
                  alt="Kristi"
                  fill
                  className="object-cover"
                  style={{ objectPosition: '50% 15%' }}
                />
              </div>
              <div>
                <h3 className="text-2xl font-semibold text-primary mb-1">
                  Kristi Jenkins
                </h3>
                <p className="text-sm text-gray-600 mb-3">Violin</p>
                <p className="text-gray-700">
                  Kristi Jenkins grew up in Ogden, UT. She has a bachelor's in Music Performance from Utah State University and a Master's in Music Performance from the University of Nebraska-Lincoln. While in Nebraska, she worked extensively with several renowned quartets, including the Chiara String Quartet, as well as performing with the Kronberg Ensemble.
                </p>
                <p className="text-gray-700 mt-2">
                  For the past 9 years since moving back to Utah, she has been the concertmaster of the Timpanogos Symphony Orchestra. She also coaches in the summers for the Vivace Orchestra summer camp, as well as maintains her own private studio. Mom of 4 kids, and the newest member of the ASQ family!
                </p>
              </div>
            </div>

            {/* Member 2 */}
            <div className="bg-light-gray p-6 rounded-lg">
              <div className="relative w-full aspect-[4/5] mb-4 rounded-lg overflow-hidden">
                <Image
                  src="/images/bonnie.JPG"
                  alt="Bonnie"
                  fill
                  className="object-cover"
                  style={{ objectPosition: '50% 25%' }}
                />
              </div>
              <div>
                <h3 className="text-2xl font-semibold text-primary mb-1">
                  Bonnie Whetten
                </h3>
                <p className="text-sm text-gray-600 mb-3">Violin</p>
                <p className="text-gray-700">
                  Bonnie Whetten grew up right here in Alpine, UT. She has earned a bachelor's in Music Performance from Brigham Young University. Next was her Master's in Music Performance from the University of Maryland, where she studied with the world-renowned Guarneri String Quartet, and former Juilliard violin professor, Dr. James Stern.
                </p>
                <p className="text-gray-700 mt-2">
                  After graduation, she won a seat with the Lancaster Symphony Orchestra and played for various International Embassy functions around Washington D.C. After moving back to Utah, Bonnie founded the Medley Academy of Music, directing the music school as well as teaching her own thriving violin studio until 2018, when she decided to devote that time to her own children.
                </p>
                <p className="text-gray-700 mt-2">
                  Currently, she plays with the Timpanogos Symphony Orchestra and freelances with the Utah Metropolitan Ballet Orchestra.
                </p>
              </div>
            </div>

            {/* Member 3 */}
            <div className="bg-light-gray p-6 rounded-lg">
              <div className="relative w-full aspect-[4/5] mb-4 rounded-lg overflow-hidden">
                <Image
                  src="/images/alli.JPG"
                  alt="Allison Taylor"
                  fill
                  className="object-cover"
                  style={{ objectPosition: '50% 15%' }}
                />
              </div>
              <div>
                <h3 className="text-2xl font-semibold text-primary mb-1">
                  Allison Taylor
                </h3>
                <p className="text-sm text-gray-600 mb-3">Viola</p>
                <p className="text-gray-700">
                  Allison Taylor is from Hillsboro, Oregon. Alli has a close affiliation with Brigham Young University – she has earned her bachelor's and master's degrees in Music Education from BYU. She is also adjunct faculty there, serving as the Director of BYU's New Horizons Orchestra. In this setting she fulfills her passion for teaching by empowering older adults to learn something new: a musical instrument!
                </p>
                <p className="text-gray-700 mt-2">
                  Alli maintains her own private studio of 15 students and freelances regularly with the Utah Metropolitan Ballet Orchestra. She and her husband, also a music educator, love to share music in their marriage and family.
                </p>
              </div>
            </div>

            {/* Member 4 */}
            <div className="bg-light-gray p-6 rounded-lg">
              <div className="relative w-full aspect-[4/5] mb-4 rounded-lg overflow-hidden">
                <Image
                  src="/images/rachel.jpeg"
                  alt="Rachel Burton"
                  fill
                  className="object-cover"
                  style={{ objectPosition: '50% 15%' }}
                />
              </div>
              <div>
                <h3 className="text-2xl font-semibold text-primary mb-1">
                  Rachel Burton
                </h3>
                <p className="text-sm text-gray-600 mb-3">Cello</p>
                <p className="text-gray-700">
                  Rachel Burton is a cellist, educator, and performer based in Highland, Utah. She holds a Bachelor of Music in Performance from Utah State University studying under Anne Francis Bayless of the Fry Street Quartet. She also studied with Pegsoon Whang of the Utah Symphony during her graduate studies at the University of Utah.
                </p>
                <p className="text-gray-700 mt-2">
                  Rachel performs with the Orchestra at Temple Square, broadcast weekly on Music and the Spoken Word, and travels internationally with the Tabernacle Choir.
                </p>
                <p className="text-gray-700 mt-2">
                  As a certified Suzuki cello instructor through Book 8 — trained under master pedagogues Pam Devenport and David Evenchick through the Intermountain Suzuki String Institute — Rachel directs the Burton Cello Studio, where she teaches many students that have gone on to study music in college and earn scholarships.
                </p>
                <p className="text-gray-700 mt-2">
                  Rachel is regularly engaged as a soloist and ensemble performer throughout Utah, and serves as an adjudicator for federations, festivals, and solo competitions across the state.
                </p>
                <p className="text-gray-700 mt-2">
                  Outside the studio, she is the mother of three and wife to Steven — self-proclaimed number one fan of the ASQ. Of all her musical pursuits, performing with the Allante String Quartet remains her most cherished.
                </p>
              </div>
            </div>
          </div>
        </section>
        </div>
      </div>
    </div>
  );
}
