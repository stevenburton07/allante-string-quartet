import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';

export default async function AdminDashboard() {
  const supabase = await createClient();

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
        <h1 className="text-3xl font-bold text-primary">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome to the Allante String Quartet admin panel</p>
      </div>

      {/* Stats Grid */}
      <div className="space-y-6 mb-8">
        {/* Concert Stats */}
        <div>
          <h2 className="text-lg font-semibold text-gray-700 mb-3">Concerts</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-500">Total concerts</h3>
              <p className="text-3xl font-bold text-primary mt-2">{totalConcerts || 0}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-500">Published</h3>
              <p className="text-3xl font-bold text-primary mt-2">{publishedConcerts || 0}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-500">Upcoming</h3>
              <p className="text-3xl font-bold text-primary mt-2">{upcomingConcerts || 0}</p>
            </div>
          </div>
        </div>

        {/* Sunset Series Stats */}
        <div>
          <h2 className="text-lg font-semibold text-gray-700 mb-3">Sunset series</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-500">Total events</h3>
              <p className="text-3xl font-bold text-primary mt-2">{totalSunsetEvents || 0}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-500">Published</h3>
              <p className="text-3xl font-bold text-primary mt-2">{publishedSunsetEvents || 0}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-500">Upcoming</h3>
              <p className="text-3xl font-bold text-primary mt-2">{upcomingSunsetEvents || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-primary mb-4">Quick actions</h2>
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

      {/* Coming Soon */}
      <div className="mt-8 bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-primary mb-4">Coming soon</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 border-2 border-gray-300 rounded-lg opacity-50">
            <div className="flex-shrink-0 w-12 h-12 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center mb-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-600">Sunset series ticketing</h3>
            <p className="text-sm text-gray-500">Manage ticket sales and check-ins</p>
          </div>

          <div className="p-4 border-2 border-gray-300 rounded-lg opacity-50">
            <div className="flex-shrink-0 w-12 h-12 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center mb-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-600">Donations dashboard</h3>
            <p className="text-sm text-gray-500">Track donations and donors</p>
          </div>
        </div>
      </div>
    </div>
  );
}
