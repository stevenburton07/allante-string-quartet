'use client';

import { useEffect, useState } from 'react';
import CopyEmailsButton from '@/components/admin/CopyEmailsButton';

interface NewsletterSubscriber {
  id: string;
  name: string;
  email: string;
  status: 'active' | 'unsubscribed';
  subscribed_at: string;
  created_at: string;
}

export default function NewsletterAdminPage() {
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'active' | 'unsubscribed'>('all');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const fetchSubscribers = async () => {
    try {
      const response = await fetch('/api/admin/newsletter');
      if (!response.ok) {
        // Only show error if it's not a 404 or table doesn't exist
        if (response.status !== 404) {
          throw new Error('Failed to fetch subscribers');
        }
      }
      const data = await response.json();
      setSubscribers(data || []);
    } catch (error) {
      console.error('Error fetching subscribers:', error);
      setMessage({ type: 'error', text: 'Failed to load subscribers' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this subscriber?')) return;

    try {
      const response = await fetch(`/api/admin/newsletter/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete subscriber');

      setMessage({ type: 'success', text: 'Subscriber deleted successfully' });
      fetchSubscribers();
    } catch (error) {
      console.error('Error deleting subscriber:', error);
      setMessage({ type: 'error', text: 'Failed to delete subscriber' });
    }
  };

  const allEmails = subscribers.map((sub) => sub.email);
  const activeEmails = subscribers
    .filter((sub) => sub.status === 'active')
    .map((sub) => sub.email);

  const filteredSubscribers = subscribers.filter((sub) => {
    if (filter === 'all') return true;
    return sub.status === filter;
  });

  const stats = {
    total: subscribers.length,
    active: subscribers.filter((s) => s.status === 'active').length,
    unsubscribed: subscribers.filter((s) => s.status === 'unsubscribed').length,
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-light-gray py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-600">Loading subscribers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-light-gray">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-primary mb-2">Newsletter subscribers</h1>
          <p className="text-gray-600">Manage your newsletter subscriber list</p>
        </div>

        {/* Message */}
        {message && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              message.type === 'success'
                ? 'bg-green-50 text-green-800 border border-green-200'
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 sm:gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-4 sm:p-6">
            <h3 className="text-xs sm:text-sm font-medium text-gray-500">Total</h3>
            <p className="text-2xl sm:text-3xl font-bold text-primary mt-2">{stats.total}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 sm:p-6">
            <h3 className="text-xs sm:text-sm font-medium text-gray-500">Active</h3>
            <p className="text-2xl sm:text-3xl font-bold text-primary mt-2">{stats.active}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 sm:p-6">
            <h3 className="text-xs sm:text-sm font-medium text-gray-500">Unsubscribed</h3>
            <p className="text-2xl sm:text-3xl font-bold text-primary mt-2">{stats.unsubscribed}</p>
          </div>
        </div>

        {/* Copy Emails */}
        <div className="flex items-center justify-end gap-3 mb-6">
          <CopyEmailsButton emails={allEmails} label="Copy All Emails" variant="secondary" />
          <CopyEmailsButton emails={activeEmails} label="Copy Active Emails" variant="primary" />
        </div>

        {/* Filter */}
        <div className="flex gap-2 flex-wrap mb-6">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'all'
                ? 'bg-primary text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            All ({stats.total})
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'active'
                ? 'bg-primary text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Active ({stats.active})
          </button>
          <button
            onClick={() => setFilter('unsubscribed')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'unsubscribed'
                ? 'bg-primary text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Unsubscribed ({stats.unsubscribed})
          </button>
        </div>

        {/* Subscribers Table */}
        {filteredSubscribers.length === 0 ? (
          <div className="bg-white rounded-lg p-8 text-center">
            <p className="text-gray-600">No subscribers found</p>
          </div>
        ) : (
          <>
            {/* Mobile card view */}
            <div className="sm:hidden space-y-3">
              {filteredSubscribers.map((subscriber) => (
                <div key={subscriber.id} className="bg-white rounded-lg shadow p-4">
                  <div className="flex justify-between items-start gap-2">
                    <div className="min-w-0">
                      <p className="font-medium text-gray-900">{subscriber.name}</p>
                      <p className="text-sm text-gray-600 truncate">{subscriber.email}</p>
                    </div>
                    <span
                      className={`px-2 py-0.5 text-xs font-semibold rounded-full whitespace-nowrap ${
                        subscriber.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {subscriber.status.charAt(0).toUpperCase() + subscriber.status.slice(1)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mt-3">
                    <p className="text-xs text-gray-500">
                      Subscribed {new Date(subscriber.subscribed_at).toLocaleDateString()}
                    </p>
                    <button
                      onClick={() => handleDelete(subscriber.id)}
                      className="text-red-600 bg-transparent hover:bg-red-50 font-semibold rounded-lg transition-all px-3 py-2 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop table view */}
            <div className="hidden sm:block bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 tracking-wider">Subscribed</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredSubscribers.map((subscriber) => (
                    <tr key={subscriber.id}>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{subscriber.name}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{subscriber.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            subscriber.status === 'active'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {subscriber.status.charAt(0).toUpperCase() + subscriber.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {new Date(subscriber.subscribed_at).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleDelete(subscriber.id)}
                          className="text-red-600 bg-transparent hover:bg-red-50 font-semibold rounded-lg transition-all px-3 py-1.5 text-sm"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
