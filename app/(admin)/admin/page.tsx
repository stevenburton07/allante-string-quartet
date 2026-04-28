import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import QrCleanupButton from '@/components/admin/QrCleanupButton';

// Fun welcome messages - add more anytime!
const welcomeMessages = [
  "The Zelda music is calling!",
  "Ready to make some beautiful music happen? 🎻",
  "Let's orchestrate something amazing today!",
  "Time to fine-tune your events! 🎵",
  "Bringing harmony to your admin tasks ✨",
  "Let's strike the right chord with your audience! 🎼",
  "Managing concerts has never sounded so good!",
  "Ready to compose your next masterpiece event?",
  "Let's keep the music flowing! 🎶",
  "Time to conduct some admin magic!",
  "Orchestrating your day, one task at a time 🗓️",
  "Your schedule is music to our ears 👂",
  "Keeping everything in tune behind the scenes 🎛️",
  "A well-composed day starts here 📝",
  "Every great performance starts with a plan 📋",
  "Setting the tempo for a productive day ⏱️",
  "All the right notes, all in one place 🗂️",
  "Making admin work feel like a symphony 🎼",
  "Conducting business, beautifully 🪄",
  "Your day, perfectly arranged 💐",
  "Prelude to a great day ☀️",
  "Let's make today a masterpiece 🎨",
  "Ready to take it from the top? 🔝",
  "Bow down to a productive day 🎻",
  "Stay composed, you've got this 💪",
  "Pulling strings behind the scenes 🕹️",
  "No need to fret — everything's in order ✅",
  "Cello, is it me you're looking for? 👀",
  "Bach at it again! 🔄",
  "Suite dashboard you've got here 😎",
  "Viola! Your dashboard awaits 🪻",
  "Four real, let's do this 🤘",
];

export default async function AdminDashboard() {
  const supabase = await createClient();

  // Pick a random welcome message
  const randomMessage = welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)];

  // Get concert stats
  const { count: totalConcerts } = await supabase
    .from('concerts')
    .select('*', { count: 'exact', head: true });

  const { count: publishedConcerts } = await supabase
    .from('concerts')
    .select('*', { count: 'exact', head: true })
    .eq('is_published', true);

  const { count: upcomingConcerts } = await supabase
    .from('concerts')
    .select('*', { count: 'exact', head: true })
    .eq('is_published', true)
    .gte('date', new Date().toISOString());

  // Get sunset series stats
  const { count: totalSunsetEvents } = await supabase
    .from('sunset_events')
    .select('*', { count: 'exact', head: true });

  const { count: publishedSunsetEvents } = await supabase
    .from('sunset_events')
    .select('*', { count: 'exact', head: true })
    .eq('published', true);

  const { count: upcomingSunsetEvents } = await supabase
    .from('sunset_events')
    .select('*', { count: 'exact', head: true })
    .eq('published', true)
    .gte('event_date', new Date().toISOString());

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-primary">Dashboard</h1>
        <p className="text-gray-600 mt-2">{randomMessage}</p>
      </div>

      {/* Stats Grid */}
      <div className="space-y-6 mb-8">
        {/* Concert Stats */}
        <div>
          <h2 className="text-lg font-semibold text-gray-700 mb-3">Concerts</h2>
          <div className="grid grid-cols-3 gap-3 sm:gap-6">
            <div className="bg-white rounded-lg shadow p-4 sm:p-6 flex flex-col justify-between min-h-[100px]">
              <h3 className="text-sm font-medium text-gray-500">Upcoming</h3>
              <p className="text-3xl font-bold text-primary mt-2">{upcomingConcerts || 0}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4 sm:p-6 flex flex-col justify-between min-h-[100px]">
              <h3 className="text-sm font-medium text-gray-500">Published</h3>
              <p className="text-3xl font-bold text-primary mt-2">{publishedConcerts || 0}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4 sm:p-6 flex flex-col justify-between min-h-[100px]">
              <h3 className="text-sm font-medium text-gray-500">Total concerts</h3>
              <p className="text-3xl font-bold text-primary mt-2">{totalConcerts || 0}</p>
            </div>
          </div>
        </div>

        {/* Sunset Series Stats */}
        <div>
          <h2 className="text-lg font-semibold text-gray-700 mb-3">Sunset series</h2>
          <div className="grid grid-cols-3 gap-3 sm:gap-6">
            <div className="bg-white rounded-lg shadow p-4 sm:p-6 flex flex-col justify-between min-h-[100px]">
              <h3 className="text-sm font-medium text-gray-500">Upcoming</h3>
              <p className="text-3xl font-bold text-primary mt-2">{upcomingSunsetEvents || 0}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4 sm:p-6 flex flex-col justify-between min-h-[100px]">
              <h3 className="text-sm font-medium text-gray-500">Published</h3>
              <p className="text-3xl font-bold text-primary mt-2">{publishedSunsetEvents || 0}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4 sm:p-6 flex flex-col justify-between min-h-[100px]">
              <h3 className="text-sm font-medium text-gray-500">Total events</h3>
              <p className="text-3xl font-bold text-primary mt-2">{totalSunsetEvents || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-bold text-primary mb-4">Quick actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            href="/admin/concerts/new"
            className="flex items-center p-4 border-2 border-primary rounded-lg hover:bg-primary/10 transition-colors"
          >
            <div className="flex-shrink-0 w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center mr-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-primary">Add new concert</h3>
              <p className="text-sm text-gray-600">Create a new concert event</p>
            </div>
          </Link>

          <Link
            href="/admin/sunset-series/new"
            className="flex items-center p-4 border-2 border-secondary rounded-lg hover:bg-secondary/10 transition-colors"
          >
            <div className="flex-shrink-0 w-12 h-12 bg-secondary text-white rounded-full flex items-center justify-center mr-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-secondary">Add sunset series event</h3>
              <p className="text-sm text-gray-600">Create a new outdoor event</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Maintenance */}
      <div className="bg-white rounded-lg shadow p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-bold text-primary mb-2">Maintenance</h2>
        <p className="text-sm text-gray-600 mb-4">
          Ticket QR codes are stored for 30 days after an event ends, then can be cleared to free up storage.
        </p>
        <QrCleanupButton />
      </div>
    </div>
  );
}
